import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Compass,
  GraduationCap,
  ShieldCheck,
  Bot,
  User,
  Settings,
  Sparkles,
  LogOut,
  UploadCloud,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  isOpen,
  setIsOpen
}) => {
  const { user, profile, logout, loadDemoMode, clearDemoMode } = useAuth();
  const [demoLoading, setDemoLoading] = React.useState(false);

  const primaryNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'resume', label: 'Resume Analyzer', icon: FileText },
    { id: 'jobs', label: 'Jobs & Matching', icon: Briefcase },
    { id: 'career-path', label: 'Career Path', icon: Compass },
    { id: 'courses', label: 'Courses & Quizzes', icon: GraduationCap },
    { id: 'recruiter', label: 'Recruiter Hub', icon: ShieldCheck },
    { id: 'assistant', label: 'CareerIQ AI', icon: Bot, isSpecial: true }
  ];

  const secondaryNavItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleSelect = (id: string) => {
    setCurrentView(id);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const handleDemoToggle = async () => {
    setDemoLoading(true);
    try {
      if (profile?.resume_uploaded) {
        await clearDemoMode();
      } else {
        await loadDemoMode();
      }
    } catch (e) {
      console.error('Demo switch error:', e);
    } finally {
      setDemoLoading(false);
    }
  };

  const hasResume = Boolean(profile?.resume_uploaded);
  const readinessScore = hasResume ? (profile?.readiness_score || 78) : 0;

  const isCareerPathActive = [
    'career-path',
    'career_path',
    'roadmap',
    'skill-gaps',
    'skill_gaps',
    'trends',
    'projects',
    'career-paths',
    'career_paths',
    'readiness',
    'future-readiness',
    'future_readiness'
  ].includes(currentView);

  const isJobsActive = ['jobs', 'job_analyzer', 'matching'].includes(currentView);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          id="sidebar-mobile-overlay"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-950/60 z-30 lg:hidden backdrop-blur-xs transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Modern, Clean Dark Navy Sidebar */}
      <aside
        id="careeriq-sidebar"
        className={`fixed lg:sticky top-13 z-35 h-[calc(100vh-3.25rem)] w-64 shrink-0 bg-[#0F172A] border-r border-slate-800 transition-transform duration-150 ease-in-out lg:translate-x-0 overflow-y-auto flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-3.5 space-y-4">
          
          {/* User Quick Target Status (DATA-DRIVEN & STATE-AWARE) */}
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Target Role</span>
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                hasResume
                  ? 'text-emerald-400 bg-emerald-950/80 border border-emerald-800/60'
                  : 'text-amber-400 bg-amber-950/80 border border-amber-800/60'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${hasResume ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                {hasResume ? 'Active' : 'Setup'}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-100 truncate">{profile?.target_role || 'AI/ML Candidate'}</p>
            
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>Career Readiness</span>
              {hasResume ? (
                <span className="font-bold text-blue-400">{readinessScore} / 100</span>
              ) : (
                <span className="font-semibold text-amber-400">Pending Resume</span>
              )}
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${hasResume ? 'bg-blue-500' : 'bg-slate-700'}`}
                style={{ width: `${hasResume ? readinessScore : 0}%` }}
              />
            </div>

            {!hasResume && (
              <button
                onClick={() => setCurrentView('resume')}
                className="mt-2 w-full py-1 px-2 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-[10px] font-bold text-blue-300 flex items-center justify-center gap-1 transition-colors"
              >
                <UploadCloud className="w-3 h-3" />
                <span>Upload Resume</span>
              </button>
            )}
          </div>

          {/* Primary Navigation */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
              Main Menu
            </p>
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              let isActive = currentView === item.id;
              if (item.id === 'career-path' && isCareerPathActive) isActive = true;
              if (item.id === 'jobs' && isJobsActive) isActive = true;

              return (
                <button
                  key={item.id}
                  id={`sidebar-nav-${item.id}`}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/90 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.isSpecial && (
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-blue-500/80 text-white'
                          : 'bg-indigo-950 text-indigo-300 border border-indigo-800/60'
                      }`}
                    >
                      AI
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-800 my-2"></div>

          {/* Secondary Navigation (Profile & Settings) */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
              Account
            </p>
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-nav-${item.id}`}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Demo Mode Switcher Pill */}
          <div className="pt-2">
            <button
              onClick={handleDemoToggle}
              disabled={demoLoading}
              className={`w-full p-2.5 rounded-xl border text-[11px] font-bold flex items-center justify-between transition-all ${
                hasResume
                  ? 'bg-slate-900/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                  : 'bg-blue-950/40 border-blue-800/60 text-blue-300 hover:bg-blue-900/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <RotateCcw className={`w-3.5 h-3.5 ${demoLoading ? 'animate-spin' : ''}`} />
                <span>{hasResume ? 'Reset to New User' : 'Load Demo Profile'}</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                {hasResume ? 'Loaded' : 'Sample'}
              </span>
            </button>
          </div>

        </div>

        {/* User Card at Bottom */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between gap-2">
            <div
              onClick={() => handleSelect('profile')}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-300 font-bold text-xs">
                {(user?.full_name || profile?.full_name || 'A').charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-200 truncate group-hover:text-white transition-colors">
                  {user?.full_name || profile?.full_name || 'Candidate'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {profile?.target_role || 'AI/ML Track'}
                </p>
              </div>
            </div>
            <button
              id="sidebar-logout-btn"
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>
    </>
  );
};

