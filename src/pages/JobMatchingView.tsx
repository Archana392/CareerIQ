import React, { useState, useEffect } from 'react';
import {
  GitCompare,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Milestone,
  Layers,
  HelpCircle,
  Building
} from 'lucide-react';
import { api } from '../services/api';
import { JobDescriptionData, ResumeData, JobMatchExplanation } from '../types';
import { ExplainableScoreCard } from '../components/ui/ExplainableScoreCard';

interface JobMatchingViewProps {
  setCurrentView: (view: string) => void;
  selectedJobForMatch?: JobDescriptionData | null;
}

export const JobMatchingView: React.FC<JobMatchingViewProps> = ({
  setCurrentView,
  selectedJobForMatch
}) => {
  const [jobs, setJobs] = useState<JobDescriptionData[]>([]);
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [matchResult, setMatchResult] = useState<JobMatchExplanation | null>(null);
  const [matchedJobTitle, setMatchedJobTitle] = useState<string>('');
  const [matchedCompany, setMatchedCompany] = useState<string>('');
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [jobsList, resumesList] = await Promise.all([api.getJobs(), api.getResumes()]);
        setJobs(jobsList);
        setResumes(resumesList);

        const initialJobId = selectedJobForMatch?.id || (jobsList.length > 0 ? jobsList[0].id : '');
        const initialResumeId = resumesList.length > 0 ? resumesList[0].id : '';

        setSelectedJobId(initialJobId);
        setSelectedResumeId(initialResumeId);

        if (initialJobId) {
          executeMatch(initialJobId, initialResumeId);
        }
      } catch (err) {
        console.error('Failed to load matching data:', err);
      }
    }
    loadData();
  }, [selectedJobForMatch]);

  const executeMatch = async (jobId: string, resumeId?: string) => {
    if (!jobId) return;
    setCalculating(true);
    try {
      const res = await api.analyzeMatch({ job_id: jobId, resume_id: resumeId });
      setMatchResult(res.explanation);
      setMatchedJobTitle(res.job_title);
      setMatchedCompany(res.company);
    } catch (err) {
      console.error('Match calculation error:', err);
    } finally {
      setCalculating(false);
    }
  };

  const handleRunMatch = (e: React.FormEvent) => {
    e.preventDefault();
    executeMatch(selectedJobId, selectedResumeId);
  };

  return (
    <div id="careeriq-job-matching-view" className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Explainable AI Job Match</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              XAI Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Transparent mathematical evaluation showing exactly why and where your profile aligns with target employer requirements.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('roadmap')}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors inline-flex items-center gap-1.5 shadow-sm"
        >
          <Milestone className="w-3.5 h-3.5" />
          Bridge Gaps via Roadmap
        </button>
      </div>

      {/* Selectors Bar */}
      <form onSubmit={handleRunMatch} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Target Job Description</label>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 font-medium"
          >
            {jobs.map(job => (
              <option key={job.id} value={job.id}>{job.title} ({job.company})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Candidate Resume</label>
          <select
            value={selectedResumeId}
            onChange={(e) => setSelectedResumeId(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
          >
            {resumes.map(res => (
              <option key={res.id} value={res.id}>{res.filename}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={calculating}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50 inline-flex items-center justify-center gap-2"
        >
          <GitCompare className="w-4 h-4" />
          {calculating ? 'Evaluating Match...' : 'Calculate Explainable Match'}
        </button>
      </form>

      {/* Match Result Display */}
      {matchResult && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Top Explainable Score Card */}
          <ExplainableScoreCard
            title={`Match Compatibility: ${matchedJobTitle || 'Target Position'}`}
            overallScore={matchResult.overall_score}
            grade={matchResult.grade}
            factors={[
              {
                label: 'Technical Skills Alignment',
                weight: '35% Weight',
                score: matchResult.breakdown.technical_skills,
                description: 'Matches Python, SQL, and Machine Learning against core JD requirements.'
              },
              {
                label: 'Applied Project Deliverables',
                weight: '20% Weight',
                score: matchResult.breakdown.applied_projects,
                description: 'Evaluates hands-on project artifacts and portfolio evidence.'
              },
              {
                label: 'Educational Qualification',
                weight: '15% Weight',
                score: matchResult.breakdown.education_alignment,
                description: 'Verifies degree background (B.Tech Computer Science).'
              },
              {
                label: 'Experience & Practical Exposure',
                weight: '15% Weight',
                score: matchResult.breakdown.experience_alignment,
                description: 'Internship exposure and engineering problem-solving history.'
              },
              {
                label: 'Industry Domain Relevance',
                weight: '15% Weight',
                score: matchResult.breakdown.industry_alignment,
                description: 'Relevance to modern software and AI production workflows.'
              }
            ]}
            explanation={matchResult.narrative_explanation}
            formulaNote="(0.35 × Tech) + (0.20 × Projects) + (0.15 × Edu) + (0.15 × Exp) + (0.15 × Ind)"
          />

          {/* Three Column Comparison: Matched (✓), Missing (✗), Partial (△) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Matched Skills */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  Matched Competencies ({matchResult.matching_skills.length})
                </div>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                  Verified
                </span>
              </div>

              <div className="space-y-2">
                {matchResult.matching_skills.map((skill, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-950">{skill.name}</span>
                    <span className="text-[10px] text-emerald-700 font-mono">Matched</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wider">
                  <XCircle className="w-4 h-4" />
                  Identified Gaps ({matchResult.missing_skills.length})
                </div>
                <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full">
                  To Learn
                </span>
              </div>

              <div className="space-y-2">
                {matchResult.missing_skills.map((skill, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-rose-950">{skill.name}</span>
                    <span className="text-[10px] font-bold text-rose-700 uppercase">High Priority</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Partial / Adjacent Skills */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4" />
                  Adjacent Transferable ({matchResult.partial_matches.length})
                </div>
                <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                  Transferable
                </span>
              </div>

              <div className="space-y-2">
                {matchResult.partial_matches.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-100 text-xs space-y-1">
                    <div className="flex items-center justify-between font-semibold text-amber-950">
                      <span>{item.candidate_skill} → {item.job_skill}</span>
                      <span className="text-[10px] font-mono text-amber-700">{item.confidence}% Transf.</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Core paradigms transfer with quick syntax bridge.</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Actionable Next Step CTA */}
          <div className="p-6 rounded-2xl bg-linear-to-r from-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold">Ready to bridge the missing {matchResult.missing_skills.length} skills?</h3>
              <p className="text-xs text-slate-300 mt-1">Our AI roadmap engine will generate a personalized 5-step learning timeline for this specific job.</p>
            </div>
            <button
              onClick={() => setCurrentView('roadmap')}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-white text-indigo-950 hover:bg-indigo-50 transition-colors inline-flex items-center gap-2 shrink-0 shadow-md"
            >
              Generate Tailored Roadmap
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
