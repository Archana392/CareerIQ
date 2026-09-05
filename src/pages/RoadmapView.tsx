import React, { useState, useEffect } from 'react';
import {
  Milestone,
  CheckCircle2,
  Circle,
  Sparkles,
  RefreshCw,
  Clock,
  BookOpen,
  FolderGit2,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';
import { PersonalizedRoadmap, RoadmapStep } from '../types';
import { useAuth } from '../context/AuthContext';

interface RoadmapViewProps {
  setCurrentView: (view: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ setCurrentView }) => {
  const { profile } = useAuth();
  const [roadmap, setRoadmap] = useState<PersonalizedRoadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadRoadmap();
  }, []);

  const loadRoadmap = async () => {
    try {
      const data = await api.getRoadmap();
      setRoadmap(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStep = async (stepId: string) => {
    try {
      const updated = await api.toggleRoadmapStep(stepId);
      setRoadmap(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRegenerate = async () => {
    setGenerating(true);
    try {
      const fresh = await api.generateRoadmap();
      setRoadmap(fresh);
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const completedSteps = roadmap?.steps.filter(s => s.completed).length || 0;
  const totalSteps = roadmap?.steps.length || 5;
  const progressPercent = roadmap?.completion_percentage || Math.round((completedSteps / totalSteps) * 100);

  return (
    <div id="careeriq-roadmap-view" className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Personalized Learning Roadmap</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              AI Synthesized
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Target Track: <strong className="text-slate-900 font-semibold">{profile?.target_role || 'AI/ML Engineer'}</strong>. Step-by-step milestones to bridge high-priority skill gaps.
          </p>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={generating}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50 inline-flex items-center gap-2"
        >
          {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {generating ? 'Synthesizing with AI...' : 'Regenerate Roadmap'}
        </button>
      </div>

      {/* Roadmap Overview Banner */}
      {roadmap && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">{roadmap.title}</h2>
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Est. Duration: {roadmap.estimated_duration_months} Months
                </span>
                <span>•</span>
                <span>{completedSteps} of {totalSteps} Milestones Complete</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-2xl font-extrabold text-emerald-600 font-display">{progressPercent}%</span>
              <span className="text-xs text-slate-400 block">Readiness Progress</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Interactive Milestones Timeline */}
      {roadmap && (
        <div className="space-y-4">
          {roadmap.steps.map((step, idx) => {
            const isDone = step.completed;
            return (
              <div
                key={step.id}
                className={`bg-white rounded-2xl border p-6 shadow-xs transition-all space-y-4 ${
                  isDone ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    {/* Toggle Button */}
                    <button
                      onClick={() => handleToggleStep(step.id)}
                      className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors focus:outline-hidden"
                      title={isDone ? 'Mark as Incomplete' : 'Mark as Complete'}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-300 hover:text-slate-400" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                          Milestone {step.step_order}
                        </span>
                        <span className={`px-2 py-0.2 rounded-sm text-[9px] font-bold uppercase ${
                          step.priority === 'HIGH' ? 'bg-rose-50 text-rose-700' : 'bg-indigo-50 text-indigo-700'
                        }`}>
                          {step.priority} Priority
                        </span>
                      </div>
                      <h3 className={`text-base font-bold mt-0.5 ${isDone ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                        {step.title} ({step.skill_name})
                      </h3>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg shrink-0">
                    ~{step.estimated_weeks} Weeks
                  </span>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-9 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <p className="font-semibold text-slate-900">Learning Objective:</p>
                    <p className="text-slate-600">{step.learning_objective}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <p className="font-semibold text-slate-900">Recommended Portfolio Deliverable:</p>
                    <p className="text-indigo-900 font-medium">{step.suggested_project}</p>
                  </div>
                </div>

                {/* Curated Resources */}
                {step.resources && step.resources.length > 0 && (
                  <div className="pl-9 pt-1 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Resources:</span>
                    {step.resources.map((res, rIdx) => (
                      <span
                        key={rIdx}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer inline-flex items-center gap-1"
                      >
                        <BookOpen className="w-3 h-3 text-slate-500" />
                        {res.title}
                      </span>
                    ))}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
