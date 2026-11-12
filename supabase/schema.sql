-- ====================================================================
-- CAREERIQ — ALL-IN-ONE SUPABASE POSTGRESQL SCHEMA & RLS MIGRATION
-- ====================================================================
-- Description: Complete schema for CareerIQ AI Platform.
-- Safe & Idempotent: Can be executed multiple times without errors.
-- Includes: 23 Relational Tables, Indexes, RLS Policies, Storage, and Seed Data.
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. EXTENSIONS
-- --------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- --------------------------------------------------------------------
-- 2. USERS & PROFILES TABLE
-- --------------------------------------------------------------------
-- user_id is TEXT to support both Supabase Auth UUIDs and existing user IDs.
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  account_role TEXT NOT NULL DEFAULT 'student' CHECK (account_role IN ('student', 'recruiter', 'admin')),
  target_role TEXT,
  experience_level TEXT DEFAULT 'entry',
  education TEXT,
  bio TEXT,
  company_name TEXT,
  avatar_url TEXT,
  resume_uploaded BOOLEAN DEFAULT FALSE,
  resume_filename TEXT,
  readiness_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(account_role);

-- --------------------------------------------------------------------
-- 3. RESUME MANAGEMENT TABLES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id TEXT NOT NULL,
  storage_path TEXT,
  filename TEXT NOT NULL,
  file_type TEXT DEFAULT 'application/pdf',
  file_size INTEGER DEFAULT 0,
  extracted_text TEXT,
  parsed_skills JSONB DEFAULT '[]'::JSONB,
  sections JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resumes_owner_id ON public.resumes(owner_id);

CREATE TABLE IF NOT EXISTS public.resume_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  target_role TEXT,
  ats_score INTEGER DEFAULT 0,
  strengths JSONB DEFAULT '[]'::JSONB,
  weaknesses JSONB DEFAULT '[]'::JSONB,
  missing_keywords JSONB DEFAULT '[]'::JSONB,
  skill_analysis JSONB DEFAULT '{}'::JSONB,
  role_alignment JSONB DEFAULT '{}'::JSONB,
  recommendations JSONB DEFAULT '[]'::JSONB,
  summary TEXT,
  analyzed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resume_analyses_user ON public.resume_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_analyses_resume ON public.resume_analyses(resume_id);

-- --------------------------------------------------------------------
-- 4. CAREER INTELLIGENCE TABLES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.target_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name TEXT NOT NULL UNIQUE,
  category TEXT,
  description TEXT,
  required_skills JSONB DEFAULT '[]'::JSONB,
  preferred_skills JSONB DEFAULT '[]'::JSONB,
  tools_and_technologies JSONB DEFAULT '[]'::JSONB,
  demand_level TEXT DEFAULT 'High',
  salary_range TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  category TEXT,
  proficiency TEXT DEFAULT 'Intermediate' CHECK (proficiency IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
  evidence_source TEXT DEFAULT 'resume',
  verified BOOLEAN DEFAULT FALSE,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, skill_name)
);

CREATE INDEX IF NOT EXISTS idx_user_skills_user ON public.user_skills(user_id);

CREATE TABLE IF NOT EXISTS public.skill_gaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  target_role TEXT NOT NULL,
  existing_skills JSONB DEFAULT '[]'::JSONB,
  missing_skills JSONB DEFAULT '[]'::JSONB,
  skill_coverage NUMERIC(5,2) DEFAULT 0.00,
  recommendations JSONB DEFAULT '[]'::JSONB,
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, target_role)
);

CREATE INDEX IF NOT EXISTS idx_skill_gaps_user ON public.skill_gaps(user_id);

CREATE TABLE IF NOT EXISTS public.career_roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  target_role TEXT NOT NULL,
  roadmap_stages JSONB DEFAULT '[]'::JSONB,
  progress INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, target_role)
);

CREATE INDEX IF NOT EXISTS idx_career_roadmaps_user ON public.career_roadmaps(user_id);

