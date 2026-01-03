
import React, { useState } from 'react';
import { 
  ArrowLeft, Search, Filter, Plus, Calendar, 
  ChevronRight, MoreVertical, FileText, Video, 
  Phone, Home, User, Clock, CheckCircle2, 
  AlertTriangle, Download, Printer, Share2, 
  X, Check, Paperclip, Image, Mic, ChevronDown,
  ListChecks
} from 'lucide-react';

interface ConsultationManagerProps {
  onBack: () => void;
}

const ConsultationManager: React.FC<ConsultationManagerProps> = ({ onBack }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNoteDetail, setShowNoteDetail] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All Sessions (24)');
  
  // Creation Wizard State
  const [createStep, setCreateStep] = useState(1);
  const [sessionForm, setSessionForm] = useState({
    date: '2024-10-24',
    startTime: '10:30',
    endTime: '11:15',
    format: 'In-Person',
    type: 'Assessment',
    participants: ['Patient', 'Parent'],
    notes: '',
    tags: [] as string[]
  });

  const notes = [
    {
      id: 'n1',
      date: 'Oct 24, 2024',
      time: '10:30 AM - 11:15 AM',
      duration: '45m',
      type: 'Speech Therapy Assessment',
      format: 'In-Person',
      provider: 'Dr. Jane Rivera',
      role: 'Clinical Psychologist',
      participants: 'Patient + Parent',
      preview: 'Aarav demonstrated significant improvement in sentence construction during today\'s session. Used 4-5 word phrases consistently when describing pictures. Notable progress in expressive language...',
      tags: ['Progress', 'Communication', 'Assessment'],
      linked: ['Speech Therapy Intervention', 'Goal #2'],
      location: 'Clinic - Room 3'
    },
    {
      id: 'n2',
      date: 'Oct 20, 2024',
      time: '2:00 PM - 2:30 PM',
      duration: '30m',
      type: 'Parent Consultation',
      format: 'Virtual',
      provider: 'Dr. Jane Rivera',
      role: 'Clinical Psychologist',
      participants: 'Parent only',
      preview: 'Discussed Aarav\'s progress with mother via video call. Reviewed home practice activities and addressed parent concerns about school performance regarding recent behavioral changes...',
      tags: ['Parent Support', 'Home Plan'],
      location: 'Google Meet',
      platform: true
    },
    {
      id: 'n3',
      date: 'Oct 18, 2024',
      time: '4:00 PM - 5:00 PM',
      duration: '60m',
      type: 'IEP Team Meeting',
      format: 'In-Person',
      provider: 'Dr. Jane Rivera + Team',
      role: 'Multidisciplinary',
      participants: 'Parent, Teacher, SLP, OT',
      preview: 'Annual IEP review conducted with full team. Discussed progress on all goals, updated accommodations, and planned for next academic quarter. Consensus reached on new math goals.',
      tags: ['IEP', 'Team Meeting', 'Planning'],
      location: 'Conference Room B',
      group: true
    }
  ];

  const handleCreateSubmit = () => {
    // In a real app, save data here
    setShowCreateModal(false);
    setCreateStep(1);
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] pb-20 animate-in fade-in duration-500 relative">
      {/* Demo Banner */}
      <div className="w-full bg-amber-50 border-b border-amber-100 py-2.5 px-6 flex items-center justify-center gap-3">
        <AlertTriangle size={16} className="text-amber-600" />
      </div>

      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-6">
          <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            <button onClick={onBack} className="hover:text-[#2563EB]">Patient Profile</button>
            <ChevronRight size={14} />
            <span className="text-slate-800">Consultation Notes</span>
          </nav>
          
          <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Consultation Notes</h1>
              <p className="text-slate-500 mt-1 font-medium">Document clinical sessions and observations</p>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-[#2563EB] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <Plus size={16} /> New Session Note
            </button>
          </div>

          {/* Patient Context */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6">
             <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rivera" alt="Aarav" className="w-full h-full object-cover" />
             </div>
             <div className="flex-1">
                <h3 className="text-sm font-black text-slate-900">Aarav Kumar, 7 years • Grade 2</h3>
                <div className="flex gap-2 mt-1">
                   <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[9px] font-bold uppercase tracking-widest">ASD</span>
                   <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[9px] font-bold uppercase tracking-widest">Speech Delay</span>
                </div>
             </div>
             <button className="text-xs font-bold text-[#2563EB] hover:underline uppercase tracking-widest">View Profile</button>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
             <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-auto">
                {['All Sessions (24)', 'This Week (3)', 'This Month (8)', 'In-Person (18)', 'Virtual (6)'].map(f => (
                  <button 
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeFilter === f ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                  >
                     {f}
                  </button>
                ))}
             </div>
             <div className="relative w-full md:w-64">
                <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search notes..." 
                  className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-blue-400 transition-all"
                />
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mt-8 flex flex-col xl:flex-row gap-8">
         
         {/* Main Notes List */}
         <div className="flex-1 space-y-6">
            
            {/* Create Card Prompt */}
            <button 
              onClick={() => setShowCreateModal(true)}
              className="w-full p-6 rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#2563EB] hover:bg-blue-50/30 transition-all group flex items-center justify-center gap-4"
            >
               <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                  <Plus size={24} />
               </div>
               <div className="text-left">
                  <h3 className="text-sm font-black text-slate-700 group-hover:text-[#2563EB]">Log New Session</h3>
                  <p className="text-xs text-slate-400">Document a consultation or therapy session</p>
               </div>
            </button>

            {notes.map(note => (
              <div key={note.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                 <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Calendar size={24} />
                       </div>
                       <div>
                          <div className="flex items-center gap-3">
                             <h3 className="text-lg font-black text-slate-900">{note.date}</h3>
                             <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${note.format === 'Virtual' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                {note.format}
                             </span>
                          </div>
                          <p className="text-xs font-bold text-slate-400 mt-0.5">
                             {note.time} • <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{note.duration}</span>
                          </p>
                       </div>
                    </div>
                    <button className="p-2 text-slate-300 hover:text-slate-600 rounded-xl hover:bg-slate-50"><MoreVertical size={20} /></button>
                 </div>

                 <div className="mb-6 pl-16">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="text-sm font-black text-slate-800">{note.type}</span>
                       <span className="text-slate-300">•</span>
                       <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-slate-200 overflow-hidden">
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${note.provider}`} alt="Prov" className="w-full h-full object-cover" />
                          </div>
                          {note.provider}
                       </span>
                    </div>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed mb-3">
                       {note.preview} <button onClick={() => setShowNoteDetail(note.id)} className="text-[#2563EB] font-bold hover:underline ml-1">Read More</button>
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                       {note.tags.map(t => (
                         <span key={t} className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t}</span>
                       ))}
                    </div>

                    {note.linked && (
                       <div className="flex flex-col gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {note.linked.map(l => (
                            <span key={l} className="flex items-center gap-1.5 hover:text-blue-600 cursor-pointer transition-colors">
                               🔗 {l}
                            </span>
                          ))}
                       </div>
                    )}
                 </div>

                 <div className="flex items-center justify-between pl-16 pt-4 border-t border-slate-50">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                       {note.participants} • {note.location}
                    </div>
                    <div className="flex gap-3">
                       <button onClick={() => setShowNoteDetail(note.id)} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all">View Full Note</button>
                       <button className="px-4 py-2 border border-slate-200 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Export</button>
                    </div>
                 </div>
              </div>
            ))}
         </div>

         {/* Sidebar */}
         <aside className="w-full xl:w-[320px] shrink-0 space-y-8 sticky top-36 h-fit">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Session Statistics</h3>
               <div className="space-y-6">
                  <div className="flex justify-between items-center">
                     <div>
                        <p className="text-2xl font-black text-slate-900">24</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Total Sessions</p>
                     </div>
                     <div className="text-right">
                        <p className="text-2xl font-black text-slate-900">8</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">This Month</p>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <span>In-Person (75%)</span>
                        <span>Virtual (25%)</span>
                     </div>
                     <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden flex">
                        <div className="h-full bg-[#2563EB] w-[75%]" />
                        <div className="h-full bg-blue-300 w-[25%]" />
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Quick Actions</h3>
               <div className="space-y-2">
                  {[
                    { l: 'Log New Session', i: <Plus size={16} />, a: () => setShowCreateModal(true) },
                    { l: 'Session Analytics', i: <Clock size={16} /> },
                    { l: 'Export All Notes', i: <Download size={16} /> },
                    { l: 'Note Settings', i: <FileText size={16} /> }
                  ].map((act, i) => (
                    <button key={i} onClick={act.a} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all text-left group">
                       <span className="text-xs font-bold text-slate-600 group-hover:text-blue-600">{act.l}</span>
                       <span className="text-slate-300 group-hover:text-blue-500">{act.i}</span>
                    </button>
                  ))}
               </div>
            </div>

            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Note Templates</h3>
               <div className="space-y-2 mb-4">
                  {['Assessment', 'Therapy Session', 'Consultation', 'Progress Review'].map((t, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-slate-300 hover:text-white cursor-pointer transition-colors">
                       <div className="w-1 h-1 bg-blue-500 rounded-full" /> {t} Template
                    </div>
                  ))}
               </div>
               <button className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:underline">Manage Templates →</button>
            </div>
         </aside>
      </div>

      {/* CREATE SESSION MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                 <div>
                    <h2 className="text-xl font-black text-slate-900">Log New Session</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Step {createStep} of 4</p>
                 </div>
                 <button onClick={() => setShowCreateModal(false)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                 {createStep === 1 && (
                   <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                      <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</label>
                            <input type="date" value={sessionForm.date} className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500" />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Start Time</label>
                               <input type="time" value={sessionForm.startTime} className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500" />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">End Time</label>
                               <input type="time" value={sessionForm.endTime} className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500" />
                            </div>
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Format</label>
                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {['In-Person', 'Virtual', 'Phone', 'Home Visit'].map(fmt => (
                              <button 
                                key={fmt} 
                                onClick={() => setSessionForm({...sessionForm, format: fmt})}
                                className={`h-24 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${sessionForm.format === fmt ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500 hover:border-blue-200'}`}
                              >
                                 {fmt === 'In-Person' ? <Home size={20} /> : fmt === 'Virtual' ? <Video size={20} /> : fmt === 'Phone' ? <Phone size={20} /> : <User size={20} />}
                                 <span className="text-[10px] font-black uppercase">{fmt}</span>
                              </button>
                            ))}
                         </div>
                      </div>

                      {sessionForm.format === 'Virtual' && (
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform</label>
                            <select className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500">
                               <option>Zoom</option><option>Google Meet</option><option>Microsoft Teams</option>
                            </select>
                         </div>
                      )}

                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Participants</label>
                         <div className="flex flex-wrap gap-3">
                            {['Patient', 'Parent/Guardian', 'Teacher', 'Other Therapist'].map(p => (
                              <button 
                                key={p}
                                onClick={() => {
                                   const parts = sessionForm.participants.includes(p) 
                                      ? sessionForm.participants.filter(x => x !== p)
                                      : [...sessionForm.participants, p];
                                   setSessionForm({...sessionForm, participants: parts});
                                }}
                                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${sessionForm.participants.includes(p) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-200'}`}
                              >
                                 {p}
                              </button>
                            ))}
                         </div>
                      </div>
                   </div>
                 )}

                 {createStep === 2 && (
                   <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 h-full flex flex-col">
                      <div className="flex justify-between items-center">
                         <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Clinical Documentation</h3>
                         <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Template:</span>
                            <select className="bg-slate-50 border-none text-xs font-bold text-blue-600 outline-none cursor-pointer">
                               <option>Assessment Standard</option><option>Therapy Session</option><option>Consultation</option>
                            </select>
                         </div>
                      </div>
                      <div className="flex-1 bg-slate-50 rounded-2xl border-2 border-slate-200 p-4 flex flex-col gap-2">
                         <div className="flex gap-2 border-b border-slate-200 pb-2 mb-2">
                            <button className="p-1.5 hover:bg-slate-200 rounded text-slate-500"><b className="font-serif font-black">B</b></button>
                            <button className="p-1.5 hover:bg-slate-200 rounded text-slate-500"><i className="font-serif italic">I</i></button>
                            <button className="p-1.5 hover:bg-slate-200 rounded text-slate-500"><ListChecks size={16} /></button>
                         </div>
                         <textarea 
                           className="flex-1 bg-transparent resize-none outline-none text-sm font-medium text-slate-700 leading-relaxed"
                           placeholder="Enter session notes here..."
                           defaultValue="SESSION SUMMARY:&#10;&#10;OBSERVATIONS:&#10;- &#10;- &#10;&#10;ASSESSMENT/PROGRESS:&#10;&#10;RECOMMENDATIONS:&#10;&#10;NEXT STEPS:"
                         ></textarea>
                      </div>
                      <div className="flex flex-wrap gap-4">
                         {['Progress made', 'Concerns identified', 'Follow-up needed', 'Plan updated'].map(tag => (
                           <label key={tag} className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                              <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500" />
                              {tag}
                           </label>
                         ))}
                      </div>
                   </div>
                 )}

                 {createStep === 3 && (
                   <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                      <div className="space-y-4">
                         <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Link to Records</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intervention Plan</label>
                               <select className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-slate-700 outline-none">
                                  <option>Select intervention...</option>
                                  <option>Speech Therapy - PECS</option>
                                  <option>Occupational Therapy</option>
                               </select>
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Related Goal</label>
                               <select className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-slate-700 outline-none">
                                  <option>Select goal...</option>
                                  <option>Goal #2: Communication</option>
                                  <option>Goal #3: Social Skills</option>
                               </select>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Attachments</h3>
                         <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 mb-4 transition-colors">
                               <Paperclip size={24} />
                            </div>
                            <p className="text-sm font-bold text-slate-600">Click to upload or drag and drop</p>
                            <p className="text-xs text-slate-400 mt-1">Photos, videos, documents (Max 50MB)</p>
                         </div>
                         <div className="grid grid-cols-3 gap-4">
                            <button className="flex items-center justify-center gap-2 h-12 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-all"><Image size={16} /> Photo</button>
                            <button className="flex items-center justify-center gap-2 h-12 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-all"><Video size={16} /> Video</button>
                            <button className="flex items-center justify-center gap-2 h-12 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-all"><Mic size={16} /> Audio</button>
                         </div>
                      </div>
                   </div>
                 )}

                 {createStep === 4 && (
                   <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 text-center">
                      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                         <CheckCircle2 size={40} className="text-green-500" />
                      </div>
                      <h2 className="text-2xl font-black text-slate-900">Ready to Submit?</h2>
                      <div className="bg-slate-50 rounded-2xl p-6 text-left space-y-4 border border-slate-100">
                         <div className="flex justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase">Session</span>
                            <span className="text-sm font-black text-slate-800">Oct 24 • 10:30 AM • In-Person</span>
                         </div>
                         <div className="flex justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase">Type</span>
                            <span className="text-sm font-black text-slate-800">Assessment</span>
                         </div>
                         <div className="flex justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase">Participants</span>
                            <span className="text-sm font-black text-slate-800">Patient, Parent</span>
                         </div>
                         <div className="flex justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase">Linked To</span>
                            <span className="text-sm font-black text-blue-600">Goal #2: Communication</span>
                         </div>
                      </div>
                      <div className="flex flex-col gap-3 text-left max-w-sm mx-auto">
                         <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                            <span className="text-sm font-bold text-slate-700">Add to patient clinical journal</span>
                         </label>
                         <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                            <span className="text-sm font-bold text-slate-700">Share copy with parent</span>
                         </label>
                      </div>
                   </div>
                 )}
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                 {createStep > 1 ? (
                   <button onClick={() => setCreateStep(s => s - 1)} className="px-6 py-3 border-2 border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-white transition-all">Back</button>
                 ) : (
                   <div />
                 )}
                 
                 {createStep < 4 ? (
                   <button onClick={() => setCreateStep(s => s + 1)} className="px-8 py-3 bg-[#2563EB] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">Continue</button>
                 ) : (
                   <button onClick={handleCreateSubmit} className="px-8 py-3 bg-green-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-100">Complete & Save</button>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* NOTE DETAIL MODAL */}
      {showNoteDetail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-8 border-b border-slate-100 flex justify-between items-start bg-slate-50">
                 <div>
                    <div className="flex items-center gap-4 mb-2">
                       <h2 className="text-2xl font-black text-slate-900">Session Note</h2>
                       <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-200">In-Person</span>
                    </div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">October 24, 2024 • 10:30 AM</p>
                 </div>
                 <button onClick={() => setShowNoteDetail(null)} className="p-2 bg-white rounded-xl shadow-sm text-slate-400 hover:text-slate-600 transition-all"><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</p>
                       <p className="text-sm font-bold text-slate-800">Speech Therapy Assessment</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Provider</p>
                       <p className="text-sm font-bold text-slate-800">Dr. Jane Rivera</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Participants</p>
                       <p className="text-sm font-bold text-slate-800">Aarav Kumar + Mother</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">Clinical Notes</h3>
                    <div className="prose prose-sm max-w-none text-slate-600 font-medium leading-relaxed bg-slate-50 p-6 rounded-2xl border-l-4 border-blue-500">
                       <p className="mb-4"><strong className="text-slate-900">SESSION SUMMARY:</strong> Conducted comprehensive speech assessment with Aarav in clinic setting. Mother present throughout session.</p>
                       <p className="mb-4"><strong className="text-slate-900">OBSERVATIONS:</strong></p>
                       <ul className="list-disc pl-5 space-y-1 mb-4">
                          <li>Aarav appeared comfortable and engaged throughout session</li>
                          <li>Demonstrated use of 4-5 word phrases when describing toys and pictures</li>
                          <li>Required minimal prompting for sentence construction</li>
                          <li>Attention span excellent for 15-minute intervals with brief breaks</li>
                       </ul>
                       <p className="mb-4"><strong className="text-slate-900">ASSESSMENT FINDINGS:</strong> Expressive language showing improvement (up from baseline). Receptive language follows 2-3 step directions with 90% accuracy.</p>
                       <p><strong className="text-slate-900">NEXT STEPS:</strong> Continue current PECS protocol. Increase complexity to 5-6 word sentences. Schedule follow-up in 2 weeks.</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">Session Evidence (3)</h3>
                    <div className="flex gap-4">
                       {[
                         { t: 'Video', n: 'Session_Rec.mp4', i: <Video size={16} /> },
                         { t: 'Image', n: 'Handwriting.jpg', i: <Image size={16} /> },
                         { t: 'Doc', n: 'Data_Sheet.pdf', i: <FileText size={16} /> }
                       ].map((f, i) => (
                         <div key={i} className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors min-w-[160px]">
                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">{f.i}</div>
                            <div>
                               <p className="text-xs font-bold text-slate-700">{f.n}</p>
                               <p className="text-[10px] text-slate-400 uppercase font-bold">{f.t}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">Linked Records</h3>
                    <div className="flex gap-3">
                       <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100">🎯 Goal #2: Communication</span>
                       <span className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold border border-purple-100">⚡ Intervention: Speech Therapy</span>
                    </div>
                 </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                 <button className="px-6 py-3 border-2 border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-white hover:text-slate-800 transition-all">Print Note</button>
                 <button className="px-6 py-3 border-2 border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-white hover:text-slate-800 transition-all">Edit</button>
                 <button onClick={() => setShowNoteDetail(null)} className="px-8 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all">Close</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationManager;
