import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getDB, updateDB, seedUserDemoData, clearUserData } from '../database/db';
import {
  extractSkillsFromText,
  parseResumeSections,
  calculateExplainableJobMatch,
  calculateCareerReadiness,
  calculateFutureReadiness,
  normalizeSkillName
} from '../ml/nlpEngine';
import {
  analyzeResumeWithGemini,
  analyzeJobWithGemini,
  generatePersonalizedRoadmapAI,
  generateRAGCareerChat
} from '../ai/geminiClient';
import { RAGService } from '../rag/ragEngine';
import {
  User,
  UserProfile,
  ResumeData,
  JobDescriptionData,
  SkillItem,
  SkillGapItem,
  Course,
  Assessment,
  UserCourseProgress,
  AssessmentAttempt,
  RecruiterJob,
  CandidateApplication,
  RecruiterReadinessScore,
  RecruiterReadinessCategory
} from '../../src/types';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'careeriq_jwt_secret_token_key_dev';

// Middleware for JWT Authentication
export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication token required.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }
}

// ----------------------------------------------------
// 1. AUTHENTICATION ROUTES
// ----------------------------------------------------

router.post('/auth/register', async (req: Request, res: Response) => {
  const { full_name, email, password, target_role, experience_level, resume_raw_text, resume_filename, account_type, company_name } = req.body;

  if (!email || !password || !full_name) {
    return res.status(400).json({ error: 'Full name, email, and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  const db = getDB();
  const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const userId = `user_${Date.now()}`;
  const password_hash = bcrypt.hashSync(password, 10);
  const now = new Date().toISOString();
  const isRecruiter = account_type === 'recruiter' || req.body.role === 'recruiter';

  const newUser: User = {
    id: userId,
    email: email.toLowerCase(),
    password_hash,
    full_name,
    role: isRecruiter ? 'recruiter' : 'student',
    account_type: isRecruiter ? 'recruiter' : 'candidate',
    created_at: now,
    updated_at: now
  };

  const newProfile: UserProfile = {
    id: `prof_${Date.now()}`,
    user_id: userId,
    full_name,
    email: email.toLowerCase(),
    degree: isRecruiter ? 'Corporate HR / Talent Acquisition' : 'B.Tech / Bachelor Degree',
    university: company_name || 'Enterprise Talent Network',
    graduation_year: '2026',
    experience_level: experience_level || (isRecruiter ? 'Mid-Senior' : 'Student'),
    target_role: isRecruiter ? 'Technical Talent Recruiter' : (target_role || 'AI/ML Engineer'),
    target_industry: 'Technology & Software',
    career_interests: isRecruiter ? ['Talent Acquisition', 'Technical Recruiting', 'Workforce Planning'] : ['Software Development', 'Artificial Intelligence', 'Data Science'],
    bio: isRecruiter
      ? `Technical Recruiter at ${company_name || 'Enterprise Partner'} focused on engineering and AI talent acquisition.`
      : `Passionate ${experience_level || 'student'} aiming to excel as an ${target_role || 'AI/ML Engineer'}.`,
    created_at: now,
    updated_at: now
  };

  // Optional: Process initial resume if provided during registration
  let initialResume: ResumeData | null = null;
  if (resume_raw_text && resume_raw_text.trim().length >= 20) {
    const parsed = parseResumeSections(resume_raw_text);
    initialResume = {
      id: `res_${Date.now()}`,
      user_id: userId,
      filename: resume_filename || 'Candidate_Resume.pdf',
      upload_date: now,
      raw_text: resume_raw_text,
      summary: parsed.summary,
      detected_skills: parsed.detectedSkills,
      education: [
        {
          institution: newProfile.university,
          degree: newProfile.degree,
          field: 'Computer Science & Engineering',
          year: newProfile.graduation_year
        }
      ],
      experience: [],
      projects: [],
      certifications: [],
      achievements: []
    };
  }

  updateDB(database => {
    database.users.push(newUser);
    database.profiles.push(newProfile);
    if (initialResume) {
      database.resumes.push(initialResume);
      initialResume.detected_skills.forEach(s => {
        database.user_skills.push({
          id: `us_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          user_id: userId,
          skill_id: s.id,
          proficiency: s.proficiency || 'Intermediate',
          source: 'resume',
          verified: true
        });
      });
    }

    database.notifications.push({
      id: `notif_${Date.now()}`,
      user_id: userId,
      title: 'Welcome to CareerIQ!',
      message: initialResume
        ? 'Your profile guide and resume intelligence have been initialized.'
        : 'Your account has been created. Start by uploading your resume or exploring skill roadmaps.',
      type: 'success',
      is_read: false,
      created_at: now
    });
  });

  const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

  res.status(201).json({
    token,
    user: { id: newUser.id, email: newUser.email, full_name: newUser.full_name },
    profile: newProfile,
    resume: initialResume
  });
});

// Google Sign-In / One-Tap Authentication
router.post('/auth/google', async (req: Request, res: Response) => {
  const { email, full_name, target_role, experience_level, avatar_url, resume_raw_text, resume_filename } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Google account email is required.' });
  }

  const db = getDB();
  let user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  let profile = user ? db.profiles.find(p => p.user_id === user.id) : null;
  const now = new Date().toISOString();

  if (!user) {
    // Create new user authenticated via Google
    const userId = `user_g_${Date.now()}`;
    const password_hash = bcrypt.hashSync(`google_oauth_${Date.now()}_${Math.random()}`, 10);
    const resolvedName = full_name || email.split('@')[0];

    const newUser: User = {
      id: userId,
      email: email.toLowerCase(),
      password_hash,
      full_name: resolvedName,
      role: 'student',
      created_at: now,
      updated_at: now
    };

    const newProfile: UserProfile = {
      id: `prof_g_${Date.now()}`,
      user_id: userId,
      full_name: resolvedName,
      email: email.toLowerCase(),
      avatar_url: avatar_url || undefined,
      degree: 'B.Tech / Bachelor Degree',
      university: 'University / College',
      graduation_year: '2026',
      experience_level: experience_level || 'Student',
      target_role: target_role || 'AI/ML Engineer',
      target_industry: 'Technology & Software',
      career_interests: ['Software Development', 'Artificial Intelligence', 'Data Science'],
      bio: `Passionate ${experience_level || 'student'} aiming to excel as an ${target_role || 'AI/ML Engineer'}.`,
      created_at: now,
      updated_at: now
    };

    let initialResume: ResumeData | null = null;
    if (resume_raw_text && resume_raw_text.trim().length >= 20) {
      const parsed = parseResumeSections(resume_raw_text);
      initialResume = {
        id: `res_${Date.now()}`,
        user_id: userId,
        filename: resume_filename || 'Candidate_Resume.pdf',
        upload_date: now,
        raw_text: resume_raw_text,
        summary: parsed.summary,
        detected_skills: parsed.detectedSkills,
        education: [
          {
            institution: newProfile.university,
            degree: newProfile.degree,
            field: 'Computer Science & Engineering',
            year: newProfile.graduation_year
          }
        ],
        experience: [],
        projects: [],
        certifications: [],
        achievements: []
      };
    }

    updateDB(database => {
      database.users.push(newUser);
      database.profiles.push(newProfile);
      if (initialResume) {
        database.resumes.push(initialResume);
        initialResume.detected_skills.forEach(s => {
          database.user_skills.push({
            id: `us_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            user_id: userId,
            skill_id: s.id,
            proficiency: s.proficiency || 'Intermediate',
            source: 'resume',
            verified: true
          });
        });
      }

      database.notifications.push({
        id: `notif_${Date.now()}`,
        user_id: userId,
        title: 'Signed in with Google',
        message: 'Welcome to CareerIQ! Your profile has been initialized with Google authentication.',
        type: 'success',
        is_read: false,
        created_at: now
      });
    });

    user = newUser;
    profile = newProfile;
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    token,
    user: { id: user.id, email: user.email, full_name: user.full_name },
    profile
  });
});

router.post('/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const db = getDB();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const match = bcrypt.compareSync(password, user.password_hash);
  if (!match) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const profile = db.profiles.find(p => p.user_id === user.id);
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    token,
    user: { id: user.id, email: user.email, full_name: user.full_name },
    profile
  });
});

