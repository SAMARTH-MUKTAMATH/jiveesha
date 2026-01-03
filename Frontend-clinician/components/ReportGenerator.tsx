
import React, { useState } from 'react';
import {
   ArrowLeft, ArrowRight, ClipboardList, CheckCircle2,
   Settings, Eye, FileText, TrendingUp, LayoutList,
   DoorOpen, User, Info, Check, Plus, Upload,
   Trash2, Sparkles, Printer, Mail, Download,
   FileSearch, Activity, ShieldCheck, ChevronRight, X
} from 'lucide-react';

interface ReportGeneratorProps {
   onBack: () => void;
   onFinish?: () => void;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ onBack, onFinish }) => {
   const [step, setStep] = useState(1);
   const [reportType, setReportType] = useState<string | null>(null);
   const [showSuccess, setShowSuccess] = useState(false);
   const [clinicianSigned, setClinicianSigned] = useState(false);

   const steps = [
      { id: 1, label: 'Type' },
      { id: 2, label: 'Content' },
      { id: 3, label: 'Customize' },
      { id: 4, label: 'Review' }
   ];

   const handleNext = () => {
      if (step === 4) {
         setShowSuccess(true);
      } else {
         setStep(s => s + 1);
         window.scrollTo(0, 0);
      }
   };

   const handleBack = () => {
      if (step === 1) onBack();
      else {
         setStep(s => s - 1);
         window.scrollTo(0, 0);
      }
   };

   return (
      <div className="w-full bg-[#F8FAFC] min-h-screen animate-in fade-in duration-500 pb-20">
         {/* Demo Banner */}
         <div className="w-full bg-amber-50 border-b border-amber-100 py-2.5 px-12 flex items-center justify-center gap-3 relative z-50">
            <span className="p-1 bg-amber-100 text-amber-600 rounded-md">🎭</span>
         </div>

         <div className="max-w-[1200px] mx-auto px-6 py-10">
            {/* Breadcrumb */}
            <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-[#2563EB] hover:text-blue-700 transition-colors mb-6">
               <ArrowLeft size={18} /> Back to Patient Profile
            </button>
            <nav className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10">
               Patients &gt; Aarav Kumar &gt; Generate Report
            </nav>

            {/* Header */}
            <div className="text-center mb-12 space-y-3">
               <h1 className="text-4xl font-black text-slate-900 tracking-tight">Generate Clinical Report</h1>
               <p className="text-lg text-slate-500 font-medium">Create professional reports for patients, parents, and schools</p>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center justify-center mb-16 relative">
               <div className="absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-slate-200 -translate-y-1/2" />
               <div className="flex items-center gap-20 relative z-10">
                  {steps.map(s => (
                     <div key={s.id} className="flex flex-col items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${step === s.id ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-lg shadow-blue-200' :
                              step > s.id ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-slate-300 text-slate-400'
                           }`}>
                           {step > s.id ? <Check size={16} strokeWidth={3} /> : s.id}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${step === s.id ? 'text-[#2563EB]' : 'text-slate-400'}`}>
                           {s.id}. {s.label}
                        </span>
                     </div>
                  ))}
               </div>
            </div>

            {/* Patient Context Card */}
            <div className="max-w-2xl mx-auto mb-10 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl border-2 border-white shadow-sm overflow-hidden">
                     <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rivera" alt="Aarav" className="w-full h-full object-cover" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Creating report for</p>
                     <h4 className="text-sm font-black text-blue-900">Aarav Kumar, 7 yrs</h4>
                  </div>
               </div>
               <span className="text-[11px] font-mono text-blue-300">#DAI-8291</span>
            </div>

            {/* Step Content */}
            {step === 1 && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                  {[
                     { id: 'diag', title: 'Diagnostic Report', desc: 'Assessment findings, diagnosis, and recommendations', best: 'Initial assessments, referrals', includes: 'ISAA results, DSM-5, ICD-10', icon: <ClipboardList size={40} />, color: 'text-blue-600', bg: 'bg-blue-50', recommended: true },
                     { id: 'prog', title: 'Progress Report', desc: 'Track intervention and goal achievement', best: 'Quarterly reviews, parent updates', includes: 'Goal progress, session summaries', icon: <TrendingUp size={40} />, color: 'text-green-600', bg: 'bg-green-50' },
                     { id: 'iep', title: 'IEP Summary Report', desc: 'Complete IEP with goals and services', best: 'School meetings, annual reviews', includes: 'Full IEP components, signatures', icon: <LayoutList size={40} />, color: 'text-purple-600', bg: 'bg-purple-50' },
                     { id: 'disc', title: 'Discharge Summary', desc: 'Final summary when closing case', best: 'Care transitions, final records', includes: 'Treatment history, outcomes', icon: <DoorOpen size={40} />, color: 'text-orange-600', bg: 'bg-orange-50' },
                     { id: 'cust', title: 'Custom Report', desc: 'Build with custom sections', best: 'Specialized clinical needs', includes: 'Any available clinical data', icon: <FileText size={40} />, color: 'text-slate-400', bg: 'bg-slate-50', dashed: true }
                  ].map((t) => (
                     <button
                        key={t.id}
                        onClick={() => setReportType(t.id)}
                        className={`text-left p-8 rounded-[2rem] border-2 transition-all group relative ${reportType === t.id ? 'border-[#2563EB] bg-blue-50/20 shadow-xl shadow-blue-100' :
                              t.dashed ? 'border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50/10' : 'bg-white border-slate-100 hover:border-blue-300'
                           }`}
                     >
                        {t.recommended && (
                           <span className="absolute top-6 right-6 px-3 py-1 bg-[#2563EB] text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg">Recommended</span>
                        )}
                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 shadow-sm ${t.bg} ${t.color}`}>
                           {t.icon}
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">{t.title}</h3>
                        <p className="text-sm font-semibold text-slate-500 mb-6 leading-relaxed">{t.desc}</p>
                        <div className="space-y-3 pt-6 border-t border-slate-50">
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest"><span className="text-slate-900">Best for:</span> {t.best}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest"><span className="text-slate-900">Includes:</span> {t.includes}</p>
                        </div>
                        <div className="mt-8 flex items-center justify-between">
                           <span className={`text-[10px] font-black uppercase tracking-widest ${reportType === t.id ? 'text-[#2563EB]' : 'text-slate-300 group-hover:text-slate-600'}`}>
                              {reportType === t.id ? '✓ Selected' : 'Select Type'}
                           </span>
                           <ChevronRight size={18} className={`${reportType === t.id ? 'text-[#2563EB]' : 'text-slate-200'}`} />
                        </div>
                     </button>
                  ))}
               </div>
            )}

            {step === 2 && (
               <div className="flex flex-col lg:flex-row gap-10 animate-in slide-in-from-right-4 duration-500">
                  <div className="flex-1 space-y-8">
                     <div className="space-y-1">
                        <h2 className="text-2xl font-black text-slate-900">Select Report Content</h2>
                        <p className="text-slate-500 font-medium">Choose information to include in the Diagnostic Report</p>
                     </div>

                     <div className="bg-slate-100 p-8 rounded-[2rem] space-y-4">
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">✓ Required Sections</h4>
                        <div className="grid grid-cols-2 gap-4">
                           {['Patient Demographics', 'Assessment Summary', 'Clinical Findings', 'Diagnosis'].map(s => (
                              <div key={s} className="flex items-center gap-3 text-sm font-bold text-slate-400 opacity-60">
                                 <CheckCircle2 size={16} className="text-green-500" /> {s}
                              </div>
                           ))}
                        </div>
                     </div>

                     {[
                        {
                           title: 'Assessment Data', items: [
                              { id: 'isaa', label: 'ISAA Assessment Results', date: 'Oct 20, 2024', expand: 'Scores, domain breakdown, charts', checked: true },
                              { id: 'glad', label: 'GLAD Assessment Results', date: 'Sep 15, 2024', checked: true },
                              { id: 'parent', label: 'Parent Questionnaire Data' },
                              { id: 'teacher', label: 'Teacher Observation Reports' }
                           ]
                        },
                        {
                           title: 'Clinical Observations', items: [
                              { id: 'sess', label: 'Session Notes and Observations', checked: true },
                              { id: 'behav', label: 'Behavioral Patterns Documented', checked: true },
                              { id: 'media', label: 'Video/Photo Evidence', sub: '3 videos, 5 photos available', checked: true },
                              { id: 'audio', label: 'Audio Recordings' }
                           ]
                        },
                        {
                           title: 'Diagnosis & Recommendations', items: [
                              { id: 'dsm', label: 'DSM-5 Diagnostic Criteria Met', checked: true },
                              { id: 'icd', label: 'ICD-10 Diagnosis Codes', checked: true },
                              { id: 'rec', label: 'Clinical Recommendations', checked: true },
                              { id: 'interv', label: 'Suggested Interventions', checked: true },
                              { id: 'school', label: 'School Accommodations Needed' }
                           ]
                        }
                     ].map((sect, i) => (
                        <div key={i} className="bg-white rounded-[2rem] border border-slate-100 p-8 space-y-6">
                           <h3 className="text-lg font-black text-slate-900">{sect.title}</h3>
                           <div className="space-y-4">
                              {sect.items.map(item => (
                                 <div key={item.id} className={`p-4 rounded-2xl border transition-all ${item.checked ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-slate-100'}`}>
                                    <label className="flex items-start gap-4 cursor-pointer">
                                       <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-1 transition-colors ${item.checked ? 'bg-[#2563EB] border-[#2563EB] text-white' : 'bg-white border-slate-300'}`}>
                                          {item.checked && <Check size={14} strokeWidth={3} />}
                                       </div>
                                       <div className="flex-1">
                                          <div className="flex items-center justify-between">
                                             <p className={`text-sm font-bold ${item.checked ? 'text-blue-900' : 'text-slate-600'}`}>{item.label}</p>
                                             {item.date && <span className="text-[10px] font-black text-slate-300 uppercase">{item.date}</span>}
                                          </div>
                                          {item.expand && <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-widest mt-1">Includes: {item.expand}</p>}
                                          {item.sub && <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-widest mt-1">{item.sub}</p>}
                                          {item.checked && (
                                             <div className="flex bg-white/50 p-1 rounded-lg w-fit mt-3 border border-blue-100">
                                                <button className="px-3 py-1 bg-white shadow-sm rounded text-[9px] font-black text-blue-600 uppercase">Detailed</button>
                                                <button className="px-3 py-1 rounded text-[9px] font-black text-slate-400 uppercase">Summary</button>
                                             </div>
                                          )}
                                       </div>
                                    </label>
                                 </div>
                              ))}
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="w-full lg:w-[320px] shrink-0">
                     <div className="sticky top-28 bg-white rounded-3xl border border-slate-200 p-8 space-y-6 shadow-sm">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4">Report Preview</h3>
                        <div className="space-y-4">
                           <div className="aspect-[3/4] bg-slate-50 rounded-xl border border-slate-100 relative overflow-hidden p-4">
                              <div className="w-1/3 h-2 bg-slate-200 rounded-full mb-8" />
                              <div className="w-full h-1 bg-slate-100 rounded-full mb-2" />
                              <div className="w-full h-1 bg-slate-100 rounded-full mb-2" />
                              <div className="w-3/4 h-1 bg-slate-100 rounded-full mb-8" />
                              <div className="grid grid-cols-2 gap-2 mb-8">
                                 <div className="h-10 bg-blue-100 rounded-lg" />
                                 <div className="h-10 bg-green-100 rounded-lg" />
                              </div>
                              <div className="space-y-2">
                                 {[1, 2, 3, 4].map(l => <div key={l} className="w-full h-1 bg-slate-100 rounded-full" />)}
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 rotate-12">
                                 <FileSearch size={100} className="text-slate-300" />
                              </div>
                           </div>
                           <div className="grid grid-cols-2 gap-4 text-center">
                              <div className="p-3 bg-slate-50 rounded-xl">
                                 <p className="text-[10px] font-black text-slate-400 uppercase">Est. Pages</p>
                                 <p className="text-lg font-black text-slate-800">8-12</p>
                              </div>
                              <div className="p-3 bg-slate-50 rounded-xl">
                                 <p className="text-[10px] font-black text-slate-400 uppercase">Est. Time</p>
                                 <p className="text-lg font-black text-slate-800">5 min</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {step === 3 && (
               <div className="flex flex-col lg:flex-row gap-10 animate-in slide-in-from-right-4 duration-500">
                  <div className="flex-1 space-y-8">
                     <div className="space-y-1">
                        <h2 className="text-2xl font-black text-slate-900">Customize Report</h2>
                        <p className="text-slate-500 font-medium">Add branding and adjust formatting</p>
                     </div>

                     <div className="bg-white rounded-[2rem] border border-slate-100 p-8 space-y-8">
                        <h3 className="text-lg font-black text-slate-900">Clinic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                           <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinic Logo</label>
                              <div className="aspect-square w-32 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-slate-50 cursor-pointer transition-all">
                                 <Upload size={20} className="text-slate-400" />
                                 <span className="text-[9px] font-bold text-slate-400 uppercase">PNG/JPG</span>
                              </div>
                           </div>
                           <div className="space-y-6">
                              <div>
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Clinic Name</label>
                                 <input type="text" defaultValue="Rivera Child Development Center" className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:border-blue-500 outline-none" />
                              </div>
                              <div>
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Clinician Name</label>
                                 <input type="text" defaultValue="Dr. Jane Rivera, Clinical Psychologist" className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:border-blue-500 outline-none" />
                              </div>
                              <div>
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Credentials</label>
                                 <input type="text" defaultValue="RCI Registration: RCI/12345/2020" className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:border-blue-500 outline-none" />
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="bg-white rounded-[2rem] border border-slate-100 p-8 space-y-6">
                        <h3 className="text-lg font-black text-slate-900">Format Options</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                           <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Page Size</label>
                              <select className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold">
                                 <option>US Letter</option><option>A4</option>
                              </select>
                           </div>
                           <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Orientation</label>
                              <div className="flex bg-slate-100 p-1 rounded-xl">
                                 <button className="flex-1 py-2 bg-white rounded-lg shadow-sm text-[10px] font-black uppercase tracking-widest">Portrait</button>
                                 <button className="flex-1 py-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">Landscape</button>
                              </div>
                           </div>
                           <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Font</label>
                              <select className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold">
                                 <option>Arial</option><option>Times</option><option>Inter</option>
                              </select>
                           </div>
                           <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Size</label>
                              <select className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold">
                                 <option>11pt</option><option>10pt</option><option>12pt</option>
                              </select>
                           </div>
                        </div>
                     </div>

                     <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-[2px] rounded-[2rem] overflow-hidden">
                        <div className="bg-white p-8 rounded-[1.95rem] space-y-6">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                    <Sparkles size={24} />
                                 </div>
                                 <div>
                                    <h3 className="text-lg font-black text-slate-900">AI Writing Assistant</h3>
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[8px] font-black uppercase tracking-widest border border-blue-100">BETA</span>
                                 </div>
                              </div>
                              <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                                 <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                              </div>
                           </div>
                           <p className="text-sm font-semibold text-slate-500">Automatically generate a professional clinical summary from your assessment data. You can review and edit all content before finalizing.</p>
                           <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex gap-4">
                              <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                              <p className="text-[10px] font-bold text-blue-700 leading-relaxed uppercase tracking-wider">AI generation is simulated in this demo. Real generation uses your clinical notes and assessment scores.</p>
                           </div>
                        </div>
                     </div>

                     <div className="bg-white rounded-[2rem] border border-slate-100 p-8 space-y-6">
                        <h3 className="text-lg font-black text-slate-900">Diagnosis Codes</h3>
                        <div className="space-y-4">
                           <div className="relative">
                              <input type="text" placeholder="Search ICD-10 codes..." className="w-full h-12 pl-12 pr-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700" />
                              <FileSearch className="absolute left-4 top-3.5 text-slate-400" size={18} />
                           </div>
                           <div className="flex flex-wrap gap-3">
                              <div className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3">
                                 <span className="text-xs font-black text-blue-900">F84.0 - Autism Spectrum Disorder</span>
                                 <button className="text-blue-300 hover:text-blue-600"><X size={14} /></button>
                              </div>
                              <button className="text-[10px] font-black text-[#2563EB] uppercase tracking-widest flex items-center gap-1 hover:underline">
                                 <Plus size={14} /> Add additional code
                              </button>
                           </div>
                           <label className="flex items-center gap-3 cursor-pointer group pt-4">
                              <div className="w-5 h-5 rounded border-2 bg-[#2563EB] border-[#2563EB] text-white flex items-center justify-center">
                                 <Check size={14} strokeWidth={3} />
                              </div>
                              <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">Include DSM-5 Criteria Checklist</span>
                           </label>
                        </div>
                     </div>
                  </div>

                  <div className="w-full lg:w-[320px] shrink-0">
                     <div className="sticky top-28 space-y-8">
                        <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 shadow-sm overflow-hidden relative">
                           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Live Preview</h3>
                           <div className="aspect-[3/4] bg-white border border-slate-100 rounded-lg shadow-inner p-6 space-y-6">
                              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                 <div className="w-8 h-8 bg-slate-100 rounded-lg" />
                                 <div className="text-right space-y-1">
                                    <div className="w-20 h-1.5 bg-slate-200 rounded-full ml-auto" />
                                    <div className="w-16 h-1 bg-slate-100 rounded-full ml-auto" />
                                 </div>
                              </div>
                              <div className="text-center space-y-3 pt-4">
                                 <div className="w-3/4 h-3 bg-slate-900/10 rounded-full mx-auto" />
                                 <div className="w-1/2 h-2 bg-slate-100 rounded-full mx-auto" />
                              </div>
                              <div className="space-y-2 pt-8">
                                 <div className="w-full h-1 bg-slate-100 rounded-full" />
                                 <div className="w-full h-1 bg-slate-100 rounded-full" />
                                 <div className="w-4/5 h-1 bg-slate-100 rounded-full" />
                              </div>
                           </div>
                           <button className="w-full h-12 bg-slate-50 border border-slate-200 text-[#2563EB] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:border-blue-300 transition-all">Preview PDF</button>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {step === 4 && (
               <div className="flex flex-col xl:flex-row gap-10 animate-in slide-in-from-bottom-8 duration-700">
                  <div className="flex-1 space-y-8">
                     <div className="flex items-center justify-between">
                        <div className="space-y-1">
                           <h2 className="text-2xl font-black text-slate-900">Review & Generate</h2>
                           <p className="text-slate-500 font-medium">Review your report before generating</p>
                        </div>
                        <div className="flex bg-slate-100 p-1 rounded-xl">
                           <button className="px-4 py-2 bg-white rounded-lg shadow-sm text-xs font-black uppercase tracking-widest">Page 1</button>
                           <button className="px-4 py-2 text-slate-400 text-xs font-black uppercase tracking-widest">Page 2</button>
                           <span className="px-4 py-2 text-slate-300 text-xs font-bold uppercase">... 12</span>
                        </div>
                     </div>

                     <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-2xl relative overflow-hidden flex flex-col min-h-[800px]">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] select-none font-black text-[120px] -rotate-[35deg] z-0 uppercase">Demo Report</div>

                        <div className="p-12 border-b border-slate-100 bg-slate-50/30">
                           <div className="flex justify-between items-start mb-12">
                              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl">R</div>
                              <div className="text-right space-y-1">
                                 <p className="text-sm font-black text-slate-900">Rivera Child Development Center</p>
                                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Clinical Diagnostic Suite</p>
                                 <p className="text-[10px] text-slate-400">Date: October 24, 2024</p>
                              </div>
                           </div>
                           <div className="text-center py-10 space-y-4">
                              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-widest">Diagnostic Assessment Report</h1>
                              <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                 <span>Aarav Kumar</span>
                                 <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                 <span>7 years</span>
                                 <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                 <span>#DAI-8291</span>
                              </div>
                           </div>
                        </div>

                        <div className="p-12 space-y-12 flex-1">
                           <div className="space-y-6">
                              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b-2 border-slate-900 pb-2">1. Clinical Summary</h3>
                              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                 Aarav Kumar, a 7-year-old male, was evaluated for neurodevelopmental concerns related to social communication and repetitive behaviors. Assessment findings across multiple protocols including ISAA and clinical observation indicate a clinical profile consistent with Autism Spectrum Disorder (Level 1)...
                              </p>
                           </div>
                           <div className="space-y-6">
                              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b-2 border-slate-900 pb-2">2. Assessment Findings</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                 <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-black text-blue-600 uppercase mb-4">ISAA Autism Scale</p>
                                    <div className="flex items-end gap-2 mb-4">
                                       <span className="text-3xl font-black text-slate-900">78</span>
                                       <span className="text-sm font-bold text-slate-400 mb-1">/ 200</span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-600">Classification: Mild ASD</p>
                                 </div>
                                 <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-black text-teal-600 uppercase mb-4">GLAD Dyslexia Screening</p>
                                    <div className="flex items-end gap-2 mb-4">
                                       <span className="text-3xl font-black text-slate-900">70%</span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-600">Reading: Concern Area</p>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="p-12 bg-blue-50/50 border-t-2 border-slate-900 space-y-10">
                           <div className="flex items-center gap-3">
                              <ShieldCheck className="text-green-600" size={32} />
                              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Clinical Sign-Off</h3>
                           </div>

                           <div className="bg-white border-2 border-blue-100 rounded-[2.5rem] p-10 space-y-8 shadow-sm">
                              <label className="flex items-start gap-4 cursor-pointer group">
                                 <input
                                    type="checkbox"
                                    checked={clinicianSigned}
                                    onChange={(e) => setClinicianSigned(e.target.checked)}
                                    className="mt-1.5 w-6 h-6 rounded-lg border-2 border-blue-200 text-blue-600 focus:ring-blue-500"
                                 />
                                 <span className="text-sm font-bold text-slate-700 leading-relaxed">
                                    I certify that this report accurately reflects my clinical findings and recommendations based on the conducted assessments and clinical observations of Aarav Kumar.
                                 </span>
                              </label>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                 <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type Full Name to Sign</label>
                                    <input type="text" placeholder="Dr. Jane Rivera" className="w-full h-14 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xl font-black text-slate-900 placeholder:text-slate-200 focus:border-blue-500 outline-none transition-all shadow-sm" />
                                 </div>
                                 <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-center">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authenticated via</p>
                                    <p className="text-base font-black text-slate-900">Dr. Jane Rivera, Clinical Psychologist</p>
                                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">October 24, 2024</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="w-full xl:w-[320px] shrink-0 space-y-8">
                     <div className="sticky top-28 space-y-8">
                        <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 shadow-sm">
                           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4">Report Summary</h3>
                           <div className="space-y-4">
                              {[
                                 { l: 'Type', v: 'Diagnostic Report' },
                                 { l: 'Patient', v: 'Aarav Kumar' },
                                 { l: 'Pages', v: '12 pages' },
                                 { l: 'Sections', v: '8 sections' }
                              ].map(row => (
                                 <div key={row.l} className="flex justify-between items-center text-xs font-bold">
                                    <span className="text-slate-400 uppercase tracking-widest">{row.l}</span>
                                    <span className="text-slate-900">{row.v}</span>
                                 </div>
                              ))}
                           </div>
                           <div className="space-y-3 pt-4 border-t border-slate-50">
                              {['Assessment results', 'Clinical observations', 'DSM-5 criteria', 'ICD-10 codes'].map(s => (
                                 <div key={s} className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                                    <CheckCircle2 size={12} className="text-green-500" /> {s}
                                 </div>
                              ))}
                           </div>
                           <div className="pt-4 flex flex-col gap-2">
                              <button onClick={() => setStep(2)} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-2">✏ Edit Content</button>
                              <button onClick={() => setStep(3)} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-2">🎨 Edit Format</button>
                           </div>
                        </div>

                        <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 shadow-sm">
                           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4">Share Report</h3>
                           <div className="space-y-4">
                              <label className="flex items-center gap-3 cursor-pointer group">
                                 <div className="w-5 h-5 rounded border-2 bg-[#2563EB] border-[#2563EB] text-white flex items-center justify-center">
                                    <Check size={14} strokeWidth={3} />
                                 </div>
                                 <span className="text-sm font-bold text-slate-700">Download PDF</span>
                              </label>
                              <label className="flex items-center gap-3 cursor-pointer group">
                                 <div className="w-5 h-5 rounded border-2 bg-[#2563EB] border-[#2563EB] text-white flex items-center justify-center">
                                    <Check size={14} strokeWidth={3} />
                                 </div>
                                 <span className="text-sm font-bold text-slate-700">Send to parent email</span>
                              </label>
                              <div className="pl-8 space-y-3 animate-in fade-in duration-300">
                                 <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                                    <p className="text-[9px] font-black text-slate-400 uppercase">To: priya.kumar@email.com</p>
                                    <p className="text-[9px] font-bold text-slate-600">Subject: Diagnostic Report for Aarav Kumar</p>
                                 </div>
                              </div>
                              <label className="flex items-center gap-3 cursor-pointer group">
                                 <div className="w-5 h-5 rounded border-2 bg-white border-slate-200 flex items-center justify-center" />
                                 <span className="text-sm font-bold text-slate-500">Send to school</span>
                              </label>
                              <label className="flex items-center gap-3 cursor-pointer group">
                                 <div className="w-5 h-5 rounded border-2 bg-[#2563EB] border-[#2563EB] text-white flex items-center justify-center">
                                    <Check size={14} strokeWidth={3} />
                                 </div>
                                 <span className="text-sm font-bold text-slate-700">Add to patient file</span>
                              </label>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            )}

         </div>

         {/* Fixed Bottom Nav */}
         <footer className="fixed bottom-0 left-0 right-0 h-24 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-[100] px-12">
            <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between">
               <div className="flex items-center gap-6">
                  <button onClick={handleBack} className="h-14 px-10 border-2 border-slate-100 rounded-2xl text-sm font-black text-slate-400 hover:border-slate-300 hover:text-slate-800 uppercase tracking-widest transition-all flex items-center gap-2">
                     <ArrowLeft size={18} /> Back
                  </button>
               </div>

               <div className="flex flex-col items-center gap-3">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2rem]">Step {step} of 4 • {step === 4 && clinicianSigned ? '100%' : Math.round(step / 4 * 100)}% COMPLETE</p>
                  <div className="flex gap-2">
                     {[...Array(4)].map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full transition-all duration-500 ${i < step ? 'bg-[#2563EB]' : 'bg-slate-100'}`} />
                     ))}
                  </div>
               </div>

               <div className="flex items-center gap-4">
                  <button className="h-14 px-8 border-2 border-slate-100 rounded-2xl text-sm font-black text-slate-400 hover:border-slate-300 hover:text-slate-800 uppercase tracking-widest transition-all">Save Draft</button>
                  <button
                     onClick={handleNext}
                     disabled={(step === 1 && !reportType) || (step === 4 && !clinicianSigned)}
                     className={`h-14 px-12 rounded-2xl text-sm font-black uppercase tracking-[0.1em] shadow-2xl transition-all active:scale-95 flex items-center gap-3 ${((step === 1 && !reportType) || (step === 4 && !clinicianSigned))
                           ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                           : 'bg-[#2563EB] text-white shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1'
                        }`}
                  >
                     {step === 4 ? 'Generate Report' : 'Continue'} <ArrowRight size={20} />
                  </button>
               </div>
            </div>
         </footer>

         {/* Success Modal */}
         {showSuccess && (
            <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-500">
               <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-12 text-center space-y-8 animate-in zoom-in duration-300">
                  <div className="w-32 h-32 bg-green-50 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl shadow-green-100 ring-4 ring-white relative">
                     <CheckCircle2 size={80} className="text-green-500" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-2">
                     <h2 className="text-4xl font-black text-slate-900 tracking-tight">Report Generated Successfully! ✓</h2>
                     <p className="text-lg font-semibold text-slate-500">Your diagnostic report for Aarav Kumar is ready</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 space-y-4">
                     <div className="grid grid-cols-2 gap-y-4 text-left">
                        <div><p className="text-[10px] font-black text-slate-400 uppercase">Report ID</p><p className="text-sm font-black text-slate-800">REP-DAI-8291-2024</p></div>
                        <div><p className="text-[10px] font-black text-slate-400 uppercase">Generated</p><p className="text-sm font-black text-slate-800">Today, 3:45 PM</p></div>
                        <div className="col-span-2"><p className="text-[10px] font-black text-slate-400 uppercase">Saved to</p><p className="text-sm font-black text-slate-800 flex items-center gap-2">Patient Documents Archive <CheckCircle2 size={14} className="text-green-500" /></p></div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <button onClick={onFinish} className="h-14 bg-[#2563EB] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                        <Download size={18} /> Download PDF
                     </button>
                     <button onClick={onFinish} className="h-14 bg-white border-2 border-slate-100 text-slate-500 rounded-2xl font-black text-sm uppercase tracking-widest hover:border-blue-200 hover:text-blue-600 transition-all">View in Library</button>
                  </div>

                  <div className="pt-4 border-t border-slate-50">
                     <div className="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] inline-flex items-center gap-2">
                        <Mail size={14} /> Email Sent to Parent
                     </div>
                  </div>

                  <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3">
                     <span className="text-amber-600">🎭</span>
                     <p className="text-[10px] font-bold text-amber-800 tracking-tight leading-relaxed text-left uppercase">
                        Demo completion: In production, a secure PDF would be generated, digitally signed, and delivered via the specified channels.
                     </p>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default ReportGenerator;
