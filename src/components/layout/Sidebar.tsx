import React, { useState, useEffect } from 'react';
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
  LogOut,
  UploadCloud,
  RotateCcw,
  TrendingUp,
  Trash2,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';

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
  const { user, profile, logout, loadDemoMode, clearDemoMode, refreshProfile, updateProfileState, isGuest, guestSessionsLeft } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [demoLoading, setDemoLoading] = React.useState(false);
  const [isRemovingResume, setIsRemovingResume] = useState(false);
  const [hasResume, setHasResume] = useState<boolean>(() => Boolean(profile?.resume_uploaded));
  const [resumeFilename, setResumeFilename] = useState<string>(() => profile?.resume_filename || '');

  // Synchronize with profile changes
  useEffect(() => {
    setHasResume(Boolean(profile?.resume_uploaded));
    if (profile?.resume_filename) {
      setResumeFilename(profile.resume_filename);
    }
  }, [profile?.resume_uploaded, profile?.resume_filename]);

  // Check actual active resume on mount and listen to global resume-change events
  useEffect(() => {
    async function checkActiveResume() {
      try {
        const active = await api.getResume();
        if (active && active.filename) {
          setHasResume(true);
          setResumeFilename(active.filename);
        } else {
          setHasResume(false);
          setResumeFilename('');
        }
      } catch (err) {
        // Fallback to profile state
      }
    }
    checkActiveResume();

    const handleResumeChange = (e: any) => {
      if (e.detail?.hasResume) {
        setHasResume(true);
        setResumeFilename(e.detail.filename || 'Uploaded_Resume.pdf');
      } else {
        setHasResume(false);
        setResumeFilename('');
      }
    };

    window.addEventListener('careeriq:resume-changed', handleResumeChange);
    return () => window.removeEventListener('careeriq:resume-changed', handleResumeChange);
  }, []);

  const readinessScore = hasResume ? (profile?.readiness_score || 78) : 0;

  const primaryNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'resume', label: 'Resume Analyzer', icon: FileText },
    { id: 'jobs', label: 'Jobs & Matching', icon: Briefcase },
    { id: 'recruiter-demand', label: 'Recruiter Demand', icon: TrendingUp },
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

  const handleRemoveResume = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to remove your uploaded resume? This will clear its detected skills and diagnostics so you can upload a fresh resume.')) {
      setIsRemovingResume(true);
      try {
        await api.deleteAllResumes();
        setHasResume(false);
        setResumeFilename('');
        if (profile) {
          updateProfileState({
            ...profile,
            resume_uploaded: false,
            resume_filename: undefined,
            readiness_score: 0
          });
        }
        window.dispatchEvent(new CustomEvent('careeriq:resume-changed', {
          detail: { hasResume: false, filename: '' }
        }));
        await refreshProfile();
      } catch (err) {
        console.error('Failed to remove resume:', err);
      } finally {
        setIsRemovingResume(false);
      }
    }
  };

  const handleDemoToggle = async () => {
    setDemoLoading(true);
    try {
      if (hasResume) {
        await clearDemoMode();
        setHasResume(false);
        setResumeFilename('');
        if (profile) {
          updateProfileState({
            ...profile,
            resume_uploaded: false,
            resume_filename: undefined,
            readiness_score: 0
          });
        }
        window.dispatchEvent(new CustomEvent('careeriq:resume-changed', {
          detail: { hasResume: false, filename: '' }
        }));
      } else {
        await loadDemoMode();
        setHasResume(true);
        setResumeFilename('Archana_Resume_2026.pdf');
        if (profile) {
          updateProfileState({
            ...profile,
            resume_uploaded: true,
            resume_filename: 'Archana_Resume_2026.pdf',
            readiness_score: 78
          });
        }
        window.dispatchEvent(new CustomEvent('careeriq:resume-changed', {
          detail: { hasResume: true, filename: 'Archana_Resume_2026.pdf' }
        }));
      }
      await refreshProfile();
    } catch (e) {
      console.error('Demo switch error:', e);
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          id="sidebar-mobile-overlay"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-900/60 z-30 lg:hidden backdrop-blur-xs transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Clean Professional SaaS Sidebar */}
      <aside
        id="careeriq-sidebar"
        className={`fixed lg:sticky top-14 z-35 h-[calc(100vh-3.5rem)] w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-[#E2E8F0] dark:border-slate-800 transition-colors duration-150 ease-in-out lg:translate-x-0 overflow-y-auto flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-3.5 space-y-4">
          
          {/* Target Role & Readiness Summary Card */}
          <div className="p-3 bg-[#F8FAFC] dark:bg-slate-800/70 rounded-xl border border-[#E2E8F0] dark:border-slate-700/80 shadow-2xs transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400">Target Role</span>
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                hasResume
                  ? 'text-[#16A34A] dark:text-emerald-400 bg-[#DCFCE7] dark:bg-emerald-950/60 border border-[#BBF7D0] dark:border-emerald-800'
                  : 'text-[#D97706] dark:text-amber-400 bg-[#FEF3C7] dark:bg-amber-950/60 border border-[#FDE68A] dark:border-amber-800'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${hasResume ? 'bg-[#16A34A] dark:bg-emerald-400' : 'bg-[#D97706] dark:bg-amber-400'}`}></span>
                {hasResume ? 'Active' : 'Setup'}
              </span>
            </div>
            <p className="text-xs font-bold text-[#172033] dark:text-white truncate">
              {profile?.target_role || 'Select your target role'}
            </p>
            
            <div className="mt-2 flex items-center justify-between text-[11px] text-[#64748B] dark:text-slate-400">
              <span>Career Readiness</span>
              {hasResume ? (
                <span className="font-bold text-[#2563EB] dark:text-blue-400">{readinessScore} / 100</span>
              ) : (
                <span className="font-semibold text-[#D97706] dark:text-amber-400">Pending Resume</span>
              )}
            </div>
            <div className="w-full bg-[#E2E8F0] dark:bg-slate-700 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${hasResume ? 'bg-[#2563EB] dark:bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                style={{ width: `${hasResume ? readinessScore : 0}%` }}
              />
            </div>

            {hasResume ? (
              <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-1 text-[11px]">
                <div className="flex items-center gap-1.5 min-w-0 text-slate-700 dark:text-slate-300">
                  <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="truncate font-semibold text-[11px] text-slate-800 dark:text-slate-200" title={resumeFilename || profile?.resume_filename || 'Active Resume'}>
                    {resumeFilename || profile?.resume_filename || 'Resume Uploaded'}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSelect('resume')}
                    className="px-1.5 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer"
                  >
                    View
                  </button>
                  <span className="text-slate-300 dark:text-slate-600">|</span>
                  <button
                    type="button"
                    id="sidebar-btn-remove-resume"
                    disabled={isRemovingResume}
                    onClick={handleRemoveResume}
                    className="px-1.5 py-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 cursor-pointer disabled:opacity-50 inline-flex items-center gap-0.5"
                    title="Remove uploaded resume"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                    <span>{isRemovingResume ? '...' : 'Remove'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                id="sidebar-btn-upload-resume"
                onClick={() => handleSelect('resume')}
                className="mt-2.5 w-full py-1.5 px-2 rounded-lg bg-[#EFF6FF] dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 border border-[#BFDBFE] dark:border-blue-800 text-[11px] font-bold text-[#2563EB] dark:text-blue-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload Resume</span>
              </button>
            )}
          </div>

          {/* Primary Navigation */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-mono font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-wider mb-2">
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
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-[#EFF6FF] dark:bg-blue-950/70 text-[#2563EB] dark:text-blue-300 border border-[#BFDBFE] dark:border-blue-800 shadow-2xs font-bold'
                      : 'text-[#64748B] dark:text-slate-300 hover:bg-[#F8FAFC] dark:hover:bg-slate-800 hover:text-[#172033] dark:hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#2563EB] dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.isSpecial && (
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-[#2563EB] text-white'
                          : 'bg-[#EFF6FF] dark:bg-blue-950/80 text-[#2563EB] dark:text-blue-300 border border-[#BFDBFE] dark:border-blue-800'
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
          <div className="border-t border-[#E2E8F0] dark:border-slate-800 my-2"></div>

          {/* Secondary Navigation (Profile & Settings) */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-mono font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-wider mb-2">
              Account & System
            </p>
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-nav-${item.id}`}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-[#EFF6FF] dark:bg-blue-950/70 text-[#2563EB] dark:text-blue-300 border border-[#BFDBFE] dark:border-blue-800 shadow-2xs font-bold'
                      : 'text-[#64748B] dark:text-slate-300 hover:bg-[#F8FAFC] dark:hover:bg-slate-800 hover:text-[#172033] dark:hover:text-white border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#2563EB] dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Quick Theme Toggle Row in Sidebar */}
            <button
              type="button"
              id="sidebar-theme-toggle-row"
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-[#64748B] dark:text-slate-300 hover:bg-[#F8FAFC] dark:hover:bg-slate-800 hover:text-[#172033] dark:hover:text-white transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                {resolvedTheme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-500 shrink-0" />
                )}
                <span>Theme: {resolvedTheme === 'dark' ? 'Dark' : 'Light'}</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Switch
              </span>
            </button>
          </div>

          {/* Demo Mode Switcher Pill */}
          <div className="pt-2">
            <button
              id="sidebar-demo-toggle"
              onClick={handleDemoToggle}
              disabled={demoLoading}
              className="w-full p-2.5 rounded-xl border border-[#E2E8F0] dark:border-slate-700/80 bg-[#F8FAFC] dark:bg-slate-800/60 text-[#172033] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold flex items-center justify-between transition-all cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <RotateCcw className={`w-3.5 h-3.5 text-blue-600 dark:text-blue-400 ${demoLoading ? 'animate-spin' : ''}`} />
                <span>{hasResume ? 'Reset to New User' : 'Load Demo Profile'}</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-[#E2E8F0] dark:border-slate-600 text-[#64748B] dark:text-slate-300">
                {hasResume ? 'Loaded' : 'Sample'}
              </span>
            </button>
          </div>

        </div>

        {/* Guest Session Upgrade Banner (if currently guest) */}
        {isGuest && (
          <div className="mx-3.5 mb-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">Guest Session</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 font-bold">
                {guestSessionsLeft} left
              </span>
            </div>
            <p className="text-[10px] text-emerald-700 dark:text-emerald-300 mt-1 leading-tight">
              Create an account to save your progress, resumes, and test scores permanently.
            </p>
            <button
              onClick={() => handleSelect('register')}
              className="mt-2 w-full py-1.5 px-2 text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer text-center block"
            >
              Sign Up Free (Keep Data)
            </button>
          </div>
        )}

        {/* User Card at Bottom */}
        <div className="p-3 border-t border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-800/50">
          <div className="flex items-center justify-between gap-2">
            <div
              id="sidebar-user-card"
              onClick={() => handleSelect('profile')}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-[#EFF6FF] dark:bg-blue-950/80 border border-[#BFDBFE] dark:border-blue-800 flex items-center justify-center text-[#2563EB] dark:text-blue-300 font-bold text-xs shrink-0">
                {(user?.full_name || profile?.full_name || 'U').charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#172033] dark:text-white truncate group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors">
                  {user?.full_name || profile?.full_name || 'Candidate'}
                </p>
                <p className="text-[10px] text-[#64748B] dark:text-slate-400 truncate">
                  {isGuest ? 'Guest Trial Mode' : (profile?.target_role || 'Select target role')}
                </p>
              </div>
            </div>
            <button
              id="sidebar-logout-btn"
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-md text-[#64748B] dark:text-slate-400 hover:text-[#DC2626] dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;
