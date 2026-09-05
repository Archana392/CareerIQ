import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Award,
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  FileText,
  ShieldCheck,
  Plus,
  X,
  Clock,
  ChevronRight,
  Edit3,
  Trash2,
  Mail,
  GraduationCap
} from 'lucide-react';
import { api } from '../services/api';
import { RecruiterJob, RecruiterReadinessScore, CandidateApplication } from '../types';
import { useAuth } from '../context/AuthContext';

export const RecruiterView: React.FC = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'readiness' | 'candidates' | 'jobs'>('readiness');

  const [readiness, setReadiness] = useState<RecruiterReadinessScore | null>(null);
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [candidateSearch, setCandidateSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [matchingJobFilter, setMatchingJobFilter] = useState<RecruiterJob | null>(null);

  // Candidate Inspection & Interview Modals
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [schedulingCandidate, setSchedulingCandidate] = useState<any | null>(null);
  const [interviewDate, setInterviewDate] = useState('2026-09-15T14:00');
  const [interviewNotes, setInterviewNotes] = useState('Initial technical screen covering Python, system design, and ML pipeline projects.');
  const [schedulingLoading, setSchedulingLoading] = useState(false);

  // New Job Modal
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('TechCorp Labs');
  const [newLocation, setNewLocation] = useState('San Francisco, CA (Hybrid)');
  const [newSkills, setNewSkills] = useState('Python, PyTorch, Docker, FastAPI, PostgreSQL');
  const [newSalary, setNewSalary] = useState('$115,000 - $145,000');
  const [creatingJob, setCreatingJob] = useState(false);

  // Edit Job Modal
  const [editingJob, setEditingJob] = useState<RecruiterJob | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editSkills, setEditSkills] = useState('');
  const [editSalary, setEditSalary] = useState('');
  const [updatingJob, setUpdatingJob] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [readinessData, jobsData, candidatesData] = await Promise.all([
        api.getRecruiterReadiness().catch(() => null),
        api.getRecruiterJobs().catch(() => []),
        api.getRecruiterCandidates().catch(() => [])
      ]);
      if (readinessData) setReadiness(readinessData);
      setJobs(jobsData);
      setCandidates(candidatesData);
    } catch (e) {
      console.error('Error loading recruiter data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (candidateId: string, status: string) => {
    try {
      await api.updateCandidateStatus(candidateId, { status });
      setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, status } : c));
      if (selectedCandidate?.id === candidateId) {
        setSelectedCandidate((prev: any) => prev ? { ...prev, status } : null);
      }
    } catch (e) {
      console.error('Failed to update status:', e);
    }
  };

  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedulingCandidate) return;
    setSchedulingLoading(true);
    try {
      await api.updateCandidateStatus(schedulingCandidate.id, {
        status: 'Interview Scheduled',
        interview_date: interviewDate,
        interview_notes: interviewNotes
      });
      setCandidates(prev =>
        prev.map(c =>
          c.id === schedulingCandidate.id
            ? { ...c, status: 'Interview Scheduled', interview_date: interviewDate }
            : c
        )
      );
      setSchedulingCandidate(null);
    } catch (err) {
      console.error('Failed to schedule interview:', err);
    } finally {
      setSchedulingLoading(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreatingJob(true);
    try {
      const skillList = newSkills.split(',').map(s => s.trim()).filter(Boolean);
      const created = await api.createRecruiterJob({
        title: newTitle,
        company: newCompany,
        location: newLocation,
        required_skills: skillList,
        target_skills: skillList,
        experience_level: 'Mid-Senior',
        salary_range: newSalary
      });
      setJobs(prev => [created, ...prev]);
      setShowCreateJob(false);
      setNewTitle('');
    } catch (e) {
      console.error('Create job failed:', e);
    } finally {
      setCreatingJob(false);
    }
  };

  const openEditModal = (job: RecruiterJob) => {
    setEditingJob(job);
    setEditTitle(job.title);
    setEditCompany(job.company);
    setEditLocation(job.location || 'Remote');
    setEditSkills((job.required_skills || job.target_skills || []).join(', '));
    setEditSalary(job.salary_range || '$110,000 - $145,000');
  };

  const handleUpdateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;
    setUpdatingJob(true);
    try {
      const skillList = editSkills.split(',').map(s => s.trim()).filter(Boolean);
      const updated = await api.updateRecruiterJob(editingJob.id, {
        title: editTitle,
        company: editCompany,
        location: editLocation,
        required_skills: skillList,
        target_skills: skillList,
        salary_range: editSalary
      });
      setJobs(prev => prev.map(j => (j.id === editingJob.id ? updated : j)));
      setEditingJob(null);
    } catch (err) {
      console.error('Failed to update job:', err);
    } finally {
      setUpdatingJob(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this requisition?')) return;
    try {
      await api.deleteRecruiterJob(jobId);
      setJobs(prev => prev.filter(j => j.id !== jobId));
      if (matchingJobFilter?.id === jobId) {
        setMatchingJobFilter(null);
      }
    } catch (err) {
      console.error('Failed to delete job:', err);
    }
  };

  const handleMatchCandidatesForJob = (job: RecruiterJob) => {
    setMatchingJobFilter(job);
    setActiveTab('candidates');
  };

  // Filtered Candidates
  const filteredCandidates = candidates.filter(cand => {
    const matchesSearch =
      !candidateSearch ||
      cand.name?.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      cand.target_role?.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      cand.verified_skills?.some((s: string) => s.toLowerCase().includes(candidateSearch.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || (cand.status || 'Screening') === statusFilter;

    let matchesJob = true;
    if (matchingJobFilter) {
      const jobSkills = matchingJobFilter.required_skills || matchingJobFilter.target_skills || [];
      const candSkills = cand.verified_skills || [];
      const hasSkillOverlap = jobSkills.some((js: string) =>
        candSkills.some((cs: string) => cs.toLowerCase() === js.toLowerCase())
      );
      matchesJob = hasSkillOverlap;
    }

    return matchesSearch && matchesStatus && matchesJob;
  });

  const overallScore = readiness?.overall_score || 78;
  const hiringVerdict = readiness?.hiring_verdict || 'Strong Candidate - Ready for Technical Screen';

  return (
    <div id="careeriq-recruiter-view" className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-[#0F172A] rounded-2xl p-6 sm:p-7 text-white shadow-xs border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Recruiter Intelligence & Pipeline</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Recruiter Hub & 12-Factor Readiness
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Evaluate candidate employability across industry standard dimensions and manage job requisition matching pipelines.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setActiveTab('readiness')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'readiness'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            12-Factor Scorecard
          </button>
          <button
            onClick={() => setActiveTab('candidates')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'candidates'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Candidates ({candidates.length})
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'jobs'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Requisitions ({jobs.length})
          </button>
        </div>
      </div>

      {/* TAB 1: 12-FACTOR READINESS SCORECARD */}
      {activeTab === 'readiness' && (
        <div className="space-y-6">
          
          {/* Executive Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Overall Recruiter Employability Score
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900 font-mono">{overallScore}</span>
                  <span className="text-xs text-slate-400 font-mono">/ 100</span>
                  <span className="ml-2 px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {hiringVerdict}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 font-medium max-w-sm">
                Candidate meets or exceeds benchmark standards across 9 of 12 hiring criteria.
              </div>
            </div>

            {/* 12 Factors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {readiness?.criteria?.map((item, idx) => {
                const score = item.score;
                const statusColor = score >= 80 ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : score >= 65 ? 'text-blue-700 bg-blue-50 border-blue-200'
                  : 'text-amber-700 bg-amber-50 border-amber-200';

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800">{item.name}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${statusColor}`}>
                        {score}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${score >= 80 ? 'bg-emerald-500' : score >= 65 ? 'bg-blue-500' : 'bg-amber-500'}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-500 leading-snug">{item.feedback}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CANDIDATES */}
      {activeTab === 'candidates' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden space-y-4">
          
          {/* Pipeline Search & Filter Bar */}
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={candidateSearch}
                  onChange={(e) => setCandidateSearch(e.target.value)}
                  placeholder="Search by candidate name, skill, or role..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Stage:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white text-slate-700"
              >
                <option value="All">All Stages ({candidates.length})</option>
                <option value="Screening">Screening</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Offer Extended">Offer Extended</option>
                <option value="Rejected">Archived</option>
              </select>
            </div>
          </div>

          {/* Requisition Matching Alert Badge */}
          {matchingJobFilter && (
            <div className="mx-4 p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  Filtering candidates matching requisition: <strong>{matchingJobFilter.title}</strong> ({matchingJobFilter.company})
                </span>
              </div>
              <button
                onClick={() => setMatchingJobFilter(null)}
                className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear Filter</span>
              </button>
            </div>
          )}

          {/* Candidates List */}
          <div className="divide-y divide-slate-100">
            {filteredCandidates.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                No candidates match your current search and filter criteria.
              </div>
            ) : (
              filteredCandidates.map((cand) => (
                <div
                  key={cand.id}
                  className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div
                      onClick={() => setSelectedCandidate(cand)}
                      className="w-10 h-10 rounded-xl bg-[#0F172A] text-blue-400 font-bold flex items-center justify-center shrink-0 cursor-pointer hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      {(cand.name || 'C').charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4
                          onClick={() => setSelectedCandidate(cand)}
                          className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer"
                        >
                          {cand.name}
                        </h4>
                        <span className="text-[11px] font-mono text-slate-400">{cand.email}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{cand.target_role || 'AI/ML Candidate'}</p>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {cand.verified_skills?.slice(0, 6).map((sk: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-auto">
                    <div className="text-right">
                      <p className="text-[10px] font-mono text-slate-400 uppercase">Readiness</p>
                      <p className="text-xl font-bold font-mono text-blue-600">{cand.readiness_score}%</p>
                    </div>

                    <select
                      value={cand.status || 'Screening'}
                      onChange={(e) => handleUpdateStatus(cand.id, e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white text-slate-700 shadow-2xs focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Screening">Screening</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Interview Scheduled">Interview Scheduled</option>
                      <option value="Offer Extended">Offer Extended</option>
                      <option value="Rejected">Archived</option>
                    </select>

                    <button
                      onClick={() => setSchedulingCandidate(cand)}
                      className="p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 text-xs font-bold flex items-center gap-1"
                      title="Schedule Interview"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Schedule</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: REQUISITIONS */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Open Hiring Requisitions ({jobs.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Manage live job posts, edit required skills, or match directly against candidates.</p>
            </div>
            <button
              onClick={() => setShowCreateJob(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-2xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post New Role</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-blue-400 transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600">{job.company}</span>
                    <span className="text-[10px] font-mono text-slate-400">{job.location}</span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900">{job.title}</h4>
                  <p className="text-xs text-slate-500 font-medium">Salary: {job.salary_range || 'Competitive'}</p>

                  <div>
                    <p className="text-[11px] font-bold text-slate-700 mb-1.5">Required Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {(job.required_skills || job.target_skills)?.map((sk, i) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <button
                    onClick={() => handleMatchCandidatesForJob(job)}
                    className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>View Matching Candidates</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(job)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                      title="Edit requisition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                      title="Delete requisition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CANDIDATE DETAIL MODAL */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0F172A] text-blue-400 font-bold flex items-center justify-center">
                  {(selectedCandidate.name || 'C').charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedCandidate.name}</h3>
                  <p className="text-[11px] text-slate-400">{selectedCandidate.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCandidate(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-400 font-mono text-[10px] uppercase">Target Track</span>
                  <p className="font-bold text-slate-800">{selectedCandidate.target_role || 'AI/ML Candidate'}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-mono text-[10px] uppercase">Readiness Score</span>
                  <p className="font-bold text-blue-600 font-mono text-sm">{selectedCandidate.readiness_score}%</p>
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-bold block mb-1">Verified Technical Skills:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedCandidate.verified_skills?.map((sk: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <span className="text-slate-500 font-bold block mb-1">Current Candidate Stage:</span>
                <select
                  value={selectedCandidate.status || 'Screening'}
                  onChange={(e) => handleUpdateStatus(selectedCandidate.id, e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                >
                  <option value="Screening">Screening</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Offer Extended">Offer Extended</option>
                  <option value="Rejected">Archived</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setSchedulingCandidate(selectedCandidate);
                  setSelectedCandidate(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-2xs flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule Interview</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULE INTERVIEW MODAL */}
      {schedulingCandidate && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-blue-600 font-bold">Interview Pipeline</span>
                <h3 className="text-base font-bold text-slate-900">Schedule with {schedulingCandidate.name}</h3>
              </div>
              <button onClick={() => setSchedulingCandidate(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleInterview} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Interview Date & Time</label>
                <input
                  type="datetime-local"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Agenda / Interviewer Notes</label>
                <textarea
                  rows={3}
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSchedulingCandidate(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={schedulingLoading}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-2xs flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{schedulingLoading ? 'Scheduling...' : 'Confirm Interview'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE JOB MODAL */}
      {showCreateJob && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Post New Requisition</h3>
              <button onClick={() => setShowCreateJob(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Role Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. AI Research Engineer"
                  className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Company</label>
                  <input
                    type="text"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Salary Range</label>
                <input
                  type="text"
                  value={newSalary}
                  onChange={(e) => setNewSalary(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Required Skills (comma separated)</label>
                <input
                  type="text"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateJob(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingJob}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-2xs"
                >
                  {creatingJob ? 'Posting...' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT JOB MODAL */}
      {editingJob && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Edit Requisition</h3>
              <button onClick={() => setEditingJob(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateJob} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Role Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Company</label>
                  <input
                    type="text"
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Location</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Salary Range</label>
                <input
                  type="text"
                  value={editSalary}
                  onChange={(e) => setEditSalary(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Required Skills (comma separated)</label>
                <input
                  type="text"
                  value={editSkills}
                  onChange={(e) => setEditSkills(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingJob(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingJob}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-2xs"
                >
                  {updatingJob ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
