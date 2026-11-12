import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, AlertCircle, Sparkles, ArrowRight, Milestone } from 'lucide-react';
import { api } from '../services/api';
import { CareerReadinessScore } from '../types';
import { ExplainableScoreCard } from '../components/ui/ExplainableScoreCard';
import { RadarSkillChart } from '../components/ui/RadarSkillChart';

interface CareerReadinessViewProps {
  setCurrentView: (view: string) => void;
}

export const CareerReadinessView: React.FC<CareerReadinessViewProps> = ({ setCurrentView }) => {
  const [readiness, setReadiness] = useState<CareerReadinessScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCareerReadiness()
      .then(setReadiness)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const overallScore = readiness?.overall_score || 78;

  const radarData = readiness ? [
    { subject: 'Verified Skills (30%)', score: readiness.breakdown.verified_skills, fullMark: 100 },
    { subject: 'Applied Projects (20%)', score: readiness.breakdown.applied_projects, fullMark: 100 },
    { subject: 'ATS Optimization (15%)', score: readiness.breakdown.ats_resume_score, fullMark: 100 },
    { subject: 'Future Tech 2026 (15%)', score: readiness.breakdown.future_skills_signals, fullMark: 100 },
    { subject: 'Academic Background (10%)', score: readiness.breakdown.academic_alignment, fullMark: 100 },
    { subject: 'Soft Competencies (10%)', score: readiness.breakdown.soft_skills_presence, fullMark: 100 }
  ] : [];

  return (
    <div id="careeriq-readiness-view" className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Career Readiness Score (CRI)</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Multi-Factor XAI
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Holistic diagnostic measuring your production capability across 6 foundational employability pillars.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('roadmap')}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors inline-flex items-center gap-1.5 shadow-sm"
        >
          <Milestone className="w-3.5 h-3.5" />
          Follow Recommended Roadmap
        </button>
      </div>

      {readiness && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Explainable Score Card */}
            <div className="lg:col-span-2">
              <ExplainableScoreCard
                title="Candidate Employability Index"
                overallScore={overallScore}
                grade={readiness.rating_label}
                factors={[
                  {
                    label: 'Verified Core Skills',
                    weight: '30% Weight',
                    score: readiness.breakdown.verified_skills,
                    description: 'Technical proficiency in foundational role tools (Python, SQL, ML).'
                  },
                  {
                    label: 'Applied Projects & Code Evidence',
                    weight: '20% Weight',
                    score: readiness.breakdown.applied_projects,
                    description: 'Portfolio evidence, Git version control, and real problem solving.'
                  },
                  {
                    label: 'ATS Resume Quality & Structure',
                    weight: '15% Weight',
                    score: readiness.breakdown.ats_resume_score,
                    description: 'Quantifiable achievements, action verbs, and clean typography.'
                  },
                  {
                    label: '2026 Future Tech Alignment',
                    weight: '15% Weight',
                    score: readiness.breakdown.future_skills_signals,
                    description: 'Exposure to containerization (Docker), REST APIs, and RAG architectures.'
                  },
                  {
                    label: 'Academic Qualification Alignment',
                    weight: '10% Weight',
                    score: readiness.breakdown.academic_alignment,
                    description: 'Degree relevance to software engineering and data science.'
                  },
                  {
                    label: 'Behavioral & Communication Presence',
                    weight: '10% Weight',
                    score: readiness.breakdown.soft_skills_presence,
                    description: 'Demonstrated teamwork, communication, and problem-solving mindset.'
                  }
                ]}
                explanation={readiness.explanation}
                formulaNote="CRI = (0.30 × VerifiedSkills) + (0.20 × Projects) + (0.15 × ATS) + (0.15 × FutureTech) + (0.10 × Edu) + (0.10 × Soft)"
              />
            </div>

            {/* Right 1 Col: Radar Chart */}
            <div className="space-y-6">
              <RadarSkillChart data={radarData} title="Employability Radar (0-100)" height={320} />
            </div>

          </div>

          {/* Strengths & Immediate Improvement Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                Verified Candidate Strengths
              </div>
              <ul className="space-y-2">
                {readiness.strengths.map((str, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs text-emerald-950 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                Key Employability Gaps
              </div>
              <ul className="space-y-2">
                {readiness.gaps.map((gap, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 text-xs text-amber-950 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
