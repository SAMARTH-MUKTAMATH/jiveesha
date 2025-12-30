import React, { useState } from 'react';
import {
   ArrowLeft, Save, Clock, CheckCircle2, Volume2,
   ChevronDown, ChevronRight, BarChart3, ListChecks,
   Activity, Search, HelpCircle, FileText, Share2,
   AlertTriangle, Check, PlayCircle, Star, Hash,
   AlertCircle, Trash2, Info
} from 'lucide-react';

interface AssessmentGLADProps {
   onExit: () => void;
}

const AssessmentGLAD: React.FC<AssessmentGLADProps> = ({ onExit }) => {
   const [currentDomain, setCurrentDomain] = useState('Decoding Skills');
   const [selectedResponse, setSelectedResponse] = useState<string | null>('incorrect');

   const readingDomains = [
      { id: 'comp', label: 'Reading Comprehension', status: 'done' },
      { id: 'phon', label: 'Phonological Awareness', status: 'done' },
      { id: 'let', label: 'Letter Recognition', status: 'done' },
      { id: 'dec', label: 'Decoding Skills', status: 'active' },
      { id: 'flu', label: 'Reading Fluency', status: 'pending' },
      { id: 'sight', label: 'Sight Word Recognition', status: 'pending' }
   ];

   return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col animate-in fade-in duration-500 relative pb-24">
         {/* Top Bar */}
         <header className="sticky top-0 z-[100] bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-6">
               <button onClick={onExit} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-800 transition-colors">
                  <ArrowLeft size={18} /> Exit
               </button>
               <div className="h-6 w-px bg-slate-100" />
               <div className="flex items-center gap-3">
                  <h2 className="text-lg font-black tracking-tight text-slate-900">GLAD Assessment</h2>
               </div>
            </div>
            <div className="flex items-center gap-8">
               <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span className="text-slate-600">Maya Singh, 6 yrs 1 mo</span>
                  <span className="text-slate-200">|</span>
                  <span className="px-2 py-1 bg-slate-100 rounded">Class 1</span>
               </div>
               <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-slate-800 transition-all">Save & Exit</button>
            </div>
         </header>

         {/* Demo Persistent Banner */}
         <div className="bg-amber-50 border-b border-amber-100 py-3 px-12 flex items-center justify-center gap-4">
            <AlertTriangle size={18} className="text-amber-600" />
            <p className="text-sm font-bold text-amber-800 tracking-tight">🎭 Demo SLD Assessment with sample student responses</p>
         </div>

         <div className="max-w-[1440px] mx-auto w-full px-12 mt-8 flex flex-col lg:flex-row gap-10 items-start">

            {/* Left Domain Navigator (240px) */}
            <aside className="w-full lg:w-[260px] shrink-0 sticky top-36 space-y-8 h-[calc(100vh-10rem)] overflow-y-auto pr-2 scrollbar-hide">
               <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">GLAD Domains (20 Total)</h3>

                  <div className="space-y-4">
                     <div>
                        <button className="flex items-center justify-between w-full mb-4 text-left group">
                           <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Reading & Literacy</span>
                           <ChevronDown size={14} className="text-slate-300" />
                        </button>
                        <div className="space-y-2 pl-2 border-l border-slate-50">
                           {readingDomains.map(d => (
                              <div key={d.id} className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${d.status === 'active' ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-100' : 'text-slate-400 hover:bg-slate-50'}`}>
                                 <div className="flex items-center gap-3">
                                    {d.status === 'done' ? <CheckCircle2 size={12} className="text-green-500" /> : d.status === 'active' ? <div className="w-2.5 h-2.5 rounded-full bg-blue-500" /> : <div className="w-2.5 h-2.5 rounded-full border border-slate-200" />}
                                    <span className="text-[10px] font-bold uppercase tracking-tight">{d.label}</span>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     {['Writing', 'Mathematics', 'Cognitive', 'Language'].map(cat => (
                        <div key={cat} className="pt-2">
                           <button className="flex items-center justify-between w-full text-left group py-2">
                              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600">{cat}</span>
                              <ChevronRight size={14} className="text-slate-200" />
                           </button>
                        </div>
                     ))}
                  </div>

                  <div className="mt-10 pt-6 border-t border-slate-50">
                     <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Overall Progress</span>
                        <span className="text-xs font-black text-slate-800">20%</span>
                     </div>
                     <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500" style={{ width: '20%' }} />
                     </div>
                  </div>
               </div>

               <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative shadow-xl">
                  <div className="absolute top-[-10%] right-[-5%] w-32 h-32 bg-white/5 rounded-full blur-3xl" />
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Comparison Map</h3>
                  <div className="space-y-4">
                     {[
                        { l: 'Reading', p: 65, c: 'bg-red-400' },
                        { l: 'Phonological', p: 80, c: 'bg-green-400' },
                        { l: 'Letter Rec', p: 90, c: 'bg-green-400' },
                        { l: 'Decoding', p: 70, c: 'bg-amber-400' }
                     ].map((cat, i) => (
                        <div key={i} className="space-y-1.5">
                           <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                              <span>{cat.l}</span>
                              <span>{cat.p}%</span>
                           </div>
                           <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                              <div className={`h-full ${cat.c}`} style={{ width: `${cat.p}%` }} />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </aside>

            {/* Center Content - Main Test Area */}
            <div className="flex-1 space-y-8 pb-20">
               {/* Domain Header */}
               <div className="flex items-center justify-between">
                  <div className="space-y-1">
                     <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Decoding Skills</h1>
                        <span className="px-3 py-1 bg-teal-50 text-teal-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-teal-100">Domain 4 of 20</span>
                     </div>
                     <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Expected grade level: <span className="text-slate-800">Class 1</span></p>
                  </div>
                  <div className="p-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-bold text-slate-400 max-w-[280px] leading-snug">
                     Assess ability to apply letter-sound relationships to read unfamiliar words
                  </div>
               </div>

               {/* Test Item Card */}
               <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-12 shadow-2xl shadow-slate-200/40 relative overflow-hidden">
                  {/* Watermark */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] select-none font-black text-[150px] -rotate-[15deg] z-0">
                     DEMO DATA
                  </div>

                  <div className="relative z-10 flex flex-col items-center">
                     <div className="w-full flex items-center justify-between mb-16">
                        <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-blue-100">Item 1 of 10</span>
                        <div className="flex items-center gap-2">
                           <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-100">Grade 1 Level</span>
                           <HelpCircle size={16} className="text-slate-200" />
                        </div>
                     </div>

                     <p className="text-base font-black text-slate-400 uppercase tracking-[0.2em] mb-12">Ask student to read this word:</p>

                     {/* Word Flashcard */}
                     <div className="w-full max-w-[480px] aspect-[16/10] bg-white border-[6px] border-slate-50 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center gap-4 group cursor-pointer hover:-translate-y-1 transition-all duration-500 ring-1 ring-slate-100">
                        <h2 className="text-[120px] font-black text-slate-900 tracking-tight leading-none group-hover:scale-105 transition-transform">cat</h2>
                        <p className="text-2xl font-black text-slate-300 uppercase tracking-[0.5em] mt-4">/kăt/</p>
                        <button className="mt-8 flex items-center gap-3 px-6 py-3 bg-slate-50 rounded-2xl text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100">
                           <Volume2 size={18} /> Hear Pronunciation
                        </button>
                     </div>

                     {/* Student Response Capture */}
                     <div className="mt-20 w-full">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 text-center">Capture student response</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                           {[
                              { id: 'correct', label: 'Read Correctly', color: 'bg-green-500 border-green-500 shadow-green-100', icon: <Check size={18} /> },
                              { id: 'incorrect', label: 'Read Incorrectly', color: 'bg-red-500 border-red-500 shadow-red-100', icon: <Hash size={18} /> },
                              { id: 'partial', label: 'Partial/Hesitant', color: 'bg-amber-500 border-amber-500 shadow-amber-100', icon: <AlertCircle size={18} /> },
                              { id: 'none', label: 'Did Not Attempt', color: 'bg-slate-500 border-slate-500 shadow-slate-100', icon: <Trash2 size={18} /> }
                           ].map(opt => (
                              <button
                                 key={opt.id}
                                 onClick={() => setSelectedResponse(opt.id)}
                                 className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center text-center gap-3 group/opt ${selectedResponse === opt.id
                                       ? `${opt.color} text-white shadow-xl -translate-y-1`
                                       : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200'
                                    }`}
                              >
                                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${selectedResponse === opt.id ? 'bg-white/20' : 'bg-slate-50 group-hover/opt:bg-blue-50'
                                    }`}>
                                    {opt.icon}
                                 </div>
                                 <span className="text-xs font-black uppercase tracking-tight">{opt.label}</span>
                              </button>
                           ))}
                        </div>

                        {/* Incorrect Details Area */}
                        {selectedResponse === 'incorrect' && (
                           <div className="mt-8 p-8 bg-red-50/50 rounded-[2rem] border border-red-100 space-y-6 animate-in slide-in-from-top-4 duration-500">
                              <div className="flex flex-col md:flex-row items-center gap-8">
                                 <div className="flex-1 space-y-4 w-full">
                                    <label className="block text-[10px] font-black text-red-700 uppercase tracking-widest">Student's Phonetic Response</label>
                                    <input
                                       type="text"
                                       placeholder="e.g., kat, ket..."
                                       className="w-full h-14 px-6 bg-white border-2 border-red-100 rounded-2xl text-lg font-black text-red-600 outline-none focus:border-red-400 transition-all shadow-sm"
                                    />
                                    <div className="flex gap-2">
                                       <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-[9px] font-black uppercase tracking-widest">Common Error</span>
                                       <span className="px-2 py-1 bg-white border border-red-100 text-red-400 rounded text-[9px] font-black uppercase tracking-widest">Vowel Substitution</span>
                                    </div>
                                 </div>
                                 <div className="w-full md:w-56 space-y-4">
                                    <div className="flex justify-between items-center">
                                       <span className="text-[10px] font-black text-red-400 uppercase tracking-widest flex items-center gap-2"><Clock size={12} /> Response Time</span>
                                       <span className="text-sm font-black text-red-600">3.2s</span>
                                    </div>
                                    <div className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[9px] font-black uppercase tracking-widest text-center">Normal for age</div>
                                    <button className="w-full h-10 bg-white border border-red-100 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-colors">Record Audio</button>
                                 </div>
                              </div>
                              <div className="pt-6 border-t border-red-100/50">
                                 <textarea
                                    placeholder="Add clinical observation notes..."
                                    className="w-full h-24 p-4 bg-white/50 border border-red-100 rounded-2xl text-xs font-bold text-slate-600 outline-none resize-none"
                                 ></textarea>
                              </div>
                           </div>
                        )}
                     </div>

                     {/* Adaptive Logic Indicator */}
                     <div className="mt-16 pt-10 border-t border-slate-50 w-full flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                              <Activity size={24} />
                           </div>
                           <div>
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Adaptive Logic Decision</h4>
                              <div className="flex items-center gap-3">
                                 <p className="text-sm font-black text-slate-800">Next item will be: <span className="text-blue-600">Same Level (Grade 1)</span></p>
                                 <div className="group relative">
                                    <Info size={14} className="text-slate-300 cursor-help" />
                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-56 p-3 bg-slate-800 text-white text-[9px] rounded-xl font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl leading-relaxed">
                                       Test adapts based on accuracy. Threshold to advance: &gt;80% correct. To downgrade: &lt;40% correct.
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="text-right">
                              <p className="text-[9px] font-black text-slate-300 uppercase">Current Domain Accuracy</p>
                              <p className="text-2xl font-black text-slate-900 tracking-tighter">70% <span className="text-[10px] text-amber-500 ml-1">Moderate</span></p>
                           </div>
                           <div className="w-14 h-14 rounded-2xl bg-slate-50 flex flex-col items-center justify-center border border-slate-100">
                              <span className="text-[9px] font-black text-slate-400 uppercase">Items</span>
                              <span className="text-lg font-black text-slate-700">7/10</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Right Sidebar - SLD Insights */}
               <aside className="w-full lg:w-[320px] shrink-0 space-y-8">
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-hidden relative">
                     <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Learning Disability Indicators</h3>
                     <div className="space-y-6">
                        {[
                           { label: 'Below grade in 2+ domains', status: 'warning', text: '⚠ Criteria flagged' },
                           { label: 'Cognitive-achievement gap', status: 'warning', text: '⚠ Gap detected' },
                           { label: 'Rule out other causes', status: 'pending', text: '○ Incomplete' },
                           { label: 'Impact on academics', status: 'pending', text: '○ Incomplete' }
                        ].map((ind, i) => (
                           <div key={i} className="space-y-2">
                              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                 <span className="text-slate-400">{ind.label}</span>
                              </div>
                              <div className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${ind.status === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                 {ind.text}
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                     <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Error Pattern Analysis</h3>
                     <div className="space-y-4">
                        {[
                           { type: 'Consonant blends', count: 2, c: 'text-red-500' },
                           { type: 'Vowel sounds', count: 1, c: 'text-amber-500' },
                           { type: 'Sight words', count: 0, c: 'text-green-500' }
                        ].map((err, i) => (
                           <div key={i} className="flex justify-between items-center text-[11px] font-bold text-slate-600">
                              <span>{err.type}</span>
                              <span className={`${err.c} font-black`}>{err.count} Errors</span>
                           </div>
                        ))}
                     </div>
                     <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-2xl space-y-3">
                        <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest flex items-center gap-2"><Search size={12} /> Insight Detected</p>
                        <p className="text-xs font-bold text-blue-800 leading-tight">Difficulty with consonant blends and digraphs. Strength in simple CVC words.</p>
                     </div>
                  </div>

                  <div className="bg-teal-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-teal-100">
                     <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                     <h3 className="text-xs font-black text-teal-100 uppercase tracking-widest mb-6 relative z-10">Intervention Suggestions</h3>
                     <ul className="space-y-4 relative z-10">
                        {[
                           'Structured phonic intervention',
                           'Blending practice activities',
                           'Multisensory reading approach',
                           'Small group targeted instruction'
                        ].map((item, i) => (
                           <li key={i} className="flex items-start gap-3 text-[10px] font-black text-white uppercase tracking-widest leading-tight">
                              <CheckCircle2 size={14} className="text-teal-200 shrink-0 mt-0.5" /> {item}
                           </li>
                        ))}
                     </ul>
                     <button className="w-full mt-10 py-3 bg-white text-teal-700 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-teal-50 transition-all">Add to IEP Draft</button>
                  </div>
               </aside>
            </div>
         </div>

         {/* Navigation Persistent Bar */}
         <footer className="fixed bottom-0 left-0 right-0 h-24 bg-white/90 backdrop-blur-xl border-t border-slate-200 z-[110] px-12">
            <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between">
               <button className="h-14 px-10 border-2 border-slate-100 rounded-2xl text-sm font-black text-slate-500 hover:border-slate-300 hover:text-slate-800 uppercase tracking-widest transition-all flex items-center gap-2">
                  <ArrowLeft size={18} /> Previous Domain
               </button>

               <div className="flex flex-col items-center gap-2">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2rem]">DECODING SKILLS • ITEM 1 / 10</p>
                  <div className="flex gap-1.5">
                     {[...Array(10)].map((_, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i === 0 ? 'bg-blue-600 scale-125 ring-2 ring-blue-100' : 'bg-slate-100'}`} />
                     ))}
                  </div>
               </div>

               <button className="h-14 px-12 bg-teal-600 text-white rounded-2xl text-sm font-black uppercase tracking-[0.1rem] shadow-2xl shadow-teal-200 hover:bg-teal-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3">
                  Next Item <ChevronRight size={20} />
               </button>
            </div>
         </footer>
      </div>
   );
};

export default AssessmentGLAD;