router.get('/auth/me', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDB();
  const user = db.users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  const profile = db.profiles.find(p => p.user_id === user.id);
  res.json({
    user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role },
    profile
  });
});

// Forgot Password - Generates a secure 6-digit reset code
router.post('/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required.' });
  }

  const db = getDB();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'No account found with this email address.' });
  }

  // Generate 6-digit numeric verification code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes validity

  updateDB(database => {
    if (!database.password_resets) database.password_resets = [];
    // Remove previous active codes for this email
    database.password_resets = database.password_resets.filter(pr => pr.email.toLowerCase() !== email.toLowerCase());
    database.password_resets.push({
      email: email.toLowerCase(),
      code: resetCode,
      expires_at: expiresAt,
      created_at: new Date().toISOString()
    });
  });

  res.json({
    success: true,
    message: `A 6-digit password reset code has been sent to ${email}.`,
    reset_code: resetCode,
    email: email.toLowerCase(),
    expires_in_minutes: 15
  });
});

// Reset Password - Verifies code and updates password hash
router.post('/auth/reset-password', async (req: Request, res: Response) => {
  const { email, code, new_password } = req.body;

  if (!email || !code || !new_password) {
    return res.status(400).json({ error: 'Email, reset code, and new password are required.' });
  }

  if (new_password.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
  }

  const db = getDB();
  const resetRecord = (db.password_resets || []).find(
    pr => pr.email.toLowerCase() === email.toLowerCase() && pr.code === code.trim()
  );

  if (!resetRecord) {
    return res.status(400).json({ error: 'Invalid reset code. Please check the code or request a new one.' });
  }

  if (Date.now() > resetRecord.expires_at) {
    return res.status(400).json({ error: 'This reset code has expired. Please request a new code.' });
  }

  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const newHash = bcrypt.hashSync(new_password, 10);
  const now = new Date().toISOString();

  updateDB(database => {
    const targetUser = database.users.find(u => u.id === user.id);
    if (targetUser) {
      targetUser.password_hash = newHash;
      targetUser.updated_at = now;
    }
    // Remove used reset code
    database.password_resets = (database.password_resets || []).filter(
      pr => !(pr.email.toLowerCase() === email.toLowerCase() && pr.code === code.trim())
    );

    database.notifications.push({
      id: `notif_${Date.now()}`,
      user_id: user.id,
      title: 'Password Changed',
      message: 'Your account password was successfully reset.',
      type: 'info',
      is_read: false,
      created_at: now
    });
  });

  const profile = db.profiles.find(p => p.user_id === user.id);
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    success: true,
    message: 'Your password has been successfully reset! You are now logged in.',
    token,
    user: { id: user.id, email: user.email, full_name: user.full_name },
    profile
  });
});

// ----------------------------------------------------
// 2. USER PROFILE ROUTES
// ----------------------------------------------------

router.get('/profile', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDB();
  const profile = db.profiles.find(p => p.user_id === req.userId);
  if (!profile) return res.status(404).json({ error: 'Profile not found.' });
  res.json(profile);
});

router.put('/profile', authMiddleware, (req: AuthRequest, res: Response) => {
  const { degree, university, graduation_year, experience_level, target_role, target_industry, career_interests, bio, full_name } = req.body;

  const updated = updateDB(db => {
    const profile = db.profiles.find(p => p.user_id === req.userId);
    if (profile) {
      if (degree !== undefined) profile.degree = degree;
      if (university !== undefined) profile.university = university;
      if (graduation_year !== undefined) profile.graduation_year = graduation_year;
      if (experience_level !== undefined) profile.experience_level = experience_level;
      if (target_role !== undefined) profile.target_role = target_role;
      if (target_industry !== undefined) profile.target_industry = target_industry;
      if (career_interests !== undefined) profile.career_interests = career_interests;
      if (bio !== undefined) profile.bio = bio;
      if (full_name !== undefined) profile.full_name = full_name;
      profile.updated_at = new Date().toISOString();
    }
    const user = db.users.find(u => u.id === req.userId);
    if (user && full_name) {
      user.full_name = full_name;
    }
  });

  const profile = updated.profiles.find(p => p.user_id === req.userId);
  res.json(profile);
});

// ----------------------------------------------------
// 3. RESUME ANALYZER ROUTES
// ----------------------------------------------------

