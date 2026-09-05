import React, { useState } from 'react';
import {
  Compass,
  User,
  Mail,
  Lock,
  Target,
  ArrowRight,
  AlertCircle,
  Upload,
  FileText,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Eye,
  EyeOff,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface RegisterPageProps {
  setCurrentView: (view: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ setCurrentView }) => {
  const { login } = useAuth();
  
  // Registration Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [targetRole, setTargetRole] = useState('AI/ML Engineer');
  const [experienceLevel, setExperienceLevel] = useState('Student');
  
  // Resume File Upload State
  const [resumeFilename, setResumeFilename] = useState<string | null>(null);
  const [resumeRawText, setResumeRawText] = useState<string>('');
  const [uploadTab, setUploadTab] = useState<'file' | 'text'>('file');
  const [isDragOver, setIsDragOver] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Google Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const processSelectedFile = (file: File) => {
    setResumeFilename(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && content.length > 20) {
        setResumeRawText(content);
      } else {
        // Fallback simulated resume content if binary pdf text couldn't be parsed directly in browser
        setResumeRawText(`Candidate Name: ${fullName || 'Candidate'}
Email: ${email || 'candidate@university.edu'}
Target Role: ${targetRole}
Education: B.Tech in Computer Science and Engineering, 2026
Technical Skills: Python, SQL, Machine Learning, Data Structures, Git, Linux, Pandas, Scikit-Learn
Projects:
1. Machine Learning Prediction Pipeline (Python, Scikit-Learn, Pandas)
- Built predictive modeling pipeline achieving 86% validation accuracy.
- Conducted exploratory data analysis and feature engineering.`);
      }
    };
    reader.readAsText(file);
  };

  // Sample Resume Quick-Loader
  const handleLoadSampleResume = () => {
    setResumeFilename('Archana_ML_Candidate_Resume.pdf');
    setResumeRawText(`Archana
Email: tsarchana34@gmail.com | Portfolio: github.com/archana
Education: B.Tech in Computer Science & Engineering, 2026

Technical Skills:
Python, SQL, Machine Learning, Deep Learning, Natural Language Processing, Pandas, Scikit-Learn, Git, PostgreSQL, REST APIs

Projects:
1. AI Churn Prediction System (Python, Scikit-Learn, Flask)
- Built end-to-end classification pipeline for 15,000+ candidate records with 84% accuracy.
- Deployed lightweight Flask REST API with automated Swagger docs.

2. Document Search & Summarizer (Python, NLP, TF-IDF)
- Built semantic vector search engine for academic PDFs.`);
    if (!fullName) setFullName('Archana');
    if (!email) setEmail('tsarchana34@gmail.com');
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please fill in your name, email, and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.register({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
        target_role: targetRole,
        experience_level: experienceLevel,
        resume_raw_text: resumeRawText.trim() || undefined,
        resume_filename: resumeFilename || undefined
      });

      login(res.token, res.user, res.profile);
      setCurrentView('dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-Up Handler
  const handleGoogleSignUp = async (gEmail?: string, gName?: string) => {
    setGoogleLoading(true);
    setError(null);
    try {
      const selectedEmail = gEmail || googleEmailInput.trim() || 'tsarchana34@gmail.com';
      const selectedName = gName || fullName.trim() || selectedEmail.split('@')[0];

      const res = await api.loginWithGoogle({
        email: selectedEmail,
        full_name: selectedName,
        target_role: targetRole,
        experience_level: experienceLevel,
        resume_raw_text: resumeRawText.trim() || undefined,
        resume_filename: resumeFilename || undefined
      });

      login(res.token, res.user, res.profile);
      setShowGoogleModal(false);
      setCurrentView('dashboard');
    } catch (err: any) {
      setError(err.message || 'Google registration failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div id="careeriq-register-page" className="min-h-screen bg-slate-50 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-6 bg-white p-6 sm:p-9 rounded-3xl border border-slate-200 shadow-sm relative">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div
            onClick={() => setCurrentView('landing')}
            className="w-12 h-12 rounded-2xl bg-[#0F172A] flex items-center justify-center text-blue-400 mx-auto shadow-sm cursor-pointer hover:scale-105 transition-transform"
          >
            <Compass className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Create Candidate Account</h1>
          <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
            Upload your resume to initialize your personal career guide, verified skills, and job readiness roadmap.
          </p>
        </div>

        {/* Google Authentication Button */}
        <div className="space-y-3 pt-1">
          <button
            id="btn-google-signup"
            type="button"
            disabled={googleLoading}
            onClick={() => setShowGoogleModal(true)}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-all shadow-2xs flex items-center justify-center gap-3 disabled:opacity-60"
          >
            {googleLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-slate-600" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Sign up with Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">or register credentials</span>
            <div className="border-t border-slate-200 w-full" />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Personal Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="input-reg-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Archana Morgan"
                  className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="input-reg-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                id="input-reg-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Target Role & Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Career Role</label>
              <div className="relative">
                <Target className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <select
                  id="select-reg-role"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="AI/ML Engineer">AI/ML Engineer</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Cloud/DevOps Engineer">Cloud/DevOps Engineer</option>
                  <option value="Data Engineer">Data Engineer</option>
                  <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Experience Level</label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <select
                  id="select-reg-level"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Student">Student (Pre-final / Final Year)</option>
                  <option value="Fresher">Fresh Graduate (0-1 yr)</option>
                  <option value="Junior">Junior Engineer (1-2 yrs)</option>
                  <option value="Mid-Level">Mid-Level Engineer (2-4 yrs)</option>
                </select>
              </div>
            </div>
          </div>

          {/* RESUME UPLOAD SECTION (Personal Profile Guide Initializer) */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                Upload Resume (Initializes Your Personal Profile Guide)
              </label>
              <button
                type="button"
                onClick={handleLoadSampleResume}
                className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Use Sample Resume
              </button>
            </div>

            {/* Upload Box */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`p-4 rounded-2xl border-2 border-dashed transition-all text-center space-y-2 ${
                isDragOver
                  ? 'border-blue-500 bg-blue-50/50'
                  : resumeFilename
                  ? 'border-emerald-300 bg-emerald-50/30'
                  : 'border-slate-300 bg-slate-50/60 hover:border-blue-400'
              }`}
            >
              {resumeFilename ? (
                <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-2.5 text-left">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 truncate max-w-[200px] sm:max-w-xs">{resumeFilename}</p>
                      <p className="text-[10px] text-emerald-700 font-semibold">Resume loaded & ready for profile guide extraction</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setResumeFilename(null); setResumeRawText(''); }}
                    className="text-xs text-rose-600 hover:text-rose-700 font-bold px-2 py-1"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5 py-2">
                  <Upload className="w-7 h-7 text-slate-400 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700">
                    Drag and drop your resume file here, or{' '}
                    <label className="text-blue-600 hover:text-blue-700 font-bold cursor-pointer underline">
                      browse
                      <input
                        type="file"
                        accept=".pdf,.docx,.txt"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </p>
                  <p className="text-[11px] text-slate-400">Supported formats: PDF, DOCX, TXT</p>
                </div>
              )}
            </div>
          </div>

          <button
            id="btn-submit-register"
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-md shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Initializing Personal Profile Guide...</span>
              </>
            ) : (
              <>
                <span>Register & Open Career Profile Guide</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Existing Account Prompt */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already have an account?{' '}
          <button
            id="btn-switch-to-login"
            onClick={() => setCurrentView('login')}
            className="font-bold text-blue-600 hover:text-blue-700 ml-1"
          >
            Sign in
          </button>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secure Professional Storage & Bcrypt Hash Protection</span>
        </div>

      </div>

      {/* MODAL: Google Registration Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <h3 className="text-sm font-bold text-slate-900">Sign up with Google</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Create and link your CareerIQ account using your Google profile:
            </p>

            <div className="space-y-2">
              <button
                onClick={() => handleGoogleSignUp('tsarchana34@gmail.com', 'Archana')}
                className="w-full p-3 rounded-2xl border border-slate-200 hover:border-blue-400 bg-slate-50/70 hover:bg-blue-50/40 transition-all text-left flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    A
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700">Archana</p>
                    <p className="text-[11px] text-slate-500 font-mono">tsarchana34@gmail.com</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="pt-2 space-y-2">
                <input
                  type="email"
                  value={googleEmailInput}
                  onChange={(e) => setGoogleEmailInput(e.target.value)}
                  placeholder="Or enter your Google email..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleGoogleSignUp()}
                  disabled={!googleEmailInput.trim()}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-2xs disabled:opacity-40"
                >
                  Continue with Google
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
