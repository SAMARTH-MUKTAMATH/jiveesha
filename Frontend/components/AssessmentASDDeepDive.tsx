import React, { useState } from 'react';
import { 
  ArrowLeft, Save, Clock, CheckCircle2, Video, 
  ChevronRight, Info, AlertTriangle, Play, Pause,
  Mic, Camera, Maximize2, SkipForward, AlertCircle,
  FileText, ListChecks, MessageSquare, BarChart3, Settings,
  ChevronDown, Plus
} from 'lucide-react';

interface AssessmentASDDeepDiveProps {
  onExit: () => void;
}

const AssessmentASDDeepDive: React.FC<AssessmentASDDeepDiveProps> = ({ onExit }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(50);
  const [selectedBehaviors, setSelectedBehaviors] = useState<string[]>(['pointing', 'body-demo']);

  const toggleBehavior = (id: string) => {
    setSelectedBehaviors(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col animate-in fade-in duration-700 relative overflow-hidden">
      {/* Fixed Navigation Header */}
      <header className="sticky top-0 z-[100] bg-slate-900 text-white px-8 py-4 flex items-center justify-between border-b border-white/10 shadow-2xl">
         <div className="flex items-center gap-6">
            <button onClick={onExit} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors">
               <ArrowLeft size={18} /> Exit
            </button>
            <div className="h-6 w-px bg-white/20" />
            <div className="flex items-center gap-3">
               <h2 className="text-lg font-black tracking-tight text-white">ASD Deep-Dive</h2>
            </div>
         </div>
         
         <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg border-2 border-white/20 overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rivera" alt="Aarav" className="w-full h-full object-cover" />
               </div>
               <span className="text-sm font-bold text-slate-200">Aarav Kumar, 7 yrs</span>
            </div>
            <div className="flex items-center gap-2 text-blue-400 font-mono text-lg font-bold">
               <Clock size={18} /> 52:15
            </div>
            <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest transition-all">Save & Exit</button>
         </div>
      </header>

      {/* Breadcrumb Progress */}
      <div className="bg-white border-b border-slate-200 px-12 py-3 overflow-x-auto scrollbar-hide">
         <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-12">
            <div className="flex items-center gap-8 shrink-0">
               {[
                 { label: 'Social Interaction', status: 'done' },
                 { label: 'Communication', status: 'active' },
                 { label: 'Repetitive Behaviors', status: 'pending' },
                 { label: 'Sensory Processing', status: 'pending' }
               ].map((step, i) => (
                 <div key={i} className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${step.status === 'active' ? 'text-blue-600' : step.status === 'done' ? 'text-green-600' : 'text-slate-300'}`}>
                       <span className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${step.status === 'active' ? 'border-blue-600 bg-blue-600 text-white' : step.status === 'done' ? 'border-green-600 bg-green-50' : 'border-slate-200'}`}>
                          {step.status === 'done' ? <CheckCircle2 size={12} /> : i + 1}
                       </span>
                       {step.label}
                    </div>
                    {i < 3 && <ChevronRight size={14} className="text-slate-200" />}
                 </div>
               ))}
            </div>
            <div className="flex-1 max-w-[320px] flex items-center gap-4">
               <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: '50%' }} />
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase">50% Complete</span>
            </div>
         </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 overflow-y-auto">
         <div className="max-w-[1440px] mx-auto p-12 flex flex-col lg:flex-row gap-10">
            
            {/* Left Column - Main Content */}
            <div className="flex-1 space-y-10">
               {/* Section Header */}
               <div className="relative">
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-blue-600 rounded-full" />
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">Part 2 of 4</p>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight">Communication Assessment</h1>
                  <p className="mt-3 text-lg font-medium text-slate-500 leading-relaxed max-w-3xl">
                     Evaluate verbal and non-verbal communication patterns, language comprehension, and expressive abilities through structured interaction.
                  </p>
                  <div className="absolute top-0 right-0 pointer-events-none opacity-[0.03] select-none font-black text-[100px] -rotate-12">DEMO</div>
               </div>

               {/* Task Card */}
               <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-2xl shadow-slate-200/50 p-10 space-y-10">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">Observation Task</span>
                        <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded-md text-[9px] font-black uppercase tracking-widest border border-amber-100">Demo active</span>
                     </div>
                     <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors uppercase tracking-widest">
                        <Settings size={14} /> Protocol Settings
                     </button>
                  </div>

                  <div className="space-y-4">
                     <h3 className="text-2xl font-black text-slate-900 leading-tight">Observe the child's use of gestures and body language during interaction.</h3>
                     <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                        <button className="flex items-center justify-between w-full text-left group">
                           <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Info size={14} /> Task Instructions & Prompts</span>
                           <ChevronDown size={18} className="text-slate-300" />
                        </button>
                        <ul className="mt-4 space-y-3">
                           {[
                             'Ask the child to show you their favorite toy or an object in the room',
                             'Observe if they use pointing, showing, or other conventional gestures',
                             'Note if gestures are accompanied by spontaneous eye contact',
                             'Watch for idiosyncratic gestures (e.g., hand leading, unusual movements)'
                           ].map((item, i) => (
                             <li key={i} className="flex items-start gap-3 text-sm font-bold text-slate-500">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" /> {item}
                             </li>
                           ))}
                        </ul>
                     </div>
                  </div>

                  {/* Interactive Response Area */}
                  <div className="space-y-8">
                     <div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Select observed behaviors:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {[
                             { id: 'pointing', label: 'Uses pointing gesture appropriately', desc: 'Points with index finger to indicate interest' },
                             { id: 'showing', label: 'Shows objects to share interest', desc: 'Brings object to person to share experience' },
                             { id: 'body-demo', label: 'Uses own body to demonstrate', desc: 'Pulls hand of person to desired object' },
                             { id: 'vocal-comb', label: 'Combines gesture with vocalization', desc: 'Uses sound/words while gesturing' },
                             { id: 'conventional', label: 'Uses conventional gestures', desc: 'Waves, nods, shakes head normally' },
                             { id: 'unusual', label: 'Unusual or repetitive gestures', desc: 'Stereotyped movements while interacting' }
                           ].map((item) => (
                             <button 
                                key={item.id}
                                onClick={() => toggleBehavior(item.id)}
                                className={`flex items-start gap-4 p-5 rounded-3xl border-2 transition-all text-left ${
                                  selectedBehaviors.includes(item.id) 
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200' 
                                    : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:bg-blue-50/30'
                                }`}
                             >
                                <div className={`w-6 h-6 rounded-lg border-2 shrink-0 flex items-center justify-center transition-colors ${
                                  selectedBehaviors.includes(item.id) ? 'bg-white border-white text-blue-600' : 'bg-slate-50 border-slate-200'
                                }`}>
                                   {selectedBehaviors.includes(item.id) && <CheckCircle2 size={16} />}
                                </div>
                                <div>
                                   <p className="text-sm font-black uppercase tracking-tight">{item.label}</p>
                                   <p className={`text-[10px] font-bold mt-1 leading-tight ${selectedBehaviors.includes(item.id) ? 'text-blue-100 opacity-80' : 'text-slate-400'}`}>{item.desc}</p>
                                </div>
                             </button>
                           ))}
                        </div>
                     </div>

                     {/* Sliders for selected */}
                     {selectedBehaviors.length > 0 && (
                       <div className="space-y-6 pt-6 border-t border-slate-50 animate-in slide-in-from-top-4 duration-500">
                          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Rate frequency of selected behaviors:</h4>
                          {selectedBehaviors.map(id => (
                            <div key={id} className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center gap-8">
                               <span className="text-sm font-black text-slate-700 w-full md:w-56 uppercase tracking-tight">
                                  {id === 'pointing' ? 'Pointing gesture' : id === 'body-demo' ? 'Body demonstration' : 'Behavior observed'}
                               </span>
                               <div className="flex-1 space-y-4">
                                  <div className="relative h-2 bg-slate-200 rounded-full">
                                     <div className="absolute inset-y-0 left-0 bg-blue-500 rounded-full" style={{ width: '60%' }} />
                                     <div className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white border-4 border-blue-500 rounded-full shadow-lg" />
                                  </div>
                                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                     <span>Never</span><span>Rarely</span><span className="text-blue-600">Sometimes</span><span>Often</span><span>Always</span>
                                  </div>
                               </div>
                            </div>
                          ))}
                       </div>
                     )}
                  </div>

                  {/* Video Analysis Area */}
                  <div className="space-y-6 pt-10 border-t border-slate-50">
                     <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           Video Evidence Analysis <Maximize2 size={14} className="text-slate-300" />
                        </h4>
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest italic opacity-60">Playback Simulated</span>
                     </div>
                     
                     <div className="relative group overflow-hidden rounded-[2.5rem] bg-slate-900 aspect-video shadow-2xl">
                        {/* Mock Video UI */}
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="w-20 h-20 bg-white/20 hover:bg-white/30 backdrop-blur-xl rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-90" onClick={() => setIsPlaying(!isPlaying)}>
                              {isPlaying ? <Pause size={32} className="text-white fill-white" /> : <Play size={32} className="text-white fill-white ml-2" />}
                           </div>
                        </div>
                        
                        {/* Video Watermark */}
                        <div className="absolute top-6 left-6 flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">
                           <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> DEMO VIDEO - Sample footage
                        </div>

                        {/* Video Controls */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 space-y-4 translate-y-2 group-hover:translate-y-0 transition-transform">
                           <div className="flex items-center gap-4 text-white font-mono text-xs">
                              <span>02:15</span>
                              <div className="flex-1 h-1.5 bg-white/20 rounded-full relative overflow-hidden">
                                 <div className="h-full bg-blue-500" style={{ width: '25%' }} />
                                 <div className="absolute left-[15%] top-0 bottom-0 w-1 bg-white shadow-[0_0_8px_white]" />
                                 <div className="absolute left-[45%] top-0 bottom-0 w-1 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                              </div>
                              <span>12:00</span>
                           </div>
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                 <button className="p-2 text-white/60 hover:text-white transition-colors"><Mic size={18} /></button>
                                 <button className="p-2 text-white/60 hover:text-white transition-colors"><Camera size={18} /></button>
                              </div>
                              <div className="flex items-center gap-3">
                                 <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Mark Timestamp</button>
                                 <button className="px-4 py-2 bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10">Capture Screenshot</button>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-4">
                           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                              <span className="text-xs font-black">02:15</span>
                           </div>
                           <p className="text-xs font-bold text-blue-900 uppercase tracking-tight">Pointing gesture observed during task</p>
                        </div>
                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-4">
                           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-600 shadow-sm">
                              <span className="text-xs font-black">05:32</span>
                           </div>
                           <p className="text-xs font-bold text-amber-900 uppercase tracking-tight">Combined gesture with vocalization</p>
                        </div>
                     </div>
                  </div>

                  {/* Observations Note Area */}
                  <div className="space-y-4 pt-10 border-t border-slate-50">
                     <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Clinical Observations</h4>
                     <div className="p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] relative group">
                        <p className="text-sm font-semibold text-slate-600 leading-relaxed italic mb-4">
                           "Child demonstrated intermittent pointing gestures, primarily when requesting objects. Limited use of showing gestures to share interest. Gestures not consistently paired with eye contact. No conventional waving or nodding observed during this sequence..."
                        </p>
                        <div className="flex items-center gap-4 text-slate-300">
                           <span className="text-[10px] font-black uppercase tracking-widest">Rich Text Editor Simulated</span>
                           <div className="flex-1 h-px bg-slate-100" />
                           <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline">Edit Entry</button>
                        </div>
                     </div>
                  </div>

                  {/* Scoring Mini Chart */}
                  <div className="pt-10 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-10">
                     <div className="flex-1 space-y-4 w-full">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Communication Domain Score</h4>
                        <div className="flex items-end gap-1.5">
                           <span className="text-5xl font-black text-slate-900 tracking-tighter">24</span>
                           <span className="text-xl font-black text-slate-300 mb-1.5">/ 35</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[9px] font-black uppercase tracking-widest">Subject to review</span>
                           <span className="text-[10px] font-bold text-slate-400 italic">Auto-calculated based on observations</span>
                        </div>
                     </div>
                     <div className="w-full md:w-64 space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           <span>Comparison vs Norms</span>
                           <span className="text-blue-600">Concern Area</span>
                        </div>
                        <div className="relative h-12 flex items-end justify-between px-2 pb-1 border-b border-slate-100">
                           <div className="absolute inset-0 flex justify-between px-0">
                              <div className="h-full w-20 bg-blue-50 rounded-t-lg" />
                              <div className="h-full w-24 bg-green-50 rounded-t-lg" />
                           </div>
                           <div className="w-3 h-full bg-blue-600 rounded-t-full relative z-10 mx-auto border-2 border-white shadow-lg" style={{ height: '70%' }} />
                           <div className="absolute top-0 left-0 w-full flex justify-between px-2 text-[8px] font-black text-slate-300 uppercase mt-1">
                              <span>7-9 mo</span><span>7 yrs</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Right Sidebar - Logic & Tracker */}
            <aside className="w-full lg:w-[320px] shrink-0 space-y-8 sticky top-28 h-fit">
               <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm">
                  <div className="flex items-center justify-between">
                     <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Section Progress</h3>
                     <span className="text-[10px] font-black text-blue-600">57%</span>
                  </div>
                  <div className="space-y-3">
                     {[
                       { label: 'Gestural Communication', status: 'done' },
                       { label: 'Eye Contact Assessment', status: 'done' },
                       { label: 'Facial Expression', status: 'done' },
                       { label: 'Non-verbal Comm', status: 'active' },
                       { label: 'Verbal Communication', status: 'pending' },
                       { label: 'Comprehension Testing', status: 'pending' },
                       { label: 'Pragmatic Language', status: 'pending' }
                     ].map((item, i) => (
                       <div key={i} className="flex items-center gap-3">
                          {item.status === 'done' ? <CheckCircle2 size={14} className="text-green-500" /> : item.status === 'active' ? <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-500 bg-blue-500 animate-pulse" /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-100" />}
                          <span className={`text-[11px] font-bold ${item.status === 'active' ? 'text-slate-900' : item.status === 'done' ? 'text-slate-500' : 'text-slate-300'}`}>{item.label}</span>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative shadow-xl shadow-slate-200">
                  <div className="absolute top-[-10%] right-[-5%] w-32 h-32 bg-white/5 rounded-full blur-3xl" />
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 relative z-10">DSM-5 ASD Criteria</h3>
                  
                  <div className="space-y-6 relative z-10">
                     <div className="space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                           <span>A. Social Comm</span>
                           <span className="text-blue-400">3 of 3 REQUIRED</span>
                        </div>
                        <div className="space-y-2">
                           <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 border-b border-white/5 pb-1">
                              <span>A1: Reciprocity</span>
                              <span className="text-amber-500">⚠ CONCERN</span>
                           </div>
                           <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 border-b border-white/5 pb-1">
                              <span>A2: Nonverbal</span>
                              <span className="text-amber-500">⚠ CONCERN</span>
                           </div>
                           <div className="flex items-center justify-between text-[9px] font-bold text-slate-400">
                              <span>A3: Relationships</span>
                              <span className="text-amber-500">⚠ CONCERN</span>
                           </div>
                        </div>
                        <div className="mt-4 px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-[9px] font-black uppercase tracking-widest text-center border border-green-500/20">Criteria A Met</div>
                     </div>

                     <div className="space-y-3 pt-4 border-t border-white/5">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                           <span>B. Restricted/Rep</span>
                           <span className="text-slate-500">2 of 4 REQUIRED</span>
                        </div>
                        <p className="text-[9px] font-bold text-slate-600 uppercase italic">Assessment in progress...</p>
                     </div>
                  </div>
               </div>

               <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Evidence Log (5)</h3>
                  <div className="space-y-4">
                     {[
                       { type: 'Video', time: '52:15', desc: 'Gestural comm sample' },
                       { type: 'Screenshot', time: '48:30', desc: 'Pointing behavior' },
                       { type: 'Audio', time: '45:12', desc: 'Clinical obs', dur: '0:45' }
                     ].map((item, i) => (
                       <div key={i} className="flex gap-4 p-3 bg-slate-50 rounded-2xl group hover:bg-blue-50 transition-all cursor-pointer">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 shadow-sm shrink-0">
                             {item.type === 'Video' ? <Video size={16} /> : item.type === 'Screenshot' ? <Camera size={16} /> : <Mic size={16} />}
                          </div>
                          <div>
                             <div className="flex justify-between w-full">
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{item.time}</span>
                             </div>
                             <p className="text-[10px] font-black text-slate-700 leading-tight mt-0.5">{item.desc}</p>
                          </div>
                       </div>
                     ))}
                  </div>
                  <button className="w-full text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View Full Evidence Gallery</button>
               </div>
            </aside>
         </div>
      </div>

      {/* Navigation Fixed Bar */}
      <footer className="h-24 bg-white border-t border-slate-200 px-12 z-[110] shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
         <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between">
            <button className="h-14 px-10 border-2 border-slate-100 rounded-2xl text-sm font-black text-slate-500 hover:border-slate-300 hover:text-slate-800 uppercase tracking-widest transition-all flex items-center gap-3">
               <ArrowLeft size={18} /> Previous Task
            </button>
            
            <div className="flex items-center gap-6">
               <button className="flex items-center gap-2 text-xs font-black text-slate-300 uppercase tracking-widest hover:text-slate-600 transition-colors">
                  <SkipForward size={16} /> Skip Task
               </button>
               <div className="h-14 w-px bg-slate-100" />
               <button className="h-14 px-12 bg-blue-600 text-white rounded-2xl text-sm font-black uppercase tracking-[0.1em] shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3">
                  Next Task: Verbal Comm <ChevronRight size={20} />
               </button>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default AssessmentASDDeepDive;