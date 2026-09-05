export interface User {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: 'student' | 'fresher' | 'junior' | 'mid' | 'senior' | 'recruiter';
  account_type?: 'candidate' | 'recruiter';
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  degree: string;
  university: string;
  graduation_year: string;
  experience_level: string;
  target_role: string;
  target_industry: string;
  career_interests: string[];
  bio: string;
  created_at: string;
  updated_at: string;
}

export interface SkillItem {
  id: string;
  name: string;
  normalized_name: string;
  category: 'Programming' | 'AI/ML' | 'Data & Analytics' | 'Cloud & DevOps' | 'Databases' | 'Cybersecurity' | 'Web Frameworks' | 'Tools' | 'Soft Skills' | 'Other';
  proficiency?: 'Beginner' | 'Intermediate' | 'Advanced';
  source?: 'resume' | 'manual' | 'assessment';
  verified?: boolean;
}

export interface ResumeData {
  id: string;
  user_id: string;
  filename: string;
  upload_date: string;
  raw_text: string;
  summary: string;
  detected_skills: SkillItem[];
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    year: string;
    score?: string;
  }>;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
    skills_used: string[];
  }>;
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
  certifications: Array<{
    title: string;
    issuer: string;
    year: string;
  }>;
  achievements: string[];
  ats_analysis?: {
    ats_score: number;
    formatting_score?: number;
    keyword_score?: number;
    impact_score?: number;
    findings?: string[];
  };
  ai_feedback?: {
    strengths: string[];
    improvements: string[];
    ats_score: number;
    impact_verdict: string;
  };
}

export interface JobDescriptionData {
  id: string;
  user_id: string;
  title: string;
  company: string;
  location: string;
  raw_text: string;
  required_skills: SkillItem[];
  preferred_skills: SkillItem[];
  responsibilities: string[];
  education_req: string;
  experience_req: string;
  behavioral_skills: string[];
  tools_technologies: string[];
  created_at: string;
}

export interface JobMatchExplanation {
  overall_score: number;
  breakdown: {
    technical_skills: number;
    project_relevance: number;
    education_match: number;
    experience_fit: number;
    industry_alignment: number;
  };
  matching_skills: Array<{ name: string; category: string; match_type: 'exact' | 'alias' }>;
  missing_skills: Array<{ name: string; category: string; priority: 'HIGH' | 'MEDIUM' | 'LOW'; is_required: boolean }>;
  partial_matches: Array<{ name: string; related_to: string; reason: string }>;
  explanation_narrative: string;
  recommendations: string[];
}

export interface SkillGapItem {
  id: string;
  user_id: string;
  target_role: string;
  skill_name: string;
  category: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  is_required: boolean;
  importance_reason: string;
  recommended_action: string;
  learning_resources: string[];
}

export interface CareerReadinessScore {
  overall_score: number;
  grade: 'Needs Improvement' | 'Developing' | 'Career Ready' | 'Highly Competitive';
  breakdown: {
    technical_skills: number;
    projects: number;
    experience: number;
    job_alignment: number;
    industry_alignment: number;
    future_readiness: number;
  };
  explanation: string;
  strengths: string[];
  critical_gaps: string[];
  immediate_next_steps: string[];
  calculated_at: string;
}

export interface IndustryTrendItem {
  id: string;
  name: string;
  category: 'AI & Data' | 'Cloud & Infrastructure' | 'Software Engineering' | 'Cybersecurity' | 'Automation & MLOps';
  status: 'EMERGING' | 'GROWING' | 'CURRENT DEMAND' | 'ROLE-SPECIFIC';
  relevance_score: number; // 0-100
  growth_rate: string;
  description: string;
  signal_type: 'Industry signal' | 'Growing demand' | 'Emerging technology' | 'Core standard';
  key_roles: string[];
  source?: string;
  date_recorded: string;
  is_sample: boolean;
}

export interface FutureReadinessReport {
  score: number; // 0-100
  current_strengths: string[];
  future_gaps: string[];
  emerging_skills_to_adopt: Array<{
    skill: string;
    relevance_to_user: string;
    industry_signal: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
  }>;
  risk_factors: string[];
  strategic_summary: string;
}

export interface CareerRoleItem {
  id: string;
  title: string;
  category: string;
  match_percentage: number;
  description: string;
  average_salary_range: string;
  required_skills: string[];
  user_has_skills: string[];
  user_missing_skills: string[];
  career_path_stages: Array<{ level: string; title: string; years: string }>;
  recommended_next_steps: string[];
  explanation: string;
}

