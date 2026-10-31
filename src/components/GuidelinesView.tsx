import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Clock,
  HelpCircle,
  ChevronDown,
  PhoneCall,
  Lock,
  FileCheck2,
  Users,
  AlertTriangle,
} from 'lucide-react';

export const GuidelinesView: React.FC = () => {
  const { setCurrentView } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How long does it take for a complaint to be reviewed?',
      a: 'All complaints logged on this portal are acknowledged immediately with a unique Complaint ID. Administrative review begins within 24 hours, and standard resolution action is completed within 48 to 72 hours for routine infrastructure, classroom, or hostel matters.',
    },
    {
      q: 'Will my complaint remain confidential?',
      a: 'Yes. Only designated members of the Student Grievance Redressal Committee and the assigned technician have access to your personal details. Faculty issues are handled directly by the Dean of Academic Affairs with strict identity safeguarding.',
    },
    {
      q: 'What if an issue requires urgent or emergency intervention?',
      a: 'When filing a grievance, select "Urgent" priority for electrical hazards, severe plumbing leaks, or lab chemical concerns. These tickets automatically trigger urgent dispatches and are reviewed under a 12-hour escalation window.',
    },
    {
      q: 'Can I track a complaint without logging in?',
      a: 'Yes! Simply use the "Track Status" navigation link or the quick tracker on the Home page, enter your unique ticket ID (e.g. CMP-2026-1042), and view all chronological administrative updates.',
    },
    {
      q: 'How do I know when my issue is resolved?',
      a: 'The ticket status will transition to "Resolved" with official resolution notes detailing the work order completion. Students can inspect the remarks and log further inquiries if the issue recurs.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Institutional Policies & Redressal Matrix</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Grievance Redressal Guidelines
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Apex Institute of Technology & Engineering Student Grievance Redressal Mechanism established pursuant to university regulatory mandates.
        </p>
      </div>

      {/* Hero 2-column split with Student Services Photo */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-12 grid grid-cols-1 lg:grid-cols-2">
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
            Campus Redressal Charter
          </span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Our Commitment to Student Welfare
          </h2>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            The Office of Student Affairs ensures that every grievance received through this portal receives equitable, unbiased attention. Whether addressing classroom audio-visual equipment, laboratory supplies, hostel living conditions, or transportation logistics, our specialized committees enforce concrete turnaround deadlines.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100">
              <span className="font-bold text-blue-900 block mb-1">Standard SLA</span>
              <p className="text-blue-800">48-hour typical resolution window for facilities & maintenance.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Confidentiality</span>
              <p className="text-slate-600">Strict privacy guarantees for academic and interpersonal queries.</p>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={() => setCurrentView('submit')}
              className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Submit a Grievance Now
            </button>
          </div>
        </div>

        <div className="relative h-64 lg:h-auto min-h-[320px]">
          <img
            src="/src/assets/images/student_helpdesk_support_1793458505010.jpg"
            alt="Student Services Consultation Desk"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Escalation Matrix Tiers */}
      <div className="mb-14">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900">
            Three-Tier Redressal Escalation Matrix
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Complaints not resolved within the primary SLA automatically escalate to higher oversight.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="text-xs font-mono font-bold text-blue-700 mb-2">TIER 01 · 0-48 HOURS</div>
            <h4 className="text-base font-bold text-slate-900">Departmental & Facility Level</h4>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Assigned directly to campus section officers: AV technical staff, laboratory superintendents, transport fleet heads, or hostel wardens.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="text-xs font-mono font-bold text-indigo-700 mb-2">TIER 02 · 48-96 HOURS</div>
            <h4 className="text-base font-bold text-slate-900">Dean of Student Affairs</h4>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              If delayed beyond 48 hours without progress, ticket is escalated directly to the Dean of Student Affairs for requisition approval and expedited execution.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="text-xs font-mono font-bold text-purple-700 mb-2">TIER 03 · &gt; 96 HOURS</div>
            <h4 className="text-base font-bold text-slate-900">Institutional Grievance Board</h4>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Chaired by the College Principal / Vice Chancellor with student representatives to review complex infrastructural, academic, or hostel policy reforms.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-slate-900">
            Frequently Asked Questions
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Common questions regarding tracking, privacy, and timelines
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-semibold text-slate-800 text-xs sm:text-sm hover:text-blue-700"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    openFaq === index ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>
              {openFaq === index && (
                <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
