import React from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, DEPARTMENTS } from '../data/mockData';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  GraduationCap,
  Layers,
  ShieldCheck,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { complaints } = useApp();

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === 'Pending').length;
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;

  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
  const pendingRate = total > 0 ? Math.round((pending / total) * 100) : 0;
  const inProgressRate = total > 0 ? Math.round((inProgress / total) * 100) : 0;

  // Category counts
  const categoryStats = CATEGORIES.map((cat) => {
    const count = complaints.filter((c) => c.category === cat.label).length;
    const resolvedCat = complaints.filter(
      (c) => c.category === cat.label && c.status === 'Resolved'
    ).length;
    const percent = total > 0 ? Math.round((count / total) * 100) : 0;
    return {
      category: cat.label,
      count,
      resolvedCat,
      percent,
    };
  }).sort((a, b) => b.count - a.count);

  // Department counts
  const departmentStats = DEPARTMENTS.map((dept) => {
    const count = complaints.filter((c) => c.department === dept).length;
    const percent = total > 0 ? Math.round((count / total) * 100) : 0;
    return {
      department: dept,
      count,
      percent,
    };
  }).sort((a, b) => b.count - a.count);

  // Priority distribution
  const priorityStats = [
    { label: 'Urgent', count: complaints.filter((c) => c.priority === 'Urgent').length, color: 'bg-rose-500' },
    { label: 'High', count: complaints.filter((c) => c.priority === 'High').length, color: 'bg-orange-500' },
    { label: 'Medium', count: complaints.filter((c) => c.priority === 'Medium').length, color: 'bg-blue-500' },
    { label: 'Low', count: complaints.filter((c) => c.priority === 'Low').length, color: 'bg-slate-400' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
          <BarChart3 className="w-4 h-4" />
          <span>Institutional Redressal Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Complaint Redressal Statistics
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Campus-wide performance indicators, resolution velocities, and department-wise grievance trends.
        </p>
      </div>

      {/* Top 4 Key Performance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Overall Resolution</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {resolutionRate}%
          </p>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${resolutionRate}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {resolved} out of {total} closed satisfactorily
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Avg Resolution Time</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-blue-700 font-mono tabular-nums">
            1.8 Days
          </p>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }} />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Well inside 48-Hour SLA baseline</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Active Investigations</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-amber-800 font-mono tabular-nums">
            {inProgress}
          </p>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${inProgressRate}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Currently assigned to facility engineers
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Pending Triage</span>
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {pending}
          </p>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${pendingRate}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Awaiting administrator allocation
          </p>
        </div>
      </div>

      {/* Main Charts & Breakdowns (2-column split) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Category Distribution Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Grievances by Category
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Volume distribution across core university functional areas
              </p>
            </div>
            <Layers className="w-5 h-5 text-blue-600" />
          </div>

          <div className="space-y-4">
            {categoryStats.map((item) => (
              <div key={item.category}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-800">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-mono tabular-nums">
                      {item.count} tickets
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      ({item.percent}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Volume Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Departmental Distribution
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Breakdown of submitted tickets across academic colleges
              </p>
            </div>
            <GraduationCap className="w-5 h-5 text-indigo-600" />
          </div>

          <div className="space-y-3.5">
            {departmentStats.map((item) => (
              <div key={item.department} className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-b-0">
                <span className="font-medium text-slate-700 truncate pr-2 max-w-[280px]">
                  {item.department}
                </span>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-24 bg-slate-100 rounded-full h-2 hidden sm:block overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${Math.max(item.percent * 2, 8)}%` }}
                    />
                  </div>
                  <span className="font-mono font-bold text-slate-900 tabular-nums w-8 text-right">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Priority Distribution & SLA Adherence Summary Strip */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Priority Composition & Response Tiers
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Classification of tickets by urgency with strict response time commitments
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {priorityStats.map((p) => {
            const pPercent = total > 0 ? Math.round((p.count / total) * 100) : 0;
            return (
              <div key={p.label} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">{p.label} Priority</span>
                  <div className={`w-3 h-3 rounded-full ${p.color}`} />
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                  {p.count}
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{pPercent}% of total</span>
                  <span className="font-medium text-slate-700">
                    {p.label === 'Urgent'
                      ? '< 12h SLA'
                      : p.label === 'High'
                      ? '< 24h SLA'
                      : '< 48h SLA'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
