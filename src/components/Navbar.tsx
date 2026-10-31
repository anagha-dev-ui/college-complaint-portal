import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  ShieldAlert,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    currentUser,
    logout,
    openAuthModal,
    loginAsDemo,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'submit', label: 'Submit Complaint' },
    { id: 'track', label: 'Track Status' },
    { id: 'analytics', label: 'Statistics' },
    { id: 'guidelines', label: 'Guidelines' },
  ];

  const handleNavClick = (viewId: any) => {
    setCurrentView(viewId);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* College Institutional Utility Banner */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 md:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white tracking-wide">APEX INSTITUTE OF TECHNOLOGY</span>
            <span className="hidden sm:inline text-slate-400">·</span>
            <span className="hidden sm:inline text-slate-300">Student Affairs & Campus Grievance Redressal</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <span className="hidden md:inline text-slate-400">Helpline: +1 (800) 424-GRIEVANCE</span>
            <div className="flex items-center gap-2">
              {currentUser?.role === 'admin' ? (
                <span className="text-blue-400 font-medium">Logged in as Administrator</span>
              ) : currentUser ? (
                <span className="text-slate-300">Student: {currentUser.registerNumber || currentUser.name}</span>
              ) : (
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span>Quick Demo:</span>
                  <button
                    onClick={() => loginAsDemo('student')}
                    className="text-white hover:text-blue-300 font-medium underline"
                  >
                    Student
                  </button>
                  <span>/</span>
                  <button
                    onClick={() => loginAsDemo('admin')}
                    className="text-blue-400 hover:text-blue-300 font-medium underline"
                  >
                    Admin
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Top Navigation Bar (Zone 1 - Zone 2 - Zone 3) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 text-left shrink-0 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-700 text-white flex items-center justify-center shadow-sm group-hover:bg-blue-800 transition-colors">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors whitespace-nowrap">
              College Complaint Portal
            </div>
            <div className="text-xs text-slate-500 font-medium -mt-0.5 whitespace-nowrap">
              Official Grievance Management
            </div>
          </div>
        </button>

        {/* Zone 2: Navigation Links (single-line, clean text with hover states) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          {navLinks.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 font-medium ${
                  isActive
                    ? 'text-blue-700 border-blue-700 font-semibold'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {link.label}
              </button>
            );
          })}

          {currentUser?.role === 'admin' ? (
            <button
              onClick={() => handleNavClick('admin-dashboard')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 font-medium flex items-center gap-1.5 ${
                currentView === 'admin-dashboard'
                  ? 'text-blue-700 border-blue-700 font-semibold'
                  : 'border-transparent text-blue-700 hover:text-blue-900 hover:border-blue-300'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </button>
          ) : currentUser ? (
            <button
              onClick={() => handleNavClick('student-dashboard')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 font-medium flex items-center gap-1.5 ${
                currentView === 'student-dashboard'
                  ? 'text-blue-700 border-blue-700 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>My Complaints</span>
            </button>
          ) : null}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-slate-800 text-sm font-medium shadow-xs transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold leading-tight text-slate-900 truncate max-w-[120px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 capitalize">
                    {currentUser.role}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 text-sm z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-500">Signed in as</p>
                    <p className="text-xs font-semibold text-slate-900 truncate">{currentUser.email}</p>
                    {currentUser.registerNumber && (
                      <p className="text-[11px] font-mono text-blue-700 mt-0.5">{currentUser.registerNumber}</p>
                    )}
                  </div>

                  {currentUser.role === 'admin' ? (
                    <button
                      onClick={() => handleNavClick('admin-dashboard')}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-500" />
                      <span>Admin Control Panel</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleNavClick('student-dashboard')}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-500" />
                      <span>Student Dashboard</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleNavClick('submit')}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                  >
                    <ShieldAlert className="w-4 h-4 text-slate-500" />
                    <span>File New Complaint</span>
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    onClick={() => {
                      logout();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal('student-login')}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
              >
                Student Sign In
              </button>
              <button
                onClick={() => openAuthModal('admin-login')}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-colors whitespace-nowrap"
              >
                Admin Portal
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentView === link.id
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {link.label}
            </button>
          ))}

          {currentUser?.role === 'admin' ? (
            <button
              onClick={() => handleNavClick('admin-dashboard')}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold bg-blue-100/70 text-blue-800"
            >
              Admin Dashboard
            </button>
          ) : currentUser ? (
            <button
              onClick={() => handleNavClick('student-dashboard')}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold bg-blue-50 text-blue-700"
            >
              My Student Complaints
            </button>
          ) : null}

          <div className="pt-3 border-t border-slate-200">
            {currentUser ? (
              <div className="space-y-2">
                <div className="px-3 py-1 text-xs text-slate-500">
                  Signed in as <span className="font-semibold text-slate-800">{currentUser.name}</span> ({currentUser.role})
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => {
                    openAuthModal('student-login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 px-3 text-center rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Student Sign In
                </button>
                <button
                  onClick={() => {
                    openAuthModal('admin-login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 px-3 text-center rounded-lg bg-blue-700 text-sm font-medium text-white hover:bg-blue-800"
                >
                  Admin Portal Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
