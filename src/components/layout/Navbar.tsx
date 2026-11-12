import React from 'react';
import {
  Sparkles,
  User as UserIcon,
  LogOut,
  Bell,
  Menu,
  X,
  Settings,
  Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../common/Logo';
import { ThemeToggle } from '../common/ThemeToggle';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  isSidebarOpen,
  setIsSidebarOpen
}) => {
  const { user, profile, logout, loginAsGuest, isGuest, guestSessionsLeft, canUseGuest, setPromptGuestSignup } = useAuth();
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showNotifMenu, setShowNotifMenu] = React.useState(false);
  const [guestLoading, setGuestLoading] = React.useState(false);

  const isPublicPage = ['landing', 'about', 'login', 'register'].includes(currentView);

  return (
    <header
      id="careeriq-top-navbar"
      className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xs transition-colors"
    >
      <div className="w-full px-3 sm:px-4 lg:px-6 h-14 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-2.5">
          {!isPublicPage && (
            <button
              id="btn-toggle-sidebar"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-hidden transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          )}

          <Logo
            size="sm"
            showText={true}
            subtitle="AI Powered Career Intelligence & Employability Platform"
            onClick={() => setCurrentView(user ? 'dashboard' : 'landing')}
          />
        </div>

        {/* Public Header Links (only if logged out or on public landing) */}
        {!user && (
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <button
              id="nav-link-landing"
              onClick={() => setCurrentView('landing')}
              className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                currentView === 'landing' ? 'text-blue-600 dark:text-blue-400 font-bold' : ''
              }`}
            >
              Platform
            </button>
            <button
              id="nav-link-about"
              onClick={() => setCurrentView('about')}
              className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                currentView === 'about' ? 'text-blue-600 dark:text-blue-400 font-bold' : ''
              }`}
            >
              Features
            </button>
          </nav>
        )}

        {/* User / Theme / Auth Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Universal Dark / Light Mode Toggle */}
          <ThemeToggle />

          {user ? (
            <>
              {/* Authenticated Quick Switcher */}
              <button
                id="btn-nav-dashboard"
                onClick={() => setCurrentView('dashboard')}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Dashboard
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  id="btn-notifications"
                  onClick={() => setShowNotifMenu(!showNotifMenu)}
                  className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl relative transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full"></span>
                </button>

                {showNotifMenu && (
                  <div className="absolute right-0 mt-2 w-76 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Career Signals</span>
                      <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold">1 update</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="p-2.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 text-xs">
                        <p className="font-bold text-blue-900 dark:text-blue-300 text-xs">Target Role Skill Demand</p>
                        <p className="text-slate-600 dark:text-slate-400 mt-0.5 text-[11px] leading-tight">
                          FastAPI, TypeScript, and Docker are currently in high demand for {profile?.target_role || 'AI/ML'} roles.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar Menu */}
              <div className="relative">
                <button
                  id="btn-user-avatar-menu"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 pl-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                    {(user.full_name || profile?.full_name || 'U').charAt(0)}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      {user.full_name || profile?.full_name || 'Candidate'}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight truncate max-w-[120px]">
                      {profile?.target_role || 'Candidate'}
                    </p>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-2.5 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.full_name || profile?.full_name || 'Candidate'}</p>
                        {isGuest && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                            Guest
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">{user.email || 'candidate@careeriq.edu'}</p>
                    </div>

                    {isGuest && (
                      <div className="mb-2 p-2 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl border border-emerald-200 dark:border-emerald-800 text-left">
                        <p className="text-[10px] text-emerald-800 dark:text-emerald-200 leading-tight">
                          Guest trial active: <strong>{guestSessionsLeft} passes left</strong>.
                        </p>
                        <button
                          onClick={() => { setCurrentView('register'); setShowUserMenu(false); }}
                          className="mt-1.5 w-full py-1 text-[10px] font-bold text-center text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer block"
                        >
                          Save Progress (Free Account)
                        </button>
                      </div>
                    )}
                    <button
                      id="menu-btn-profile"
                      onClick={() => { setCurrentView('profile'); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      Candidate Profile
                    </button>
                    <button
                      id="menu-btn-settings"
                      onClick={() => { setCurrentView('settings'); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      Account & Settings
                    </button>
                    <div className="my-1 border-t border-slate-100 dark:border-slate-800"></div>
                    <button
                      id="menu-btn-logout"
                      onClick={() => { logout(); setCurrentView('landing'); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="btn-nav-guest-try"
                onClick={async () => {
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
                  } catch (e) {
                    console.error('Navbar guest login error:', e);
                  } finally {
                    setGuestLoading(false);
                  }
                }}
                disabled={guestLoading}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-emerald-800 rounded-lg transition-colors cursor-pointer disabled:opacity-60"
              >
                <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Try as Guest</span>
                <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-emerald-200/80 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100">
                  {guestSessionsLeft > 0 ? guestSessionsLeft : '0'}
                </span>
              </button>
              <button
                id="btn-nav-login"
                onClick={() => setCurrentView('login')}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Sign In
              </button>
              <button
                id="btn-nav-get-started"
                onClick={() => setCurrentView('register')}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-2xs transition-all"
              >
                Get Started
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
