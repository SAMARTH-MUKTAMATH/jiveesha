
import React, { useState, useEffect, useRef } from 'react';
import {
  FileText, Users, MapPin, CheckCircle2, ChevronRight,
  Plus, X, Calendar, User, Search, Info, AlertTriangle,
  ChevronDown, LayoutList, Sparkles, BarChart3, ArrowRight,
  ClipboardList, Heart, Award, ExternalLink, ShieldCheck,
  Target, Zap, Settings, ArrowLeft, Trash2, GripVertical,
  Check, Monitor, HelpCircle, BookOpen, Clock, Filter,
  Star, Printer, Mail, Download, Send, Globe, Smartphone,
  FileSearch, Activity, ShieldAlert, Share2
} from 'lucide-react';

interface IEPBuilderProps {
  onBack: () => void;
  onFinish?: () => void;
}

const IEPBuilder: React.FC<IEPBuilderProps> = ({ onBack, onFinish }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [plopTab, setPlopTab] = useState('Academic');
  const [expandedSection, setExpandedSection] = useState<string | null>('Reading');
  const [showGoalBank, setShowGoalBank] = useState(false);
  const [goalDomain, setGoalDomain] = useState('Communication');
  const [isSmartExpanded, setIsSmartExpanded] = useState(false);
  const [accommTab, setAccommTab] = useState('Environmental');

  // Step 4 States
  const [activeGoalTab, setActiveGoalTab] = useState(1);
  const [selectedInterventions, setSelectedInterventions] = useState<string[]>(['pecs', 'social-comm', 'og-reading', 'social-thinking']);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set());


  const handleToggleActivity = (id: string) => {
    if (completedActivities.has(id)) {
      setCompletedActivities(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } else {
      setCompletedActivities(prev => new Set(prev).add(id));
    }
  };

  // Step 5 States
  const [clinicianSigned, setClinicianSigned] = useState(false);
  const [signatureText, setSignatureText] = useState('');

  const steps = [
    { id: 1, label: 'Details', icon: <FileText size={18} /> },
    { id: 2, label: 'Goals', icon: <Target size={18} /> },
    { id: 3, label: 'Accommodations', icon: <Zap size={18} /> },
    { id: 4, label: 'Interventions', icon: <Activity size={18} /> },
    { id: 5, label: 'Review', icon: <CheckCircle2 size={18} /> },
  ];

  const handleNext = () => {
    if (currentStep === 5) {
      setShowSuccessModal(true);
    } else {
      setCurrentStep(prev => Math.min(prev + 1, 5));
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep === 1) onBack();
    else {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const goals = [
    { id: 1, domain: 'Communication', priority: 'HIGH', text: 'By April 24, 2025, Aarav Kumar will use complete 4-5 word sentences to express wants and needs during structured classroom activities with minimal adult prompting with 80% accuracy across 4 consecutive therapy sessions.' },
    { id: 2, domain: 'Academic - Reading', priority: 'MEDIUM', text: 'By April 24, 2025, Aarav will decode Grade 1 level text with 85% accuracy as measured by weekly reading probes.' },
    { id: 3, domain: 'Social-Emotional', priority: 'MEDIUM', text: 'By April 24, 2025, Aarav will initiate peer interactions during free play 5 times per recess with appropriate social greetings with 70% success.' }
  ];

  const interventionsByGoal: Record<number, any[]> = {
    1: [
      { id: 'pecs', name: 'PECS (Picture Exchange Communication System)', evidence: 'Gold Standard', stars: 5, users: '1,247', success: '82%', dur: '6-12 months', desc: 'Systematic approach to teach functional communication using picture symbols.', tags: ['ASD', 'Non-verbal'], level: 'Communication' },
      { id: 'social-comm', name: 'Social Communication Protocol', evidence: 'High Evidence', stars: 4, users: '856', success: '75%', dur: '3-6 months', desc: 'Structured teaching of pragmatic language skills including greetings and turn-taking.', tags: ['ASD', 'Pragmatic'], level: 'Communication' },
      { id: 'milieu', name: 'Milieu Teaching', evidence: 'Gold Standard', stars: 5, users: '2,103', success: '88%', dur: '9-12 months', desc: 'Naturalistic intervention using child\'s interests and environment.', tags: ['Early Interv', 'Parent training'], level: 'Communication' }
    ],
    2: [
      { id: 'og-reading', name: 'Orton-Gillingham Reading Intervention', evidence: 'Gold Standard', stars: 5, users: '3,412', success: '85%', dur: '12-24 months', desc: 'Structured, sequential, multisensory approach to teaching reading.', tags: ['Dyslexia', 'Decoding'], level: 'Reading' },
      { id: 'read-naturally', name: 'Read Naturally Fluency Program', evidence: 'High Evidence', stars: 4, users: '1,890', success: '78%', dur: '6-9 months', desc: 'Research-based program using repeated reading to build speed.', tags: ['Fluency', 'K-3'], level: 'Reading' }
    ],
    3: [
      { id: 'social-thinking', name: 'Social Thinking Curriculum', evidence: 'High Evidence', stars: 4, users: '1,540', success: '72%', dur: 'Ongoing', desc: 'Teaching social skills through perspective taking and social cues.', tags: ['Social Skills', 'ASD'], level: 'Social' },
      { id: 'peers', name: 'PEERS® Social Skills Training', evidence: 'Gold Standard', stars: 5, users: '980', success: '80%', dur: '14-16 weeks', desc: 'Evidence-based social skills intervention for motivated kids.', tags: ['Social', 'Research-Backed'], level: 'Social' }
    ]
  };

  return (
    <div className="w-full animate-in fade-in duration-500 pb-24 relative overflow-hidden bg-[#F8FAFC] min-h-screen font-sans">
      {/* Demo watermark */}
      <div className="fixed top-24 right-[-40px] bg-orange-500/80 text-white font-black text-[10px] py-1 px-12 rotate-45 z-[100] pointer-events-none uppercase tracking-widest shadow-lg">
        Demo Mode
      </div>

      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-[60]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-8">
            <div>
              <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                <button onClick={onBack} className="hover:text-[#2563EB]">Dashboard</button>
                <ChevronRight size={14} />
                <span className="text-slate-800">Create New IEP</span>
                {currentStep > 1 && (
                  <>
                    <ChevronRight size={14} />
                    <span className="text-slate-800">{steps[currentStep - 1].label}</span>
                  </>
                )}
              </nav>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create New IEP</h1>
              <p className="text-slate-500 mt-1 font-medium italic">IEP Builder: Step {currentStep} of 5</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl flex items-center gap-3">
              <span className="p-1 bg-amber-100 text-amber-600 rounded-lg"><AlertTriangle size={16} /></span>
            </div>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-between max-w-4xl mx-auto relative px-4">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
            {steps.map((s) => (
              <div key={s.id} className="relative z-10 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${currentStep === s.id
                  ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-lg shadow-blue-200'
                  : currentStep > s.id
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'bg-white border-slate-200 text-slate-300'
                  }`}>
                  {currentStep > s.id ? <Check size={20} strokeWidth={3} /> : s.icon}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest mt-3 transition-colors ${currentStep === s.id ? 'text-[#2563EB]' : 'text-slate-400'
                  }`}>
                  {s.id}. {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mt-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 space-y-10">

            {/* STEP 1: DETAILS */}
            {currentStep === 1 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-500">
                <section className="space-y-6">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><User size={20} /></div>
                    Student Information
                  </h2>
                  <div className="bg-white rounded-[2.5rem] border-2 border-[#2563EB] p-8 shadow-xl shadow-blue-100 relative overflow-hidden group">
                    <div className="absolute top-4 right-4 px-2 py-1 bg-blue-50 text-blue-600 rounded text-[8px] font-black uppercase tracking-widest border border-blue-100">Patient Record Sync</div>
                    <div className="flex flex-col sm:flex-row items-center gap-10">
                      <div className="w-24 h-24 rounded-[2rem] border-4 border-slate-50 shadow-xl overflow-hidden ring-4 ring-blue-50">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rivera" alt="Aarav" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 text-center sm:text-left space-y-4">
                        <div>
                          <h3 className="text-3xl font-black text-slate-900">Aarav Kumar</h3>
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">#DAI-8291</span>
                            <span className="text-slate-200">|</span>
                            <span className="text-xs font-bold text-slate-500 uppercase">7 years 4 months</span>
                            <span className="text-slate-200">|</span>
                            <span className="text-xs font-bold text-slate-500 uppercase">Grade 2, Section B</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                          <span className="px-2.5 py-1 bg-purple-50 text-purple-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-purple-100">ASD (Level 1)</span>
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">Speech Delay</span>
                        </div>
                      </div>
                      <button className="text-xs font-black text-[#2563EB] uppercase tracking-widest hover:underline px-4 py-2 bg-blue-50 rounded-xl">Change Student</button>
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Calendar size={20} /></div>
                    IEP Period
                  </h2>
                  <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-8 shadow-sm space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">IEP Start Date *</label>
                        <input type="date" defaultValue="2024-10-24" className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">IEP End Date *</label>
                        <input type="date" defaultValue="2025-10-24" className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">IEP Review Date *</label>
                        <input type="date" defaultValue="2025-04-24" className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500" />
                      </div>
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><ClipboardList size={20} /></div>
                    Present Levels (PLOP)
                  </h2>
                  <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-2 overflow-hidden">
                    <div className="flex bg-slate-100 p-1.5 rounded-[2rem] m-2">
                      {['Academic', 'Functional', 'Strengths', 'Impact'].map(t => (
                        <button key={t} onClick={() => setPlopTab(t)} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${plopTab === t ? 'bg-white text-[#2563EB] shadow-sm' : 'text-slate-400'}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                    <div className="p-8 min-h-[400px]">
                      {plopTab === 'Academic' && (
                        <div className="space-y-4">
                          {['Reading', 'Mathematics', 'Writing'].map(domain => (
                            <div key={domain} className="border border-slate-100 rounded-3xl">
                              <button onClick={() => setExpandedSection(expandedSection === domain ? null : domain)} className="w-full flex items-center justify-between p-5 bg-slate-50/50 hover:bg-slate-100 transition-colors rounded-3xl">
                                <span className="text-sm font-black text-slate-700 uppercase">{domain}</span>
                                <ChevronDown size={18} className={`text-slate-300 transition-transform ${expandedSection === domain ? 'rotate-180' : ''}`} />
                              </button>
                              {expandedSection === domain && (
                                <div className="p-6 space-y-4">
                                  <textarea className="w-full h-40 p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] text-sm font-semibold text-slate-700" defaultValue={domain === 'Reading' ? "Aarav is reading at early Grade 1 level. He recognizes 80% of high-frequency words." : ""} />
                                  <div className="flex gap-2">
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[8px] font-black uppercase">GLAD Assessment Oct 24</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* STEP 2: GOALS */}
            {currentStep === 2 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">IEP Goals & Objectives</h2>
                    <p className="text-sm text-slate-500">Create SMART goals aligned with student's needs</p>
                  </div>
                  <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">
                    2 Goals Added
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button onClick={() => setShowGoalBank(true)} className="bg-white border-2 border-blue-100 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center gap-4 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all group">
                    <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BookOpen size={32} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900">Browse Goal Bank</h4>
                      <p className="text-xs text-slate-400 font-bold uppercase mt-1">500+ Evidence-Based Goals</p>
                    </div>
                  </button>
                  <button className="bg-white border-2 border-purple-100 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center gap-4 hover:border-purple-500 hover:shadow-xl hover:-translate-y-1 transition-all group">
                    <div className="w-16 h-16 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plus size={32} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900">Create Custom Goal</h4>
                      <p className="text-xs text-slate-400 font-bold uppercase mt-1">Build from Template</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: ACCOMMODATIONS */}
            {currentStep === 3 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Accommodations & Modifications</h2>
                    <p className="text-sm text-slate-500">Define supports to help Aarav access the curriculum</p>
                  </div>
                  <div className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-100">
                    15 Supports Selected
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {['Environmental', 'Instructional', 'Assessment'].map(tab => (
                    <button key={tab} onClick={() => setAccommTab(tab)} className={`p-6 rounded-[2rem] border-2 text-left transition-all ${accommTab === tab ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-500'}`}>
                      <h4 className="text-sm font-black uppercase tracking-widest">{tab}</h4>
                      <p className="text-[10px] font-bold opacity-60">Selected items: {tab === 'Environmental' ? 2 : 4}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: INTERVENTIONS & STRATEGIES */}
            {currentStep === 4 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Evidence-Based Interventions</h2>
                    <p className="text-sm text-slate-500">Select research-validated strategies to support IEP goals</p>
                  </div>
                  <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-100 flex items-center gap-2">
                    <CheckCircle2 size={12} /> All Research-Validated
                  </span>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-4 rounded-3xl border border-slate-200 flex flex-col lg:flex-row items-center gap-4 shadow-sm">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input type="text" placeholder="Search intervention library..." className="w-full h-10 pl-10 pr-4 bg-slate-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                  </div>
                  <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                    {['Evidence Level', 'Domain', 'Disability', 'Grade Level'].map(f => (
                      <button key={f} className="h-10 px-4 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 hover:border-blue-300 transition-colors">
                        {f} <ChevronDown size={14} />
                      </button>
                    ))}
                    <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest px-2 hover:underline">Reset</button>
                  </div>
                </div>

                {/* Goal-to-Intervention Tabs */}
                <div className="space-y-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-4">Map Interventions to Goals</h3>
                  <div className="flex bg-slate-100 p-1.5 rounded-[2rem] overflow-x-auto scrollbar-hide">
                    {goals.map(g => (
                      <button
                        key={g.id}
                        onClick={() => setActiveGoalTab(g.id)}
                        className={`flex-1 min-w-[200px] py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${activeGoalTab === g.id ? 'bg-white text-[#2563EB] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        Goal {g.id}: {g.domain}
                      </button>
                    ))}
                  </div>

                  {/* Active Goal Info */}
                  <div className="bg-blue-50 border border-blue-100 rounded-[2rem] p-6 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                      <Target size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Targeting Domain: {goals.find(g => g.id === activeGoalTab)?.domain}</p>
                      <p className="text-sm font-bold text-blue-900 leading-relaxed italic">"{goals.find(g => g.id === activeGoalTab)?.text}"</p>
                    </div>
                  </div>

                  {/* Intervention Cards Library */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {interventionsByGoal[activeGoalTab].map(interv => (
                      <div key={interv.id} className={`bg-white rounded-[2.5rem] border-2 transition-all group relative ${selectedInterventions.includes(interv.id) ? 'border-blue-600 shadow-xl shadow-blue-100' : 'border-slate-100 hover:border-blue-300'}`}>
                        {selectedInterventions.includes(interv.id) && (
                          <div className="absolute top-6 right-6 w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg"><Check size={20} strokeWidth={3} /></div>
                        )}
                        <div className="p-8">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => <Star key={i} size={14} className={`${i < interv.stars ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />)}
                            </div>
                            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{interv.evidence}</span>
                          </div>
                          <h4 className="text-xl font-black text-slate-900 leading-tight mb-2 uppercase tracking-tight">{interv.name}</h4>
                          <p className="text-sm font-semibold text-slate-500 leading-relaxed mb-6">{interv.desc}</p>
                          <div className="flex flex-wrap gap-2 mb-8">
                            {interv.tags.map(t => <span key={t} className="px-2.5 py-1 bg-slate-50 text-slate-400 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-slate-100">{t}</span>)}
                          </div>
                          <div className="grid grid-cols-3 gap-4 py-6 border-y border-slate-50 mb-8">
                            <div className="space-y-0.5 text-center">
                              <p className="text-[9px] font-bold text-slate-400 uppercase">Usage</p>
                              <p className="text-sm font-black text-slate-800">{interv.users}</p>
                            </div>
                            <div className="space-y-0.5 text-center border-x border-slate-50">
                              <p className="text-[9px] font-bold text-slate-400 uppercase">Success</p>
                              <p className="text-sm font-black text-green-600">{interv.success}</p>
                            </div>
                            <div className="space-y-0.5 text-center">
                              <p className="text-[9px] font-bold text-slate-400 uppercase">Est. Dur</p>
                              <p className="text-sm font-black text-slate-800">{interv.dur}</p>
                            </div>
                          </div>
                          {selectedInterventions.includes(interv.id) ? (
                            <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Frequency</label>
                                  <select className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none">
                                    <option>Daily (5x/week)</option>
                                    <option>Weekly (2x/week)</option>
                                  </select>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</label>
                                  <input type="text" defaultValue="30 minutes" className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinical Rationale</label>
                                <textarea className="w-full h-24 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-600 outline-none focus:border-blue-400 resize-none" defaultValue={`Given Aarav's current skills in ${interv.level.toLowerCase()}, ${interv.name.split('(')[0]} will provide targeted support...`} />
                              </div>

                              <div className="pt-2 border-t border-slate-50">
                                <button
                                  onClick={() => handleToggleActivity(interv.id)}
                                  className={`w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${completedActivities.has(interv.id)
                                    ? 'bg-green-500 text-white shadow-lg shadow-green-100'
                                    : 'bg-white border-2 border-slate-100 text-slate-400 hover:border-green-400 hover:text-green-600'
                                    }`}
                                >
                                  {completedActivities.has(interv.id) ? (
                                    <>
                                      <CheckCircle2 size={18} /> Practice Session Finished
                                    </>
                                  ) : (
                                    <>
                                      <Activity size={18} /> Mark Practice Session Done
                                    </>
                                  )}
                                </button>
                              </div>

                              <button
                                onClick={() => setSelectedInterventions(prev => prev.filter(id => id !== interv.id))}
                                className="w-full h-12 bg-blue-50 text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-100 transition-colors"
                              >
                                ✓ Selected (Click to Remove)
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setSelectedInterventions(prev => [...prev, interv.id])}
                              className="w-full h-12 border-2 border-slate-100 rounded-xl text-xs font-black text-slate-400 uppercase tracking-widest hover:border-blue-400 hover:text-blue-600 transition-all"
                            >
                              + Add to IEP
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scheduling Visualizer */}
                <section className="space-y-6">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Calendar size={20} /></div>
                    Weekly Schedule Coordination
                  </h3>
                  <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-8 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr>
                            <th className="p-4 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase text-left">Time</th>
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                              <th key={day} className="p-4 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase">{day}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { t: '09:00 - 09:30', m: 'PECS (SLP)', tu: 'PECS', w: 'PECS', th: 'PECS', f: 'PECS' },
                            { t: '10:00 - 10:30', m: 'O-G Reading', tu: 'O-G', w: 'O-G', th: 'O-G', f: 'O-G' },
                            { t: '13:00 - 13:45', tu: 'Social Comm', th: 'Social Comm' },
                            { t: '14:00 - 14:45', m: 'Social Group' }
                          ].map((row, i) => (
                            <tr key={i}>
                              <td className="p-4 border-b border-slate-50 text-[10px] font-bold text-slate-400 uppercase whitespace-nowrap">{row.t}</td>
                              {[row.m, row.tu, row.w, row.th, row.f].map((val, vi) => (
                                <td key={vi} className="p-2 border-b border-slate-50">
                                  {val && (
                                    <div className={`p-2 rounded-xl text-[9px] font-black uppercase text-center border ${val.includes('PECS') ? 'bg-blue-50 text-blue-600 border-blue-100' : val.includes('O-G') ? 'bg-teal-50 text-teal-600 border-teal-100' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>
                                      {val}
                                    </div>
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-8 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] font-black text-green-600 uppercase">
                        <CheckCircle2 size={14} /> No scheduling conflicts detected
                      </div>
                      <p className="text-xs font-bold text-slate-400">Total Weekly Service: <span className="text-slate-900">8.5 Hours</span></p>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* STEP 5: REVIEW & SIGN-OFF */}
            {currentStep === 5 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-12 duration-700">
                <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Review & Finalize IEP</h2>
                    <p className="text-sm text-slate-500">Preview the complete document before clinical sign-off</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors"><Printer size={14} /> Preview PDF</button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors"><Mail size={14} /> Email Draft</button>
                  </div>
                </div>

                {/* PDF PREVIEW CARD */}
                <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-2xl relative overflow-hidden flex flex-col">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] select-none font-black text-[120px] -rotate-[35deg] z-0 uppercase">Demo Document</div>

                  <div className="p-12 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-white"><ShieldAlert size={40} /></div>
                      <div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Individualized Education Program (IEP)</h2>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Delhi Public School District • 2024-2025 Academic Year</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Document ID</p>
                      <p className="text-sm font-black text-slate-900">#IEP-DAI-8291-2024</p>
                    </div>
                  </div>

                  <div className="p-12 space-y-12 relative z-10 max-h-[800px] overflow-y-auto scrollbar-hide">

                    {/* Section 1-4... abbreviated for implementation but full headers shown */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">1. Student Information</h3>
                        <button onClick={() => setCurrentStep(1)} className="text-[10px] font-black text-blue-600 uppercase hover:underline">Edit</button>
                      </div>
                      <div className="grid grid-cols-3 gap-8 text-xs">
                        <div><p className="text-slate-400 uppercase font-bold text-[9px] mb-1">Name</p><p className="font-bold">Aarav Kumar</p></div>
                        <div><p className="text-slate-400 uppercase font-bold text-[9px] mb-1">Eligibility</p><p className="font-bold">Autism Spectrum Disorder (ASD)</p></div>
                        <div><p className="text-slate-400 uppercase font-bold text-[9px] mb-1">IEP Cycle</p><p className="font-bold">Oct 2024 - Oct 2025</p></div>
                      </div>
                    </div>

                    {/* Section 5: Accommodations & Modifications */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">5. Accommodations & Modifications</h3>
                        <button onClick={() => setCurrentStep(3)} className="text-[10px] font-black text-blue-600 uppercase hover:underline">Edit</button>
                      </div>
                      <div className="grid grid-cols-2 gap-8 text-xs">
                        <div className="space-y-2">
                          <p className="font-black text-slate-900 uppercase text-[9px]">Environmental Accommodations</p>
                          <ul className="list-disc list-inside text-slate-700 font-medium">
                            <li>Preferential seating near teacher</li>
                            <li>Reduced visual/auditory distractions</li>
                            <li>Visual schedules and timers</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <p className="font-black text-slate-900 uppercase text-[9px]">Instructional Accommodations</p>
                          <ul className="list-disc list-inside text-slate-700 font-medium">
                            <li>Chunked assignments (5-7 problems)</li>
                            <li>Extended time (1.5x) for tests</li>
                            <li>Visual models and graphic organizers</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Section 6: Related Services */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">6. Related Services</h3>
                      </div>
                      <div className="border border-slate-100 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50">
                            <tr className="font-black text-slate-400 uppercase text-[9px]">
                              <th className="p-3">Service</th>
                              <th className="p-3">Frequency</th>
                              <th className="p-3">Location</th>
                              <th className="p-3">Provider</th>
                            </tr>
                          </thead>
                          <tbody className="font-bold text-slate-700">
                            <tr className="border-t border-slate-50">
                              <td className="p-3">Speech-Language Therapy</td>
                              <td className="p-3">2x / Week</td>
                              <td className="p-3">Pull-out</td>
                              <td className="p-3">Dr. Sarah Mehta</td>
                            </tr>
                            <tr className="border-t border-slate-50">
                              <td className="p-3">Occupational Therapy</td>
                              <td className="p-3">1x / Week</td>
                              <td className="p-3">Resource Room</td>
                              <td className="p-3">Ms. Rita Gupta</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Section 7: Evidence-Based Interventions */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">7. Evidence-Based Interventions</h3>
                        <button onClick={() => setCurrentStep(4)} className="text-[10px] font-black text-blue-600 uppercase hover:underline">Edit</button>
                      </div>
                      <div className="space-y-4">
                        {selectedInterventions.slice(0, 3).map((id, i) => (
                          <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                            <div>
                              <p className="font-black text-slate-900 text-xs uppercase tracking-tight">{id.toUpperCase()} Protocol</p>
                              <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase">Gold Standard Evidence • Daily Implementation</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] font-black text-blue-600 uppercase">Clinically Approved</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section 8: Educational Placement (LRE) */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">8. Educational Placement (LRE)</h3>
                      </div>
                      <div className="p-6 bg-blue-50/50 rounded-2xl text-xs font-semibold text-slate-700 leading-relaxed italic">
                        "Aarav benefits from the social modeling and academic expectations of the general education environment. Pull-out services for speech, OT, and specialized reading instruction provide necessary intensive intervention while maintaining meaningful peer interaction. This placement allows for maximum inclusion while meeting individual needs."
                      </div>
                    </div>

                    {/* Section 9-11 (Combined for demo brevity) */}
                    <div className="space-y-6">
                      <div className="border-b-2 border-slate-900 pb-2">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">9-11. Statewide Assessments & ESY</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-8 text-xs font-bold text-slate-600">
                        <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Participate with Accommodations</div>
                        <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-slate-300" /> ESY Eligibility TBD (March 2025)</div>
                      </div>
                    </div>

                    {/* Sign-off Area */}
                    <div className="pt-12 border-t-2 border-slate-900 space-y-10">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="text-green-600" size={32} />
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Clinical Sign-Off</h3>
                      </div>

                      <div className="bg-blue-50 border-2 border-blue-100 rounded-[2.5rem] p-10 space-y-8">
                        <label className="flex items-start gap-4 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={clinicianSigned}
                            onChange={(e) => setClinicianSigned(e.target.checked)}
                            className="mt-1.5 w-6 h-6 rounded-lg border-2 border-blue-200 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm font-bold text-slate-700 leading-relaxed">
                            I certify that this IEP is clinically appropriate, evidence-based, and designed to meet the unique needs of this student. I have participated in the development of this IEP and approve its contents.
                          </span>
                        </label>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type Full Name to Sign</label>
                            <input
                              type="text"
                              value={signatureText}
                              onChange={(e) => setSignatureText(e.target.value)}
                              placeholder="Dr. Jane Rivera"
                              className="w-full h-14 px-6 bg-white border-2 border-blue-100 rounded-2xl text-xl font-black text-slate-900 placeholder:text-slate-200 focus:border-blue-500 outline-none transition-all shadow-sm"
                            />
                          </div>
                          <div className="bg-white rounded-2xl p-6 border border-blue-100 flex flex-col justify-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authenticated via</p>
                            <p className="text-base font-black text-slate-900">Dr. Jane Rivera, Clinical Psychologist</p>
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">RCI: RCI/12345/2020</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 bg-slate-50 rounded-3xl border border-slate-100">
                        <div>
                          <p className="text-sm font-black text-slate-800">Parental Consent Awaiting</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Sent to: priya.kumar@email.com</p>
                        </div>
                        <div className="flex gap-3">
                          <button className="h-10 px-6 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors">Resend Invitation</button>
                          <button className="h-10 px-6 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors">Print for Sign</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR AREA */}
          <aside className="w-full lg:w-[320px] shrink-0 space-y-8 sticky top-[160px] h-fit">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 overflow-hidden relative">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">IEP Completion Checklist</h3>
              <div className="space-y-4">
                {[
                  { label: 'Student Info Complete', done: true },
                  { label: 'Team Roles Identified', done: true },
                  { label: 'Annual Goals SMART', done: true },
                  { label: 'Interventions Linked', done: currentStep >= 4 },
                  { label: 'Placement Justified', done: true },
                  { label: 'Clinical Sign-off', done: clinicianSigned && currentStep === 5 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {item.done ? <CheckCircle2 size={16} className="text-green-500" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-200" />}
                    <span className={`text-[11px] font-bold ${item.done ? 'text-slate-900' : 'text-slate-300'}`}>{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-slate-50">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Readiness Score</span>
                  <span className="text-xs font-black text-[#2563EB]">{currentStep === 5 && clinicianSigned ? '100%' : '92%'}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full bg-[#2563EB] shadow-[0_0_8px_rgba(37,99,235,0.4)] transition-all duration-700" style={{ width: currentStep === 5 && clinicianSigned ? '100%' : '92%' }} />
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-slate-200">
              <div className="absolute top-[-10%] right-[-5%] w-32 h-32 bg-white/5 rounded-full blur-3xl" />
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 relative z-10 flex items-center justify-between">
                ✓ IDEA Compliance
                <ShieldCheck size={14} className="text-green-500" />
              </h3>
              <div className="space-y-3 relative z-10">
                {[
                  'All required components present',
                  'LRE justified and documented',
                  'Review date within 12 months',
                  'Services sufficient for goals'
                ].map((req, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={12} className="text-green-500" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{req}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-center relative z-10">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-[10px] font-black uppercase tracking-[0.1em] border border-green-500/20">Legally Compliant</span>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-100 rounded-3xl p-6 space-y-4">
              <h3 className="text-xs font-black text-blue-900 uppercase tracking-widest flex items-center gap-2"><Sparkles size={14} /> Clinical Quality Check</h3>
              <ul className="space-y-3">
                {[
                  'Interventions align with ISAA results',
                  'Recommended parent training added',
                  'Goal 2 timeline is optimized',
                  'Service hours are balanced'
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-[10px] font-bold text-blue-700/70 uppercase leading-tight">
                    <div className="w-1 h-1 rounded-full bg-blue-400 shrink-0 mt-1" /> {tip}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {/* Bottom Nav Bar */}
      <footer className="fixed bottom-0 left-0 right-0 h-24 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-[100] px-12">
        <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={handleBack} className="h-14 px-8 border-2 border-slate-100 rounded-2xl text-sm font-black text-slate-400 hover:border-slate-300 hover:text-slate-800 uppercase tracking-widest transition-all flex items-center gap-2">
              <ArrowLeft size={18} /> {currentStep === 1 ? 'Exit Builder' : 'Back'}
            </button>
            <div className="h-8 w-px bg-slate-100" />
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Auto-save active
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2rem]">Step {currentStep} of 5 • {currentStep === 5 && clinicianSigned ? '100%' : '92%'} COMPLETE</p>
            <div className="flex gap-1.5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i < currentStep ? 'bg-[#2563EB]' : 'bg-slate-100'}`} />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="h-14 px-8 border-2 border-slate-100 rounded-2xl text-sm font-black text-slate-400 hover:border-slate-300 hover:text-slate-800 uppercase tracking-widest transition-all">Save as Draft</button>
            <button
              onClick={handleNext}
              disabled={currentStep === 5 && !clinicianSigned}
              className={`h-14 px-12 rounded-2xl text-sm font-black uppercase tracking-[0.1em] shadow-2xl transition-all active:scale-95 flex items-center gap-3 ${currentStep === 5 && !clinicianSigned
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-[#2563EB] text-white shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1'
                }`}
            >
              {currentStep === 5 ? 'Finalize & Request Signatures' : `Continue to ${steps[currentStep].label}`} <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </footer>

      {/* Goal Bank Modal */}
      {showGoalBank && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 sm:p-12">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowGoalBank(false)} />
          <div className="bg-white w-full max-w-4xl max-h-[80vh] rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Goal Bank - {goalDomain}</h3>
                <p className="text-sm text-slate-500">500+ evidence-based goals for {goalDomain}</p>
              </div>
              <button onClick={() => setShowGoalBank(false)} className="p-3 bg-slate-100 text-slate-500 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30">
              {[
                { g: "By [date], [student] will increase expressive vocabulary by using 50 new functional words in appropriate context with 80% accuracy.", t: ["Expressive", "ASD-Friendly"], u: 234 },
                { g: "By [date], [student] will initiate and maintain conversational turn-taking for 3-4 exchanges with peers during structured activities with 70% accuracy.", t: ["Pragmatic", "Social"], u: 187 }
              ].map((bankGoal, i) => (
                <div key={i} className="bg-white rounded-[2rem] border border-slate-100 p-6 flex items-start justify-between gap-6 hover:border-blue-300 transition-all group">
                  <div className="space-y-4">
                    <p className="text-sm font-bold text-slate-800 leading-relaxed italic">"{bankGoal.g}"</p>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-1.5">
                        {bankGoal.t.map(tag => <span key={tag} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[8px] font-black uppercase">{tag}</span>)}
                      </div>
                      <div className="h-4 w-px bg-slate-100" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">⭐⭐⭐⭐ Used by {bankGoal.u} clinicians</span>
                    </div>
                  </div>
                  <button className="px-5 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm">Add to IEP</button>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-slate-100 bg-white flex items-center justify-between">
              <button className="text-sm font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest">Back to top</button>
              <button onClick={() => setShowGoalBank(false)} className="h-12 px-8 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest">Done Browsing</button>
            </div>
          </div>
        </div>
      )}

      {/* FINAL SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-12 text-center space-y-8 animate-in zoom-in duration-300">
            <div className="w-32 h-32 bg-green-50 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl shadow-green-100 ring-4 ring-white relative">
              <CheckCircle2 size={80} className="text-green-500" strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">IEP Finalized!</h2>
              <p className="text-lg font-semibold text-slate-500">Document sent for team signatures</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 space-y-6">
              <div className="flex flex-col gap-4 text-left">
                {[
                  { l: '✓ IEP Finalized', d: 'Today, 2:45 PM', c: 'text-green-600' },
                  { l: '→ Team Reviews & Signs', d: 'Estimated 3-5 business days', c: 'text-blue-600 animate-pulse' },
                  { l: '○ Parent Review & Sign', d: 'Pending team approval', c: 'text-slate-300' }
                ].map((step, i) => (
                  <div key={i} className="flex gap-4 relative">
                    {i < 2 && <div className="absolute left-[7px] top-6 bottom-[-16px] w-0.5 bg-slate-100" />}
                    <div className={`w-4 h-4 rounded-full ${step.c.includes('green') ? 'bg-green-500' : step.c.includes('blue') ? 'bg-blue-500' : 'bg-slate-200'} ring-4 ring-white shrink-0 mt-1`} />
                    <div>
                      <p className={`text-sm font-black uppercase tracking-tight ${step.c}`}>{step.l}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <button onClick={onFinish} className="h-14 bg-[#2563EB] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">View Finalized IEP</button>
              <button onClick={onBack} className="h-14 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl font-black text-sm uppercase tracking-widest hover:border-blue-200 hover:text-blue-600 transition-all">Go to Dashboard</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IEPBuilder;
