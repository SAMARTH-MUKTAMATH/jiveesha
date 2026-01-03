
import React, { useState } from 'react';
import { 
  X, Settings, Check, Bell, AlertTriangle, Calendar, 
  FileText, MessageSquare, Info, ChevronRight, User,
  Clock, CheckCircle2, ShieldAlert
} from 'lucide-react';

interface NotificationCenterProps {
  onClose: () => void;
  isOpen: boolean;
  onNavigate: (view: string, id?: string) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose, isOpen, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [showSettings, setShowSettings] = useState(false);

  const notifications = [
    {
      id: 'n1',
      type: 'URGENT',
      unread: true,
      title: 'Regression Alert - Aarav Kumar',
      message: 'Parent reports communication regression. Immediate assessment recommended.',
      time: '2 hours ago',
      icon: <ShieldAlert size={20} className="text-red-600" />,
      bg: 'bg-red-50',
      border: 'border-l-red-500',
      action: { label: 'Review Case', view: 'case-triage' }
    },
    {
      id: 'n2',
      type: 'MESSAGE',
      unread: true,
      title: 'New message from Mrs. Kumar',
      message: 'Question about this week\'s therapy schedule',
      preview: '"Hi Dr. Rivera, I wanted to ask if we can..."',
      time: '3 hours ago',
      icon: <MessageSquare size={20} className="text-blue-600" />,
      bg: 'bg-blue-50',
      border: 'border-l-blue-500',
      action: { label: 'Reply', view: 'messages' }
    },
    {
      id: 'n3',
      type: 'APPOINTMENT',
      unread: true,
      title: 'Appointment reminder',
      message: 'Speech therapy session with Aarav Kumar',
      time: 'Tomorrow at 10:30 AM',
      sub: '45 minutes',
      icon: <Calendar size={20} className="text-green-600" />,
      bg: 'bg-green-50',
      border: 'border-l-green-500',
      action: { label: 'View Details', view: 'consultation-manager' }
    },
    {
      id: 'n4',
      type: 'CONSENT',
      unread: false,
      title: 'Consent request approved',
      message: 'Mrs. Sharma granted access for Priya S.',
      time: 'Yesterday',
      icon: <User size={20} className="text-slate-400" />,
      bg: 'bg-white',
      border: 'border-l-transparent',
      action: { label: 'View Patient', view: 'profile' }
    },
    {
      id: 'n5',
      type: 'SYSTEM',
      unread: false,
      title: 'New feature available',
      message: 'Enhanced IEP builder with AI assistance is now live',
      time: '2 days ago',
      icon: <Info size={20} className="text-blue-400" />,
      bg: 'bg-white',
      border: 'border-l-transparent'
    },
    {
      id: 'n6',
      type: 'REPORT',
      unread: false,
      title: 'Report ready for download',
      message: 'Progress report for Arjun Patel is ready',
      time: '3 days ago',
      icon: <FileText size={20} className="text-orange-500" />,
      bg: 'bg-white',
      border: 'border-l-transparent',
      action: { label: 'Download', view: 'reports-library' }
    }
  ];

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[100] transition-opacity"
        onClick={onClose}
      />
      <div className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-white shadow-2xl z-[101] flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white z-10">
           <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-slate-900">Notifications</h2>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest">3 Unread</span>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
              <X size={20} />
           </button>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-white z-10">
           <div className="flex gap-2">
              {['All', 'Unread', 'Mentions'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                   {tab} {tab === 'All' && '(12)'} {tab === 'Unread' && '(3)'}
                </button>
              ))}
           </div>
           <div className="flex items-center gap-3">
              <button className="text-[10px] font-bold text-blue-600 hover:underline">Mark all read</button>
              <button onClick={() => setShowSettings(!showSettings)} className="text-slate-400 hover:text-slate-600"><Settings size={16} /></button>
           </div>
        </div>

        {/* Settings Panel Overlay */}
        {showSettings && (
           <div className="absolute top-[130px] left-0 right-0 bottom-0 bg-white z-20 animate-in slide-in-from-right duration-200 flex flex-col">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                 <h3 className="font-black text-slate-900">Notification Preferences</h3>
                 <button onClick={() => setShowSettings(false)}><X size={18} className="text-slate-400" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                 {['Critical Alerts', 'Messages', 'Appointments', 'Consent Requests', 'Reports & Documents'].map((setting, i) => (
                   <div key={i} className="flex items-center justify-between">
                      <div>
                         <p className="text-sm font-bold text-slate-800">{setting}</p>
                         <p className="text-[10px] text-slate-400 font-medium">Push & Email</p>
                      </div>
                      <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${i === 0 || i === 1 ? 'bg-blue-600' : 'bg-slate-200'}`}>
                         <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${i === 0 || i === 1 ? 'right-1' : 'left-1'}`} />
                      </div>
                   </div>
                ))}
                <div className="pt-6 border-t border-slate-100">
                   <div className="flex items-center justify-between">
                      <div>
                         <p className="text-sm font-bold text-slate-800">Quiet Hours</p>
                         <p className="text-[10px] text-slate-400 font-medium">10:00 PM - 8:00 AM</p>
                      </div>
                      <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer"><div className="absolute top-1 right-1 w-3 h-3 bg-white rounded-full shadow-sm" /></div>
                   </div>
                </div>
              </div>
              <div className="p-6 border-t border-slate-100">
                 <button onClick={() => setShowSettings(false)} className="w-full py-3 bg-[#2563EB] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all">Save Preferences</button>
              </div>
           </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8FAFC]">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2">Today</p>
           {notifications.slice(0, 3).map(n => (
             <div key={n.id} className={`p-4 rounded-2xl border-l-4 shadow-sm transition-all hover:shadow-md ${n.bg} ${n.border} relative group`}>
                {n.unread && <div className="absolute top-4 right-4 w-2 h-2 bg-blue-600 rounded-full" />}
                <div className="flex gap-4">
                   <div className="mt-1">{n.icon}</div>
                   <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                         <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${n.type === 'URGENT' ? 'bg-red-200 text-red-800' : 'bg-white text-slate-500 border border-slate-200'}`}>{n.type}</span>
                         <span className="text-[10px] font-bold text-slate-400">{n.time}</span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 mb-0.5">{n.title}</h4>
                      <p className="text-xs font-medium text-slate-600 leading-snug">{n.message}</p>
                      {n.preview && <p className="text-xs text-slate-500 italic mt-1.5 border-l-2 border-blue-200 pl-2">{n.preview}</p>}
                      {n.sub && <p className="text-[10px] font-bold text-slate-500 mt-1">{n.sub}</p>}
                      
                      {n.action && (
                        <div className="mt-3 flex gap-3">
                           <button 
                             onClick={() => {
                               onClose();
                               onNavigate(n.action.view);
                             }}
                             className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${n.type === 'URGENT' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'}`}
                           >
                              {n.action.label}
                           </button>
                           {n.type === 'APPOINTMENT' && <button className="text-[10px] font-bold text-slate-400 hover:text-slate-600">Reschedule</button>}
                           {n.type === 'URGENT' && <button className="text-[10px] font-bold text-slate-400 hover:text-slate-600">Dismiss</button>}
                        </div>
                      )}
                   </div>
                </div>
             </div>
           ))}

           <div className="flex items-center gap-4 py-4 opacity-50">
              <div className="h-px bg-slate-300 flex-1" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Earlier</span>
              <div className="h-px bg-slate-300 flex-1" />
           </div>

           {notifications.slice(3).map(n => (
             <div key={n.id} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group opacity-80 hover:opacity-100">
                <div className="flex gap-4">
                   <div className="mt-1 grayscale opacity-50">{n.icon}</div>
                   <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                         <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-slate-50 text-slate-400 border border-slate-100">{n.type}</span>
                         <span className="text-[10px] font-bold text-slate-300">{n.time}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-700 mb-0.5">{n.title}</h4>
                      <p className="text-xs text-slate-500">{n.message}</p>
                      
                      {n.action && (
                        <button 
                          onClick={() => {
                             onClose();
                             onNavigate(n.action.view);
                          }}
                          className="mt-2 text-[10px] font-black text-slate-400 hover:text-[#2563EB] uppercase tracking-widest flex items-center gap-1"
                        >
                           {n.action.label} <ChevronRight size={10} />
                        </button>
                      )}
                   </div>
                </div>
             </div>
           ))}

           <div className="py-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-300 mb-3">
                 <Bell size={24} />
              </div>
              <p className="text-xs font-bold text-slate-400">You're all caught up!</p>
           </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white z-10 text-center">
           <button className="text-[10px] font-black text-[#2563EB] uppercase tracking-widest hover:underline">View All Notifications</button>
        </div>
      </div>
    </>
  );
};

export default NotificationCenter;
