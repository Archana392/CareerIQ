import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import { OnboardingWizard } from './pages/OnboardingWizard';

const MainApp: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<string>('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center text-white space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        <p className="text-xs font-mono text-slate-400">Loading CareerIQ...</p>
      </div>
    );
  }

  // Public Marketing Views
  if (['landing', 'about', 'login', 'register'].includes(currentView)) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col font-sans">
        <Navbar currentView={currentView} setCurrentView={setCurrentView} />
        <main className="flex-1">
          {currentView === 'landing' && <LandingPage setCurrentView={setCurrentView} />}
          {currentView === 'about' && <AboutPage setCurrentView={setCurrentView} />}
          {currentView === 'login' && <LoginPage setCurrentView={setCurrentView} />}
          {currentView === 'register' && <RegisterPage setCurrentView={setCurrentView} />}
        </main>
      </div>
    );
  }

  // If user is not logged in and tries to access an authenticated view, default to dashboard
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col font-sans">
        <Navbar currentView="landing" setCurrentView={setCurrentView} />
        <main className="flex-1">
          <LandingPage setCurrentView={setCurrentView} />
        </main>
      </div>
    );
  }

  // Authenticated App Shell with Sidebar & Content Area
  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col font-sans text-slate-900">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      <div className="flex-1 flex overflow-hidden">
        {/* App Sidebar Navigation */}
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />

        {/* Main Interactive Screen Content */}
        <main className="flex-1 overflow-y-auto bg-[#F1F5F9] p-2 sm:p-3 lg:p-4">
          <div className="bg-white min-h-[calc(100vh-4.5rem)] rounded-xl border border-slate-200 shadow-2xs overflow-hidden text-slate-900">
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
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
