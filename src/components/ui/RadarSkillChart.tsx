import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

interface RadarDataPoint {
  subject: string;
  score: number;
  fullMark: number;
}

interface RadarSkillChartProps {
  data: RadarDataPoint[];
  title?: string;
  height?: number;
}

export const RadarSkillChart: React.FC<RadarSkillChartProps> = ({
  data,
  title = 'Employability Competency Radar',
  height = 280
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">{title}</h4>
        <span className="text-[10px] text-slate-400 font-mono">Normalized Index (0-100)</span>
      </div>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 9 }} />
            <Radar
              name="Readiness Index"
              dataKey="score"
              stroke="#4f46e5"
              fill="#6366f1"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface BarComparisonChartProps {
  data: Array<{ name: string; score: number; benchmark: number }>;
  height?: number;
}

export const BarComparisonChart: React.FC<BarComparisonChartProps> = ({
  data,
  height = 240
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Candidate vs. Industry Baseline</h4>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-indigo-700 font-medium">
            <span className="w-2.5 h-2.5 bg-indigo-600 rounded-sm"></span> You
          </span>
          <span className="flex items-center gap-1 text-slate-500 font-medium">
            <span className="w-2.5 h-2.5 bg-slate-300 rounded-sm"></span> Market Median
          </span>
        </div>
      </div>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
            />
            <Bar dataKey="score" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Candidate Score" />
            <Bar dataKey="benchmark" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Industry Median" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
