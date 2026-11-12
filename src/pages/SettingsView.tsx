import React, { useState } from 'react';
import {
  Download,
  ShieldCheck,
  CheckCircle2,
  User,
  Lock,
  LogOut,
  Palette,
  Sun,
  Moon,
  Monitor,
  Database,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme, Theme } from '../context/ThemeContext';
import { api } from '../services/api';

export const SettingsView: React.FC = () => {
  const { user, profile, logout } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [downloading, setDownloading] = useState(false);
  const [exported, setExported] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<{
    tested: boolean;
    configured: boolean;
    connected: boolean;
    message: string;
  } | null>(null);
  const [testingSupabase, setTestingSupabase] = useState(false);

  const handleTestSupabase = async () => {
    setTestingSupabase(true);
    try {
      const res = await api.getSupabaseStatus();
      setSupabaseStatus({
        tested: true,
        configured: res.configured,
        connected: res.connected,
        message: res.message
      });
    } catch (e: any) {
      setSupabaseStatus({
        tested: true,
        configured: false,
        connected: false,
        message: e.message || 'Failed to check status'
      });
    } finally {
      setTestingSupabase(false);
    }
  };

  const handleExportData = async () => {
    setDownloading(true);
    try {
      const [p, resumes, jobs, history] = await Promise.all([
        api.getProfile().catch(() => profile),
        api.getResumes().catch(() => []),
        api.getJobs().catch(() => []),
        api.getHistory().catch(() => [])
      ]);

      const exportPayload = {
        exported_at: new Date().toISOString(),
        product: 'CareerIQ AI Platform',
        user: { id: user?.id, email: user?.email, full_name: user?.full_name },
        profile: p,
        resumes,
        jobs,
        history
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `CareerIQ_Candidate_Data_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setExported(true);
      setTimeout(() => setExported(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  const themeOptions: { id: Theme; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
    {
      id: 'light',
      label: 'Light Mode',
      desc: 'Clean crisp daylight theme with high contrast',
      icon: Sun
    },
    {
      id: 'dark',
      label: 'Dark Mode',
      desc: 'Dark theme optimized for night work and OLED screens',
      icon: Moon
    },
    {
      id: 'system',
      label: 'System Preference',
      desc: 'Automatically syncs with your operating system settings',
      icon: Monitor
    }
  ];

  return (
    <div id="careeriq-settings-view" className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Settings & Preferences</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your interface appearance, security, data export, and privacy settings.
        </p>
      </div>

      <div className="space-y-5">
        
        {/* Appearance & Theme Setting */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              <Palette className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Appearance & Theme
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-900">
              Active: {resolvedTheme === 'dark' ? 'Dark' : 'Light'}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Choose how CareerIQ looks to you. Select a light or dark theme, or sync with your system.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {themeOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = theme === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTheme(opt.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 shadow-xs ring-1 ring-blue-600 dark:ring-blue-500'
                      : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{opt.label}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{opt.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 1. Account Information */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-3 transition-colors">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Account Information
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Full Name</span>
              <span className="font-semibold text-slate-900 dark:text-white text-sm mt-0.5 block">{user?.full_name || profile?.full_name || 'Archana'}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Registered Email</span>
              <span className="font-semibold text-slate-900 dark:text-white text-sm mt-0.5 block">{user?.email || 'archana@careeriq.edu'}</span>
            </div>
          </div>
        </div>

        {/* 2. Privacy */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-3 transition-colors">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Privacy
          </div>
          <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-200 leading-relaxed font-medium">
            "Your resume, skills, and career information are private and are used only to provide personalized career recommendations."
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            All user data, resumes, analysis history, and AI conversations are scoped securely to your account. We do not sell your personal data or share it with unauthorized third parties.
          </p>
        </div>

        {/* 3. Data Export */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-3 transition-colors">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Data Export</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Download your complete career profile, verified skills, and roadmap data as a portable JSON file.</p>
            </div>
            <button
              onClick={handleExportData}
              disabled={downloading}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors inline-flex items-center gap-1.5 shadow-2xs disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              {downloading ? 'Preparing File...' : 'Export My Data'}
            </button>
          </div>
          {exported && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Data export completed successfully! File saved to your downloads.
            </div>
          )}
        </div>

        {/* 4. Supabase Cloud Database & Storage */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-4 transition-colors">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Supabase PostgreSQL & Storage</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Persistent cloud database with Row Level Security (RLS) and private resume storage.
                </p>
              </div>
            </div>
            <button
              onClick={handleTestSupabase}
              disabled={testingSupabase}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testingSupabase ? 'animate-spin' : ''}`} />
              {testingSupabase ? 'Checking...' : 'Check Supabase'}
            </button>
          </div>

          {supabaseStatus && (
            <div className={`p-3.5 rounded-xl text-xs border ${
              supabaseStatus.connected
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800'
            }`}>
              <div className="flex items-center gap-2 font-bold mb-1">
                <span className={`w-2 h-2 rounded-full ${supabaseStatus.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span>{supabaseStatus.connected ? 'Supabase Live Connected' : 'Local Fallback Mode Active'}</span>
              </div>
              <p className="text-[11px] leading-relaxed">{supabaseStatus.message}</p>
            </div>
          )}

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-300 space-y-1.5">
            <p className="font-semibold text-slate-800 dark:text-slate-200">How to activate your Supabase project:</p>
            <ol className="list-decimal list-inside space-y-1 text-slate-500 dark:text-slate-400">
              <li>Open your project at <strong>supabase.com</strong> and copy your <em>Project URL</em> and <em>Anon Key</em> from <strong>Project Settings → API</strong>.</li>
              <li>Add them to your environment as <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-[10px]">SUPABASE_URL</code> and <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-[10px]">SUPABASE_ANON_KEY</code>.</li>
              <li>Execute <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-[10px]">supabase/schema.sql</code> in the Supabase SQL Editor to initialize all 22 relational tables and RLS policies.</li>
            </ol>
          </div>
        </div>

        {/* 5. Security */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-3 transition-colors">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Security & Row Level Security
          </div>
          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <p>• <strong>Password Protection:</strong> Stored securely using salted bcrypt hashing.</p>
            <p>• <strong>Session Management:</strong> Signed JWT bearer tokens with automatic expiration.</p>
            <p>• <strong>Row Level Security (RLS):</strong> Candidate resumes, profiles, roadmaps, and recruiter evaluations are protected by PostgreSQL RLS policies.</p>
          </div>
        </div>

        {/* 5. Logout */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs flex items-center justify-between flex-wrap gap-3 transition-colors">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900 dark:text-rose-300">Logout</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Securely end your current session on this device.</p>
          </div>
          <button
            onClick={() => { logout(); window.location.reload(); }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>

      </div>

    </div>
  );
};

export default SettingsView;
