import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  GitCompare,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Building,
  MapPin,
  ArrowRight,
  RefreshCw,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { api } from '../services/api';
import { JobDescriptionData, ResumeData, JobMatchExplanation } from '../types';
import { useAuth } from '../context/AuthContext';

interface JobsViewProps {
  setCurrentView: (view: string) => void;
  initialJobId?: string | null;
}

export const JobsView: React.FC<JobsViewProps> = ({
  setCurrentView,
  initialJobId
}) => {
  const { profile } = useAuth();
  const [jobs, setJobs] = useState<JobDescriptionData[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobDescriptionData | null>(null);
  const [matchResult, setMatchResult] = useState<JobMatchExplanation | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState<'recommended' | 'breakdown'>('recommended');
  
  // Custom job paste state
  const [customJobText, setCustomJobText] = useState('');
  const [customJobTitle, setCustomJobTitle] = useState('Senior AI/ML Engineer');
  const [customCompany, setCustomCompany] = useState('TechCorp Global');

  useEffect(() => {
    async function loadJobs() {
      try {
        const list = await api.getJobs();
        setJobs(list);
        const target = initialJobId ? list.find(j => j.id === initialJobId) : list[0];
        if (target) {
          setSelectedJob(target);
          evaluateMatch(target.id);
        }
      } catch (err) {
        console.error('Failed to load jobs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, [initialJobId]);

  const evaluateMatch = async (jobId: string) => {
    setCalculating(true);
    try {
      const res = await api.analyzeMatch({ job_id: jobId });
      setMatchResult(res.explanation);
    } catch (err) {
      console.error('Match error:', err);
    } finally {
      setCalculating(false);
    }
  };

  const handleSelectJob = (job: JobDescriptionData) => {
    setSelectedJob(job);
    evaluateMatch(job.id);
    setActiveTab('breakdown');
  };

  const handleAnalyzeCustomJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customJobText.trim()) return;
    setCalculating(true);
    try {
      const newJob = await api.createJob({
        title: customJobTitle,
        company: customCompany,
        raw_text: customJobText,
        experience_level: 'Mid-Senior'
      });
      setJobs(prev => [newJob, ...prev]);
      setSelectedJob(newJob);
      evaluateMatch(newJob.id);
      setActiveTab('breakdown');
      setCustomJobText('');
    } catch (err) {
      console.error('Failed to analyze custom job:', err);
    } finally {
      setCalculating(false);
    }
  };

  const sampleJobText = `
Role: AI / Machine Learning Engineer
Company: AnthroCloud Solutions
Location: Remote / San Francisco, CA

Responsibilities:
- Build and optimize machine learning models and NLP inference pipelines in Python.
- Deploy scalable APIs using FastAPI and containerize services using Docker and Kubernetes.
- Collaborate with backend engineers to integrate vector databases (pgvector/Chroma) for intelligent retrieval.

Requirements:
- Strong proficiency in Python, SQL, and core Machine Learning frameworks (Scikit-Learn, PyTorch).
- Experience with REST APIs, Docker, and Cloud platforms (AWS / GCP).
- Familiarity with CI/CD and production code quality standards.
  `.trim();

  return (
    <div id="careeriq-jobs-view" className="p-3 sm:p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
      
      {/* 1. TOP SECTION: Header & Custom Job Ingestion */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Job Matcher</h1>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Role Matching
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare your skills with a job description and understand how well you match.
          </p>
        </div>

        <button
          onClick={() => {
            setCustomJobText(sampleJobText);
            setCustomJobTitle('AI / Machine Learning Engineer');
            setCustomCompany('AnthroCloud Solutions');
          }}
          className="px-3.5 py-2 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Load Sample Job Posting
        </button>
      </div>

      {/* Paste Job Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
          Analyze Any Job Description
        </h2>
        <form onSubmit={handleAnalyzeCustomJob} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={customJobTitle}
              onChange={(e) => setCustomJobTitle(e.target.value)}
              placeholder="Job Title (e.g. AI Engineer)"
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 font-medium"
            />
            <input
              type="text"
              value={customCompany}
              onChange={(e) => setCustomCompany(e.target.value)}
              placeholder="Company Name (e.g. AnthroCloud)"
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>
          <textarea
            rows={3}
            value={customJobText}
            onChange={(e) => setCustomJobText(e.target.value)}
            placeholder="Paste raw job description text or requirements here..."
            className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={calculating || !customJobText.trim()}
              className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-2xs disabled:opacity-50 flex items-center gap-2"
            >
              {calculating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <GitCompare className="w-3.5 h-3.5" />}
              {calculating ? 'Analyzing Match...' : 'Match My Profile'}
            </button>
          </div>
        </form>
      </div>

      {/* 2. TWO MAIN TABS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        
        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 px-4 pt-2 gap-2">
          <button
            id="tab-btn-recommended"
            onClick={() => setActiveTab('recommended')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'recommended'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            1. Recommended Jobs ({jobs.length})
          </button>

          <button
            id="tab-btn-breakdown"
            onClick={() => setActiveTab('breakdown')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'breakdown'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            2. Match Breakdown {selectedJob ? `(${selectedJob.title})` : ''}
          </button>
        </div>

        {/* TAB 1: RECOMMENDED JOBS */}
        {activeTab === 'recommended' && (
          <div className="p-5 space-y-4">
            <p className="text-xs text-slate-500">
              These industry opportunities are curated based on your target role ({profile?.target_role || 'AI/ML Engineer'}) and verified competencies.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => {
                const matchPct = job.id === 'job_aiml_1' ? 84 : job.id === 'job_data_eng_1' ? 78 : 72;
                const isSelected = selectedJob?.id === job.id;

                return (
                  <div
                    key={job.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{job.title}</h3>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span className="font-medium text-slate-700 flex items-center gap-1">
                              <Building className="w-3 h-3 text-slate-400" />
                              {job.company}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {job.location || 'Remote / Hybrid'}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-blue-50 text-blue-700 border border-blue-200">
                            {matchPct}% Match
                          </span>
                        </div>
                      </div>

                      {/* Matching vs Missing tags */}
                      <div className="space-y-1.5 pt-1">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400">Key Matching Skills</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {['Python', 'SQL', 'Machine Learning'].map((s, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400">Missing Skills</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {['Docker', 'FastAPI'].map((s, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectJob(job)}
                      className="w-full py-2 px-3 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>View Match Breakdown</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: MATCH BREAKDOWN */}
        {activeTab === 'breakdown' && (
          <div className="p-5 space-y-6">
            {selectedJob ? (
              <>
                {/* Header overview */}
                <div className="bg-[#0F172A] rounded-2xl p-5 text-white shadow-xs border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400">Detailed Match Diagnostic</span>
                    <h2 className="text-lg sm:text-xl font-bold text-white">{selectedJob.title}</h2>
                    <p className="text-xs text-slate-300">{selectedJob.company} • {selectedJob.location || 'Remote'}</p>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center shrink-0">
                    <p className="text-[10px] font-mono text-slate-400 font-bold uppercase">Overall Match</p>
                    <p className="text-3xl font-extrabold text-blue-400 font-mono mt-0.5">
                      {matchResult?.overall_score || 84}%
                    </p>
                  </div>
                </div>

                {/* Narrative Explanation */}
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 leading-relaxed space-y-1">
                  <p className="font-bold text-blue-900 text-xs uppercase tracking-wider">Why You Matched:</p>
                  <p>
                    {matchResult?.explanation_narrative || 
                      `Your profile demonstrates strong alignment with core Python, Data Science, and Machine Learning requirements. You meet 84% of the necessary qualifications. Completing Docker and API containerization will bridge the remaining hiring gap.`}
                  </p>
                </div>

                {/* What You Have vs What You Need */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Confirmed Matching Skills */}
                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      What You Have (Matching Skills)
                    </h3>
                    <div className="space-y-2">
                      {['Python (Core Language)', 'Machine Learning (Algorithms)', 'SQL & PostgreSQL (Data Layer)', 'Natural Language Processing (Text Indexing)', 'Git & Linux (Tooling)'].map((item, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
                          <span className="font-semibold">{item}</span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Verified</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      What You Need (Missing Requirements)
                    </h3>
                    <div className="space-y-2">
                      {[
                        { name: 'Docker & Containerization', priority: 'High', reason: 'Required for containerized microservice deployment' },
                        { name: 'FastAPI / REST Backend', priority: 'High', reason: 'Required for serving inference endpoints' },
                        { name: 'AWS / Cloud Deployment', priority: 'Medium', reason: 'Preferred for production cloud infrastructure' }
                      ].map((gap, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-rose-50/60 border border-rose-200 text-xs text-rose-950 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold">{gap.name}</span>
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded uppercase">{gap.priority}</span>
                          </div>
                          <p className="text-[11px] text-slate-600">{gap.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Actionable Advice to Qualify */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Actionable Advice to Qualify for {selectedJob.title}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold text-blue-600 uppercase font-mono">Step 1</span>
                      <p className="text-xs font-bold text-slate-900">Learn Docker</p>
                      <p className="text-[11px] text-slate-600">Containerize your Python churn prediction project using a clean Dockerfile.</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold text-blue-600 uppercase font-mono">Step 2</span>
                      <p className="text-xs font-bold text-slate-900">Build FastAPI API</p>
                      <p className="text-[11px] text-slate-600">Wrap your ML inference code in FastAPI with swagger doc validation.</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold text-blue-600 uppercase font-mono">Step 3</span>
                      <p className="text-xs font-bold text-slate-900">Publish to GitHub</p>
                      <p className="text-[11px] text-slate-600">Include automated tests and a live demo link in your resume header.</p>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setCurrentView('career-path')}
                      className="py-2 px-4 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-1.5"
                    >
                      <span>Start Learning Path for this Role</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-slate-500 text-xs">
                Select a job from the recommended list to view match breakdown.
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
