import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Phone, Mail, MapPin, RefreshCw, FileText, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { resetDemoData, setCurrentView } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Institutional Brand & Scope */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                College Complaint Portal
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Apex Institute of Technology & Engineering. An autonomous university student grievance redressal mechanism dedicated to prompt, transparent, and fair resolution of campus issues.
            </p>
            <div className="text-xs text-slate-500">
              Approved under UGC Student Grievance Redressal Regulations.
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Redressal Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentView('submit')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Submit a Grievance
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('track')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Track Complaint Status
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('student-dashboard')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Student Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('admin-dashboard')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Admin Control Console
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('analytics')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Resolution Statistics & Trends
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('guidelines')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Code of Conduct & SLA Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Helpdesk & Emergency Contacts */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Campus Grievance Cells
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Grievance Cell, Admin Block Room 104, North Campus</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Helpline: +1 (800) 424-4743</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Anti-Ragging 24/7: +1 (800) 180-5522</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>grievance@apextech.edu</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Testing & Deployment utilities */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Demo System Controls
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              State is persisted in your local browser storage. You can freely create tickets, alter statuses, and reset whenever needed.
            </p>
            <button
              onClick={() => {
                if (window.confirm('Reset all complaints and accounts back to original demo seed data?')) {
                  resetDemoData();
                  alert('Demo database reset to initial seed state.');
                }
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
              <span>Reset Demo Seed Data</span>
            </button>
            <div className="pt-2 text-[11px] text-slate-500">
              Ready for GitHub & Vercel deployment. Full source code included.
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Apex Institute of Technology & Engineering. College Complaint Portal. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Strict Confidentiality Enforced</span>
            <span>·</span>
            <span className="text-slate-400">48-Hour Standard SLA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
