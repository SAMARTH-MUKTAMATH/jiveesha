
import React, { useState, useRef, useEffect } from 'react';
import {
   ShieldCheck, Info, ChevronRight, CheckCircle2, XCircle,
   Clock, Key, Bell, Shield, ArrowRight, User,
   Database, FileText, ChevronDown, HelpCircle,
   Plus, MoreVertical, ExternalLink, Activity
} from 'lucide-react';
import { apiClient } from '../services/api';

interface ConsentCenterProps {
   onBack: () => void;
   onRequestNewConsent: () => void;
   patientId?: string | null;
}

const ConsentCenter: React.FC<ConsentCenterProps> = ({ onBack, onRequestNewConsent, patientId }) => {
   const [expandedAccordion, setExpandedAccordion] = useState<number | null>(0);

   return (
      <div className="w-full animate-in fade-in duration-500 pb-20">
         {/* Header */}
         <div className="bg-white border-b border-slate-100">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8 flex flex-col md:flex-row items-end justify-between gap-6">
               <div>
                  <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                     <button onClick={onBack} className="hover:text-[#2563EB]">Dashboard</button>
                     <ChevronRight size={14} />
                     <span className="text-slate-800">Consent Center</span>
                  </nav>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Consent Center</h1>
                  <p className="text-slate-500 mt-1 font-medium">Manage patient consent and data access permissions</p>
               </div>
               <div className="flex items-center gap-4">
                  <div className="group relative">
                     <Info size={20} className="text-slate-300 hover:text-[#2563EB] cursor-help" />
                     <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-slate-800 text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl leading-relaxed">
                        All consent management in Daira is HIPAA compliant. Data access is granular, auditable, and can be revoked at any time.
                     </div>
                  </div>
                  <button
                     onClick={onRequestNewConsent}
                     className="flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                  >
                     <Plus size={20} /> Request New Consent
                  </button>
               </div>
            </div>
         </div>

         {/* Compliance Banner */}
         <div className="w-full bg-[#EBF5FF] border-b border-blue-100">
            <div className="max-w-[1440px] mx-auto px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
               <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                     <ShieldCheck size={20} />
                  </div>
                  <p className="text-sm font-bold text-blue-800">
                     🔒 HIPAA Compliant Access Management
                     <span className="hidden md:inline font-medium text-blue-700/80 ml-2">All patient data access is encrypted, logged, and requires explicit consent.</span>
                  </p>
               </div>
               <button className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">View Privacy Policy</button>
            </div>
         </div>

         <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mt-10">
            <div className="flex flex-col xl:flex-row gap-8">

               {/* Left Column (35%) - Active Sessions */}
               <div className="w-full xl:w-[35%] space-y-6">
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <h2 className="text-xl font-black text-slate-900">Active Consent Sessions</h2>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Currently granted permissions</p>
                     </div>
                     <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">0 Active</span>
                  </div>

                  <div className="space-y-4">
                     <div className="space-y-4">
                        {/* Data removed as per request - Placeholder for real API integration */}
                        {[].length > 0 ? ([].map((sess: any, i) => (
                           <div key={i} className={`bg-white rounded-3xl p-6 border-2 transition-all group ${sess.active ? 'border-green-400/20 shadow-lg shadow-green-100/20' : 'border-slate-100 hover:border-blue-200'}`}>
                              {/* ... content ... */}
                           </div>
                        ))) : (
                           <div className="text-center py-10 bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
                              <ShieldCheck size={32} className="mx-auto text-slate-300 mb-3" />
                              <h3 className="text-sm font-bold text-slate-500">No Active Consent Sessions</h3>
                              <p className="text-xs text-slate-400 mt-1">Validated tokens will appear here</p>
                           </div>
                        )}
                     </div>
                  </div>
                  <button className="w-full py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors">View All Active Sessions</button>
               </div>

               {/* Center Column (40%) - Validation & Pending */}
               <div className="flex-1 space-y-8">
                  {/* Token Validation Removed - Redirected to Onboarding */}

                  {/* Pending Consent Requests */}
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                     <div className="p-8 border-b border-slate-100">
                        <div className="flex items-center justify-between mb-1">
                           <h2 className="text-xl font-black text-slate-900">Pending Requests</h2>
                           <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-100">0 Pending</span>
                        </div>
                        <p className="text-sm text-slate-400 font-medium">Parents requesting your clinical services</p>
                     </div>

                     <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                           <thead>
                              <tr className="bg-slate-50/50">
                                 <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</th>
                                 <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Requested</th>
                                 <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-50">
                              {/* Removed Mock Data */}
                              {[].length === 0 && (
                                 <tr>
                                    <td colSpan={3} className="px-8 py-8 text-center">
                                       <div className="flex flex-col items-center justify-center p-4">
                                          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                             <Info size={20} className="text-slate-300" />
                                          </div>
                                          <p className="text-sm font-bold text-slate-500">No Pending Requests</p>
                                          <p className="text-xs text-slate-400 mt-1">Requests from parents will appear here</p>
                                       </div>
                                    </td>
                                 </tr>
                              )}
                           </tbody>
                        </table>
                     </div>
                     <button className="w-full py-4 text-xs font-black text-slate-400 hover:text-[#2563EB] uppercase tracking-widest border-t border-slate-50">View All Requests</button>
                  </div>
               </div>

               {/* Right Column (25%) - Stats & Log */}
               <div className="w-full xl:w-[25%] space-y-8">
                  {/* Quick Stats */}
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                     <h2 className="text-lg font-black text-slate-900 mb-6">Consent Statistics</h2>
                     <div className="flex items-center justify-center mb-8 relative">
                        {/* Empty Pie Chart */}
                        <div className="w-32 h-32 rounded-full border-[10px] border-slate-100 relative">
                           <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-2xl font-black text-slate-300">0</span>
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active</span>
                           </div>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        {[
                           { label: 'New Requests', val: 0, color: 'bg-orange-500' },
                           { label: 'Approved', val: 0, color: 'bg-green-500' },
                           { label: 'Expired', val: 0, color: 'bg-slate-400' },
                           { label: 'Revoked', val: 0, color: 'bg-red-500' },
                        ].map((s, i) => (
                           <div key={i} className="space-y-0.5">
                              <div className="flex items-center gap-1.5">
                                 <div className={`w-1.5 h-1.5 rounded-full ${s.color}`} />
                                 <span className="text-[10px] font-bold text-slate-400 uppercase">{s.label}</span>
                              </div>
                              <p className="text-base font-black text-slate-800">{s.val}</p>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Active Access Tokens (Clinician generated for others) */}
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                     <div className="mb-6">
                        <h2 className="text-lg font-black text-slate-900">Active Access Tokens</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Generated for others</p>
                     </div>
                     <div className="space-y-6">
                        {/* Data Removed */}
                        <p className="text-xs text-slate-400 text-center py-4">No active tokens generated</p>
                     </div>
                     <button className="w-full mt-8 text-xs font-black text-[#2563EB] hover:underline uppercase tracking-widest">Manage All Tokens</button>
                  </div>

                  {/* Recent Activity Log */}
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                     <h2 className="text-lg font-black text-slate-900 mb-6">Recent Activity</h2>
                     <div className="space-y-6 relative">
                        {/* Data Removed */}
                        <p className="text-xs text-slate-400 text-center py-4">No recent activity</p>
                     </div>
                     <button className="w-full mt-8 text-xs font-black text-[#2563EB] hover:underline uppercase tracking-widest">View Full Audit Log</button>
                  </div>

                  {/* Compliance Notice */}
                  <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative">
                     <div className="absolute top-[-10%] right-[-5%] w-32 h-32 bg-white/5 rounded-full blur-3xl" />
                     <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="p-2 bg-white/10 rounded-xl text-green-400">
                           <Shield size={20} />
                        </div>
                        <h3 className="text-base font-black">Compliance Notice</h3>
                     </div>
                     <ul className="space-y-4 relative z-10">
                        {[
                           'All activity is logged & auditable',
                           'Auto access expiration enforced',
                           'Parent can revoke access anytime',
                           'HIPAA compliant data access'
                        ].map((item, i) => (
                           <li key={i} className="flex items-start gap-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
                              <CheckCircle2 size={12} className="text-green-500 shrink-0 mt-0.5" /> {item}
                           </li>
                        ))}
                     </ul>
                     <button className="w-full mt-8 py-3 bg-white/10 rounded-xl text-xs font-black hover:bg-white/20 transition-all uppercase tracking-widest">View Audit Trail</button>
                  </div>
               </div>
            </div>

            {/* Bottom Section - How it Works & FAQ */}
            <div className="mt-16 space-y-12">
               <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-10">
                  <div className="text-center mb-12">
                     <h2 className="text-3xl font-black text-slate-900 mb-2">How it works</h2>
                     <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Everything you need to know about Consent Management</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                     <div className="space-y-4">
                        {[
                           { q: 'How does consent management work?', a: 'Parents generate unique 8-character tokens through their parent portal. These tokens grant you specific access to their child\'s records for a defined period. All access is logged and can be revoked at any time.' },
                           { q: 'What access levels are available?', a: 'You can request Full Record, Assessment Only, or Results Only access depending on your clinical requirements.' },
                           { q: 'How long does consent last?', a: 'Typically 7, 30, or 90 days. You can also set a custom expiration date or request access until explicitly revoked.' },
                           { q: 'Can parents revoke access?', a: 'Yes, parents have full control and can terminate your access immediately through their dashboard.' },
                        ].map((faq, i) => (
                           <div key={i} className="border-b border-slate-50 last:border-0 pb-4">
                              <button
                                 onClick={() => setExpandedAccordion(expandedAccordion === i ? null : i)}
                                 className="w-full flex items-center justify-between py-4 text-left group"
                              >
                                 <span className={`text-base font-black transition-colors ${expandedAccordion === i ? 'text-[#2563EB]' : 'text-slate-700 group-hover:text-slate-900'}`}>{faq.q}</span>
                                 <ChevronDown size={20} className={`text-slate-300 transition-transform ${expandedAccordion === i ? 'rotate-180 text-[#2563EB]' : ''}`} />
                              </button>
                              {expandedAccordion === i && (
                                 <div className="pb-4 text-sm font-medium text-slate-500 leading-relaxed animate-in slide-in-from-top-2 duration-300">
                                    {faq.a}
                                 </div>
                              )}
                           </div>
                        ))}
                     </div>

                     <div className="bg-blue-50 rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-[#2563EB] shadow-xl shadow-blue-200/50">
                           <HelpCircle size={40} />
                        </div>
                        <div>
                           <h3 className="text-2xl font-black text-blue-900">Need more help?</h3>
                           <p className="text-blue-800/60 font-semibold mt-2">Our support team is ready to assist you with any questions about consent protocols.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                           <button className="flex-1 h-14 bg-[#2563EB] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">Contact Support</button>
                           <button className="flex-1 h-14 bg-white text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest border-2 border-blue-100 hover:bg-blue-50 transition-all">Consent FAQ</button>
                        </div>
                        <button className="text-[11px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2 hover:text-blue-600 transition-colors">
                           <FileText size={14} /> Download Clinical User Guide
                        </button>
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>
   );
};

export default ConsentCenter;
