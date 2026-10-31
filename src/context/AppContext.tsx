import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Complaint,
  User,
  ComplaintStatus,
  ComplaintPriority,
  ComplaintCategory,
  Department,
  UserRole,
} from '../types';
import { INITIAL_COMPLAINTS, INITIAL_USERS } from '../data/mockData';

interface SubmitComplaintInput {
  studentName: string;
  registerNumber: string;
  studentEmail: string;
  studentPhone?: string;
  department: Department;
  category: ComplaintCategory;
  title: string;
  description: string;
  location: string;
  priority: ComplaintPriority;
  attachmentName?: string;
}

export type ViewType =
  | 'home'
  | 'submit'
  | 'track'
  | 'student-dashboard'
  | 'admin-dashboard'
  | 'analytics'
  | 'guidelines';

interface AppContextType {
  complaints: Complaint[];
  users: User[];
  currentUser: User | null;
  currentView: ViewType;
  trackingId: string | null;
  selectedComplaint: Complaint | null;
  authModalOpen: boolean;
  authModalMode: 'student-login' | 'student-register' | 'admin-login';
  setCurrentView: (view: ViewType) => void;
  setTrackingId: (id: string | null) => void;
  setSelectedComplaint: (complaint: Complaint | null) => void;
  openAuthModal: (mode: 'student-login' | 'student-register' | 'admin-login') => void;
  closeAuthModal: () => void;
  login: (identifier: string, role: UserRole) => boolean;
  loginAsDemo: (role: UserRole) => void;
  registerStudent: (data: {
    name: string;
    registerNumber: string;
    email: string;
    department: Department;
    phone?: string;
    semester?: string;
  }) => boolean;
  logout: () => void;
  submitComplaint: (data: SubmitComplaintInput) => Complaint;
  updateComplaintStatus: (
    id: string,
    newStatus: ComplaintStatus,
    remarks: string,
    assignedOfficer?: string
  ) => void;
  deleteComplaint: (id: string) => void;
  resetDemoData: () => void;
  getComplaintById: (id: string) => Complaint | undefined;
  getComplaintsByStudent: (regNo: string) => Complaint[];
}