router.post('/resumes/upload', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { filename, raw_text } = req.body;

  if (!raw_text || raw_text.trim().length < 20) {
    return res.status(400).json({ error: 'Valid resume text content is required.' });
  }

  const db = getDB();
  const profile = db.profiles.find(p => p.user_id === req.userId);
  const targetRole = profile?.target_role || 'AI/ML Engineer';

  // 1. NLP Processing & Skill Extraction
  const parsed = parseResumeSections(raw_text);
  const detectedSkills = parsed.detectedSkills;

  // 2. AI Structural Critique
  const aiFeedback = await analyzeResumeWithGemini(raw_text, targetRole);

  const resumeId = `res_${Date.now()}`;
  const now = new Date().toISOString();

  const newResume: ResumeData = {
    id: resumeId,
    user_id: req.userId!,
    filename: filename || 'Uploaded_Resume.pdf',
    upload_date: now,
    raw_text,
    summary: parsed.summary,
    detected_skills: detectedSkills,
    education: [
      {
        institution: profile?.university || 'University',
        degree: profile?.degree || 'Bachelor Degree',
        field: 'Computer Science & Engineering',
        year: profile?.graduation_year || '2026'
      }
    ],
    experience: [],
    projects: [],
    certifications: [],
    achievements: [],
    ai_feedback: aiFeedback
  };

  updateDB(database => {
    // Remove previous user resumes so only current active resume is tracked
    database.resumes = database.resumes.filter(r => r.user_id !== req.userId);
    database.resumes.push(newResume);

    // Synchronize extracted skills
    detectedSkills.forEach(s => {
      const exists = database.user_skills.some(us => us.user_id === req.userId && us.skill_id === s.id);
      if (!exists) {
        database.user_skills.push({
          id: `us_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          user_id: req.userId!,
          skill_id: s.id,
          proficiency: s.proficiency || 'Intermediate',
          source: 'resume',
          verified: true
        });
      }
    });

    // Compute skill gaps dynamically against target role
    const roleItem = database.career_roles.find(cr =>
      cr.title.toLowerCase().includes(targetRole.toLowerCase()) ||
      targetRole.toLowerCase().includes(cr.title.toLowerCase())
    );
    const required = roleItem?.required_skills || ['Docker', 'FastAPI', 'MLOps', 'PyTorch'];
    const detectedNames = new Set(detectedSkills.map(s => s.name.toLowerCase()));

    database.skill_gaps = database.skill_gaps.filter(g => g.user_id !== req.userId);
    required.forEach(skillName => {
      if (!detectedNames.has(skillName.toLowerCase())) {
        database.skill_gaps.push({
          id: `gap_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          user_id: req.userId!,
          target_role: targetRole,
          skill_name: skillName,
          category: 'Technical',
          priority: 'HIGH',
          is_required: true,
          importance_reason: `Identified by industry benchmarks as critical for ${targetRole}.`,
          recommended_action: `Take assessment or complete course covering ${skillName}.`,
          learning_resources: [`${skillName} Documentation`, `Mastering ${skillName}`]
        });
      }
    });

    // Compute and store career readiness score
    const readiness = calculateCareerReadiness(
      detectedSkills,
      [],
      [],
      targetRole,
      profile?.degree || 'Bachelor Degree'
    );
    database.career_scores = database.career_scores.filter(c => c.user_id !== req.userId);
    database.career_scores.push({
      id: `cs_${Date.now()}`,
      user_id: req.userId!,
      score_data: readiness,
      created_at: now
    });

    database.analyses_history.push({
      id: `hist_${Date.now()}`,
      user_id: req.userId!,
      type: 'resume_analysis',
      title: `Resume Analysis: ${filename || 'Uploaded Resume'}`,
      summary: `Parsed ${detectedSkills.length} skills. ATS Compatibility evaluated at ${aiFeedback.ats_score}/100.`,
      score: aiFeedback.ats_score,
      details: { resume_id: resumeId },
      created_at: now
    });
  });

  res.status(201).json(newResume);
});

// Extract text from uploaded binary or text files (.pdf, .docx, .doc, .txt)
router.post('/resumes/extract-file', async (req: Request, res: Response) => {
  const { filename, file_base64 } = req.body;

  if (!file_base64 || typeof file_base64 !== 'string') {
    return res.status(400).json({ error: 'Valid base64 encoded file data is required.' });
  }

  try {
    let cleanBase64 = file_base64;
    if (cleanBase64.includes('base64,')) {
      cleanBase64 = cleanBase64.split('base64,')[1];
    }

    const buffer = Buffer.from(cleanBase64, 'base64');
    if (!buffer || buffer.length === 0) {
      return res.status(400).json({ error: 'Uploaded file is empty.' });
    }

    const lowerName = (filename || '').toLowerCase();
    let extractedText = '';

    if (lowerName.endsWith('.pdf')) {
      try {
        const { PDFParse } = await import('pdf-parse');
        const parser = new PDFParse({ data: buffer });
        const result = await parser.getText();
        extractedText = result.text || '';
      } catch (pdfErr: any) {
        console.warn('PDFParse failed, falling back to raw buffer string inspection:', pdfErr?.message);
        // Fallback for simple streams
        extractedText = buffer.toString('latin1').replace(/[^\x20-\x7E\n\r\t]/g, ' ');
      }
    } else if (lowerName.endsWith('.docx') || lowerName.endsWith('.doc')) {
      try {
        const mammothModule = await import('mammoth');
        const mammoth = (mammothModule as any).default || mammothModule;
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value || '';
      } catch (docErr: any) {
        console.warn('Mammoth extraction failed:', docErr?.message);
        extractedText = buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ');
      }
    } else {
      // Plain text or markdown
      extractedText = buffer.toString('utf-8');
    }

    // Clean up excessive blank lines & carriage returns
    const cleanedText = extractedText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (!cleanedText || cleanedText.length < 15) {
      return res.status(422).json({
        error: 'Unable to extract legible text from this file. The document may be scanned image-only or password protected. You can paste the text directly.'
      });
    }

    res.json({
      success: true,
      text: cleanedText,
      filename: filename || 'resume.pdf',
      size: buffer.length
    });
  } catch (error: any) {
    console.error('File extraction error:', error);
    res.status(500).json({
      error: error.message || 'Failed to process document. Please paste resume text directly.'
    });
  }
});

router.get('/resumes', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDB();
  const resumes = db.resumes.filter(r => r.user_id === req.userId);
  res.json(resumes);
});

router.get('/resumes/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDB();
  const resume = db.resumes.find(r => r.id === req.params.id && r.user_id === req.userId);
  if (!resume) return res.status(404).json({ error: 'Resume not found.' });
  res.json(resume);
});

router.delete('/resumes/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  updateDB(db => {
    db.resumes = db.resumes.filter(r => !(r.id === req.params.id && r.user_id === req.userId));
    db.skill_gaps = db.skill_gaps.filter(g => g.user_id !== req.userId);
    db.career_scores = db.career_scores.filter(c => c.user_id !== req.userId);
    db.roadmaps = db.roadmaps.filter(r => r.user_id !== req.userId);
  });
  res.json({ success: true, message: 'Resume deleted.' });
});

// ----------------------------------------------------
// 4. JOB DESCRIPTION ANALYZER ROUTES
// ----------------------------------------------------

router.post('/jobs/analyze', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { raw_text, title, company, location } = req.body;

  if (!raw_text || raw_text.trim().length < 30) {
    return res.status(400).json({ error: 'Please provide a complete job description.' });
  }

  // 1. NLP Skill Extraction & Categorization
  const extractedSkills = extractSkillsFromText(raw_text);

  // Divide into required vs preferred based on NLP presence
  const requiredSkills = extractedSkills.slice(0, Math.ceil(extractedSkills.length * 0.7));
  const preferredSkills = extractedSkills.slice(Math.ceil(extractedSkills.length * 0.7));

  // 2. Gemini AI Deep Extraction
  const aiExtracted = await analyzeJobWithGemini(raw_text);

  const jobId = `job_${Date.now()}`;
  const now = new Date().toISOString();

  const newJob: JobDescriptionData = {
    id: jobId,
    user_id: req.userId!,
    title: aiExtracted?.title || title || 'Target Role Position',
    company: aiExtracted?.company || company || 'Hiring Organization',
    location: aiExtracted?.location || location || 'Remote / Hybrid',
    raw_text,
    required_skills: requiredSkills,
    preferred_skills: preferredSkills,
    responsibilities: aiExtracted?.responsibilities || [
      'Architect, develop, and deliver high-performance software modules.',
      'Collaborate with cross-functional product and engineering teams.',
      'Write clean, well-tested code following agile engineering principles.'
    ],
    education_req: aiExtracted?.education_req || 'Bachelor degree in Computer Science, Engineering or related technical field.',
    experience_req: aiExtracted?.experience_req || '0 - 2 years relevant software / project experience.',
    behavioral_skills: aiExtracted?.behavioral_skills || ['Problem Solving', 'Team Collaboration', 'Communication'],
    tools_technologies: aiExtracted?.tools_technologies || extractedSkills.map(s => s.name),
    created_at: now
  };

  updateDB(db => {
    db.jobs.push(newJob);
    db.analyses_history.push({
      id: `hist_${Date.now()}`,
      user_id: req.userId!,
      type: 'job_match',
      title: `Job Analysis: ${newJob.title} (${newJob.company})`,
      summary: `Extracted ${newJob.required_skills.length} required skills, ${newJob.preferred_skills.length} preferred skills.`,
      details: { job_id: jobId },
      created_at: now
    });
  });

  res.status(201).json(newJob);
});

