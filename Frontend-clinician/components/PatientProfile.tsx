
import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Edit3, Plus, MoreHorizontal, User, Calendar,
  MapPin, School, Phone, Mail, FileText, CheckCircle2,
  TrendingUp, Clock, Video, MessageCircle, AlertTriangle,
  ChevronDown, GraduationCap, ShieldCheck, HeartPulse,
  Smartphone, Share2, Award, ChevronRight, Zap, List, Book, Stethoscope,
  Trash2, Archive, UserMinus, Loader2
} from 'lucide-react';
import { apiClient } from '../services/api';

interface PatientProfileProps {
  onBack: () => void;
  patientId: string | null;
  onViewJournal?: () => void;
  onViewMessages?: () => void;
  onViewConsultations?: () => void;
  onDischarge?: () => void;
}

interface PatientData {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  date_of_birth: string;
  age: number;
  gender: string;
  status: string;
  primary_concerns: string;
  tags: string[];
  contacts: any[];
  stats: { appointments: number; sessions: number; assessments: number };
}

const PatientProfile: React.FC<PatientProfileProps> = ({ onBack, patientId, onViewJournal, onViewMessages, onViewConsultations, onDischarge }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!patientId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await apiClient.getPatient(patientId);
        if (response.success && response.data) {
          setPatient(response.data as any);
        }
      } catch (error) {
        console.error('Failed to fetch patient:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [patientId]);

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto text-blue-500" size={48} />
          <p className="text-slate-500 font-medium mt-4">Loading patient profile...</p>
        </div>
      </div>
    );
  }

  const patientName = patient?.full_name || 'Unknown Patient';
  const patientAge = patient?.age ? `${patient.age} years` : 'Age unknown';
  const patientId_display = patient?.id ? `#${patient.id.slice(0, 8).toUpperCase()}` : '#---';
  const patientTags = patient?.tags || [];
  const patientContacts = patient?.contacts || [];

  return (
    <div className="w-full animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      {/* Patient Header */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white relative">
        <div className="absolute inset-0 bg-black/5" />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10 relative z-10">
          <nav className="flex items-center gap-2 text-xs font-bold text-blue-100/60 uppercase tracking-widest mb-8">
            <button onClick={onBack} className="hover:text-white transition-colors">Patients</button>
            <ChevronRight size={14} />
            <span className="text-white">{patientName}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 text-center sm:text-left">
              <div className="relative group">
                <div className="w-32 h-32 rounded-3xl border-4 border-white/20 shadow-2xl overflow-hidden ring-4 ring-white/10 transition-transform group-hover:scale-110 duration-500">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient?.first_name || 'Patient'}`} alt={patientName} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1.5 rounded-xl border-4 border-white shadow-lg animate-pulse">
                  <CheckCircle2 size={16} strokeWidth={3} />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h1 className="text-4xl font-black tracking-tight">{patientName}</h1>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2">
                    <span className="text-blue-100/80 font-bold uppercase tracking-widest text-sm">{patientId_display}</span>
                    <span className="text-blue-200">|</span>
                    <span className="text-sm font-semibold">{patientAge}</span>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                  {patientTags.length > 0 ? patientTags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-100 rounded-full text-xs font-black uppercase tracking-widest border border-purple-400/30">{tag}</span>
                  )) : (
                    <span className="px-3 py-1 bg-slate-500/20 text-slate-200 rounded-full text-xs font-semibold">No tags</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {onViewConsultations && (
                <button onClick={onViewConsultations} className="px-5 h-12 bg-white text-blue-700 rounded-xl text-sm font-bold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20">
                  <Stethoscope size={18} /> Consultation Notes
                </button>
              )}
              {onViewJournal && (
                <button onClick={onViewJournal} className="px-5 h-12 bg-white/10 text-white border border-white/20 rounded-xl text-sm font-bold hover:bg-white/20 transition-all flex items-center gap-2">
                  <Book size={18} /> Journal
                </button>
              )}
              <div className="relative">
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="p-3 border-2 border-white/20 text-white rounded-xl hover:bg-white/10 transition-all"
                >
                  <MoreHorizontal size={24} />
                </button>

                {showMoreMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <button onClick={onDischarge} className="w-full text-left px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-3 transition-colors">
                      <UserMinus size={16} /> Discharge Patient
                    </button>
                    <button className="w-full text-left px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-3 transition-colors">
                      <Archive size={16} /> Archive Record
                    </button>
                    <div className="h-px bg-slate-100 my-1" />
                    <button className="w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors">
                      <Trash2 size={16} /> Delete Patient
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Area (320px) */}
          <div className="w-full lg:w-[320px] shrink-0 space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 overflow-hidden">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Patient Information</h3>
              <div className="space-y-6">
                {[
                  { label: 'Full Name', val: patientName, icon: <User size={16} /> },
                  { label: 'Age', val: patientAge, icon: <Calendar size={16} /> },
                  { label: 'Patient ID', val: patientId_display, icon: <HashIcon size={16} /> },
                  { label: 'Registration', val: patient?.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not recorded', icon: <Clock size={16} /> },
                  { label: 'Status', val: <span className={`font-black ${patient?.status === 'active' ? 'text-green-600' : 'text-slate-500'}`}>{patient?.status || 'Unknown'}</span>, icon: <CheckCircle2 size={16} /> }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="text-slate-300 mt-1">{item.icon}</div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                      <div className="text-sm font-bold text-slate-800">{item.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Primary Contacts</h3>
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">Mrs. Priya Kumar</h4>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-bold uppercase">Mother</span>
                  </div>
                  <div className="space-y-3">
                    <button className="flex items-center gap-3 w-full group">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Phone size={14} />
                      </div>
                      <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900">+91 98765 43210</span>
                    </button>
                    <button className="flex items-center gap-3 w-full group">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Mail size={14} />
                      </div>
                      <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 truncate">priya.kumar@email.com</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded-xl border border-green-100">
                    <MessageCircle size={14} className="text-green-600" />
                    <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Preferred: WhatsApp</span>
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-50 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">Mr. Rajesh Kumar</h4>
                    <span className="px-2 py-0.5 bg-slate-50 text-slate-400 rounded text-[9px] font-bold uppercase">Father</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-500">
                      <Phone size={14} /> <span className="text-sm font-medium">+91 98765 43211</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Education Details</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <School size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 leading-tight">Delhi Public School</h4>
                    <p className="text-xs text-slate-500 font-medium">Grade 2, Section B</p>
                  </div>
                </div>
                <div className="space-y-1 pt-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Teacher</p>
                  <p className="text-sm font-bold text-slate-800">Mrs. Meena Sharma</p>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <span className="text-xs font-bold text-blue-900">Collaboration</span>
                  <div className="w-10 h-5 bg-blue-600 rounded-full relative">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                  </div>
                </div>
                <button className="w-full mt-2 text-[10px] font-black text-[#2563EB] uppercase tracking-widest flex items-center justify-center gap-1.5 hover:underline">
                  View School Portal <Share2 size={12} />
                </button>
              </div>
            </div>

            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-200">
              <h3 className="text-lg font-black mb-6">Patient Tags</h3>
              <div className="flex flex-wrap gap-2">
                {['Auditory Sensitive', 'Visual Learner', 'Allergic to Peanuts'].map(t => (
                  <span key={t} className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/20 transition-all hover:bg-white/10 cursor-pointer ${t.includes('Allergic') ? 'text-red-400 border-red-400/30' : 'text-blue-100'}`}>{t}</span>
                ))}
                <button className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-white/10 text-white/40 hover:text-white transition-colors">+ Add Tag</button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 space-y-8">
            {/* Tabs */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm px-6">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                {['Overview', 'Assessments', 'IEP', 'Clinical Notes', 'Gallery', 'Communications'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-5 text-sm font-bold relative transition-all whitespace-nowrap ${activeTab === tab ? 'text-[#2563EB]' : 'text-slate-400 hover:text-slate-600'
                      }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-[#2563EB] rounded-t-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Overview Content */}
            {activeTab === 'Overview' && (
              <div className="space-y-8 animate-in fade-in duration-700">
                {/* Progress Chart Section */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Developmental Progress</h2>
                      <p className="text-sm text-slate-400 font-medium">Domain-wise progress over last 6 months</p>
                    </div>
                    <div className="flex bg-slate-50 p-1 rounded-xl">
                      {['3M', '6M', '1Y', 'All'].map((t, i) => (
                        <button key={t} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${i === 1 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="w-full h-80 relative flex items-end justify-between px-10">
                    <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] font-bold text-slate-300">
                      <span>100</span><span>75</span><span>50</span><span>25</span><span>0</span>
                    </div>
                    <div className="absolute inset-0 flex flex-col justify-between py-1 px-10">
                      {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-full border-t border-slate-50" />)}
                    </div>
                    <div className="absolute left-10 right-10 top-[25%] border-t-2 border-dashed border-slate-100 flex items-center justify-end pr-4">
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest -mt-4">Expected for age</span>
                    </div>

                    {/* Lines Simulation */}
                    <svg className="absolute inset-0 w-full h-full px-10 py-1" preserveAspectRatio="none">
                      <path d="M 0,70 L 100,65 L 200,50 L 300,45 L 400,38 L 500,32" className="stroke-blue-500 fill-none" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                      <path d="M 0,60 L 100,55 L 200,50 L 300,40 L 400,35 L 500,28" className="stroke-green-500 fill-none" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                      <path d="M 0,25 L 100,26 L 200,24 L 300,25 L 400,22 L 500,20" className="stroke-purple-500 fill-none" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                      <path d="M 0,45 L 100,40 L 200,42 L 300,38 L 400,32 L 500,30" className="stroke-orange-500 fill-none" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                    </svg>

                    <div className="w-full flex justify-between px-10 text-[10px] font-bold text-slate-400 pt-6">
                      <span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-slate-50">
                    {[
                      { label: 'Communication', val: '68', color: 'bg-blue-500', trend: '+12%' },
                      { label: 'Social Skills', val: '72', color: 'bg-green-500', trend: '+8%' },
                      { label: 'Cognitive', val: '70', color: 'bg-orange-500', trend: '+5%' },
                      { label: 'Adaptive', val: '58', color: 'bg-teal-500', trend: '+15%' },
                    ].map((item, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${item.color}`} />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-slate-900">{item.val}</span>
                          <span className="text-[10px] font-bold text-green-600">{item.trend}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline Section */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                  <div className="flex items-center justify-between mb-10">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Clinical Activity Timeline</h2>
                    <div className="flex items-center gap-4">
                      <select className="text-xs font-bold text-slate-400 border-none bg-transparent focus:ring-0 uppercase tracking-wider outline-none">
                        <option>Last 3 months</option>
                        <option>Last year</option>
                      </select>
                      <button className="text-[11px] font-bold text-[#2563EB] hover:underline uppercase tracking-widest">Export Timeline</button>
                    </div>
                  </div>

                  <div className="space-y-12 relative">
                    <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-50" />

                    {[
                      {
                        dot: 'bg-blue-500',
                        date: 'Oct 24, 2024 • 2:30 PM',
                        badge: 'SESSION',
                        badgeColor: 'bg-blue-50 text-blue-600',
                        title: 'Speech Therapy Session Completed',
                        detail: '45-minute session with Dr. Sarah Mehta. Worked on articulation of /r/ and /s/ sounds. Showed 65% accuracy improvement.',
                        by: 'Dr. Sarah Mehta',
                        attachment: 'Session_Notes.pdf'
                      },
                      {
                        dot: 'bg-green-500',
                        date: 'Oct 17, 2024',
                        badge: 'ASSESSMENT',
                        badgeColor: 'bg-green-50 text-green-600',
                        title: 'ISAA Assessment - Complete',
                        detail: 'Comprehensive autism assessment completed. Score: 78/200 (Mild ASD). Detailed report generated.',
                        attachment: 'ISAA_Report_Aarav_Oct2024.pdf'
                      },
                      {
                        dot: 'bg-purple-500',
                        date: 'Oct 10, 2024',
                        badge: 'IEP',
                        badgeColor: 'bg-purple-50 text-purple-600',
                        title: 'IEP Review Meeting',
                        detail: 'Quarterly review conducted with parent and teacher. Progress: 68% of goals met. Updated 2 goals.',
                        attendees: 'You, Mrs. Kumar (Parent), Mrs. Sharma (Teacher)'
                      }
                    ].map((act, i) => (
                      <div key={i} className="flex gap-8 relative z-10">
                        <div className={`w-4 h-4 rounded-full ${act.dot} ring-4 ring-white shrink-0 mt-1`} />
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase ${act.badgeColor}`}>{act.badge}</span>
                              <h4 className="text-base font-bold text-slate-800 leading-tight">{act.title}</h4>
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{act.date}</span>
                          </div>
                          <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">{act.detail}</p>
                          {act.attachment && (
                            <button className="inline-flex items-center gap-2 p-2 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:border-blue-200 transition-all text-xs font-bold text-slate-600 group">
                              <FileText size={14} className="text-slate-400 group-hover:text-[#2563EB]" />
                              {act.attachment}
                            </button>
                          )}
                          <div className="flex items-center justify-between pt-2">
                            {act.by && <p className="text-[10px] font-bold text-slate-400 uppercase">By: <span className="text-slate-600">{act.by}</span></p>}
                            {act.attendees && <p className="text-[10px] font-bold text-slate-400 uppercase">Attendees: <span className="text-slate-600">{act.attendees}</span></p>}
                            <button onClick={onViewJournal} className="text-[11px] font-black text-[#2563EB] hover:underline uppercase tracking-widest">View Details</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={onViewJournal} className="w-full mt-12 py-4 border-2 border-dashed border-slate-100 rounded-2xl text-xs font-black text-slate-400 hover:text-slate-600 transition-all uppercase tracking-widest">Load More Activity</button>
                </div>

                {/* Diagnosis Summary Section */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Diagnosis Summary</h2>
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Last updated: Oct 17, 2024</span>
                  </div>

                  <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-8 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between gap-8 mb-10">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-3xl font-black text-slate-900">Autism Spectrum Disorder (ASD)</h3>
                          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold uppercase tracking-widest">Level 1</span>
                        </div>
                        <div className="flex gap-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                          <span>ICD-10: <span className="text-slate-700">F84.0</span></span>
                          <span>DSM-5: <span className="text-slate-700">299.00</span></span>
                          <span>Diagnosed: <span className="text-slate-700">May 15, 2024</span></span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Diagnosed By</p>
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-[10px]">JR</div>
                          <span className="text-sm font-bold text-slate-800">You (Dr. Rivera)</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                      {[
                        { title: 'Social Communication', items: ['Difficulty with back-and-forth conversation', 'Limited understanding of social cues', 'Prefers parallel play'] },
                        { title: 'Repetitive Behaviors', items: ['Hand flapping when excited', 'Strong preference for routine', 'Intense interest in trains'] },
                        { title: 'Sensory Sensitivities', items: ['Sensitive to loud sounds', 'Avoids certain textures in food', 'Tactile sensitivity'] }
                      ].map((sect, i) => (
                        <div key={i} className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
                            {sect.title} <ChevronDown size={14} />
                          </h4>
                          <ul className="space-y-2">
                            {sect.items.map((item, ii) => (
                              <li key={ii} className="flex gap-3 text-xs font-bold text-slate-600">
                                <div className="w-1 h-1 rounded-full bg-slate-300 mt-1.5" /> {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="p-6 bg-blue-50/30 rounded-2xl border border-blue-100">
                      <h4 className="text-[11px] font-black text-blue-900 uppercase tracking-widest mb-3">Clinical Notes</h4>
                      <p className="text-sm font-semibold text-blue-800/80 leading-relaxed italic">
                        "Aarav shows significant progress with structured interventions. Social communication remains the primary focus area. Parent is highly engaged and consistent with home sensory programs."
                      </p>
                    </div>
                  </div>
                </div>

                {/* Active Interventions */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Active Interventions</h2>
                    <button className="text-[11px] font-bold text-[#2563EB] hover:underline uppercase tracking-widest">See Full Plan</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[
                      { icon: <MessageCircle size={24} />, title: 'Speech Therapy', provider: 'Dr. Sarah Mehta, SLP', freq: '2x per week', dur: '45 mins', prog: 68, next: 'Oct 28, 10:00 AM', status: 'On Track', statusColor: 'bg-green-100 text-green-700', pColor: 'bg-blue-500' },
                      { icon: <Zap size={24} />, title: 'Occupational Therapy', provider: 'Ms. Rita Gupta, OT', freq: '1x per week', dur: '60 mins', prog: 55, next: 'Oct 30, 2:00 PM', status: 'Needs Review', statusColor: 'bg-yellow-100 text-yellow-700', pColor: 'bg-yellow-500' },
                      { icon: <Award size={24} />, title: 'ABA Therapy', provider: 'Mr. Anil Kumar, BCBA', freq: '3x per week', dur: '90 mins', prog: 72, next: 'Oct 27, 4:00 PM', status: 'Excellent', statusColor: 'bg-green-100 text-green-700', pColor: 'bg-green-500' },
                    ].map((iv, i) => (
                      <div key={i} className="bg-white rounded-3xl border border-slate-200 p-6 hover:shadow-lg transition-all flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                          <div className="w-12 h-12 rounded-2xl bg-slate-50 text-[#2563EB] flex items-center justify-center">
                            {iv.icon}
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${iv.statusColor}`}>{iv.status}</span>
                        </div>
                        <h4 className="text-base font-black text-slate-900 mb-1">{iv.title}</h4>
                        <p className="text-xs font-bold text-slate-400 mb-6 truncate">{iv.provider}</p>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="space-y-0.5">
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Frequency</p>
                            <p className="text-xs font-bold text-slate-800">{iv.freq}</p>
                          </div>
                          <div className="space-y-0.5 text-right">
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Duration</p>
                            <p className="text-xs font-bold text-slate-800">{iv.dur}</p>
                          </div>
                        </div>
                        <div className="space-y-2 mb-6 flex-grow">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                            <span className="text-slate-400">Progress</span>
                            <span className="text-slate-900">{iv.prog}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${iv.pColor}`} style={{ width: `${iv.prog}%` }} />
                          </div>
                        </div>
                        <div className="pt-4 border-t border-slate-50 mt-auto">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Calendar size={12} className="text-slate-300" />
                              <span className="text-[10px] font-bold text-slate-400 uppercase">{iv.next}</span>
                            </div>
                            <button className="text-[10px] font-black text-[#2563EB] uppercase tracking-widest hover:underline">View Details</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-10 right-10 flex flex-col items-end gap-3 z-50">
        <button
          onClick={onViewConsultations}
          className="flex items-center gap-3 px-6 h-14 bg-[#2563EB] text-white rounded-2xl font-bold shadow-2xl shadow-blue-400/30 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95 group"
        >
          <Plus size={24} className="group-hover:rotate-90 transition-transform" />
          Add Clinical Note
        </button>
        <div className="flex gap-2">
          <button className="w-12 h-12 bg-white rounded-2xl border border-slate-200 text-slate-400 hover:text-[#2563EB] hover:border-[#2563EB] transition-all flex items-center justify-center shadow-lg"><Calendar size={20} /></button>
          <button className="w-12 h-12 bg-white rounded-2xl border border-slate-200 text-slate-400 hover:text-[#2563EB] hover:border-[#2563EB] transition-all flex items-center justify-center shadow-lg"><FileText size={20} /></button>
          <button onClick={onViewMessages} className="w-12 h-12 bg-white rounded-2xl border border-slate-200 text-slate-400 hover:text-[#2563EB] hover:border-[#2563EB] transition-all flex items-center justify-center shadow-lg"><MessageCircle size={20} /></button>
        </div>
      </div>
    </div>
  );
};

// Simple Mock HashIcon
const HashIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="9" x2="20" y2="9"></line>
    <line x1="4" y1="15" x2="20" y2="15"></line>
    <line x1="10" y1="3" x2="8" y2="21"></line>
    <line x1="16" y1="3" x2="14" y2="21"></line>
  </svg>
);

export default PatientProfile;