const STORAGE_KEYS = {
  COMPLAINTS: 'college_complaint_portal_complaints_v1',
  USERS: 'college_complaint_portal_users_v1',
  CURRENT_USER: 'college_complaint_portal_current_user_v1',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_COMPLAINTS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Default to student demo user for instant interactive exploration
    return INITIAL_USERS[0];
  });

  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<
    'student-login' | 'student-register' | 'admin-login'
  >('student-login');

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
    } catch {
      // ignore
    }
  }, [complaints]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch {
      // ignore
    }
  }, [users]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  const openAuthModal = (mode: 'student-login' | 'student-register' | 'admin-login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const login = (identifier: string, role: UserRole): boolean => {
    const clean = identifier.trim().toLowerCase();
    const user = users.find((u) => {
      if (u.role !== role) return false;
      return (
        u.email.toLowerCase() === clean ||
        (u.registerNumber && u.registerNumber.toLowerCase() === clean)
      );
    });

    if (user) {
      setCurrentUser(user);
      closeAuthModal();
      if (role === 'admin') {
        setCurrentView('admin-dashboard');
      } else {
        setCurrentView('student-dashboard');
      }
      return true;
    }
    return false;
  };

  const loginAsDemo = (role: UserRole) => {
    if (role === 'admin') {
      const admin = users.find((u) => u.role === 'admin') || INITIAL_USERS[2];
      setCurrentUser(admin);
      setCurrentView('admin-dashboard');
    } else {
      const student = users.find((u) => u.role === 'student') || INITIAL_USERS[0];
      setCurrentUser(student);
      setCurrentView('student-dashboard');
    }
    closeAuthModal();
  };

  const registerStudent = (data: {
    name: string;
    registerNumber: string;
    email: string;
    department: Department;
    phone?: string;
    semester?: string;
  }): boolean => {
    // Check if registerNumber or email already exists
    const exists = users.some(
      (u) =>
        u.registerNumber?.toLowerCase() === data.registerNumber.trim().toLowerCase() ||
        u.email.toLowerCase() === data.email.trim().toLowerCase()
    );

    if (exists) {
      return false;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim(),
      role: 'student',
      registerNumber: data.registerNumber.trim().toUpperCase(),
      department: data.department,
      phone: data.phone?.trim(),
      semester: data.semester?.trim() || '1st Semester',
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    closeAuthModal();
    setCurrentView('student-dashboard');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  // Generate unique complaint ID: CMP-2026-XXXX
  const generateUniqueId = (): string => {
    const year = new Date().getFullYear();
    const existingNumbers = complaints
      .map((c) => {
        const parts = c.id.split('-');
        return parts.length === 3 ? parseInt(parts[2], 10) : 0;
      })
      .filter((n) => !isNaN(n));

    const maxNum = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 1042;
    const nextNum = maxNum + 1;
    return `CMP-${year}-${nextNum.toString().padStart(4, '0')}`;
  };

  const submitComplaint = (data: SubmitComplaintInput): Complaint => {
    const uniqueId = generateUniqueId();
    const now = new Date().toISOString();

    const newComplaint: Complaint = {
      id: uniqueId,
      studentName: data.studentName.trim(),
      registerNumber: data.registerNumber.trim().toUpperCase(),
      studentEmail: data.studentEmail.trim(),
      studentPhone: data.studentPhone?.trim(),
      department: data.department,
      category: data.category,
      title: data.title.trim(),
      description: data.description.trim(),
      location: data.location.trim(),
      priority: data.priority,
      status: 'Pending',
      createdAt: now,
      updatedAt: now,
      attachmentName: data.attachmentName,
      timeline: [
        {
          id: `t-${Date.now()}-1`,
          status: 'Pending',
          timestamp: now,
          updatedBy: `${data.studentName.trim()} (Student)`,
          remarks: 'Complaint registered and queued for administrative review.',
        },
      ],
    };

    setComplaints((prev) => [newComplaint, ...prev]);
    return newComplaint;
  };

  const updateComplaintStatus = (
    id: string,
    newStatus: ComplaintStatus,
    remarks: string,
    assignedOfficer?: string
  ) => {
    const now = new Date().toISOString();
    const updaterName = currentUser ? currentUser.name : 'College Administration';

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;

        const newTimelineEntry = {
          id: `t-${Date.now()}`,
          status: newStatus,
          timestamp: now,
          updatedBy: `${updaterName} (${currentUser?.role === 'admin' ? 'Admin' : 'Staff'})`,
          remarks: remarks.trim() || `Status updated to ${newStatus}.`,
        };

        return {
          ...c,
          status: newStatus,
          updatedAt: now,
          assignedOfficer: assignedOfficer !== undefined ? assignedOfficer : c.assignedOfficer,
          resolutionNotes:
            newStatus === 'Resolved' ? remarks.trim() : c.resolutionNotes,
          resolvedAt: newStatus === 'Resolved' ? now : c.resolvedAt,
          timeline: [...c.timeline, newTimelineEntry],
        };
      })
    );

    // Also update selectedComplaint if open
    setSelectedComplaint((prev) => {
      if (prev && prev.id === id) {
        return {
          ...prev,
          status: newStatus,
          updatedAt: now,
          assignedOfficer: assignedOfficer !== undefined ? assignedOfficer : prev.assignedOfficer,
          resolutionNotes: newStatus === 'Resolved' ? remarks.trim() : prev.resolutionNotes,
          resolvedAt: newStatus === 'Resolved' ? now : prev.resolvedAt,
          timeline: [
            ...prev.timeline,
            {
              id: `t-${Date.now()}`,
              status: newStatus,
              timestamp: now,
              updatedBy: `${updaterName} (${currentUser?.role === 'admin' ? 'Admin' : 'Staff'})`,
              remarks: remarks.trim() || `Status updated to ${newStatus}.`,
            },
          ],
        };
      }
      return prev;
    });
  };

  const deleteComplaint = (id: string) => {
    setComplaints((prev) => prev.filter((c) => c.id !== id));
    if (selectedComplaint?.id === id) {
      setSelectedComplaint(null);
    }
  };

  const resetDemoData = () => {
    setComplaints(INITIAL_COMPLAINTS);
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    localStorage.removeItem(STORAGE_KEYS.COMPLAINTS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  };

  const getComplaintById = (id: string) => {
    const clean = id.trim().toUpperCase();
    return complaints.find(
      (c) => c.id.toUpperCase() === clean || c.id.replace(/-/g, '') === clean.replace(/-/g, '')
    );
  };

  const getComplaintsByStudent = (regNo: string) => {
    const clean = regNo.trim().toUpperCase();
    return complaints.filter((c) => c.registerNumber.toUpperCase() === clean);
  };

  return (
    <AppContext.Provider
      value={{
        complaints,
        users,
        currentUser,
        currentView,
        trackingId,
        selectedComplaint,
        authModalOpen,
        authModalMode,
        setCurrentView,
        setTrackingId,
        setSelectedComplaint,
        openAuthModal,
        closeAuthModal,
        login,
        loginAsDemo,
        registerStudent,
        logout,
        submitComplaint,
        updateComplaintStatus,
        deleteComplaint,
        resetDemoData,
        getComplaintById,
        getComplaintsByStudent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
