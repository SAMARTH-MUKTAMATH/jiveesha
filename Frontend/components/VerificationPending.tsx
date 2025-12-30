
import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle2, Circle, Mail, Smartphone, ArrowRight, Play, Book, HelpCircle, ShieldCheck } from 'lucide-react';

interface VerificationPendingProps {
  onApprove: () => void;
}

const VerificationPending: React.FC<VerificationPendingProps> = ({ onApprove }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => (p < 95 ? p + 5 : p));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 sm:p-10 flex flex-col items-center">
      {/* Status Animation */}
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-full border-4 border-slate-100 flex items-center justify-center">
          <Clock className="text-amber-500 animate-pulse" size={64} strokeWidth={1.5} />
        </div>
        <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-t-4 border-[#2563EB] animate-spin duration-[4000ms]" />
      </div>

      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Verification in Progress</h2>
        <p className="text-slate-500 max-w-md mx-auto">
          Thanks for submitting your profile, Dr. Rivera. Our team is currently verifying your license and certifications.
        </p>
      </div>

      {/* Profile Summary Card */}
      <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center shrink-0 border-2 border-white shadow-sm overflow-hidden">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jane" alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-lg font-bold text-slate-900">Dr. Jane Rivera</h3>
          <p className="text-sm text-slate-500">License: <span className="font-semibold text-slate-700">RCI #RCI/12345/2020</span></p>
          <p className="text-sm text-slate-500">Specialization: <span className="font-semibold text-slate-700">Clinical Psychology</span></p>
          <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider font-bold">Submitted: Oct 24, 2024 at 2:45 PM</p>
        </div>
        <div className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-200">
          Pending Review
        </div>
      </div>

      {/* Verification Timeline */}
      <div className="w-full mb-12">
        <h4 className="text-xl font-bold text-slate-800 mb-6">What happens next?</h4>
        <div className="space-y-8 relative">
          <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100" />
          
          {[
            { status: 'done', title: 'Application Submitted', sub: 'Your documents have been received', time: 'Oct 24, 2:45 PM' },
            { status: 'active', title: 'Credential Verification', sub: 'Our team is verifying your RCI registration', detail: 'Typically takes 24-48 hours' },
            { status: 'pending', title: 'Account Activation', sub: 'You\'ll receive email notification when approved' }
          ].map((item, i) => (
            <div key={i} className="flex gap-4 relative z-10">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 
                ${item.status === 'done' ? 'bg-green-500 border-green-500 text-white' : 
                  item.status === 'active' ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-[0_0_10px_rgba(37,99,235,0.3)]' : 'bg-white border-slate-300 text-slate-300'}`}>
                {item.status === 'done' ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              <div className="flex-1 -mt-0.5">
                <div className="flex justify-between items-start">
                  <h5 className={`font-bold ${item.status === 'pending' ? 'text-slate-400' : 'text-slate-800'}`}>{item.title}</h5>
                  {item.time && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.time}</span>}
                </div>
                <p className="text-sm text-slate-500">{item.sub}</p>
                {item.status === 'active' && (
                  <div className="mt-3">
                    <p className="text-[11px] font-bold text-blue-600 mb-1">{item.detail}</p>
                    <div className="h-1 w-full bg-blue-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#2563EB] transition-all duration-1000" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estimated Time Card */}
      <div className="w-full bg-blue-50 border border-blue-100 rounded-2xl p-5 flex gap-4 mb-10">
        <Clock className="text-[#2563EB] shrink-0" size={24} />
        <div>
          <h4 className="text-sm font-bold text-blue-900">⏱ Estimated Review Time</h4>
          <p className="text-sm text-blue-800/80 leading-relaxed mt-1">
            Usually takes 24-48 hours. We will notify you via email once complete. 
            <button onClick={onApprove} className="ml-2 underline text-[#2563EB] font-bold hover:text-blue-800">(Demo: Click to Approve)</button>
          </p>
        </div>
      </div>

      {/* Notification Prefs */}
      <div className="w-full mb-10 border-t border-slate-100 pt-8">
        <h4 className="text-sm font-bold text-slate-800 mb-4">How would you like to be notified?</h4>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#2563EB]" />
            <span className="text-sm text-slate-600">Email (jane.doe@clinic.com)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded text-[#2563EB]" />
            <span className="text-sm text-slate-600">SMS (+1 555-000-0000)</span>
          </label>
        </div>
        <button className="mt-3 text-[11px] font-bold text-[#2563EB] uppercase tracking-wider hover:underline">Update preferences</button>
      </div>

      {/* While You Wait */}
      <div className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl">
        <h4 className="text-lg font-bold text-slate-800 mb-4">While you wait...</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: <ShieldCheck size={18} />, label: 'Explore Features' },
            { icon: <Play size={18} />, label: 'Watch Tutorials' },
            { icon: <Book size={18} />, label: 'Clinical Protocols' },
            { icon: <HelpCircle size={18} />, label: 'Read FAQ' }
          ].map((link, i) => (
            <button key={i} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-[#2563EB] hover:text-[#2563EB] transition-all text-sm font-semibold text-slate-600 group">
              <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">{link.icon}</div>
              {link.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 w-full space-y-4">
        <button disabled className="w-full h-14 bg-slate-200 text-slate-400 font-bold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed group relative">
          Go to Dashboard 🔒
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Available after verification</span>
        </button>
        <div className="flex justify-between items-center text-sm font-bold text-slate-400">
          <button className="hover:text-slate-600 transition-colors uppercase tracking-widest text-[11px]">Return to Home</button>
          <button className="text-[#2563EB] hover:underline uppercase tracking-widest text-[11px]">Contact Support</button>
        </div>
      </div>

      {/* Support Box */}
      <div className="mt-16 text-center text-slate-400 border-t border-slate-100 pt-8 w-full">
        <p className="text-xs font-bold uppercase tracking-widest mb-4">Questions about your verification?</p>
        <div className="flex flex-col items-center gap-1 text-sm font-medium">
          <p>Email: <span className="text-slate-600">verification@daira.health</span></p>
          <p>Phone: <span className="text-slate-600">+91 80 1234 5678</span></p>
          <p className="text-[11px] mt-2 opacity-70">Available: Mon-Fri, 9 AM - 6 PM IST</p>
        </div>
      </div>
    </div>
  );
};

export default VerificationPending;
