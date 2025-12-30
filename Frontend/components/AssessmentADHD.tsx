import React, { useState } from 'react';
import { 
  ArrowLeft, Save, Clock, CheckCircle2, AlertTriangle, 
  ChevronRight, Info, Users, School, Home, 
  BarChart3, FileText, Share2, ClipboardList,
  MessageSquare, LayoutList, Check, AlertCircle
} from 'lucide-react';

const TrendingUpIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const v_labels = ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'];

interface AssessmentADHDProps {
  onExit: () => void;
}

const AssessmentADHD: React.FC<AssessmentADHDProps> = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState('Hyperactivity');

  const questions = [
    { id: 'q1', text: 'Fidgets with hands or feet, or squirms in seat', parent: 2, teacher: 3, note: 'Teacher reports increased frequency during math class' },
    { id: 'q2', text: 'Leaves seat in situations when remaining seated is expected', parent: 2, teacher: 4, diff: true },
    { id: 'q3', text: 'Runs about or climbs in situations where it is inappropriate', parent: 1, teacher: 2 },
    { id: 'q4', text: 'Unable to play or engage in leisure activities quietly', parent: 3, teacher: 3 },
    { id: 'q5', text: 'Is "on the go" or acts as if "driven by a motor"', parent: 2, teacher: 4, diff: true },
    { id: 'q6', text: 'Talks excessively', parent: 3, teacher: 3 }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col animate-in fade-in duration-500 pb-20">
      {/* Top Bar */}
      <header className="sticky top-0 z-[100] bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm">
         <div className="flex items-center gap-6">
            <button onClick={onExit} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-800 transition-colors">
               <ArrowLeft size={18} /> Exit
            </button>
            <div className="h-6 w-px bg-slate-100" />
            <div className="flex items-center gap-3">
               <h2 className="text-lg font-black tracking-tight text-slate-900">ADHD Assessment Protocol</h2>
            </div>
         </div>
         <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg border-2 border-slate-50 overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Felix`} alt="Arjun" className="w-full h-full object-cover" />
               </div>
               <span className="text-sm font-bold text-slate-700">Arjun Patel, 4 yrs 8 mos</span>
            </div>
            <button className="px-6 py-2.5 bg-blue-50 hover:bg-blue-100 text-[#2563EB] rounded-xl text-xs font-black uppercase tracking-widest border border-blue-100 transition-all">Save & Exit</button>
         </div>
      </header>

      {/* Persistent Banner */}
      <div className="bg-white border-b border-slate-100">
         <div className="max-w-[1440px] mx-auto px-12 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><ClipboardList size={18} /></span>
               <p className="text-sm font-bold text-blue-900">
                  🎭 Demo ADHD Assessment: <span className="font-medium opacity-80">Sample parent and teacher responses are shown for demonstration.</span>
               </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
               Section 2 of 3 • 45% Complete
            </div>
         </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
         <div className="max-w-[1440px] mx-auto px-12 flex items-center gap-2">
            {['Attention Deficit', 'Hyperactivity', 'Impulsivity', 'Summary'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-5 text-xs font-black uppercase tracking-widest relative transition-all ${
                  activeTab === tab ? 'text-[#2563EB]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
                {tab === 'Attention Deficit' && <Check size={12} className="inline ml-1 text-green-500" />}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#2563EB] rounded-t-full" />}
              </button>
            ))}
         </div>
      </div>

      <div className="max-w-[1440px] mx-auto w-full px-12 mt-10">
         <div className="flex flex-col lg:flex-row gap-10">
            
            {/* Main Content Area */}
            <div className="flex-1 space-y-10">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                     <h1 className="text-3xl font-black text-slate-900 tracking-tight">{activeTab} Assessment</h1>
                     <p className="mt-2 text-slate-500 font-medium">Rate the frequency of hyperactive behaviors over the past 6 months as reported in different settings.</p>
                  </div>
                  <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-100 flex items-center gap-2 shrink-0">
                     <CheckCircle2 size={12} /> DSM-5 Aligned
                  </span>
               </div>

               {/* Instruction Card */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 flex items-center gap-5 shadow-sm">
                     <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                        <Users size={28} />
                     </div>
                     <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Side-by-Side Dual Rating</h4>
                        <p className="text-xs font-bold text-slate-400 mt-1">Compare parent and teacher observations directly</p>
                     </div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 flex items-center gap-5 shadow-sm">
                     <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                        <AlertTriangle size={28} />
                     </div>
                     <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Discrepancy Analysis</h4>
                        <p className="text-xs font-bold text-slate-400 mt-1">Identify significant differences between home and school patterns</p>
                     </div>
                  </div>
               </div>

               {/* Question Table */}
               <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                  <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                        <thead>
                           <tr className="bg-slate-50/50 border-b border-slate-100">
                              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-1/3">Hyperactivity Behaviors</th>
                              <th className="px-10 py-6 text-[10px] font-black text-slate-700 uppercase tracking-widest text-center border-l border-slate-100">
                                 <div className="flex items-center justify-center gap-2"><Home size={14} className="text-blue-500" /> Parent Rating</div>
                                 <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase">Mrs. Neha Patel (Mother)</p>
                              </th>
                              <th className="px-10 py-6 text-[10px] font-black text-slate-700 uppercase tracking-widest text-center border-l border-slate-100">
                                 <div className="flex items-center justify-center gap-2"><School size={14} className="text-purple-500" /> Teacher Rating</div>
                                 <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase">Mrs. Sharma (Class Teacher)</p>
                              </th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           {questions.map((q, i) => (
                             <React.Fragment key={q.id}>
                                <tr className={`transition-colors ${q.diff ? 'bg-amber-50/30' : 'hover:bg-slate-50/30'}`}>
                                   <td className="px-10 py-8 relative">
                                      {q.diff && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-amber-400 rounded-r-full" />}
                                      <div className="flex items-start gap-4">
                                         <span className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-400 shrink-0">Q{i+1}</span>
                                         <p className="text-sm font-bold text-slate-800 leading-snug">{q.text}</p>
                                      </div>
                                      {q.diff && (
                                        <div className="mt-3 flex items-center gap-2 text-[9px] font-black text-amber-600 uppercase tracking-widest">
                                           <AlertCircle size={12} /> Discrepancy detected (diff: {q.teacher - q.parent})
                                        </div>
                                      )}
                                   </td>
                                   <td className="px-8 py-8 border-l border-slate-50">
                                      <div className="flex justify-center gap-1.5">
                                         {[0,1,2,3,4].map(v => (
                                           <div key={v} className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${q.parent === v ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-50 text-slate-300'}`}>
                                              {v}
                                           </div>
                                         ))}
                                      </div>
                                      <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest text-center mt-3">
                                         {v_labels[q.parent]}
                                      </p>
                                   </td>
                                   <td className="px-8 py-8 border-l border-slate-50">
                                      <div className="flex justify-center gap-1.5">
                                         {[0,1,2,3,4].map(v => (
                                           <div key={v} className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${q.teacher === v ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'bg-slate-50 text-slate-300'}`}>
                                              {v}
                                           </div>
                                         ))}
                                      </div>
                                      <p className="text-[9px] font-black text-purple-500 uppercase tracking-widest text-center mt-3">
                                         {v_labels[q.teacher]}
                                      </p>
                                   </td>
                                </tr>
                                {q.diff && (
                                  <tr className="bg-amber-50/20">
                                     <td colSpan={3} className="px-10 py-3 border-t border-amber-100">
                                        <div className="flex items-center gap-4">
                                           <p className="text-[10px] font-bold text-amber-700 italic">"Why might ratings differ for this behavior?"</p>
                                           <button className="px-3 py-1 bg-white border border-amber-200 rounded-lg text-[9px] font-black text-amber-600 uppercase tracking-widest hover:bg-amber-100 transition-colors">Add Clinical Note</button>
                                        </div>
                                     </td>
                                  </tr>
                                )}
                             </React.Fragment>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>

               {/* Section Summary Box */}
               <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-300">
                  <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
                     <div className="space-y-6 flex-1">
                        <div>
                           <h3 className="text-xl font-black uppercase tracking-widest mb-1">Hyperactivity Section Summary</h3>
                           <p className="text-slate-400 text-sm font-medium">Preliminary scoring subject to review</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                           <div>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Parent Total</p>
                              <p className="text-3xl font-black text-white">12<span className="text-base text-slate-600 ml-1">/40</span></p>
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Teacher Total</p>
                              <p className="text-3xl font-black text-white">28<span className="text-base text-slate-600 ml-1">/40</span></p>
                           </div>
                           <div className="col-span-2">
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Interpretation</p>
                              <div className="flex items-center gap-2 text-amber-400 font-black text-sm uppercase tracking-widest">
                                 <AlertCircle size={16} /> Meets DSM-5 Symptom Count
                              </div>
                              <p className="text-[10px] text-slate-400 mt-1 italic">7 symptoms rated as 'Often' or 'Very Often'</p>
                           </div>
                        </div>
                     </div>
                     <div className="w-full md:w-auto">
                        <button className="w-full md:w-auto h-16 px-12 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                           Continue to Impulsivity <ChevronRight size={20} />
                        </button>
                     </div>
                  </div>
               </div>
            </div>

            {/* Right Sidebar - Logic & Norms */}
            <aside className="w-full lg:w-[320px] shrink-0 space-y-8">
               <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-hidden relative">
                  {/* Demo Watermark */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.04] font-black text-6xl -rotate-45">DEMO</div>
                  
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">DSM-5 ADHD Criteria</h3>
                  <div className="space-y-6">
                     <div className="space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                           <span>A. Inattention</span>
                           <span className="text-amber-500">5 SYMPTOMS</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-amber-500" style={{ width: '83%' }} />
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 italic">6 required for diagnosis (83%)</p>
                     </div>
                     <div className="space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                           <span>B. Hyperactivity</span>
                           <span className="text-green-500">7 SYMPTOMS</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-green-500" style={{ width: '100%' }} />
                        </div>
                        <div className="mt-4 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-[10px] font-black uppercase tracking-widest text-center border border-green-100 flex items-center justify-center gap-2">
                           <Check size={12} /> Criteria Met
                        </div>
                     </div>
                  </div>
               </div>

               <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center justify-between">
                     Discrepancy Analysis <BarChart3 size={16} className="text-blue-500" />
                  </h3>
                  <div className="space-y-6">
                     <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Correlation</span>
                        <span className="text-xs font-black text-slate-800">r = 0.65 (Moderate)</span>
                     </div>
                     <div className="space-y-3">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Highest Discrepancies</p>
                        {['Q2: Leaves seat', 'Q5: Driven by motor', 'Q8: Interrupts others'].map((q, i) => (
                          <div key={i} className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                             <span>{q}</span>
                             <span className="text-red-500">+2.1</span>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-100">
                  <h3 className="text-lg font-black mb-2">ADHD Subtype</h3>
                  <div className="px-3 py-1.5 bg-white/20 rounded-xl text-xs font-black uppercase tracking-widest border border-white/20 mb-4 inline-block">
                     Preliminary Indication
                  </div>
                  <p className="text-2xl font-black tracking-tight mb-6">ADHD - Combined Type</p>
                  <button className="w-full py-3 bg-white text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-blue-50 transition-all">Generate Summary Report</button>
               </div>

               <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Resources</h3>
                  {[
                    { l: 'ADHD Rating Scale Manual', i: <ClipboardList size={16} /> },
                    { l: 'Normative Data by Age', i: <BarChart3 size={16} /> },
                    { l: 'Scoring Guidelines', i: <Info size={16} /> }
                  ].map((res, i) => (
                    <button key={i} className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-all text-left text-[11px] font-bold text-slate-600 group">
                       <span className="text-slate-300 group-hover:text-blue-600">{res.i}</span>
                       {res.l}
                    </button>
                  ))}
               </div>
            </aside>
         </div>
      </div>
    </div>
  );
};

export default AssessmentADHD;