CREATE TABLE IF NOT EXISTS public.career_readiness_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  target_role TEXT,
  readiness_score INTEGER NOT NULL,
  calculation_method TEXT DEFAULT 'comprehensive_nlp',
  category_breakdown JSONB DEFAULT '{}'::JSONB,
  evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_readiness_history_user ON public.career_readiness_history(user_id);

-- --------------------------------------------------------------------
-- 5. COURSES AND LEARNING TABLES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  difficulty TEXT DEFAULT 'Intermediate' CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  duration TEXT,
  skills_covered JSONB DEFAULT '[]'::JSONB,
  modules JSONB DEFAULT '[]'::JSONB,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  lesson_order INTEGER DEFAULT 1,
  duration TEXT,
  lesson_content TEXT,
  code_examples JSONB DEFAULT '[]'::JSONB,
  key_takeaways JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lessons_course ON public.lessons(course_id);

CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  enrollment_date TIMESTAMPTZ DEFAULT NOW(),
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  UNIQUE (user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_user ON public.enrollments(user_id);

CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT TRUE,
  completion_date TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON public.lesson_progress(user_id);

CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  total_questions INTEGER DEFAULT 5,
  passing_score INTEGER DEFAULT 70,
  questions JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assessments_course ON public.assessments(course_id);

CREATE TABLE IF NOT EXISTS public.assessment_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  assessment_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL DEFAULT FALSE,
  answers JSONB DEFAULT '{}'::JSONB,
  attempt_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assessment_attempts_user ON public.assessment_attempts(user_id);

-- --------------------------------------------------------------------
-- 6. JOBS AND APPLICATIONS TABLES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_owner_id TEXT NOT NULL,
  company_name TEXT NOT NULL,
  industry TEXT,
  website TEXT,
  description TEXT,
  verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id TEXT,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  job_title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT,
  location TEXT DEFAULT 'Remote',
  work_mode TEXT DEFAULT 'Remote' CHECK (work_mode IN ('Remote', 'Hybrid', 'On-site')),
  salary_range TEXT,
  experience TEXT DEFAULT 'Entry Level',
  required_skills JSONB DEFAULT '[]'::JSONB,
  preferred_skills JSONB DEFAULT '[]'::JSONB,
  responsibilities JSONB DEFAULT '[]'::JSONB,
  publication_status TEXT DEFAULT 'published' CHECK (publication_status IN ('draft', 'published', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(publication_status);
CREATE INDEX IF NOT EXISTS idx_jobs_recruiter ON public.jobs(recruiter_id);

CREATE TABLE IF NOT EXISTS public.job_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  match_percentage INTEGER DEFAULT 0,
  matching_skills JSONB DEFAULT '[]'::JSONB,
  missing_skills JSONB DEFAULT '[]'::JSONB,
  match_breakdown JSONB DEFAULT '{}'::JSONB,
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, job_id)
);

CREATE INDEX IF NOT EXISTS idx_job_matches_user ON public.job_matches(user_id);

CREATE TABLE IF NOT EXISTS public.saved_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, job_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_jobs_user ON public.saved_jobs(user_id);

CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
  application_status TEXT DEFAULT 'submitted' CHECK (application_status IN ('submitted', 'under_review', 'shortlisted', 'interviewing', 'rejected', 'accepted')),
  cover_letter TEXT,
  candidate_notes TEXT,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, job_id)
);

CREATE INDEX IF NOT EXISTS idx_applications_user ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_job ON public.applications(job_id);

-- --------------------------------------------------------------------
-- 7. RECRUITER INTELLIGENCE TABLES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.candidate_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id TEXT NOT NULL,
  candidate_id TEXT NOT NULL,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  evaluation_criteria JSONB DEFAULT '{}'::JSONB,
  evidence TEXT,
  readiness_assessment TEXT,
  readiness_score INTEGER DEFAULT 0,
  notes TEXT,
  evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_evaluations_recruiter ON public.candidate_evaluations(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_candidate ON public.candidate_evaluations(candidate_id);

CREATE TABLE IF NOT EXISTS public.shortlisted_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id TEXT NOT NULL,
  candidate_id TEXT NOT NULL,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  shortlist_status TEXT DEFAULT 'active' CHECK (shortlist_status IN ('active', 'contacted', 'interview_scheduled', 'archived')),
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (recruiter_id, candidate_id, job_id)
);

