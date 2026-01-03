
import React, { useState } from 'react';
import { 
  ArrowLeft, AlertTriangle, Clock, Activity, CheckCircle2, 
  Search, Filter, ChevronDown, MoreVertical, Calendar, 
  User, ShieldAlert, Layers, Phone, LayoutList, Check, 
  ArrowRight, MessageSquare, FileText, ChevronRight, Plus
} from 'lucide-react';

interface CaseTriageProps {
  onBack: () => void;
}

const CaseTriage: React.FC<CaseTriageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('Urgent');
  const [selectedCases, setSelectedCases] = useState<string[]>([]);
  const [showCaseModal, setShowCaseModal] = useState<string | null>(null);

  const stats = [
    { label: 'Avg Response Time', val: '2.5 hrs', trend: '↓ 30 min', icon: <Clock size={18} className="text-orange-500" />, color: 'bg-orange-50' },
    { label: 'SLA Risk Cases', val: '2', status: 'Action needed', icon: <AlertTriangle size={18} className="text-red-500" />, color: 'bg-red-50' },
    { label: 'Total Active Cases', val: '28', sub: '3 Critical • 5 High', icon: <Layers size={18} className="text-blue-500" />, color: 'bg-blue-50' },
    { label: 'Resolved This Week', val: '87%', trend: '↑ 5%', icon: <CheckCircle2 size={18} className="text-green-500" />, color: 'bg-green-50' }
  ];

  const urgentCases = [
    {
      id: 'c1',
      patient: 'Aarav Kumar',
      age: '7 years • Grade 2',
      idNum: '#DAI-8291',
      avatar: 'Rivera',
      tags: [{ l: 'ASD', c: 'bg-purple-100 text-purple-700' }, { l: 'Speech Delay', c: 'bg-blue-100 text-blue-700' }],
      issue: 'Regression Concerns',
      desc: 'Parent reports significant regression in communication skills over past 2 weeks. Child no longer using 3-word phrases, reverted to single words.',
      reporter: 'Mrs. Priya Kumar (Parent)',
      date: 'Oct 22, 2024',
      wait: '46 hours',
      sla: '2 hours until breach',
      riskTags: ['Regression', 'Communication Loss', 'Urgent'],
      action: 'Clinical Assessment',
      status: 'Unassigned',
      priority: 'CRITICAL',
      stars: 3
    },
    {
      id: 'c2',
      patient: 'Priya Sharma',
      age: '5 years • Pre-K',
      idNum: '#DAI-7453',
      avatar: 'Jane',
      tags: [{ l: 'Medical', c: 'bg-red-100 text-red-700' }],
      issue: 'Seizure Activity Reported',
      desc: 'Parent reports 2 episodes of staring spells with unresponsiveness, lasting 10-15 seconds each. Occurred during school hours.',
      reporter: 'School Nurse + Parent',
      date: 'Oct 23, 2024',
      wait: '28 hours',
      sla: '20 hours remaining',
      riskTags: ['Medical Emergency', 'Seizure'],
      status: 'Referral in progress',
      assignee: 'Dr. Patel (Neurologist)',
      priority: 'CRITICAL',
      stars: 3
    },
    {
      id: 'c3',
      patient: 'Arjun Patel',
      age: '4 years',
      idNum: '#DAI-9012',
      avatar: 'Felix',
      tags: [{ l: 'Behavioral', c: 'bg-orange-100 text-orange-700' }],
      issue: 'Aggressive Behavior at School',
      desc: 'Multiple incidents of hitting peers and teacher. Suspended from school pending behavioral assessment.',
      reporter: 'School Principal',
      date: 'Oct 23, 2024',
      wait: '18 hours',
      sla: '30 hours remaining',
      riskTags: ['Behavioral Crisis', 'Suspension'],
      status: 'Assessment scheduled',
      assignee: 'Mr. Kumar (BCBA)',
      priority: 'URGENT',
      stars: 2
    }
  ];

  const toggleSelect = (id: string) => {
    setSelectedCases(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] pb-20 animate-in fade-in duration-500 relative">
      {/* Demo Banner */}
      <div className="w-full bg-amber-50 border-b border-amber-100 py-2.5 px-6 flex items-center justify-center gap-3">
        <AlertTriangle size={16} className="text-amber-600" />
      </div>

      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-8">
            <div>
              <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                <button onClick={onBack} className="hover:text-[#2563EB]">Dashboard</button>
                <ChevronRight size={14} />
                <span className="text-slate-800">Case Triage</span>
              </nav>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Case Management & Triage</h1>
              <p className="text-slate-500 mt-1 font-medium">Prioritize and manage urgent patient cases</p>
            </div>
            <button className="px-6 py-3 border-2 border-slate-100 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest hover:border-slate-300 transition-all">
              View All Cases
            </button>
          </div>

          {/* Urgent Alert Banner */}
          <div className="mb-8 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-r-xl p-4 flex items-center justify-between shadow-sm">
             <div className="flex items-center gap-4">
                <div className="p-2 bg-red-100 text-red-600 rounded-lg animate-pulse">
                   <ShieldAlert size={24} />
                </div>
                <div>
                   <h3 className="text-sm font-black text-red-900 uppercase tracking-wide">3 Cases Require Urgent Attention</h3>
                   <p className="text-xs font-bold text-red-700/70 mt-0.5">SLA breach risk identified for 1 case</p>
                </div>
             </div>
             <button className="px-6 py-2 bg-white text-red-600 rounded-lg text-xs font-black uppercase tracking-widest shadow-sm hover:bg-red-50 transition-all">Review Now →</button>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
             {[
               { id: 'Urgent', count: 3, c: 'bg-red-500 text-white', i: 'bg-red-600' },
               { id: 'High Priority', count: 5, c: 'bg-orange-500 text-white', i: 'bg-orange-600' },
               { id: 'Standard', count: 12, c: 'bg-blue-500 text-white', i: 'bg-blue-600' },
               { id: 'Follow-up', count: 8, c: 'bg-slate-500 text-white', i: 'bg-slate-600' }
             ].map(tab => (
               <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
                   activeTab === tab.id ? tab.c : 'bg-white border-2 border-slate-100 text-slate-400 hover:border-slate-200'
                 }`}
               >
                  {tab.id}
                  <span className={`px-2 py-0.5 rounded text-[10px] ${activeTab === tab.id ? tab.i : 'bg-slate-100 text-slate-500'}`}>
                     {tab.count}
                  </span>
               </button>
             ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mt-8">
         {/* Stats Row */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((s, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
                 <div className={`p-3 rounded-xl ${s.color}`}>{s.icon}</div>
                 <div>
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight">{s.val}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                    {s.trend && <p className={`text-[10px] font-bold mt-1 ${s.trend.includes('↓') ? 'text-green-600' : 'text-green-600'}`}>{s.trend}</p>}
                    {s.status && <p className="text-[10px] font-bold text-red-500 mt-1">{s.status}</p>}
                    {s.sub && <p className="text-[10px] font-bold text-slate-400 mt-1">{s.sub}</p>}
                 </div>
              </div>
            ))}
         </div>

         <div className="flex flex-col xl:flex-row gap-8">
            {/* Main Queue */}
            <div className="flex-1 space-y-8">
               {/* Urgent Section Header */}
               <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
                  <h2 className="text-lg font-black text-red-600 uppercase tracking-widest">⚠️ Urgent Cases (3)</h2>
                  <span className="text-xs font-bold text-slate-400">Require immediate attention</span>
               </div>

               {/* Case Cards */}
               <div className="space-y-6">
                  {urgentCases.map((c) => (
                    <div key={c.id} className={`bg-white rounded-[2rem] shadow-sm overflow-hidden group relative transition-all hover:shadow-xl ${selectedCases.includes(c.id) ? 'ring-2 ring-blue-500' : ''}`}>
                       {/* Left Border */}
                       <div className={`absolute left-0 top-0 bottom-0 w-2 ${c.priority === 'CRITICAL' ? 'bg-red-500' : 'bg-orange-500'}`} />
                       
                       {/* Warning Banner */}
                       {c.priority === 'CRITICAL' && (
                         <div className="bg-red-50 px-6 py-2 flex items-center gap-2 border-b border-red-100 ml-2">
                            <AlertTriangle size={14} className="text-red-600" />
                            <p className="text-[10px] font-black text-red-700 uppercase tracking-widest">
                               {c.sla.includes('breach') ? '⚠️ SLA BREACH RISK' : '⚠️ MEDICAL CONCERN'} - {c.wait} waiting
                            </p>
                         </div>
                       )}
                       {c.priority === 'URGENT' && (
                         <div className="bg-orange-50 px-6 py-2 flex items-center gap-2 border-b border-orange-100 ml-2">
                            <AlertTriangle size={14} className="text-orange-600" />
                            <p className="text-[10px] font-black text-orange-700 uppercase tracking-widest">
                               ⚠️ URGENT - {c.wait} waiting
                            </p>
                         </div>
                       )}

                       <div className="p-6 ml-2">
                          {/* Header Row */}
                          <div className="flex justify-between items-start mb-6">
                             <div className="flex items-center gap-4">
                                <input 
                                  type="checkbox" 
                                  checked={selectedCases.includes(c.id)}
                                  onChange={() => toggleSelect(c.id)}
                                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                                />
                                <div className="relative">
                                   <div className="w-14 h-14 rounded-2xl border-2 border-slate-100 overflow-hidden">
                                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.avatar}`} alt={c.patient} className="w-full h-full object-cover" />
                                   </div>
                                   {c.priority === 'CRITICAL' && <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />}
                                </div>
                                <div>
                                   <h3 className="text-xl font-black text-slate-900">{c.patient}</h3>
                                   <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                                      <span>{c.age}</span>
                                      <span className="text-slate-300">|</span>
                                      <span className="font-mono">{c.idNum}</span>
                                   </div>
                                   <div className="flex gap-2 mt-2">
                                      {c.tags.map((t, i) => (
                                        <span key={i} className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${t.c}`}>{t.l}</span>
                                      ))}
                                   </div>
                                </div>
                             </div>
                             <div className="text-right">
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${c.priority === 'CRITICAL' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                                   {c.priority}
                                </span>
                                <div className="flex justify-end gap-0.5 mt-2">
                                   {[...Array(3)].map((_, i) => <span key={i} className={`text-xs ${i < c.stars ? (c.priority === 'CRITICAL' ? 'text-red-500' : 'text-orange-500') : 'text-slate-200'}`}>★</span>)}
                                </div>
                             </div>
                          </div>

                          {/* Case Details */}
                          <div className="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-100">
                             <h4 className="text-sm font-black text-slate-800 mb-1">{c.issue}</h4>
                             <p className="text-xs font-medium text-slate-600 leading-relaxed mb-4">{c.desc}</p>
                             <div className="flex items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <span>Reported by: <span className="text-slate-700">{c.reporter}</span></span>
                                <span>Date: <span className="text-slate-700">{c.date}</span></span>
                             </div>
                          </div>

                          {/* Stats & Actions */}
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                             <div className="flex items-center gap-6 w-full sm:w-auto">
                                <div className="space-y-1">
                                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Wait Time</p>
                                   <p className={`text-lg font-black ${c.priority === 'CRITICAL' ? 'text-red-600' : 'text-orange-600'}`}>{c.wait}</p>
                                </div>
                                <div className="space-y-1">
                                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SLA Status</p>
                                   <p className={`text-xs font-bold ${c.sla.includes('breach') ? 'text-red-500 animate-pulse' : 'text-slate-600'}`}>{c.sla}</p>
                                </div>
                             </div>

                             {/* Assignment */}
                             <div className="flex items-center gap-3 w-full sm:w-auto bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">?</div>
                                <div className="flex-1">
                                   <p className="text-[9px] font-bold text-slate-400 uppercase">Assignment</p>
                                   <p className={`text-xs font-bold ${c.status === 'Unassigned' ? 'text-red-500' : 'text-slate-700'}`}>{c.assignee || c.status}</p>
                                </div>
                                <ChevronDown size={14} className="text-slate-400" />
                             </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-slate-50">
                             <button className={`h-10 px-6 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg transition-all ${c.priority === 'CRITICAL' ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-100' : 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-100'}`}>
                                {c.priority === 'CRITICAL' ? 'Take Case' : 'View Case'}
                             </button>
                             <button className="h-10 px-4 border-2 border-slate-100 rounded-xl text-xs font-black text-slate-500 hover:border-slate-300 hover:text-slate-700 uppercase tracking-widest transition-all">
                                Contact Parent
                             </button>
                             <button className="h-10 px-4 border-2 border-slate-100 rounded-xl text-xs font-black text-slate-500 hover:border-slate-300 hover:text-slate-700 uppercase tracking-widest transition-all">
                                Schedule Assessment
                             </button>
                             <button className="ml-auto text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                                View Full History <ArrowRight size={12} />
                             </button>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>

               {/* Section Divider */}
               <div className="pt-8">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="text-sm font-black text-orange-600 uppercase tracking-widest">High Priority (5)</h3>
                     <button className="text-xs font-bold text-slate-400 hover:text-slate-600">Collapse</button>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between hover:shadow-md transition-all cursor-pointer group">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-bold">MS</div>
                        <div>
                           <h4 className="font-bold text-slate-900 group-hover:text-blue-600">Maya Singh - IEP Review</h4>
                           <p className="text-xs text-slate-500">Deadline approaching in 5 days</p>
                        </div>
                     </div>
                     <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-[10px] font-black uppercase tracking-widest">4 days wait</span>
                  </div>
               </div>
            </div>

            {/* Right Sidebar */}
            <aside className="w-full xl:w-[320px] shrink-0 space-y-8 sticky top-28 h-fit">
               {/* Bulk Actions */}
               {selectedCases.length > 0 && (
                 <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl animate-in slide-in-from-right duration-300">
                    <div className="flex justify-between items-center mb-4">
                       <span className="font-black uppercase tracking-widest text-xs">{selectedCases.length} Selected</span>
                       <button onClick={() => setSelectedCases([])} className="text-slate-400 hover:text-white"><X size={14} /></button>
                    </div>
                    <div className="space-y-2">
                       <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all text-left px-4">Assign to Me</button>
                       <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all text-left px-4">Mark as Reviewed</button>
                       <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all text-left px-4">Export Selected</button>
                    </div>
                 </div>
               )}

               <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Wait Time Analysis</h3>
                  <div className="space-y-4">
                     {[
                       { l: 'Critical', val: 32, max: 48, c: 'bg-red-500' },
                       { l: 'High', val: 60, max: 72, c: 'bg-orange-500' },
                       { l: 'Standard', val: 45, max: 100, c: 'bg-blue-500' }
                     ].map((b, i) => (
                       <div key={i} className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase">
                             <span>{b.l}</span>
                             <span>{b.val} hours avg</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                             <div className={`h-full ${b.c}`} style={{ width: `${(b.val/b.max)*100}%` }} />
                          </div>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Upcoming Deadlines</h3>
                  <div className="space-y-4">
                     {[
                       { d: 'Oct 26', t: 'Arjun Assessment', c: 'text-orange-600' },
                       { d: 'Oct 29', t: 'Maya IEP Review', c: 'text-blue-600' },
                       { d: 'Oct 30', t: 'Aarav Progress Check', c: 'text-green-600' }
                     ].map((item, i) => (
                       <div key={i} className="flex items-start gap-3 pb-3 border-b border-slate-50 last:border-0">
                          <div className="p-2 bg-slate-50 rounded-lg text-[10px] font-black text-slate-500 uppercase text-center w-12 shrink-0">
                             {item.d.split(' ')[0]} <span className="block text-sm text-slate-900">{item.d.split(' ')[1]}</span>
                          </div>
                          <div>
                             <p className="text-xs font-bold text-slate-800">{item.t}</p>
                             <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${item.c}`}>Due Soon</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Quick Actions</h3>
                  {[
                    { l: 'Create New Case', i: <Plus size={16} /> },
                    { l: 'View Closed Cases', i: <CheckCircle2 size={16} /> },
                    { l: 'Export Triage Report', i: <FileText size={16} /> }
                  ].map((a, i) => (
                    <button key={i} className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all text-left group">
                       <span className="text-xs font-bold text-slate-600 group-hover:text-blue-600">{a.l}</span>
                       <span className="text-slate-300 group-hover:text-blue-500">{a.i}</span>
                    </button>
                  ))}
               </div>
            </aside>
         </div>
      </div>
    </div>
  );
};

// Helper for X icon missing in some imports
const X = ({ size, className, onClick }: { size: number, className?: string, onClick?: () => void }) => (
  <svg 
    onClick={onClick}
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
    style={{ cursor: onClick ? 'pointer' : 'default' }}
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default CaseTriage;
