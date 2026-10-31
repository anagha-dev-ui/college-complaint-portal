import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { ComplaintStatus } from '../types';
import {
  X,
  Printer,
  Copy,
  CheckCircle,
  Clock,
  User,
  Building,
  MapPin,
  Calendar,
  FileText,
  Paperclip,
  ShieldCheck,
  Edit3,
} from 'lucide-react';

export const ComplaintDetailModal: React.FC = () => {
  const { selectedComplaint, setSelectedComplaint, currentUser, updateComplaintStatus } = useApp();

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('In Progress');
  const [remarks, setRemarks] = useState('');
  const [assignedOfficer, setAssignedOfficer] = useState('');
  const [copied, setCopied] = useState(false);

  if (!selectedComplaint) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(selectedComplaint.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAdminStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateComplaintStatus(
      selectedComplaint.id,
      newStatus,
      remarks.trim() || `Status updated to ${newStatus}`,
      assignedOfficer || undefined
    );
    setIsUpdatingStatus(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-3xl w-full my-8 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-blue-300">
                {selectedComplaint.id}
              </span>
              <PriorityBadge priority={selectedComplaint.priority} />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
              {selectedComplaint.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
              <span>Category: {selectedComplaint.category}</span>
              <span>·</span>
              <span>{new Date(selectedComplaint.createdAt).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Print Official Grievance Docket"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedComplaint(null)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Close Dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Status & Copy bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Current Status:</span>
              <StatusBadge status={selectedComplaint.status} size="md" />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyId}
                className="px-2.5 py-1 text-xs rounded-md border border-slate-200 hover:bg-white text-slate-600 transition-colors flex items-center gap-1 font-mono"
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy ID'}</span>
              </button>

              {currentUser?.role === 'admin' && !isUpdatingStatus && (
                <button
                  onClick={() => {
                    setIsUpdatingStatus(true);
                    setNewStatus(selectedComplaint.status);
                    setRemarks(selectedComplaint.resolutionNotes || '');
                    setAssignedOfficer(selectedComplaint.assignedOfficer || '');
                  }}
                  className="px-3 py-1 text-xs rounded-md bg-blue-700 hover:bg-blue-800 text-white font-semibold transition-colors flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Update Status</span>
                </button>
              )}
            </div>
          </div>

          {/* Admin Inline Status Update Box */}
          {isUpdatingStatus && (
            <form onSubmit={handleAdminStatusSubmit} className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 space-y-3 text-xs">
              <div className="flex items-center justify-between font-bold text-blue-900">
                <span>Update Grievance Status & Officer Assignment</span>
                <button
                  type="button"
                  onClick={() => setIsUpdatingStatus(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(['Pending', 'In Progress', 'Resolved'] as ComplaintStatus[]).map((st) => (
                  <button
                    type="button"
                    key={st}
                    onClick={() => setNewStatus(st)}
                    className={`py-1.5 px-3 rounded-lg border font-semibold ${
                      newStatus === st
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Assign Campus Unit / Staff
                </label>
                <input
                  type="text"
                  value={assignedOfficer}
                  onChange={(e) => setAssignedOfficer(e.target.value)}
                  placeholder="e.g. Facilities Maintenance, Department Head"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Action Taken / Resolution Remarks
                </label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Provide resolution note or current action description..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsUpdatingStatus(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold"
                >
                  Apply Status Change
                </button>
              </div>
            </form>
          )}

          {/* Student & Department Particulars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
              <span className="text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Student Details</span>
              </span>
              <p className="font-bold text-slate-900">{selectedComplaint.studentName}</p>
              <p className="font-mono text-slate-600 mt-0.5">{selectedComplaint.registerNumber}</p>
              <p className="text-slate-500 truncate mt-0.5">{selectedComplaint.studentEmail}</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
              <span className="text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                <Building className="w-3.5 h-3.5 text-blue-600" />
                <span>Department & Category</span>
              </span>
              <p className="font-bold text-slate-900">{selectedComplaint.category}</p>
              <p className="text-slate-600 mt-0.5 leading-snug">{selectedComplaint.department}</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 sm:col-span-2 md:col-span-1">
              <span className="text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Location Specifics</span>
              </span>
              <p className="font-semibold text-slate-900">{selectedComplaint.location}</p>
            </div>
          </div>

          {/* Detailed Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Detailed Complaint Statement
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
              {selectedComplaint.description}
            </div>
          </div>

          {/* Attachment if present */}
          {selectedComplaint.attachmentName && (
            <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-slate-700">
                  Supporting Document: {selectedComplaint.attachmentName}
                </span>
              </div>
              <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                Attached
              </span>
            </div>
          )}

          {/* Assigned Officer / Resolution Box */}
          {selectedComplaint.assignedOfficer && (
            <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200/80 text-xs">
              <div className="flex items-center justify-between font-bold text-blue-900 mb-1">
                <span>Assigned Redressal Unit:</span>
                <span>{selectedComplaint.assignedOfficer}</span>
              </div>
              {selectedComplaint.resolutionNotes && (
                <div className="mt-2 p-3 rounded-lg bg-white border border-blue-100 text-slate-800 leading-relaxed">
                  <span className="font-bold text-blue-900 block mb-0.5">
                    Official Action Taken:
                  </span>
                  {selectedComplaint.resolutionNotes}
                </div>
              )}
            </div>
          )}

          {/* Timeline */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
              Redressal Audit Trail & Timeline
            </h4>
            <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200 pl-1">
              {selectedComplaint.timeline.map((item) => (
                <div key={item.id} className="relative flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-white border-2 border-blue-600 text-blue-600 flex items-center justify-center shrink-0 z-10 shadow-xs mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  </div>
                  <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-semibold text-slate-900">{item.updatedBy}</span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{item.remarks}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Apex Grievance Redressal Mechanism · Official Docket
          </span>
          <button
            onClick={() => setSelectedComplaint(null)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