-- --------------------------------------------------------------------
-- 8. AI ASSISTANT CONVERSATION TABLES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.career_assistant_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  conversation_title TEXT DEFAULT 'Career Advisory Session',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversations_user ON public.career_assistant_conversations(user_id);

CREATE TABLE IF NOT EXISTS public.career_assistant_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.career_assistant_conversations(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant', 'system')),
  message_content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.career_assistant_messages(conversation_id);

-- --------------------------------------------------------------------
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------
-- Safe: Drop existing policies before creating to allow clean re-runs.

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_readiness_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shortlisted_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_assistant_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_assistant_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.target_roles ENABLE ROW LEVEL SECURITY;

-- 9.1 Profiles Policies
DROP POLICY IF EXISTS "Profiles select policy" ON public.profiles;
CREATE POLICY "Profiles select policy" ON public.profiles FOR SELECT
  USING (auth.uid()::text = user_id OR auth.role() = 'service_role' OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid()::text AND p.account_role = 'recruiter'));

DROP POLICY IF EXISTS "Profiles insert policy" ON public.profiles;
CREATE POLICY "Profiles insert policy" ON public.profiles FOR INSERT
  WITH CHECK (auth.uid()::text = user_id OR auth.role() = 'service_role' OR user_id IS NOT NULL);

DROP POLICY IF EXISTS "Profiles update policy" ON public.profiles;
CREATE POLICY "Profiles update policy" ON public.profiles FOR UPDATE
  USING (auth.uid()::text = user_id OR auth.role() = 'service_role');

