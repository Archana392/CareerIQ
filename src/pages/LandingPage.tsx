import React from 'react';
import {
  Compass,
  Sparkles,
  ArrowRight,
  Target,
  FileText,
  GitCompare,
  TrendingUp,
  Award,
  Milestone,
  CheckCircle2,
  Cpu,
  Layers,
  Search,
  BookOpen,
  Bot
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  setCurrentView: (view: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setCurrentView }) => {
  const { user } = useAuth();

  const handleStart = () => {
    if (user) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('dashboard'); // Auto opens demo
    }
  };

  return (
    <div id="careeriq-landing-page" className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-500 selection:text-white">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28 bg-[#0F172A] text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Version Pill */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Career Intelligence Platform
            </span>
          </div>

          {/* Main Title & Tagline */}
          <div className="text-center max-w-4xl mx-auto space-y-5">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Know Where You Stand. <br className="hidden sm:inline" />
              <span className="text-blue-400">
                Know What Comes Next.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Bridge the gap between your current skills, job requirements, and industry hiring standards with personalized roadmaps, ATS diagnostics, and smart job matching.
            </p>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="btn-hero-analyze-career"
                onClick={handleStart}
                className="w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group"
              >
                Launch Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="btn-hero-resume-check"
                onClick={() => setCurrentView('resume')}
                className="w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 shadow-xs transition-all flex items-center justify-center gap-2"
              >
                Analyze Resume
              </button>
            </div>

            {/* Credibility metrics */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-center">
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                <p className="text-2xl font-extrabold text-white font-mono">100%</p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Transparent Scoring</p>
              </div>
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                <p className="text-2xl font-extrabold text-blue-400 font-mono">300+</p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Verified Skill Taxonomy</p>
              </div>
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                <p className="text-2xl font-extrabold text-emerald-400 font-mono">5-Step</p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Milestone Learning Path</p>
              </div>
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                <p className="text-2xl font-extrabold text-purple-400 font-mono">Real-Time</p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Role Matching</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Workflow / How CareerIQ Works */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">The CareerIQ Workflow</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Four Steps to Job Readiness
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              A clean, structured progression from raw resume to hiring-ready candidate.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900">1. Resume Analysis</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload your resume to extract confirmed technical skills, verify ATS formatting, and identify missing impact metrics.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900">2. Career Readiness</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive an objective 0–100% readiness score across core programming, domain frameworks, backend APIs, and deployment.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900">3. Personalized Roadmap</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Follow a step-by-step milestone path with curated learning actions and recommended portfolio capstone projects.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                4
              </div>
              <h3 className="text-sm font-bold text-slate-900">4. Role Matching</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Match your profile with target job descriptions and see what you have, what you need, and how to qualify.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm tracking-tight">CareerIQ</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">AI Career Intelligence & Employability Platform</span>
          </div>
          <p className="text-slate-500">
            © {new Date().getFullYear()} CareerIQ. Built for students, graduates, and professionals.
          </p>
        </div>
      </footer>

    </div>
  );
};
