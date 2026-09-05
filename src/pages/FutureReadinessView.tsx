import React, { useState, useEffect } from 'react';
import { Zap, ShieldCheck, AlertTriangle, Sparkles, ArrowRight, Milestone, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { FutureReadinessReport } from '../types';
import { RadarSkillChart } from '../components/ui/RadarSkillChart';
import { ExplainableScoreCard } from '../components/ui/ExplainableScoreCard';

interface FutureReadinessViewProps {
  setCurrentView: (view: string) => void;
}

export const FutureReadinessView: React.FC<FutureReadinessViewProps> = ({ setCurrentView }) => {
  const [report, setReport] = useState<FutureReadinessReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getFutureReadiness().then(setReport).catch(console.error).finally(() => setLoading(false));
  }, []);

  const score = report?.future_readiness_score || 68;

  const radarData = report ? [
    { subject: 'Agentic AI Systems', score: report.breakdown.emerging_ai_adoption, fullMark: 100 },
    { subject: 'RAG & Vectors', score: report.breakdown.rag_architecture_exposure, fullMark: 100 },
    { subject: 'MLOps & CI/CD', score: report.breakdown.mlops_deployment_readiness, fullMark: 100 },
    { subject: 'Cloud & Containers', score: report.breakdown.cloud_native_skills, fullMark: 100 },
    { subject: 'Automation Resilience', score: report.breakdown.automation_resilience, fullMark: 100 }
  ] : [];

  return (
    <div id="careeriq-future-readiness-view" className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Future Readiness & Adaptability</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
              2026 Tech Horizons
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Evaluates candidate exposure to next-generation paradigms (Agentic AI, RAG, MLOps, Containerization) to protect against tech obsolescence.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('roadmap')}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors inline-flex items-center gap-1.5 shadow-sm"
        >
          <Milestone className="w-3.5 h-3.5" />
          Adopt Future Skills
        </button>
      </div>

      {report && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Scorecard */}
            <div className="lg:col-span-2">
              <ExplainableScoreCard
                title="Future Tech Adaptability Index"
                overallScore={score}
                grade={score >= 75 ? 'Future Leader' : 'Modernizing'}
                factors={[
                  {
                    label: 'Agentic AI & Autonomy Exposure',
                    weight: '25% Weight',
                    score: report.breakdown.emerging_ai_adoption,
                    description: 'Understanding multi-agent workflows, tool calling, and prompt chaining.'
                  },
                  {
                    label: 'RAG & Vector Search Architecture',
                    weight: '25% Weight',
                    score: report.breakdown.rag_architecture_exposure,
                    description: 'Embeddings, vector stores, semantic chunking, and grounded LLM pipelines.'
                  },
                  {
                    label: 'MLOps & Automated CI/CD Pipelines',
                    weight: '20% Weight',
                    score: report.breakdown.mlops_deployment_readiness,
                    description: 'Automated testing, artifact versioning, and continuous model deployment.'
                  },
                  {
                    label: 'Cloud-Native & Containerization',
                    weight: '15% Weight',
                    score: report.breakdown.cloud_native_skills,
                    description: 'Docker, microservices orchestration, and serverless compute paradigms.'
                  },
                  {
                    label: 'AI Automation Resilience',
                    weight: '15% Weight',
                    score: report.breakdown.automation_resilience,
                    description: 'Focus on high-leverage architectural problem-solving vs repetitive coding.'
                  }
                ]}
                explanation="Your foundational Python and Machine Learning knowledge provides a strong launchpad. Adding Docker containerization and RAG vector workflows will elevate your future readiness to the top 10th percentile."
                formulaNote="(0.25 × Agentic) + (0.25 × RAG) + (0.20 × MLOps) + (0.15 × Cloud) + (0.15 × Resilience)"
              />
            </div>

            {/* Right 1 Col: Radar */}
            <div>
              <RadarSkillChart data={radarData} title="2026 Tech Horizons Radar" height={320} />
            </div>

          </div>

          {/* AI Disruption Risk & Strategic Advice Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* AI Disruption Risk */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                Domain Disruption & Automation Assessment
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-emerald-950">High-Leverage System Architecture</p>
                    <p className="text-slate-500 text-[11px]">System design, domain logic, data contracts</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Low Automation Risk
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-amber-950">Boilerplate Endpoint Coding</p>
                    <p className="text-slate-500 text-[11px]">Repetitive CRUD generation, standard tests</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    Medium Automation Risk
                  </span>
                </div>
              </div>
            </div>

            {/* Strategic Recommendations */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Strategic Future Action Plan
              </div>

              <ul className="space-y-2.5">
                <li className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0"></span>
                  <span><strong>Build a RAG Pipeline:</strong> Connect a local vector DB (Chroma/FAISS) with Gemini or an open-source model.</span>
                </li>
                <li className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0"></span>
                  <span><strong>Deploy via Docker:</strong> Package your ML models into reproducible multi-stage Docker containers on GitHub.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
