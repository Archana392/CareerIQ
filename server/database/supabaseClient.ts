import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Dynamic credential resolver (supports both server-side and VITE prefixes)
function getEnvCredentials() {
  const url = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '').trim();
  return { url, key };
}

let supabaseClient: SupabaseClient | null = null;
let lastUsedUrl = '';
let lastUsedKey = '';
let connectionStatus: { tested: boolean; connected: boolean; error?: string } = {
  tested: false,
  connected: false
};

export function isSupabaseConfigured(): boolean {
  const { url, key } = getEnvCredentials();
  if (!url || !key) return false;
  if (!url.startsWith('http://') && !url.startsWith('https://')) return false;
  if (url.includes('your-project-id') || url.includes('placeholder')) return false;
  if (key.includes('your-anon-key') || key.includes('your-service-role-key') || key.includes('...')) return false;
  return true;
}

export function getSupabaseServerClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  const { url, key } = getEnvCredentials();

  // Recreate client if credentials changed at runtime
  if (!supabaseClient || lastUsedUrl !== url || lastUsedKey !== key) {
    try {
      supabaseClient = createClient(url, key, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      });
      lastUsedUrl = url;
      lastUsedKey = key;
    } catch (err: any) {
      console.warn('Failed to initialize Supabase client:', err.message);
      return null;
    }
  }
  return supabaseClient;
}

export async function testSupabaseConnection(): Promise<{ connected: boolean; message: string; details?: any }> {
  if (!isSupabaseConfigured()) {
    return {
      connected: false,
      message: 'Supabase credentials not set in environment variables (SUPABASE_URL and SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY).'
    };
  }

  const client = getSupabaseServerClient();
  if (!client) {
    return {
      connected: false,
      message: 'Unable to initialize Supabase client.'
    };
  }

  try {
    // Attempt a light ping against profiles or target_roles table
    const { error } = await client.from('profiles').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      connectionStatus = { tested: true, connected: false, error: error.message };
      return {
        connected: false,
        message: `Supabase reached, but table check returned: ${error.message}. Please ensure schema.sql has been run.`,
        details: error
      };
    }
    connectionStatus = { tested: true, connected: true };
    return {
      connected: true,
      message: 'Successfully connected to Supabase PostgreSQL!'
    };
  } catch (err: any) {
    connectionStatus = { tested: true, connected: false, error: err.message };
    return {
      connected: false,
      message: `Failed to connect to Supabase: ${err.message}`
    };
  }
}

// --------------------------------------------------------------------
// Incremental Supabase Entity Persistence Helpers
// --------------------------------------------------------------------

export async function syncProfileToSupabase(profile: any): Promise<boolean> {
  const client = getSupabaseServerClient();
  if (!client || !profile) return false;

  try {
    const payload = {
      email: profile.email,
      full_name: profile.full_name || profile.name || 'Candidate',
      account_role: profile.account_type || profile.role || 'student',
      target_role: profile.target_role || null,
      experience_level: profile.experience_level || 'entry',
      education: profile.education || null,
      bio: profile.bio || null,
      company_name: profile.company_name || null,
      resume_uploaded: Boolean(profile.resume_uploaded),
      resume_filename: profile.resume_filename || null,
      readiness_score: profile.readiness_score || 0,
      updated_at: new Date().toISOString()
    };

    const { error } = await client
      .from('profiles')
      .upsert(payload, { onConflict: 'email' });

    if (error) {
      console.warn('Supabase profile sync warning:', error.message);
      return false;
    }
    return true;
  } catch (e: any) {
    console.warn('Supabase profile sync error:', e.message);
    return false;
  }
}

