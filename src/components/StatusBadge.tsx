import React from 'react';
import { ComplaintStatus, ComplaintPriority } from '../types';
import { Clock, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';

interface StatusBadgeProps {
  status: ComplaintStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium',
  };

  if (status === 'Resolved') {
    return (
      <span
        className={`inline-flex items-center rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80 ${sizeClasses[size]}`}
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>Resolved</span>
      </span>
    );
  }

  if (status === 'In Progress') {
    return (
      <span
        className={`inline-flex items-center rounded-md bg-blue-50 text-blue-800 border border-blue-200/80 ${sizeClasses[size]}`}
      >
        <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
        <span>In Progress</span>
      </span>
    );
  }

  // Pending
  return (
    <span
      className={`inline-flex items-center rounded-md bg-amber-50 text-amber-900 border border-amber-200/80 ${sizeClasses[size]}`}
    >
      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
      <span>Pending Review</span>
    </span>
  );
};

interface PriorityBadgeProps {
  priority: ComplaintPriority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const configs: Record<ComplaintPriority, { label: string; className: string }> = {
    Low: { label: 'Low Priority', className: 'text-slate-600 bg-slate-100 border-slate-200' },
    Medium: { label: 'Medium Priority', className: 'text-blue-700 bg-blue-50/70 border-blue-200' },
    High: { label: 'High Priority', className: 'text-orange-700 bg-orange-50 border-orange-200' },
    Urgent: { label: 'Urgent', className: 'text-rose-700 bg-rose-50 border-rose-200 font-semibold' },
  };

  const current = configs[priority] || configs.Medium;

  return (
    <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded border ${current.className}`}>
      {priority === 'Urgent' && <ArrowUpRight className="w-3 h-3 mr-0.5 text-rose-600" />}
      {current.label}
    </span>
  );
};
