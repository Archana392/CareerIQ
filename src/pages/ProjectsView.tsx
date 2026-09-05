import React, { useState, useEffect } from 'react';
import { FolderGit2, Sparkles, CheckCircle2, ArrowRight, Code2, Clock, Layers } from 'lucide-react';
import { api } from '../services/api';
import { RecommendedProject } from '../types';

interface ProjectsViewProps {
  setCurrentView: (view: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ setCurrentView }) => {
  const [projects, setProjects] = useState<RecommendedProject[]>([]);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('ALL');

  useEffect(() => {
    api.getProjectRecommendations().then(setProjects).catch(console.error);
  }, []);

  const filtered = filterDifficulty === 'ALL'
    ? projects
    : projects.filter(p => p.difficulty === filterDifficulty);

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Advanced':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Intermediate':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div id="careeriq-projects-view" className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Recommended Portfolio Projects</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Gap-Bridging Blueprints
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Production-grade engineering projects designed specifically to bridge your identified technical skill gaps.
          </p>
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          {['ALL', 'Beginner', 'Intermediate', 'Advanced'].map(d => (
            <button
              key={d}
              onClick={() => setFilterDifficulty(d)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                filterDifficulty === d ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(project => (
          <div
            key={project.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-indigo-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getDifficultyBadge(project.difficulty)}`}>
                  {project.difficulty}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  ~{project.estimated_hours} Hours
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">{project.title}</h3>
                <span className="text-[11px] text-indigo-600 font-medium">Focus: {project.domain}</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {project.description}
              </p>

              {/* Skills Targeted */}
              <div className="space-y-1.5 pt-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Skills Verified</p>
                <div className="flex flex-wrap gap-1">
                  {project.skills_targeted.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Deliverables */}
              <div className="space-y-1 pt-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Key Deliverables</p>
                <ul className="space-y-1">
                  {project.deliverables.slice(0, 2).map((del, idx) => (
                    <li key={idx} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 shrink-0"></span>
                      <span>{del}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">GitHub Portfolio Ready</span>
              <button
                onClick={() => setCurrentView('roadmap')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
              >
                Track in Roadmap
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
