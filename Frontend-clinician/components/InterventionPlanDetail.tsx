
import React, { useState } from 'react';
import { 
  ArrowLeft, Edit3, Plus, MoreHorizontal, MessageSquare, 
  Calendar, Star, Mail, MessageCircle, Clock, 
  CheckCircle2, AlertTriangle, FileText, ChevronDown, 
  ChevronRight, Play, PlayCircle, Heart, Target,
  TrendingUp, Activity, LayoutGrid, Award, Info,
  Check, Smartphone, Video, Camera, Mic, Download, Zap
} from 'lucide-react';

interface InterventionPlanDetailProps {
  onBack: () => void;
  onGenerateReport?: () => void;
}

const InterventionPlanDetail: React.FC<InterventionPlanDetailProps> = ({ onBack, onGenerateReport }) => {
  const [expandedGoal, setExpandedGoal] = useState<number | null>(2);

  return (
    <div className="w-full animate-in fade-in duration-500 pb-24 relative bg-[#F8FAFC]">
      {/* Demo Banner */}
      <div className="w-full bg-amber-50 border-b border-amber-100 py-2.5 px-6 lg:px-12 flex items-center justify-center gap-3">
        <AlertTriangle size={16} className="text-amber-600" />
      </div>

      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-8">
         <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-[#2563EB] hover:text-blue-700 transition-colors mb-4">
            <ArrowLeft size={18} /> Back to Interventions
         </button>
         <nav className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <span>Caseload</span>
            <ChevronRight size={12} />
            <span>Aarav Kumar</span>
            <ChevronRight size={12} />
            <span className="text-slate-900">Speech & Language Therapy</span>
         </nav>
      </div>

      {/* Page Header */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex flex-col sm:flex-row items-center gap-8">
           <div className="relative">
              <div className="w-24 h-24 rounded-[2rem] border-4 border-white shadow-xl overflow-hidden ring-4 ring-blue-50">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rivera" alt="Aarav" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-xl border-4 border-white shadow-lg" />
           </div>
           <div className="text-center sm:text-left space-y-2">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Aarav Kumar</h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                 <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">7 years • Grade 2</span>
                 <span className="text-slate-200">|</span>
                 <span className="text-[11px] font-bold text-slate-300 tracking-widest font-mono uppercase">#DAI-8291</span>
              </div>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
                 <span className="px-2.5 py-1 bg-purple-50 text-purple-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-purple-100">ASD</span>
                 <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-100">Speech Delay</span>
              </div>
           </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
           <span className="px-4 py-1.5 bg-green-50 text-green-600 rounded-xl text-[11px] font-black uppercase tracking-widest border border-green-100">Active Plan</span>
           <div className="flex gap-2">
              <button className="h-12 px-6 border-2 border-slate-100 rounded-xl text-xs font-black text-slate-500 hover:border-blue-200 hover:text-blue-600 transition-all flex items-center gap-2">
                 <Edit3 size={18} /> Edit Plan
              </button>
              <button className="h-12 px-6 border-2 border-slate-100 rounded-xl text-xs font-black text-slate-500 hover:border-blue-200 hover:text-blue-600 transition-all flex items-center gap-2">
                 <Plus size={18} /> Add Note
              </button>
              <button className="p-3 bg-white border-2 border-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-all">
                 <MoreHorizontal size={24} />
              </button>
           </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
         
         {/* Main Column (8 of 12) */}
         <div className="lg:col-span-8 space-y-10">
            
            {/* Overview Card */}
            <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-sm p-10 overflow-hidden relative group">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <MessageSquare size={120} />
               </div>
               <div className="relative z-10 flex flex-col md:flex-row gap-12">
                  <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center shrink-0 shadow-lg shadow-blue-100">
                     <MessageSquare size={40} />
                  </div>
                  <div className="flex-1 space-y-8">
                     <div>
                        <div className="flex items-center gap-3 mb-2">
                           <h2 className="text-3xl font-black text-slate-900 tracking-tight">Speech & Language Therapy</h2>
                           <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-amber-400 fill-amber-400" />)}
                           </div>
                        </div>
                        <p className="text-lg font-bold text-slate-400 uppercase tracking-widest">PECS Protocol - Phase IV: Sentence Structure</p>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        <div className="space-y-4">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Provider</p>
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Dr Mehta" className="w-full h-full object-cover" />
                              </div>
                              <div>
                                 <p className="text-sm font-black text-slate-800">Dr. Sarah Mehta</p>
                                 <p className="text-[10px] font-bold text-[#2563EB] uppercase">SLP, RCI Verified</p>
                              </div>
                           </div>
                        </div>
                        <div className="space-y-4">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Schedule</p>
                           <div className="space-y-1">
                              <p className="text-sm font-black text-slate-800">2x per week (45 min)</p>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tue & Thu • 10:30 AM</p>
                           </div>
                        </div>
                        <div className="space-y-4">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Timeline</p>
                           <div className="space-y-1">
                              <p className="text-sm font-black text-slate-800">Sep 2024 - Mar 2025</p>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">6 Months Program</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Progress Visualization */}
            <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-sm p-10">
               <div className="flex items-center justify-between mb-12">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Progress Overview</h3>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Current Window: Sep 1 - Oct 24, 2024</p>
               </div>

               <div className="flex flex-col xl:flex-row items-center gap-16">
                  <div className="relative w-44 h-44 flex-shrink-0">
                     <svg className="w-full h-full transform -rotate-90">
                        <circle cx="88" cy="88" r="80" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-slate-50" />
                        <circle cx="88" cy="88" r="80" fill="transparent" stroke="currentColor" strokeWidth="12" strokeDasharray="502.4" strokeDashoffset={502.4 - (502.4 * 0.68)} className="text-blue-500 transition-all duration-1000" />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-black text-slate-900 tracking-tighter">68%</span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Overall</span>
                     </div>
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                     <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100/50 flex flex-col justify-center items-center text-center">
                        <span className="text-4xl font-black text-green-500 mb-1">15</span>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Goals Achieved</p>
                     </div>
                     <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100/50 flex flex-col justify-center items-center text-center">
                        <span className="text-4xl font-black text-blue-500 mb-1">5</span>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">In Progress</p>
                     </div>
                     <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100/50 flex flex-col justify-center items-center text-center">
                        <span className="text-4xl font-black text-slate-300 mb-1">2</span>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Not Started</p>
                     </div>
                  </div>
               </div>

               <div className="mt-16 space-y-6">
                  {[
                    { label: 'Communication Skills', val: 75, color: 'bg-blue-500' },
                    { label: 'Vocabulary Building', val: 60, color: 'bg-indigo-500' },
                    { label: 'Sentence Structure', val: 70, color: 'bg-purple-500' }
                  ].map((prog, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                          <span className="text-slate-500">{prog.label}</span>
                          <span className="text-slate-900">{prog.val}%</span>
                       </div>
                       <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${prog.color}`} style={{ width: `${prog.val}%` }} />
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Goals & Objectives */}
            <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-sm overflow-hidden">
               <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Goals & Objectives (22)</h3>
                  <div className="flex items-center gap-3">
                     <span className="text-[10px] font-bold text-slate-400 uppercase">Sort by:</span>
                     <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-100 transition-all">
                        <option>Status</option>
                        <option>Priority</option>
                     </select>
                  </div>
               </div>

               <div className="divide-y divide-slate-50">
                  {[
                    { id: 1, title: 'Use 3-word phrases to request items', status: 'Achieved', statusColor: 'bg-green-100 text-green-700', icon: <CheckCircle2 className="text-green-500" />, prog: 100, date: 'Oct 2024', detail: { base: 'Used 1-2 words', curr: 'Consistently uses 3+ words with 85% accuracy', upd: 'Oct 15, 2024' } },
                    { id: 2, title: 'Use 4-5 word sentences in conversation', status: 'In Progress', statusColor: 'bg-blue-100 text-blue-700', icon: <Activity className="text-blue-500" />, prog: 68, date: 'Dec 2024', detail: { base: '2-3 word phrases', curr: '3-4 words with 68% accuracy', upd: 'Oct 23, 2024' } },
                    { id: 3, title: 'Maintain conversation for 5+ exchanges', status: 'Not Started', statusColor: 'bg-slate-100 text-slate-400', icon: <Target className="text-slate-200" />, prog: 0, date: 'Feb 2025' }
                  ].map((goal) => (
                    <div key={goal.id} className={`transition-all ${expandedGoal === goal.id ? 'bg-blue-50/20' : 'hover:bg-slate-50/30'}`}>
                       <button 
                         onClick={() => setExpandedGoal(expandedGoal === goal.id ? null : goal.id)}
                         className="w-full px-10 py-8 flex items-center justify-between text-left group"
                       >
                          <div className="flex items-center gap-6">
                             <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 bg-white shadow-sm`}>
                                {goal.icon}
                             </div>
                             <div>
                                <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight leading-tight">{goal.title}</h4>
                                <div className="flex items-center gap-4 mt-1">
                                   <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${goal.statusColor}`}>{goal.status}</span>
                                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Calendar size={12} /> Target: {goal.date}</span>
                                </div>
                             </div>
                          </div>
                          <div className="flex items-center gap-8">
                             <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden md:block">
                                <div className={`h-full ${goal.prog === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${goal.prog}%` }} />
                             </div>
                             <ChevronDown className={`text-slate-300 transition-transform ${expandedGoal === goal.id ? 'rotate-180 text-blue-600' : 'group-hover:text-slate-500'}`} />
                          </div>
                       </button>

                       {expandedGoal === goal.id && goal.detail && (
                          <div className="px-10 pb-10 space-y-8 animate-in slide-in-from-top-4 duration-300">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-6 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm">
                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Baseline</p>
                                   <p className="text-sm font-semibold text-slate-600 italic">"{goal.detail.base}"</p>
                                </div>
                                <div className="p-6 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm">
                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Current Performance</p>
                                   <p className="text-sm font-black text-slate-800 leading-relaxed">{goal.detail.curr}</p>
                                </div>
                             </div>
                             <div className="flex items-center justify-between pt-6 border-t border-slate-50/50">
                                <div className="flex items-center gap-6">
                                   <button className="flex items-center gap-2 text-[10px] font-black text-[#2563EB] uppercase tracking-widest hover:underline"><Video size={14} /> View Evidence (12)</button>
                                   <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"><FileText size={14} /> Logs</button>
                                </div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase italic">Last updated: {goal.detail.upd} by Dr. Mehta</p>
                             </div>
                          </div>
                       )}
                    </div>
                  ))}
               </div>
               <button className="w-full py-5 text-xs font-black text-slate-400 hover:text-[#2563EB] uppercase tracking-widest border-t border-slate-50 transition-colors">View All Goals & Objectives</button>
            </div>

            {/* Session History */}
            <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-sm p-10 space-y-10">
               <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Recent Sessions</h3>
                  <button className="text-[11px] font-black text-[#2563EB] hover:underline uppercase tracking-widest">View History →</button>
               </div>

               <div className="space-y-12 relative">
                  <div className="absolute left-[11px] top-4 bottom-4 w-px bg-slate-100" />
                  
                  {[
                    { id: 1, date: 'Oct 23, 2024', time: '10:30 AM • 45 min', status: 'Completed', color: 'text-green-600', dot: 'bg-green-500', note: 'Excellent progress on sentence building. Aarav used 4-word sentences consistently during the session with minimal prompting.', media: true },
                    { id: 2, date: 'Oct 21, 2024', time: '10:30 AM • 45 min', status: 'Completed', color: 'text-green-600', dot: 'bg-green-500', note: 'Worked on PECS Phase IV. Child initiated communication 8 times using the sentence strip.', media: true },
                    { id: 3, date: 'Oct 10, 2024', status: 'Cancelled', color: 'text-red-500', dot: 'bg-red-500', reason: 'Parent called out sick' }
                  ].map((sess, i) => (
                    <div key={i} className="flex gap-10 relative z-10">
                       <div className={`w-3 h-3 rounded-full ${sess.dot} ring-8 ring-white shrink-0 mt-1.5`} />
                       <div className="flex-1 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                             <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{sess.date}</span>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${sess.color}`}>✓ {sess.status}</span>
                             </div>
                             {sess.time && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sess.time}</span>}
                          </div>
                          {sess.note && <p className="text-sm font-semibold text-slate-500 leading-relaxed max-w-2xl">{sess.note}</p>}
                          {sess.reason && <p className="text-sm font-bold text-red-400 italic">Reason: {sess.reason}</p>}
                          
                          {sess.media && (
                             <div className="flex items-center gap-4 pt-2">
                                <button className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:border-blue-200 transition-all text-[10px] font-black text-slate-600">
                                   <Video size={14} className="text-blue-500" /> Video (2)
                                </button>
                                <button className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:border-blue-200 transition-all text-[10px] font-black text-slate-600">
                                   <FileText size={14} className="text-blue-500" /> Data Sheet
                                </button>
                                <button className="text-[10px] font-black text-[#2563EB] uppercase tracking-widest hover:underline ml-auto">Full Session Notes</button>
                             </div>
                          )}
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Evidence Gallery */}
            <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-sm p-10 space-y-8">
               <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Session Evidence</h3>
                  <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest">48 Items Total</span>
               </div>

               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[1, 2].map(v => (
                    <div key={v} className="aspect-video bg-slate-900 rounded-2xl relative overflow-hidden group cursor-pointer shadow-sm">
                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                          <PlayCircle className="text-white opacity-80 group-hover:opacity-100 transition-all" size={40} />
                       </div>
                       <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/60 rounded text-[8px] font-bold text-white uppercase tracking-widest">02:34</div>
                    </div>
                  ))}
                  {[1, 2].map(p => (
                    <div key={p} className="aspect-video bg-slate-100 rounded-2xl overflow-hidden relative group cursor-pointer shadow-sm">
                       <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${p + 42}`} alt="Evidence" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                       <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-all" />
                    </div>
                  ))}
               </div>
               <button className="w-full py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black text-slate-400 hover:text-[#2563EB] uppercase tracking-widest transition-colors">View All Evidence Media</button>
            </div>
         </div>

         {/* Right Sidebar Area (4 of 12) */}
         <div className="lg:col-span-4 space-y-8">
            
            {/* Upcoming Session */}
            <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
               <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-3xl" />
               <div className="flex items-center justify-between mb-8 relative z-10">
                  <h3 className="text-xs font-black text-blue-100 uppercase tracking-[0.2em]">Next Session</h3>
                  <span className="px-3 py-1 bg-white/20 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/20">In 3 Days</span>
               </div>
               
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-[1.5rem] flex flex-col items-center justify-center border border-white/20 shadow-lg">
                        <Calendar size={24} className="mb-1" />
                        <span className="text-xs font-black">OCT 28</span>
                     </div>
                     <div>
                        <p className="text-2xl font-black tracking-tight">10:30 AM</p>
                        <p className="text-sm font-bold text-blue-100 opacity-80">Speech Therapy Room 3</p>
                     </div>
                  </div>
                  
                  <div className="p-4 bg-white/10 rounded-2xl border border-white/10 flex items-center gap-3">
                     <CheckCircle2 size={18} className="text-green-300 shrink-0" />
                     <span className="text-xs font-black uppercase tracking-widest">Parent Confirmed Attendance</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                     <button className="py-3 bg-white text-[#2563EB] rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-blue-50 transition-all">Reschedule</button>
                     <button className="py-3 bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-500 hover:bg-blue-800 transition-all">Add Calendar</button>
                  </div>
               </div>
            </div>

            {/* Parent Involvement */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 space-y-8">
               <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Parent Engagement</h3>
                  <TrendingUp size={20} className="text-green-500" />
               </div>

               <div className="space-y-6">
                  <div className="flex items-center gap-6">
                     <div className="relative w-16 h-16 flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                           <circle cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="6" className="text-slate-50" />
                           <circle cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="6" strokeDasharray="175.8" strokeDashoffset={175.8 - (175.8 * 0.85)} className="text-green-500" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                           <span className="text-[11px] font-black text-slate-900">85%</span>
                        </div>
                     </div>
                     <div>
                        <p className="text-sm font-black text-slate-800">Home Practice Completion</p>
                        <p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-widest">17 of 20 tasks met</p>
                     </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-50">
                     {[
                       { l: 'Practice PECS daily (3x)', done: true },
                       { l: 'Shared reading (15 min)', done: true },
                       { l: 'Record new vocab words', done: true },
                       { l: 'Submit weekly home video', done: false, urgent: true }
                     ].map((task, i) => (
                       <div key={i} className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center mt-0.5 transition-all ${task.done ? 'bg-green-500 border-green-500 text-white' : task.urgent ? 'border-orange-400 bg-orange-50' : 'border-slate-100'}`}>
                             {task.done && <Check size={14} strokeWidth={4} />}
                          </div>
                          <span className={`text-xs font-bold ${task.done ? 'text-slate-700' : 'text-slate-400'} ${task.urgent && !task.done ? 'text-orange-600' : ''}`}>{task.l}</span>
                       </div>
                     ))}
                  </div>

                  <button className="w-full py-4 bg-[#2563EB] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                     <MessageCircle size={16} /> Message Parent
                  </button>
               </div>
            </div>

            {/* Quick Actions Stack */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-6 space-y-2">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-4">Plan Management</h3>
               {[
                 { l: 'Update Progress Data', i: <TrendingUp size={18} /> },
                 { l: 'Log Clinical Session', i: <Clock size={18} /> },
                 { l: 'Generate Outcome Report', i: <FileText size={18} />, onClick: onGenerateReport },
                 { l: 'View Full IEP Goals', i: <Target size={18} /> }
               ].map((act, i) => (
                 <button key={i} onClick={act.onClick} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all text-left group">
                    <div className="flex items-center gap-4">
                       <span className="text-slate-300 group-hover:text-[#2563EB] transition-colors">{act.i}</span>
                       <span className="text-xs font-black text-slate-700 uppercase tracking-tight group-hover:text-[#2563EB] transition-colors">{act.l}</span>
                    </div>
                    <ChevronRight size={14} className="text-slate-100 group-hover:text-[#2563EB] transition-all" />
                 </button>
               ))}
            </div>

            {/* Next Milestones */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-300">
               <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/5 rounded-full blur-3xl" />
               <div className="flex items-center gap-3 mb-8 relative z-10">
                  <div className="p-2 bg-white/10 rounded-xl text-blue-400">
                     <Award size={20} />
                  </div>
                  <h3 className="text-base font-black">🎯 Next Milestones</h3>
               </div>
               <div className="space-y-6 relative z-10">
                  {[
                    { l: 'Phase IV Completion', d: 'Nov 15', p: 80, c: 'bg-green-400' },
                    { l: 'Quarterly Review', d: 'Dec 01', p: 45, c: 'bg-blue-400' },
                    { l: 'Goal Reassessment', d: 'Jan 01', p: 0, c: 'bg-slate-700' }
                  ].map((ms, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                          <span className="text-slate-400">{ms.l}</span>
                          <span className="text-blue-200">{ms.d}</span>
                       </div>
                       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full ${ms.c}`} style={{ width: `${ms.p}%` }} />
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Related Documents */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 space-y-6">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Related Documents</h3>
               <div className="space-y-4">
                  {[
                    { l: 'Initial Assessment Report', d: 'Oct 17, 2024' },
                    { l: 'Active IEP Document', d: 'Sep 30, 2024' },
                    { l: 'Parent Consent Form', d: 'Sep 01, 2024' }
                  ].map((doc, i) => (
                    <button key={i} className="w-full flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl hover:bg-blue-50 transition-all text-left group">
                       <div className="p-2 bg-white border border-slate-100 rounded-lg text-slate-400 group-hover:text-blue-600 transition-colors">
                          <FileText size={16} />
                       </div>
                       <div>
                          <p className="text-[11px] font-black text-slate-800 uppercase leading-tight">{doc.l}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{doc.d}</p>
                       </div>
                    </button>
                  ))}
               </div>
            </div>

         </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <footer className="fixed bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-[100] px-12 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
         <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between">
            <button onClick={onBack} className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-widest">
               <ArrowLeft size={18} /> Back to caselist
            </button>
            
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">All clinical changes auto-saved</span>
            </div>

            <div className="flex items-center gap-4">
               <button onClick={onGenerateReport} className="h-12 px-8 border-2 border-slate-100 rounded-xl text-xs font-black text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest">Generate Report</button>
               <button className="h-12 px-10 bg-[#2563EB] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95">Update Progress</button>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default InterventionPlanDetail;
