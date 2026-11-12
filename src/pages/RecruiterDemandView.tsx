import React, { useState } from 'react';
import {
  Briefcase,
  Target,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  TrendingUp,
  FolderGit2,
  Award,
  Terminal,
  Clock,
  Layers,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Code
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getRecruiterDemandForRole } from '../data/careerRoles';
import { TargetRoleSelector } from '../components/common/TargetRoleSelector';

interface RecruiterDemandViewProps {
  setCurrentView: (view: string) => void;
}

export const RecruiterDemandView: React.FC<RecruiterDemandViewProps> = ({ setCurrentView }) => {
  const { profile } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string>(profile?.target_role || 'Software Engineer');

  const demandProfile = getRecruiterDemandForRole(selectedRole);

  const handleRoleChange = (newRole: string) => {
    setSelectedRole(newRole);
  };

  return (
    <div id="careeriq-recruiter-demand-view" className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      
      {/* 1. Header & Context */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Hiring Market Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Recruiter Demand & Hiring Expectations
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Understand exactly what recruiters, hiring managers, and technical interviewers look for when screening candidates for your chosen role.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center min-w-[150px]">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Industry Compensation</p>
              <p className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
                {demandProfile.salary_range}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Role Selector */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <TargetRoleSelector
            value={selectedRole}
            onChange={handleRoleChange}
            label="Current Target Role Filter"
          />
        </div>
      </div>

      {/* Role Notice */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4 flex items-start gap-3 text-xs text-blue-900">
        <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Dynamic Hiring Profile: </span>
          Showing active market demand data for <strong className="underline decoration-blue-400">{demandProfile.role}</strong> ({demandProfile.category}).
          Select any different role above to dynamically switch recruiter requirements.
        </div>
      </div>

      {/* 2. Technical Skills Matrix (Frequently Requested & Required) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Frequently Requested Skills */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              Frequently Requested Skills
            </h2>
            <span className="text-[11px] text-slate-500 font-medium">Hiring Frequency</span>
          </div>

          <div className="space-y-2.5">
            {demandProfile.frequently_requested_skills.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors"
              >
                <span className="text-xs font-semibold text-slate-800">{item.name}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    item.level === 'Critical'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : item.level === 'High'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {item.level} Demand
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <p className="text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">Tip:</span> Ensure all Critical skills appear directly in your resume projects or work experience sections.
            </p>
          </div>
        </div>

        {/* Required vs Preferred Skills */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-blue-600" />
              Required vs. Preferred Skills
            </h2>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Must-Have Core Technical Skills</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {demandProfile.required_technical_skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Preferred / Differentiator Skills</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {demandProfile.preferred_skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/60"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
                  <Terminal className="w-3.5 h-3.5 text-slate-600" />
                  <span>Common Tools & Environments</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {demandProfile.common_tools.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => setCurrentView('resume')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Compare against your resume <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* 3. Experience Expectations by Level */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          Experience & Competency Expectations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Entry-Level (0 - 2 Years)
            </span>
            <p className="text-xs text-slate-700 leading-relaxed">
              {demandProfile.experience_expectations.entry}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Mid-Level (2 - 5 Years)
            </span>
            <p className="text-xs text-slate-700 leading-relaxed">
              {demandProfile.experience_expectations.mid}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 bg-slate-200 px-2 py-0.5 rounded border border-slate-300">
              Senior-Level (5+ Years)
            </span>
            <p className="text-xs text-slate-700 leading-relaxed">
              {demandProfile.experience_expectations.senior}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Project Expectations & Certifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Project Expectations */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-blue-600" />
            Project Proof-of-Work Recruiters Look For
          </h2>
          <p className="text-xs text-slate-500">
            Recruiters prioritize candidates who can demonstrate concrete, deployed projects over theoretical knowledge.
          </p>

          <ul className="space-y-2.5 pt-1">
            {demandProfile.project_expectations.map((proj, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{proj}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Certifications & Emerging Skills */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-blue-600" />
              Recognized Industry Certifications
            </h2>
            <div className="space-y-2">
              {demandProfile.certifications.length > 0 ? (
                demandProfile.certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-800"
                  >
                    <span>{cert}</span>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Verified Value
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No mandatory certifications; portfolio and code samples are prioritized.</p>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              Emerging Skills & Future Outlook
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {demandProfile.emerging_skills.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 5. Interview Expectations & Soft Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Standard Interview Process & Expectations
          </h2>
          <div className="space-y-2">
            {demandProfile.interview_expectations.map((step, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 text-xs text-slate-700 flex items-start gap-2.5"
              >
                <div className="w-5 h-5 rounded-md bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  R{idx + 1}
                </div>
                <div className="leading-relaxed font-medium">{step}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            Valued Soft Skills
          </h2>
          <div className="space-y-2">
            {demandProfile.soft_skills.map((skill, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 6. Action Bar */}
      <div className="bg-slate-900 text-white rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-white">Ready to close your gaps for {demandProfile.role}?</p>
          <p className="text-xs text-slate-400">Generate a personalized step-by-step roadmap or analyze your current resume.</p>
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setCurrentView('career-path')}
            className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            View Career Roadmap
          </button>
          <button
            onClick={() => setCurrentView('resume')}
            className="flex-1 sm:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
          >
            Analyze Resume
          </button>
        </div>
      </div>

    </div>
  );
};
