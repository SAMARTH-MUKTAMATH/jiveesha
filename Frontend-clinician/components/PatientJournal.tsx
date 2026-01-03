import React, { useState } from 'react';
import { 
  ArrowLeft, Search, Filter, Plus, Calendar, Video, 
  FileText, MessageCircle, Award, Image, Activity, 
  ClipboardList, ChevronRight, MoreVertical, Play, 
  Download, Share2, Trash2, Heart, Smile, AlertTriangle,
  Pill, Camera, Edit3
} from 'lucide-react';

interface PatientJournalProps {
  onBack: () => void;
}

const PatientJournal: React.FC<PatientJournalProps> = ({ onBack }) => {
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar' | 'media'>('timeline');
  const [activeFilter, setActiveFilter] = useState('All Entries (48)');

  const entries = [
    {
      id: '1',
      type: 'Clinical Note',
      date: 'October 24, 2024 • 2:30 PM',
      author: 'Dr. Jane Rivera',
      role: 'Clinical Psychologist',
      avatar: 'Rivera',
      content: "Aarav demonstrated significant improvement in sentence construction during today's assessment. Used 4-5 word sentences consistently when describing pictures. Notable progress in expressive language - now initiating communication more frequently without prompting.",
      tags: ['Progress', 'Communication', 'Assessment'],
      links: ['Goal #2 (Communication)', 'Session: Speech Therapy Oct 24'],
      attachment: { name: 'Session_Notes.pdf', size: '2.1 MB' },
      interactions: 'Viewed by parent',
      timeAgo: '2 hours ago',
      color: 'blue'
    },
    {
      id: '2',
      type: 'Parent Submission',
      date: 'October 23, 2024 • 7:15 PM',
      author: 'Mrs. Priya Kumar',
      role: 'Mother',
      avatar: 'Priya',
      content: "Great progress at home this week! Aarav used full sentences to ask for his favorite snack today - 'Mom, can I have apple juice please?' - without any prompting. So proud of him! 🎉",
      mood: '😊 Excited about progress',
      media: { type: 'video', thumb: 'https://images.unsplash.com/photo-1596443686812-2f45229eebc3?auto=format&fit=crop&w=400&q=80', title: 'Aarav requesting juice independently', duration: '0:45' },
      reply: {
        author: 'Dr. Jane Rivera replied',
        time: 'Oct 24, 9:00 AM',
        text: 'This is wonderful progress! Great job with the home practice. This shows excellent generalization of skills.',
        liked: true
      },
      color: 'green'
    },
    {
      id: '3',
      type: 'Milestone Achieved',
      date: 'October 20, 2024',
      title: 'First 5-Word Sentence!',
      description: "Aarav independently used a complete 5-word sentence in spontaneous conversation during therapy session.",
      detail: { quote: "I want to play with train", context: "During free play activity" },
      celebration: 'Celebrated by: You, Dr. Mehta, Mrs. Kumar',
      evidence: { type: 'video', thumb: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=400&q=80' },
      color: 'yellow'
    },
    {
      id: '4',
      type: 'Media Evidence',
      date: 'October 18, 2024 • 3:20 PM',
      author: 'Dr. Sarah Mehta',
      role: 'SLP',
      avatar: 'Sarah',
      description: "PECS communication board samples and handwriting practice sheets from today's session",
      photos: [
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=300&q=80',
        'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=300&q=80',
        'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=300&q=80'
      ],
      tags: ['Session Evidence', 'Fine Motor', 'Communication'],
      color: 'purple'
    },
    {
      id: '5',
      type: 'Medication',
      date: 'October 15, 2024 • 8:00 AM',
      author: 'Parent via mobile app',
      medication: 'Ritalin 5mg',
      dosage: '1 tablet, oral',
      time: 'Morning (8:00 AM)',
      sideEffects: 'Mild - Slight decrease in appetite',
      rating: 5,
      color: 'red'
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] pb-20 animate-in fade-in duration-500">
      {/* Demo Banner */}
      <div className="w-full bg-amber-50 border-b border-amber-100 py-2.5 px-12 flex items-center justify-center gap-3">
        <AlertTriangle size={16} className="text-amber-600" />
      </div>

      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-6">
          <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
            <button onClick={onBack} className="hover:text-[#2563EB] transition-colors">Patient Profile</button>
            <ChevronRight size={14} />
            <span className="text-slate-800">Clinical Journal</span>
          </nav>

          <div className="flex flex-col md:flex-row items-end justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl border-2 border-white shadow-lg overflow-hidden ring-2 ring-blue-50">
                   <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rivera" alt="Aarav" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Aarav Kumar</h1>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">7 years • #DAI-8291</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-slate-100 p-1 rounded-xl flex">
                {[
                  { id: 'timeline', label: 'Timeline' },
                  { id: 'calendar', label: 'Calendar' },
                  { id: 'media', label: 'Media Gallery' }
                ].map(v => (
                  <button 
                    key={v.id}
                    onClick={() => setViewMode(v.id as any)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === v.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-2 px-6 py-3 border-2 border-slate-100 rounded-xl text-xs font-black text-slate-600 uppercase tracking-widest hover:border-slate-300 transition-all">
                <Download size={16} /> Export
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                <Plus size={16} /> Add Entry
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mt-8">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto scrollbar-hide">
            {['All Entries (48)', 'Clinical Notes (22)', 'Parent Submissions (12)', 'Milestones (8)', 'Media (24)'].map(f => (
              <button 
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  activeFilter === f ? 'bg-[#2563EB] text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4 w-full lg:w-auto">
             <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200">
                <span className="text-[10px] font-black text-slate-400 uppercase">Show:</span>
                <select className="text-xs font-bold text-slate-700 bg-transparent border-none outline-none cursor-pointer">
                   <option>Last 3 Months</option>
                   <option>Last 6 Months</option>
                   <option>All Time</option>
                </select>
             </div>
             <div className="relative flex-1 lg:w-64">
                <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search journal entries..." 
                  className="w-full h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-blue-400 transition-all"
                />
             </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            
            {entries.map((entry) => (
              <div 
                key={entry.id} 
                className={`bg-white rounded-[2rem] shadow-sm border-l-4 overflow-hidden relative group transition-all hover:shadow-md ${
                  entry.color === 'blue' ? 'border-l-blue-500' :
                  entry.color === 'green' ? 'border-l-green-500' :
                  entry.color === 'yellow' ? 'border-l-amber-400 bg-amber-50/10' :
                  entry.color === 'purple' ? 'border-l-purple-500' :
                  'border-l-red-500 bg-red-50/10'
                }`}
              >
                <div className="p-8">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                         entry.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                         entry.color === 'green' ? 'bg-green-50 text-green-600' :
                         entry.color === 'yellow' ? 'bg-amber-100 text-amber-600' :
                         entry.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                         'bg-red-50 text-red-600'
                       }`}>
                          {entry.color === 'blue' ? <FileText size={24} /> :
                           entry.color === 'green' ? <MessageCircle size={24} /> :
                           entry.color === 'yellow' ? <Award size={24} /> :
                           entry.color === 'purple' ? <Camera size={24} /> :
                           <Pill size={24} />}
                       </div>
                       <div>
                          <div className="flex items-center gap-3">
                             <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                               entry.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                               entry.color === 'green' ? 'bg-green-100 text-green-700' :
                               entry.color === 'yellow' ? 'bg-amber-100 text-amber-700' :
                               entry.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                               'bg-red-100 text-red-700'
                             }`}>{entry.type}</span>
                             <span className="text-xs font-bold text-slate-500">{entry.date}</span>
                          </div>
                          {entry.author && (
                            <div className="flex items-center gap-2 mt-1.5">
                               {entry.avatar && (
                                 <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.avatar}`} alt="Author" className="w-full h-full object-cover" />
                                 </div>
                               )}
                               <span className="text-xs font-bold text-slate-700">{entry.author} <span className="text-slate-400 font-medium">• {entry.role || 'Parent'}</span></span>
                            </div>
                          )}
                       </div>
                    </div>
                    <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><MoreVertical size={20} /></button>
                  </div>

                  {/* Body */}
                  <div className="pl-16 space-y-4">
                     {entry.title && <h3 className="text-lg font-black text-slate-900">{entry.title}</h3>}
                     {entry.content && <p className="text-sm font-medium text-slate-600 leading-relaxed">{entry.content}</p>}
                     {entry.description && <p className="text-sm font-medium text-slate-600 leading-relaxed">{entry.description}</p>}
                     
                     {entry.detail && (
                       <div className="p-4 bg-white border border-amber-100 rounded-xl shadow-sm">
                          <p className="text-lg font-black text-amber-800 italic text-center">"{entry.detail.quote}"</p>
                          <div className="flex justify-center gap-4 mt-2 text-[10px] font-bold text-amber-600 uppercase tracking-widest">
                             <span>Context: {entry.detail.context}</span>
                          </div>
                       </div>
                     )}

                     {entry.medication && (
                       <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-red-100">
                          <div><p className="text-[10px] font-black text-slate-400 uppercase">Medication</p><p className="font-bold text-slate-800">{entry.medication}</p></div>
                          <div><p className="text-[10px] font-black text-slate-400 uppercase">Dosage</p><p className="font-bold text-slate-800">{entry.dosage}</p></div>
                          <div><p className="text-[10px] font-black text-slate-400 uppercase">Side Effects</p><p className="font-bold text-slate-800">{entry.sideEffects}</p></div>
                          <div><p className="text-[10px] font-black text-slate-400 uppercase">Effectiveness</p><div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-amber-400 fill-amber-400" />)}</div></div>
                       </div>
                     )}

                     {/* Media Attachment */}
                     {entry.media && (
                        <div className="relative group/media cursor-pointer overflow-hidden rounded-2xl border-2 border-slate-100 mt-4 max-w-md">
                           <img src={entry.media.thumb} alt="Media" className="w-full h-48 object-cover" />
                           <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover/media:bg-black/20 transition-all">
                              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40">
                                 <Play size={24} className="text-white fill-white ml-1" />
                              </div>
                           </div>
                           <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white">
                              <p className="text-xs font-bold text-shadow-sm">{entry.media.title}</p>
                              <span className="text-[10px] font-mono bg-black/60 px-1.5 py-0.5 rounded">{entry.media.duration}</span>
                           </div>
                        </div>
                     )}

                     {/* Photo Grid */}
                     {entry.photos && (
                        <div className="grid grid-cols-3 gap-3 mt-4">
                           {entry.photos.map((url, i) => (
                             <div key={i} className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border border-slate-100">
                                <img src={url} alt={`Evidence ${i}`} className="w-full h-full object-cover" />
                             </div>
                           ))}
                        </div>
                     )}

                     {/* Parent Mood */}
                     {entry.mood && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg text-xs font-bold text-slate-600 border border-slate-200">
                           <span>{entry.mood.split(' ')[0]}</span>
                           <span>{entry.mood.substring(2)}</span>
                        </div>
                     )}

                     {/* Nested Reply */}
                     {entry.reply && (
                        <div className="mt-4 ml-[-20px] p-4 bg-slate-50 rounded-xl border-l-4 border-blue-400 flex gap-3">
                           <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700 border border-blue-200">
                              DR
                           </div>
                           <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                 <p className="text-xs font-black text-slate-700">{entry.reply.author}</p>
                                 <span className="text-[9px] font-bold text-slate-400 uppercase">{entry.reply.time}</span>
                              </div>
                              <p className="text-xs text-slate-600 font-medium leading-snug">{entry.reply.text}</p>
                              {entry.reply.liked && (
                                 <div className="flex items-center gap-1 mt-2 text-[9px] font-bold text-red-500 uppercase tracking-widest">
                                    <Heart size={10} className="fill-red-500" /> Liked by parent
                                 </div>
                              )}
                           </div>
                        </div>
                     )}

                     {/* Metadata Footer */}
                     <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-50/50 mt-4">
                        {entry.tags && entry.tags.map(t => (
                           <span key={t} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">#{t}</span>
                        ))}
                        {entry.links && entry.links.map(l => (
                           <span key={l} className="text-[10px] font-bold text-blue-400 uppercase tracking-widest hover:text-blue-600 cursor-pointer">🔗 {l}</span>
                        ))}
                        {entry.attachment && (
                           <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-100">
                              <FileText size={12} /> {entry.attachment.name}
                           </div>
                        )}
                        <div className="flex-1 text-right">
                           <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{entry.interactions || entry.celebration}</span>
                        </div>
                     </div>

                     {/* Actions */}
                     <div className="flex gap-4 pt-2">
                        <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600">Reply</button>
                        <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600">Share</button>
                        <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600">Link to Goal</button>
                     </div>
                  </div>
                </div>
              </div>
            ))}

            <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-xs font-black text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all uppercase tracking-widest">
               Load Earlier Entries
            </button>
          </div>

          {/* Right Sidebar */}
          <aside className="w-full lg:w-[300px] shrink-0 space-y-8 sticky top-36 h-fit">
             <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Journal Stats</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                   <div className="text-center p-3 bg-blue-50 rounded-xl">
                      <span className="block text-2xl font-black text-blue-600">48</span>
                      <span className="text-[9px] font-bold text-blue-400 uppercase">Total Entries</span>
                   </div>
                   <div className="text-center p-3 bg-green-50 rounded-xl">
                      <span className="block text-2xl font-black text-green-600">12</span>
                      <span className="text-[9px] font-bold text-green-400 uppercase">This Month</span>
                   </div>
                </div>
                <div className="space-y-3">
                   {[
                     { label: 'Clinical Notes', val: 22, c: 'bg-blue-500' },
                     { label: 'Parent Posts', val: 12, c: 'bg-green-500' },
                     { label: 'Milestones', val: 8, c: 'bg-amber-400' },
                     { label: 'Media', val: 24, c: 'bg-purple-500' }
                   ].map((s, i) => (
                     <div key={i} className="flex justify-between items-center text-xs font-bold text-slate-600">
                        <div className="flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${s.c}`} /> {s.label}
                        </div>
                        <span>{s.val}</span>
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Related Goals</h3>
                <div className="space-y-3">
                   <button className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-blue-50 transition-colors group">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-blue-400">Goal #2</p>
                      <p className="text-xs font-bold text-slate-700 leading-tight">Communication Development</p>
                      <p className="text-[9px] font-medium text-slate-400 mt-1">18 entries linked</p>
                   </button>
                   <button className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-green-50 transition-colors group">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-green-400">Goal #3</p>
                      <p className="text-xs font-bold text-slate-700 leading-tight">Social Skills & Interaction</p>
                      <p className="text-[9px] font-medium text-slate-400 mt-1">12 entries linked</p>
                   </button>
                </div>
             </div>

             <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Contributors</h3>
                <div className="space-y-4">
                   {[
                     { name: 'Dr. Jane Rivera', role: 'Clinical Psychologist', count: 22 },
                     { name: 'Dr. Sarah Mehta', role: 'Speech Therapist', count: 15 },
                     { name: 'Mrs. Priya Kumar', role: 'Mother', count: 12 }
                   ].map((c, i) => (
                     <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
                           {c.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                           <p className="text-xs font-bold">{c.name}</p>
                           <p className="text-[9px] text-slate-400 uppercase">{c.role}</p>
                        </div>
                        <span className="text-[10px] font-black opacity-60">{c.count}</span>
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Quick Actions</h3>
                <div className="space-y-3">
                   {['Export to PDF', 'Share with Team', 'Print Journal', 'Journal Settings'].map((a, i) => (
                     <button key={i} className="w-full py-3 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all text-left px-4">
                        {a}
                     </button>
                   ))}
                </div>
             </div>
          </aside>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-16 h-16 bg-[#2563EB] text-white rounded-full shadow-2xl shadow-blue-400 flex items-center justify-center hover:scale-110 transition-transform active:scale-95 z-50">
         <Plus size={32} />
      </button>
    </div>
  );
};

// Simple Star Icon
const Star: React.FC<{ size: number; className?: string }> = ({ size, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

export default PatientJournal;