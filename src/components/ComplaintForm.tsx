import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEPARTMENTS, CATEGORIES } from '../data/mockData';
import { ComplaintCategory, Department, ComplaintPriority, Complaint } from '../types';
import {
  ShieldAlert,
  CheckCircle,
  Copy,
  ExternalLink,
  UploadCloud,
  FileCheck,
  AlertCircle,
  ArrowRight,
  Info,
} from 'lucide-react';

export const ComplaintForm: React.FC = () => {
  const { currentUser, submitComplaint, setCurrentView, setTrackingId, setSelectedComplaint } =
    useApp();

  const [studentName, setStudentName] = useState(currentUser?.name || '');
  const [registerNumber, setRegisterNumber] = useState(currentUser?.registerNumber || '');
  const [studentEmail, setStudentEmail] = useState(
    currentUser?.email || (currentUser?.name ? `${currentUser.name.toLowerCase().replace(/\s+/g, '.')}@student.college.edu` : '')
  );
  const [studentPhone, setStudentPhone] = useState(currentUser?.phone || '');
  const [department, setDepartment] = useState<Department>(
    currentUser?.department || DEPARTMENTS[0]
  );
  const [category, setCategory] = useState<ComplaintCategory>('Infrastructure');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState<ComplaintPriority>('Medium');
  const [attachmentName, setAttachmentName] = useState<string>('');

  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle mock file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachmentName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!studentName.trim()) {
      setErrorMsg('Please enter student name.');
      return;
    }
    if (!registerNumber.trim()) {
      setErrorMsg('Please enter student register number (e.g. REG-2024-CS010).');
      return;
    }
    if (!title.trim()) {
      setErrorMsg('Please provide a brief title/subject for the complaint.');
      return;
    }
    if (!description.trim() || description.trim().length < 15) {
      setErrorMsg('Please provide a detailed complaint description (at least 15 characters).');
      return;
    }
    if (!location.trim()) {
      setErrorMsg('Please specify the location, classroom, lab, or hostel block.');
      return;
    }

    const newTicket = submitComplaint({
      studentName,
      registerNumber,
      studentEmail: studentEmail || `${registerNumber.toLowerCase()}@student.college.edu`,
      studentPhone,
      department,
      category,
      title,
      description,
      location,
      priority,
      attachmentName: attachmentName || undefined,
    });

    setSubmittedComplaint(newTicket);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (submittedComplaint) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-lg text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 border border-emerald-100">
            <CheckCircle className="w-9 h-9" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Complaint Registered Successfully
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Grievance Ticket Generated
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
            Your complaint has been queued in the campus redressal system and dispatched to the designated department.
          </p>

          {/* Ticket ID Box */}
          <div className="mt-8 p-6 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Unique Complaint ID
            </span>
            <div className="mt-2 flex items-center justify-center gap-3">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-blue-700 tracking-wider">
                {submittedComplaint.id}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(submittedComplaint.id)}
                className="p-2 text-slate-500 hover:text-blue-700 hover:bg-slate-200/60 rounded-lg transition-colors"
                title="Copy Complaint ID"
              >
                {copied ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            {copied && <p className="text-xs text-emerald-600 font-medium mt-1">Copied to clipboard!</p>}

            <div className="mt-4 pt-4 border-t border-slate-200 text-left text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Student:</span>
                <span className="font-semibold text-slate-800">{submittedComplaint.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Register No:</span>
                <span className="font-mono text-slate-800">{submittedComplaint.registerNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="font-semibold text-slate-800">{submittedComplaint.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Department:</span>
                <span className="font-semibold text-slate-800">{submittedComplaint.department}</span>
              </div>
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setTrackingId(submittedComplaint.id);
                setCurrentView('track');
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Track Ticket Status</span>
              <ExternalLink className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setSelectedComplaint(submittedComplaint);
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-medium transition-colors"
            >
              View Full Ticket Details
            </button>

            <button
              onClick={() => {
                setSubmittedComplaint(null);
                setTitle('');
                setDescription('');
                setLocation('');
                setAttachmentName('');
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium transition-colors"
            >
              Submit Another Complaint
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
          <ShieldAlert className="w-4 h-4" />
          <span>Official Student Redressal System</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Submit a Campus Complaint
        </h1>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          Please fill out the form below with factual and accurate information. Your grievance will be registered under an institutional ticket and reviewed by authorized personnel.
        </p>
      </div>

      {/* Guidelines Callout */}
      <div className="mb-8 p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 leading-relaxed">
          <p className="font-semibold">Confidentiality & Fair Redressal Policy</p>
          <p className="mt-0.5 text-blue-800/90">
            All submitted grievances are handled with strict institutional integrity. False allegations or misuse of this portal is subject to university code of conduct disciplinary guidelines.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Submission Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Section 1: Student Information */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>1. Student Information</span>
            {currentUser && (
              <span className="text-xs font-normal text-slate-500">
                Prefilled from current session
              </span>
            )}
          </h3>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Alex Rivers"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Register Number / Roll No <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={registerNumber}
                onChange={(e) => setRegisterNumber(e.target.value.toUpperCase())}
                placeholder="e.g. REG-2024-CS042"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-mono focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none uppercase transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student College Email
              </label>
              <input
                type="email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                placeholder="e.g. student@college.edu"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Phone Number
              </label>
              <input
                type="tel"
                value={studentPhone}
                onChange={(e) => setStudentPhone(e.target.value)}
                placeholder="e.g. +1 (555) 012-3456"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Academic Department <span className="text-rose-500">*</span>
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-colors"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Complaint Particulars */}
        <div className="pt-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100">
            2. Complaint Particulars
          </h3>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Complaint Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-colors"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.label} value={cat.label}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                {CATEGORIES.find((c) => c.label === category)?.description}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Urgency / Priority Level <span className="text-rose-500">*</span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as ComplaintPriority)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-colors"
              >
                <option value="Low">Low - General query or non-blocking inconvenience</option>
                <option value="Medium">Medium - Routine maintenance / standard SLA</option>
                <option value="High">High - Directly disrupting classes or essential services</option>
                <option value="Urgent">Urgent - Emergency safety, hazard or examination clash</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Specific Location / Venue / Block <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Block C, 2nd Floor, Electronics Circuit Lab 202 or North Hostel Wing B"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Complaint Subject / Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief summary of the issue (e.g. Projector HDMI port broken in Room 304)"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detailed Complaint Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide comprehensive details: what happened, when it started, how it impacts your academic or daily schedule, and any past attempts to resolve it..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-colors leading-relaxed"
              />
              <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                <span>Minimum 15 characters</span>
                <span className="font-mono">{description.length} chars</span>
              </div>
            </div>

            {/* Optional Evidence / Attachment */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Supporting Photo or Document (Optional)
              </label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors">
                  <UploadCloud className="w-4 h-4 text-blue-600" />
                  <span>Choose File...</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*,.pdf,.doc,.docx"
                  />
                </label>
                {attachmentName ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                    <FileCheck className="w-4 h-4" />
                    <span>{attachmentName}</span>
                    <button
                      type="button"
                      onClick={() => setAttachmentName('')}
                      className="ml-2 text-slate-400 hover:text-rose-600 text-[10px]"
                    >
                      (remove)
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">
                    PNG, JPG, PDF up to 10MB
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Declaration and Submit button */}
        <div className="pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 mb-4">
            By submitting, you certify that the information provided is genuine and understand that an official tracking ticket will be generated and associated with your student ID.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setCurrentView('home')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Submit & Generate Ticket ID</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
