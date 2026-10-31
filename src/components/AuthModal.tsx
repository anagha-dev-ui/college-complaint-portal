import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEPARTMENTS } from '../data/mockData';
import { Department } from '../types';
import {
  X,
  User,
  ShieldCheck,
  Lock,
  Mail,
  GraduationCap,
  KeyRound,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    authModalMode,
    closeAuthModal,
    openAuthModal,
    login,
    loginAsDemo,
    registerStudent,
  } = useApp();

  // Mode: 'student-login' | 'student-register' | 'admin-login'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('password123');

  // Register Fields
  const [name, setName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState<Department>(DEPARTMENTS[0]);
  const [phone, setPhone] = useState('');
  const [semester, setSemester] = useState('4th Semester');
  const [errorMsg, setErrorMsg] = useState('');

  if (!authModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim()) {
      setErrorMsg('Please enter your register number or college email.');
      return;
    }

    const role = authModalMode === 'admin-login' ? 'admin' : 'student';
    const success = login(identifier, role);
    if (!success) {
      setErrorMsg(
        role === 'admin'
          ? 'Admin credentials not recognized. Try using admin@college.edu or click the Demo Admin button.'
          : 'Student not found with this register number. Try REG-2024-CS042 or register a new student.'
      );
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !regNo.trim() || !email.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    const success = registerStudent({
      name,
      registerNumber: regNo,
      email,
      department,
      phone,
      semester,
    });

    if (!success) {
      setErrorMsg('A student with this register number or email already exists.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-150 relative">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Icon & Tabs */}
        <div className="text-center mb-6">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${
              authModalMode === 'admin-login'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            {authModalMode === 'admin-login' ? (
              <ShieldCheck className="w-6 h-6" />
            ) : (
              <GraduationCap className="w-6 h-6" />
            )}
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {authModalMode === 'admin-login'
              ? 'Administrator Login'
              : authModalMode === 'student-register'
              ? 'Student Registration'
              : 'Student Sign In'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {authModalMode === 'admin-login'
              ? 'Authorized Campus Grievance Committee Portal'
              : 'Access your student dashboard and grievance tracking'}
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex rounded-xl bg-slate-100 p-1 mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              openAuthModal('student-login');
              setErrorMsg('');
            }}
            className={`flex-1 py-1.5 rounded-lg transition-colors ${
              authModalMode === 'student-login'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Student Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              openAuthModal('student-register');
              setErrorMsg('');
            }}
            className={`flex-1 py-1.5 rounded-lg transition-colors ${
              authModalMode === 'student-register'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            New Student
          </button>
          <button
            type="button"
            onClick={() => {
              openAuthModal('admin-login');
              setErrorMsg('');
            }}
            className={`flex-1 py-1.5 rounded-lg transition-colors ${
              authModalMode === 'admin-login'
                ? 'bg-white text-blue-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Admin
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Mode 1 & 3: Student or Admin Login Form */}
        {authModalMode !== 'student-register' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {authModalMode === 'admin-login'
                  ? 'Admin Email / ID'
                  : 'Register Number or Email'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    authModalMode === 'admin-login'
                      ? 'admin@college.edu'
                      : 'e.g. REG-2024-CS042 or alex.rivers@student.college.edu'
                  }
                  className="w-full pl-3 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl transition-colors shadow-xs"
            >
              {authModalMode === 'admin-login'
                ? 'Sign In to Admin Portal'
                : 'Sign In to Student Portal'}
            </button>

            {/* Quick 1-Click Demo Buttons */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block text-center mb-2">
                Fast Demo Testing
              </span>
              {authModalMode === 'admin-login' ? (
                <button
                  type="button"
                  onClick={() => loginAsDemo('admin')}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-blue-50 text-blue-800 border border-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>1-Click Login as Chief Grievance Officer</span>
                </button>
              ) : (
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => loginAsDemo('student')}
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-800 border border-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>1-Click Demo as Alex Rivers (CSE)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIdentifier('REG-2024-EC108');
                      login('REG-2024-EC108', 'student');
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium transition-colors"
                  >
                    Demo as Sarah Chen (ECE)
                  </button>
                </div>
              )}
            </div>
          </form>
        ) : (
          /* Mode 2: Student Registration Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Register Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={regNo}
                onChange={(e) => setRegNo(e.target.value.toUpperCase())}
                placeholder="e.g. REG-2025-CS088"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 font-mono uppercase"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Department <span className="text-rose-500">*</span>
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 bg-white"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Semester
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 bg-white"
                >
                  <option value="1st Semester">1st Semester</option>
                  <option value="2nd Semester">2nd Semester</option>
                  <option value="3rd Semester">3rd Semester</option>
                  <option value="4th Semester">4th Semester</option>
                  <option value="5th Semester">5th Semester</option>
                  <option value="6th Semester">6th Semester</option>
                  <option value="7th Semester">7th Semester</option>
                  <option value="8th Semester">8th Semester</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose password"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl transition-colors shadow-xs mt-2"
            >
              Complete Registration & Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