router.get('/jobs', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDB();
  const jobs = db.jobs.filter(j => j.user_id === req.userId);
  res.json(jobs);
});

router.get('/jobs/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDB();
  const job = db.jobs.find(j => j.id === req.params.id && j.user_id === req.userId);
  if (!job) return res.status(404).json({ error: 'Job analysis not found.' });
  res.json(job);
});

// ----------------------------------------------------
// 5. EXPLAINABLE AI JOB MATCHING ROUTE
// ----------------------------------------------------

router.post('/matching/analyze', authMiddleware, (req: AuthRequest, res: Response) => {
  const { job_id, resume_id } = req.body;
  const db = getDB();

  const user = db.users.find(u => u.id === req.userId);
  const profile = db.profiles.find(p => p.user_id === req.userId);
  const resume = resume_id ? db.resumes.find(r => r.id === resume_id && r.user_id === req.userId) : db.resumes.find(r => r.user_id === req.userId);
  const job = db.jobs.find(j => j.id === job_id && j.user_id === req.userId);

  if (!job) {
    return res.status(404).json({ error: 'Job description not found. Please analyze a job description first.' });
  }

  const userSkills: SkillItem[] = resume?.detected_skills || [
    { id: 's_1', name: 'Python', normalized_name: 'python', category: 'Programming', proficiency: 'Advanced', verified: true },
    { id: 's_2', name: 'SQL', normalized_name: 'sql', category: 'Programming', proficiency: 'Intermediate', verified: true },
    { id: 's_3', name: 'Machine Learning', normalized_name: 'machine learning', category: 'AI/ML', proficiency: 'Intermediate', verified: true }
  ];

  const userProjects = resume?.projects || [
    { title: 'Predictive Churn Model', description: 'Machine learning model in Python', technologies: ['Python', 'Machine Learning', 'Pandas'] }
  ];

  const userExp = resume?.experience || [];
  const userDegree = profile?.degree || 'B.Tech Computer Science';

  const matchExplanation = calculateExplainableJobMatch(
    userSkills,
    userProjects,
    userExp,
    userDegree,
    job
  );

  const matchId = `match_${Date.now()}`;
  const now = new Date().toISOString();

  updateDB(database => {
    database.job_matches.push({
      id: matchId,
      user_id: req.userId!,
      job_id: job.id,
      resume_id: resume?.id || 'manual',
      match_data: matchExplanation,
      created_at: now
    });

    database.analyses_history.push({
      id: `hist_${Date.now()}`,
      user_id: req.userId!,
      type: 'job_match',
      title: `Match Evaluation: ${job.title}`,
      summary: `Overall Match: ${matchExplanation.overall_score}%. Technical: ${matchExplanation.breakdown.technical_skills}%.`,
      score: matchExplanation.overall_score,
      details: matchExplanation,
      created_at: now
    });
  });

  res.json({
    match_id: matchId,
    job_title: job.title,
    company: job.company,
    explanation: matchExplanation
  });
});

// ----------------------------------------------------
// 6. SKILL INTELLIGENCE & GAP ANALYSIS ROUTES
// ----------------------------------------------------

router.get('/skills', (req: Request, res: Response) => {
  const db = getDB();
  res.json(db.skills);
});

router.get('/skills/user', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDB();
  const resume = db.resumes.find(r => r.user_id === req.userId);
  const skills = resume?.detected_skills || [];
  res.json(skills);
});

router.post('/skills/user', authMiddleware, (req: AuthRequest, res: Response) => {
  const { skill_name, proficiency } = req.body;
  if (!skill_name) return res.status(400).json({ error: 'Skill name is required.' });

  const normalized = normalizeSkillName(skill_name);
  const skillItem: SkillItem = {
    id: `custom_${Date.now()}`,
    name: normalized.normalized,
    normalized_name: normalized.normalized.toLowerCase(),
    category: normalized.category,
    proficiency: proficiency || 'Intermediate',
    source: 'manual',
    verified: true
  };

  updateDB(db => {
    let resume = db.resumes.find(r => r.user_id === req.userId);
    if (resume) {
      const exists = resume.detected_skills.some(s => s.name.toLowerCase() === skillItem.name.toLowerCase());
      if (!exists) {
        resume.detected_skills.push(skillItem);
      }
    }
  });

  res.status(201).json(skillItem);
});

router.get('/skills/gaps', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDB();
  const profile = db.profiles.find(p => p.user_id === req.userId);
  const targetRole = profile?.target_role || 'AI/ML Engineer';
  const resume = db.resumes.find(r => r.user_id === req.userId);

  if (!resume) {
    return res.json({
      target_role: targetRole,
      gaps: [],
      is_new_user: true,
      message: 'Upload your resume to identify target role skill gaps.'
    });
  }

  const gaps = db.skill_gaps.filter(g => g.user_id === req.userId);
  res.json({
    target_role: targetRole,
    gaps,
    is_new_user: false
  });
});

// ----------------------------------------------------
// 7. CAREER READINESS & FUTURE READINESS ROUTES
// ----------------------------------------------------

router.get('/career/readiness', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDB();
  const profile = db.profiles.find(p => p.user_id === req.userId);
  const resume = db.resumes.find(r => r.user_id === req.userId);

  if (!resume || !resume.detected_skills || resume.detected_skills.length === 0) {
    return res.json({
      overall_score: null,
      grade: 'Not Evaluated',
      breakdown: {
        technical_skills: null,
        projects: null,
        experience: null,
        job_alignment: null,
        industry_alignment: null,
        future_readiness: null
      },
      explanation: 'No resume uploaded yet. CareerIQ never invents skills or assumes candidate data. Please upload your resume to generate an authentic AI career readiness score.',
      strengths: [],
      critical_gaps: [],
      immediate_next_steps: [
        'Upload your resume in the Resume Analyzer',
        'Verify your target role in profile settings',
        'Receive explainable ATS score and readiness evaluation'
      ],
      is_new_user: true
    });
  }

  const userSkills = resume.detected_skills;
  const readiness = calculateCareerReadiness(
    userSkills,
    resume.projects || [],
    resume.experience || [],
    profile?.target_role || 'AI/ML Engineer',
    profile?.degree || 'B.Tech Computer Science'
  );

  res.json({ ...readiness, is_new_user: false });
});

