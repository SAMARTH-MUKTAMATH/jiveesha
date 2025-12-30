
import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, Info, ChevronRight, CheckCircle2, XCircle, 
  Clock, Key, Bell, Shield, ArrowRight, User, 
  Database, FileText, ChevronDown, HelpCircle, 
  Plus, MoreVertical, ExternalLink, Activity
} from 'lucide-react';

interface ConsentCenterProps {
  onBack: () => void;
}

const ConsentCenter: React.FC<ConsentCenterProps> = ({ onBack }) => {
  const [token, setToken] = useState(['', '', '', '', '', '', '', '']);
  const [tokenStatus, setTokenStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [expandedAccordion, setExpandedAccordion] = useState<number | null>(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleTokenChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newToken = [...token];
    newToken[index] = value.toUpperCase();
    setToken(newToken);

    if (value && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !token[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const validateToken = () => {
    const fullToken = token.join('');
    if (fullToken === 'ABCDEFGH') {
      setTokenStatus('success');
    } else {
      setTokenStatus('error');
    }
  };

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
            <button className="flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
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
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">5 Active</span>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Aarav Kumar', age: '7 yrs', id: '#DAI-8291', by: 'Mrs. Priya Kumar (Mother)', access: 'FULL RECORD', accessColor: 'bg-green-100 text-green-700', expiry: '2h 15m', ring: 'orange', prog: 15, data: ['Assessment results', 'Clinical notes', 'IEP documents', 'Media files'], active: true },
                { name: 'Priya Sharma', age: '5 yrs', id: '#DAI-7453', by: 'Mr. Vikram Sharma (Father)', access: 'ASSESSMENT ONLY', accessColor: 'bg-blue-100 text-blue-700', expiry: '48h 30m', ring: 'green', prog: 95, data: ['Current assessment'], partial: true },
                { name: 'Arjun Patel', age: '4 yrs', id: '#DAI-9012', by: 'Mrs. Neha Patel (Mother)', access: 'RESULTS ONLY', accessColor: 'bg-amber-100 text-amber-700', expiry: '6h 45m', ring: 'yellow', prog: 50, data: ['Screening results'], partial: true },
              ].map((sess, i) => (
                <div key={i} className={`bg-white rounded-3xl p-6 border-2 transition-all group ${sess.active ? 'border-green-400/20 shadow-lg shadow-green-100/20' : 'border-slate-100 hover:border-blue-200'}`}>
                   <div className="flex justify-between items-start mb-6">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${sess.name}`} alt={sess.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900">{sess.name}, {sess.age}</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sess.id}</p>
                        </div>
                     </div>
                     <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${sess.accessColor}`}>{sess.access}</span>
                   </div>

                   <div className="bg-slate-50/50 rounded-2xl p-4 mb-6">
                      <div className="flex items-center justify-between mb-4">
                         <div className="space-y-0.5">
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Access expires in</p>
                            <p className={`text-xl font-black ${sess.ring === 'orange' ? 'text-orange-600' : sess.ring === 'green' ? 'text-green-600' : 'text-amber-600'}`}>{sess.expiry}</p>
                         </div>
                         <div className="relative w-12 h-12">
                            <svg className="w-full h-full transform -rotate-90">
                               <circle cx="24" cy="24" r="20" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-slate-200" />
                               <circle cx="24" cy="24" r="20" fill="transparent" stroke="currentColor" strokeWidth="4" strokeDasharray="125.6" strokeDashoffset={125.6 - (125.6 * sess.prog / 100)} className={sess.ring === 'orange' ? 'text-orange-500' : sess.ring === 'green' ? 'text-green-500' : 'text-amber-500'} />
                            </svg>
                         </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">Shared Data</p>
                        <div className="grid grid-cols-1 gap-1.5 pt-1">
                          {sess.data.map((d, di) => (
                            <div key={di} className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                               <CheckCircle2 size={12} className="text-green-500" /> {d}
                            </div>
                          ))}
                          {sess.partial && (
                             <p className="text-[10px] font-medium text-slate-400 italic mt-1">+ Clinical history restricted</p>
                          )}
                        </div>
                      </div>
                   </div>

                   <div className="flex flex-col gap-3">
                      <button className="w-full py-2.5 border-2 border-slate-100 rounded-xl text-xs font-black text-slate-600 uppercase tracking-widest hover:border-blue-200 hover:text-[#2563EB] transition-all">Extend Access</button>
                      <div className="flex items-center justify-between px-2">
                         <button className="text-[10px] font-bold text-[#2563EB] hover:underline uppercase tracking-widest">Activity Log</button>
                         <button className="text-[10px] font-bold text-red-500 hover:underline uppercase tracking-widest">Revoke Access</button>
                      </div>
                   </div>
                </div>
              ))}
            </div>
            <button className="w-full py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors">View All Active Sessions</button>
          </div>

          {/* Center Column (40%) - Validation & Pending */}
          <div className="flex-1 space-y-8">
            {/* Token Validation */}
            <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm p-8">
               <h2 className="text-xl font-black text-slate-900 mb-2">Validate Consent Token</h2>
               <p className="text-sm text-slate-400 font-medium mb-8">Enter the 8-character token provided by the parent/guardian</p>
               
               <div className="flex items-center justify-center gap-2 mb-8">
                  {token.map((char, i) => (
                    <React.Fragment key={i}>
                      <input
                        ref={el => inputRefs.current[i] = el}
                        type="text"
                        maxLength={1}
                        value={char}
                        onChange={(e) => handleTokenChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        className="w-10 h-12 sm:w-12 sm:h-14 bg-slate-50 border-2 border-slate-200 rounded-xl text-center text-xl font-black text-[#2563EB] focus:border-[#2563EB] focus:ring-0 outline-none transition-all"
                      />
                      {i === 3 && <div className="w-4 h-0.5 bg-slate-300 rounded-full" />}
                    </React.Fragment>
                  ))}
               </div>

               {tokenStatus === 'idle' && (
                 <button 
                   onClick={validateToken}
                   className="w-full h-14 bg-[#2563EB] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
                 >
                   Validate Token
                 </button>
               )}

               {tokenStatus === 'success' && (
                 <div className="space-y-6 animate-in zoom-in-95 duration-300">
                    <div className="bg-green-50 border border-green-200 p-6 rounded-2xl flex flex-col items-center text-center gap-3">
                       <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle2 size={24} />
                       </div>
                       <div>
                          <h4 className="text-lg font-black text-green-900">Token Validated Successfully</h4>
                          <p className="text-xs text-green-700 font-bold uppercase tracking-widest mt-1">Ready to grant access</p>
                       </div>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
                       <div className="grid grid-cols-2 gap-4 text-center sm:text-left">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Patient</p>
                            <p className="text-sm font-black text-slate-800">Maya Singh, 6 yrs</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Parent</p>
                            <p className="text-sm font-black text-slate-800">Mrs. Anjali Singh</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Access Level</p>
                            <p className="text-sm font-black text-blue-600">Full Record Access</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Valid For</p>
                            <p className="text-sm font-black text-slate-800">7 Days</p>
                          </div>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <button className="flex-1 h-12 bg-green-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-100">Accept & Grant Access</button>
                       <button onClick={() => setTokenStatus('idle')} className="px-6 h-12 border-2 border-slate-100 rounded-xl text-xs font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest">Decline</button>
                    </div>
                 </div>
               )}

               {tokenStatus === 'error' && (
                 <div className="animate-in shake duration-300">
                    <div className="bg-red-50 border border-red-200 p-6 rounded-2xl flex flex-col items-center text-center gap-3">
                       <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg">
                          <XCircle size={24} />
                       </div>
                       <div>
                          <h4 className="text-lg font-black text-red-900">Invalid Token</h4>
                          <p className="text-sm text-red-600 font-medium leading-relaxed mt-1">This token is invalid, expired, or has already been used. Please ask the parent to generate a new token.</p>
                       </div>
                       <div className="flex gap-4 mt-4 w-full">
                          <button onClick={() => setTokenStatus('idle')} className="flex-1 py-3 bg-white border border-red-100 text-red-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-50">Try Another</button>
                          <button className="flex-1 py-3 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700">Contact Support</button>
                       </div>
                    </div>
                 </div>
               )}

               <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-center">
                  <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#2563EB] transition-colors">
                     <HelpCircle size={16} /> How to get a consent token?
                  </button>
               </div>
            </div>

            {/* Pending Consent Requests */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-xl font-black text-slate-900">Pending Requests</h2>
                    <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-100">3 Pending</span>
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
                     {[
                       { name: 'Rohan Desai', age: '8 yrs', id: '#DAI-5438', parent: 'Mrs. Kavita Desai', access: 'Full Record', reason: 'Initial diagnosis', time: '2 hours ago', recent: true },
                       { name: 'Sanya Gupta', age: '3 yrs', id: '#DAI-1234', parent: 'Mr. Anil Gupta', access: 'Assessment Only', reason: 'Second opinion', time: '1 day ago' },
                       { name: 'Ishaan Reddy', age: '5 yrs', id: '#DAI-5678', parent: 'Mrs. Priya Reddy', access: 'Results Only', reason: 'ADHD screening', time: '3 days ago' },
                     ].map((req, i) => (
                       <tr key={i} className={`hover:bg-slate-50/50 transition-colors group ${req.recent ? 'bg-blue-50/30' : ''}`}>
                          <td className="px-8 py-5">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">RD</div>
                                <div>
                                   <div className="text-sm font-black text-slate-800">{req.name}, {req.age}</div>
                                   <div className="text-[10px] font-bold text-slate-400 uppercase">{req.parent}</div>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-5">
                             <div className="text-sm font-bold text-slate-600">{req.access}</div>
                             <div className="text-[10px] text-slate-400 font-medium">Reason: {req.reason}</div>
                          </td>
                          <td className="px-8 py-5 text-right">
                             <div className="flex items-center justify-end gap-2">
                                <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm shadow-green-100">
                                   <CheckCircle2 size={16} />
                                </button>
                                <button className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm shadow-red-100">
                                   <XCircle size={16} />
                                </button>
                                <button className="text-[10px] font-bold text-[#2563EB] hover:underline uppercase tracking-widest ml-2">Details</button>
                             </div>
                          </td>
                       </tr>
                     ))}
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
                  {/* Mock Pie Chart */}
                  <div className="w-32 h-32 rounded-full border-[10px] border-slate-100 relative">
                     <div className="absolute inset-[-10px] rounded-full border-[10px] border-blue-500" style={{ clipPath: 'polygon(50% 50%, 50% 0, 100% 0, 100% 80%, 50% 50%)' }} />
                     <div className="absolute inset-[-10px] rounded-full border-[10px] border-orange-500" style={{ clipPath: 'polygon(50% 50%, 50% 0, 0 0, 0 30%, 50% 50%)' }} />
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-slate-900">12</span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active</span>
                     </div>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'New Requests', val: 8, color: 'bg-orange-500' },
                    { label: 'Approved', val: 6, color: 'bg-green-500' },
                    { label: 'Expired', val: 3, color: 'bg-slate-400' },
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
                  {[
                    { code: 'XYZW-1234', for: 'Dr. Sarah Mehta', sub: 'Speech Therapist', patient: 'Aarav Kumar', expiry: '2 days', prog: 70, color: 'bg-amber-500' },
                    { code: 'PQRS-5678', for: 'Mrs. Meena Sharma', sub: 'Teacher', patient: 'Priya Sharma', expiry: '15 days', prog: 30, color: 'bg-green-500' },
                  ].map((tk, i) => (
                    <div key={i} className="space-y-3">
                       <div className="flex justify-between items-start">
                          <div>
                             <span className="font-mono text-sm font-black text-slate-900 bg-slate-50 px-2 py-1 rounded border border-slate-100">{tk.code}</span>
                             <div className="mt-2">
                                <p className="text-xs font-black text-slate-800">{tk.for}</p>
                                <p className="text-[10px] text-slate-400 font-medium">{tk.sub}</p>
                             </div>
                          </div>
                          <button className="p-1.5 text-slate-300 hover:text-slate-600"><MoreVertical size={16} /></button>
                       </div>
                       <div className="space-y-1">
                          <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                             <span>Expires in {tk.expiry}</span>
                             <span>{100 - tk.prog}%</span>
                          </div>
                          <div className="h-1 w-full bg-slate-50 rounded-full">
                             <div className={`h-full ${tk.color} rounded-full`} style={{ width: `${100 - tk.prog}%` }} />
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-8 text-xs font-black text-[#2563EB] hover:underline uppercase tracking-widest">Manage All Tokens</button>
            </div>

            {/* Recent Activity Log */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
               <h2 className="text-lg font-black text-slate-900 mb-6">Recent Activity</h2>
               <div className="space-y-6 relative">
                  <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-50" />
                  {[
                    { icon: <CheckCircle2 size={12} />, color: 'bg-green-500', time: '2 hours ago', event: 'Access granted', desc: 'Aarav Kumar record shared' },
                    { icon: <Key size={12} />, color: 'bg-blue-500', time: '5 hours ago', event: 'Token validated', desc: 'Parent token for Priya S.' },
                    { icon: <Clock size={12} />, color: 'bg-slate-400', time: 'Yesterday', event: 'Access expired', desc: 'Consent for Arjun P. expired' },
                    { icon: <Bell size={12} />, color: 'bg-orange-500', time: '3 days ago', event: 'New request', desc: 'Mrs. Desai for Rohan D.' },
                  ].map((act, i) => (
                    <div key={i} className="flex gap-4 relative z-10">
                       <div className={`w-4 h-4 rounded-full ${act.color} text-white flex items-center justify-center shrink-0 ring-4 ring-white`}>
                          {act.icon}
                       </div>
                       <div className="flex-1 space-y-0.5">
                          <div className="flex justify-between items-center">
                             <p className="text-xs font-black text-slate-800">{act.event}</p>
                             <span className="text-[9px] font-black text-slate-400 uppercase">{act.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-tight">{act.desc}</p>
                       </div>
                    </div>
                  ))}
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
