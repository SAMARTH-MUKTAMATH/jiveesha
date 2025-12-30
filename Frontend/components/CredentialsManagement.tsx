
import React from 'react';
import { 
  ShieldCheck, CheckCircle2, Calendar, FileText, 
  Download, Eye, RefreshCw, Plus, Shield, 
  Smartphone, Lock, ChevronRight, Edit3, 
  ExternalLink, Printer, Mail, ArrowRight
} from 'lucide-react';

interface CredentialsManagementProps {
  onBack: () => void;
}

const CredentialsManagement: React.FC<CredentialsManagementProps> = ({ onBack }) => {
  return (
    <div className="w-full animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Top Breadcrumb & Header */}
      <div className="w-full bg-white border-b border-slate-100">
        <div className="max-w-[1200px] mx-auto px-6 py-6">
          <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            <button onClick={onBack} className="hover:text-[#2563EB] transition-colors">Dashboard</button>
            <ChevronRight size={14} />
            <span className="text-slate-300">Settings</span>
            <ChevronRight size={14} />
            <span className="text-slate-800">Credentials</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Credentials & Verification</h1>
              <p className="text-slate-500 mt-1">Manage your professional licenses and verification status</p>
            </div>
            <div className="flex gap-3">
               <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-200 transition-all">
                 <Printer size={18} /> Print Credentials
               </button>
               <button className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100">
                 <Download size={18} /> Download Certificate
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content (75%) */}
          <div className="flex-1 space-y-8">
            
            {/* Primary Verification Card */}
            <div className="bg-white rounded-3xl p-8 border-2 border-green-400/20 shadow-[0_0_40px_rgba(34,197,94,0.08)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-500" />
              <div className="flex flex-col md:flex-row gap-10 relative z-10">
                <div className="flex-1 flex flex-col sm:flex-row items-center sm:items-start gap-8">
                  <div className="w-24 h-24 bg-green-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-green-100">
                    <ShieldCheck size={56} strokeWidth={1.5} />
                  </div>
                  <div className="text-center sm:text-left space-y-4">
                    <div>
                      <span className="inline-block text-[11px] font-extrabold text-green-600 uppercase tracking-widest mb-1">Status</span>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight">VERIFIED PROFESSIONAL</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3">
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">RCI Registration</p>
                        <p className="text-sm font-bold text-slate-700">RCI/12345/2020</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Specialization</p>
                        <p className="text-sm font-bold text-slate-700">Clinical Psychology</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Issuing Authority</p>
                        <p className="text-sm font-bold text-slate-700">Rehabilitation Council of India</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verified Date</p>
                        <p className="text-sm font-bold text-slate-700">October 25, 2024</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-56 flex flex-col items-center justify-center border-l border-slate-100 pl-8">
                  <div className="relative mb-4">
                    <svg className="w-28 h-28 transform -rotate-90">
                      <circle cx="56" cy="56" r="50" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-slate-100" />
                      <circle cx="56" cy="56" r="50" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray="314" strokeDashoffset="6" className="text-green-500" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-slate-900">98</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Trust Score</span>
                    </div>
                  </div>
                  <div className="space-y-1 w-full text-center sm:text-left">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-green-600"><CheckCircle2 size={12} /> Profile Complete</div>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-green-600"><CheckCircle2 size={12} /> Documents Verified</div>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-green-600"><CheckCircle2 size={12} /> 2FA Enabled</div>
                  </div>
                </div>
              </div>
            </div>

            {/* License Expiry Alert */}
            <div className="bg-white rounded-3xl border border-orange-200 border-l-[6px] border-l-orange-500 p-6 flex flex-col md:flex-row items-center justify-between gap-6 group">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">License Expiry Alert</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-2xl font-black text-orange-600">187 Days Remaining</span>
                    <span className="text-sm font-semibold text-slate-400">Expires: April 30, 2025</span>
                  </div>
                  <div className="mt-3 w-full sm:w-64 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500" style={{ width: '51%' }} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button className="px-6 py-2.5 bg-orange-600 text-white rounded-xl text-sm font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-100">
                  Submit Renewal Documents
                </button>
                <p className="text-[10px] text-slate-400 font-medium">We'll remind you 60 days before expiration</p>
              </div>
            </div>

            {/* License Documents Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">License Documents</h2>
                <button className="flex items-center gap-1.5 text-sm font-bold text-[#2563EB] hover:underline">
                  <Plus size={18} /> Upload New Document
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[
                  { title: 'RCI Registration Certificate', file: 'RCI_Certificate_2020.pdf', size: '2.4 MB', date: 'Oct 24, 2024', status: 'Verified' },
                  { title: 'M.Phil Clinical Psychology', file: 'Degree_Certificate_NIMHANS.pdf', size: '3.1 MB', date: 'Oct 24, 2024', status: 'Verified' },
                  { title: 'Government ID Proof', file: 'Aadhaar_Masked.pdf', size: '1.8 MB', date: 'Oct 24, 2024', status: 'Verified' },
                ].map((doc, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-blue-50 text-[#2563EB] rounded-xl group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                        <FileText size={24} />
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 size={10} /> {doc.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1 leading-tight">{doc.title}</h4>
                    <p className="text-[11px] font-semibold text-slate-400 truncate">{doc.file}</p>
                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                       <span>{doc.size}</span>
                       <span>{doc.date}</span>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                       <button className="py-2 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-[#2563EB] hover:text-white transition-all uppercase">View</button>
                       <button className="py-2 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-[#2563EB] hover:text-white transition-all uppercase">Download</button>
                       <button className="py-2 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-50 rounded-lg text-slate-600 hover:bg-slate-100 transition-all uppercase">Replace</button>
                    </div>
                  </div>
                ))}
                <button className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-5 flex flex-col items-center justify-center gap-3 hover:border-[#2563EB] hover:bg-blue-50 group transition-all min-h-[220px]">
                  <div className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-300 group-hover:border-[#2563EB] group-hover:text-[#2563EB] transition-colors">
                    <Plus size={24} />
                  </div>
                  <div className="text-center">
                    <h4 className="font-bold text-slate-500 group-hover:text-slate-700 transition-colors">Add Additional Document</h4>
                    <p className="text-xs text-slate-400 font-medium">Fellowship, Certifications, etc.</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Practice Information */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-slate-900">Practice Information</h2>
                <button className="flex items-center gap-1.5 text-sm font-bold text-[#2563EB] hover:underline">
                  <Edit3 size={16} /> Edit Practice
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-12">
                {[
                  { label: 'Practice Name', val: 'Rivera Child Development Center' },
                  { label: 'Location', val: 'Mumbai, Maharashtra' },
                  { label: 'Years of Practice', val: '8 years' },
                  { label: 'Hospital Affiliation', val: "Rainbow Children's Hospital" },
                  { label: 'Consultation Languages', val: 'English, Hindi, Marathi' },
                  { label: 'Contact Details', val: '+91 80 1234 5678' },
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                    <p className="text-sm font-bold text-slate-700">{item.val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification History */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-900">Verification History</h2>
                <p className="text-sm text-slate-400 font-medium">Complete audit trail of credential verifications</p>
              </div>
              <div className="space-y-8 relative">
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-50" />
                {[
                  { date: 'Oct 25, 2024', event: '✓ Account Verified & Activated', detail: 'All documents approved by verification team', by: 'Admin Team', status: 'APPROVED' },
                  { date: 'Oct 24, 2024', event: '📄 Documents Submitted', detail: 'RCI Certificate, Degree, ID Proof uploaded', status: 'Review Complete' },
                  { date: 'Oct 24, 2024', event: '👤 Account Created', detail: 'Professional account registered' },
                ].map((entry, i) => (
                  <div key={i} className="flex gap-6 relative z-10">
                    <div className={`w-4 h-4 rounded-full ring-4 ring-white shrink-0 mt-1 ${i === 0 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-slate-300'}`} />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-bold text-slate-800">{entry.event}</h4>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{entry.date}</span>
                      </div>
                      <p className="text-sm text-slate-500 mb-1">{entry.detail}</p>
                      {entry.by && <p className="text-[10px] font-bold text-slate-400 uppercase">Verified by: <span className="text-slate-600">{entry.by}</span></p>}
                      {entry.status && <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase ${entry.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{entry.status}</span>}
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-10 py-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors">
                View Full History
              </button>
            </div>
          </div>

          {/* Sidebar (25%) */}
          <div className="w-full lg:w-[320px] space-y-8">
            
            {/* Security Settings Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 overflow-hidden relative">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-blue-50 text-[#2563EB] rounded-lg">
                  <Shield size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Security Settings</h2>
              </div>
              
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-slate-800">Two-Factor Auth</div>
                    <button className="w-10 h-5 bg-[#2563EB] rounded-full relative transition-colors shadow-inner">
                      <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-100">
                    <Smartphone size={16} className="text-green-600" />
                    <div className="text-[11px] leading-tight">
                      <p className="font-bold text-green-800 uppercase tracking-widest">✓ Active via SMS</p>
                      <p className="text-green-700 opacity-70">Last used: Today, 9:15 AM</p>
                    </div>
                  </div>
                  <button className="w-full h-10 bg-slate-50 rounded-xl text-[10px] font-bold text-slate-600 hover:bg-slate-100 transition-colors uppercase tracking-widest">Manage 2FA</button>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-50">
                  <button className="w-full flex items-center justify-between group text-sm font-bold text-slate-700 hover:text-[#2563EB] transition-colors">
                    Active Sessions <ArrowRight size={14} className="text-slate-300 group-hover:text-[#2563EB] group-hover:translate-x-1 transition-all" />
                  </button>
                  <p className="text-[11px] font-semibold text-slate-400">2 active devices found</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-50">
                  <button className="w-full flex items-center justify-between group text-sm font-bold text-slate-700 hover:text-[#2563EB] transition-colors">
                    Change Password <ArrowRight size={14} className="text-slate-300 group-hover:text-[#2563EB] group-hover:translate-x-1 transition-all" />
                  </button>
                  <p className="text-[11px] font-semibold text-slate-400">Last changed: 30 days ago</p>
                </div>
              </div>
            </div>

            {/* Additional Certifications */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">Certifications</h2>
                <button className="p-1.5 bg-blue-50 text-[#2563EB] rounded-lg hover:bg-blue-100 transition-colors">
                  <Plus size={16} />
                </button>
              </div>
              <div className="space-y-4">
                {[
                  { title: 'Applied Behavior Analysis (ABA)', org: 'BACB Board', year: '2019', status: 'Active' },
                  { title: 'Early Intervention Specialist', org: 'AEIIP Certification', year: '2020', status: 'Active' },
                ].map((cert, i) => (
                  <div key={i} className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl group cursor-pointer hover:border-[#2563EB] transition-all">
                    <div className="flex items-center gap-3 mb-2">
                       <ShieldCheck className="text-blue-500" size={16} />
                       <h4 className="text-xs font-bold text-slate-800 leading-tight group-hover:text-[#2563EB] transition-colors">{cert.title}</h4>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                       <span>{cert.org}</span>
                       <span className="text-green-600">{cert.status}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 text-xs font-bold text-[#2563EB] hover:underline uppercase tracking-widest">+ Add Certification</button>
            </div>

            {/* Re-verification Card */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden">
               <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/5 rounded-full blur-3xl" />
               <h3 className="text-lg font-bold mb-3 relative z-10">Need to Update Credentials?</h3>
               <p className="text-xs text-slate-400 mb-6 relative z-10 leading-relaxed">If your license details have changed or you've earned new credentials, request a formal re-verification.</p>
               <button className="w-full py-3 border border-white/20 rounded-xl text-xs font-bold text-white hover:bg-white/10 transition-all uppercase tracking-widest relative z-10">Request Re-verification</button>
               <p className="mt-4 text-[10px] text-center text-slate-500 font-bold uppercase tracking-widest">Process takes 24-48 hours</p>
            </div>

            {/* Compliance Section */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'HIPAA Compliant', icon: <CheckCircle2 size={12} />, color: 'text-blue-500' },
                { label: 'Data Encrypted', icon: <Lock size={12} />, color: 'text-slate-400' },
                { label: 'NIEPID Validated', icon: <Shield size={12} />, color: 'text-green-500' },
                { label: 'Regular Audits', icon: <RefreshCw size={12} />, color: 'text-orange-500' },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 bg-white border border-slate-100 rounded-xl shadow-sm">
                   <span className={c.color}>{c.icon}</span>
                   <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">{c.label}</span>
                </div>
              ))}
            </div>

            {/* Support Box */}
            <div className="p-6 bg-blue-50 rounded-3xl text-center space-y-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#2563EB] shadow-sm mx-auto">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-900">Verification Team</h4>
                <p className="text-xs text-blue-800/60 leading-relaxed mt-1">Direct support for credentialing</p>
              </div>
              <button className="w-full py-2.5 bg-white text-[#2563EB] text-[10px] font-bold rounded-xl border border-blue-100 hover:bg-[#2563EB] hover:text-white transition-all uppercase tracking-widest">Contact Team</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CredentialsManagement;
