import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Milestone,
  ArrowRight,
  BookOpen,
  FolderGit2,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';
import { SkillGapItem } from '../types';
import { useAuth } from '../context/AuthContext';

interface SkillGapViewProps {
  setCurrentView: (view: string) => void;
}

export const SkillGapView: React.FC<SkillGapViewProps> = ({ setCurrentView }) => {
  const { profile } = useAuth();
  const [gaps, setGaps] = useState<SkillGapItem[]>([]);
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSkillGaps()
      .then(res => {
        setGaps(res.gaps || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredGaps = filterPriority === 'ALL'
    ? gaps
    : gaps.filter(g => g.priority === filterPriority);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div id="careeriq-skill-gap-view" className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Prioritized Skill Gap Matrix</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              Gap Analysis
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Target Track: <strong className="text-slate-900 font-semibold">{profile?.target_role || 'AI/ML Engineer'}</strong>. Diagnosed gaps prioritized by industry demand impact.
          </p>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(p => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                filterPriority === p ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Gaps List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGaps.map((gap, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-indigo-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{gap.skill_name}</h3>
                  <span className="text-[11px] text-slate-400 font-medium">Domain: {gap.category}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${getPriorityBadge(gap.priority)}`}>
                  {gap.priority} Priority
                </span>
              </div>

              {/* Rationale */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-1">
                <p className="font-semibold text-slate-900">Why It's Critical:</p>
                <p className="text-slate-600 leading-relaxed">{gap.why_important}</p>
              </div>

              {/* Suggested Project Application */}
              {gap.suggested_project && (
                <div className="flex items-start gap-2 text-xs text-slate-600 pt-1">
                  <FolderGit2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900">Portfolio Proof: </span>
                    <span>{gap.suggested_project}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Est. 2-3 weeks to bridge</span>
              <button
                onClick={() => setCurrentView('roadmap')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
              >
                Add to Learning Plan
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
