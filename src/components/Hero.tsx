import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import {
  Search,
  Building2,
  School,
  FlaskConical,
  BedDouble,
  Bus,
  GraduationCap,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Infrastructure: <Building2 className="w-5 h-5 text-blue-600" />,
  Classroom: <School className="w-5 h-5 text-indigo-600" />,
  Laboratory: <FlaskConical className="w-5 h-5 text-emerald-600" />,
  Hostel: <BedDouble className="w-5 h-5 text-amber-600" />,
  Transportation: <Bus className="w-5 h-5 text-cyan-600" />,
  Faculty: <GraduationCap className="w-5 h-5 text-purple-600" />,
  'Other Issues': <HelpCircle className="w-5 h-5 text-slate-600" />,
};

export const Hero: React.FC = () => {
  const { complaints, setCurrentView, setTrackingId, openAuthModal, currentUser } = useApp();
  const [quickTrackInput, setQuickTrackInput] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTrackInput.trim()) return;
    setTrackingId(quickTrackInput.trim());
    setCurrentView('track');
  };

  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter((c) => c.status === 'Resolved').length;
  const inProgressComplaints = complaints.filter((c) => c.status === 'In Progress').length;
  const resolutionRate =
    totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0;

  return (
    <div className="relative">
      {/* Hero Visual Section */}
      <div className="relative bg-slate-900 text-white overflow-hidden">
        {/* Background Image with Dark Contrast Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/college_campus_hero_1793458492008.jpg"
            alt="Apex College Campus Building"
            className="w-full h-full object-cover object-center opacity-30 scale-105 transform motion-safe:transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/60" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-medium mb-6 backdrop-blur-xs">
              <ShieldCheck className="w-4 h-4 text-blue-300" />
              <span>Official Student Grievance Redressal Mechanism</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-balance leading-tight">
              Prompt, Fair & Transparent Grievance Management
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Empowering students and campus administration to voice issues, monitor progress in real-time, and ensure timely resolution across all academic and residential facilities.
            </p>

            {/* Quick Track Input Bar */}
            <form onSubmit={handleTrackSubmit} className="mt-8 max-w-xl">
              <label htmlFor="track-id-input" className="block text-xs font-medium text-slate-300 mb-2">
                Have a Complaint ID? Track its live status instantly:
              </label>
              <div className="flex items-center bg-white rounded-xl p-1.5 shadow-xl border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500">
                <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                <input
                  id="track-id-input"
                  type="text"
                  value={quickTrackInput}
                  onChange={(e) => setQuickTrackInput(e.target.value)}
                  placeholder="e.g. CMP-2026-1042"
                  className="w-full px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-mono"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shadow-sm"
                >
                  Track Now
                </button>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                <span>Try sample tickets:</span>
                <button
                  type="button"
                  onClick={() => {
                    setTrackingId('CMP-2026-1042');
                    setCurrentView('track');
                  }}
                  className="underline hover:text-white font-mono"
                >
                  CMP-2026-1042
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => {
                    setTrackingId('CMP-2026-1041');
                    setCurrentView('track');
                  }}
                  className="underline hover:text-white font-mono"
                >
                  CMP-2026-1041
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => {
                    setTrackingId('CMP-2026-1039');
                    setCurrentView('track');
                  }}
                  className="underline hover:text-white font-mono"
                >
                  CMP-2026-1039
                </button>
              </div>
            </form>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setCurrentView('submit')}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-md shadow-blue-900/30 flex items-center gap-2 group"
              >
                <span>Submit a Complaint</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {currentUser ? (
                <button
                  onClick={() =>
                    setCurrentView(currentUser.role === 'admin' ? 'admin-dashboard' : 'student-dashboard')
                  }
                  className="px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white text-sm font-medium border border-slate-700 transition-colors"
                >
                  Go to {currentUser.role === 'admin' ? 'Admin Dashboard' : 'My Student Dashboard'}
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal('student-login')}
                  className="px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white text-sm font-medium border border-slate-700 transition-colors"
                >
                  Student Portal Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="relative -mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 p-6 grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="pt-2 md:pt-0">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Grievances Logged
            </p>
            <p className="mt-1 text-2xl lg:text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {totalComplaints}
            </p>
            <p className="text-xs text-slate-400 mt-1">Institutional records</p>
          </div>

          <div className="pt-4 md:pt-0 md:pl-6">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Resolution Rate
            </p>
            <p className="mt-1 text-2xl lg:text-3xl font-bold text-emerald-600 font-mono tabular-nums">
              {resolutionRate}%
            </p>
            <p className="text-xs text-slate-400 mt-1">{resolvedComplaints} tickets resolved</p>
          </div>

          <div className="pt-4 md:pt-0 md:pl-6">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Under Active Action
            </p>
            <p className="mt-1 text-2xl lg:text-3xl font-bold text-blue-600 font-mono tabular-nums">
              {inProgressComplaints}
            </p>
            <p className="text-xs text-slate-400 mt-1">Assigned to staff units</p>
          </div>

          <div className="pt-4 md:pt-0 md:pl-6">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Standard SLA Target
            </p>
            <p className="mt-1 text-2xl lg:text-3xl font-bold text-slate-900 font-mono tabular-nums">
              48 Hours
            </p>
            <p className="text-xs text-slate-400 mt-1">Guaranteed review time</p>
          </div>
        </div>
      </div>

      {/* Complaint Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-700 mb-2">
            Campus Complaint Categories
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Categorized for Rapid Routing & Action
          </h3>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            Every submission is routed immediately to the corresponding dean, department head, or campus maintenance wing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat) => {
            const count = complaints.filter((c) => c.category === cat.label).length;
            return (
              <div
                key={cat.label}
                className="group p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    {CATEGORY_ICONS[cat.label] || <HelpCircle className="w-5 h-5 text-blue-600" />}
                  </div>
                  <h4 className="text-base font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {cat.label}
                  </h4>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono tabular-nums">
                    {count} active tickets
                  </span>
                  <button
                    onClick={() => {
                      setCurrentView('submit');
                    }}
                    className="text-blue-600 font-medium hover:text-blue-800 flex items-center gap-1 group/btn"
                  >
                    <span>File</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Quick Info Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-900 text-white flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5 text-blue-200" />
              </div>
              <h4 className="text-base font-semibold text-white">Need Urgent Help?</h4>
              <p className="mt-1.5 text-xs text-blue-100/90 leading-relaxed">
                Emergency maintenance, laboratory safety concerns, or security incidents are prioritized under Urgent dispatch.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/15">
              <button
                onClick={() => setCurrentView('submit')}
                className="w-full py-2 px-3 rounded-lg bg-white text-blue-900 text-xs font-semibold hover:bg-blue-50 transition-colors"
              >
                Submit Emergency Grievance
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* College Redressal Process / How It Works */}
      <div className="bg-slate-100/60 border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-700 mb-2">
              Resolution Workflow
            </h2>
            <h3 className="text-2xl font-bold text-slate-900">
              How Your Grievance Is Handled
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h4 className="text-base font-semibold text-slate-900">
                1. Submit with Unique ID
              </h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Fill the complaint form with your student register number, category, and issue specifics. An institutional complaint tracking ID (e.g., CMP-2026-1043) is instantly generated.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h4 className="text-base font-semibold text-slate-900">
                2. Admin Review & Action
              </h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Grievance officers inspect the case, assign it to the designated facility technician or department head, and record live action remarks into the ticket log.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h4 className="text-base font-semibold text-slate-900">
                3. Verification & Resolution
              </h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Work order is completed, tested, and marked as Resolved with formal resolution notes. The student can verify the outcome and close the grievance cycle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
