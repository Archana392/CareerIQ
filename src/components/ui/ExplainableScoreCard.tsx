import React from 'react';
import { Info, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface ScoreFactor {
  label: string;
  weight: string;
  score: number;
  maxScore?: number;
  description: string;
}

interface ExplainableScoreCardProps {
  id?: string;
  title: string;
  overallScore: number;
  maxScore?: number;
  grade?: string;
  factors: ScoreFactor[];
  explanation: string;
  formulaNote?: string;
  accentColor?: 'indigo' | 'emerald' | 'amber' | 'sky';
}

export const ExplainableScoreCard: React.FC<ExplainableScoreCardProps> = ({
  id = 'explainable-score-card',
  title,
  overallScore,
  maxScore = 100,
  grade,
  factors,
  explanation,
  formulaNote,
  accentColor = 'indigo'
}) => {
  const percentage = Math.round((overallScore / maxScore) * 100);

  const getScoreBadge = () => {
    if (percentage >= 85) return { text: grade || 'Highly Competitive', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (percentage >= 70) return { text: grade || 'Career Ready', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    if (percentage >= 55) return { text: grade || 'Developing', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { text: grade || 'Needs Improvement', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
  };

  const badge = getScoreBadge();

  return (
    <div id={id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      
      {/* Header with Circular / Radial Score */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.bg}`}>
              {badge.text}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Multi-factor weighted evaluation with explainable reasoning</p>
        </div>

        <div className="flex items-baseline gap-2 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200/80">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">{overallScore}</span>
          <span className="text-xs font-medium text-slate-400">/ {maxScore}</span>
        </div>
      </div>

      {/* Weighted Factor Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Contributing Factor Breakdown</span>
          <span className="text-[11px] text-slate-400 font-medium">Weighted Contributions</span>
        </div>

        <div className="space-y-3">
          {factors.map((factor, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800">{factor.label}</span>
                  <span className="text-[10px] text-slate-400 px-1.5 py-0.5 bg-slate-100 rounded-md font-mono">{factor.weight}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900">{factor.score}</span>
                  <span className="text-slate-400 text-[10px]">/ {factor.maxScore || 100}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full transition-all duration-500 bg-indigo-600"
                  style={{ width: `${Math.min(100, Math.max(0, (factor.score / (factor.maxScore || 100)) * 100))}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-500">{factor.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Explainable AI Narrative Section */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
          <Info className="w-3.5 h-3.5 text-indigo-600" />
          Explainable AI (XAI) Insight
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          {explanation}
        </p>
        {formulaNote && (
          <div className="pt-2 mt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
            <HelpCircle className="w-3 h-3 text-slate-400" />
            Formula: {formulaNote}
          </div>
        )}
      </div>

    </div>
  );
};
