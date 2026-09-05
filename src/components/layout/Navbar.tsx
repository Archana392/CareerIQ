import React from 'react';
import {
  Compass,
  Sparkles,
  User as UserIcon,
  LogOut,
  Bell,
  Menu,
  X,
  Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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
  const { user, profile, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showNotifMenu, setShowNotifMenu] = React.useState(false);

  const isPublicPage = ['landing', 'about', 'login', 'register'].includes(currentView);

  return (
    <header id="careeriq-top-navbar" className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-2xs">
      <div className="w-full px-3 sm:px-4 lg:px-6 h-13 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-2.5">
          {!isPublicPage && (
            <button
              id="btn-toggle-sidebar"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-1.5 rounded-md text-slate-600 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          )}

          <div
            id="brand-logo-button"
            onClick={() => setCurrentView(user ? 'dashboard' : 'landing')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0F172A] border border-slate-700 flex items-center justify-center text-blue-400 shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-colors duration-150">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-slate-900 font-display">CareerIQ</span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 hidden sm:block leading-none">AI Career Intelligence & Employability</p>
            </div>
          </div>
        </div>

        {/* Public Header Links (only if logged out or on public landing) */}
        {!user && (
          <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-600">
            <button
              id="nav-link-landing"
              onClick={() => setCurrentView('landing')}
              className={`transition-colors hover:text-blue-600 ${currentView === 'landing' ? 'text-blue-600 font-bold' : ''}`}
            >
              Platform
            </button>
            <button
              id="nav-link-about"
              onClick={() => setCurrentView('about')}
              className={`transition-colors hover:text-blue-600 ${currentView === 'about' ? 'text-blue-600 font-bold' : ''}`}
            >
              Features
            </button>
          </nav>
        )}

        {/* User / Auth Controls */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {/* Authenticated Quick Switcher */}
              <button
                id="btn-nav-dashboard"
                onClick={() => setCurrentView('dashboard')}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Dashboard
              </button>

              {/* Notification Pill */}
              <div className="relative">
                <button
                  id="btn-notifications"
                  onClick={() => setShowNotifMenu(!showNotifMenu)}
                  className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg relative"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
                </button>

                {showNotifMenu && (
                  <div className="absolute right-0 mt-1.5 w-76 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                      <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Career Signals</span>
                      <span className="text-[10px] font-mono text-blue-600 font-bold">1 update</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 text-xs">
                        <p className="font-bold text-blue-900 text-xs">Target Role Skill Demand</p>
                        <p className="text-slate-600 mt-0.5 text-[11px] leading-tight">FastAPI and Docker are currently in high demand for {profile?.target_role || 'AI/ML'} roles.</p>
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
                  className="flex items-center gap-2 p-1 pl-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left"
                >
                  <div className="w-7 h-7 rounded-md bg-[#0F172A] text-blue-400 flex items-center justify-center font-bold text-xs">
                    {(user.full_name || profile?.full_name || 'A').charAt(0)}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-xs font-bold text-slate-800 leading-tight">{user.full_name || profile?.full_name || 'Archana'}</p>
                    <p className="text-[10px] text-slate-500 leading-tight truncate max-w-[120px]">{profile?.target_role || 'AI/ML Candidate'}</p>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-2.5 py-1.5 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-slate-900">{user.full_name || profile?.full_name || 'Archana'}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{user.email || 'archana@careeriq.edu'}</p>
                    </div>
                    <button
                      id="menu-btn-profile"
                      onClick={() => { setCurrentView('profile'); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                      Candidate Profile
                    </button>
                    <button
                      id="menu-btn-settings"
                      onClick={() => { setCurrentView('settings'); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-500" />
                      Account & Settings
                    </button>
                    <div className="my-1 border-t border-slate-100"></div>
                    <button
                      id="menu-btn-logout"
                      onClick={() => { logout(); setCurrentView('landing'); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                id="btn-nav-login"
                onClick={() => setCurrentView('login')}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Sign In
              </button>
              <button
                id="btn-nav-get-started"
                onClick={() => setCurrentView('register')}
                className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-all"
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
