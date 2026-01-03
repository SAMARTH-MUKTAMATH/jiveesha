
import React, { useState } from 'react';
import { 
  ArrowLeft, Search, Filter, ChevronDown, Plus, 
  FileText, Download, Share2, MoreVertical, Trash2, 
  CheckCircle2, Clock, Info, ExternalLink, Activity, 
  TrendingUp, BarChart3, ListChecks, Mail, Archive,
  ShieldCheck, AlertTriangle, User, Eye, Edit3, ChevronRight, Check
} from 'lucide-react';

interface ReportsLibraryProps {
  onBack: () => void;
  onGenerateNew?: () => void;
  onViewReport?: (id: string) => void;
}

const ReportsLibrary: React.FC<ReportsLibraryProps> = ({ onBack, onGenerateNew, onViewReport }) => {
  const [activeFilter, setActiveFilter] = useState('All Reports (18)');

  const reports = [
    {
      id: 'r1',
      title: 'Diagnostic Report - Aarav Kumar',
      type: 'Diagnostic Assessment',
      patient: 'Aarav Kumar',
      age: '7 years',
      patientId: '#DAI-8291',
      date: 'Oct 24, 2024',
      time: '3:45 PM',
      repId: 'REP-DAI-8291-2024',
      pages: '12 pages',
      size: '2.4 MB',
      status: 'Completed',
      statusColor: 'bg-green-100 text-green-700',
      icon: <FileText size={24} className="text-blue-600" />,
      sent: true,
      saved: true,
      views: 3,
      demo: true,
      viewerLink: true
    },
    {
      id: 'r2',
      title: 'Progress Report - Priya Sharma',
      type: 'Quarterly Progress Review',
      patient: 'Priya Sharma',
      age: '5 years',
      patientId: '#DAI-7453',
      date: 'Oct 20, 2024',
      status: 'Completed',
      statusColor: 'bg-green-100 text-green-700',
      icon: <TrendingUp size={24} className="text-green-600" />,
      sent: true,
      views: 5
    },
    {
      id: 'r3',
      title: 'IEP Summary - Arjun Patel',
      type: 'Annual IEP Review',
      patient: 'Arjun Patel',
      age: '4 years',
      patientId: '#DAI-9012',
      date: 'Oct 18, 2024',
      status: 'Completed',
      statusColor: 'bg-green-100 text-green-700',
      icon: <ListChecks size={24} className="text-purple-600" />,
      signatures: true,
      members: 5
    },
    {
      id: 'r4',
      title: 'Progress Report - Maya Singh (Draft)',
      type: 'Draft',
      patient: 'Maya Singh',
      age: '6 years',
      patientId: '#DAI-6721',
      date: 'Started: Oct 15, 2024',
      status: 'Draft',
      statusColor: 'bg-amber-100 text-amber-700',
      icon: <Edit3 size={24} className="text-slate-400" />,
      prog: 75,
      note: 'Missing: Clinical recommendations section'
    },
    {
      id: 'r5',
      title: 'Diagnostic Report - Rohan Desai',
      type: 'Initial Assessment',
      patient: 'Rohan Desai',
      age: '8 years',
      patientId: '#DAI-5438',
      date: 'Oct 12, 2024',
      status: 'Pending Review',
      statusColor: 'bg-orange-100 text-orange-700',
      icon: <ShieldCheck size={24} className="text-orange-500" />,
      urgent: true,
      note: '⚠ Awaiting your final sign-off'
    }
  ];

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen animate-in fade-in duration-500 pb-20">
      {/* Top Banner */}
      <div className="w-full bg-amber-50 border-b border-amber-100 py-2.5 px-12 flex items-center justify-center gap-3 relative z-50">
        <AlertTriangle size={16} className="text-amber-600" />
      </div>

      {/* Header Area */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">
          <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
            <button onClick={onBack} className="flex items-center gap-2 hover:text-[#2563EB] transition-colors">
              <ArrowLeft size={14} /> Back to Dashboard
            </button>
            <ChevronRight size={14} />
            <span className="text-slate-800">Reports & Documentation</span>
          </nav>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Clinical Reports</h1>
              <p className="text-lg text-slate-500 font-medium mt-1">Access and manage all generated clinical documentation</p>
            </div>
            <button 
              onClick={onGenerateNew}
              className="h-14 px-8 bg-[#2563EB] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-3"
            >
              <Plus size={20} strokeWidth={3} /> Generate New Report
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mt-10">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Main Content Area */}
          <div className="flex-1 space-y-10">
             
             {/* Filter & Search Bar */}
             <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col xl:flex-row items-center justify-between gap-6">
                <div className="relative flex-1 w-full max-w-[500px]">
                   <Search className="absolute left-4 top-3.5 text-slate-300" size={20} />
                   <input 
                     type="text" 
                     placeholder="Search reports by patient, type, date..." 
                     className="w-full h-12 pl-12 pr-4 bg-slate-50 border-2 border-slate-50 rounded-xl outline-none focus:border-blue-200 text-sm font-medium transition-all"
                   />
                </div>
                <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Range:</span>
                      <select className="h-10 bg-white border border-slate-200 rounded-xl px-4 text-xs font-bold outline-none cursor-pointer">
                         <option>Last 3 Months</option><option>Last Year</option><option>Custom</option>
                      </select>
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sort:</span>
                      <select className="h-10 bg-white border border-slate-200 rounded-xl px-4 text-xs font-bold outline-none cursor-pointer">
                         <option>Recent First</option><option>Oldest First</option><option>Patient Name</option>
                      </select>
                   </div>
                </div>
             </div>

             {/* Stats Row */}
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { l: '18 Total Reports', c: 'bg-blue-50 text-blue-600', i: <FileText size={18} /> },
                  { l: '3 Generated This Week', c: 'bg-green-50 text-green-600', i: <Activity size={18} /> },
                  { l: '5 Pending Review', c: 'bg-amber-50 text-amber-600', i: <Clock size={18} /> }
                ].map((s, i) => (
                  <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                     <div className={`p-3 rounded-2xl ${s.c}`}>{s.i}</div>
                     <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{s.l}</span>
                  </div>
                ))}
             </div>

             {/* Reports Card List */}
             <div className="space-y-6">
                {reports.map((rep) => (
                  <div key={rep.id} className={`bg-white rounded-[2.5rem] border-2 transition-all p-8 group relative ${rep.urgent ? 'border-amber-200 border-l-[10px] border-l-amber-500' : rep.status === 'Draft' ? 'border-dashed border-slate-200 opacity-80' : 'border-slate-100 hover:border-blue-300 hover:shadow-xl'}`}>
                     
                     <div className="flex flex-col md:flex-row gap-10">
                        {/* Icon & Meta */}
                        <div className="flex-1 flex flex-col md:flex-row gap-10">
                           <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 shadow-sm ${rep.status === 'Draft' ? 'bg-slate-50' : 'bg-blue-50'}`}>
                              {rep.icon}
                           </div>

                           <div className="space-y-6 flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                 <div>
                                    <div className="flex items-center gap-3 mb-1">
                                       <h3 className="text-xl font-black text-slate-900 truncate">{rep.title}</h3>
                                       {rep.demo && <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[8px] font-black uppercase tracking-widest border border-blue-100">Demo</span>}
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${rep.statusColor}`}>{rep.type}</span>
                                 </div>
                                 <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${rep.statusColor}`}>{rep.status}</span>
                                    <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><MoreVertical size={20} /></button>
                                 </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-x-12 gap-y-6 pt-4 border-t border-slate-50">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${rep.patient}`} alt={rep.patient} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</p>
                                       <p className="text-sm font-bold text-slate-800">{rep.patient} • {rep.age}</p>
                                       <p className="text-[10px] font-bold text-slate-300 font-mono">{rep.patientId}</p>
                                    </div>
                                 </div>

                                 <div className="grid grid-cols-2 gap-10">
                                    <div>
                                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Generated</p>
                                       <p className="text-sm font-bold text-slate-700">{rep.date}</p>
                                       {rep.time && <p className="text-[10px] font-bold text-slate-400">{rep.time}</p>}
                                    </div>
                                    {rep.repId && (
                                      <div>
                                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Report ID</p>
                                         <p className="text-sm font-bold text-slate-700">{rep.repId}</p>
                                      </div>
                                    )}
                                 </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-widest pt-4">
                                 {rep.pages && <span className="text-slate-400">{rep.pages} • {rep.size}</span>}
                                 {rep.sent && <span className="flex items-center gap-1 text-green-600"><CheckCircle2 size={12} /> Sent to parent</span>}
                                 {rep.saved && <span className="flex items-center gap-1 text-green-600"><CheckCircle2 size={12} /> Saved to file</span>}
                                 {rep.views && <span className="text-slate-400">Viewed {rep.views} times</span>}
                                 {rep.members && <span className="text-purple-600">Shared with {rep.members} team members</span>}
                                 {rep.signatures && <span className="flex items-center gap-1 text-green-600"><CheckCircle2 size={12} /> All signatures collected</span>}
                                 {rep.prog && (
                                   <div className="flex items-center gap-4 flex-1 max-w-[200px]">
                                      <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                                         <div className="h-full bg-amber-500" style={{ width: `${rep.prog}%` }} />
                                      </div>
                                      <span className="text-amber-700">{rep.prog}% complete</span>
                                   </div>
                                 )}
                              </div>
                              {rep.note && (
                                <div className={`p-4 rounded-2xl border ${rep.urgent ? 'bg-amber-50 border-amber-100 text-amber-900' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                                   <p className="text-xs font-bold flex items-center gap-2">
                                      <Info size={14} /> {rep.note}
                                   </p>
                                </div>
                              )}
                           </div>
                        </div>

                        {/* Actions Sidebar */}
                        <div className="md:w-56 flex flex-col gap-3 justify-center md:border-l md:border-slate-100 md:pl-8">
                           {rep.status === 'Draft' ? (
                             <button className="h-12 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">Continue Editing</button>
                           ) : rep.status === 'Pending Review' ? (
                             <button className="h-12 bg-orange-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-orange-600 transition-all">Review & Sign</button>
                           ) : (
                             <button 
                               onClick={() => rep.viewerLink && onViewReport?.(rep.id)}
                               className="h-12 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
                             >
                               {rep.viewerLink ? 'View PDF' : 'View Report'}
                             </button>
                           )}
                           
                           <div className="grid grid-cols-2 gap-2">
                              <button className="h-10 border-2 border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:border-blue-200 hover:text-blue-600 transition-all flex items-center justify-center gap-1.5"><Download size={12} /> Download</button>
                              <button className="h-10 border-2 border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:border-blue-200 hover:text-blue-600 transition-all flex items-center justify-center gap-1.5"><Share2 size={12} /> Share</button>
                           </div>
                           <button className="text-[9px] font-black text-slate-300 uppercase tracking-widest hover:text-red-500 transition-colors py-1">Delete Permanently</button>
                        </div>
                     </div>
                  </div>
                ))}
             </div>

             {/* Pagination */}
             <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-10 border-t border-slate-100">
                <span className="text-sm font-bold text-slate-400">Showing 1-5 of 18 reports</span>
                <div className="flex items-center gap-2">
                   {[1, 2, 3, '...', 5].map((n, i) => (
                     <button key={i} className={`w-10 h-10 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${n === 1 ? 'bg-[#2563EB] text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>{n}</button>
                   ))}
                </div>
                <div className="flex items-center gap-3">
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Show:</span>
                   <select className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-blue-400 transition-all">
                      <option>10 per page</option><option>20 per page</option><option>All</option>
                   </select>
                </div>
             </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-[320px] shrink-0 space-y-8">
             <div className="sticky top-28 space-y-8">
                
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8">
                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Quick Filters</h3>
                   <div className="space-y-4">
                      {[
                        { l: 'All reports', c: 18, active: true },
                        { l: 'This week', c: 3 },
                        { l: 'This month', c: 8 },
                        { l: 'My drafts', c: 1 },
                        { l: 'Pending review', c: 1 },
                        { l: 'Sent to parents', c: 12 }
                      ].map((f, i) => (
                        <label key={i} className="flex items-center justify-between cursor-pointer group">
                           <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full border-2 transition-all ${f.active ? 'border-[#2563EB] bg-[#2563EB] ring-4 ring-blue-50' : 'border-slate-200 group-hover:border-blue-300'}`} />
                              <span className={`text-xs font-black uppercase tracking-tight transition-colors ${f.active ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>{f.l}</span>
                           </div>
                           <span className={`text-[10px] font-black uppercase transition-colors ${f.active ? 'text-[#2563EB]' : 'text-slate-300'}`}>{f.c}</span>
                        </label>
                      ))}
                   </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Report Types</h3>
                   <div className="space-y-4">
                      {[
                        { l: 'Diagnostic Reports', v: 8, color: 'bg-blue-500' },
                        { l: 'Progress Reports', v: 6, color: 'bg-green-500' },
                        { l: 'IEP Summaries', v: 3, color: 'bg-purple-500' },
                        { l: 'Discharge Reports', v: 1, color: 'bg-orange-500' }
                      ].map((t, i) => (
                        <div key={i} className="flex items-center justify-between group cursor-pointer">
                           <div className="flex items-center gap-3">
                              <div className={`w-1.5 h-1.5 rounded-full ${t.color}`} />
                              <span className="text-[11px] font-bold text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-tight">{t.l}</span>
                           </div>
                           <span className="text-xs font-black text-slate-900">{t.v}</span>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Frequent Patients</h3>
                   <div className="space-y-4">
                      {[
                        { n: 'Aarav Kumar', c: 4 },
                        { n: 'Priya Sharma', c: 3 },
                        { n: 'Arjun Patel', c: 2 }
                      ].map((p, i) => (
                        <div key={i} className="flex items-center justify-between group cursor-pointer">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-100">
                                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.n}`} alt={p.n} className="w-full h-full object-cover" />
                              </div>
                              <span className="text-xs font-black text-slate-700 uppercase group-hover:text-[#2563EB] transition-colors">{p.n}</span>
                           </div>
                           <span className="text-[10px] font-black text-slate-400 uppercase">{p.c} Reps</span>
                        </div>
                      ))}
                   </div>
                   <button className="w-full text-[10px] font-black text-[#2563EB] uppercase tracking-widest hover:underline pt-2">View All Patients →</button>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8 relative overflow-hidden">
                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Recent Activity</h3>
                   <div className="space-y-8 relative">
                      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-slate-50" />
                      {[
                        { t: 'Report generated', h: '2 hours ago', active: true },
                        { t: 'Report sent to parent', h: '1 day ago' },
                        { t: 'Report viewed by school', h: '2 days ago' }
                      ].map((act, i) => (
                        <div key={i} className="flex gap-4 relative z-10">
                           <div className={`w-3.5 h-3.5 rounded-full ring-4 ring-white shrink-0 mt-0.5 ${act.active ? 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]' : 'bg-slate-100'}`} />
                           <div className="space-y-1">
                              <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight leading-tight">{act.t}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{act.h}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-300">
                   <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/5 rounded-full blur-3xl" />
                   <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 relative z-10 flex items-center justify-between">
                      ✓ Compliance
                      <ShieldCheck size={14} className="text-green-500" />
                   </h3>
                   <ul className="space-y-4 relative z-10 mb-8">
                      {[
                        'All reports signed',
                        'No overdue reports',
                        'Documentation current'
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                           <Check size={12} className="text-green-500" /> {item}
                        </li>
                      ))}
                   </ul>
                   <div className="pt-6 border-t border-white/5 text-center">
                      <span className="text-[9px] font-black text-green-400 uppercase tracking-[0.2em] px-4 py-2 bg-green-500/10 rounded-xl border border-green-500/20">Status: Good Standing</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsLibrary;