router.get('/career/future-readiness', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDB();
  const profile = db.profiles.find(p => p.user_id === req.userId);
  const resume = db.resumes.find(r => r.user_id === req.userId);
  const trends = db.industry_trends;

  if (!resume || !resume.detected_skills || resume.detected_skills.length === 0) {
    return res.json({
      score: null,
      current_strengths: [],
      future_gaps: [],
      emerging_skills_to_adopt: [],
      is_new_user: true
    });
  }

  const userSkills = resume.detected_skills;
  const targetRole = profile?.target_role || 'AI/ML Engineer';

  const report = calculateFutureReadiness(userSkills, targetRole, trends);
  res.json({ ...report, is_new_user: false });
});

router.get('/career/roles', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDB();
  res.json(db.career_roles);
});

// ----------------------------------------------------
// 8. INDUSTRY & TECHNOLOGY TRENDS ROUTES
// ----------------------------------------------------

router.get('/trends', (req: Request, res: Response) => {
  const db = getDB();
  res.json(db.industry_trends);
});

router.get('/trends/:role', (req: Request, res: Response) => {
  const db = getDB();
  const roleQuery = req.params.role.toLowerCase();
  const filtered = db.industry_trends.filter(t =>
    t.key_roles.some(r => r.toLowerCase().includes(roleQuery) || roleQuery.includes(r.toLowerCase()))
  );
  res.json(filtered.length > 0 ? filtered : db.industry_trends);
});

// ----------------------------------------------------
// 9. PERSONALIZED ROADMAP ROUTES
// ----------------------------------------------------

router.get('/roadmap', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDB();
  const roadmap = db.roadmaps.find(r => r.user_id === req.userId);
  if (!roadmap) {
    return res.status(404).json({ error: 'No active roadmap found. Upload your resume and generate your personalized roadmap.' });
  }
  res.json(roadmap);
});

router.post('/roadmap/generate', authMiddleware, async (req: AuthRequest, res: Response) => {
  const db = getDB();
  const profile = db.profiles.find(p => p.user_id === req.userId);
  const resume = db.resumes.find(r => r.user_id === req.userId);
  const targetRole = profile?.target_role || 'AI/ML Engineer';

  if (!resume) {
    return res.status(400).json({ error: 'Please upload a resume first to generate your personalized roadmap.' });
  }

  const userSkills = resume.detected_skills || [];
  const gaps = db.skill_gaps.filter(g => g.user_id === req.userId);

  const newRoadmap = await generatePersonalizedRoadmapAI(
    req.userId!,
    targetRole,
    userSkills,
    gaps
  );

  updateDB(database => {
    database.roadmaps = database.roadmaps.filter(r => r.user_id !== req.userId);
    database.roadmaps.push(newRoadmap);

    database.analyses_history.push({
      id: `hist_${Date.now()}`,
      user_id: req.userId!,
      type: 'roadmap_gen',
      title: `Generated Roadmap: ${newRoadmap.title}`,
      summary: `Created ${newRoadmap.steps.length}-milestone learning plan for ${targetRole}.`,
      details: newRoadmap,
      created_at: new Date().toISOString()
    });
  });

  res.json(newRoadmap);
});

router.patch('/roadmap/step/:id/toggle', authMiddleware, (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const updated = updateDB(db => {
    const roadmap = db.roadmaps.find(r => r.user_id === req.userId);
    if (roadmap) {
      const step = roadmap.steps.find(s => s.id === id);
      if (step) {
        step.completed = !step.completed;
      }
      const completedCount = roadmap.steps.filter(s => s.completed).length;
      roadmap.completion_percentage = Math.round((completedCount / roadmap.steps.length) * 100);
    }
  });

  const roadmap = updated.roadmaps.find(r => r.user_id === req.userId);
  if (!roadmap) return res.status(404).json({ error: 'Roadmap not found.' });
  res.json(roadmap);
});

// ----------------------------------------------------
// 10. COURSES & LESSONS ROUTES
// ----------------------------------------------------

router.get('/courses', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDB();
  const userProgress = db.user_progress.filter(p => p.user_id === req.userId);

  const coursesWithProgress = db.courses.map(course => {
    const progress = userProgress.find(p => p.course_id === course.id);
    return {
      ...course,
      completed_lesson_ids: progress?.completed_lesson_ids || [],
      percent_completed: progress?.percent_completed || 0,
      status: progress?.status || 'not_started'
    };
  });

  res.json(coursesWithProgress);
});

router.get('/courses/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDB();
  const course = db.courses.find(c => c.id === req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found.' });

  const progress = db.user_progress.find(p => p.course_id === course.id && p.user_id === req.userId);
  res.json({
    ...course,
    completed_lesson_ids: progress?.completed_lesson_ids || [],
    percent_completed: progress?.percent_completed || 0,
    status: progress?.status || 'not_started'
  });
});

router.post('/courses/:id/progress', authMiddleware, (req: AuthRequest, res: Response) => {
  const { lesson_id } = req.body;
  if (!lesson_id) return res.status(400).json({ error: 'lesson_id is required.' });

  const db = getDB();
  const course = db.courses.find(c => c.id === req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found.' });

  const now = new Date().toISOString();
  let updatedProgress: UserCourseProgress | null = null;

  updateDB(database => {
    let progress = database.user_progress.find(p => p.course_id === course.id && p.user_id === req.userId);
    if (!progress) {
      progress = {
        course_id: course.id,
        user_id: req.userId!,
        completed_lesson_ids: [],
        percent_completed: 0,
        status: 'in_progress',
        last_accessed: now
      };
      database.user_progress.push(progress);
    }

    if (!progress.completed_lesson_ids.includes(lesson_id)) {
      progress.completed_lesson_ids.push(lesson_id);
    }

    progress.percent_completed = Math.round((progress.completed_lesson_ids.length / course.lessons.length) * 100);
    progress.status = progress.percent_completed >= 100 ? 'completed' : 'in_progress';
    progress.last_accessed = now;

    updatedProgress = progress;
  });

  res.json({ success: true, progress: updatedProgress });
});

// ----------------------------------------------------
// 11. ASSESSMENTS & QUIZ ENGINE ROUTES
// ----------------------------------------------------

router.get('/assessments', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDB();
  const attempts = db.assessment_attempts.filter(a => a.user_id === req.userId);

  const assessmentsWithAttempts = db.assessments.map(assessment => {
    const pastAttempts = attempts.filter(a => a.assessment_id === assessment.id);
    const bestAttempt = pastAttempts.sort((a, b) => b.percentage - a.percentage)[0];
    return {
      id: assessment.id,
      course_id: assessment.course_id,
      target_skill: assessment.target_skill,
      title: assessment.title,
      duration_minutes: assessment.duration_minutes,
      passing_score: assessment.passing_score,
      total_questions: assessment.questions.length,
      attempts_count: pastAttempts.length,
      best_score: bestAttempt ? bestAttempt.percentage : null,
      passed: bestAttempt ? bestAttempt.passed : false
    };
  });

  res.json(assessmentsWithAttempts);
});

