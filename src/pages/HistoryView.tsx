import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, Trash2, CheckCircle2, Clock, Award, GitCompare, FileText, Milestone } from 'lucide-react';
import { api } from '../services/api';
import { AnalysisHistoryItem } from '../types';

export const HistoryView: React.FC = () => {
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await api.getHistory();
      setHistory(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteHistory(id);
      setHistory(prev => prev.filter(h => h.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'resume_analysis':
        return <FileText className="w-4 h-4 text-indigo-600" />;
      case 'job_match':
        return <GitCompare className="w-4 h-4 text-sky-600" />;
      case 'readiness_check':
        return <Award className="w-4 h-4 text-emerald-600" />;
      case 'roadmap_gen':
        return <Milestone className="w-4 h-4 text-purple-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div id="careeriq-history-view" className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Analysis Activity Timeline</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Audit Trail
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Historical log of all resume analyses, job match evaluations, and generated learning roadmaps.
          </p>
        </div>
      </div>

      {/* History Items List */}
      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-xs">
        {history.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No diagnostic activity recorded yet. Upload a resume or evaluate a job to begin.
          </div>
        ) : (
          history.map(item => (
            <div key={item.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-slate-100 mt-0.5">
                  {getTypeIcon(item.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    {item.score !== undefined && (
                      <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-indigo-50 text-indigo-700">
                        {item.score}/100
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{item.summary}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                    {new Date(item.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                title="Delete Entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
