
import React, { useState, useEffect } from 'react';
import {
  Plus, Search, Filter, ChevronDown, Download,
  MoreVertical, FileText, MessageSquare, ClipboardList,
  ChevronRight, Calendar, User, School, TrendingUp,
  CheckCircle2, AlertTriangle, Info, Clock, ArrowRight, Loader2
} from 'lucide-react';
import { apiClient, isAuthenticated } from '../services/api';

interface PatientRegistryProps {
  onPatientClick: (id: string) => void;
  onNewPatient?: () => void;
}

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  age: number;
  gender: string;
  status: string;
  primary_concerns: string;
  tags: string[];
  contacts: any[];
  stats: { appointments: number; sessions: number; assessments: number };
  created_at: string;
}

const PatientRegistry: React.FC<PatientRegistryProps> = ({ onPatientClick, onNewPatient }) => {
  const [activeFilter, setActiveFilter] = useState('All Patients');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({ page: 1, total: 0, total_pages: 1 });

  useEffect(() => {
    fetchPatients();
  }, [searchQuery]);

  const fetchPatients = async () => {
    if (!isAuthenticated()) {
      setError('Please login to view patients');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.getPatients({
        page: pagination.page,
        limit: 20,
        search: searchQuery || undefined
      });

      if (response.success && response.data) {
        setPatients(response.data.patients);
        setPagination(response.data.pagination);
      } else {
        setError(response.error?.message || 'Failed to load patients');
      }
    } catch (err: any) {
      setError(err.error?.message || 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  // Map patient data to display format
  const formatPatientForDisplay = (p: Patient) => {
    const tagColors: Record<string, string> = {
      'ASD': 'bg-purple-100 text-purple-700',
      'ADHD': 'bg-orange-100 text-orange-700',
      'Speech Delay': 'bg-blue-100 text-blue-700',
      'Active': 'bg-green-100 text-green-700',
      'New': 'bg-blue-100 text-blue-700',
      'Developmental Delay': 'bg-teal-100 text-teal-700'
    };

    return {
      id: p.id,
      name: p.full_name,
      patientId: `#${p.id.slice(0, 8).toUpperCase()}`,
      age: `${p.age} years old`,
      tags: p.tags.map(tag => ({
        label: tag,
        color: tagColors[tag] || 'bg-slate-100 text-slate-700'
      })),
      school: 'School not specified',
      primaryConcerns: p.primary_concerns,
      stats: `${p.stats.appointments} appointments, ${p.stats.sessions} sessions`,
      image: p.first_name,
      contacts: p.contacts,
      gender: p.gender,
      status: p.status
    };
  };

  const displayPatients = patients.map(formatPatientForDisplay);

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto text-blue-500" size={48} />
          <p className="text-slate-500 font-medium mt-4">Loading patients...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-center text-red-500">
          <AlertTriangle size={48} className="mx-auto mb-4" />
          <p className="font-bold">{error}</p>
          <button onClick={fetchPatients} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8 flex flex-col md:flex-row items-end justify-between gap-6">
          <div>
            <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              <span className="hover:text-[#2563EB] cursor-pointer">Dashboard</span>
              <ChevronRight size={14} />
              <span className="text-slate-800">Patient Registry</span>
            </nav>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Patient Registry</h1>
            <p className="text-slate-500 mt-1 font-medium">Manage your patient caseload and clinical records</p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-5 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <Download size={18} /> Export
            </button>
            <button
              onClick={onNewPatient}
              className="flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              <Plus size={20} /> New Patient
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* List Area */}
          <div className="flex-1 space-y-8">
            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col xl:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 scrollbar-hide">
                {[`All Patients (${pagination.total || patients.length})`, 'Active', 'Screening Pending', 'Diagnosed', 'Archived'].map((f, i) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(i === 0 ? 'All Patients' : f)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${(i === 0 && activeFilter === 'All Patients') || activeFilter === f ? 'bg-[#2563EB] text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-transparent'
                      }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4 w-full xl:w-auto">
                <div className="relative flex-1 xl:w-[400px]">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search by name, ID, diagnosis..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 focus:border-[#2563EB] outline-none text-sm transition-all"
                  />
                </div>
                <button className="flex items-center gap-2 h-10 px-4 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                  <Filter size={16} /> Filters
                </button>
              </div>
            </div>

            {/* Patient Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayPatients.map((p, i) => (
                <div key={i} className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden flex flex-col">
                  <div className="p-6 pb-4">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl border-2 border-white shadow-md overflow-hidden ring-2 ring-slate-50">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.image}`} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-slate-900 leading-tight group-hover:text-[#2563EB] transition-colors">{p.name}</h3>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{p.patientId}</p>
                          <p className="text-xs font-semibold text-slate-500 mt-0.5">{p.age}</p>
                        </div>
                      </div>
                      <button className="p-1.5 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-lg">
                        <MoreVertical size={20} />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {p.tags.map((t, ti) => (
                        <span key={ti} className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${t.color}`}>
                          {t.label === 'Active IEP' && <CheckCircle2 size={10} />}
                          {t.label === 'Screening Pending' && <Info size={10} />}
                          {t.label}
                        </span>
                      ))}
                    </div>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                        <School size={14} className="text-blue-500" /> {p.school}
                      </div>
                      {p.lastVisit && (
                        <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                          <Calendar size={14} className="text-slate-400" /> Last Visit: {p.lastVisit}
                        </div>
                      )}
                      {p.assessment && (
                        <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                          <ClipboardList size={14} className="text-slate-400" /> {p.assessment}
                        </div>
                      )}
                    </div>

                    {p.progress !== undefined && (
                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <span>IEP Progress</span>
                          <span className="text-slate-900">{p.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${p.progressColor}`} style={{ width: `${p.progress}%` }} />
                        </div>
                      </div>
                    )}

                    {p.alert && (
                      <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl mb-6">
                        <div className="flex items-center gap-2 text-orange-700 font-bold text-sm">
                          <AlertTriangle size={16} /> {p.alert.title}
                        </div>
                        <p className="text-xs text-orange-600 mt-1 opacity-80">{p.alert.desc}</p>
                        <button className="text-[10px] font-bold text-orange-700 uppercase tracking-widest mt-2 hover:underline">{p.alert.action}</button>
                      </div>
                    )}

                    {p.nextStep && (
                      <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl mb-6">
                        <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
                          <TrendingUp size={16} /> {p.nextStep.title}
                        </div>
                        <p className="text-xs text-blue-700 mt-1 opacity-80">{p.nextStep.desc}</p>
                        <button className="text-[10px] font-bold text-blue-800 uppercase tracking-widest mt-2 hover:underline">{p.nextStep.btn}</button>
                      </div>
                    )}

                    {p.warning && (
                      <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl mb-6 flex items-center gap-3">
                        <AlertTriangle size={14} className="text-yellow-600" />
                        <span className="text-[11px] font-bold text-yellow-700 uppercase tracking-wide">{p.warning}</span>
                      </div>
                    )}

                    {p.success && (
                      <div className="bg-green-50 border border-green-200 p-3 rounded-xl mb-6 flex items-center gap-3">
                        <CheckCircle2 size={14} className="text-green-600" />
                        <span className="text-[11px] font-bold text-green-700 uppercase tracking-wide">Meeting all IEP goals</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto px-6 pb-6 pt-2">
                    <button
                      onClick={() => onPatientClick(p.id)}
                      className={`w-full h-12 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 ${p.button?.color === 'bg-orange-600'
                        ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-orange-100'
                        : 'bg-[#2563EB] text-white hover:bg-blue-700 shadow-blue-100'
                        }`}
                    >
                      {p.button?.label || 'View Profile'} <ArrowRight size={18} />
                    </button>

                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-50">
                      <button className="flex items-center gap-1.5 text-slate-400 hover:text-[#2563EB] transition-colors">
                        <FileText size={16} /> <span className="text-[10px] font-bold uppercase tracking-widest">Reports (3)</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-slate-400 hover:text-[#2563EB] transition-colors relative">
                        <MessageSquare size={16} /> <span className="text-[10px] font-bold uppercase tracking-widest">Messages</span>
                        <span className="absolute top-[-4px] right-[-4px] w-3 h-3 bg-red-500 border-2 border-white rounded-full" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={onNewPatient}
                className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 min-h-[400px] hover:bg-blue-50/30 hover:border-[#2563EB] group transition-all"
              >
                <div className="w-16 h-16 rounded-full border-4 border-slate-200 flex items-center justify-center text-slate-300 group-hover:border-[#2563EB] group-hover:text-[#2563EB] transition-colors">
                  <Plus size={32} />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-slate-500 group-hover:text-slate-800 transition-colors">Add New Patient</h3>
                  <p className="text-sm text-slate-400 font-medium px-8 mt-2">Start assessment for a new child via token or registration</p>
                </div>
                <div className="flex flex-col gap-2 mt-4 w-full px-12">
                  <div className="h-11 bg-white border border-slate-200 text-[#2563EB] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-50 transition-colors flex items-center justify-center">Register Patient</div>
                  <div className="h-11 bg-white border border-slate-200 text-slate-500 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-100 transition-colors flex items-center justify-center">Import via Token</div>
                </div>
              </button>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-slate-100">
              <span className="text-sm font-bold text-slate-400">Showing 1-{patients.length} of {pagination.total || patients.length} patients</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, '...', 10].map((n, i) => (
                  <button key={i} className={`w-10 h-10 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${n === 1 ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-100'}`}>
                    {n}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 uppercase">Show:</span>
                <select className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-[#2563EB]">
                  <option>9 per page</option>
                  <option>18 per page</option>
                  <option>All</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="w-full lg:w-[320px] space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center justify-between">
                Registry Stats <Info size={16} className="text-slate-300" />
              </h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-500 uppercase tracking-widest">By Status</span>
                  <span className="font-black text-slate-900">{pagination.total || patients.length} Total</span>
                </div>
                <div className="h-2 w-full flex rounded-full overflow-hidden">
                  <div className="bg-green-500" style={{ width: `${patients.filter(p => p.status === 'active').length / (patients.length || 1) * 100}%` }} />
                  <div className="bg-amber-400" style={{ width: `${patients.filter(p => p.status === 'follow_up').length / (patients.length || 1) * 100}%` }} />
                  <div className="bg-slate-200" style={{ width: `${patients.filter(p => p.status === 'archived').length / (patients.length || 1) * 100}%` }} />
                </div>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  {[
                    { label: 'Active', val: patients.filter(p => p.status === 'active').length, color: 'bg-green-500' },
                    { label: 'Follow-up', val: patients.filter(p => p.status === 'follow_up').length, color: 'bg-amber-400' },
                    { label: 'Archived', val: patients.filter(p => p.status === 'archived').length, color: 'bg-slate-300' }
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${s.color}`} />
                      <span className="text-xs font-bold text-slate-500">{s.label}: {s.val}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-slate-50">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">By Diagnosis</div>
                  <div className="space-y-3">
                    {[
                      { label: 'ASD', val: 12, color: 'bg-purple-500', w: '60%' },
                      { label: 'ADHD', val: 8, color: 'bg-orange-500', w: '40%' },
                      { label: 'SLD', val: 6, color: 'bg-teal-500', w: '30%' },
                    ].map((d, i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-slate-600">{d.label}</span>
                          <span className="text-slate-900">{d.val}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-50 rounded-full">
                          <div className={`h-full ${d.color} rounded-full`} style={{ width: d.w }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">This Month</span>
                    <TrendingUp size={14} className="text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">New patients</span>
                    <span className="text-lg font-black text-[#2563EB]">4</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">Assessments</span>
                    <span className="text-lg font-black text-green-600">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">IEPs created</span>
                    <span className="text-lg font-black text-purple-600">5</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#2563EB] rounded-3xl p-6 text-white overflow-hidden relative shadow-xl shadow-blue-100">
              <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              <h3 className="text-lg font-bold mb-6 relative z-10 flex items-center gap-2">
                <ClipboardList size={20} /> Quick Actions
              </h3>
              <div className="space-y-3 relative z-10">
                {[
                  'Import from School',
                  'Consent Management',
                  'Generate Registry Report',
                  'Bulk Appointments'
                ].map((a, i) => (
                  <button key={i} className="w-full flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all text-left text-sm font-bold group">
                    {a} <ChevronRight size={16} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PatientRegistry;