export interface RoadmapStep {
  id: string;
  step_order: number;
  title: string;
  skill_name: string;
  category: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  why_learn: string;
  learning_objective: string;
  suggested_project: string;
  estimated_weeks: number;
  completed: boolean;
  resources: Array<{ title: string; type: 'doc' | 'course' | 'practice'; url?: string }>;
}

export interface PersonalizedRoadmap {
  id: string;
  user_id: string;
  title: string;
  target_role: string;
  estimated_duration_months: number;
  steps: RoadmapStep[];
  created_at: string;
  completion_percentage: number;
}

export interface RecommendedProject {
  id: string;
  title: string;
  tagline: string;
  target_role: string;
  skills_demonstrated: string[];
  missing_skills_covered: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimated_hours: number;
  why_improves_employability: string;
  key_features: string[];
  architecture_hint: string;
  github_blueprint_summary: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: 'role_guide' | 'skill_breakdown' | 'industry_report' | 'project_blueprint' | 'interview_insight' | 'career_framework';
  content: string;
  tags: string[];
  source_doc: string;
  last_updated: string;
}

export interface RAGChatCitation {
  document_id: string;
  title: string;
  category: string;
  excerpt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: RAGChatCitation[];
  is_grounded_in_kb?: boolean;
}

export interface AnalysisHistoryItem {
  id: string;
  user_id: string;
  type: 'resume_analysis' | 'job_match' | 'skill_gap' | 'readiness_check' | 'roadmap_gen' | 'assessment_taken';
  title: string;
  summary: string;
  score?: number;
  details: any;
  created_at: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  order: number;
  duration_minutes: number;
  content: string;
  code_snippet?: string;
  key_takeaway: string;
}

export interface Course {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: 'Cloud & DevOps' | 'AI/ML' | 'Web & APIs' | 'Data & Analytics' | 'System Design';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimated_hours: number;
  skills_covered: string[];
  lessons: CourseLesson[];
  assessment_id: string;
}

export interface UserCourseProgress {
  course_id: string;
  user_id: string;
  completed_lesson_ids: string[];
  percent_completed: number;
  status: 'not_started' | 'in_progress' | 'completed';
  last_accessed: string;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'mcq' | 'scenario' | 'code';
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface Assessment {
  id: string;
  course_id: string;
  target_skill: string;
  title: string;
  duration_minutes: number;
  passing_score: number; // e.g. 70
  questions: AssessmentQuestion[];
}

export interface AssessmentAttempt {
  id: string;
  user_id: string;
  assessment_id: string;
  course_id: string;
  target_skill: string;
  score: number;
  total_questions: number;
  percentage: number;
  passed: boolean;
  skill_confidence_level: 'Beginner' | 'Intermediate' | 'Advanced';
  attempt_number: number;
  answers: Array<{ question_id: string; selected_index: number; is_correct: boolean }>;
  created_at: string;
}

export interface RecruiterJob {
  id: string;
  recruiter_id: string;
  title: string;
  company: string;
  department: string;
  location: string;
  work_type: 'Remote' | 'Hybrid' | 'On-site';
  experience_level: string;
  salary_range: string;
  required_skills: string[];
  target_skills?: string[];
  preferred_skills: string[];
  description: string;
  status: 'Active' | 'Closed';
  applicants_count: number;
  created_at: string;
}

export interface CandidateApplication {
  id: string;
  job_id: string;
  candidate_id: string;
  recruiter_id: string;
  candidate_name: string;
  candidate_email: string;
  target_role: string;
  match_score: number;
  status: 'Applied' | 'Shortlisted' | 'Interview' | 'Rejected';
  interview_date?: string;
  interview_notes?: string;
  applied_at: string;
}

export interface RecruiterReadinessCategory {
  category: string;
  score: number | null;
  benchmark: number;
  status: 'Exceeds' | 'Meets' | 'Below' | 'Insufficient Data';
  feedback: string;
}

export interface RecruiterReadinessScore {
  overall_score: number | null;
  status?: 'Ready' | 'Developing' | 'Insufficient Data';
  hiring_verdict?: string;
  criteria?: Array<{ name: string; score: number; feedback: string }>;
  categories?: RecruiterReadinessCategory[];
  candidate_summary?: string;
}

export interface ResumeImprovementSuggestion {
  id: string;
  section: 'Summary' | 'Experience' | 'Projects' | 'Skills';
  original_bullet?: string;
  improved_bullet: string;
  quantified_metric: string;
  reason: string;
}