-- 9.2 Resumes & Analyses Policies
DROP POLICY IF EXISTS "Resumes user policy" ON public.resumes;
CREATE POLICY "Resumes user policy" ON public.resumes FOR ALL
  USING (auth.uid()::text = owner_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Resume analyses user policy" ON public.resume_analyses;
CREATE POLICY "Resume analyses user policy" ON public.resume_analyses FOR ALL
  USING (auth.uid()::text = user_id OR auth.role() = 'service_role');

-- 9.3 Career Intelligence Policies
DROP POLICY IF EXISTS "User skills policy" ON public.user_skills;
CREATE POLICY "User skills policy" ON public.user_skills FOR ALL
  USING (auth.uid()::text = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Skill gaps policy" ON public.skill_gaps;
CREATE POLICY "Skill gaps policy" ON public.skill_gaps FOR ALL
  USING (auth.uid()::text = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Roadmaps policy" ON public.career_roadmaps;
CREATE POLICY "Roadmaps policy" ON public.career_roadmaps FOR ALL
  USING (auth.uid()::text = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Readiness history policy" ON public.career_readiness_history;
CREATE POLICY "Readiness history policy" ON public.career_readiness_history FOR ALL
  USING (auth.uid()::text = user_id OR auth.role() = 'service_role');

-- 9.4 Courses, Lessons & Assessments (Public read, user-scoped progress)
DROP POLICY IF EXISTS "Courses public select" ON public.courses;
CREATE POLICY "Courses public select" ON public.courses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Lessons public select" ON public.lessons;
CREATE POLICY "Lessons public select" ON public.lessons FOR SELECT USING (true);

DROP POLICY IF EXISTS "Assessments public select" ON public.assessments;
CREATE POLICY "Assessments public select" ON public.assessments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Target roles public select" ON public.target_roles;
CREATE POLICY "Target roles public select" ON public.target_roles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enrollments user policy" ON public.enrollments;
CREATE POLICY "Enrollments user policy" ON public.enrollments FOR ALL
  USING (auth.uid()::text = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Lesson progress user policy" ON public.lesson_progress;
CREATE POLICY "Lesson progress user policy" ON public.lesson_progress FOR ALL
  USING (auth.uid()::text = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Assessment attempts user policy" ON public.assessment_attempts;
CREATE POLICY "Assessment attempts user policy" ON public.assessment_attempts FOR ALL
  USING (auth.uid()::text = user_id OR auth.role() = 'service_role');

-- 9.5 Jobs & Recruiter Policies
DROP POLICY IF EXISTS "Jobs public select" ON public.jobs;
CREATE POLICY "Jobs public select" ON public.jobs FOR SELECT
  USING (publication_status = 'published' OR auth.uid()::text = recruiter_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Jobs recruiter manage" ON public.jobs;
CREATE POLICY "Jobs recruiter manage" ON public.jobs FOR ALL
  USING (auth.uid()::text = recruiter_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Companies recruiter manage" ON public.companies;
CREATE POLICY "Companies recruiter manage" ON public.companies FOR ALL
  USING (auth.uid()::text = recruiter_owner_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Saved jobs user policy" ON public.saved_jobs;
CREATE POLICY "Saved jobs user policy" ON public.saved_jobs FOR ALL
  USING (auth.uid()::text = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Applications candidate and recruiter policy" ON public.applications;
CREATE POLICY "Applications candidate and recruiter policy" ON public.applications FOR ALL
  USING (
    auth.uid()::text = user_id OR
    auth.role() = 'service_role' OR
    EXISTS (SELECT 1 FROM public.jobs j WHERE j.id = applications.job_id AND j.recruiter_id = auth.uid()::text)
  );

DROP POLICY IF EXISTS "Candidate evaluations recruiter policy" ON public.candidate_evaluations;
CREATE POLICY "Candidate evaluations recruiter policy" ON public.candidate_evaluations FOR ALL
  USING (auth.uid()::text = recruiter_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Shortlisted candidates recruiter policy" ON public.shortlisted_candidates;
CREATE POLICY "Shortlisted candidates recruiter policy" ON public.shortlisted_candidates FOR ALL
  USING (auth.uid()::text = recruiter_id OR auth.role() = 'service_role');

-- 9.6 AI Assistant Conversations
DROP POLICY IF EXISTS "Conversations user policy" ON public.career_assistant_conversations;
CREATE POLICY "Conversations user policy" ON public.career_assistant_conversations FOR ALL
  USING (auth.uid()::text = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Messages user policy" ON public.career_assistant_messages;
CREATE POLICY "Messages user policy" ON public.career_assistant_messages FOR ALL
  USING (
    auth.role() = 'service_role' OR
    EXISTS (
      SELECT 1 FROM public.career_assistant_conversations c
      WHERE c.id = career_assistant_messages.conversation_id
      AND c.user_id = auth.uid()::text
    )
  );

-- --------------------------------------------------------------------
-- 10. SUPABASE PRIVATE STORAGE BUCKET FOR RESUMES
-- --------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Users can upload resumes to their folder" ON storage.objects;
CREATE POLICY "Users can upload resumes to their folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'resumes' AND (
      auth.role() = 'service_role' OR
      auth.uid()::text = (storage.foldername(name))[1]
    )
  );

DROP POLICY IF EXISTS "Users can read own resume files" ON storage.objects;
CREATE POLICY "Users can read own resume files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'resumes' AND (
      auth.role() = 'service_role' OR
      auth.uid()::text = (storage.foldername(name))[1]
    )
  );

DROP POLICY IF EXISTS "Users can delete own resume files" ON storage.objects;
CREATE POLICY "Users can delete own resume files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'resumes' AND (
      auth.role() = 'service_role' OR
      auth.uid()::text = (storage.foldername(name))[1]
    )
  );

-- --------------------------------------------------------------------
-- 11. INITIAL SEED DATA (Target Roles & Default Courses)
-- --------------------------------------------------------------------
INSERT INTO public.target_roles (role_name, category, description, required_skills, preferred_skills, tools_and_technologies, demand_level, salary_range)
VALUES
  (
    'AI/ML Engineer',
    'Artificial Intelligence',
    'Designs, develops, and deploys scalable machine learning models and LLM agent architectures.',
    '["Python", "PyTorch", "TensorFlow", "FastAPI", "Docker", "MLOps", "Git"]'::JSONB,
    '["Kubernetes", "LangChain", "Vector Databases", "ONNX", "Ray"]'::JSONB,
    '["HuggingFace", "Weights & Biases", "MLflow", "PostgreSQL", "vLLM"]'::JSONB,
    'Very High',
    '$120,000 - $185,000'
  ),
  (
    'Full Stack Developer',
    'Software Engineering',
    'Builds responsive modern web interfaces and scalable REST/GraphQL backend microservices.',
    '["TypeScript", "React", "Node.js", "Express", "PostgreSQL", "Tailwind CSS", "REST APIs"]'::JSONB,
    '["Next.js", "Docker", "GraphQL", "Redis", "CI/CD", "AWS"]'::JSONB,
    '["Git", "Vite", "Prisma", "Supabase", "Jest", "Postman"]'::JSONB,
    'High',
    '$95,000 - $150,000'
  ),
  (
    'Data Scientist',
    'Data & Analytics',
    'Extracts actionable intelligence from structured and unstructured data using statistical modeling.',
    '["Python", "SQL", "Pandas", "Scikit-Learn", "Data Visualization", "Statistics"]'::JSONB,
    '["BigQuery", "Snowflake", "Spark", "Tableau", "A/B Testing"]'::JSONB,
    '["Jupyter", "Git", "Airflow", "DVC", "Seaborn"]'::JSONB,
    'High',
    '$105,000 - $160,000'
  ),
  (
    'Cloud DevOps Engineer',
    'Infrastructure & Cloud',
    'Automates CI/CD pipelines, container orchestration, and cloud infrastructure reliability.',
    '["Linux", "Docker", "Kubernetes", "Terraform", "CI/CD", "AWS", "Bash"]'::JSONB,
    '["Prometheus", "Grafana", "Ansible", "Helm", "GCP"]'::JSONB,
    '["GitLab CI", "GitHub Actions", "ArgoCD", "Vault"]'::JSONB,
    'Very High',
    '$115,000 - $175,000'
  )
ON CONFLICT (role_name) DO NOTHING;

INSERT INTO public.courses (slug, title, description, category, difficulty, duration, skills_covered)
VALUES
  (
    'programming-fundamentals',
    'Programming Fundamentals',
    'Master core computational thinking, variables, data types, logic control, and modular functions.',
    'Programming',
    'Beginner',
    '6 hours',
    '["Programming", "Python", "Problem Solving", "Clean Code"]'::JSONB
  ),
  (
    'data-structures-algorithms',
    'Data Structures & Algorithms',
    'Master big-O notation, memory complexity, array slicing, hash maps, binary trees, and dynamic programming.',
    'Computer Science',
    'Intermediate',
    '12 hours',
    '["Algorithms", "Data Structures", "Big-O", "Python"]'::JSONB
  ),
  (
    'backend-engineering-apis',
    'Backend Engineering & RESTful APIs',
    'Build production-grade backend servers with routing, authentication, input validation, and database pooling.',
    'Backend',
    'Intermediate',
    '10 hours',
    '["Node.js", "Express", "REST APIs", "SQL", "Authentication"]'::JSONB
  ),
  (
    'machine-learning-foundations',
    'Machine Learning & AI Foundations',
    'Understand supervised vs unsupervised learning, loss functions, gradient descent, and neural network basics.',
    'Artificial Intelligence',
    'Intermediate',
    '15 hours',
    '["Machine Learning", "PyTorch", "Python", "Data Modeling"]'::JSONB
  )
ON CONFLICT (slug) DO NOTHING;
