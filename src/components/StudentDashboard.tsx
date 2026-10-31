import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import {
  FileText,
  PlusCircle,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  User,
  GraduationCap,
  Calendar,
  Building,
} from 'lucide-react';
import { ComplaintStatus } from '../types';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    complaints,
    setCurrentView,
    setTrackingId,
    setSelectedComplaint,
    openAuthModal,
    loginAsDemo,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // If not logged in as a student, prompt sign in or quick demo
  if (!currentUser || currentUser.role !== 'student') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Student Portal Access</h2>
          <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
            Please log in with your university register number to view your submitted complaints and monitor resolution statuses.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openAuthModal('student-login')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              Sign In with Register Number
            </button>
            <button
              onClick={() => loginAsDemo('student')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
            >
              Quick Demo as Alex Rivers (CS)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter complaints for this student
  const studentComplaints = complaints.filter(
    (c) =>
      c.registerNumber.toUpperCase() === (currentUser.registerNumber || '').toUpperCase() ||
      c.studentEmail.toLowerCase() === currentUser.email.toLowerCase() ||
      c.studentName.toLowerCase() === currentUser.name.toLowerCase()
  );

  const pendingCount = studentComplaints.filter((c) => c.status === 'Pending').length;
  const inProgressCount = studentComplaints.filter((c) => c.status === 'In Progress').length;
  const resolvedCount = studentComplaints.filter((c) => c.status === 'Resolved').length;

  const filteredComplaints = studentComplaints.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchId = c.id.toLowerCase().includes(q);
      const matchCat = c.category.toLowerCase().includes(q);
      const matchDesc = c.description.toLowerCase().includes(q);
      return matchTitle || matchId || matchCat || matchDesc;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      {/* Student Welcome Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-700 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Welcome back, {currentUser.name}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                Student
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500">
              <span className="font-mono text-slate-700 font-medium">
                Reg No: {currentUser.registerNumber}
              </span>
              <span>·</span>
              <span>{currentUser.department}</span>
              {currentUser.semester && (
                <>
                  <span>·</span>
                  <span>{currentUser.semester}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('submit')}
            className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-2 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>File New Complaint</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Logged
            </span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {studentComplaints.length}
          </p>
          <p className="text-xs text-slate-400 mt-1">Personal grievances</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Pending Review
            </span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-amber-800 font-mono tabular-nums">
            {pendingCount}
          </p>
          <p className="text-xs text-slate-400 mt-1">Awaiting dispatch</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
              In Progress
            </span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-blue-800 font-mono tabular-nums">
            {inProgressCount}
          </p>
          <p className="text-xs text-slate-400 mt-1">Assigned & active</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Resolved
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-emerald-800 font-mono tabular-nums">
            {resolvedCount}
          </p>
          <p className="text-xs text-slate-400 mt-1">Successfully closed</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Interactive Segmented Filter Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-full md:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All Tickets', count: studentComplaints.length },
            { id: 'Pending', label: 'Pending', count: pendingCount },
            { id: 'In Progress', label: 'In Progress', count: inProgressCount },
            { id: 'Resolved', label: 'Resolved', count: resolvedCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  statusFilter === tab.id ? 'bg-slate-100 text-slate-800' : 'text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search my complaints..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Complaints List */}
      {filteredComplaints.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">
            No complaints found in this view
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No complaints match "${searchQuery}". Try clearing your search.`
              : 'You have not submitted any complaints matching this filter.'}
          </p>
          <button
            onClick={() => setCurrentView('submit')}
            className="mt-4 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors inline-flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit a New Complaint</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredComplaints.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xs p-5 sm:p-6 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono font-bold text-sm text-blue-700">{item.id}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs font-semibold text-slate-700">{item.category}</span>
                  <span className="text-slate-300">·</span>
                  <PriorityBadge priority={item.priority} />
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={item.status} size="sm" />
                </div>
              </div>

              <div className="pt-3">
                <h3 className="text-base font-bold text-slate-900 hover:text-blue-700 transition-colors cursor-pointer"
                    onClick={() => setSelectedComplaint(item)}>
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-3">
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.location}</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setTrackingId(item.id);
                        setCurrentView('track');
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>Track Timeline</span>
                    </button>
                    <button
                      onClick={() => setSelectedComplaint(item)}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <span>Full Details</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