export async function syncResumeToSupabase(userId: string, resume: any, fileBuffer?: Buffer): Promise<string | null> {
  const client = getSupabaseServerClient();
  if (!client || !resume) return null;

  try {
    let storagePath: string | null = null;

    // If file buffer provided, upload to private 'resumes' bucket
    if (fileBuffer && resume.filename) {
      const cleanFileName = `${userId}/${Date.now()}_${resume.filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { data: uploadData, error: uploadErr } = await client.storage
        .from('resumes')
        .upload(cleanFileName, fileBuffer, {
          contentType: resume.file_type || 'application/pdf',
          upsert: true
        });

      if (!uploadErr && uploadData) {
        storagePath = uploadData.path;
      }
    }

    const { data, error } = await client
      .from('resumes')
      .insert({
        owner_id: userId,
        storage_path: storagePath,
        filename: resume.filename,
        file_type: resume.file_type || 'application/pdf',
        file_size: resume.file_size || 0,
        extracted_text: resume.raw_text || resume.extracted_text || '',
        parsed_skills: resume.extracted_skills || [],
        sections: resume.sections || {}
      })
      .select('id')
      .single();

    if (error) {
      console.warn('Supabase resume insert warning:', error.message);
      return null;
    }
    return data?.id || null;
  } catch (e: any) {
    console.warn('Supabase resume sync error:', e.message);
    return null;
  }
}

export async function syncResumeAnalysisToSupabase(userId: string, resumeId: string | null, analysis: any): Promise<boolean> {
  const client = getSupabaseServerClient();
  if (!client || !analysis) return false;

  try {
    const { error } = await client
      .from('resume_analyses')
      .insert({
        user_id: userId,
        resume_id: resumeId,
        target_role: analysis.target_role,
        ats_score: analysis.ats_score || analysis.overall_score || 0,
        strengths: analysis.strengths || [],
        weaknesses: analysis.weaknesses || [],
        missing_keywords: analysis.missing_keywords || [],
        skill_analysis: analysis.skill_analysis || {},
        role_alignment: analysis.role_alignment || {},
        recommendations: analysis.recommendations || [],
        summary: analysis.summary || ''
      });

    if (error) {
      console.warn('Supabase resume_analyses sync warning:', error.message);
      return false;
    }
    return true;
  } catch (e: any) {
    console.warn('Supabase resume_analyses sync error:', e.message);
    return false;
  }
}

export async function syncRoadmapToSupabase(userId: string, targetRole: string, roadmap: any): Promise<boolean> {
  const client = getSupabaseServerClient();
  if (!client || !roadmap) return false;

  try {
    const { error } = await client
      .from('career_roadmaps')
      .upsert({
        user_id: userId,
        target_role: targetRole,
        roadmap_stages: roadmap.stages || roadmap.steps || [],
        progress: roadmap.progress || 0,
        status: 'active',
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,target_role' });

    if (error) {
      console.warn('Supabase career_roadmaps sync warning:', error.message);
      return false;
    }
    return true;
  } catch (e: any) {
    console.warn('Supabase career_roadmaps sync error:', e.message);
    return false;
  }
}

export async function syncSkillGapsToSupabase(userId: string, targetRole: string, skillGapData: any): Promise<boolean> {
  const client = getSupabaseServerClient();
  if (!client || !skillGapData) return false;

  try {
    const { error } = await client
      .from('skill_gaps')
      .upsert({
        user_id: userId,
        target_role: targetRole,
        existing_skills: skillGapData.existing_skills || [],
        missing_skills: skillGapData.missing_skills || [],
        skill_coverage: skillGapData.skill_coverage || 0,
        recommendations: skillGapData.recommendations || [],
        calculated_at: new Date().toISOString()
      }, { onConflict: 'user_id,target_role' });

    if (error) {
      console.warn('Supabase skill_gaps sync warning:', error.message);
      return false;
    }
    return true;
  } catch (e: any) {
    console.warn('Supabase skill_gaps sync error:', e.message);
    return false;
  }
}

export async function syncUserSkillsToSupabase(userId: string, skills: string[]): Promise<boolean> {
  const client = getSupabaseServerClient();
  if (!client || !skills || skills.length === 0) return false;

  try {
    const records = skills.map(skill => ({
      user_id: userId,
      skill_name: skill,
      proficiency: 'Intermediate',
      evidence_source: 'resume_extraction',
      verified: true,
      last_updated: new Date().toISOString()
    }));

    const { error } = await client
      .from('user_skills')
      .upsert(records, { onConflict: 'user_id,skill_name' });

    if (error) {
      console.warn('Supabase user_skills sync warning:', error.message);
      return false;
    }
    return true;
  } catch (e: any) {
    console.warn('Supabase user_skills sync error:', e.message);
    return false;
  }
}

export async function syncLessonProgressToSupabase(userId: string, lessonId: string, completed: boolean): Promise<boolean> {
  const client = getSupabaseServerClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('lesson_progress')
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        completed,
        completion_date: new Date().toISOString()
      }, { onConflict: 'user_id,lesson_id' });

    if (error) {
      console.warn('Supabase lesson_progress sync warning:', error.message);
      return false;
    }
    return true;
  } catch (e: any) {
    console.warn('Supabase lesson_progress sync error:', e.message);
    return false;
  }
}

export async function syncAssessmentAttemptToSupabase(userId: string, assessmentId: string, score: number, passed: boolean, answers: any): Promise<boolean> {
  const client = getSupabaseServerClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('assessment_attempts')
      .insert({
        user_id: userId,
        assessment_id: assessmentId,
        score,
        passed,
        answers,
        attempt_date: new Date().toISOString()
      });

    if (error) {
      console.warn('Supabase assessment_attempts sync warning:', error.message);
      return false;
    }
    return true;
  } catch (e: any) {
    console.warn('Supabase assessment_attempts sync error:', e.message);
    return false;
  }
}
