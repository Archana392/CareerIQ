import React, { useState } from 'react';
import { Settings as SettingsIcon, Download, ShieldCheck, Trash2, CheckCircle2, User, Lock, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const SettingsView: React.FC = () => {
  const { user, profile, logout } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [exported, setExported] = useState(false);

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

  return (
    <div id="careeriq-settings-view" className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Settings & Privacy</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your account information, security, data export, and privacy settings.
        </p>
      </div>

      <div className="space-y-5">
        
        {/* 1. Account Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
            <User className="w-4 h-4 text-blue-600" />
            Account Information
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Full Name</span>
              <span className="font-semibold text-slate-900 text-sm mt-0.5 block">{user?.full_name || profile?.full_name || 'Archana'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Registered Email</span>
              <span className="font-semibold text-slate-900 text-sm mt-0.5 block">{user?.email || 'archana@careeriq.edu'}</span>
            </div>
          </div>
        </div>

        {/* 2. Privacy */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Privacy
          </div>
          <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs text-emerald-950 leading-relaxed font-medium">
            "Your resume, skills, and career information are private and are used only to provide personalized career recommendations."
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            All user data, resumes, analysis history, and AI conversations are scoped securely to your account. We do not sell your personal data or share it with unauthorized third parties.
          </p>
        </div>

        {/* 3. Data Export */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Data Export</h3>
              <p className="text-xs text-slate-500 mt-0.5">Download your complete career profile, verified skills, and roadmap data as a portable JSON file.</p>
            </div>
            <button
              onClick={handleExportData}
              disabled={downloading}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              {downloading ? 'Preparing File...' : 'Export My Data'}
            </button>
          </div>
          {exported && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Data export completed successfully! File saved to your downloads.
            </div>
          )}
        </div>

        {/* 4. Security */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
            <Lock className="w-4 h-4 text-blue-600" />
            Security
          </div>
          <div className="space-y-2 text-xs text-slate-600">
            <p>• <strong>Password Protection:</strong> Stored securely using salted bcrypt hashing.</p>
            <p>• <strong>Session Management:</strong> Signed JWT bearer tokens with automatic expiration.</p>
            <p>• <strong>User Isolation:</strong> Database queries and storage buckets are strictly scoped to your unique authenticated user ID.</p>
          </div>
        </div>

        {/* 5. Logout */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900">Logout</h3>
            <p className="text-xs text-slate-500 mt-0.5">Securely end your current session on this device.</p>
          </div>
          <button
            onClick={() => { logout(); window.location.reload(); }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 border border-rose-300 hover:bg-rose-50 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>

      </div>

    </div>
  );
};

