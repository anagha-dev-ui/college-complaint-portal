export type ComplaintCategory =
  | 'Infrastructure'
  | 'Classroom'
  | 'Laboratory'
  | 'Hostel'
  | 'Transportation'
  | 'Faculty'
  | 'Other Issues';

export type ComplaintStatus = 'Pending' | 'In Progress' | 'Resolved';

export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type Department =
  | 'Computer Science & Engineering'
  | 'Electronics & Communication'
  | 'Mechanical Engineering'
  | 'Civil Engineering'
  | 'Electrical & Electronics'
  | 'Information Technology'
  | 'Management Studies (MBA)'
  | 'Humanities & Basic Sciences';

export interface TimelineEntry {
  id: string;
  status: ComplaintStatus;
  timestamp: string;
  updatedBy: string;
  remarks: string;
}

export interface Complaint {
  id: string; // e.g. CMP-2026-1042
  studentName: string;
  registerNumber: string;
  studentEmail: string;
  studentPhone?: string;
  department: Department;
  category: ComplaintCategory;
  title: string;
  description: string;
  location: string; // e.g. "Block B - Room 302" or "Hostel Block 1"
  priority: ComplaintPriority;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  assignedOfficer?: string;
  resolutionNotes?: string;
  resolvedAt?: string;
  timeline: TimelineEntry[];
  attachmentName?: string;
}

export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  registerNumber?: string;
  department?: Department;
  phone?: string;
  semester?: string;
}

export interface ComplaintFilterState {
  searchQuery: string;
  category: string;
  status: string;
  department: string;
  priority: string;
  sortBy: 'newest' | 'oldest' | 'priority';
}