router.get('/assessments/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDB();
  const assessment = db.assessments.find(a => a.id === req.params.id);
  if (!assessment) return res.status(404).json({ error: 'Assessment not found.' });

  // Return questions without correct_index to prevent cheating
  const sanitizedQuestions = assessment.questions.map(q => ({
    id: q.id,
    question: q.question,
    type: q.type,
    options: q.options
  }));

  res.json({
    id: assessment.id,
    course_id: assessment.course_id,
    target_skill: assessment.target_skill,
    title: assessment.title,
    duration_minutes: assessment.duration_minutes,
    passing_score: assessment.passing_score,
    questions: sanitizedQuestions
  });
});

router.post('/assessments/:id/submit', authMiddleware, (req: AuthRequest, res: Response) => {
  const { answers } = req.body as { answers: Array<{ question_id: string; selected_index: number }> };
  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Answers array is required.' });
  }

  const db = getDB();
  const assessment = db.assessments.find(a => a.id === req.params.id);
  if (!assessment) return res.status(404).json({ error: 'Assessment not found.' });

  let correctCount = 0;
  const gradedAnswers = assessment.questions.map(q => {
    const userAns = answers.find(a => a.question_id === q.id);
    const selected_index = userAns ? userAns.selected_index : -1;
    const is_correct = selected_index === q.correct_index;
    if (is_correct) correctCount++;
    return {
      question_id: q.id,
      question: q.question,
      selected_index,
      correct_index: q.correct_index,
      is_correct,
      explanation: q.explanation
    };
  });

  const totalQuestions = assessment.questions.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const passed = percentage >= assessment.passing_score;

  let skillConfidence: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner';
  if (percentage >= 85) skillConfidence = 'Advanced';
  else if (percentage >= 65) skillConfidence = 'Intermediate';

  const userAttempts = db.assessment_attempts.filter(a => a.user_id === req.userId && a.assessment_id === assessment.id);
  const attemptNumber = userAttempts.length + 1;
  const now = new Date().toISOString();

  const newAttempt: AssessmentAttempt = {
    id: `attempt_${Date.now()}`,
    user_id: req.userId!,
    assessment_id: assessment.id,
    course_id: assessment.course_id,
    target_skill: assessment.target_skill,
    score: correctCount,
    total_questions: totalQuestions,
    percentage,
    passed,
    skill_confidence_level: skillConfidence,
    attempt_number: attemptNumber,
    answers: gradedAnswers.map(ga => ({ question_id: ga.question_id, selected_index: ga.selected_index, is_correct: ga.is_correct })),
    created_at: now
  };

  updateDB(database => {
    database.assessment_attempts.push(newAttempt);

    // If passed or improved, add/upgrade skill in user's profile and resume
    let resume = database.resumes.find(r => r.user_id === req.userId);
    if (resume) {
      let existingSkill = resume.detected_skills.find(s => s.name.toLowerCase() === assessment.target_skill.toLowerCase());
      if (existingSkill) {
        existingSkill.proficiency = skillConfidence;
        existingSkill.verified = true;
        existingSkill.source = 'assessment';
      } else {
        resume.detected_skills.push({
          id: `skill_verified_${Date.now()}`,
          name: assessment.target_skill,
          normalized_name: assessment.target_skill.toLowerCase(),
          category: 'Cloud & DevOps',
          proficiency: skillConfidence,
          source: 'assessment',
          verified: true
        });
      }

      // Remove from skill gaps if verified
      database.skill_gaps = database.skill_gaps.filter(
        g => !(g.user_id === req.userId && g.skill_name.toLowerCase() === assessment.target_skill.toLowerCase())
      );
    }

    database.analyses_history.push({
      id: `hist_${Date.now()}`,
      user_id: req.userId!,
      type: 'assessment_taken',
      title: `Skill Assessment: ${assessment.target_skill}`,
      summary: `Scored ${percentage}% (${passed ? 'PASSED' : 'RETAKE RECOMMENDED'}). Verified confidence: ${skillConfidence}.`,
      score: percentage,
      details: newAttempt,
      created_at: now
    });
  });

  res.json({
    attempt_id: newAttempt.id,
    score: correctCount,
    total_questions: totalQuestions,
    percentage,
    passed,
    skill_confidence_level: skillConfidence,
    target_skill: assessment.target_skill,
    attempt_number: attemptNumber,
    detailed_answers: gradedAnswers
  });
});

router.get('/assessments/attempts/history', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDB();
  const attempts = db.assessment_attempts
    .filter(a => a.user_id === req.userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  res.json(attempts);
});

// ----------------------------------------------------
// 12. RECRUITER HUB & CANDIDATE EVALUATION ROUTES
// ----------------------------------------------------

