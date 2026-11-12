import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  UploadCloud,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  GitCompare,
  Building,
  MapPin,
  GraduationCap,
  RefreshCw,
  Layers
} from 'lucide-react';
import { api } from '../services/api';
import { JobDescriptionData } from '../types';

interface JobAnalyzerViewProps {
  setCurrentView: (view: string) => void;
  setSelectedJobForMatch?: (job: JobDescriptionData) => void;
}

export const JobAnalyzerView: React.FC<JobAnalyzerViewProps> = ({
  setCurrentView,
  setSelectedJobForMatch
}) => {
  const [jobs, setJobs] = useState<JobDescriptionData[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobDescriptionData | null>(null);
  const [rawText, setRawText] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const list = await api.getJobs();
      setJobs(list);
      if (list.length > 0) setSelectedJob(list[0]);
    } catch (e) {
      console.error('Error fetching jobs:', e);
    }
  };

  const sampleJobAI = `
AI/ML Engineer (Associate / Entry Level)
Company: Nexus Intelligence Labs
Location: San Francisco, CA (Hybrid / Remote Option)

About the Role:
We are looking for an ambitious AI/ML Engineer to build, evaluate, and deploy production-grade machine learning models and Retrieval-Augmented Generation (RAG) services.

Key Responsibilities:
- Build and fine-tune machine learning and NLP pipelines using Python, Scikit-Learn, and PyTorch.
- Develop high-speed asynchronous REST API endpoints using FastAPI to serve inference requests.
- Package and deploy microservices into containerized environments using Docker and Kubernetes.
- Integrate vector databases and semantic vector search for LLM grounding and document QA.
- Collaborate with software engineers to write unit tests and establish CI/CD MLOps automation.

Required Qualifications:
- Bachelor's Degree in Computer Science, Data Science, or related STEM field.
- Proficiency in Python, SQL, and core Machine Learning algorithms.
- Hands-on experience with FastAPI, Docker, and Git version control.
- Solid understanding of Natural Language Processing and data preprocessing.

Preferred Qualifications:
- Familiarity with Retrieval-Augmented Generation (RAG) and vector embedding indexing.
- Experience with AWS or Google Cloud infrastructure.
- Strong problem-solving and proactive team communication skills.
  `.trim();

  const handleLoadSample = () => {
    setRawText(sampleJobAI);
    setTitle('Associate AI/ML Engineer');
    setCompany('Nexus Intelligence Labs');
    setError(null);
  };

  const handleAnalyzeJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim() || rawText.trim().length < 30) {
      setError('Please provide a complete job description.');
      return;
    }
    setAnalyzing(true);
    setError(null);
    try {
      const newJob = await api.analyzeJob({ raw_text: rawText, title, company });
      setJobs(prev => [newJob, ...prev]);
      setSelectedJob(newJob);
      setRawText('');
    } catch (err: any) {
      setError(err.message || 'Job analysis failed.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRunMatch = (job: JobDescriptionData) => {
    if (setSelectedJobForMatch) {
      setSelectedJobForMatch(job);
    }
    setCurrentView('matching');
  };

  return (
    <div id="careeriq-job-analyzer-view" className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Job Description Analyzer</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              NLP Deconstruction
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Deconstructs raw employer postings into Required vs Preferred skills, behavioral expectations, and technical tools.
          </p>
        </div>

        <button
          onClick={handleLoadSample}
          className="px-3.5 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Load Sample Job (AI/ML)
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Input Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Paste Job Posting</span>
          <span className="text-[11px] text-slate-400">Employer text deconstructor</span>
        </div>

        <form onSubmit={handleAnalyzeJob} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Job Title (e.g. AI/ML Engineer)"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Hiring Company (e.g. Nexus Intelligence Labs)"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <textarea
            rows={5}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Paste complete Job Description text here..."
            className="w-full p-3 text-xs font-mono rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={analyzing}
              className="py-2.5 px-6 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50 inline-flex items-center gap-2"
            >
              {analyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
              {analyzing ? 'Deconstructing Job Specs...' : 'Deconstruct Job Description'}
            </button>
          </div>
        </form>
      </div>

      {/* Selected Job Decomposition Card */}
      {selectedJob && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 animate-in fade-in duration-200">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">{selectedJob.title}</h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {selectedJob.company}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {selectedJob.location}
                </span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  {selectedJob.education_req}
                </span>
              </div>
            </div>

            <button
              id="btn-run-match-from-job"
              onClick={() => handleRunMatch(selectedJob)}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 inline-flex items-center gap-2"
            >
              <GitCompare className="w-4 h-4" />
              Evaluate Job Match
            </button>
          </div>

          {/* Extracted Requirements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Required Skills */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center justify-between">
                <span>Required Skills ({selectedJob.required_skills.length})</span>
                <span className="text-[10px] font-mono bg-rose-100 px-1.5 py-0.5 rounded-sm">Essential</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {selectedJob.required_skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-slate-800 border border-slate-200 shadow-2xs"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Preferred Skills */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center justify-between">
                <span>Preferred / Bonus Skills ({selectedJob.preferred_skills.length})</span>
                <span className="text-[10px] font-mono bg-indigo-100 px-1.5 py-0.5 rounded-sm">Advantage</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {selectedJob.preferred_skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-slate-800 border border-slate-200 shadow-2xs"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Responsibilities */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Core Responsibilities</h3>
            <ul className="space-y-1.5">
              {selectedJob.responsibilities.map((resp, idx) => (
                <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0"></span>
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}

    </div>
  );
};
