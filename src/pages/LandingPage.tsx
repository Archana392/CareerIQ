import React from 'react';
import {
  Sparkles,
  ArrowRight,
  FileText,
  Compass,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/common/Logo';

interface LandingPageProps {
  setCurrentView: (view: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setCurrentView }) => {
  const { user, loginAsGuest, guestSessionsLeft, canUseGuest, setPromptGuestSignup } = useAuth();
  const [guestLoading, setGuestLoading] = React.useState(false);

  // Handle Guest Explorer Access (allows 3 free trial sessions without registering)
  const handleExploreAsGuest = async () => {
    if (user) {
      setCurrentView('dashboard');
      return;
    }
    if (!canUseGuest) {
      setPromptGuestSignup(true);
      return;
    }
    setGuestLoading(true);
    try {
      const res = await loginAsGuest();
      if (res.success) {
        setCurrentView('dashboard');
      } else {
        setPromptGuestSignup(true);
      }
    } catch (err) {
      console.error('Guest exploration error:', err);
    } finally {
      setGuestLoading(false);
    }
  };

  // Launch Dashboard: If authenticated -> Dashboard; if not -> Sign In / Get Started flow
  const handleLaunchDashboard = () => {
    if (user) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('login');
    }
  };

  // Get Started: If unauthenticated -> Registration; if authenticated -> Dashboard
  const handleGetStarted = () => {
    if (user) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('register');
    }
  };

  // Analyze Resume: If authenticated -> Resume Analyzer; if unauthenticated -> Sign In
  const handleAnalyzeResume = () => {
    if (user) {
      setCurrentView('resume');
    } else {
      setCurrentView('login');
    }
  };

  return (
    <div id="careeriq-landing-page" className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] flex flex-col text-[#172033] dark:text-[#F8FAFC] selection:bg-blue-600 selection:text-white transition-colors">
      
      {/* 1. Hero Section */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 bg-white dark:bg-slate-900 border-b border-[#E2E8F0] dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#EFF6FF] dark:bg-blue-950/80 text-[#2563EB] dark:text-blue-300 border border-[#BFDBFE] dark:border-blue-800 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>AI Powered Career Intelligence & Employability Platform</span>
          </div>

          {/* Headline */}
          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#172033] dark:text-white leading-tight">
              Know Where You Stand. <br />
              <span className="text-[#2563EB] dark:text-blue-400">Know What Comes Next.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#64748B] dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Bridge the gap between your current skills, target job requirements, and industry hiring standards with objective diagnostics, ATS analysis, and personalized roadmaps.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
            <button
              id="btn-hero-launch-dashboard"
              onClick={handleLaunchDashboard}
              className="w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>{user ? 'Open Dashboard' : 'Sign In / Register'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {!user && (
              <button
                id="btn-hero-try-guest"
                onClick={handleExploreAsGuest}
                disabled={guestLoading}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 border border-emerald-300 dark:border-emerald-800 transition-colors flex items-center justify-center gap-2 shadow-2xs cursor-pointer disabled:opacity-60"
              >
                <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{guestLoading ? 'Starting Session...' : 'Explore as Guest'}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-mono bg-emerald-200/70 dark:bg-emerald-800/80 text-emerald-800 dark:text-emerald-200">
                  {guestSessionsLeft > 0 ? `${guestSessionsLeft} free` : 'Login needed'}
                </span>
              </button>
            )}

            <button
              id="btn-hero-analyze-resume"
              onClick={handleAnalyzeResume}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm text-[#172033] dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-[#F8FAFC] dark:hover:bg-slate-700 border border-[#E2E8F0] dark:border-slate-700 transition-colors flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
              <span>Analyze Resume</span>
            </button>
          </div>

          {!user && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              ⚡ No credit card or registration required. Try all features immediately with <strong className="text-emerald-600 dark:text-emerald-400">3 free guest passes</strong>.
            </p>
          )}

          {/* Credibility Stats */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-center">
            <div className="p-4 bg-[#F8FAFC] dark:bg-slate-800/60 rounded-xl border border-[#E2E8F0] dark:border-slate-800">
              <p className="text-2xl font-extrabold text-[#172033] dark:text-white font-mono">100%</p>
              <p className="text-xs text-[#64748B] dark:text-slate-400 font-medium mt-0.5">Objective Scoring</p>
            </div>
            <div className="p-4 bg-[#F8FAFC] dark:bg-slate-800/60 rounded-xl border border-[#E2E8F0] dark:border-slate-800">
              <p className="text-2xl font-extrabold text-[#2563EB] dark:text-blue-400 font-mono">300+</p>
              <p className="text-xs text-[#64748B] dark:text-slate-400 font-medium mt-0.5">Skill Taxonomy</p>
            </div>
            <div className="p-4 bg-[#F8FAFC] dark:bg-slate-800/60 rounded-xl border border-[#E2E8F0] dark:border-slate-800">
              <p className="text-2xl font-extrabold text-[#172033] dark:text-white font-mono">5-Step</p>
              <p className="text-xs text-[#64748B] dark:text-slate-400 font-medium mt-0.5">Learning Milestones</p>
            </div>
            <div className="p-4 bg-[#F8FAFC] dark:bg-slate-800/60 rounded-xl border border-[#E2E8F0] dark:border-slate-800">
              <p className="text-2xl font-extrabold text-[#2563EB] dark:text-blue-400 font-mono">Dynamic</p>
              <p className="text-xs text-[#64748B] dark:text-slate-400 font-medium mt-0.5">Role Matching</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Structured SaaS Workflow */}
      <section className="py-16 bg-[#F8FAFC] dark:bg-[#090D16] border-b border-[#E2E8F0] dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] dark:text-blue-400">Core Architecture</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] dark:text-white tracking-tight">
              Structured Progression to Job Readiness
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400">
              Step-by-step guidance from baseline assessment to verified hiring qualification.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-2xs space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] dark:bg-blue-950/80 text-[#2563EB] dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="text-sm font-bold text-[#172033] dark:text-white">Resume Diagnostics</h3>
              <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">
                Extract confirmed technical skills, verify ATS formatting, and identify missing bullet point impact metrics.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-2xs space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] dark:bg-blue-950/80 text-[#2563EB] dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="text-sm font-bold text-[#172033] dark:text-white">Career Readiness</h3>
              <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">
                Receive an objective 0–100% readiness score across core programming, domain tools, backend APIs, and systems.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-2xs space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] dark:bg-blue-950/80 text-[#2563EB] dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="text-sm font-bold text-[#172033] dark:text-white">Personalized Roadmap</h3>
              <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">
                Follow an actionable step-by-step curriculum with curated learning actions and recommended capstone projects.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-2xs space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] dark:bg-blue-950/80 text-[#2563EB] dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                4
              </div>
              <h3 className="text-sm font-bold text-[#172033] dark:text-white">Dynamic Role Matching</h3>
              <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">
                Compare your verified skills against live market job descriptions to understand what you have and what you need.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 3. Call to Action Banner */}
      <section className="py-14 bg-white dark:bg-slate-900 border-b border-[#E2E8F0] dark:border-slate-800 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <h2 className="text-2xl font-bold text-[#172033] dark:text-white">
            Start Navigating Your Tech Career
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 max-w-xl mx-auto">
            Create a profile, select your target role, and upload your resume to generate an authentic skill gap analysis.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <button
              id="btn-cta-get-started"
              onClick={handleGetStarted}
              className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors shadow-xs cursor-pointer"
            >
              Get Started Free
            </button>
            {!user && (
              <button
                id="btn-cta-guest-try"
                onClick={handleExploreAsGuest}
                disabled={guestLoading}
                className="px-6 py-2.5 rounded-xl font-bold text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-emerald-800 transition-colors shadow-2xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Try as Guest ({guestSessionsLeft > 0 ? `${guestSessionsLeft} free` : 'Sign up'})</span>
              </button>
            )}
            <button
              id="btn-cta-learn-features"
              onClick={() => setCurrentView('about')}
              className="px-6 py-2.5 rounded-xl font-semibold text-xs text-[#172033] dark:text-slate-200 bg-[#F8FAFC] dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-[#E2E8F0] dark:border-slate-700 transition-colors cursor-pointer"
            >
              View System Features
            </button>
          </div>
        </div>
      </section>

      {/* 4. Professional SaaS Footer */}
      <footer className="bg-white dark:bg-slate-900 text-[#64748B] dark:text-slate-400 text-xs py-8 mt-auto border-t border-slate-100 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" showText={true} subtitle="AI-Powered Career Intelligence" onClick={() => setCurrentView('landing')} />
          <p className="text-[#64748B] dark:text-slate-500 text-[11px]">
            © {new Date().getFullYear()} CareerIQ. Transparent career intelligence for modern tech professionals.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
