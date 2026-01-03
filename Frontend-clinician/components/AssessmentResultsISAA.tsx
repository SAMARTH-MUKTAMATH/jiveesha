
import React, { useState } from 'react';
import { 
  ArrowLeft, Download, Share2, Printer, MoreVertical, 
  ClipboardList, CheckCircle2, User, Calendar, MapPin, 
  Clock, AlertTriangle, TrendingDown, ChevronDown, 
  ChevronRight, PlayCircle, FileText, Activity, Target, 
  MessageSquare, Brain, LayoutList, ShieldCheck, Mail, X, Check,
  BarChart3, Video, Image as ImageIcon, ExternalLink, Info
} from 'lucide-react';

interface AssessmentResultsISAAProps {
  onBack: () => void;
  onGenerateReport?: () => void;
  onCreateIEP?: () => void;
}

const AssessmentResultsISAA: React.FC<AssessmentResultsISAAProps> = ({ onBack, onGenerateReport, onCreateIEP }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [expandedDomain, setExpandedDomain] = useState<string | null>('Social Interaction');

  const domains = [
    {
      id: 'Social Interaction',
      score: 18,
      total: 40,
      percent: 45,
      status: 'Mild impairment',
      badge: 'Below expected',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      bar: 'bg-orange-500',
      icon: <User size={24} />,
      findings: [
        'Inconsistent eye contact during interactions',
        'Limited social reciprocity',
        'Prefers parallel play over cooperative play',
        'Shows some joint attention with prompting'
      ]
    },
    {
      id: 'Gross Motor Skills',
      score: 32,
      total: 40,
      percent: 80,
      status: 'Age-appropriate',
      badge: 'Strength Area',
      color: 'text-green-600',
      bg: 'bg-green-50',
      bar: 'bg-green-500',
      icon: <Activity size={24} />,
      findings: [
        'Age-appropriate motor coordination',
        'Good balance and movement',
        'No concerns identified'
      ]
    },
    {
      id: 'Fine Motor Skills',
      score: 24,
      total: 40,
      percent: 60,
      status: 'Mild delay',
      badge: 'Below age level',
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      bar: 'bg-yellow-500',
      icon: <Target size={24} />,
      findings: [
        'Some difficulty with precision tasks',
        'Handwriting requires support',
        'Improving with OT intervention'
      ]
    },
    {
      id: 'Language & Communication',
      score: 20,
      total: 40,
      percent: 50,
      status: 'Moderate delay',
      badge: 'Intervention target',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      bar: 'bg-orange-500',
      icon: <MessageSquare size={24} />,
      findings: [
        'Uses 2-3 word phrases (baseline)',
        'Receptive language stronger than expressive',
        'Vocabulary age-appropriate',
        'Pragmatic language delays noted'
      ]
    },
    {
      id: 'Self-Help Skills',
      score: 28,
      total: 40,
      percent: 70,
      status: 'Mild delay',
      badge: 'Developing',
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      bar: 'bg-yellow-500',
      icon: <CheckCircle2 size={24} />,
      findings: [
        'Independent in basic self-care',
        'Requires reminders for organization',
        'Age-appropriate for most tasks'
      ]
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] pb-20 animate-in fade-in duration-500 relative">
      {/* Demo Banner */}
      <div className="w-full bg-amber-50 border-b border-amber-100 py-2.5 px-6 flex items-center justify-center gap-3 sticky top-0 z-50">
        <AlertTriangle size={16} className="text-amber-600" />
      </div>

      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-[41px] z-40">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-6">
          <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            <button onClick={onBack} className="hover:text-[#2563EB] transition-colors">Patient Profile</button>
            <ChevronRight size={14} />
            <span className="text-slate-500">Assessments</span>
            <ChevronRight size={14} />
            <span className="text-slate-800">ISAA Results</span>
          </nav>
          
          <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-2">
            <div className="flex items-center gap-6">
               <div className="relative">
                  <div className="w-16 h-16 rounded-2xl border-4 border-slate-50 shadow-lg overflow-hidden">
                     <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rivera" alt="Aarav" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-600 rounded-full border-4 border-white flex items-center justify-center text-white shadow-sm">
                     <User size={12} />
                  </div>
               </div>
               <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Aarav Kumar</h1>
                  <div className="flex items-center gap-3 mt-1">
                     <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">7 years • Grade 2</span>
                     <span className="text-slate-300">|</span>
                     <span className="text-xs font-bold text-slate-400 font-mono tracking-widest">#DAI-8291</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                     <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[9px] font-black uppercase tracking-widest border border-purple-200">ASD</span>
                     <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[9px] font-black uppercase tracking-widest border border-blue-200">Speech Delay</span>
                  </div>
               </div>
            </div>

            <div className="flex gap-3">
               <button className="h-10 px-4 border-2 border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:border-blue-200 hover:text-blue-600 transition-all flex items-center gap-2">
                  <Download size={16} /> Report
               </button>
               <button onClick={() => setShowShareModal(true)} className="h-10 px-4 border-2 border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:border-blue-200 hover:text-blue-600 transition-all flex items-center gap-2">
                  <Share2 size={16} /> Share
               </button>
               <button className="h-10 px-4 border-2 border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:border-blue-200 hover:text-blue-600 transition-all flex items-center gap-2">
                  <Printer size={16} /> Print
               </button>
               <button className="h-10 w-10 border-2 border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:border-blue-200 hover:text-blue-600 transition-all">
                  <MoreVertical size={16} />
               </button>
            </div>
         </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mt-8 flex flex-col xl:flex-row gap-8">
         
         {/* Main Content */}
         <div className="flex-1 space-y-8">
            
            {/* Assessment Info Card */}
            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm relative overflow-hidden">
               <div className="relative z-10">
                  <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
                     <div className="flex gap-6">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
                           <ClipboardList size={32} />
                        </div>
                        <div>
                           <h2 className="text-2xl font-black text-slate-900 tracking-tight">ISAA Assessment</h2>
                           <p className="text-sm font-bold text-slate-500">Indian Scale for Assessment of Autism</p>
                           <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-green-50 text-green-700 rounded text-[9px] font-black uppercase tracking-widest border border-green-100">
                              <CheckCircle2 size={10} /> NIEPID Validated
                           </span>
                        </div>
                     </div>
                     <div className="text-right">
                        <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-200">Completed</span>
                        <p className="text-sm font-bold text-slate-700 mt-2">October 20, 2024</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-100">
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Administered By</p>
                        <div className="flex items-center gap-2">
                           <div className="w-5 h-5 rounded-full bg-slate-200 overflow-hidden">
                              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rivera" className="w-full h-full object-cover" />
                           </div>
                           <span className="text-xs font-bold text-slate-700">Dr. Jane Rivera</span>
                        </div>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Duration</p>
                        <p className="text-xs font-bold text-slate-700 flex items-center gap-1"><Clock size={12} /> 52 minutes</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Format</p>
                        <p className="text-xs font-bold text-slate-700 flex items-center gap-1"><MapPin size={12} /> In-person</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Version</p>
                        <p className="text-xs font-bold text-slate-700">ISAA 2.0</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Overall Score Section */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-[2rem] border border-blue-100 p-10 text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -mr-32 -mt-32" />
               <div className="relative z-10">
                  <p className="text-sm font-black text-blue-900 uppercase tracking-widest mb-4">Total ISAA Score</p>
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                     <span className="text-7xl font-black text-blue-900 tracking-tighter">72</span>
                     <span className="text-3xl font-bold text-blue-300">/ 200</span>
                  </div>
                  
                  <div className="inline-flex flex-col items-center mb-8">
                     <h3 className="text-2xl font-black text-orange-500 tracking-tight">Mild ASD Indicators</h3>
                     <p className="text-sm font-bold text-slate-500">Level 1 - Requiring Support</p>
                  </div>

                  <div className="max-w-2xl mx-auto mb-4">
                     <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden flex relative">
                        <div className="h-full bg-green-400 w-[35%]" />
                        <div className="h-full bg-yellow-400 w-[18%]" />
                        <div className="h-full bg-orange-400 w-[23%]" />
                        <div className="h-full bg-red-400 w-[24%]" />
                        
                        {/* Marker */}
                        <div className="absolute top-0 bottom-0 w-1 bg-slate-900 z-10 transition-all duration-1000" style={{ left: '36%' }} />
                     </div>
                     <div className="flex justify-between mt-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        <span>Normal (0-70)</span>
                        <span>Mild (71-106)</span>
                        <span>Moderate (107-153)</span>
                        <span>Severe (154-200)</span>
                     </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500 bg-white/50 py-2 px-4 rounded-xl w-fit mx-auto border border-blue-100">
                     <span>Compared to baseline (June 2024): 78 → 72</span>
                     <span className="text-green-600 flex items-center gap-1"><TrendingDown size={14} /> 6 points improvement</span>
                  </div>
               </div>
            </div>

            {/* Domain Breakdown */}
            <div>
               <h3 className="text-lg font-black text-slate-900 mb-6">Domain-wise Performance</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {domains.map((domain) => (
                    <div key={domain.id} className="bg-white rounded-[2rem] border border-slate-200 p-6 hover:shadow-lg transition-all group">
                       <div className="flex justify-between items-start mb-6">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${domain.bg} ${domain.color}`}>
                             {domain.icon}
                          </div>
                          <div className="text-right">
                             <div className="text-2xl font-black text-slate-900">{domain.score} <span className="text-sm text-slate-300 font-bold">/ {domain.total}</span></div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{domain.percent}%</p>
                          </div>
                       </div>
                       
                       <h4 className="text-base font-black text-slate-900 mb-1">{domain.id}</h4>
                       <div className="flex items-center gap-2 mb-4">
                          <span className={`text-xs font-bold ${domain.color}`}>{domain.status}</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${domain.bg} ${domain.color} border-transparent`}>{domain.badge}</span>
                       </div>

                       <div className="space-y-1 mb-6">
                          <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                             <span>Progress</span>
                             <span>Target: 75%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                             <div className={`h-full ${domain.bar}`} style={{ width: `${domain.percent}%` }} />
                          </div>
                       </div>

                       <button 
                         onClick={() => setExpandedDomain(expandedDomain === domain.id ? null : domain.id)}
                         className="w-full flex items-center justify-between text-xs font-bold text-slate-500 hover:text-[#2563EB] transition-colors"
                       >
                          <span>Key Findings</span>
                          <ChevronDown size={14} className={`transition-transform ${expandedDomain === domain.id ? 'rotate-180' : ''}`} />
                       </button>

                       {expandedDomain === domain.id && (
                         <ul className="mt-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
                            {domain.findings.map((f, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs font-medium text-slate-600">
                                 <div className={`w-1 h-1 rounded-full ${domain.bar} mt-1.5 shrink-0`} />
                                 {f}
                              </li>
                            ))}
                         </ul>
                       )}
                    </div>
                  ))}
               </div>
            </div>

            {/* Clinical Interpretation */}
            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm space-y-6">
               <h3 className="text-lg font-black text-slate-900">Clinical Interpretation</h3>
               <div className="prose prose-sm max-w-none text-slate-600 font-medium leading-relaxed">
                  <p className="mb-4">
                     Based on the ISAA assessment results, Aarav presents with indicators consistent with <strong className="text-slate-900">Autism Spectrum Disorder (ASD), Level 1</strong>. The total score of 72/200 falls within the mild range of impairment.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-6">
                     <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                        <h4 className="text-sm font-black text-green-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                           <TrendingDown size={16} className="rotate-180" /> Strengths
                        </h4>
                        <ul className="space-y-2">
                           {['Gross motor skills are age-appropriate', 'Self-help skills developing well', 'Receptive language preserved'].map((s, i) => (
                             <li key={i} className="flex items-start gap-2 text-xs font-bold text-green-700">
                                <Check size={14} className="mt-0.5 shrink-0" /> {s}
                             </li>
                           ))}
                        </ul>
                     </div>
                     <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                        <h4 className="text-sm font-black text-orange-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                           <AlertTriangle size={16} /> Areas of Concern
                        </h4>
                        <ul className="space-y-2">
                           {['Social interaction delays', 'Fine motor coordination support needed', 'Pragmatic language impacts social functioning'].map((s, i) => (
                             <li key={i} className="flex items-start gap-2 text-xs font-bold text-orange-700">
                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 shrink-0" /> {s}
                             </li>
                           ))}
                        </ul>
                     </div>
                  </div>

                  <div className="border-t border-slate-100 pt-6">
                     <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">Social-Communication</h4>
                     <p className="mb-4">
                        Aarav demonstrates difficulties consistent with DSM-5 criteria for ASD, including challenges with social reciprocity, nonverbal communication, and developing peer relationships. He shows preference for parallel play and requires adult prompting for social engagement.
                     </p>
                     
                     <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">Restricted/Repetitive Behaviors</h4>
                     <p>
                        Moderate indicators of restricted interests (strong focus on trains) and some sensory sensitivities noted. Responds well to structured routines and shows flexibility with appropriate support.
                     </p>
                  </div>
               </div>
               
               <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                     <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rivera" alt="Dr. Rivera" className="w-full h-full object-cover" />
                  </div>
                  <div>
                     <p className="text-xs font-black text-slate-900 uppercase">Dr. Jane Rivera, Clinical Psychologist</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">RCI Registration: RCI/12345/2020 • Oct 20, 2024</p>
                  </div>
               </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
               <h3 className="text-lg font-black text-slate-900 mb-6">Clinical Recommendations</h3>
               <div className="space-y-4">
                  {[
                    { t: 'Speech & Language Therapy', d: '2-3 sessions/week. Focus on expressive language & pragmatics.', p: 'High Priority', c: 'bg-red-50 text-red-600' },
                    { t: 'Social Skills Training', d: '1-2 sessions/week. Small group format for turn-taking.', p: 'Medium Priority', c: 'bg-orange-50 text-orange-600' },
                    { t: 'Occupational Therapy', d: '1 session/week. Focus on fine motor & sensory integration.', p: 'Medium Priority', c: 'bg-orange-50 text-orange-600' }
                  ].map((rec, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50">
                       <div className="flex-1">
                          <h4 className="text-sm font-black text-slate-900">{i+1}. {rec.t}</h4>
                          <p className="text-xs font-medium text-slate-600 mt-1">{rec.d}</p>
                       </div>
                       <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${rec.c}`}>{rec.p}</span>
                    </div>
                  ))}
               </div>
            </div>

            {/* Evidence & Attachments */}
            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm space-y-6">
               <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900">Assessment Evidence</h3>
                  <button className="text-[10px] font-black text-[#2563EB] uppercase tracking-widest hover:underline">Download All</button>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { t: 'Video', n: 'Social_Play.mp4', d: '3:24', i: <Video size={16} /> },
                    { t: 'Video', n: 'Comm_Sample.mp4', d: '2:15', i: <Video size={16} /> },
                    { t: 'Video', n: 'Motor_Assess.mp4', d: '4:10', i: <Video size={16} /> },
                    { t: 'Photo', n: 'Activity_Sheet.jpg', i: <ImageIcon size={16} /> },
                    { t: 'Doc', n: 'Score_Sheet.pdf', s: '2 pages', i: <FileText size={16} /> }
                  ].map((file, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 border border-slate-200 rounded-2xl hover:bg-slate-50 cursor-pointer transition-all group">
                       <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
                          {file.i}
                       </div>
                       <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-700 truncate">{file.n}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{file.d || file.s}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

         </div>

         {/* Sidebar */}
         <aside className="w-full xl:w-[320px] shrink-0 space-y-8 sticky top-28 h-fit">
            {/* Quick Summary */}
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Assessment Summary</h3>
               <div className="space-y-6">
                  <div className="flex justify-between items-center">
                     <span className="text-sm font-bold text-slate-300">Score</span>
                     <span className="text-xl font-black">72/200</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-sm font-bold text-slate-300">Result</span>
                     <span className="text-sm font-black text-orange-400 bg-orange-400/10 px-2 py-1 rounded">Mild ASD</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-sm font-bold text-slate-300">DSM-5</span>
                     <span className="text-sm font-black text-green-400 flex items-center gap-1"><Check size={14} /> Met</span>
                  </div>
                  <div className="pt-6 border-t border-white/10">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">ICD-10 Code</p>
                     <p className="text-lg font-mono font-bold">F84.0</p>
                  </div>
               </div>
            </div>

            {/* DSM-5 Criteria */}
            <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">DSM-5 Criteria Alignment</h3>
               <div className="space-y-4">
                  <div className="space-y-2">
                     <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span>A. Social Comm</span>
                        <span className="text-green-600">3 of 3 Met</span>
                     </div>
                     <div className="space-y-1 pl-2 border-l-2 border-slate-100">
                        {['Reciprocity', 'Nonverbal', 'Relationships'].map(c => (
                           <div key={c} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                              <CheckCircle2 size={10} className="text-green-500" /> {c}
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="space-y-2">
                     <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span>B. Repetitive</span>
                        <span className="text-green-600">3 of 4 Met</span>
                     </div>
                     <div className="space-y-1 pl-2 border-l-2 border-slate-100">
                        {['Stereotyped', 'Sameness', 'Sensory'].map(c => (
                           <div key={c} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                              <CheckCircle2 size={10} className="text-green-500" /> {c}
                           </div>
                        ))}
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                           <div className="w-2.5 h-2.5 rounded-full border border-slate-300 flex items-center justify-center text-[6px]" /> Interests
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm space-y-3">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Next Steps</h3>
               {[
                 { l: 'Add to Report', i: <FileText size={16} />, a: onGenerateReport },
                 { l: 'Create IEP', i: <LayoutList size={16} />, a: onCreateIEP },
                 { l: 'Schedule Follow-up', i: <Calendar size={16} /> },
                 { l: 'Share Results', i: <Share2 size={16} />, a: () => setShowShareModal(true) }
               ].map((act, i) => (
                 <button 
                   key={i} 
                   onClick={act.a}
                   className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all text-left group"
                 >
                    <div className="flex items-center gap-3">
                       <span className="text-slate-300 group-hover:text-[#2563EB] transition-colors">{act.i}</span>
                       <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 uppercase tracking-tight">{act.l}</span>
                    </div>
                    <ChevronRight size={14} className="text-slate-200 group-hover:text-[#2563EB] transition-all" />
                 </button>
               ))}
            </div>

            {/* Related */}
            <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">History</h3>
               <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-xl opacity-60">
                     <div className="p-1.5 bg-white rounded shadow-sm text-slate-400"><ClipboardList size={14} /></div>
                     <div>
                        <p className="text-xs font-bold text-slate-600">ISAA Baseline</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">June 15, 2024</p>
                     </div>
                  </div>
               </div>
            </div>
         </aside>

      </div>

      {/* SHARE MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl p-8 space-y-6">
              <div className="flex justify-between items-center">
                 <h3 className="text-xl font-black text-slate-900">Share Results</h3>
                 <button onClick={() => setShowShareModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              
              <div className="space-y-4">
                 <label className="flex items-start gap-3 p-4 border-2 border-[#2563EB] bg-blue-50/30 rounded-2xl cursor-pointer">
                    <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded text-blue-600 focus:ring-blue-500" />
                    <div>
                       <span className="text-sm font-bold text-slate-900">Parent (Mrs. Priya Kumar)</span>
                       <p className="text-xs text-slate-500 mt-0.5">priya.kumar@email.com</p>
                    </div>
                 </label>
                 
                 <label className="flex items-start gap-3 p-4 border-2 border-slate-200 hover:border-slate-300 rounded-2xl cursor-pointer transition-colors">
                    <input type="checkbox" className="mt-1 w-5 h-5 rounded text-blue-600 focus:ring-blue-500" />
                    <div>
                       <span className="text-sm font-bold text-slate-900">Teacher (Mrs. Meena Sharma)</span>
                       <p className="text-xs text-slate-500 mt-0.5">Requires consent confirmation</p>
                    </div>
                 </label>

                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Format</label>
                    <div className="flex gap-2">
                       <button className="flex-1 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold">Full Report</button>
                       <button className="flex-1 py-2 bg-slate-100 text-slate-500 hover:text-slate-700 rounded-xl text-xs font-bold">Summary Only</button>
                    </div>
                 </div>

                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Message</label>
                    <textarea className="w-full h-24 p-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-blue-400 resize-none" placeholder="Add a personal message..." />
                 </div>
              </div>

              <div className="flex gap-4 pt-2">
                 <button onClick={() => setShowShareModal(false)} className="flex-1 h-12 border-2 border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50">Cancel</button>
                 <button onClick={() => setShowShareModal(false)} className="flex-1 h-12 bg-[#2563EB] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100">Share Securely</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentResultsISAA;
