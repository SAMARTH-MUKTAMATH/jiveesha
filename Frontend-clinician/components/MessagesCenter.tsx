
import React, { useState } from 'react';
import { 
  ArrowLeft, Search, Filter, MoreVertical, Plus, 
  Send, Paperclip, Image, Smile, Calendar, Video, 
  Phone, Info, Lock, CheckCircle2, ChevronRight,
  MoreHorizontal, ChevronDown, Download, AlertTriangle,
  X, Check, User, FileText
} from 'lucide-react';

interface MessagesCenterProps {
  onBack: () => void;
}

const MessagesCenter: React.FC<MessagesCenterProps> = ({ onBack }) => {
  const [activeConversation, setActiveConversation] = useState('c1');
  const [messageText, setMessageText] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All (12)');

  const conversations = [
    {
      id: 'c1',
      name: 'Mrs. Priya Kumar',
      role: 'Parent',
      avatar: 'Priya',
      patient: 'Aarav Kumar',
      time: '1 hour ago',
      preview: 'Thank you for the detailed progress report. I have a question about...',
      unread: 2,
      online: true,
      attachment: true
    },
    {
      id: 'c2',
      name: 'Dr. Sarah Mehta',
      role: 'Speech Therapist',
      avatar: 'Sarah',
      patient: 'Aarav Kumar',
      context: 'Therapy Schedule',
      time: 'Yesterday',
      preview: "I can reschedule Tuesday's session to...",
      flagged: true
    },
    {
      id: 'c3',
      name: 'Mr. Vikram Sharma',
      role: 'Parent',
      avatar: 'Vikram',
      patient: 'Priya Sharma',
      time: '2 days ago',
      preview: 'Got it, thank you for confirming the appointment time.',
      read: true
    },
    {
      id: 'c4',
      name: 'Mrs. Meena Sharma',
      role: 'Teacher',
      avatar: 'Meena',
      school: true,
      patient: 'Aarav Kumar',
      context: 'IEP Meeting',
      time: '3 days ago',
      preview: 'The IEP meeting is confirmed for October 30...'
    },
    {
      id: 'c5',
      name: 'IEP Team - Aarav Kumar',
      role: 'Group (5)',
      group: true,
      avatars: ['Rivera', 'Sarah', 'Meena'],
      time: '5 days ago',
      preview: "Dr. Rivera: I've uploaded the updated IEP draft..."
    }
  ];

  const messages = [
    {
      id: 'm1',
      sender: 'Mrs. Kumar',
      avatar: 'Priya',
      time: 'Yesterday, 2:30 PM',
      text: "Hi Dr. Rivera, thank you so much for the detailed progress report you sent last week. I've reviewed it with my husband and we're thrilled with Aarav's progress!",
      type: 'received',
      read: true
    },
    {
      id: 'm2',
      sender: 'Mrs. Kumar',
      time: 'Yesterday, 2:32 PM',
      text: "I have a quick question about the speech therapy schedule. Would it be possible to move the Tuesday session to Wednesday this week? We have a family appointment.",
      type: 'received',
      read: true
    },
    {
      id: 'm3',
      sender: 'You',
      time: 'Yesterday, 3:15 PM',
      text: "Hello Mrs. Kumar! I'm so glad to hear you're pleased with Aarav's progress. He's been working very hard and it's wonderful to see the results.",
      type: 'sent',
      status: 'delivered'
    },
    {
      id: 'm4',
      sender: 'You',
      time: 'Yesterday, 3:16 PM',
      text: "Regarding the schedule change, let me check with Dr. Mehta (speech therapist) and get back to you by tomorrow morning. I'll copy her on this thread so we can coordinate.",
      type: 'sent',
      status: 'delivered'
    },
    {
      id: 'm5',
      type: 'system',
      text: 'Dr. Sarah Mehta was added to the conversation',
      time: 'Yesterday, 3:16 PM'
    },
    {
      id: 'm6',
      sender: 'Dr. Sarah Mehta',
      avatar: 'Sarah',
      role: 'Speech Therapist',
      time: 'Yesterday, 4:00 PM',
      text: "Hi Mrs. Kumar! Wednesday afternoon works well for me. How about 2:00 PM instead of the usual 10:30 AM?",
      type: 'received',
      alt: true
    },
    {
      id: 'm7',
      sender: 'Mrs. Kumar',
      time: 'Yesterday, 4:15 PM',
      text: "That would be perfect! Thank you both so much for being flexible. 😊",
      type: 'received'
    },
    {
      id: 'm8',
      sender: 'You',
      time: 'Yesterday, 4:20 PM',
      text: "Great! I'll update the schedule. Wednesday, October 30 at 2:00 PM. See you then!",
      type: 'sent',
      attachment: {
        type: 'calendar',
        title: 'Session Rescheduled',
        date: 'Oct 30, 2:00 PM - 2:45 PM',
        sub: 'Speech Therapy Session'
      },
      status: 'delivered'
    },
    {
      id: 'm9',
      sender: 'Mrs. Kumar',
      avatar: 'Priya',
      time: '1 hour ago',
      text: "By the way, I captured a video of Aarav using full sentences at home yesterday. Thought you'd like to see it!",
      type: 'received',
      attachment: {
        type: 'file',
        name: 'Aarav_home_communication.mp4',
        size: '15.2 MB',
        thumb: 'https://images.unsplash.com/photo-1596443686812-2f45229eebc3?auto=format&fit=crop&w=400&q=80',
        duration: '1:24'
      }
    },
    {
      id: 'm10',
      sender: 'Mrs. Kumar',
      time: '45 minutes ago',
      text: "Also, I wanted to ask about the upcoming IEP meeting. Should I prepare anything specific?",
      type: 'received',
      unread: true
    }
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden animate-in fade-in duration-500">
      {/* Left Column - List */}
      <div className="w-full md:w-[350px] lg:w-[400px] flex flex-col bg-white border-r border-slate-200 shrink-0">
        <div className="p-6 border-b border-slate-100">
           <div className="flex items-center gap-2 mb-6">
              <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors">
                 <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Messages</h1>
              <button className="ml-auto p-2 bg-[#2563EB] text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all">
                 <Plus size={20} />
              </button>
           </div>
           
           <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-blue-400 transition-all"
              />
           </div>

           <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {['All (12)', 'Unread (3)', 'Flagged (2)'].map(f => (
                <button 
                  key={f} 
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeFilter === f ? 'bg-blue-50 text-[#2563EB]' : 'text-slate-400 hover:bg-slate-50'}`}
                >
                   {f}
                </button>
              ))}
           </div>
        </div>

        <div className="flex-1 overflow-y-auto">
           {conversations.map(conv => (
             <div 
               key={conv.id}
               onClick={() => setActiveConversation(conv.id)}
               className={`p-4 border-l-4 transition-all cursor-pointer hover:bg-slate-50 ${activeConversation === conv.id ? 'bg-blue-50/30 border-[#2563EB]' : 'border-transparent'}`}
             >
                <div className="flex gap-4">
                   <div className="relative">
                      {conv.group ? (
                        <div className="w-12 h-12 relative">
                           {conv.avatars?.map((av, i) => (
                             <div key={i} className={`absolute w-8 h-8 rounded-full border-2 border-white overflow-hidden ${i === 0 ? 'top-0 left-0 z-20' : i === 1 ? 'bottom-0 right-0 z-10' : 'top-0 right-0 opacity-0'}`}>
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${av}`} alt="User" className="w-full h-full object-cover" />
                             </div>
                           ))}
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden border border-slate-100">
                           {conv.school ? (
                             <div className="w-full h-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">SCH</div>
                           ) : (
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.avatar}`} alt="User" className="w-full h-full object-cover" />
                           )}
                        </div>
                      )}
                      {conv.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />}
                   </div>
                   
                   <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5">
                         <h3 className={`text-sm truncate ${conv.unread ? 'font-black text-slate-900' : 'font-bold text-slate-700'}`}>{conv.name}</h3>
                         <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap ml-2">{conv.time}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                         <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold uppercase">{conv.role}</span>
                         <span className="text-[10px] text-slate-400 truncate">Re: {conv.patient} {conv.context && `- ${conv.context}`}</span>
                      </div>
                      <p className={`text-xs truncate ${conv.unread ? 'font-bold text-slate-800' : 'text-slate-500'}`}>{conv.preview}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                         {conv.unread && <span className="px-1.5 py-0.5 bg-[#2563EB] text-white rounded-full text-[9px] font-bold min-w-[1.25rem] text-center">{conv.unread}</span>}
                         {conv.flagged && <span className="text-[10px]">🚩</span>}
                         {conv.attachment && <Paperclip size={12} className="text-slate-400" />}
                      </div>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Right Column - Thread */}
      <div className="flex-1 flex flex-col h-full bg-[#F8FAFC] relative">
         {/* Thread Header */}
         <header className="h-20 bg-white border-b border-slate-100 px-6 flex items-center justify-between shadow-sm z-20">
            <div className="flex items-center gap-4">
               <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-100">
                     <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" alt="Priya" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
               </div>
               <div>
                  <h2 className="text-lg font-black text-slate-900 leading-tight">Mrs. Priya Kumar</h2>
                  <div className="flex items-center gap-2">
                     <span className="text-xs font-medium text-slate-500">Parent of Aarav Kumar</span>
                     <button className="text-[10px] font-bold text-[#2563EB] hover:underline flex items-center gap-1">View Profile <ChevronRight size={10} /></button>
                  </div>
               </div>
            </div>
            <div className="flex items-center gap-2">
               <button className="p-2.5 text-slate-400 hover:text-[#2563EB] hover:bg-blue-50 rounded-xl transition-all"><Video size={20} /></button>
               <button className="p-2.5 text-slate-400 hover:text-[#2563EB] hover:bg-blue-50 rounded-xl transition-all"><Phone size={20} /></button>
               <div className="w-px h-6 bg-slate-200 mx-2" />
               <button onClick={() => setShowDetails(!showDetails)} className={`p-2.5 rounded-xl transition-all ${showDetails ? 'text-[#2563EB] bg-blue-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}><Info size={20} /></button>
               <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"><MoreVertical size={20} /></button>
            </div>
         </header>

         {/* Security Banner */}
         <div className="bg-blue-50 px-6 py-2 flex items-center justify-between text-blue-700 border-b border-blue-100">
            <div className="flex items-center gap-2 text-xs font-bold">
               <Lock size={12} /> End-to-end encrypted • HIPAA compliant
            </div>
            <button className="text-blue-400 hover:text-blue-600"><X size={14} /></button>
         </div>

         {/* Patient Context */}
         <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center justify-between shadow-sm z-10">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg border border-slate-100 overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rivera" alt="Aarav" className="w-full h-full object-cover" />
               </div>
               <div>
                  <p className="text-xs font-black text-slate-800">Aarav Kumar, 7 yrs</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ASD • #DAI-8291</p>
               </div>
            </div>
            <div className="flex gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
               <button className="hover:text-[#2563EB]">Journal</button>
               <span className="text-slate-200">|</span>
               <button className="hover:text-[#2563EB]">IEP</button>
               <span className="text-slate-200">|</span>
               <button className="hover:text-[#2563EB]">Reports</button>
            </div>
         </div>

         {/* Messages Area */}
         <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, i) => {
               const isMe = msg.type === 'sent';
               const isSystem = msg.type === 'system';
               
               if (isSystem) {
                  return (
                     <div key={msg.id} className="flex justify-center my-4">
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">{msg.text}</span>
                     </div>
                  );
               }

               return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
                     {!isMe && (
                        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-100 mr-3 mt-1 shrink-0">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.avatar}`} alt={msg.sender} className="w-full h-full object-cover" />
                        </div>
                     )}
                     <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                        {!isMe && msg.sender !== messages[i-1]?.sender && (
                           <span className="text-[10px] font-bold text-slate-400 ml-1 mb-1">{msg.sender} {msg.role && `• ${msg.role}`}</span>
                        )}
                        
                        <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed relative shadow-sm ${
                           isMe ? 'bg-[#2563EB] text-white rounded-tr-none' : 
                           msg.alt ? 'bg-green-50 text-slate-800 border border-green-100 rounded-tl-none' : 
                           msg.unread ? 'bg-white text-slate-800 border-2 border-blue-100 shadow-md rounded-tl-none' :
                           'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                        }`}>
                           {msg.unread && <span className="absolute -left-2 top-0 w-2 h-2 bg-[#2563EB] rounded-full" />}
                           {msg.text}
                           
                           {/* Attachments */}
                           {msg.attachment && (
                              <div className="mt-3 bg-black/5 rounded-xl p-3 flex items-center gap-3 hover:bg-black/10 transition-colors cursor-pointer">
                                 {msg.attachment.type === 'calendar' ? (
                                    <div className="w-10 h-10 bg-white rounded-lg flex flex-col items-center justify-center text-xs font-bold shadow-sm">
                                       <span className="text-red-500 uppercase text-[8px]">Oct</span>
                                       <span className="text-slate-900 text-sm">30</span>
                                    </div>
                                 ) : (
                                    <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white relative overflow-hidden group/thumb">
                                       {msg.attachment.thumb ? (
                                          <>
                                             <img src={msg.attachment.thumb} className="w-full h-full object-cover opacity-80" />
                                             <div className="absolute inset-0 flex items-center justify-center"><Video size={16} /></div>
                                          </>
                                       ) : <FileText size={20} />}
                                    </div>
                                 )}
                                 <div className="flex-1 min-w-0">
                                    <p className="font-bold text-xs truncate">{msg.attachment.title || msg.attachment.name}</p>
                                    <p className="text-[10px] opacity-70 truncate">{msg.attachment.sub || `${msg.attachment.size} • ${msg.attachment.duration || 'File'}`}</p>
                                 </div>
                                 <button className="p-1.5 bg-white/20 rounded-lg hover:bg-white/40"><Download size={14} /></button>
                              </div>
                           )}
                        </div>
                        
                        <div className={`flex items-center gap-1 mt-1 text-[10px] font-bold text-slate-300 ${isMe ? 'mr-1' : 'ml-1'}`}>
                           <span>{msg.time.split(', ')[1] || msg.time}</span>
                           {isMe && (
                              <span className={msg.read ? 'text-blue-500' : ''}>
                                 {msg.read ? '✓✓' : '✓'}
                              </span>
                           )}
                        </div>
                     </div>
                  </div>
               );
            })}
            
            {/* Typing Indicator */}
            <div className="flex items-center gap-3 ml-11">
               <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
               </div>
               <span className="text-[10px] font-bold text-slate-400">Mrs. Kumar is typing...</span>
            </div>
         </div>

         {/* Composer */}
         <div className="bg-white border-t border-slate-100 p-6 z-20">
            <div className="max-w-4xl mx-auto space-y-4">
               <div className="relative">
                  <textarea 
                     value={messageText}
                     onChange={(e) => setMessageText(e.target.value)}
                     placeholder="Type your message..." 
                     className="w-full min-h-[80px] p-4 pr-32 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-medium outline-none focus:border-blue-200 focus:bg-white transition-all resize-none"
                  />
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                     <button className="p-2 text-slate-400 hover:text-[#2563EB] hover:bg-blue-50 rounded-xl transition-all"><Paperclip size={18} /></button>
                     <button className="p-2 text-slate-400 hover:text-[#2563EB] hover:bg-blue-50 rounded-xl transition-all"><Image size={18} /></button>
                     <button className="p-2 text-slate-400 hover:text-[#2563EB] hover:bg-blue-50 rounded-xl transition-all"><Smile size={18} /></button>
                  </div>
               </div>
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all">
                        <Calendar size={12} /> Schedule
                     </button>
                     <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all">
                        <FileText size={12} /> Templates
                     </button>
                  </div>
                  <button className="px-8 h-12 bg-[#2563EB] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center gap-2">
                     Send Message <Send size={16} />
                  </button>
               </div>
            </div>
         </div>

         {/* Right Sidebar - Details */}
         {showDetails && (
            <div className="absolute top-0 right-0 bottom-0 w-[300px] bg-white border-l border-slate-200 z-30 flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl">
               <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-black text-slate-900">Details</h3>
                  <button onClick={() => setShowDetails(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
               </div>
               <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  <div className="space-y-4">
                     <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Participants (3)</h4>
                     <div className="space-y-3">
                        {[
                          { name: 'Dr. Jane Rivera', role: 'You' },
                          { name: 'Mrs. Priya Kumar', role: 'Parent' },
                          { name: 'Dr. Sarah Mehta', role: 'SLP' }
                        ].map((p, i) => (
                          <div key={i} className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                {p.name.charAt(0)}
                             </div>
                             <div>
                                <p className="text-xs font-bold text-slate-800">{p.name}</p>
                                <p className="text-[10px] text-slate-400">{p.role}</p>
                             </div>
                          </div>
                        ))}
                        <button className="text-[10px] font-bold text-[#2563EB] flex items-center gap-1 hover:underline">
                           <Plus size={12} /> Add Participant
                        </button>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Shared Files</h4>
                     <div className="space-y-3">
                        {[
                          { name: 'Aarav_video.mp4', type: 'Video' },
                          { name: 'Progress_Report.pdf', type: 'PDF' }
                        ].map((f, i) => (
                          <div key={i} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                             <div className="p-1.5 bg-white rounded shadow-sm text-slate-400"><FileText size={14} /></div>
                             <span className="text-xs font-bold text-slate-700 truncate flex-1">{f.name}</span>
                             <button className="text-slate-400 hover:text-[#2563EB]"><Download size={14} /></button>
                          </div>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-50">
                     <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-600">Notifications</span>
                        <div className="w-8 h-4 bg-[#2563EB] rounded-full relative cursor-pointer"><div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm" /></div>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-600">Pin Conversation</span>
                        <div className="w-8 h-4 bg-slate-200 rounded-full relative cursor-pointer"><div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm" /></div>
                     </div>
                  </div>
                  
                  <div className="pt-4">
                     <button className="w-full py-2 border border-red-100 text-red-500 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-50 transition-colors">Report Issue</button>
                  </div>
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default MessagesCenter;