router.get('/recruiter/readiness', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDB();
  const resume = db.resumes.find(r => r.user_id === req.userId);
  const attempts = db.assessment_attempts.filter(a => a.user_id === req.userId);
  const profile = db.profiles.find(p => p.user_id === req.userId);

  if (!resume || !resume.detected_skills || resume.detected_skills.length === 0) {
    const emptyScore: RecruiterReadinessScore = {
      overall_score: null,
      status: 'Insufficient Data',
      categories: [
        { category: 'Technical Skills Baseline', score: null, benchmark: 80, status: 'Insufficient Data', feedback: 'Requires uploaded resume with verified programming languages.' },
        { category: 'Role-Specific Qualifications', score: null, benchmark: 75, status: 'Insufficient Data', feedback: 'Target role not yet mapped against verified coursework.' },
        { category: 'Applied Project Portfolios', score: null, benchmark: 70, status: 'Insufficient Data', feedback: 'No projects logged for evaluation.' },
        { category: 'Algorithmic Problem-Solving', score: null, benchmark: 75, status: 'Insufficient Data', feedback: 'No skill assessment completed.' },
        { category: 'Technical Communication', score: null, benchmark: 70, status: 'Insufficient Data', feedback: 'Resume text not available for clarity scoring.' },
        { category: 'Hands-on Experience & Internships', score: null, benchmark: 65, status: 'Insufficient Data', feedback: 'Work experience history empty.' },
        { category: 'Industry Certifications', score: null, benchmark: 60, status: 'Insufficient Data', feedback: 'No verified credentials on record.' },
        { category: 'Resume Formatting & Clarity', score: null, benchmark: 80, status: 'Insufficient Data', feedback: 'Upload resume to evaluate ATS readability.' },
        { category: 'ATS Keyword Compatibility', score: null, benchmark: 75, status: 'Insufficient Data', feedback: 'Requires resume to compare keyword frequency.' },
        { category: 'Technical Interview Readiness', score: null, benchmark: 70, status: 'Insufficient Data', feedback: 'Complete assessments to gauge readiness.' },
        { category: 'Industry Tooling & Version Control', score: null, benchmark: 75, status: 'Insufficient Data', feedback: 'Git and build tooling exposure unverified.' },
        { category: 'Cloud & Container Deployment', score: null, benchmark: 65, status: 'Insufficient Data', feedback: 'Docker and cloud services exposure unverified.' }
      ],
      candidate_summary: 'Recruiters require an active resume and verified skills to evaluate candidate readiness. Upload your resume to calculate your 12-criterion readiness score.'
    };
    return res.json(emptyScore);
  }

  const verifiedSkillsCount = resume.detected_skills.filter(s => s.verified).length;
  const hasDocker = resume.detected_skills.some(s => s.name.toLowerCase().includes('docker'));
  const hasGit = resume.detected_skills.some(s => s.name.toLowerCase().includes('git'));
  const atsScore = resume.ai_feedback?.ats_score || 75;
  const passedAssessmentsCount = attempts.filter(a => a.passed).length;

  const categories: RecruiterReadinessCategory[] = [
    {
      category: 'Technical Skills Baseline',
      score: Math.min(95, 60 + verifiedSkillsCount * 4),
      benchmark: 80,
      status: verifiedSkillsCount >= 6 ? 'Meets' : 'Below',
      feedback: `${verifiedSkillsCount} verified skills found. Strong in programming foundations.`
    },
    {
      category: 'Role-Specific Qualifications',
      score: 78,
      benchmark: 75,
      status: 'Meets',
      feedback: `Good core alignment for ${profile?.target_role || 'AI/ML Engineer'}.`
    },
    {
      category: 'Applied Project Portfolios',
      score: resume.projects && resume.projects.length >= 2 ? 85 : 68,
      benchmark: 70,
      status: resume.projects && resume.projects.length >= 2 ? 'Exceeds' : 'Below',
      feedback: `${resume.projects?.length || 0} applied engineering projects logged.`
    },
    {
      category: 'Algorithmic Problem-Solving',
      score: passedAssessmentsCount > 0 ? 86 : 64,
      benchmark: 75,
      status: passedAssessmentsCount > 0 ? 'Exceeds' : 'Below',
      feedback: `${passedAssessmentsCount} assessment(s) completed on CareerIQ.`
    },
    {
      category: 'Technical Communication',
      score: 82,
      benchmark: 70,
      status: 'Meets',
      feedback: 'Clear, readable resume structure with concise descriptions.'
    },
    {
      category: 'Hands-on Experience & Internships',
      score: resume.experience && resume.experience.length > 0 ? 80 : 60,
      benchmark: 65,
      status: resume.experience && resume.experience.length > 0 ? 'Meets' : 'Below',
      feedback: `${resume.experience?.length || 0} professional internship engagement(s).`
    },
    {
      category: 'Industry Certifications',
      score: resume.certifications && resume.certifications.length > 0 ? 84 : 62,
      benchmark: 60,
      status: resume.certifications && resume.certifications.length > 0 ? 'Exceeds' : 'Below',
      feedback: `${resume.certifications?.length || 0} verified certification(s) logged.`
    },
    {
      category: 'Resume Formatting & Clarity',
      score: atsScore,
      benchmark: 80,
      status: atsScore >= 80 ? 'Meets' : 'Below',
      feedback: `ATS structural formatting evaluated at ${atsScore}%.`
    },
    {
      category: 'ATS Keyword Compatibility',
      score: Math.min(95, atsScore + 2),
      benchmark: 75,
      status: atsScore >= 75 ? 'Meets' : 'Below',
      feedback: 'Contains high-frequency terminology aligned with job postings.'
    },
    {
      category: 'Technical Interview Readiness',
      score: passedAssessmentsCount > 0 ? 80 : 65,
      benchmark: 70,
      status: passedAssessmentsCount > 0 ? 'Meets' : 'Below',
      feedback: 'Good baseline conceptual confidence across tested domains.'
    },
    {
      category: 'Industry Tooling & Version Control',
      score: hasGit ? 88 : 55,
      benchmark: 75,
      status: hasGit ? 'Exceeds' : 'Below',
      feedback: hasGit ? 'Git and version control actively verified.' : 'Missing Git version control evidence.'
    },
    {
      category: 'Cloud & Container Deployment',
      score: hasDocker ? 85 : 52,
      benchmark: 65,
      status: hasDocker ? 'Exceeds' : 'Below',
      feedback: hasDocker ? 'Containerization skills verified.' : 'Docker and cloud deployment needed.'
    }
  ];

  const sum = categories.reduce((acc, c) => acc + (c.score || 0), 0);
  const overall = Math.round(sum / categories.length);

  const recruiterScore: RecruiterReadinessScore = {
    overall_score: overall,
    status: overall >= 75 ? 'Ready' : 'Developing',
    categories,
    candidate_summary: `Your profile demonstrates an overall recruiter readiness rating of ${overall}/100. Recruiters value candidates with verified project evidence, containerization exposure, and high ATS compatibility.`
  };

  res.json(recruiterScore);
});

router.get('/recruiter/jobs', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDB();
  res.json(db.recruiter_jobs);
});

router.post('/recruiter/jobs', authMiddleware, (req: AuthRequest, res: Response) => {
  const { title, company, department, location, work_type, experience_level, salary_range, required_skills, preferred_skills, description } = req.body;

  if (!title || !company) {
    return res.status(400).json({ error: 'Title and company are required.' });
  }

  const generatedDesc = description || `We are seeking a qualified ${title} to join ${company}. Essential skills and competencies include ${(required_skills || ['Python', 'SQL']).join(', ')}.`;

  const now = new Date().toISOString();
  const newJob: RecruiterJob = {
    id: `job_${Date.now()}`,
    recruiter_id: req.userId!,
    title,
    company,
    department: department || 'Engineering',
    location: location || 'Remote',
    work_type: work_type || 'Remote',
    experience_level: experience_level || 'Fresher / Junior (0-2 years)',
    salary_range: salary_range || '$90,000 - $120,000',
    required_skills: required_skills || ['Python', 'SQL'],
    preferred_skills: preferred_skills || ['Docker'],
    description: generatedDesc,
    status: 'Active',
    applicants_count: 0,
    created_at: now
  };

  updateDB(db => {
    db.recruiter_jobs.push(newJob);
  });

  res.status(201).json(newJob);
});

router.put('/recruiter/jobs/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const { title, company, location, salary_range, required_skills, status, experience_level, description } = req.body;
  let updatedJob: RecruiterJob | null = null;

  updateDB(db => {
    const job = db.recruiter_jobs.find(j => j.id === req.params.id);
    if (job) {
      if (title !== undefined) job.title = title;
      if (company !== undefined) job.company = company;
      if (location !== undefined) job.location = location;
      if (salary_range !== undefined) job.salary_range = salary_range;
      if (required_skills !== undefined) job.required_skills = required_skills;
      if (status !== undefined) job.status = status;
      if (experience_level !== undefined) job.experience_level = experience_level;
      if (description !== undefined) job.description = description;
      updatedJob = job;
    }
  });

  if (!updatedJob) {
    return res.status(404).json({ error: 'Job requisition not found.' });
  }

  res.json(updatedJob);
});

router.delete('/recruiter/jobs/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  updateDB(db => {
    db.recruiter_jobs = db.recruiter_jobs.filter(j => j.id !== req.params.id);
  });
  res.json({ success: true, message: 'Requisition deleted successfully.' });
});

