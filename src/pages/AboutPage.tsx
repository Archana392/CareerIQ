import React from 'react';
import {
  Compass,
  Layers,
  Award,
  CheckCircle2,
  Database,
  Code2,
  Server,
  Zap,
  Target,
  Sparkles
} from 'lucide-react';

interface AboutPageProps {
  setCurrentView: (view: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setCurrentView }) => {
  return (
    <div id="careeriq-about-page" className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Compass className="w-3.5 h-3.5" />
            Product Architecture & Intelligence
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            About CareerIQ
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto italic">
            "Know Where You Stand. Know What Comes Next."
          </p>
        </div>

        {/* 1. Problem Statement & Mission */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">The Problem We Are Solving</h2>
            <p className="text-xs text-slate-500 mt-0.5">Connecting Academic Preparation with Real-World Industry Requirements</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">The Employment Readiness Gap</h3>
              <p>
                Candidates often enter the job market with foundational skills but struggle to understand why resumes get rejected by automated ATS parsers or what exact technologies are missing from their portfolios.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2">
              <h3 className="font-bold text-blue-900 text-sm">The CareerIQ Approach</h3>
              <p>
                CareerIQ provides transparent scoring, actionable skill gap analysis, and structured learning roadmaps that guide candidates directly from their current baseline to verified hiring readiness.
              </p>
            </div>
          </div>
        </div>

        {/* 2. System Architecture & Tech Stack */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Technical Architecture</span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">Modular Platform Design</h2>
            <p className="text-xs text-slate-500 mt-0.5">Fast, explainable, and client-responsive</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                <Code2 className="w-4 h-4" />
                Client Layer
              </div>
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                <li>React 19 with TypeScript</li>
                <li>Tailwind CSS High Density Design</li>
                <li>Lucide vector icons</li>
                <li>Radar & Bar data visualizers</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                <Server className="w-4 h-4" />
                Backend & NLP Engine
              </div>
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                <li>Express.js server</li>
                <li>TF-IDF keyword extraction</li>
                <li>Skill taxonomy matcher</li>
                <li>Deterministic readiness scoring</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                <Database className="w-4 h-4" />
                Grounded AI Layer
              </div>
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                <li>Gemini API integration</li>
                <li>Knowledge base document store</li>
                <li>Personalized advice synthesis</li>
                <li>Actionable career tips</li>
              </ul>
            </div>

          </div>

        </div>

        {/* 3. Core Principles */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4" />
            Core Design Principles
          </div>
          <h2 className="text-lg font-bold text-slate-900">Simple on the Outside, Intelligent on the Inside</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
            <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Explainable Scoring:</strong> Transparent percentage breakdowns explain why a candidate matches or what skills are missing.
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Actionable Roadmaps:</strong> Every skill gap links directly to a concrete learning step and capstone project.
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">No Complex Jargon:</strong> Plain language outcomes designed for students and job seekers.
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">End-to-End Workflow:</strong> Seamless flow from resume ingestion to role matching and career planning.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
