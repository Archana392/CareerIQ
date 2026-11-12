import React, { useState, useEffect } from 'react';
import { TrendingUp, Sparkles, Zap, Compass, Filter, ArrowUpRight } from 'lucide-react';
import { api } from '../services/api';
import { IndustryTrendItem } from '../types';

interface IndustryTrendsViewProps {
  setCurrentView: (view: string) => void;
}

export const IndustryTrendsView: React.FC<IndustryTrendsViewProps> = ({ setCurrentView }) => {
  const [trends, setTrends] = useState<IndustryTrendItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [roleQuery, setRoleQuery] = useState<string>('');

  useEffect(() => {
    api.getTrends().then(setTrends).catch(console.error);
  }, []);

  const categories = ['ALL', 'Emerging', 'Growing', 'Current Demand'];

  const filteredTrends = trends.filter(trend => {
    const matchesCategory = selectedCategory === 'ALL' || trend.demand_level === selectedCategory;
    const matchesRole = !roleQuery || trend.key_roles.some(r => r.toLowerCase().includes(roleQuery.toLowerCase())) || trend.title.toLowerCase().includes(roleQuery.toLowerCase());
    return matchesCategory && matchesRole;
  });

  const getDemandBadge = (level: string) => {
    switch (level) {
      case 'Emerging':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Growing':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  return (
    <div id="careeriq-trends-view" className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">2026 Industry & Technology Trends</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Market Signals
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time tech demand signals and hiring priorities aggregated from live enterprise engineering hiring requirements.
          </p>
        </div>

        {/* Search by Role */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Filter by role (e.g. AI/ML, DevOps)..."
            value={roleQuery}
            onChange={(e) => setRoleQuery(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 w-64 bg-white"
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat === 'ALL' ? 'All Market Signals' : cat}
          </button>
        ))}
      </div>

      {/* Trends Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrends.map(trend => (
          <div
            key={trend.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-indigo-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getDemandBadge(trend.demand_level)}`}>
                  {trend.demand_level}
                </span>
                <span className="text-xs font-bold text-emerald-600 font-mono bg-emerald-50 px-2 py-0.5 rounded-md">
                  {trend.growth_rate} YoY
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">{trend.title}</h3>
                <span className="text-[11px] text-slate-400 font-medium">{trend.category}</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {trend.description}
              </p>

              {/* Key Associated Roles */}
              <div className="pt-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Impacted Roles</p>
                <div className="flex flex-wrap gap-1">
                  {trend.key_roles.map((role, rIdx) => (
                    <span
                      key={rIdx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Action */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Adopted in CareerIQ Roadmap</span>
              <button
                onClick={() => setCurrentView('roadmap')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
              >
                Upskill Now
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
