import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { DEPARTMENTS, CATEGORIES } from '../data/mockData';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { Complaint, ComplaintStatus, ComplaintPriority, Department, ComplaintCategory } from '../types';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Building,
  RefreshCw,
  Edit3,
  Trash2,
  Lock,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    complaints,
    updateComplaintStatus,
    deleteComplaint,
    setSelectedComplaint,
    openAuthModal,
    loginAsDemo,
    resetDemoData,
  } = useApp();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest');

  // Status update modal state
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('In Progress');
  const [actionRemarks, setActionRemarks] = useState('');
  const [assignedOfficer, setAssignedOfficer] = useState('');

  // If not logged in as admin, show access panel with quick demo login
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <Lock className="w-7 h-7 text-blue-700" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Administrator Portal</h2>
          <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
            Authorized access for Campus Grievance Redressal Committee members and department heads to review, assign, and resolve student complaints.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openAuthModal('admin-login')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              Log In as Administrator
            </button>
            <button
              onClick={() => loginAsDemo('admin')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition-colors"
            >
              Quick Login as Chief Grievance Officer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
      if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
      if (selectedDepartment !== 'all' && c.department !== selectedDepartment) return false;
      if (selectedPriority !== 'all' && c.priority !== selectedPriority) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inId = c.id.toLowerCase().includes(q);
        const inStudent = c.studentName.toLowerCase().includes(q);
        const inReg = c.registerNumber.toLowerCase().includes(q);
        const inTitle = c.title.toLowerCase().includes(q);
        const inDesc = c.description.toLowerCase().includes(q);
        const inLocation = c.location.toLowerCase().includes(q);
        return inId || inStudent || inReg || inTitle || inDesc || inLocation;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'priority') {
        const weights: Record<ComplaintPriority, number> = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
        return weights[b.priority] - weights[a.priority];
      }
      return 0;
    });
  }, [complaints, searchQuery, selectedStatus, selectedCategory, selectedDepartment, selectedPriority, sortBy]);

  // Statistics calculation
  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === 'Pending').length;
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // Open status modal
  const handleOpenStatusModal = (complaint: Complaint) => {
    setEditingComplaint(complaint);
    setNewStatus(complaint.status);
    setActionRemarks(complaint.resolutionNotes || '');
    setAssignedOfficer(complaint.assignedOfficer || 'Campus Maintenance Division');
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComplaint) return;

    updateComplaintStatus(
      editingComplaint.id,
      newStatus,
      actionRemarks || `Administrative status updated to ${newStatus}`,
      assignedOfficer || undefined
    );
    setEditingComplaint(null);
  };

  // CSV Export utility
  const handleExportCSV = () => {
    const headers = [
      'Complaint ID',
      'Student Name',
      'Register Number',
      'Department',
      'Category',
      'Priority',
      'Status',
      'Location',
      'Title',
      'Date Filed',
      'Assigned Officer',
      'Resolution Notes',
    ];

    const rows = filteredComplaints.map((c) => [
      `"${c.id}"`,
      `"${c.studentName}"`,
      `"${c.registerNumber}"`,
      `"${c.department}"`,
      `"${c.category}"`,
      `"${c.priority}"`,
      `"${c.status}"`,
      `"${c.location.replace(/"/g, '""')}"`,
      `"${c.title.replace(/"/g, '""')}"`,
      `"${new Date(c.createdAt).toLocaleDateString()}"`,
      `"${c.assignedOfficer || 'Unassigned'}"`,
      `"${(c.resolutionNotes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Apex_Grievance_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium mb-3">
            <UserCheck className="w-4 h-4" />
            <span>Chief Grievance Officer Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Institutional Complaint Management
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Review incoming grievances, assign campus staff, update progress notes, and enforce resolution SLAs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Grievances
          </span>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {total}
          </p>
          <span className="text-xs text-slate-400">All registered records</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
            Pending Review
          </span>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-amber-700 font-mono tabular-nums">
            {pending}
          </p>
          <span className="text-xs text-slate-400">Requires triage</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
            In Progress
          </span>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-blue-700 font-mono tabular-nums">
            {inProgress}
          </p>
          <span className="text-xs text-slate-400">Assigned to staff</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            Resolved
          </span>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono tabular-nums">
            {resolved}
          </p>
          <span className="text-xs text-slate-400">Action completed</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs col-span-2 lg:col-span-1">
          <span className="text-xs font-semibold text-blue-900 uppercase tracking-wider">
            Resolution Rate
          </span>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-blue-700 font-mono tabular-nums">
            {resolutionRate}%
          </p>
          <span className="text-xs text-slate-400">Institutional target &ge; 80%</span>
        </div>
      </div>

      {/* Filter and Search Suite */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs mb-6 space-y-4">
        {/* Row 1: Search & Status Quick Filter */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, student, register no, title..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-full lg:w-auto overflow-x-auto">
            {[
              { id: 'all', label: 'All Statuses' },
              { id: 'Pending', label: 'Pending' },
              { id: 'In Progress', label: 'In Progress' },
              { id: 'Resolved', label: 'Resolved' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  selectedStatus === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Secondary Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-blue-600"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.label} value={c.label}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-blue-600 truncate"
            >
              <option value="all">All Departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Priority
            </label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-blue-600"
            >
              <option value="all">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-blue-600"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">Highest Priority</option>
            </select>
          </div>
        </div>

        {/* Clear Filters indicator */}
        {(selectedStatus !== 'all' ||
          selectedCategory !== 'all' ||
          selectedDepartment !== 'all' ||
          selectedPriority !== 'all' ||
          searchQuery) && (
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <span>
              Showing {filteredComplaints.length} of {complaints.length} grievances
            </span>
            <button
              onClick={() => {
                setSelectedStatus('all');
                setSelectedCategory('all');
                setSelectedDepartment('all');
                setSelectedPriority('all');
                setSearchQuery('');
              }}
              className="text-blue-700 font-semibold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Complaints Table (High Density Data Grid conforming to SaaS guidelines) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Category / Dept</th>
                <th className="py-3 px-4">Issue Subject</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date Filed</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No complaints match the specified search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                      {c.id}
                    </td>

                    {/* Student */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{c.studentName}</div>
                      <div className="text-[11px] font-mono text-slate-500">{c.registerNumber}</div>
                    </td>

                    {/* Category & Dept */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{c.category}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[160px]">
                        {c.department}
                      </div>
                    </td>

                    {/* Title */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div
                        onClick={() => setSelectedComplaint(c)}
                        className="font-semibold text-slate-900 hover:text-blue-700 cursor-pointer line-clamp-1"
                      >
                        {c.title}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {c.location}
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <PriorityBadge priority={c.priority} />
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={c.status} size="sm" />
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-mono">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenStatusModal(c)}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold transition-colors flex items-center gap-1"
                          title="Update Status"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Status</span>
                        </button>

                        <button
                          onClick={() => setSelectedComplaint(c)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                          title="View Details"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete complaint ${c.id}? This cannot be undone.`)) {
                              deleteComplaint(c.id);
                            }
                          }}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition-colors"
                          title="Remove Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Status Update Modal */}
      {editingComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[11px] font-mono font-bold text-blue-700">
                  {editingComplaint.id}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Update Grievance Status
                </h3>
              </div>
              <button
                onClick={() => setEditingComplaint(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Change Status To <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Pending', 'In Progress', 'Resolved'] as ComplaintStatus[]).map((st) => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => setNewStatus(st)}
                      className={`py-2 px-3 rounded-lg border font-semibold text-xs transition-all ${
                        newStatus === st
                          ? 'border-blue-600 bg-blue-50 text-blue-800 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assigned Maintenance Unit / Officer
                </label>
                <input
                  type="text"
                  value={assignedOfficer}
                  onChange={(e) => setAssignedOfficer(e.target.value)}
                  placeholder="e.g. Electrical Division, Dean of Student Affairs, Lab Superintendent"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Action Taken Remarks / Official Resolution Notes <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={actionRemarks}
                  onChange={(e) => setActionRemarks(e.target.value)}
                  placeholder="Detail the actions taken: technician dispatch date, parts replaced, work order reference, or scheduled resolution timetable..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600 leading-relaxed"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  These remarks will appear in the student&apos;s live tracking timeline and official records.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingComplaint(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow-xs"
                >
                  Save & Update Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
