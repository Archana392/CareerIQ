import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Upload,
  FileText,
  Sparkles,
  ArrowRight,
  Target,
  GraduationCap,
  Briefcase,
  AlertCircle,
  RefreshCw,
  Code,
  Layers,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface OnboardingWizardProps {
  setCurrentView: (view: string) => void;
}

const AVAILABLE_ROLES = [
  { id: 'AI/ML Engineer', title: 'AI/ML Engineer', category: 'Artificial Intelligence', icon: Sparkles, desc: 'Model training, neural networks, PyTorch, scikit-learn, MLOps, LLMs' },
  { id: 'Full Stack Developer', title: 'Full Stack Developer', category: 'Software Engineering', icon: Code, desc: 'Modern web apps, React, Node.js, TypeScript, PostgreSQL, REST APIs' },
  { id: 'Data Scientist', title: 'Data Scientist', category: 'Data & Analytics', icon: Layers, desc: 'Statistical modeling, Python, SQL, hypothesis testing, visualization' },
  { id: 'DevOps / Cloud Engineer', title: 'DevOps / Cloud Engineer', category: 'Infrastructure', icon: Compass, desc: 'Docker, Kubernetes, AWS, CI/CD pipelines, Terraform, Linux' }
];

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ setCurrentView }) => {
  const { profile, refreshProfile, loadDemoMode } = useAuth();
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [targetRole, setTargetRole] = useState(profile?.target_role || 'AI/ML Engineer');
  const [experienceLevel, setExperienceLevel] = useState(profile?.experience_level || 'Student');
  
  // Resume state
  const [filename, setFilename] = useState<string>('My_Resume.pdf');
  const [rawText, setRawText] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [detectedSkills, setDetectedSkills] = useState<string[]>([]);
  const [atsScore, setAtsScore] = useState<number>(0);

  const sampleStudentResume = `
Name: ${profile?.full_name || 'Student Candidate'}
Email: ${profile?.email || 'candidate@careeriq.edu'}
Target Role: ${targetRole}

EDUCATION:
Bachelor of Technology in Computer Science & Engineering (2022 - 2026)
CGPA: 8.7 / 10

TECHNICAL SKILLS:
- Languages: Python, JavaScript, TypeScript, SQL, C++
- Frameworks & Libraries: PyTorch, Scikit-learn, Pandas, NumPy, FastAPI
- Databases & Tools: PostgreSQL, Git, Linux, Docker, REST APIs

PROJECTS:
1. Customer Churn Prediction Model (Python, Scikit-Learn)
- Built classification model achieving 85% accuracy on 12,000 customer records.
- Conducted exploratory data analysis, missing data handling, and feature selection.

2. Document Search & Summarizer (FastAPI, Python)
- Built semantic indexing API using cosine similarity and TF-IDF vectors.
- Containerized backend using Docker for reproducible deployment.
`.trim();

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFilename(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) setRawText(text);
      };
      reader.readAsText(file);
    }
  };

  const handleSaveRole = async () => {
    try {
      await api.updateProfile({ target_role: targetRole, experience_level: experienceLevel });
      await refreshProfile();
      setStep(2);
    } catch (err: any) {
      setStep(2); // proceed even if profile update warning
    }
  };

  const handleAnalyzeResume = async () => {
    if (!rawText.trim() || rawText.length < 30) {
      setUploadError('Please provide resume text (at least 30 characters) or click "Use Sample Resume".');
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      const res = await api.uploadResume({ filename, raw_text: rawText });
      setDetectedSkills(res.detected_skills?.map((s: any) => s.name) || []);
      setAtsScore(res.ats_analysis?.ats_score || 82);
      setUploadSuccess(true);
      await refreshProfile();
      setStep(3);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to process resume. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSkipResume = () => {
    setStep(3);
  };

  const handleComplete = () => {
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Wizard Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Compass className="w-3.5 h-3.5" />
            <span>CareerIQ Smart Onboarding</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Personalize Your Career Intelligence
          </h1>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Set your target goals and upload your resume to calibrate your ATS scores, skill gaps, and custom roadmap.
          </p>
        </div>

        {/* Stepper Progress */}
        <div className="grid grid-cols-3 gap-3 p-2 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold transition-all ${step === 1 ? 'bg-blue-50 text-blue-700' : step > 1 ? 'text-emerald-700' : 'text-slate-400'}`}>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${step === 1 ? 'bg-blue-600 text-white' : step > 1 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
              {step > 1 ? <CheckCircle2 className="w-3.5 h-3.5" /> : '1'}
            </div>
            <span className="hidden sm:inline">1. Target Career</span>
            <span className="sm:hidden">Goal</span>
          </div>

          <div className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold transition-all ${step === 2 ? 'bg-blue-50 text-blue-700' : step > 2 ? 'text-emerald-700' : 'text-slate-400'}`}>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${step === 2 ? 'bg-blue-600 text-white' : step > 2 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
              {step > 2 ? <CheckCircle2 className="w-3.5 h-3.5" /> : '2'}
            </div>
            <span className="hidden sm:inline">2. Resume Calibration</span>
            <span className="sm:hidden">Resume</span>
          </div>

          <div className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold transition-all ${step === 3 ? 'bg-blue-50 text-blue-700' : 'text-slate-400'}`}>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${step === 3 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
              3
            </div>
            <span className="hidden sm:inline">3. Baseline & Launch</span>
            <span className="sm:hidden">Launch</span>
          </div>
        </div>

        {/* STEP 1: TARGET ROLE & EXPERIENCE */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Select Your Target Career Track</h2>
              <p className="text-xs text-slate-500 mt-1">
                CareerIQ compares your resume and verified skills against live market requirements for this role.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AVAILABLE_ROLES.map((r) => {
                const Icon = r.icon;
                const isSelected = targetRole === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => setTargetRole(r.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {r.category}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{r.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{r.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Experience Level */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700">Current Experience Stage</label>
              <div className="grid grid-cols-3 gap-2">
                {['Student', 'Entry-Level (0-2 yrs)', 'Mid-Level (2-5 yrs)'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setExperienceLevel(lvl)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      experienceLevel === lvl
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSaveRole}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs flex items-center gap-2 transition-all"
              >
                <span>Continue to Resume Calibration</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: RESUME UPLOAD */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Upload or Paste Your Resume</h2>
                <p className="text-xs text-slate-500 mt-1">
                  CareerIQ extracts verified skills and tests ATS compatibility against <strong className="text-blue-600">{targetRole}</strong>.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setRawText(sampleStudentResume)}
                className="px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Fill Sample Student Resume
              </button>
            </div>

            {uploadError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Resume Document</span>
                <label className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline">
                  <span>Browse .pdf / .txt file</span>
                  <input type="file" accept=".txt,.pdf,.docx,.doc" onChange={handleSelectFile} className="hidden" />
                </label>
              </div>

              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="Resume_Filename.pdf"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                rows={7}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste your resume content or click 'Fill Sample Student Resume'..."
                className="w-full p-3 text-xs font-mono rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSkipResume}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Skip for now (explore in State A)
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleAnalyzeResume}
                  disabled={uploading}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  <span>{uploading ? 'Analyzing Resume...' : 'Analyze & Calibrate'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: BASELINE & LAUNCH */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Career Profile Calibrated!</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Target Role configured as <strong className="text-slate-800">{targetRole}</strong>.
              </p>
            </div>

            {detectedSkills.length > 0 ? (
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Initial ATS Score</span>
                    <p className="text-2xl font-extrabold text-blue-600 font-mono mt-0.5">{atsScore} / 100</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800">
                    {detectedSkills.length} Skills Verified
                  </span>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-700 mb-2">Detected Technical Skills:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {detectedSkills.map((sk, i) => (
                      <span key={i} className="px-2.5 py-1 rounded text-xs font-semibold bg-white border border-slate-200 text-slate-800 shadow-2xs">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-xl bg-blue-50/70 border border-blue-200 text-center space-y-2">
                <p className="text-xs font-bold text-blue-900">Starting in State A (New User Mode)</p>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  No resume was uploaded yet. Your dashboard will guide you through uploading a resume or taking skill quizzes to calculate your readiness.
                </p>
              </div>
            )}

            <div className="flex items-center justify-center pt-2">
              <button
                type="button"
                onClick={handleComplete}
                className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-2 transition-all"
              >
                <span>Launch CareerIQ Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
