
import React, { useState } from 'react';
import {
   ClipboardList, BookOpen, Brain, Activity,
   MessageSquare, ChevronRight, Star, Clock,
   User, CheckCircle2, AlertTriangle, Info,
   ChevronDown, ArrowRight, PlayCircle, HelpCircle,
   BarChart3, LayoutGrid, Search
} from 'lucide-react';

interface DiagnosticSuiteProps {
   onBack: () => void;
   onStartAssessment?: (protocolId: string) => void;
   onViewResults?: () => void;
}

const DiagnosticSuite: React.FC<DiagnosticSuiteProps> = ({ onBack, onStartAssessment, onViewResults }) => {
   const [activeFilter, setActiveFilter] = useState('All Assessments');
   const [expandedDomains, setExpandedDomains] = useState<string | null>(null);

   const protocols = [
      {
         id: 'isaa',
         recommended: true,
         icon: <ClipboardList size={40} />,
         iconColor: 'bg-purple-100 text-purple-600',
         title: 'ISAA',
         fullName: 'Indian Scale for Assessment of Autism',
         validation: '✓ NIEPID Validated',
         age: '3-22 years',
         time: '45-60 minutes',
         domains: ['Gross Motor Skills', 'Fine Motor Skills', 'Social Interaction', 'Language & Communication', 'Self-Help Skills'],
         description: 'Comprehensive assessment tool for autism spectrum disorders. ISAA provides detailed scoring across developmental domains with age-appropriate benchmarks.',
         scoring: '0-4 Likert scale per item',
         items: '40 questions',
         output: 'Severity classification + profile',
         status: 'Completed Oct 20',
         statusColor: 'bg-green-100 text-green-700',
         progress: 100
      },
      {
         id: 'glad',
         icon: <BookOpen size={40} />,
         iconColor: 'bg-teal-100 text-teal-600',
         title: 'GLAD',
         fullName: 'Graded Learning Assessment for Dyslexia',
         validation: '✓ NIEPID Validated',
         age: '5-18 years',
         time: '60-90 minutes',
         domainsCount: '20 domains',
         description: 'Complete assessment for Specific Learning Disabilities (SLD) with focus on reading, writing, and mathematical domains.',
         scoring: 'Performance vs grade-level',
         items: 'Multiple test batteries',
         output: 'Cognitive profile + recommendations',
         status: 'Not Started',
         statusColor: 'bg-slate-100 text-slate-500'
      },
      {
         id: 'adhd',
         icon: <Brain size={40} />,
         iconColor: 'bg-orange-100 text-orange-600',
         title: 'ADHD Assessment',
         fullName: 'Comprehensive ADHD Evaluation Protocol',
         validation: '✓ DSM-5 Aligned',
         age: '4-17 years',
         time: '30-45 minutes',
         domainsCount: '3 core areas',
         description: 'Validated ADHD assessment questionnaire aligned with DSM-5 criteria. Includes parent and teacher rating scales.',
         scoring: 'Frequency-based rating',
         items: 'Varies by age',
         output: 'DSM-5 criteria tracker',
         status: 'Not Started',
         statusColor: 'bg-slate-100 text-slate-500'
      },
      {
         id: 'asd-deep',
         icon: <LayoutGrid size={40} />,
         iconColor: 'bg-indigo-100 text-indigo-600',
         title: 'ASD Deep-Dive',
         fullName: 'Comprehensive Autism Spectrum Evaluation',
         validation: '✓ Multi-Modal Clinical Tool',
         age: '2-12 years',
         time: '90-120 minutes',
         domainsCount: '4 behavioral areas + sensory',
         description: 'In-depth autism assessment with behavioral observation, video analysis, and structured tasks. Ideal for diagnostic clarification.',
         scoring: 'Observation-based metrics',
         items: 'Comprehensive protocol',
         output: 'Multi-modal diagnostic report',
         status: 'Not Started',
         statusColor: 'bg-slate-100 text-slate-500'
      },
      {
         id: 'nabs',
         icon: <Activity size={40} />,
         iconColor: 'bg-blue-100 text-blue-600',
         title: 'NABS',
         fullName: 'NIMHANS Adaptive Behavior Scale',
         validation: '✓ NIMHANS Standardized',
         age: '1-20 years',
         time: '40-50 minutes',
         domainsCount: 'Adaptive functioning',
         description: 'Standardized scale for assessing adaptive behaviors in children and adolescents, mapped to independent living goals.',
         scoring: 'Skill-based proficiency',
         items: 'Domain-specific tasks',
         output: 'Functional independence map',
         status: 'Not Started',
         statusColor: 'bg-slate-100 text-slate-500'
      },
      {
         id: 'speech',
         icon: <MessageSquare size={40} />,
         iconColor: 'bg-purple-100 text-purple-600',
         title: 'Speech & Language',
         fullName: 'Comprehensive Communication Assessment',
         validation: '✓ Clinical Protocol',
         age: '1-10 years',
         time: '45-60 minutes',
         domainsCount: '4 core communication areas',
         description: 'Assessment of receptive and expressive language, articulation, and pragmatic communication skills.',
         scoring: 'Standardized language scores',
         items: 'Play-based & structured',
         output: 'Communication profile',
         status: 'Not Started',
         statusColor: 'bg-slate-100 text-slate-500'
      }
   ];

   return (
      <div className="w-full animate-in fade-in duration-500 pb-20 relative overflow-hidden">

         {/* Header Section */}
         <div className="bg-white border-b border-slate-100">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8">
               <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                  <div>
                     <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                        <button onClick={onBack} className="hover:text-[#2563EB]">Dashboard</button>
                        <ChevronRight size={14} />
                        <span className="text-slate-800">Diagnostic Suite</span>
                     </nav>
                     <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Diagnostic Suite</h1>
                     <p className="text-slate-500 mt-1 font-medium">Select and conduct evidence-based assessments and protocols</p>
                  </div>
                  <div className="flex gap-4">
                     <div className="flex flex-col items-end gap-1.5">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Patient Context</p>
                        <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl group cursor-pointer hover:border-blue-300 transition-all shadow-sm">
                           <div className="w-8 h-8 rounded-lg bg-white border border-blue-200 overflow-hidden">
                              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rivera" alt="Aarav" className="w-full h-full object-cover" />
                           </div>
                           <div>
                              <p className="text-sm font-black text-blue-900">Aarav Kumar</p>
                              <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">#DAI-8291</p>
                           </div>
                           <ChevronDown size={14} className="text-blue-400 group-hover:text-blue-600" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mt-10">
            <div className="flex flex-col lg:flex-row gap-10">

               {/* Main Protocols Content */}
               <div className="flex-1 space-y-10">
                  {/* Filter Bar */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                     {['All Assessments', 'ASD', 'ADHD', 'SLD', 'Speech & Language', 'Motor Skills'].map(f => (
                        <button
                           key={f}
                           onClick={() => setActiveFilter(f)}
                           className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${activeFilter === f ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-lg shadow-blue-100' : 'bg-white text-slate-400 border-slate-100 hover:border-blue-200 hover:text-slate-600'
                              }`}
                        >
                           {f}
                        </button>
                     ))}
                  </div>

                  {/* In-Progress Section */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-bl-full -mr-20 -mt-20 blur-2xl" />
                     <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-6">
                           <span className="p-2 bg-white/20 rounded-xl"><Activity size={20} /></span>
                           <h2 className="text-xl font-black uppercase tracking-widest">In-Progress Assessments</h2>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 flex flex-col md:flex-row items-center justify-between gap-8">
                           <div className="flex-1 space-y-4 w-full">
                              <div className="flex items-center justify-between">
                                 <div>
                                    <h3 className="text-lg font-black tracking-tight">ISAA for Aarav Kumar</h3>
                                    <p className="text-blue-100/70 text-xs font-bold uppercase tracking-widest mt-0.5">Social Interaction (Domain 3 of 5)</p>
                                 </div>
                                 <span className="text-sm font-black">68%</span>
                              </div>
                              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                 <div className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" style={{ width: '68%' }} />
                              </div>
                              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-blue-100/60">
                                 <span className="flex items-center gap-1"><CheckCircle2 size={12} /> Auto-saved</span>
                                 <span>Last saved: 2 hours ago</span>
                              </div>
                           </div>
                           <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
                              <button
                                 onClick={() => onStartAssessment?.('isaa')}
                                 className="w-full sm:w-auto h-12 px-8 bg-white text-blue-700 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/20"
                              >
                                 Continue Assessment
                              </button>
                              <button className="text-xs font-black text-blue-100/60 hover:text-white uppercase tracking-widest transition-colors">Start Over</button>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Protocol Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {protocols.map((p, i) => (
                        <div key={i} className="bg-white rounded-[2rem] border-2 border-slate-100 p-8 hover:border-[#2563EB] hover:shadow-2xl transition-all group relative overflow-hidden">
                           {/* Watermark */}
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] select-none font-black text-[120px] -rotate-45 z-0">
                              DEMO
                           </div>

                           <div className="relative z-10 flex flex-col h-full">
                              <div className="flex justify-between items-start mb-8">
                                 <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform ${p.iconColor}`}>
                                    {p.icon}
                                 </div>
                                 <div className="flex flex-col items-end gap-2">
                                    {p.recommended && (
                                       <span className="px-3 py-1 bg-green-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-100">Recommended</span>
                                    )}
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${p.statusColor}`}>{p.status}</span>
                                 </div>
                              </div>

                              <div className="mb-6">
                                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">{p.title}</h3>
                                 <p className="text-sm font-bold text-slate-400 leading-tight mt-1">{p.fullName}</p>
                                 <span className="inline-block mt-3 px-2 py-0.5 bg-green-50 text-green-600 rounded-md text-[9px] font-black uppercase tracking-widest border border-green-100">{p.validation}</span>
                              </div>

                              <div className="grid grid-cols-2 gap-y-4 mb-8 pt-6 border-t border-slate-50">
                                 <div className="flex items-center gap-2">
                                    <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><User size={14} /></span>
                                    <span className="text-xs font-bold text-slate-600">{p.age}</span>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Clock size={14} /></span>
                                    <span className="text-xs font-bold text-slate-600">{p.time}</span>
                                 </div>
                                 <div className="col-span-2 flex flex-wrap gap-2">
                                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
                                       <BarChart3 size={14} className="text-slate-400" />
                                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{p.domains ? '5 Domains' : p.domainsCount}</span>
                                    </div>
                                    <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 rounded-lg border border-amber-100">
                                       {[...Array(5)].map((_, i) => <Star key={i} size={10} className={`${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />)}
                                       <span className="text-[9px] font-black text-amber-700 uppercase ml-1">Gold Standard</span>
                                    </div>
                                 </div>
                              </div>

                              {p.domains && (
                                 <div className="mb-6">
                                    <button
                                       onClick={() => setExpandedDomains(expandedDomains === p.id ? null : p.id)}
                                       className="flex items-center justify-between w-full px-4 py-3 bg-slate-50/50 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
                                    >
                                       <span className="flex items-center gap-2"><ClipboardList size={14} /> View Domains</span>
                                       <ChevronDown size={14} className={`transition-transform ${expandedDomains === p.id ? 'rotate-180' : ''}`} />
                                    </button>
                                    {expandedDomains === p.id && (
                                       <div className="mt-3 space-y-2 p-2 animate-in slide-in-from-top-2 duration-300">
                                          {p.domains.map((d, di) => (
                                             <div key={di} className="flex items-center gap-2 text-[11px] font-bold text-slate-500 pl-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]/40" /> {d}
                                             </div>
                                          ))}
                                       </div>
                                    )}
                                 </div>
                              )}

                              <p className="text-sm font-semibold text-slate-500 leading-relaxed mb-8 flex-grow">
                                 {p.description}
                              </p>

                              <div className="bg-slate-50 p-4 rounded-2xl mb-8 space-y-2">
                                 <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                    <span className="text-slate-400">Scoring:</span>
                                    <span className="text-slate-800">{p.scoring}</span>
                                 </div>
                                 <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                    <span className="text-slate-400">Items:</span>
                                    <span className="text-slate-800">{p.items}</span>
                                 </div>
                                 <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                    <span className="text-slate-400">Output:</span>
                                    <span className="text-[#2563EB]">{p.output}</span>
                                 </div>
                              </div>

                              <div className="space-y-4">
                                 <button
                                    onClick={() => onStartAssessment?.(p.id)}
                                    className="w-full h-14 bg-[#2563EB] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group/btn"
                                 >
                                    Start Assessment <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                 </button>
                                 <div className="flex gap-4">
                                    <button className="flex-1 h-11 border-2 border-slate-100 rounded-xl text-xs font-black text-slate-400 uppercase tracking-widest hover:border-blue-200 hover:text-[#2563EB] transition-all">View Details</button>
                                    <button className="flex-1 h-11 border-2 border-slate-100 rounded-xl text-xs font-black text-slate-400 uppercase tracking-widest hover:border-blue-200 hover:text-[#2563EB] transition-all">Preview</button>
                                 </div>
                              </div>
                              <p className="text-center mt-4 text-[9px] font-black text-slate-300 uppercase tracking-widest">Demo: Sample questions will be shown</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Sidebar Area */}
               <div className="w-full lg:w-[320px] space-y-8">
                  {/* History Card */}
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                     <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center justify-between">
                        Recent Assessments <Activity size={18} className="text-[#2563EB]" />
                     </h2>
                     <div className="space-y-6">
                        {[
                           { p: 'ISAA', pt: 'Aarav Kumar', d: 'Oct 20, 2024', r: 'Score: 72/200 - Mild ASD', c: 'bg-green-100 text-green-700', action: onViewResults },
                           { p: 'ADHD', pt: 'Arjun Patel', d: 'Oct 15, 2024', r: 'Positive screening', c: 'bg-green-100 text-green-700' }
                        ].map((h, i) => (
                           <div key={i} className="space-y-3 p-4 bg-slate-50 rounded-2xl group cursor-pointer hover:bg-slate-100 transition-all">
                              <div className="flex justify-between items-start">
                                 <div>
                                    <h4 className="text-sm font-black text-slate-800">{h.p} Assessment</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">{h.pt}</p>
                                 </div>
                                 <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${h.c}`}>Completed</span>
                              </div>
                              <div className="space-y-1">
                                 <p className="text-[10px] font-bold text-slate-400 uppercase">{h.d}</p>
                                 <p className="text-xs font-black text-[#2563EB]">{h.r}</p>
                              </div>
                              {h.action && (
                                 <button onClick={h.action} className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-[#2563EB] flex items-center gap-1 hover:underline">
                                    View Report <ChevronRight size={10} />
                                 </button>
                              )}
                           </div>
                        ))}
                     </div>
                     <button className="w-full mt-6 py-3 border-2 border-dashed border-slate-100 rounded-xl text-[10px] font-black text-slate-400 hover:text-[#2563EB] uppercase tracking-widest transition-all">View All History</button>
                  </div>

                  {/* Resources Card */}
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                     <h2 className="text-lg font-black text-slate-900 mb-6">Assessment Resources</h2>
                     <div className="space-y-4">
                        {[
                           { l: 'Protocol Manuals', i: <BookOpen size={16} /> },
                           { l: 'Training Videos', i: <PlayCircle size={16} /> },
                           { l: 'Scoring Guidelines', i: <HelpCircle size={16} /> },
                           { l: 'Clinical Support', i: <Info size={16} /> }
                        ].map((res, i) => (
                           <button key={i} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-all text-left group">
                              <span className="text-slate-300 group-hover:text-[#2563EB] transition-colors">{res.i}</span>
                              <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900">{res.l}</span>
                           </button>
                        ))}
                     </div>
                  </div>

                  {/* Comparison Tool */}
                  <div className="bg-[#2563EB] rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-blue-100">
                     <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                     <h3 className="text-lg font-black mb-2 relative z-10">Compare Protocols</h3>
                     <p className="text-xs text-blue-100 opacity-80 mb-6 relative z-10 leading-relaxed">Not sure which assessment tool to use for a specific diagnostic query?</p>
                     <button className="w-full py-3 bg-white text-[#2563EB] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-all relative z-10 shadow-lg">Compare Tools</button>
                  </div>

                  {/* Demo Environment Notice */}
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-3xl p-6">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                           <LayoutGrid size={20} />
                        </div>
                        <h3 className="text-sm font-black text-orange-900 uppercase tracking-widest">Demo Environment</h3>
                     </div>
                     <div className="space-y-4">
                        <p className="text-[11px] font-semibold text-orange-800/70 leading-relaxed">
                           This is a demonstration interface. In a production environment:
                        </p>
                        <ul className="space-y-3">
                           {[
                              'Real patient assessments would be conducted',
                              'Results would be stored securely in cloud',
                              'Reports would be generated automatically',
                              'All data would be HIPAA compliant'
                           ].map((item, i) => (
                              <li key={i} className="flex items-start gap-3 text-[10px] font-bold text-orange-900 uppercase tracking-widest leading-tight opacity-60">
                                 <div className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0 mt-1" /> {item}
                              </li>
                           ))}
                        </ul>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default DiagnosticSuite;
