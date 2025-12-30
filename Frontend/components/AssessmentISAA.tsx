import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Save, Clock, CheckCircle2, ChevronDown, 
  Video, Camera, Mic, ChevronRight, Info, AlertTriangle,
  Play, Trash2, Flag, FileText, LayoutList, Search, MessageSquare,
  HelpCircle, Plus, ArrowRight
} from 'lucide-react';

const TrendingUpIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

interface AssessmentISAAProps {
  onExit: () => void;
}

const AssessmentISAA: React.FC<AssessmentISAAProps> = ({ onExit }) => {
  const [currentResponse, setCurrentResponse] = useState<number | null>(2);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [showJointAttentionInfo, setShowJointAttentionInfo] = useState(false);
  const [seconds, setSeconds] = useState(1725); // 28:45

  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const responseOptions = [
    { value: 0, label: 'Never/Not at all', sub: 'Never observed or completely absent' },
    { value: 1, label: 'Rarely', sub: 'Occasionally, very inconsistent' },
    { value: 2, label: 'Sometimes', sub: 'Moderately present, inconsistent' },
    { value: 3, label: 'Often', sub: 'Frequently present, fairly consistent' },
    { value: 4, label: 'Always', sub: 'Consistently present, age-appropriate' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col animate-in fade-in duration-500 relative pb-24">
      {/* Fixed Header */}
      <header className="sticky top-0 z-[100] bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <button onClick={onExit} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={18} /> Exit Assessment
        </button>
        <div className="flex items-center gap-3">
           <h2 className="text-lg font-black text-slate-900 tracking-tight">ISAA Assessment</h2>
        </div>
        <div className="flex items-center gap-4">
           <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Auto-saved 30s ago
           </span>
           <button className="px-5 py-2 border-2 border-slate-100 rounded-xl text-xs font-black text-slate-600 hover:border-blue-200 hover:text-blue-600 uppercase tracking-widest transition-all">Save & Exit</button>
        </div>
      </header>

      {/* Session Info Bar */}
      <div className="bg-slate-50 border-b border-slate-100 px-12 py-4 flex items-center justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
         <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
               <div className="w-7 h-7 rounded-lg overflow-hidden border-2 border-white shadow-sm">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rivera" alt="Aarav" className="w-full h-full object-cover" />
               </div>
               <span className="text-slate-700">Aarav Kumar, 7 yrs <span className="text-slate-300 ml-1">#DAI-8291</span></span>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
               <FileText size={14} className="text-slate-300" />
               <span>Indian Scale for Assessment of Autism</span>
            </div>
         </div>
         <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><Clock size={14} className="text-slate-300" /> Session Duration: <span className="text-slate-800 tabular-nums">{formatTime(seconds)}</span></span>
         </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-[1440px] mx-auto w-full px-12 mt-8 flex flex-col lg:flex-row gap-8 items-start">
         
         {/* Left Sidebar - Progress */}
         <aside className="w-full lg:w-[280px] shrink-0 sticky top-36 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 overflow-hidden relative">
               {/* Vertical Watermark */}
               <div className="absolute top-0 right-0 h-full flex items-center justify-center pointer-events-none opacity-[0.03] rotate-180">
                  <p className="font-black text-4xl uppercase tracking-[1rem] [writing-mode:vertical-rl]">DEMO DATA</p>
               </div>

               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Assessment Progress</h3>
               
               <div className="flex items-center justify-center mb-8 relative">
                  <svg className="w-24 h-24 transform -rotate-90">
                     <circle cx="48" cy="48" r="42" fill="transparent" stroke="currentColor" strokeWidth="6" className="text-slate-100" />
                     <circle cx="48" cy="48" r="42" fill="transparent" stroke="currentColor" strokeWidth="6" strokeDasharray="263.8" strokeDashoffset={263.8 - (263.8 * 0.68)} className="text-blue-500" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-xl font-black text-slate-800">68%</span>
                     <span className="text-[9px] font-black text-slate-400 uppercase">Complete</span>
                  </div>
               </div>

               <div className="space-y-4">
                  {[
                    { title: 'Gross Motor Skills', status: '✓ Complete', count: '8/8', color: 'text-green-600', dot: 'bg-green-500' },
                    { title: 'Fine Motor Skills', status: '✓ Complete', count: '8/8', color: 'text-green-600', dot: 'bg-green-500' },
                    { title: 'Social Interaction', status: '● In Progress', count: '5/8', active: true, color: 'text-blue-600', dot: 'bg-blue-500 animate-pulse' },
                    { title: 'Language', status: '○ Not Started', count: '0/8', color: 'text-slate-400', dot: 'border-2 border-slate-200' },
                    { title: 'Self-Help Skills', status: '○ Not Started', count: '0/8', color: 'text-slate-400', dot: 'border-2 border-slate-200' },
                  ].map((s, i) => (
                    <div key={i} className={`p-4 rounded-2xl border transition-all ${s.active ? 'bg-blue-50 border-blue-200' : 'bg-slate-50/50 border-slate-100'}`}>
                       <div className="flex items-center gap-3 mb-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
                          <h4 className="text-xs font-black text-slate-800 tracking-tight leading-tight">{s.title}</h4>
                       </div>
                       <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                          <span className={s.color}>{s.status}</span>
                          <span className="text-slate-400">{s.count}</span>
                       </div>
                       {s.active && (
                          <div className="mt-4 space-y-2.5">
                             {[1,2,3,4,5,6,7,8].map(q => (
                               <div key={q} className={`flex items-center gap-2 text-[10px] font-bold ${q < 6 ? 'text-green-600' : q === 6 ? 'text-blue-600 ring-2 ring-blue-100 px-2 py-1 rounded-lg bg-white' : 'text-slate-400'}`}>
                                  {q < 6 ? <CheckCircle2 size={12} /> : <div className={`w-2 h-2 rounded-full border-2 ${q === 6 ? 'bg-blue-500 border-blue-500' : 'border-slate-200'}`} />}
                                  Q{q}: {q === 6 ? 'Joint attention' : 'Sub-item'}
                               </div>
                             ))}
                          </div>
                       )}
                    </div>
                  ))}
               </div>
            </div>

            <button className="w-full flex items-center justify-between px-6 py-4 bg-white rounded-2xl border border-slate-200 text-xs font-black text-slate-600 uppercase tracking-widest hover:border-blue-200 transition-all group">
               Jump to Section <ChevronDown size={16} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
            </button>
         </aside>

         {/* Center Content - The Question */}
         <div className="flex-1 space-y-8 pb-20">
            {/* Demo Persistent Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
               <span className="p-2 bg-amber-100 text-amber-600 rounded-xl"><AlertTriangle size={20} /></span>
            </div>

            {/* Main Question Card */}
            <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-12 shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
               {/* Watermark Diagonal */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] select-none font-black text-[180px] -rotate-[35deg] z-0">
                  DEMO
               </div>

               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-10">
                     <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] border border-blue-100">Question 6 of 40</span>
                     <span className="px-4 py-1.5 bg-purple-50 text-purple-600 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] border border-purple-100">Social Interaction</span>
                  </div>

                  <h1 className="text-3xl font-black text-slate-900 leading-[1.3] mb-8">
                     Does the child show joint attention (e.g., follows pointing gesture, shows interest in what others are looking at)?
                  </h1>

                  {/* Language Toggle & Translation */}
                  <div className="flex flex-col gap-6 mb-12">
                     <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                        <button 
                           onClick={() => setLanguage('en')}
                           className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${language === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                           English
                        </button>
                        <button 
                           onClick={() => setLanguage('hi')}
                           className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${language === 'hi' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                           हिंदी
                        </button>
                     </div>
                     
                     <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] italic">
                        <div className="flex items-center justify-between mb-2">
                           <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Hindi Translation</span>
                           <button className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline">
                              <Play size={14} className="fill-blue-600" /> Listen to Question
                           </button>
                        </div>
                        <p className="text-xl font-bold text-slate-400/80">
                           "क्या बच्चा संयुक्त ध्यान दिखाता है (जैसे, इशारा करने वाली दिशा का अनुसरण करता है, दूसरों की रुचि वाली चीजों में रुचि दिखाता है)?"
                        </p>
                     </div>
                  </div>

                  {/* Clinical Context */}
                  <div className="mb-12">
                     <button 
                        onClick={() => setShowJointAttentionInfo(!showJointAttentionInfo)}
                        className="flex items-center justify-between w-full px-6 py-4 bg-blue-50/30 rounded-2xl text-sm font-black text-blue-900 uppercase tracking-widest hover:bg-blue-50 transition-all border border-blue-100/50"
                     >
                        <span className="flex items-center gap-3"><Info size={18} /> What is Joint Attention?</span>
                        <ChevronDown size={20} className={`transition-transform ${showJointAttentionInfo ? 'rotate-180' : ''}`} />
                     </button>
                     {showJointAttentionInfo && (
                        <div className="mt-4 p-8 bg-blue-50/20 border-l-4 border-blue-500 rounded-2xl animate-in slide-in-from-top-4 duration-300">
                           <p className="text-base font-semibold text-slate-600 leading-relaxed">
                              Joint attention is the ability to share focus on an object or event with another person. It's a foundational skill for social communication and typically develops around 9-12 months.
                           </p>
                           <ul className="mt-6 space-y-3">
                              {[
                                'Child follows when you point at something',
                                'Shows you a toy just to share interest (not just requesting)',
                                'Alternates eye contact between you and an interesting object'
                              ].map((ex, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm font-bold text-slate-500">
                                   <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" /> {ex}
                                </li>
                              ))}
                           </ul>
                        </div>
                     )}
                  </div>

                  {/* Likert Scale */}
                  <div className="mb-12">
                     <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2rem] mb-10 text-center">Select Clinical Observation Score</h3>
                     <div className="grid grid-cols-5 gap-4">
                        {responseOptions.map((opt) => (
                          <button 
                             key={opt.value}
                             onClick={() => setCurrentResponse(opt.value)}
                             className={`relative flex flex-col items-center p-6 rounded-[2rem] border-2 transition-all group/opt ${
                               currentResponse === opt.value 
                                 ? 'bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-300 -translate-y-2' 
                                 : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:bg-blue-50/30'
                             }`}
                          >
                             {currentResponse === opt.value && (
                               <div className="absolute -top-3 bg-green-500 text-white p-1 rounded-full border-2 border-white shadow-lg animate-in zoom-in duration-300">
                                  <CheckCircle2 size={16} />
                               </div>
                             )}
                             
                             <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 border-4 transition-all ${
                               currentResponse === opt.value ? 'bg-white/20 border-white/40' : 'bg-slate-50 border-slate-100 group-hover/opt:border-blue-100'
                             }`}>
                                <span className="text-2xl font-black">{opt.value}</span>
                             </div>

                             <h4 className="text-sm font-black mb-2 uppercase tracking-widest">{opt.label}</h4>
                             <p className={`text-[10px] font-bold text-center leading-tight opacity-70 ${currentResponse === opt.value ? 'text-blue-50' : 'text-slate-400'}`}>
                                {opt.sub}
                             </p>
                          </button>
                        ))}
                     </div>
                     <div className="mt-10 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-700" style={{ width: `${(currentResponse || 0) * 25}%` }} />
                     </div>
                  </div>

                  {/* Observations Text Area */}
                  <div className="mb-12">
                     <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Clinical Observations (Optional)</h3>
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">0 / 500 characters</span>
                     </div>
                     <div className="relative group">
                        <textarea 
                           placeholder="Add specific observations, context, or behavioral notes for this response..."
                           className="w-full h-32 p-6 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] text-sm font-semibold text-slate-700 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none"
                        ></textarea>
                     </div>
                  </div>

                  {/* Evidence Capture */}
                  <div>
                     <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           Supporting Evidence <HelpCircle size={14} className="text-slate-300" />
                        </h3>
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded text-[9px] font-black uppercase tracking-widest">Uploads Simulated in Demo</span>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { icon: <Video size={24} />, label: 'Record Video', sub: 'Capture behavior in context' },
                          { icon: <Camera size={24} />, label: 'Take Photo', sub: 'Capture visual evidence' },
                          { icon: <Mic size={24} />, label: 'Audio Note', sub: 'Quick voice observation' }
                        ].map((opt, i) => (
                          <button key={i} className="flex flex-col items-center gap-3 p-6 bg-white border-2 border-slate-100 rounded-[2rem] hover:border-blue-300 hover:bg-blue-50/50 transition-all group/cap">
                             <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover/cap:bg-blue-100 group-hover/cap:text-blue-600 transition-colors">
                                {opt.icon}
                             </div>
                             <div className="text-center">
                                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">{opt.label}</h4>
                                <p className="text-[10px] font-bold text-slate-400 mt-1">{opt.sub}</p>
                             </div>
                             <span className="mt-2 text-[9px] font-black text-blue-500/40 uppercase tracking-widest italic group-hover/cap:text-blue-500">Click to Simulate</span>
                          </button>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* Previous Response Comparison */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center">
                     <Search size={24} />
                  </div>
                  <div>
                     <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Compare with Previous</h4>
                     <p className="text-xs font-bold text-slate-400 mt-1">Last assessment: Sep 2024</p>
                  </div>
               </div>
               <div className="flex items-center gap-8">
                  <div className="text-center">
                     <p className="text-[10px] font-black text-slate-300 uppercase mb-1">Sep Response</p>
                     <p className="text-lg font-black text-slate-400">1 - Rarely</p>
                  </div>
                  <ChevronRight size={24} className="text-slate-200" />
                  <div className="text-center">
                     <p className="text-[10px] font-black text-blue-400 uppercase mb-1">Current</p>
                     <p className="text-lg font-black text-blue-600">2 - Sometimes</p>
                  </div>
                  <div className="px-4 py-2 bg-green-50 text-green-700 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-green-100">
                     <TrendingUpIcon size={14} /> Improvement
                  </div>
               </div>
            </div>
         </div>

         {/* Right Sidebar - Observations & Criteria */}
         <aside className="w-full lg:w-[320px] shrink-0 sticky top-36 space-y-8">
            {/* Clinical Notes Summary */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 overflow-hidden relative">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Live Observations</h3>
                  <button className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"><Plus size={16} /></button>
               </div>
               
               <div className="space-y-6 relative">
                  <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-50" />
                  {[
                    { time: '28:34', text: 'Child showed consistent pointing behavior when engaging with parent', by: 'You' },
                    { time: '15:22', text: 'Started assessment after 10-min rapport building', by: 'You', demo: true }
                  ].map((note, i) => (
                    <div key={i} className="flex gap-4 relative z-10">
                       <div className="w-4 h-4 rounded-full bg-blue-500 ring-4 ring-white shrink-0 mt-1" />
                       <div className="flex-1">
                          <div className="flex justify-between text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">
                             <span>Time {note.time}</span>
                             {note.demo && <span className="text-amber-500">Demo</span>}
                          </div>
                          <p className="text-xs font-bold text-slate-600 leading-relaxed italic">"{note.text}"</p>
                       </div>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-8 py-3 bg-slate-50 rounded-xl text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors">Add Timestamped Note</button>
            </div>

            {/* DSM-5 Alignment */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative shadow-xl shadow-slate-200">
               <div className="absolute top-[-10%] right-[-5%] w-32 h-32 bg-white/5 rounded-full blur-3xl" />
               <div className="flex items-center justify-between mb-8 relative z-10">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">DSM-5 Alignment</h3>
                  <Info size={16} className="text-slate-500" />
               </div>
               
               <div className="space-y-6 relative z-10">
                  <div className="space-y-3">
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span>Social Communication</span>
                        <span className="text-blue-400">3 / 6 MET</span>
                     </div>
                     <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]" style={{ width: '50%' }} />
                     </div>
                  </div>
                  <div className="space-y-3">
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span>Repetitive Behaviors</span>
                        <span className="text-purple-400">2 / 4 MET</span>
                     </div>
                     <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.5)]" style={{ width: '50%' }} />
                     </div>
                  </div>
               </div>
               <p className="mt-8 text-[9px] font-black text-slate-500 uppercase tracking-[0.1em] text-center italic">Tracking live based on responses</p>
            </div>

            {/* Quick Session Stats */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Session Summary</h3>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-2xl">
                     <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Answered</p>
                     <p className="text-xl font-black text-slate-800">27 / 40</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl">
                     <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Flagged</p>
                     <p className="text-xl font-black text-red-500">2</p>
                  </div>
               </div>
               <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-2xl border border-blue-50">
                  <Video size={16} className="text-blue-500" />
                  <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest">3 Videos, 2 Photos captured</span>
               </div>
            </div>
         </aside>

      </div>

      {/* Navigation Persistent Bar */}
      <footer className="fixed bottom-0 left-0 right-0 h-24 bg-white/80 backdrop-blur-xl border-t border-slate-200 z-[110] px-12">
         <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between">
            <div className="flex items-center gap-6">
               <button className="h-14 px-8 border-2 border-slate-100 rounded-2xl text-sm font-black text-slate-500 hover:border-slate-300 hover:text-slate-800 uppercase tracking-widest transition-all flex items-center gap-2">
                  <ArrowLeft size={18} /> Previous
               </button>
               <button className="flex flex-col items-center gap-1 group">
                  <Flag size={20} className="text-slate-300 group-hover:text-red-500 transition-colors" />
                  <span className="text-[9px] font-black text-slate-400 uppercase group-hover:text-slate-600 transition-colors">Flag for Review</span>
               </button>
            </div>
            
            <div className="flex flex-col items-center gap-2">
               <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2rem]">Question 6 of 40 • 15% COMPLETE</p>
               <div className="flex gap-1.5">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full transition-all duration-500 ${i < 5 ? 'bg-green-500' : i === 5 ? 'bg-blue-600 scale-125 ring-4 ring-blue-100' : 'bg-slate-100'}`} />
                  ))}
               </div>
               <p className="text-[9px] font-bold text-slate-300 uppercase mt-1">Use arrow keys to navigate</p>
            </div>

            <div className="flex items-center gap-6">
               <button className="flex items-center gap-2 text-xs font-black text-slate-300 uppercase tracking-widest hover:text-blue-600 transition-colors">
                  <LayoutList size={20} className="text-slate-300" />
                  <span className="uppercase group-hover:text-slate-600">View All</span>
               </button>
               <button className="h-14 px-10 bg-blue-600 text-white rounded-2xl text-sm font-black uppercase tracking-[0.1rem] shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3">
                  Next Question <ArrowRight size={20} />
               </button>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default AssessmentISAA;