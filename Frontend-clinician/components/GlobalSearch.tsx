
import React, { useState } from 'react';
import { 
  Search, Filter, X, Calendar, FileText, MessageSquare, 
  User, ClipboardList, Target, Briefcase, ChevronDown, 
  Clock, ArrowRight, Download, Eye, AlertTriangle, 
  CheckCircle2, MoreVertical
} from 'lucide-react';

interface GlobalSearchProps {
  onBack: () => void;
  onNavigate: (view: string, id?: string) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ onBack, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('All Results');
  const [searchQuery, setSearchQuery] = useState('speech therapy aarav');

  const tabs = [
    { label: 'All Results', count: 24 },
    { label: 'Patients', count: 3 },
    { label: 'Sessions', count: 8 },
    { label: 'Reports', count: 4 },
    { label: 'Assessments', count: 2 },
    { label: 'IEPs', count: 1 },
    { label: 'Messages', count: 4 },
    { label: 'Goals', count: 2 }
  ];

  const results = [
    {
      id: 'p1',
      category: 'PATIENT',
      color: 'bg-blue-600',
      badgeColor: 'bg-blue-100 text-blue-700',
      icon: <User size={24} className="text-white" />,
      title: 'Aarav Kumar',
      subtitle: '7 years • Grade 2 • #DAI-8291',
      tags: ['ASD', 'Speech Delay'],
      content: 'Current intervention: <mark class="bg-yellow-200 rounded-sm px-0.5">Speech</mark> & Language Therapy - PECS Protocol',
      meta: 'Last updated: 2 days ago',
      actions: [{ label: 'View Profile', primary: true, action: () => onNavigate('profile', 'aarav') }, { label: 'View Sessions', action: () => onNavigate('consultation-manager') }]
    },
    {
      id: 's1',
      category: 'SESSION NOTE',
      color: 'bg-green-600',
      badgeColor: 'bg-green-100 text-green-700',
      icon: <Calendar size={24} className="text-white" />,
      title: 'Speech Therapy Session - Aarav Kumar',
      subtitle: 'October 24, 2024 • 10:30 AM',
      content: '...Aarav demonstrated significant improvement in <mark class="bg-yellow-200 rounded-sm px-0.5">speech</mark> and sentence construction during today\'s <mark class="bg-yellow-200 rounded-sm px-0.5">therapy</mark> session. Used 4-5 word phrases consistently...',
      meta: 'Created by: Dr. Jane Rivera',
      actions: [{ label: 'View Full Note', primary: true, color: 'green', action: () => onNavigate('consultation-manager') }, { label: 'Preview' }]
    },
    {
      id: 'r1',
      category: 'REPORT',
      color: 'bg-orange-500',
      badgeColor: 'bg-orange-100 text-orange-700',
      icon: <FileText size={24} className="text-white" />,
      title: 'Progress Report - Aarav Kumar',
      subtitle: 'Quarterly Progress Review • Oct 20, 2024',
      content: '...<mark class="bg-yellow-200 rounded-sm px-0.5">Speech therapy</mark> interventions showing positive outcomes. <mark class="bg-yellow-200 rounded-sm px-0.5">Aarav</mark> has progressed from 2-3 word phrases to consistent 4-5 word sentences...',
      attachment: 'Progress_Report_Oct2024.pdf (2.4 MB)',
      meta: 'Generated 4 days ago',
      actions: [{ label: 'View Report', primary: true, color: 'orange', action: () => onNavigate('reports-library') }, { label: 'Download PDF', icon: <Download size={14} /> }]
    },
    {
      id: 'a1',
      category: 'ASSESSMENT',
      color: 'bg-teal-600',
      badgeColor: 'bg-teal-100 text-teal-700',
      icon: <ClipboardList size={24} className="text-white" />,
      title: 'ISAA Assessment - Aarav Kumar',
      subtitle: 'October 10, 2024',
      content: '...Communication domain shows improvement with <mark class="bg-yellow-200 rounded-sm px-0.5">speech</mark> and language skills. Score: 72/200 (Mild ASD).',
      meta: 'Status: Completed',
      actions: [{ label: 'View Results', primary: true, color: 'teal', action: () => onNavigate('diagnostics') }]
    },
    {
      id: 'm1',
      category: 'MESSAGE',
      color: 'bg-purple-600',
      badgeColor: 'bg-purple-100 text-purple-700',
      icon: <MessageSquare size={24} className="text-white" />,
      title: 'Question about speech therapy schedule',
      subtitle: 'From: Mrs. Priya Kumar • Oct 23, 2024',
      content: 'Hi Dr. Rivera, I wanted to ask about <mark class="bg-yellow-200 rounded-sm px-0.5">Aarav\'s speech therapy</mark> sessions this week. Can we reschedule Tuesday?',
      meta: 'To: You',
      actions: [{ label: 'View Message', primary: true, color: 'purple', action: () => onNavigate('messages') }, { label: 'Reply' }]
    },
    {
      id: 'i1',
      category: 'IEP',
      color: 'bg-blue-500',
      badgeColor: 'bg-blue-100 text-blue-700',
      icon: <FileText size={24} className="text-white" />,
      title: 'IEP - Aarav Kumar (2024-2025)',
      subtitle: 'Status: Active',
      content: '...Goal #2: Communication Development - <mark class="bg-yellow-200 rounded-sm px-0.5">Speech</mark> and language therapy 2x per week. Focus on expressive vocabulary.',
      meta: 'Includes 3 related goals',
      actions: [{ label: 'View IEP', primary: true, color: 'blue', action: () => onNavigate('iep-builder') }]
    },
    {
      id: 'g1',
      category: 'GOAL',
      color: 'bg-yellow-500',
      badgeColor: 'bg-yellow-100 text-yellow-700',
      icon: <Target size={24} className="text-white" />,
      title: 'Communication Goal - Aarav Kumar',
      subtitle: '2024-2025 IEP',
      content: 'By April 2025, <mark class="bg-yellow-200 rounded-sm px-0.5">Aarav</mark> will use complete 4-5 word sentences during <mark class="bg-yellow-200 rounded-sm px-0.5">speech therapy</mark> sessions with minimal prompting.',
      progress: 68,
      meta: 'Target Date: April 2025',
      actions: [{ label: 'View Goal Details', primary: true, color: 'yellow', action: () => onNavigate('intervention-detail') }]
    },
    {
      id: 'iv1',
      category: 'INTERVENTION',
      color: 'bg-green-600',
      badgeColor: 'bg-green-100 text-green-700',
      icon: <Briefcase size={24} className="text-white" />,
      title: 'Speech & Language Therapy',
      subtitle: 'Protocol: PECS Phase IV',
      content: '...Expressive language intervention using <mark class="bg-yellow-200 rounded-sm px-0.5">speech</mark> and communication protocols. Provider: Dr. Sarah Mehta.',
      meta: 'Status: Active',
      actions: [{ label: 'View Intervention', primary: true, color: 'green', action: () => onNavigate('interventions') }]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 animate-in fade-in duration-500">
      {/* Demo Banner */}
      <div className="w-full bg-amber-50 border-b border-amber-100 py-2.5 px-6 flex items-center justify-center gap-3 sticky top-0 z-50">
        <AlertTriangle size={16} className="text-amber-600" />
      </div>

      {/* Header Area */}
      <div className="bg-white border-b border-slate-100 sticky top-[41px] z-40">
         <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8">
            <div className="flex items-center gap-4 mb-8">
               <div className="relative flex-1 max-w-4xl mx-auto">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-16 pl-16 pr-16 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xl font-medium outline-none focus:border-[#2563EB] focus:bg-white transition-all shadow-sm"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                       <X size={24} />
                    </button>
                  )}
               </div>
               <button className="h-16 px-10 bg-[#2563EB] text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">Search</button>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="flex items-baseline gap-3">
                  <h2 className="text-xl font-bold text-slate-900">Found {results.length} results for "{searchQuery}"</h2>
                  <p className="text-xs font-medium text-slate-400">0.23 seconds</p>
               </div>
               
               <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide max-w-full">
                  {tabs.map(tab => (
                    <button 
                      key={tab.label}
                      onClick={() => setActiveTab(tab.label)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                        activeTab === tab.label 
                          ? 'bg-[#2563EB] text-white shadow-md' 
                          : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                       {tab.label} <span className={`ml-1.5 opacity-60 ${activeTab === tab.label ? 'text-white' : 'text-slate-400'}`}>({tab.count})</span>
                    </button>
                  ))}
               </div>
            </div>
         </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mt-8">
         <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Sidebar - Filters */}
            <aside className="w-full lg:w-[280px] shrink-0 space-y-8">
               <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Refine Results</h3>
                     <button className="text-[10px] font-bold text-slate-400 hover:text-slate-600">Clear All</button>
                  </div>

                  <div className="space-y-6">
                     <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-700">Date Range</h4>
                        {['All time', 'Last 7 days', 'Last 30 days', 'Last year', 'Custom range'].map((opt, i) => (
                          <label key={i} className="flex items-center gap-3 cursor-pointer group">
                             <input type="radio" name="date" defaultChecked={i === 0} className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" />
                             <span className="text-sm text-slate-600 group-hover:text-slate-900">{opt}</span>
                          </label>
                        ))}
                     </div>

                     <div className="h-px bg-slate-100" />

                     <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-700">Result Type</h4>
                        {['Patients', 'Clinical sessions', 'Reports', 'Assessments', 'Messages', 'Documents', 'Interventions'].map((opt, i) => (
                          <label key={i} className="flex items-center gap-3 cursor-pointer group">
                             <input type="checkbox" defaultChecked={i < 5} className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500" />
                             <span className="text-sm text-slate-600 group-hover:text-slate-900">{opt}</span>
                          </label>
                        ))}
                     </div>

                     <div className="h-px bg-slate-100" />

                     <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-700">Provider</h4>
                        <label className="flex items-center gap-3 cursor-pointer group">
                           <input type="radio" name="prov" defaultChecked className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" />
                           <span className="text-sm text-slate-600 group-hover:text-slate-900">My results only</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                           <input type="radio" name="prov" className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" />
                           <span className="text-sm text-slate-600 group-hover:text-slate-900">All providers</span>
                        </label>
                     </div>
                  </div>
               </div>
            </aside>

            {/* Main Results Feed */}
            <div className="flex-1 space-y-6">
               <div className="flex justify-end">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                     <span>Sort by:</span>
                     <button className="flex items-center gap-1 text-slate-900 hover:text-blue-600">Relevance <ChevronDown size={14} /></button>
                  </div>
               </div>

               {results.map((res) => (
                 <div key={res.id} className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all group flex gap-6">
                    <div className="flex flex-col items-center gap-4 shrink-0">
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md ${res.color}`}>
                          {res.icon}
                       </div>
                       <div className={`w-1 h-full rounded-full opacity-20 ${res.color}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0 py-1">
                       <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${res.badgeColor}`}>
                             {res.category}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{res.meta}</span>
                       </div>
                       
                       <h3 className="text-xl font-bold text-slate-900 mb-1 cursor-pointer group-hover:text-blue-600 transition-colors">
                          {res.title}
                       </h3>
                       {res.subtitle && <p className="text-xs font-bold text-slate-500 mb-3">{res.subtitle}</p>}
                       
                       {res.tags && (
                          <div className="flex gap-2 mb-3">
                             {res.tags.map(t => (
                               <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider">{t}</span>
                             ))}
                          </div>
                       )}

                       <p className="text-sm text-slate-600 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: res.content }} />
                       
                       {res.attachment && (
                          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 w-fit mb-4 hover:bg-slate-100 cursor-pointer">
                             <FileText size={16} className="text-slate-400" />
                             <span className="text-xs font-bold text-slate-700">{res.attachment}</span>
                          </div>
                       )}

                       {res.progress && (
                          <div className="w-full max-w-md h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                             <div className={`h-full ${res.id === 'g1' ? 'bg-yellow-500' : 'bg-blue-500'}`} style={{ width: `${res.progress}%` }} />
                          </div>
                       )}

                       <div className="flex gap-3">
                          {res.actions.map((act, i) => (
                            <button 
                              key={i} 
                              onClick={act.action}
                              className={`h-9 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                                act.primary 
                                  ? `${res.badgeColor} hover:opacity-80` 
                                  : 'border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
                              }`}
                            >
                               {act.icon} {act.label}
                            </button>
                          ))}
                       </div>
                    </div>
                 </div>
               ))}

               {/* Pagination */}
               <div className="flex items-center justify-between pt-8 border-t border-slate-200">
                  <p className="text-xs font-bold text-slate-400">Showing 1-8 of 24 results</p>
                  <div className="flex items-center gap-2">
                     <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50">◀</button>
                     <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#2563EB] text-white font-bold text-xs shadow-md">1</button>
                     <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold text-xs">2</button>
                     <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold text-xs">3</button>
                     <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50">▶</button>
                  </div>
               </div>
            </div>

            {/* Right Sidebar - Utilities */}
            <aside className="w-full lg:w-[280px] shrink-0 space-y-8 sticky top-36 h-fit">
               <div className="bg-blue-50 rounded-[2rem] border border-blue-100 p-6">
                  <h3 className="text-xs font-black text-blue-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                     💡 Search Tips
                  </h3>
                  <ul className="space-y-3">
                     {[
                       'Use patient names for specific results',
                       'Add dates for time-based searches',
                       'Try diagnosis terms (ASD, ADHD)',
                       'Use quotes for "exact phrases"'
                     ].map((tip, i) => (
                       <li key={i} className="flex items-start gap-2 text-[11px] font-bold text-blue-700/70 leading-snug">
                          <div className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 shrink-0" /> {tip}
                       </li>
                     ))}
                  </ul>
               </div>

               <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Recent Searches</h3>
                  <div className="space-y-2">
                     {['assessment results', 'priya sharma', 'iep goals', 'autism protocol'].map((s, i) => (
                       <button key={i} className="flex items-center gap-2 w-full p-2 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-600 transition-colors text-left">
                          <Clock size={14} className="text-slate-300" /> {s}
                       </button>
                     ))}
                  </div>
                  <button className="text-[10px] font-bold text-slate-400 hover:text-red-500 mt-4 pl-2">Clear history</button>
               </div>

               <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Quick Filters</h3>
                  <div className="flex flex-wrap gap-2">
                     {['My patients', 'This week', 'Unread', 'Pending'].map((f, i) => (
                       <button key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all">
                          {f}
                       </button>
                     ))}
                  </div>
               </div>
            </aside>

         </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
