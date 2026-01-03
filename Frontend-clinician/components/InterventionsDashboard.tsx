
import React, { useState } from 'react';
import { 
  Plus, MessageSquare, HandIcon, Brain, Book, 
  Clock, CheckCircle2, AlertTriangle, Calendar,
  MoreVertical, FileText, ChevronRight, LayoutList,
  Target, TrendingUp, Sparkles, UserPlus, FileCheck
} from 'lucide-react';

interface InterventionsDashboardProps {
  onStartIEP: () => void;
  onViewPlan: (id: string) => void;
  onViewReports?: () => void;
}

const InterventionsDashboard: React.FC<InterventionsDashboardProps> = ({ onStartIEP, onViewPlan, onViewReports }) => {
  const [activeFilter, setActiveFilter] = useState('All (12)');

  const interventions = [
    {
      id: 'aarav',
      name: 'Aarav Kumar',
      age: '7 years • Grade 2',
      idNum: '#DAI-8291',
      tags: [
        { label: 'ASD', color: 'bg-purple-50 text-purple-600 border-purple-100' },
        { label: 'Speech Delay', color: 'bg-blue-50 text-blue-600 border-blue-100' }
      ],
      therapyType: 'Speech & Language Therapy',
      protocol: 'PECS Protocol',
      icon: <MessageSquare className="text-blue-600" size={24} />,
      iconBg: 'bg-blue-50',
      provider: 'Dr. Sarah Mehta, SLP',
      providerImg: 'Sarah',
      status: 'Active',
      statusColor: 'bg-green-500',
      alert: '⚠ 2 sessions missed',
      progress: 68,
      goalsMet: '15 of 22',
      lastSession: 'Oct 10',
      nextSession: 'Oct 28',
      nextColor: 'text-blue-600'
    },
    {
      id: 'priya',
      name: 'Priya Sharma',
      age: '5 years • Pre-K',
      idNum: '#DAI-7453',
      tags: [
        { label: 'Fine Motor Delay', color: 'bg-orange-50 text-orange-600 border-orange-100' }
      ],
      therapyType: 'Occupational Therapy',
      protocol: 'Sensory Integration',
      icon: <HandIcon className="text-green-600" size={24} />,
      iconBg: 'bg-green-50',
      provider: 'Ms. Rita Gupta, OT',
      providerImg: 'Rita',
      status: 'Active',
      statusColor: 'bg-green-500',
      progress: 55,
      goalsMet: '8 of 14',
      lastSession: 'Oct 20',
      nextSession: 'Oct 27',
      nextColor: 'text-blue-600'
    },
    {
      id: 'arjun',
      name: 'Arjun Patel',
      age: '4 years • Nursery',
      idNum: '#DAI-9012',
      tags: [
        { label: 'ADHD', color: 'bg-orange-50 text-orange-600 border-orange-100' }
      ],
      therapyType: 'ABA Therapy',
      protocol: 'Discrete Trial Training',
      icon: <Brain className="text-purple-600" size={24} />,
      iconBg: 'bg-purple-50',
      provider: 'Mr. Anil Kumar, BCBA',
      providerImg: 'Anil',
      status: 'Active',
      statusColor: 'bg-green-500',
      excellent: true,
      progress: 85,
      goalsMet: '18 of 20',
      lastSession: 'Oct 23',
      nextSession: 'Today',
      nextColor: 'text-green-600'
    },
    {
      id: 'maya',
      name: 'Maya Singh',
      age: '6 years • Grade 1',
      idNum: '#DAI-6721',
      tags: [
        { label: 'SLD', color: 'bg-teal-50 text-teal-600 border-teal-100' }
      ],
      therapyType: 'Reading Intervention',
      protocol: 'Orton-Gillingham',
      icon: <Book className="text-slate-600" size={24} />,
      iconBg: 'bg-slate-50',
      status: 'Paused',
      statusColor: 'bg-slate-300',
      reason: 'Parent request - Family vacation',
      resumeDate: 'Resuming Nov 1, 2024',
      progress: 45,
      goalsMet: '10 of 22',
      isPaused: true
    }
  ];

  return (
    <div className="w-full animate-in fade-in duration-500 pb-20 relative">
      {/* Demo Banner */}
      <div className="w-full bg-amber-50 border-b border-amber-100 py-2.5 px-6 lg:px-12 flex items-center justify-center gap-3">
        <AlertTriangle size={16} className="text-amber-600" />
      </div>

      {/* Page Header */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-12 pb-10">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Interventions & Therapy</h1>
          <p className="text-lg font-medium text-slate-500 max-w-2xl">Manage therapy plans, document clinical sessions, and track patient progress in real-time.</p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Filter Pills */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-[2rem]">
            {['All (12)', 'Active (8)', 'Paused (2)', 'Needs Attention (2)'].map(f => (
              <button 
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeFilter === f ? 'bg-[#2563EB] text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button className="h-14 px-8 bg-[#2563EB] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-3">
            <Plus size={20} strokeWidth={3} /> New Intervention Plan
          </button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-10">
        
        {/* Main Content Grid */}
        <div className="flex-1 space-y-10">
          
          {/* Missed Sessions Alert */}
          <div className="bg-white rounded-2xl border border-orange-100 border-l-[6px] border-l-orange-500 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
             <div className="flex items-center gap-5">
               <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
                 <AlertTriangle size={24} />
               </div>
               <div>
                  <h4 className="font-black text-slate-900 uppercase text-xs tracking-tight">Attention Required</h4>
                  <p className="text-sm font-semibold text-slate-600">Aarav K. - Speech therapy: 2 sessions missed. Parent notification sent.</p>
               </div>
             </div>
             <div className="flex items-center gap-4">
                <button onClick={() => onViewPlan('aarav')} className="text-xs font-black text-[#2563EB] uppercase tracking-widest hover:underline">View Details</button>
                <button className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600">Dismiss</button>
             </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {interventions.map((item) => (
              <div key={item.id} className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6">
                   <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                      <MoreVertical size={20} />
                   </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                   <div className="relative">
                      <div className="w-20 h-20 rounded-3xl border-4 border-slate-50 shadow-lg overflow-hidden">
                         <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.id}`} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white ${item.statusColor}`} />
                   </div>
                   <div className="text-center sm:text-left space-y-1.5">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">{item.name}</h3>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.age}</span>
                         <span className="text-slate-200">|</span>
                         <span className="text-[10px] font-bold text-slate-300 font-mono tracking-wider">{item.idNum}</span>
                      </div>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
                         {item.tags.map((t, ti) => (
                           <span key={ti} className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${t.color}`}>
                             {t.label}
                           </span>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100/50 mb-8 space-y-6">
                   <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${item.iconBg}`}>
                         {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                         <h4 className="text-base font-black text-slate-800 uppercase tracking-tight truncate">{item.therapyType}</h4>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{item.protocol}</p>
                      </div>
                      {item.status === 'Paused' ? (
                         <span className="px-3 py-1 bg-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Paused</span>
                      ) : (
                         <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-100">Active</span>
                      )}
                   </div>

                   {item.provider && (
                     <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 overflow-hidden">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.providerImg}`} alt={item.provider} className="w-full h-full object-cover" />
                           </div>
                           <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">{item.provider}</p>
                        </div>
                        {item.alert && <span className="text-[9px] font-black text-orange-600 uppercase bg-orange-50 px-2 py-1 rounded border border-orange-100">{item.alert}</span>}
                        {item.excellent && <span className="text-[9px] font-black text-green-600 uppercase bg-green-50 px-2 py-1 rounded border border-green-100 flex items-center gap-1"><Sparkles size={10} /> Excellent Progress</span>}
                     </div>
                   )}
                </div>

                <div className="space-y-3 mb-10">
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <span className="text-slate-400">Mastery Progress</span>
                      <span className="text-slate-900">{item.progress}%</span>
                   </div>
                   <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-1000 ${item.progress > 80 ? 'bg-green-500' : item.progress > 60 ? 'bg-[#2563EB]' : 'bg-orange-400'}`} style={{ width: `${item.progress}%` }} />
                   </div>
                   <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      <span>{item.goalsMet} goals achieved</span>
                      {item.isPaused && <span className="text-slate-500 italic">Plan currently on hold</span>}
                   </div>
                </div>

                {item.status === 'Paused' ? (
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-8 space-y-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pause Reason</p>
                      <p className="text-xs font-bold text-slate-600">{item.reason}</p>
                      <div className="flex items-center gap-2 text-blue-600 text-[10px] font-black uppercase pt-1">
                         <Calendar size={12} /> {item.resumeDate}
                      </div>
                   </div>
                ) : (
                   <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Session</p>
                         <p className="text-sm font-black text-slate-800">{item.lastSession}</p>
                      </div>
                      <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                         <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Next Session</p>
                         <p className={`text-sm font-black ${item.nextColor}`}>{item.nextSession}</p>
                      </div>
                   </div>
                )}

                <div className="grid grid-cols-3 gap-3">
                   <button className={`col-span-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 border-slate-100 hover:border-blue-200 hover:text-blue-600 transition-all flex items-center justify-center gap-2 ${item.isPaused ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 col-span-3 h-14' : 'text-slate-500'}`}>
                      {item.isPaused ? 'Resume Intervention Plan' : <><Clock size={16} /> Schedule</>}
                   </button>
                   {!item.isPaused && (
                     <>
                        <button className="h-12 border-2 border-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:border-blue-200 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                           <FileText size={16} /> Log Note
                        </button>
                        <button onClick={() => onViewPlan(item.id)} className="h-12 bg-blue-50 text-[#2563EB] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                           View Details
                        </button>
                     </>
                   )}
                </div>
              </div>
            ))}

            {/* Creation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <button 
                 onClick={onStartIEP}
                 className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 p-10 flex flex-col items-center text-center gap-4 hover:border-[#2563EB] hover:bg-blue-50/30 group transition-all"
               >
                  <div className="w-20 h-20 rounded-[2rem] bg-blue-50 text-[#2563EB] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                     <Target size={40} />
                  </div>
                  <div>
                     <h3 className="text-xl font-black text-slate-800 group-hover:text-blue-600 transition-colors">Start IEP Builder</h3>
                     <p className="text-sm font-semibold text-slate-400 mt-2 px-6">Build a comprehensive Individualized Education Program with evidence-based goals.</p>
                  </div>
                  <div className="mt-4 px-6 py-2.5 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:border-blue-200 group-hover:text-blue-600 transition-all">Start Builder →</div>
               </button>

               <button className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 p-10 flex flex-col items-center text-center gap-4 hover:border-[#2563EB] hover:bg-blue-50/30 group transition-all">
                  <div className="w-20 h-20 rounded-[2rem] bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                     <HandIcon size={40} />
                  </div>
                  <div>
                     <h3 className="text-xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors">Add Intervention</h3>
                     <p className="text-sm font-semibold text-slate-400 mt-2 px-6">Begin a new clinical therapy plan, assign providers, and define master goals.</p>
                  </div>
                  <div className="mt-4 px-6 py-2.5 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:border-indigo-200 group-hover:text-indigo-600 transition-all">+ New Plan</div>
               </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-[320px] shrink-0 space-y-8">
           <div className="sticky top-28 space-y-8">
              
              {/* Active Interventions Mini Stats */}
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                 <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Active Interventions</h2>
                 <div className="flex items-end gap-2 mb-2">
                    <span className="text-6xl font-black text-slate-900 tracking-tighter">8</span>
                    <span className="text-blue-600 font-black uppercase tracking-widest text-xs mb-2">Programs</span>
                 </div>
                 <p className="text-sm font-bold text-slate-500 leading-tight">Currently active across 6 patients in your caseload.</p>
                 <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-50 pt-8">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Speech</p>
                       <p className="text-lg font-black text-slate-800">3</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">OT</p>
                       <p className="text-lg font-black text-slate-800">2</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ABA</p>
                       <p className="text-lg font-black text-slate-800">2</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reading</p>
                       <p className="text-lg font-black text-slate-800">1</p>
                    </div>
                 </div>
              </div>

              {/* This Week Calendar Visual */}
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                 <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">This Week</h2>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black uppercase tracking-widest border border-blue-100">Oct 24-30</span>
                 </div>
                 <div className="space-y-6">
                    <div className="flex items-center gap-4">
                       <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-blue-100">
                          <span className="text-[10px] font-black uppercase">Thu</span>
                          <span className="text-xl font-black">24</span>
                       </div>
                       <div>
                          <p className="text-lg font-black text-slate-800">24 Sessions</p>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Scheduled this week</p>
                       </div>
                    </div>
                    <div className="space-y-3 pt-6 border-t border-slate-50">
                       {[
                         { label: 'Completed', val: 12, color: 'bg-green-500' },
                         { label: 'Upcoming', val: 8, color: 'bg-[#2563EB]' },
                         { label: 'Cancelled', val: 4, color: 'bg-red-400' }
                       ].map((item, i) => (
                         <div key={i} className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                               <div className={`w-2 h-2 rounded-full ${item.color}`} />
                               <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                            </div>
                            <span className="text-sm font-black text-slate-900">{item.val}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Goal Achievement Card */}
              <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-300">
                 <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/5 rounded-full blur-3xl" />
                 <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-8 relative z-10">Caseload Progress</h2>
                 <div className="relative z-10">
                    <div className="flex items-end gap-2 mb-4">
                       <span className="text-5xl font-black text-green-400 tracking-tighter">87%</span>
                       <div className="flex items-center gap-1 text-green-400 font-black text-[10px] uppercase mb-2">
                          <TrendingUp size={14} /> +5%
                       </div>
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest mb-1">Goal Achievement</h3>
                    <p className="text-xs font-bold text-slate-400">Aggregate success rate across all active intervention goals.</p>
                 </div>
                 <button className="w-full mt-10 py-3 bg-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10 relative z-10">Generate Outcome Report</button>
              </div>

              {/* Quick Actions List */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                 <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 px-2">Quick Actions</h2>
                 <div className="space-y-2">
                    {[
                      { l: 'View Master Schedule', i: <Calendar size={18} /> },
                      { l: 'Launch IEP Builder', i: <Target size={18} />, onClick: onStartIEP },
                      { l: 'Reports & Archive', i: <FileCheck size={18} />, onClick: onViewReports },
                      { l: 'Send Parent Updates', i: <UserPlus size={18} /> }
                    ].map((act, i) => (
                      <button 
                        key={i} 
                        onClick={act.onClick}
                        className="w-full flex items-center justify-between p-3.5 bg-white rounded-2xl hover:bg-blue-50 transition-all text-left group"
                      >
                         <div className="flex items-center gap-4">
                            <span className="text-slate-300 group-hover:text-[#2563EB] transition-colors">{act.i}</span>
                            <span className="text-xs font-black text-slate-700 uppercase tracking-tight group-hover:text-[#2563EB] transition-colors">{act.l}</span>
                         </div>
                         <ChevronRight size={14} className="text-slate-200 group-hover:text-[#2563EB] group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                 </div>
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
};

export default InterventionsDashboard;
