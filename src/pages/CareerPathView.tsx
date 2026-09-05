import React, { useState, useEffect } from 'react';
import {
  Compass,
  CheckCircle2,
  Clock,
  PlayCircle,
  FolderGit2,
  FileText,
  Briefcase,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { api } from '../services/api';
import { PersonalizedRoadmap, SkillGapItem, RecommendedProject } from '../types';
import { useAuth } from '../context/AuthContext';

interface CareerPathViewProps {
  setCurrentView: (view: string) => void;
}

export const CareerPathView: React.FC<CareerPathViewProps> = ({ setCurrentView }) => {
  const { profile } = useAuth();
  const [roadmap, setRoadmap] = useState<PersonalizedRoadmap | null>(null);
  const [gaps, setGaps] = useState<SkillGapItem[]>([]);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set([1]));

  const targetRole = profile?.target_role || 'AI/ML Engineer';

  useEffect(() => {
    async function loadData() {
      try {
        const [roadmapData, gapsData] = await Promise.all([
          api.getRoadmap().catch(() => null),
          api.getSkillGaps().catch(() => ({ gaps: [] }))
        ]);
        if (roadmapData) setRoadmap(roadmapData);
        if (gapsData && gapsData.gaps) setGaps(gapsData.gaps);
      } catch (err) {
        console.error('Error loading Career Path data:', err);
      }
    }
    loadData();
  }, []);

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(stepNumber)) {
        next.delete(stepNumber);
      } else {
        next.add(stepNumber);
      }
      return next;
    });
  };

  const stages = [
    {
      step_number: 1,
      stage_name: 'Skill Development',
      task_title: 'Docker Fundamentals',
      skill_covered: 'Docker',
      estimated_time: '6 hours',
      why_it_matters: 'Containerizing Python scripts guarantees reproducible runs across development and production environments.',
      action_label: 'Start Learning',
      action_icon: PlayCircle,
      action_target: 'learning'
    },
    {
      step_number: 2,
      stage_name: 'Skill Development',
      task_title: 'FastAPI & REST Model Serving',
      skill_covered: 'FastAPI',
      estimated_time: '8 hours',
      why_it_matters: 'Production AI systems require low-latency REST endpoints to serve model inference to web and mobile apps.',
      action_label: 'Start Learning',
      action_icon: PlayCircle,
      action_target: 'learning'
    },
    {
      step_number: 3,
      stage_name: 'Projects & Portfolio',
      task_title: 'Build ML Deployment Project',
      skill_covered: 'Full Pipeline & Cloud',
      estimated_time: '10 hours',
      why_it_matters: 'Demonstrates proof-of-work with live cloud URL, Dockerized container, and Swagger API documentation.',
      action_label: 'View Project',
      action_icon: FolderGit2,
      action_target: 'project'
    },
    {
      step_number: 4,
      stage_name: 'Resume Improvement',
      task_title: 'Update Resume & ATS Metrics',
      skill_covered: 'ATS Optimization',
      estimated_time: '2 hours',
      why_it_matters: 'Adding quantifiable impact metrics (e.g. 94% accuracy, 120ms latency) helps your resume pass hiring screeners.',
      action_label: 'Improve Resume',
      action_icon: FileText,
      action_target: 'resume'
    },
    {
      step_number: 5,
      stage_name: 'Job Readiness & Placement',
      task_title: 'Apply for AI/ML Roles',
      skill_covered: 'Job Placement',
      estimated_time: 'Ongoing',
      why_it_matters: 'Match your verified profile with open postings and submit tailored applications.',
      action_label: 'Start Applying',
      action_icon: Briefcase,
      action_target: 'jobs'
    }
  ];

  const handleAction = (target: string) => {
    if (target === 'resume') {
      setCurrentView('resume');
    } else if (target === 'jobs') {
      setCurrentView('jobs');
    } else {
      // Toggle or show feedback
      alert('Action started! Check the resource links or project details.');
    }
  };

  const calculatedCompletion = Math.round((completedSteps.size / stages.length) * 100);

  return (
    <div id="careeriq-career-path-view" className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      
      {/* Title & Subtitle */}
      <div className="bg-[#0F172A] rounded-2xl p-6 text-white shadow-xs border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Compass className="w-3.5 h-3.5" />
            Personalized Roadmap
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Your Career Path
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            A personalized roadmap to help you become job-ready for <strong className="text-blue-300">{targetRole}</strong>.
          </p>
        </div>

        <div className="shrink-0 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 text-center min-w-[130px]">
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Roadmap Progress</p>
          <p className="text-2xl font-extrabold text-blue-400 font-mono mt-0.5">{calculatedCompletion}%</p>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {completedSteps.size} of {stages.length} Complete
          </span>
        </div>
      </div>

      {/* Clear Progression Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Career Progression Stages</h2>
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-xs font-semibold text-slate-700 pt-1">
          <div className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex-1 text-center font-bold">
            Current Skills
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          <div className="px-3 py-2 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 flex-1 text-center font-bold">
            Skill Development
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          <div className="px-3 py-2 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 flex-1 text-center font-bold">
            Projects
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          <div className="px-3 py-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex-1 text-center font-bold">
            Resume Improvement
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          <div className="px-3 py-2 rounded-xl bg-slate-100 text-slate-900 border border-slate-200 flex-1 text-center font-bold">
            Job Readiness
          </div>
        </div>
      </div>

      {/* Sequential Milestone Steps */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Step-by-Step Action Plan</h2>
        
        <div className="space-y-4">
          {stages.map((stage) => {
            const isDone = completedSteps.has(stage.step_number);
            const Icon = stage.action_icon;

            return (
              <div
                key={stage.step_number}
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  isDone
                    ? 'border-emerald-200 bg-emerald-50/40'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <button
                      onClick={() => toggleStep(stage.step_number)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-colors shrink-0 mt-0.5 ${
                        isDone
                          ? 'bg-emerald-600 text-white'
                          : 'border-2 border-slate-300 text-slate-500 hover:border-blue-500 hover:text-blue-600'
                      }`}
                      title={isDone ? 'Click to mark incomplete' : 'Click to mark complete'}
                    >
                      {isDone ? '✓' : stage.step_number}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {stage.stage_name}
                        </span>
                        <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {stage.estimated_time}
                        </span>
                      </div>
                      <h3 className={`text-sm sm:text-base font-bold mt-1 ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                        Step {stage.step_number}: {stage.task_title}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAction(stage.action_target)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 shrink-0 self-start sm:self-center ${
                      isDone
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{stage.action_label}</span>
                  </button>
                </div>

                <div className="pl-10 space-y-2">
                  <div className="p-3 bg-slate-50/80 rounded-xl text-xs text-slate-700 leading-relaxed border border-slate-100">
                    <strong className="text-slate-900 font-semibold">Why it matters:</strong> {stage.why_it_matters}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick AI Help Banner */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5 text-center sm:text-left">
          <h3 className="text-xs font-bold text-slate-900 uppercase">Have questions about your roadmap?</h3>
          <p className="text-xs text-slate-500">Ask CareerIQ AI to tailor your learning recommendations or explain concepts.</p>
        </div>
        <button
          onClick={() => setCurrentView('assistant')}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-2xs shrink-0"
        >
          Ask CareerIQ AI
        </button>
      </div>

    </div>
  );
};
