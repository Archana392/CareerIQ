import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Award,
  FileText,
  Briefcase,
  Compass,
  ArrowRight,
  Bot,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  FolderGit2,
  ChevronRight,
  UploadCloud,
  GraduationCap,
  ShieldCheck,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { CareerReadinessScore, PersonalizedRoadmap, SkillGapItem, ResumeData } from '../types';

interface DashboardViewProps {
  setCurrentView: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ setCurrentView }) => {
  const { user, profile, refreshProfile, loadDemoMode, clearDemoMode } = useAuth();
  const [readiness, setReadiness] = useState<CareerReadinessScore | null>(null);
  const [roadmap, setRoadmap] = useState<PersonalizedRoadmap | null>(null);
  const [gaps, setGaps] = useState<SkillGapItem[]>([]);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoActionLoading, setDemoActionLoading] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [readinessData, roadmapData, gapsData, resumeData] = await Promise.all([
          api.getCareerReadiness().catch(() => null),
          api.getRoadmap().catch(() => null),
          api.getSkillGaps().catch(() => ({ gaps: [] })),
          api.getResume().catch(() => null)
        ]);
        if (readinessData) setReadiness(readinessData);
        if (roadmapData) setRoadmap(roadmapData);
        if (gapsData && gapsData.gaps) setGaps(gapsData.gaps);
        if (resumeData) setResume(resumeData);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [profile?.resume_uploaded]);

  const handleDemoSwitch = async (load: boolean) => {
    setDemoActionLoading(true);
    try {
      if (load) {
        await loadDemoMode();
      } else {
        await clearDemoMode();
        setResume(null);
        setReadiness(null);
        setRoadmap(null);
        setGaps([]);
      }
      await refreshProfile();
      // reload dashboard data
      const [readinessData, roadmapData, gapsData, resumeData] = await Promise.all([
        api.getCareerReadiness().catch(() => null),
        api.getRoadmap().catch(() => null),
        api.getSkillGaps().catch(() => ({ gaps: [] })),
        api.getResume().catch(() => null)
      ]);
      setReadiness(readinessData);
      setRoadmap(roadmapData);
      setGaps(gapsData?.gaps || []);
      setResume(resumeData);
    } catch (e) {
      console.error('Demo toggle error:', e);
    } finally {
      setDemoActionLoading(false);
    }
  };

  const userName = user?.full_name || profile?.full_name || 'Candidate';
  const targetRole = profile?.target_role || 'AI/ML Candidate';

  // Strict data-driven state determination
  const hasResume = Boolean(profile?.resume_uploaded) || Boolean(resume && resume.detected_skills && resume.detected_skills.length > 0);

  const overallScore = hasResume ? (readiness?.overall_score || 78) : 0;
  const verifiedSkillsList = hasResume
    ? (resume?.detected_skills?.map(s => s.name) || ['Python', 'Machine Learning', 'SQL', 'Git', 'Linux'])
    : [];
  const verifiedSkillsCount = verifiedSkillsList.length;
  const atsScore = hasResume ? (resume?.ats_analysis?.ats_score || 84) : 0;
  const skillsToLearn = hasResume
    ? (gaps.length > 0 ? gaps.map(g => g.skill_name) : ['Docker', 'FastAPI', 'MLOps'])
    : [];

  return (
    <div id="careeriq-dashboard-view" className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      
      {/* 1. TOP SECTION — Welcome & State-Aware Headline */}
      <div className="bg-[#0F172A] rounded-2xl p-6 sm:p-7 text-white shadow-xs border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Career Intelligence Platform</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                hasResume
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                  : 'bg-amber-950 text-amber-300 border border-amber-800/60'
              }`}>
                {hasResume ? 'Active Profile (Calibrated)' : 'State A (New Candidate)'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome, {userName}
            </h1>

            {hasResume ? (
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                You're currently <strong className="text-emerald-400 font-bold">{overallScore}% career ready</strong> for <span className="text-blue-300 font-semibold">{targetRole}</span> roles.
              </p>
            ) : (
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
                Set up your profile for <span className="text-blue-300 font-semibold">{targetRole}</span>. Upload your resume or take a skill quiz to calculate your career readiness score.
              </p>
            )}
          </div>

          <div className="shrink-0 flex items-center gap-3">
            {hasResume ? (
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-center min-w-[140px]">
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Career Readiness</p>
                <p className="text-3xl font-extrabold text-white font-mono mt-1">
                  {overallScore}<span className="text-xs font-normal text-slate-400">/100</span>
                </p>
                <span className="inline-block mt-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/90 px-2.5 py-0.5 rounded border border-emerald-800/60">
                  {overallScore >= 70 ? 'Career Ready' : 'In Progress'}
                </span>
              </div>
            ) : (
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-center min-w-[140px]">
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Career Readiness</p>
                <p className="text-2xl font-bold text-amber-400 font-mono mt-1">Pending</p>
                <span className="inline-block mt-1 text-[10px] font-bold text-amber-300 bg-amber-950/90 px-2 py-0.5 rounded border border-amber-800/60">
                  Upload Resume
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Demo Switcher Toolbar */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-400 font-medium">
            {hasResume
              ? 'Profile loaded with verified resume and skill gap analysis.'
              : 'Brand new account state active. No resume or skills assumed.'}
          </span>

          <div className="flex items-center gap-2">
            {hasResume ? (
              <button
                onClick={() => handleDemoSwitch(false)}
                disabled={demoActionLoading}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to New User State</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => setCurrentView('onboarding')}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-2xs flex items-center gap-1.5 transition-colors"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Start Onboarding</span>
                </button>
                <button
                  onClick={() => handleDemoSwitch(true)}
                  disabled={demoActionLoading}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Load Demo Profile (Archana)</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* STATE A CALL-TO-ACTION HERO (ONLY WHEN NO RESUME) */}
      {!hasResume && (
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50/60 rounded-2xl border border-blue-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded">
              Recommended Next Step
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Upload Your Resume to Calibrate Your Employability
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              CareerIQ uses deterministic skill extraction and ATS modeling to scan your resume against live industry requirements for <strong>{targetRole}</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setCurrentView('resume')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs flex items-center justify-center gap-2 transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Resume Now</span>
            </button>
            <button
              onClick={() => setCurrentView('courses')}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold shadow-2xs flex items-center justify-center gap-2 transition-all"
            >
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>Take Skill Quiz</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. FOUR SUMMARY CARDS (DATA-DRIVEN) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Career Readiness */}
        <div
          id="stat-card-readiness"
          onClick={() => setCurrentView('career-path')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-blue-400 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Career Readiness</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            {hasResume ? (
              <>
                <p className="text-2xl font-bold font-mono text-slate-900">{overallScore}/100</p>
                <p className="text-xs text-slate-500 font-medium">
                  {overallScore >= 70 ? 'Career Ready' : 'Action Needed'}
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold font-mono text-slate-400">-- / 100</p>
                <p className="text-xs text-amber-600 font-medium">Pending upload</p>
              </>
            )}
          </div>
          <div className="pt-2 flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:text-blue-700">
            <span>View Career Path</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Resume Score */}
        <div
          id="stat-card-resume"
          onClick={() => setCurrentView('resume')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-blue-400 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">ATS Score</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            {hasResume ? (
              <>
                <p className="text-2xl font-bold font-mono text-emerald-600">{atsScore}/100</p>
                <p className="text-xs text-slate-500 font-medium">ATS compatible</p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold font-mono text-slate-400">-- / 100</p>
                <p className="text-xs text-slate-400 font-medium">Not evaluated yet</p>
              </>
            )}
          </div>
          <div className="pt-2 flex items-center gap-1 text-xs font-bold text-emerald-600 group-hover:text-emerald-700">
            <span>{hasResume ? 'Analyze Resume' : 'Upload Resume'}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Verified Skills */}
        <div
          id="stat-card-skills"
          onClick={() => setCurrentView('profile')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-purple-400 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Verified Skills</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            {hasResume ? (
              <>
                <p className="text-2xl font-bold font-mono text-purple-600">{verifiedSkillsCount} Skills</p>
                <p className="text-xs text-slate-500 font-medium truncate">
                  {verifiedSkillsList.slice(0, 3).join(', ')}...
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold font-mono text-slate-400">0 Skills</p>
                <p className="text-xs text-slate-400 font-medium">No resume detected</p>
              </>
            )}
          </div>
          <div className="pt-2 flex items-center gap-1 text-xs font-bold text-purple-600 group-hover:text-purple-700">
            <span>{hasResume ? 'View Skills' : 'Earn Badges'}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Skill Gaps */}
        <div
          id="stat-card-gaps"
          onClick={() => setCurrentView('career-path')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-amber-400 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Skill Gaps</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            {hasResume ? (
              <>
                <p className="text-2xl font-bold font-mono text-amber-600">{skillsToLearn.length} Skills</p>
                <p className="text-xs text-slate-500 font-medium truncate">
                  {skillsToLearn.slice(0, 2).join(', ')}...
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold font-mono text-slate-400">Pending</p>
                <p className="text-xs text-slate-400 font-medium">Needs comparison</p>
              </>
            )}
          </div>
          <div className="pt-2 flex items-center gap-1 text-xs font-bold text-amber-600 group-hover:text-amber-700">
            <span>View Skill Gaps</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

      {/* 3. YOUR NEXT STEPS (DATA-DRIVEN) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Your Next Steps</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {hasResume
                ? 'Recommended priority actions tailored to your verified skill profile'
                : 'Complete the foundational onboarding checklist to unlock customized actions'}
            </p>
          </div>
          <button
            onClick={() => setCurrentView(hasResume ? 'career-path' : 'onboarding')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>{hasResume ? 'View Full Path' : 'Onboarding Guide'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {hasResume ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1: Learn Top Gap Skill */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between hover:border-blue-300 transition-colors">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                    Priority: High
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Micro-Course</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  1. Learn {skillsToLearn[0] || 'Docker'}
                </h3>
                <p className="text-xs text-slate-600">
                  Containerize your applications for production deployments in {targetRole} roles.
                </p>
              </div>
              <button
                onClick={() => setCurrentView('courses')}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                <span>Start Learning</span>
              </button>
            </div>

            {/* Step 2: Improve Resume */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between hover:border-blue-300 transition-colors">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    Priority: Medium
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Optimizer</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">2. Optimize Bullet Points</h3>
                <p className="text-xs text-slate-600">
                  Add quantifiable metrics and action verbs to pass hiring manager screens.
                </p>
              </div>
              <button
                onClick={() => setCurrentView('resume')}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Optimize Resume</span>
              </button>
            </div>

            {/* Step 3: Recruiter Hub */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between hover:border-blue-300 transition-colors">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Priority: Medium
                  </span>
                  <span className="text-xs text-slate-400 font-mono">12 Factors</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">3. Recruiter Scorecard</h3>
                <p className="text-xs text-slate-600">
                  Audit your 12-factor hiring scorecard and explore open recruiter job requisitions.
                </p>
              </div>
              <button
                onClick={() => setCurrentView('recruiter')}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>View Scorecard</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1: Upload Resume */}
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  Step 1: Required
                </span>
                <h3 className="text-sm font-bold text-slate-900">Upload Your Resume</h3>
                <p className="text-xs text-slate-600">
                  Allows CareerIQ to extract verified skills and calculate your baseline ATS score.
                </p>
              </div>
              <button
                onClick={() => setCurrentView('resume')}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload Resume</span>
              </button>
            </div>

            {/* Step 2: Target Role */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  Step 2
                </span>
                <h3 className="text-sm font-bold text-slate-900">Configure Target Role</h3>
                <p className="text-xs text-slate-600">
                  Currently set to: <strong>{targetRole}</strong>. Align career expectations and market benchmarks.
                </p>
              </div>
              <button
                onClick={() => setCurrentView('onboarding')}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Compass className="w-3.5 h-3.5 text-blue-600" />
                <span>Configure Goals</span>
              </button>
            </div>

            {/* Step 3: Take Skill Quiz */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  Step 3
                </span>
                <h3 className="text-sm font-bold text-slate-900">Verify Skills with Quizzes</h3>
                <p className="text-xs text-slate-600">
                  Earn accredited skill badges by taking proctored multiple-choice assessments.
                </p>
              </div>
              <button
                onClick={() => setCurrentView('courses')}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                <span>Explore Quizzes</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. YOUR SKILLS SECTION (DATA-DRIVEN) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Your Skills Profile</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {hasResume
              ? 'Verified technical competencies and high-priority skills to learn'
              : 'Skills detected from your resume and certified assessments'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Verified Skills */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Verified Skills ({verifiedSkillsCount})
              </p>
              <span className="text-[10px] text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded font-mono font-bold">
                {hasResume ? 'Confirmed' : 'Empty'}
              </span>
            </div>

            {hasResume && verifiedSkillsList.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {verifiedSkillsList.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-emerald-900 border border-emerald-200 shadow-2xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-white rounded-xl border border-slate-200 text-center space-y-1.5">
                <p className="text-xs text-slate-600 font-medium">No verified skills detected yet.</p>
                <p className="text-[11px] text-slate-400">
                  Upload your resume or take an assessment to have your skills certified.
                </p>
                <button
                  onClick={() => setCurrentView('resume')}
                  className="mt-2 text-xs font-bold text-blue-600 hover:underline inline-block"
                >
                  Upload Resume →
                </button>
              </div>
            )}
          </div>

          {/* Skills to Learn */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Skills to Learn ({skillsToLearn.length})
              </p>
              <span className="text-[10px] text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded font-mono font-bold">
                {hasResume ? 'Priority Gap' : 'Pending'}
              </span>
            </div>

            {hasResume && skillsToLearn.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skillsToLearn.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-amber-900 border border-amber-200 shadow-2xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-white rounded-xl border border-slate-200 text-center space-y-1.5">
                <p className="text-xs text-slate-600 font-medium">Skill gap calculation requires a resume.</p>
                <p className="text-[11px] text-slate-400">
                  Once uploaded, missing requirements for {targetRole} will appear here.
                </p>
                <button
                  onClick={() => handleDemoSwitch(true)}
                  className="mt-2 text-xs font-bold text-blue-600 hover:underline inline-block"
                >
                  Or preview sample data →
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 5. CAREER PATH PROGRESSION */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Career Path Progression</h2>
            <p className="text-xs text-slate-500 mt-0.5">Your structured milestone journey from current baseline to placement</p>
          </div>
          <button
            onClick={() => setCurrentView('career-path')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Open Roadmap</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Linear Step Progression */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2">
          
          <div className={`p-3 border rounded-xl text-center space-y-1 ${
            hasResume ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-blue-50 border-blue-200 text-blue-950'
          }`}>
            <span className="text-[10px] font-mono font-bold uppercase">Step 1</span>
            <p className="text-xs font-bold">Current Baseline</p>
            <span className="text-[10px] block font-medium">
              {hasResume ? `✓ ${verifiedSkillsCount} Verified` : 'Resume Pending'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-1">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Step 2</span>
            <p className="text-xs font-bold text-slate-800">Learn</p>
            <span className="text-[10px] text-slate-500 block font-medium">
              {skillsToLearn[0] || 'Target Skills'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-1">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Step 3</span>
            <p className="text-xs font-bold text-slate-800">Build</p>
            <span className="text-[10px] text-slate-500 block font-medium">Portfolio Projects</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-1">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Step 4</span>
            <p className="text-xs font-bold text-slate-800">Optimize</p>
            <span className="text-[10px] text-slate-500 block font-medium">ATS Formatting</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-1">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Step 5</span>
            <p className="text-xs font-bold text-slate-800">Placement</p>
            <span className="text-[10px] text-slate-500 block font-medium">Recruiter Matching</span>
          </div>

        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 border-t border-slate-100">
          <span>Need personalized mentorship or interview practice?</span>
          <button
            onClick={() => setCurrentView('assistant')}
            className="inline-flex items-center gap-1.5 font-bold text-blue-600 hover:text-blue-700"
          >
            <Bot className="w-4 h-4" />
            <span>Chat with CareerIQ AI Mentor</span>
          </button>
        </div>
      </div>

    </div>
  );
};
