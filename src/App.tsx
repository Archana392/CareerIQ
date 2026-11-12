import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardView } from './pages/DashboardView';
import { ProfileView } from './pages/ProfileView';
import { ResumeAnalyzerView } from './pages/ResumeAnalyzerView';
import { JobsView } from './pages/JobsView';
import { CareerPathView } from './pages/CareerPathView';
import { AssistantView } from './pages/AssistantView';
import { SettingsView } from './pages/SettingsView';
import { CoursesView } from './pages/CoursesView';
import { RecruiterView } from './pages/RecruiterView';
import { RecruiterDemandView } from './pages/RecruiterDemandView';
import { OnboardingWizard } from './pages/OnboardingWizard';
import { UserPlus, Sparkles, X, Compass, AlertCircle } from 'lucide-react';

const MainApp: React.FC = () => {
  const { user, loading, promptGuestSignup, setPromptGuestSignup, isGuest, guestSessionsLeft } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Initialize view from URL hash or persistent user session
  const [currentView, setCurrentView] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#\/?/, '').trim();
      if (hash) return hash;
    }
    return localStorage.getItem('careeriq_token') ? 'dashboard' : 'landing';
  });

  // Keep hash synchronized with view changes for direct links and browser refresh
  useEffect(() => {
    if (currentView) {
      const cleanHash = window.location.hash.replace(/^#\/?/, '').trim();
      if (cleanHash !== currentView) {
        window.location.hash = currentView;
      }
    }
  }, [currentView]);

  // Support browser Back/Forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').trim();
      if (hash && hash !== currentView) {
        setCurrentView(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentView]);

  // Unauthenticated guard: redirect unauthenticated access of protected views to login
  useEffect(() => {
    if (!loading && !user) {
      const publicViews = ['landing', 'about', 'login', 'register'];
      if (!publicViews.includes(currentView)) {
        setCurrentView('login');
      }
    }
  }, [loading, user, currentView]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] flex flex-col items-center justify-center text-[#172033] dark:text-[#F8FAFC] space-y-3 transition-colors">
        <div className="w-9 h-9 rounded-full border-3 border-blue-600 border-t-transparent animate-spin" />
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading CareerIQ...</p>
      </div>
    );
  }

  // Public Marketing Views (Landing, Features/About, Login, Register)
  if (['landing', 'about', 'login', 'register'].includes(currentView) || !user) {
    const viewToRender = user ? currentView : (['landing', 'about', 'login', 'register'].includes(currentView) ? currentView : 'login');
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] flex flex-col font-sans text-[#172033] dark:text-[#F8FAFC] transition-colors">
        <Navbar
          currentView={viewToRender}
          setCurrentView={setCurrentView}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <main className="flex-1">
          {viewToRender === 'landing' && <LandingPage setCurrentView={setCurrentView} />}
          {viewToRender === 'about' && <AboutPage setCurrentView={setCurrentView} />}
          {viewToRender === 'login' && <LoginPage setCurrentView={setCurrentView} />}
          {viewToRender === 'register' && <RegisterPage setCurrentView={setCurrentView} />}
        </main>
      </div>
    );
  }

  // Authenticated App Shell with Sidebar & Content Area
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] flex flex-col font-sans text-[#172033] dark:text-[#F8FAFC] transition-colors">
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* App Sidebar Navigation */}
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        {/* Main Interactive Screen Content */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] dark:bg-[#090D16] p-2 sm:p-3 lg:p-4 transition-colors">
          <div className="bg-white dark:bg-slate-900 min-h-[calc(100vh-4.5rem)] rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden text-slate-900 dark:text-slate-100 transition-colors">
            {currentView === 'dashboard' && <DashboardView setCurrentView={setCurrentView} />}
            
            {/* Consolidated Resume Experience */}
            {(currentView === 'resume' || currentView === 'diagnostics' || currentView === 'ats_checker') && (
              <ResumeAnalyzerView />
            )}

            {/* Consolidated Jobs Experience */}
            {(currentView === 'jobs' || currentView === 'job_analyzer' || currentView === 'matching' || currentView === 'recommendations') && (
              <JobsView setCurrentView={setCurrentView} />
            )}

            {/* Consolidated Career Path Experience */}
            {(currentView === 'career-path' || currentView === 'career_path' || currentView === 'career-paths' || currentView === 'skill-gaps' || currentView === 'skill_gaps' || currentView === 'roadmap' || currentView === 'projects' || currentView === 'trends' || currentView === 'readiness' || currentView === 'future-readiness' || currentView === 'future_readiness') && (
              <CareerPathView setCurrentView={setCurrentView} />
            )}

            {/* Courses & Skill Assessments */}
            {currentView === 'courses' && <CoursesView />}

            {/* Recruiter Intelligence & Hub */}
            {currentView === 'recruiter' && <RecruiterView />}

            {/* Recruiter Demand Dynamic Analytics */}
            {(currentView === 'recruiter-demand' || currentView === 'recruiter_demand') && (
              <RecruiterDemandView setCurrentView={setCurrentView} />
            )}

            {/* First-Time Onboarding Wizard */}
            {currentView === 'onboarding' && <OnboardingWizard setCurrentView={setCurrentView} />}

            {/* CareerIQ AI Mentor */}
            {currentView === 'assistant' && <AssistantView />}

            {/* Profile & Settings */}
            {currentView === 'profile' && <ProfileView />}
            {currentView === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>

      {/* Guest Limit Reached / Upgrade Modal */}
      {promptGuestSignup && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Guest Trial Limit</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Save your progress with a free account</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPromptGuestSignup(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/80 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                You have reached the maximum 3 guest preview sessions. Create a free account or sign in to continue using CareerIQ with unlimited access and persistent data.
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <p className="font-semibold text-slate-900 dark:text-white">Signing up unlocks:</p>
              <ul className="space-y-1 list-disc list-inside text-slate-500 dark:text-slate-400 text-[11px]">
                <li>Permanent cloud storage for your resumes & analyses</li>
                <li>Unlimited ATS diagnostics & skill-gap assessments</li>
                <li>Personalized learning roadmaps & progress tracking</li>
                <li>Job application matching & recruiter hub access</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setPromptGuestSignup(false);
                  setCurrentView('login');
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setPromptGuestSignup(false);
                  setCurrentView('register');
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-2xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Free Account</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