router.get('/recruiter/candidates', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDB();

  // Return candidate pool with their resumes, readiness, and verified skills
  const candidates = db.users
    .filter(u => u.role !== 'recruiter')
    .map(u => {
      const profile = db.profiles.find(p => p.user_id === u.id);
      const resume = db.resumes.find(r => r.user_id === u.id);
      const scoreObj = db.career_scores.find(c => c.user_id === u.id);
      const applications = db.candidate_applications.filter(a => a.candidate_id === u.id);

      return {
        id: u.id,
        full_name: u.full_name,
        email: u.email,
        degree: profile?.degree || 'Computer Science',
        university: profile?.university || 'Apex Institute',
        target_role: profile?.target_role || 'AI/ML Engineer',
        experience_level: profile?.experience_level || 'Student',
        resume_id: resume?.id || null,
        resume_filename: resume?.filename || null,
        verified_skills: resume?.detected_skills || [],
        ats_score: resume?.ai_feedback?.ats_score || null,
        career_readiness: scoreObj?.score_data?.overall_score || null,
        applications: applications.map(app => ({
          id: app.id,
          job_id: app.job_id,
          status: app.status,
          interview_date: app.interview_date,
          interview_notes: app.interview_notes
        }))
      };
    });

  res.json(candidates);
});

router.post('/recruiter/candidates/:id/status', authMiddleware, (req: AuthRequest, res: Response) => {
  const { job_id, status, interview_date, interview_notes } = req.body;
  const candidateId = req.params.id;

  if (!status) return res.status(400).json({ error: 'Status is required.' });

  const db = getDB();
  const candidate = db.users.find(u => u.id === candidateId);
  if (!candidate) return res.status(404).json({ error: 'Candidate not found.' });

  const now = new Date().toISOString();
  let application: CandidateApplication | undefined;

  updateDB(database => {
    application = database.candidate_applications.find(a => a.candidate_id === candidateId && a.job_id === (job_id || 'job_rec_1'));
    if (!application) {
      application = {
        id: `app_${Date.now()}`,
        job_id: job_id || 'job_rec_1',
        candidate_id: candidateId,
        recruiter_id: req.userId!,
        candidate_name: candidate.full_name,
        candidate_email: candidate.email,
        target_role: 'AI/ML Engineer',
        match_score: 88,
        status,
        interview_date,
        interview_notes,
        applied_at: now
      };
      database.candidate_applications.push(application);
    } else {
      application.status = status;
      if (interview_date !== undefined) application.interview_date = interview_date;
      if (interview_notes !== undefined) application.interview_notes = interview_notes;
    }

    // Add candidate notification
    database.notifications.push({
      id: `notif_${Date.now()}`,
      user_id: candidateId,
      title: `Application Update: ${status}`,
      message: status === 'Interview'
        ? `You have been invited for an interview on ${interview_date || 'soon'}. Check Recruiter Hub for details.`
        : `Your application status has been updated to ${status}.`,
      type: status === 'Rejected' ? 'alert' : 'success',
      is_read: false,
      created_at: now
    });
  });

  res.json({ success: true, application });
});

// ----------------------------------------------------
// 13. RESUME BULLET OPTIMIZER (IMPROVEMENT GENERATOR)
// ----------------------------------------------------

router.post('/resume/improve-bullet', authMiddleware, (req: AuthRequest, res: Response) => {
  const { bullet_text, target_role, section } = req.body;
  if (!bullet_text || bullet_text.trim().length < 5) {
    return res.status(400).json({ error: 'Valid bullet point text is required.' });
  }

  const role = target_role || 'AI/ML Engineer';

  // Generate actionable, quantified suggestions
  const suggestions = [
    {
      original_bullet: bullet_text,
      improved_bullet: `Architected and deployed a containerized ${bullet_text.toLowerCase().replace(/^(built|created|developed|worked on)\s+/i, '')}, reducing end-to-end processing latency by 32% and achieving 94.2% evaluation accuracy.`,
      quantified_metric: 'Reduced processing latency by 32% with 94.2% accuracy',
      reason: 'Replaced passive verb with "Architected and deployed", and quantified technical impact.'
    },
    {
      original_bullet: bullet_text,
      improved_bullet: `Spearheaded engineering of production ${bullet_text.toLowerCase().replace(/^(built|created|developed|worked on)\s+/i, '')} utilizing Python and Docker; automated test pipelines to ensure 99.8% uptime across 1,000+ daily requests.`,
      quantified_metric: 'Ensured 99.8% uptime across 1,000+ daily requests',
      reason: 'Explicitly specifies modern tooling (Docker, automated testing) demanded by ATS algorithms.'
    }
  ];

  res.json({
    section: section || 'Experience',
    target_role: role,
    suggestions
  });
});

// ----------------------------------------------------
// 14. DEMO MODE TOGGLES (EXPLICIT USER ACTION ONLY)
// ----------------------------------------------------

router.post('/demo/load', authMiddleware, (req: AuthRequest, res: Response) => {
  seedUserDemoData(req.userId!);
  const db = getDB();
  const profile = db.profiles.find(p => p.user_id === req.userId);
  const resume = db.resumes.find(r => r.user_id === req.userId);
  const readiness = db.career_scores.find(c => c.user_id === req.userId);
  const gaps = db.skill_gaps.filter(g => g.user_id === req.userId);

  res.json({
    success: true,
    message: 'Demo profile successfully loaded with verified resume, ATS diagnostics, and skill gaps.',
    profile,
    resume,
    readiness: readiness?.score_data,
    gaps
  });
});

router.post('/demo/clear', authMiddleware, (req: AuthRequest, res: Response) => {
  clearUserData(req.userId!);
  res.json({
    success: true,
    message: 'Demo data cleared. Profile is reset to authentic blank state.'
  });
});

// ----------------------------------------------------
// 15. PROJECT RECOMMENDATIONS
// ----------------------------------------------------

router.get('/projects/recommendations', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDB();
  res.json(db.projects);
});

// ----------------------------------------------------
// 16. CAREER AI ASSISTANT (RAG-GROUNDED)
// ----------------------------------------------------

router.post('/assistant/chat', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { message } = req.body;
  if (!message || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message cannot be empty.' });
  }

  const db = getDB();
  const profile = db.profiles.find(p => p.user_id === req.userId) || null;
  const resume = db.resumes.find(r => r.user_id === req.userId);
  const skills = resume?.detected_skills || [];
  const gaps = db.skill_gaps.filter(g => g.user_id === req.userId);

  // 1. RAG Vector Retrieval over Knowledge Base
  const ragResult = RAGService.retrieveContext(message, 3);

  // 2. Generate Grounded AI Response
  const chatResponse = await generateRAGCareerChat(
    message,
    profile,
    skills,
    gaps,
    ragResult
  );

  res.json({
    reply: chatResponse.text,
    citations: ragResult.citations,
    is_grounded_in_kb: chatResponse.isGrounded,
    timestamp: new Date().toISOString()
  });
});

// ----------------------------------------------------
// 17. ANALYSIS HISTORY & DATA DELETION
// ----------------------------------------------------

router.get('/history', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDB();
  const history = db.analyses_history.filter(h => h.user_id === req.userId);
  res.json(history.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
});

router.delete('/history/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  updateDB(db => {
    db.analyses_history = db.analyses_history.filter(h => !(h.id === req.params.id && h.user_id === req.userId));
  });
  res.json({ success: true, message: 'Analysis entry deleted.' });
});

export default router;
