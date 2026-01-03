
import React, { useState } from 'react';
import { 
  ArrowLeft, Download, Share2, Printer, MoreVertical, 
  CheckCircle2, Clock, Calendar, User, School, FileText,
  Target, Zap, Activity, Users, ChevronDown, Check,
  AlertTriangle, ShieldCheck, Mail, MessageSquare, ExternalLink
} from 'lucide-react';

interface IEPViewProps {
  onBack: () => void;
  onNavigateToIntervention?: (id: string) => void;
}

const IEPView: React.FC<IEPViewProps> = ({ onBack, onNavigateToIntervention }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [expandedGoal, setExpandedGoal] = useState<number | null>(1);

  const tabs = [
    { id: 'Overview', label: 'Overview', count: null },
    { id: 'Goals', label: 'Goals', count: 3 },
    { id: 'Accommodations', label: 'Accommodations', count: 15 },
    { id: 'Services', label: 'Services', count: 3 },
    { id: 'Team', label: 'Team', count: 5 },
    { id: 'Documents', label: 'Documents', count: 4 }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 animate-in fade-in duration-500 relative">
      {/* Demo Banner */}
      <div className="w-full bg-amber-50 border-b border-amber-100 py-2.5 px-6 flex items-center justify-center gap-3 sticky top-0 z-[60]">
        <AlertTriangle size={16} className="text-amber-600" />
      </div>

      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-[41px] z-50">
         <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-6">
            <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-8">
               <div className="flex items-center gap-6">
                  <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all">
                     <ArrowLeft size={20} />
                  </button>
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center shadow-sm">
                     <FileText size={24} />
                  </div>
                  <div>
                     <h1 className="text-2xl font-black text-slate-900 tracking-tight">IEP - Aarav Kumar (2024-2025)</h1>
                     <div className="flex items-center gap-3 mt-1">
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-black uppercase tracking-widest border border-green-200">Active</span>
                        <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-[10px] font-black uppercase tracking-widest border border-green-100 flex items-center gap-1"><CheckCircle2 size={10} /> All Signatures Collected</span>
                     </div>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <button className="h-10 px-6 bg-[#2563EB] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2">
                     <Download size={16} /> Download IEP
                  </button>
                  <button className="h-10 px-4 border-2 border-slate-200 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest hover:border-blue-200 hover:text-blue-600 transition-all flex items-center gap-2">
                     <Share2 size={16} /> Share
                  </button>
                  <button className="h-10 w-10 border-2 border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:border-slate-300 hover:text-slate-600 transition-all">
                     <MoreVertical size={18} />
                  </button>
               </div>
            </div>

            {/* Status Bar */}
            <div className="bg-white rounded-2xl border-l-4 border-l-green-500 shadow-sm border border-slate-100 p-4 flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
               <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
                  <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">IEP Period</p>
                     <p className="text-sm font-bold text-slate-800">Oct 24, 2024 - Oct 24, 2025</p>
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Next Review</p>
                     <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        April 24, 2025 <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">178 days</span>
                     </p>
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Signatures</p>
                     <p className="text-sm font-bold text-green-600 flex items-center gap-1"><Check size={14} /> Complete (5/5)</p>
                  </div>
               </div>
               <div className="w-full md:w-48">
                  <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                     <span>Timeline</span>
                     <span>Month 1 of 12</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-green-500 w-[8%]" />
                  </div>
               </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
               {tabs.map(tab => (
                 <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`px-6 py-3 rounded-t-xl text-xs font-black uppercase tracking-widest transition-all relative ${
                     activeTab === tab.id 
                       ? 'text-[#2563EB] bg-slate-50 border-b-2 border-[#2563EB]' 
                       : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                   }`}
                 >
                    {tab.label} {tab.count && <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] ${activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>{tab.count}</span>}
                 </button>
               ))}
            </div>
         </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mt-8">
         <div className="flex flex-col xl:flex-row gap-8">
            
            {/* Main Content */}
            <div className="flex-1 space-y-8">
               
               {/* OVERVIEW TAB */}
               {activeTab === 'Overview' && (
                 <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                       <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                          <div className="w-24 h-24 rounded-[2rem] border-4 border-slate-50 shadow-xl overflow-hidden">
                             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rivera" alt="Aarav" className="w-full h-full object-cover" />
                          </div>
                          <div className="text-center sm:text-left space-y-4 flex-1">
                             <div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Aarav Kumar</h2>
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2 text-xs font-bold text-slate-500">
                                   <span>#DAI-8291</span>
                                   <span className="text-slate-300">|</span>
                                   <span>DOB: Mar 15, 2017 (7 yrs)</span>
                                   <span className="text-slate-300">|</span>
                                   <span>Delhi Public School • Grade 2</span>
                                </div>
                             </div>
                             <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                                <div className="bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-100">
                                   <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest">Primary Diagnosis</p>
                                   <p className="text-xs font-bold text-purple-700">Autism Spectrum Disorder (Level 1)</p>
                                </div>
                                <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ICD-10</p>
                                   <p className="text-xs font-bold text-slate-700">F84.0</p>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                       <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-black text-slate-900">Present Levels of Performance (PLOP)</h3>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">As of Oct 24, 2024</span>
                       </div>
                       
                       <div className="space-y-4">
                          {[
                            { t: 'Academic Performance', c: 'Reading at early Grade 1 level. Strong number sense. Handwriting legible but slow.' },
                            { t: 'Functional Performance', c: 'Uses 3-4 word phrases. Vocabulary age-appropriate. Pragmatic language delays noted.' },
                            { t: 'Strengths', c: 'Strong visual memory. Excellent rote memory. Follows clear rules well.' }
                          ].map((sec, i) => (
                            <div key={i} className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                               <h4 className="text-sm font-black text-slate-800 mb-2">{sec.t}</h4>
                               <p className="text-sm font-medium text-slate-600 leading-relaxed">{sec.c}</p>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                       <h3 className="text-lg font-black text-slate-900 mb-6">Educational Placement & LRE</h3>
                       <div className="flex flex-col md:flex-row items-center gap-8">
                          <div className="relative w-32 h-32 shrink-0">
                             <svg className="w-full h-full transform -rotate-90">
                                <circle cx="64" cy="64" r="50" fill="transparent" stroke="#EFF6FF" strokeWidth="24" />
                                <circle cx="64" cy="64" r="50" fill="transparent" stroke="#3B82F6" strokeWidth="24" strokeDasharray="314" strokeDashoffset={314 * 0.25} />
                             </svg>
                             <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xl font-black text-slate-900">75%</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase">Gen Ed</span>
                             </div>
                          </div>
                          <div className="flex-1 space-y-4">
                             <p className="text-sm font-semibold text-slate-600 leading-relaxed italic">
                                "Aarav benefits from general education social environment with pull-out support for targeted interventions. Requires structured speech and OT services while maintaining peer interactions."
                             </p>
                             <div className="flex gap-4 text-xs font-bold">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full" /> General Education (75%)</div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-100 rounded-full" /> Special Services (25%)</div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
               )}

               {/* GOALS TAB */}
               {activeTab === 'Goals' && (
                 <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                    {[
                      { id: 1, d: 'Communication', p: 'High', prog: 68, t: 'By April 2025, use 4-5 word sentences...', s: 'On Track', color: 'blue' },
                      { id: 2, d: 'Academic - Reading', p: 'Medium', prog: 55, t: 'Decode Grade 1 text with 85% accuracy...', s: 'In Progress', color: 'green' },
                      { id: 3, d: 'Social-Emotional', p: 'Medium', prog: 45, t: 'Initiate peer interactions 5x per recess...', s: 'Needs Support', color: 'purple' }
                    ].map((goal) => (
                      <div key={goal.id} className={`bg-white rounded-[2rem] border border-slate-200 overflow-hidden transition-all ${expandedGoal === goal.id ? 'shadow-md ring-1 ring-slate-200' : 'hover:shadow-sm'}`}>
                         <div 
                           className={`p-6 cursor-pointer border-l-8 ${goal.color === 'blue' ? 'border-l-blue-500' : goal.color === 'green' ? 'border-l-green-500' : 'border-l-purple-500'}`}
                           onClick={() => setExpandedGoal(expandedGoal === goal.id ? null : goal.id)}
                         >
                            <div className="flex justify-between items-start mb-4">
                               <div className="flex items-center gap-3">
                                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${goal.color === 'blue' ? 'bg-blue-50 text-blue-700' : goal.color === 'green' ? 'bg-green-50 text-green-700' : 'bg-purple-50 text-purple-700'}`}>{goal.d}</span>
                                  <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest">{goal.p} Priority</span>
                               </div>
                               <span className={`text-xl font-black ${goal.color === 'blue' ? 'text-blue-600' : goal.color === 'green' ? 'text-green-600' : 'text-purple-600'}`}>{goal.prog}%</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 leading-snug pr-8">{goal.t}</h3>
                            <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                               <div className={`h-full ${goal.color === 'blue' ? 'bg-blue-500' : goal.color === 'green' ? 'bg-green-500' : 'bg-purple-500'}`} style={{ width: `${goal.prog}%` }} />
                            </div>
                         </div>

                         {expandedGoal === goal.id && (
                           <div className="bg-slate-50/50 p-6 border-t border-slate-100 space-y-6">
                              <div className="space-y-3">
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Objectives</p>
                                 <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                       <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white"><Check size={12} strokeWidth={3} /></div>
                                       <span className="text-xs font-bold text-slate-700">Objective 1: 3-word phrases (Achieved Nov 10)</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-green-600 uppercase">100%</span>
                                 </div>
                                 <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                       <div className="w-5 h-5 rounded-full border-2 border-blue-500" />
                                       <span className="text-xs font-bold text-slate-700">Objective 2: 4-word sentences</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-blue-600 uppercase">In Progress</span>
                                 </div>
                              </div>
                              <div className="flex gap-4">
                                 <button onClick={() => onNavigateToIntervention?.('iv1')} className="text-xs font-black text-[#2563EB] hover:underline uppercase tracking-widest">View Intervention Plan</button>
                                 <button className="text-xs font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest">Update Progress</button>
                              </div>
                           </div>
                         )}
                      </div>
                    ))}
                 </div>
               )}

               {/* OTHER TABS SIMULATED */}
               {['Accommodations', 'Services', 'Team', 'Documents'].includes(activeTab) && (
                 <div className="bg-white rounded-[2rem] border border-slate-200 p-12 text-center shadow-sm animate-in fade-in">
                    <p className="text-slate-400 font-bold mb-4">Content for {activeTab} available in full view</p>
                    <button className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest">View Full Details</button>
                 </div>
               )}

            </div>

            {/* Right Sidebar */}
            <aside className="w-full xl:w-[320px] shrink-0 space-y-8 sticky top-28 h-fit">
               {/* Quick Summary */}
               <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">IEP Summary</h3>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-300">Total Goals</span>
                        <span className="text-lg font-black">3</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-300">Avg Progress</span>
                        <span className="text-lg font-black text-blue-400">68%</span>
                     </div>
                     <div className="pt-4 border-t border-white/10">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Next Review</p>
                        <p className="text-base font-bold text-white flex items-center gap-2"><Calendar size={16} /> April 24, 2025</p>
                     </div>
                  </div>
               </div>

               {/* Quick Links */}
               <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Related Records</h3>
                  <div className="space-y-2">
                     <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all text-left group">
                        <span className="text-xs font-bold text-slate-600 group-hover:text-[#2563EB]">ISAA Assessment Report</span>
                        <ExternalLink size={14} className="text-slate-300 group-hover:text-[#2563EB]" />
                     </button>
                     <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all text-left group">
                        <span className="text-xs font-bold text-slate-600 group-hover:text-[#2563EB]">Session Notes (History)</span>
                        <ExternalLink size={14} className="text-slate-300 group-hover:text-[#2563EB]" />
                     </button>
                  </div>
               </div>

               {/* Compliance */}
               <div className="bg-green-50 border border-green-200 rounded-[2rem] p-6">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="p-2 bg-green-100 text-green-600 rounded-lg"><ShieldCheck size={20} /></div>
                     <h3 className="text-sm font-black text-green-900 uppercase tracking-wide">Compliant</h3>
                  </div>
                  <ul className="space-y-2">
                     <li className="flex items-center gap-2 text-[10px] font-bold text-green-700 uppercase tracking-widest"><Check size={12} /> Signatures Complete</li>
                     <li className="flex items-center gap-2 text-[10px] font-bold text-green-700 uppercase tracking-widest"><Check size={12} /> Active within dates</li>
                     <li className="flex items-center gap-2 text-[10px] font-bold text-green-700 uppercase tracking-widest"><Check size={12} /> Progress Monitored</li>
                  </ul>
               </div>
            </aside>
         </div>
      </div>
    </div>
  );
};

export default IEPView;
