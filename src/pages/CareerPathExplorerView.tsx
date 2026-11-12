import React, { useState, useEffect } from 'react';
import { Compass, CheckCircle2, AlertCircle, ArrowRight, DollarSign, Target, Award, Milestone } from 'lucide-react';
import { api } from '../services/api';
import { CareerRoleItem } from '../types';
import { useAuth } from '../context/AuthContext';

interface CareerPathExplorerViewProps {
  setCurrentView: (view: string) => void;
}

export const CareerPathExplorerView: React.FC<CareerPathExplorerViewProps> = ({ setCurrentView }) => {
  const { profile, updateProfileState } = useAuth();
  const [roles, setRoles] = useState<CareerRoleItem[]>([]);
  const [selectedRole, setSelectedRole] = useState<CareerRoleItem | null>(null);
  const [changingRole, setChangingRole] = useState(false);

  useEffect(() => {
    api.getCareerRoles().then(list => {
      setRoles(list);
      if (list.length > 0) {
        const active = list.find(r => r.title.toLowerCase() === profile?.target_role.toLowerCase()) || list[0];
        setSelectedRole(active);
      }
    }).catch(console.error);
  }, [profile]);

  const handleSetTargetRole = async (roleTitle: string) => {
    setChangingRole(true);
    try {
      const updated = await api.updateProfile({ target_role: roleTitle });
      updateProfileState(updated);
    } catch (e) {
      console.error(e);
    } finally {
      setChangingRole(false);
    }
  };

  return (
    <div id="careeriq-career-paths-view" className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Career Path Explorer</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Progression Pathways
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Compare career trajectories, salary benchmarks, and immediate skill bridges across high-growth engineering domains.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('roadmap')}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors inline-flex items-center gap-1.5 shadow-sm"
        >
          <Milestone className="w-3.5 h-3.5" />
          View Active Roadmap
        </button>
      </div>

      {/* Roles Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map(role => {
          const isTarget = profile?.target_role.toLowerCase() === role.title.toLowerCase();
          return (
            <div
              key={role.id}
              onClick={() => setSelectedRole(role)}
              className={`bg-white rounded-2xl border p-6 shadow-xs cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
                selectedRole?.id === role.id ? 'ring-2 ring-indigo-600 border-indigo-600' : 'border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    {role.category}
                  </span>
                  {isTarget && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Your Target Track
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{role.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{role.description}</p>
                </div>

                {/* Compatibility Score */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">Estimated Match:</span>
                  <span className="text-sm font-extrabold text-indigo-600 font-display">{role.match_score}%</span>
                </div>

                {/* Salary Range */}
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="text-slate-400">Compensation:</span>
                  <span className="font-semibold text-slate-900 font-mono">{role.salary_range}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {!isTarget ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetTargetRole(role.title);
                    }}
                    disabled={changingRole}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                  >
                    <Target className="w-3.5 h-3.5" />
                    Set as Target Role
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Currently Active
                  </span>
                )}
                <span className="text-xs font-medium text-slate-400">Details →</span>
              </div>

            </div>
          );
        })}
      </div>

      {/* Selected Role Detailed Progression Drawer */}
      {selectedRole && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">{selectedRole.title}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{selectedRole.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-mono bg-slate-100 px-3 py-1.5 rounded-xl font-bold">
                Salary Benchmark: {selectedRole.salary_range}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Required Skills */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Core Required Competencies</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedRole.required_skills.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-slate-800 border border-slate-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Career Progression Stages */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Promotion & Progression Stages</h4>
              <div className="space-y-1.5">
                {selectedRole.progression_stages.map((stage, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <span>{stage}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
