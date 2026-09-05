import {
  UserProfile,
  ResumeData,
  JobDescriptionData,
  JobMatchExplanation,
  CareerReadinessScore,
  FutureReadinessReport,
  IndustryTrendItem,
  CareerRoleItem,
  PersonalizedRoadmap,
  RecommendedProject,
  AnalysisHistoryItem,
  SkillItem,
  SkillGapItem,
  Course,
  Assessment,
  AssessmentAttempt,
  RecruiterJob,
  CandidateApplication,
  RecruiterReadinessScore
} from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('careeriq_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const api = {
  // Auth
  async register(data: {
    full_name: string;
    email: string;
    password: string;
    target_role?: string;
    experience_level?: string;
    resume_raw_text?: string;
    resume_filename?: string;
  }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Registration failed' }));
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  async login(data: { email: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Login failed' }));
      throw new Error(err.error || 'Invalid credentials');
    }
    return res.json();
  },

  async loginWithGoogle(data: {
    email: string;
    full_name?: string;
    target_role?: string;
    experience_level?: string;
    avatar_url?: string;
    resume_raw_text?: string;
    resume_filename?: string;
  }) {
    const res = await fetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Google sign-in failed' }));
      throw new Error(err.error || 'Google sign-in failed');
    }
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },

  async forgotPassword(email: string) {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to send reset code');
    }
    return data;
  },

  async resetPassword(data: { email: string; code: string; new_password: string }) {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Password reset failed');
    }
    return result;
  },

  // Profile
  async getProfile(): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/profile`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  // Resumes
  async extractResumeFile(file: File): Promise<{ success: boolean; text: string; filename: string; size: number }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const res = await fetch(`${API_BASE}/resumes/extract-file`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filename: file.name,
              file_base64: base64
            })
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || 'Failed to extract text from document');
          }
          resolve(data);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file from disk'));
      reader.readAsDataURL(file);
    });
  },

  async uploadResume(data: { filename: string; raw_text: string }): Promise<ResumeData> {
    const res = await fetch(`${API_BASE}/resumes/upload`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(err.error || 'Resume analysis failed');
    }
    return res.json();
  },

  async getResumes(): Promise<ResumeData[]> {
    const res = await fetch(`${API_BASE}/resumes`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch resumes');
    return res.json();
  },

  async getResume(): Promise<ResumeData | null> {
    const list = await this.getResumes();
    return list.length > 0 ? list[0] : null;
  },

  async deleteResume(id: string) {
    const res = await fetch(`${API_BASE}/resumes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete resume');
    return res.json();
  },

  // Jobs
  async analyzeJob(data: { raw_text: string; title?: string; company?: string; location?: string }): Promise<JobDescriptionData> {
    const res = await fetch(`${API_BASE}/jobs/analyze`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Analysis failed' }));
      throw new Error(err.error || 'Job analysis failed');
    }
    return res.json();
  },

  async getJobs(): Promise<JobDescriptionData[]> {
    const res = await fetch(`${API_BASE}/jobs`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
  },

  async createJob(data: { raw_text: string; title?: string; company?: string; location?: string; experience_level?: string }): Promise<JobDescriptionData> {
    return this.analyzeJob(data);
  },

  // Matching
  async analyzeMatch(data: { job_id: string; resume_id?: string }): Promise<{ match_id: string; job_title: string; company: string; explanation: JobMatchExplanation }> {
    const res = await fetch(`${API_BASE}/matching/analyze`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Match failed' }));
      throw new Error(err.error || 'Matching calculation failed');
    }
    return res.json();
  },

  // Skills
  async getSkills(): Promise<SkillItem[]> {
    const res = await fetch(`${API_BASE}/skills`);
    return res.json();
  },

  async getUserSkills(): Promise<SkillItem[]> {
    const res = await fetch(`${API_BASE}/skills/user`, { headers: getAuthHeaders() });
    return res.json();
  },

  async addUserSkill(skill_name: string, proficiency: 'Beginner' | 'Intermediate' | 'Advanced') {
    const res = await fetch(`${API_BASE}/skills/user`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ skill_name, proficiency })
    });
    return res.json();
  },

  async getSkillGaps(): Promise<{ target_role: string; gaps: SkillGapItem[] }> {
    const res = await fetch(`${API_BASE}/skills/gaps`, { headers: getAuthHeaders() });
    return res.json();
  },

  // Career Readiness & Future Readiness
  async getCareerReadiness(): Promise<CareerReadinessScore> {
    const res = await fetch(`${API_BASE}/career/readiness`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch career readiness');
    return res.json();
  },

  async getFutureReadiness(): Promise<FutureReadinessReport> {
    const res = await fetch(`${API_BASE}/career/future-readiness`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch future readiness');
    return res.json();
  },

  async getCareerRoles(): Promise<CareerRoleItem[]> {
    const res = await fetch(`${API_BASE}/career/roles`, { headers: getAuthHeaders() });
    return res.json();
  },

  // Trends
  async getTrends(role?: string): Promise<IndustryTrendItem[]> {
    const url = role ? `${API_BASE}/trends/${encodeURIComponent(role)}` : `${API_BASE}/trends`;
    const res = await fetch(url);
    return res.json();
  },

  // Roadmap
  async getRoadmap(): Promise<PersonalizedRoadmap> {
    const res = await fetch(`${API_BASE}/roadmap`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch roadmap');
    return res.json();
  },

  async generateRoadmap(): Promise<PersonalizedRoadmap> {
    const res = await fetch(`${API_BASE}/roadmap/generate`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to generate roadmap');
    return res.json();
  },

  async toggleRoadmapStep(stepId: string): Promise<PersonalizedRoadmap> {
    const res = await fetch(`${API_BASE}/roadmap/step/${stepId}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to toggle step');
    return res.json();
  },

  // Projects
  async getProjectRecommendations(): Promise<RecommendedProject[]> {
    const res = await fetch(`${API_BASE}/projects/recommendations`, { headers: getAuthHeaders() });
    return res.json();
  },

  async getProjects(): Promise<RecommendedProject[]> {
    return this.getProjectRecommendations();
  },

  // AI Assistant Chat (RAG-Grounded)
  async sendAssistantChat(message: string) {
    const res = await fetch(`${API_BASE}/assistant/chat`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Assistant failed' }));
      throw new Error(err.error || 'Chat failed');
    }
    return res.json();
  },

  // History
  async getHistory(): Promise<AnalysisHistoryItem[]> {
    const res = await fetch(`${API_BASE}/history`, { headers: getAuthHeaders() });
    return res.json();
  },

  async deleteHistory(id: string) {
    const res = await fetch(`${API_BASE}/history/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Courses
  async getCourses(): Promise<Course[]> {
    const res = await fetch(`${API_BASE}/courses`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch courses');
    return res.json();
  },

  async getCourse(id: string): Promise<Course> {
    const res = await fetch(`${API_BASE}/courses/${id}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch course');
    return res.json();
  },

  async updateCourseProgress(courseId: string, lessonId: string) {
    const res = await fetch(`${API_BASE}/courses/${courseId}/progress`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ lesson_id: lessonId })
    });
    if (!res.ok) throw new Error('Failed to update course progress');
    return res.json();
  },

  // Assessments
  async getAssessments(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/assessments`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch assessments');
    return res.json();
  },

  async getAssessment(id: string): Promise<Assessment> {
    const res = await fetch(`${API_BASE}/assessments/${id}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch assessment');
    return res.json();
  },

  async submitAssessment(id: string, answers: Array<{ question_id: string; selected_index: number }>) {
    const res = await fetch(`${API_BASE}/assessments/${id}/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ answers })
    });
    if (!res.ok) throw new Error('Failed to submit assessment');
    return res.json();
  },

  async getAssessmentAttempts(): Promise<AssessmentAttempt[]> {
    const res = await fetch(`${API_BASE}/assessments/attempts/history`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch assessment attempts');
    return res.json();
  },

  // Recruiter Readiness & Hub
  async getRecruiterReadiness(): Promise<RecruiterReadinessScore> {
    const res = await fetch(`${API_BASE}/recruiter/readiness`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch recruiter readiness');
    return res.json();
  },

  async getRecruiterJobs(): Promise<RecruiterJob[]> {
    const res = await fetch(`${API_BASE}/recruiter/jobs`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch recruiter jobs');
    return res.json();
  },

  async createRecruiterJob(data: Partial<RecruiterJob>): Promise<RecruiterJob> {
    const res = await fetch(`${API_BASE}/recruiter/jobs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create recruiter job');
    return res.json();
  },

  async updateRecruiterJob(id: string, data: Partial<RecruiterJob>): Promise<RecruiterJob> {
    const res = await fetch(`${API_BASE}/recruiter/jobs/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update recruiter job');
    return res.json();
  },

  async deleteRecruiterJob(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/recruiter/jobs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete recruiter job');
    return res.json();
  },

  async getRecruiterCandidates(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/recruiter/candidates`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch candidates');
    return res.json();
  },

  async updateCandidateStatus(candidateId: string, data: { job_id?: string; status: string; interview_date?: string; interview_notes?: string }) {
    const res = await fetch(`${API_BASE}/recruiter/candidates/${candidateId}/status`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update candidate status');
    return res.json();
  },

  // Resume Bullet Optimizer
  async improveBullet(data: { bullet_text: string; target_role?: string; section?: string }) {
    const res = await fetch(`${API_BASE}/resume/improve-bullet`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to generate bullet improvements');
    return res.json();
  },

  // Demo Controls
  async loadDemoData() {
    const res = await fetch(`${API_BASE}/demo/load`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load demo data');
    return res.json();
  },

  async clearDemoData() {
    const res = await fetch(`${API_BASE}/demo/clear`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to clear demo data');
    return res.json();
  }
};
