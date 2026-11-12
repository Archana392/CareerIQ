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
  Award,
  Filter,
  FileText,
  SlidersHorizontal
} from 'lucide-react';
import { api } from '../services/api';
import { JobDescriptionData, JobMatchExplanation, SkillItem } from '../types';
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
  const [userSkills, setUserSkills] = useState<SkillItem[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobDescriptionData | null>(null);
  const [matchResult, setMatchResult] = useState<JobMatchExplanation | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState<'recommended' | 'breakdown'>('recommended');
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [minMatchFilter, setMinMatchFilter] = useState<number>(0);

  // Custom job paste state
  const [customJobText, setCustomJobText] = useState('');
  const [customJobTitle, setCustomJobTitle] = useState('');
  const [customCompany, setCustomCompany] = useState('');
  const [showPasteBox, setShowPasteBox] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [jobList, skillsList] = await Promise.all([
          api.getJobs().catch(() => []),
          api.getUserSkills().catch(() => [])
        ]);
        setJobs(jobList);
        setUserSkills(skillsList);

        const target = initialJobId ? jobList.find(j => j.id === initialJobId) : jobList[0];
        if (target) {
          setSelectedJob(target);
          evaluateMatch(target.id);
        }
      } catch (err) {
        console.error('Failed to load jobs or user skills:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [initialJobId]);

  const evaluateMatch = async (jobId: string) => {
    setCalculating(true);
    try {
      const res = await api.analyzeMatch({ job_id: jobId });
      setMatchResult(res.explanation);
    } catch (err) {
      console.error('Match evaluation error:', err);
      setMatchResult(null);
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
        title: customJobTitle.trim() || 'Custom Position',
        company: customCompany.trim() || 'Direct Listing',
        raw_text: customJobText,
        experience_level: 'Entry - Mid'
      });
      setJobs(prev => [newJob, ...prev]);
      setSelectedJob(newJob);
      evaluateMatch(newJob.id);
      setActiveTab('breakdown');
      setCustomJobText('');
      setShowPasteBox(false);
    } catch (err) {
      console.error('Failed to analyze custom job:', err);
    } finally {
      setCalculating(false);
    }
  };

  // Helper to compute quick dynamic match for list preview based on actual user skills
  const computeQuickMatch = (job: JobDescriptionData) => {
    const userSkillNames = new Set(userSkills.map(s => s.name.toLowerCase()));
    const reqs = job.required_skills || [];
    if (reqs.length === 0) return { pct: 50, matched: [], missing: [] };
    
    const matched: string[] = [];
    const missing: string[] = [];

    reqs.forEach(r => {
      if (userSkillNames.has(r.name.toLowerCase())) {
        matched.push(r.name);
      } else {
        missing.push(r.name);
      }
    });

    const pct = Math.round((matched.length / reqs.length) * 100);
    return { pct, matched, missing };
  };

  // Filtered jobs
  const filteredJobs = jobs.filter(j => {
    const quick = computeQuickMatch(j);
    if (minMatchFilter > 0 && quick.pct < minMatchFilter) return false;

    if (roleFilter !== 'All') {
      const titleLower = j.title.toLowerCase();
      const roleLower = roleFilter.toLowerCase();
      if (!titleLower.includes(roleLower) && !roleLower.includes(titleLower)) {
        return false;
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = j.title.toLowerCase().includes(q);
      const matchCompany = j.company.toLowerCase().includes(q);
      const matchSkill = j.required_skills?.some(s => s.name.toLowerCase().includes(q));
      if (!matchTitle && !matchCompany && !matchSkill) return false;
    }

    return true;
  });

  return (
    <div id="careeriq-jobs-view" className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* 1. Header Banner - Clean Professional SaaS Theme */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Explainable Job Match Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Job Matcher & Qualifications Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Compare your verified skills and qualifications directly against actual job requirements to see exact match percentages and actionable skill gaps.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowPasteBox(!showPasteBox)}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>{showPasteBox ? 'Hide Paste Form' : 'Paste Job Description'}</span>
          </button>
        </div>
      </div>

      {/* User Skills Notice / Empty State Alert */}
      {userSkills.length === 0 && (
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">No verified skills found in your profile: </span>
              Match scores currently reflect 0% because your profile does not yet have parsed skills. Upload your resume or take skill assessments to view your true match percentage.
            </div>
          </div>
          <button
            onClick={() => setCurrentView('resume-analyzer')}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shrink-0 self-start sm:self-auto transition-colors"
          >
            Upload Resume
          </button>
        </div>
      )}

      {/* Paste Custom Job Box */}
      {showPasteBox && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 animate-in fade-in duration-150">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Analyze Any External Job Description
          </h2>
          <form onSubmit={handleAnalyzeCustomJob} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={customJobTitle}
                onChange={(e) => setCustomJobTitle(e.target.value)}
                placeholder="Job Title (e.g. Junior Software Engineer)"
                className="px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 font-medium"
              />
              <input
                type="text"
                value={customCompany}
                onChange={(e) => setCustomCompany(e.target.value)}
                placeholder="Company Name (e.g. Acme Corp)"
                className="px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
            <textarea
              rows={4}
              value={customJobText}
              onChange={(e) => setCustomJobText(e.target.value)}
              placeholder="Paste raw requirements and job description text here..."
              className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPasteBox(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={calculating || !customJobText.trim()}
                className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-2xs disabled:opacity-50 flex items-center gap-2"
              >
                {calculating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <GitCompare className="w-3.5 h-3.5" />}
                {calculating ? 'Analyzing...' : 'Extract & Evaluate Match'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. TAB CONTROLS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-4 pt-2 gap-2">
          <button
            id="tab-btn-recommended"
            onClick={() => setActiveTab('recommended')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'recommended'
                ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Available Positions ({jobs.length})
          </button>

          <button
            id="tab-btn-breakdown"
            onClick={() => setActiveTab('breakdown')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'breakdown'
                ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            Match Diagnostic {selectedJob ? `(${selectedJob.title})` : ''}
          </button>
        </div>

        {/* TAB 1: RECOMMENDED JOBS LIST & FILTERS */}
        {activeTab === 'recommended' && (
          <div className="p-5 space-y-5">
            
            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search title, company, skill..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
                >
                  <option value="All">All Roles</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Frontend">Frontend Developer</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Cloud">Cloud & DevOps</option>
                  <option value="AI/ML">AI/ML Engineer</option>
                </select>
              </div>

              <div>
                <select
                  value={minMatchFilter}
                  onChange={(e) => setMinMatchFilter(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
                >
                  <option value={0}>All Match Levels</option>
                  <option value={70}>High Match (≥ 70%)</option>
                  <option value={50}>Moderate Match (≥ 50%)</option>
                </select>
              </div>
            </div>

            {/* Jobs Grid */}
            {filteredJobs.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-300 rounded-xl text-slate-500 text-xs space-y-2">
                <Briefcase className="w-8 h-8 mx-auto text-slate-300" />
                <p className="font-semibold text-slate-700">No matching positions found</p>
                <p>Try clearing filters or search queries.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredJobs.map((job) => {
                  const quick = computeQuickMatch(job);
                  const isSelected = selectedJob?.id === job.id;

                  return (
                    <div
                      key={job.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/20 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs'
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-slate-900 truncate">{job.title}</h3>
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
                            <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold font-mono border ${
                              quick.pct >= 70
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : quick.pct >= 40
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}>
                              {quick.pct}% Match
                            </span>
                          </div>
                        </div>

                        {/* Matching Skills vs Missing Requirements */}
                        <div className="space-y-2 pt-1 border-t border-slate-100">
                          <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400">
                              Matching Verified Skills ({quick.matched.length})
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {quick.matched.length > 0 ? (
                                quick.matched.slice(0, 4).map((s, idx) => (
                                  <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                    {s}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[11px] text-slate-400 italic">None matched yet</span>
                              )}
                            </div>
                          </div>

                          <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400">
                              Missing Requirements ({quick.missing.length})
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {quick.missing.slice(0, 3).map((s, idx) => (
                                <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSelectJob(job)}
                        className="w-full py-2 px-3 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center justify-center gap-1.5 mt-2"
                      >
                        <span>View In-Depth Match Diagnostic</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: IN-DEPTH MATCH BREAKDOWN */}
        {activeTab === 'breakdown' && (
          <div className="p-5 sm:p-6 space-y-6">
            {selectedJob ? (
              <>
                {/* Header Overview - Clean SaaS Light Theme */}
                <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600">
                      Transparent Match Diagnostic
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{selectedJob.title}</h2>
                    <p className="text-xs text-slate-600 font-medium">{selectedJob.company} • {selectedJob.location || 'Remote'}</p>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-slate-200 text-center shrink-0 min-w-[120px] shadow-2xs">
                    <p className="text-[10px] font-mono text-slate-500 font-bold uppercase">Overall Match</p>
                    <p className="text-3xl font-extrabold text-blue-600 font-mono mt-0.5">
                      {matchResult?.overall_score || 0}%
                    </p>
                  </div>
                </div>

                {/* Score Breakdown Bars */}
                {matchResult?.breakdown && (
                  <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Diagnostic Fit Dimensions
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-600 font-medium">Technical Skills</span>
                          <span className="font-bold text-slate-900">{matchResult.breakdown.technical_skills}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: `${matchResult.breakdown.technical_skills}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-600 font-medium">Projects Fit</span>
                          <span className="font-bold text-slate-900">{matchResult.breakdown.projects_relevance}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: `${matchResult.breakdown.projects_relevance}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-600 font-medium">Education Fit</span>
                          <span className="font-bold text-slate-900">{matchResult.breakdown.education_fit}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: `${matchResult.breakdown.education_fit}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-600 font-medium">Experience Fit</span>
                          <span className="font-bold text-slate-900">{matchResult.breakdown.experience_fit}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: `${matchResult.breakdown.experience_fit}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Narrative Explanation */}
                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-950 leading-relaxed space-y-1">
                  <p className="font-bold text-blue-900 text-xs uppercase tracking-wider">Evaluation Summary:</p>
                  <p>
                    {matchResult?.explanation_narrative ||
                      (userSkills.length === 0
                        ? "Your profile currently contains 0 verified skills. Upload your resume or take assessments to calculate your match score for this position."
                        : `Your profile has been evaluated against ${selectedJob.title} requirements.`)}
                  </p>
                </div>

                {/* What You Have vs What You Need */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Confirmed Matching Skills */}
                  <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      What You Have ({matchResult?.matching_skills?.length || 0} Matching Skills)
                    </h3>
                    <div className="space-y-2">
                      {matchResult?.matching_skills && matchResult.matching_skills.length > 0 ? (
                        matchResult.matching_skills.map((item, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
                            <span className="font-semibold">{item.name}</span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                              {item.category || 'Verified'}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-xs text-center">
                          No matching skills found between your profile and this job.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      What You Need ({matchResult?.missing_skills?.length || 0} Missing Requirements)
                    </h3>
                    <div className="space-y-2">
                      {matchResult?.missing_skills && matchResult.missing_skills.length > 0 ? (
                        matchResult.missing_skills.map((gap, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg bg-rose-50/60 border border-rose-200 text-xs text-rose-950 space-y-0.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold">{gap.name}</span>
                              <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded uppercase">
                                {gap.priority}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600">
                              {gap.is_required ? 'Mandatory qualification for candidate screening.' : 'Preferred secondary competency.'}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs text-center font-medium">
                          You meet all required technical skills for this role!
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Recommendations */}
                {matchResult?.recommendations && matchResult.recommendations.length > 0 && (
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Targeted Recommendations to Bridge Gaps
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {matchResult.recommendations.map((rec, idx) => (
                        <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                          <span className="text-[10px] font-bold text-blue-600 uppercase font-mono">Recommendation {idx + 1}</span>
                          <p className="text-xs text-slate-700 leading-relaxed font-medium">{rec}</p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => setCurrentView('career-path')}
                        className="py-2 px-4 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-2xs"
                      >
                        <span>Open Learning Roadmap</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                Select a position from the list to inspect its match breakdown.
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
