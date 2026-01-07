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
import JournalTab from './JournalTab';

interface PatientProfileProps {
  onBack: () => void;
  patientId: string | null;
  initialTab?: string;
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
  existing_diagnosis: string;
  tags: string[];
  contacts: any[];
  stats: { appointments: number; sessions: number; assessments: number };
  activityLog: any[];
  interventions: any[];
  schoolInfo: { name: string; grade: string; teacher: string };
  latestIep: any;
  latestAssessments: any[];
}

const PatientProfile: React.FC<PatientProfileProps> = ({
  onBack,
  patientId,
  initialTab,
  onViewJournal,
  onViewMessages,
  onViewConsultations,
  onDischarge
}) => {
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [activeTab, setActiveTab] = useState(initialTab || 'Overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!patientId) return;
      try {
        setLoading(true);
        const res = await apiClient.getPatient(patientId);

        console.log('[FRONTEND DEBUG] API Response:', res);
        console.log('[FRONTEND DEBUG] Patient data:', res.data);
        console.log('[FRONTEND DEBUG] Full name:', (res.data as any)?.full_name);
        console.log('[FRONTEND DEBUG] Age:', (res.data as any)?.age);
        console.log('[FRONTEND DEBUG] Contacts:', (res.data as any)?.contacts);

        // Ensure contacts is an array if it isn't
        if (res.data) {
          const patientData = {
            ...res.data,
            contacts: Array.isArray(res.data.contacts) ? res.data.contacts :
              (res.data.contacts ? [res.data.contacts] : [])
          };
          console.log('[FRONTEND DEBUG] Setting patient state:', patientData);
          setPatient(patientData);
        }
      } catch (err) {
        console.error("Error fetching patient:", err);
        setError("Failed to load patient data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [patientId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC] gap-4">
        <p className="text-slate-500 font-bold">{error || "Patient not found"}</p>
        <button onClick={onBack} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 animate-in fade-in duration-500 relative">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
              <ChevronRight size={24} className="rotate-180" />
            </button>
            <div>
              <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                <span className="hover:text-[#2563EB] cursor-pointer" onClick={onBack}>Patient Registry</span>
                <ChevronRight size={12} />
                <span className="text-slate-800">Profile</span>
              </nav>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Patient Profile</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-lg font-bold text-slate-600">{patient.full_name || (patient as any).fullName || `${patient.first_name || (patient as any).firstName || ''} ${patient.last_name || (patient as any).lastName || ''}`.trim() || 'No Name'}</span>
                <span className="text-sm font-bold text-slate-300">•</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${(patient.status || (patient as any).case_status || (patient as any).caseStatus || '').toLowerCase() === 'active' ? 'bg-green-100 text-green-700' :
                  (patient.status || (patient as any).case_status || (patient as any).caseStatus || '').toLowerCase() === 'pending' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                  {patient.status || (patient as any).case_status || (patient as any).caseStatus}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-white border-2 border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:border-slate-300 transition-all flex items-center gap-2">
              <Edit3 size={16} /> Edit Profile
            </button>
            <button
              onClick={onDischarge}
              className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <UserMinus size={16} /> Discharge
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Sidebar */}
          <div className="w-full lg:w-[360px] shrink-0 space-y-6">

            {/* Patient Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-blue-500 to-blue-600" />
              <div className="relative pt-12 text-center">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg mx-auto bg-white flex items-center justify-center text-3xl font-black text-blue-600 uppercase">
                  {(patient.first_name || (patient as any).firstName || '?')[0]}{(patient.last_name || (patient as any).lastName || '?')[0]}
                </div>
                <h2 className="mt-4 text-xl font-black text-slate-900">{patient.full_name || (patient as any).fullName || `${patient.first_name || (patient as any).firstName || ''} ${patient.last_name || (patient as any).lastName || ''}`.trim()}</h2>
                <p className="text-sm font-bold text-slate-400 mb-6">{patient.age} years • {patient.gender}</p>

                <div className="grid grid-cols-3 gap-2 pt-6 border-t border-slate-100">
                  <div className="text-center">
                    <p className="text-xl font-black text-slate-900">{patient.stats?.appointments || 0}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Appts</p>
                  </div>
                  <div className="text-center border-l border-slate-100">
                    <p className="text-xl font-black text-slate-900">{patient.stats?.sessions || 0}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sessions</p>
                  </div>
                  <div className="text-center border-l border-slate-100">
                    <p className="text-xl font-black text-slate-900">{patient.stats?.assessments || 0}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Reports</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3 text-left bg-slate-50 p-4 rounded-2xl">
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                    <Phone size={14} className="text-slate-400 shrink-0" />
                    <span className="truncate">{patient.contacts?.[0]?.phone || 'No phone'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                    <Mail size={14} className="text-slate-400 shrink-0" />
                    <span className="truncate">{patient.contacts?.[0]?.email || 'No email'}</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs font-bold text-slate-600">
                    <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{patient.contacts?.[0]?.address || 'No address'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* School Info Block */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Education Details</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <School size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 leading-tight">{patient.schoolInfo?.name || 'School not recorded'}</h4>
                    <p className="text-xs text-slate-500 font-medium">{patient.schoolInfo?.grade || ''}</p>
                  </div>
                </div>
                <div className="space-y-1 pt-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Teacher</p>
                  <p className="text-sm font-bold text-slate-800">{patient.schoolInfo?.teacher || 'N/A'}</p>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <span className="text-xs font-bold text-blue-900">Collaboration</span>
                  <div className="w-10 h-5 bg-blue-600 rounded-full relative">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-200">
              <h3 className="text-lg font-black mb-6">Patient Tags</h3>
              {patient.tags && patient.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {patient.tags.map(t => (
                    <span key={t} className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/20 transition-all hover:bg-white/10 cursor-pointer text-blue-100">{t}</span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No tags associated.</p>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 space-y-8">
            {/* Tabs */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm px-6">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                {['Overview', 'Assessments', 'IEP', 'Clinical Notes', 'Journal', 'Communications'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      if (tab === 'Journal' && onViewJournal) onViewJournal();
                    }}
                    className={`px-6 py-5 text-sm font-bold relative transition-all whitespace-nowrap ${activeTab === tab ? 'text-[#2563EB]' : 'text-slate-400 hover:text-slate-600'}`}
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
                {/* Progress Chart Section - Placeholder */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Developmental Progress</h2>
                    <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold">Coming Soon</span>
                  </div>
                  <div className="h-40 flex items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium text-sm">Progress charts will be available once assessment data is collected.</p>
                  </div>
                </div>

                {/* Timeline Section */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                  <div className="flex items-center justify-between mb-10">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Clinical Activity Timeline</h2>
                    <div className="flex items-center gap-4">
                      <select className="text-xs font-bold text-slate-400 border-none bg-transparent focus:ring-0 uppercase tracking-wider outline-none">
                        <option>Recent</option>
                        <option>All</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-12 relative">
                    <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-50" />
                    {patient.activityLog && patient.activityLog.length > 0 ? (
                      patient.activityLog.map((act, i) => (
                        <div key={i} className="flex gap-8 relative z-10">
                          <div className={`w-4 h-4 rounded-full ${act.activityType === 'PATIENT_CREATED' ? 'bg-green-500' : 'bg-blue-500'} ring-4 ring-white shrink-0 mt-1`} />
                          <div className="flex-1 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase ${act.activityType === 'PATIENT_CREATED' ? 'bg-green-100 text-green-700' :
                                  act.activityType === 'PATIENT_UPDATED' ? 'bg-blue-100 text-blue-700' :
                                    'bg-slate-100 text-slate-600'
                                  }`}>
                                  {act.activityType.replace('_', ' ')}
                                </span>
                                <h4 className="text-base font-bold text-slate-800 leading-tight">{act.description}</h4>
                              </div>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {new Date(act.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            {(act.details || act.metadata) && (
                              <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
                                {act.details || act.metadata}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="pl-10 text-slate-500 italic">No recent activity recorded.</div>
                    )}
                  </div>
                </div>

                {/* Diagnosis Summary */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Diagnosis Summary</h2>
                  </div>
                  <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-8 shadow-sm">
                    {patient.existing_diagnosis ? (
                      <div className="flex flex-col md:flex-row justify-between gap-8 mb-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <h3 className="text-3xl font-black text-slate-900">{patient.existing_diagnosis}</h3>
                          </div>
                          <div className="flex gap-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>Primary Concern: <span className="text-slate-700">{patient.primary_concerns || 'N/A'}</span></span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-slate-500 font-medium">No diagnosis recorded yet.</p>
                        <button className="mt-4 text-[#2563EB] font-bold text-sm hover:underline">Add Diagnosis</button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Active Interventions */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Active Interventions</h2>
                    <button className="w-8 h-8 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center hover:bg-[#2563EB] hover:text-white transition-all shadow-sm">
                      <Plus size={16} />
                    </button>
                  </div>
                  {patient.interventions && patient.interventions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {patient.interventions.map((iv, i) => (
                        <div key={i} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col">
                          <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-[#2563EB] flex items-center justify-center">
                              <Zap size={24} />
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-green-100 text-green-700`}>{iv.status}</span>
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
                              <div className={`h-full bg-blue-500`} style={{ width: `${iv.prog}%` }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center gap-4 text-center shadow-sm">
                      <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-300">
                        <Zap size={20} />
                      </div>
                      <div>
                        <p className="text-slate-900 font-bold mb-1">No active interventions</p>
                        <p className="text-xs text-slate-500 font-medium">Add an intervention to track progress</p>
                      </div>
                      <button className="px-4 py-2 bg-slate-900 border border-transparent rounded-xl text-xs font-bold text-white hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                        Create Intervention
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Journal Tab */}
            {activeTab === 'Journal' && patientId && (
              <JournalTab patientId={patientId} />
            )}
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
