import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  Building,
  User as UserIcon,
  MapPin,
  FileText,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Complaint, ComplaintStatus } from '../types';

export const ComplaintTracker: React.FC = () => {
  const { complaints, trackingId, setTrackingId, setSelectedComplaint, setCurrentView } =
    useApp();
  const [searchInput, setSearchInput] = useState(trackingId || '');
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);
  const [multipleResults, setMultipleResults] = useState<Complaint[]>([]);
  const [searched, setSearched] = useState(false);

  // Automatically lookup if trackingId changes
  useEffect(() => {
    if (trackingId) {
      setSearchInput(trackingId);
      performSearch(trackingId);
    } else {
      // Default to the first in-progress or pending complaint for showcase
      const sample = complaints.find((c) => c.id === 'CMP-2026-1042') || complaints[0];
      if (sample) {
        setActiveComplaint(sample);
      }
    }
  }, [trackingId, complaints]);

  const performSearch = (query: string) => {
    const q = query.trim().toUpperCase();
    if (!q) {
      setActiveComplaint(null);
      setMultipleResults([]);
      setSearched(true);
      return;
    }

    // 1. Direct ID match
    const exactIdMatch = complaints.find(
      (c) => c.id.toUpperCase() === q || c.id.replace(/-/g, '') === q.replace(/-/g, '')
    );

    if (exactIdMatch) {
      setActiveComplaint(exactIdMatch);
      setMultipleResults([]);
      setSearched(true);
      return;
    }

    // 2. Search by Register Number
    const regMatches = complaints.filter(
      (c) => c.registerNumber.toUpperCase() === q || c.registerNumber.toUpperCase().includes(q)
    );

    if (regMatches.length === 1) {
      setActiveComplaint(regMatches[0]);
      setMultipleResults([]);
      setSearched(true);
      return;
    } else if (regMatches.length > 1) {
      setActiveComplaint(null);
      setMultipleResults(regMatches);
      setSearched(true);
      return;
    }

    // 3. Fallback: search in title or student name
    const fuzzyMatches = complaints.filter(
      (c) =>
        c.studentName.toUpperCase().includes(q) ||
        c.title.toUpperCase().includes(q) ||
        c.id.includes(q)
    );

    if (fuzzyMatches.length === 1) {
      setActiveComplaint(fuzzyMatches[0]);
      setMultipleResults([]);
    } else {
      setActiveComplaint(null);
      setMultipleResults(fuzzyMatches);
    }
    setSearched(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchInput);
  };

  const quickSelect = (id: string) => {
    setSearchInput(id);
    setTrackingId(id);
    performSearch(id);
  };

  // Helper to determine status progress step
  const getStepState = (currentStatus: ComplaintStatus, targetStep: 'submitted' | 'progress' | 'resolved') => {
    if (targetStep === 'submitted') {
      return 'completed';
    }
    if (targetStep === 'progress') {
      if (currentStatus === 'In Progress' || currentStatus === 'Resolved') return 'completed';
      return 'waiting';
    }
    if (targetStep === 'resolved') {
      if (currentStatus === 'Resolved') return 'completed';
      return 'waiting';
    }
    return 'waiting';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
          <Clock className="w-4 h-4" />
          <span>Real-Time Grievance Tracker</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Track Your Complaint Status
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter your unique complaint tracking number (e.g. CMP-2026-1042) or your Student Register Number to see live administrative milestones.
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-8">
        <div className="flex items-center bg-white rounded-2xl p-2 shadow-md border border-slate-200 focus-within:ring-2 focus-within:ring-blue-600 transition-all">
          <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter Complaint ID (CMP-2026-XXXX) or Register Number"
            className="w-full px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-mono"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold whitespace-nowrap transition-colors shadow-xs"
          >
            Track Status
          </button>
        </div>

        {/* Quick Demo ID pills */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>Quick check demo tickets:</span>
          <button
            type="button"
            onClick={() => quickSelect('CMP-2026-1042')}
            className={`px-2 py-0.5 rounded border font-mono transition-colors ${
              activeComplaint?.id === 'CMP-2026-1042'
                ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            CMP-2026-1042 (In Progress)
          </button>
          <button
            type="button"
            onClick={() => quickSelect('CMP-2026-1041')}
            className={`px-2 py-0.5 rounded border font-mono transition-colors ${
              activeComplaint?.id === 'CMP-2026-1041'
                ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            CMP-2026-1041 (Pending)
          </button>
          <button
            type="button"
            onClick={() => quickSelect('CMP-2026-1039')}
            className={`px-2 py-0.5 rounded border font-mono transition-colors ${
              activeComplaint?.id === 'CMP-2026-1039'
                ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            CMP-2026-1039 (Resolved)
          </button>
        </div>
      </form>

      {/* Multiple Results (when searching by Register No) */}
      {multipleResults.length > 0 && !activeComplaint && (
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">
              Found {multipleResults.length} grievances for this query:
            </h3>
            <span className="text-xs text-slate-500">Select any ticket to view timeline</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {multipleResults.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setActiveComplaint(ticket)}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-sm cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-xs text-blue-700">{ticket.id}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs font-medium text-slate-600">{ticket.category}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">{ticket.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{ticket.description}</p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                  <StatusBadge status={ticket.status} size="sm" />
                  <span className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1">
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Not found state */}
      {searched && !activeComplaint && multipleResults.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">
            No grievance records found
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            We could not find any complaint matching &quot;{searchInput}&quot;. Please verify the ticket ID or submit a new complaint.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setCurrentView('submit')}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              File a New Complaint
            </button>
            <button
              onClick={() => {
                setSearchInput('CMP-2026-1042');
                performSearch('CMP-2026-1042');
              }}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors"
            >
              Load Demo Ticket
            </button>
          </div>
        </div>
      )}

      {/* Active Complaint View */}
      {activeComplaint && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Card Top Banner */}
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-slate-900">
                    {activeComplaint.id}
                  </span>
                  <PriorityBadge priority={activeComplaint.priority} />
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Logged on {new Date(activeComplaint.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <StatusBadge status={activeComplaint.status} size="lg" />
              <button
                onClick={() => setSelectedComplaint(activeComplaint)}
                className="p-2 text-slate-500 hover:text-blue-700 hover:bg-slate-200/50 rounded-lg transition-colors"
                title="Full Screen Ticket Details"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="p-6 border-b border-slate-100 bg-white">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Redressal Lifecycle Milestones
            </h4>

            <div className="grid grid-cols-3 gap-2 relative">
              {/* Step 1: Registered */}
              <div className="flex flex-col items-center text-center">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs mb-2 ring-4 ring-emerald-50">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-900">Submitted</span>
                <span className="text-[11px] text-slate-400 mt-0.5">Ticket Created</span>
              </div>

              {/* Step 2: Under Review / In Progress */}
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-xs mb-2 ${
                    getStepState(activeComplaint.status, 'progress') === 'completed'
                      ? 'bg-blue-600 text-white ring-4 ring-blue-50'
                      : 'bg-slate-200 text-slate-500 ring-4 ring-slate-100'
                  }`}
                >
                  <Clock className="w-5 h-5" />
                </div>
                <span
                  className={`text-xs font-semibold ${
                    getStepState(activeComplaint.status, 'progress') === 'completed'
                      ? 'text-slate-900'
                      : 'text-slate-400'
                  }`}
                >
                  In Progress
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  {activeComplaint.assignedOfficer ? 'Action Assigned' : 'Awaiting Review'}
                </span>
              </div>

              {/* Step 3: Resolved */}
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-xs mb-2 ${
                    getStepState(activeComplaint.status, 'resolved') === 'completed'
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                      : 'bg-slate-200 text-slate-500 ring-4 ring-slate-100'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span
                  className={`text-xs font-semibold ${
                    getStepState(activeComplaint.status, 'resolved') === 'completed'
                      ? 'text-slate-900'
                      : 'text-slate-400'
                  }`}
                >
                  Resolved
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  {activeComplaint.status === 'Resolved' ? 'Issue Rectified' : 'Pending Action'}
                </span>
              </div>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{activeComplaint.title}</h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                {activeComplaint.description}
              </p>
            </div>

            {/* Key Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-xl border border-slate-100 bg-white">
                <span className="text-slate-400 flex items-center gap-1.5 mb-1">
                  <UserIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>Student Identity</span>
                </span>
                <p className="font-semibold text-slate-800">{activeComplaint.studentName}</p>
                <p className="font-mono text-slate-500 mt-0.5">{activeComplaint.registerNumber}</p>
              </div>

              <div className="p-3 rounded-xl border border-slate-100 bg-white">
                <span className="text-slate-400 flex items-center gap-1.5 mb-1">
                  <Building className="w-3.5 h-3.5 text-blue-600" />
                  <span>Category & Department</span>
                </span>
                <p className="font-semibold text-slate-800">{activeComplaint.category}</p>
                <p className="text-slate-500 mt-0.5 truncate">{activeComplaint.department}</p>
              </div>

              <div className="p-3 rounded-xl border border-slate-100 bg-white sm:col-span-2 md:col-span-1">
                <span className="text-slate-400 flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Location</span>
                </span>
                <p className="font-semibold text-slate-800 line-clamp-2">{activeComplaint.location}</p>
              </div>
            </div>

            {/* Assigned Officer / Resolution Remarks Box */}
            {activeComplaint.assignedOfficer && (
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-blue-900">
                    Assigned Action Unit:
                  </span>
                  <span className="text-xs font-semibold text-blue-800">
                    {activeComplaint.assignedOfficer}
                  </span>
                </div>
                {activeComplaint.resolutionNotes ? (
                  <div className="mt-2 text-xs text-blue-950 bg-white/80 p-3 rounded-lg border border-blue-100 leading-relaxed">
                    <p className="font-semibold text-blue-900 mb-0.5">Administrative Action Taken / Notes:</p>
                    <p>{activeComplaint.resolutionNotes}</p>
                  </div>
                ) : (
                  <p className="text-xs text-blue-800/80 mt-1">
                    Grievance has been forwarded to this division. On-site inspection or servicing is currently active.
                  </p>
                )}
              </div>
            )}

            {/* Chronological Activity Timeline */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Action Log & Timeline
              </h4>

              <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                {activeComplaint.timeline.map((entry) => (
                  <div key={entry.id} className="relative flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full bg-white border-2 border-blue-600 text-blue-600 flex items-center justify-center shrink-0 z-10 shadow-xs">
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex-1 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                        <span className="font-semibold text-slate-900">{entry.updatedBy}</span>
                        <span className="text-slate-400 font-mono">
                          {new Date(entry.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{entry.remarks}</p>
                    </div>
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
