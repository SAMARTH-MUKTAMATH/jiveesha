
import React, { useState } from 'react';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, Calendar, Clock, 
  MapPin, Video, User, Plus, Filter, MoreVertical, 
  CheckCircle2, AlertTriangle, X, Download, RefreshCw, 
  Search, ChevronDown, Monitor, Home, FileText,
  AlertCircle, MessageSquare, Check
} from 'lucide-react';

interface ScheduleCalendarProps {
  onBack: () => void;
  onNavigate: (view: string, id?: string) => void;
}

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({ onBack, onNavigate }) => {
  const [view, setView] = useState<'day' | 'week' | 'month' | 'agenda'>('week');
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);

  const appointments = [
    {
      id: 'apt1',
      day: 'Mon',
      date: 21,
      startTime: '10:00 AM',
      endTime: '10:45 AM',
      patient: 'Aarav Kumar',
      type: 'Speech Therapy',
      format: 'In-Person',
      location: 'Room 3',
      status: 'Confirmed',
      color: 'bg-green-50 border-l-green-500',
      textColor: 'text-green-700',
      startRow: 3, 
      span: 1
    },
    {
      id: 'apt2',
      day: 'Tue',
      date: 22,
      startTime: '10:30 AM',
      endTime: '11:15 AM',
      patient: 'Priya Sharma',
      type: 'Parent Consultation',
      format: 'Virtual',
      platform: 'Zoom',
      status: 'Pending',
      color: 'bg-blue-50 border-l-blue-500',
      textColor: 'text-blue-700',
      startRow: 3.5,
      span: 1
    },
    {
      id: 'apt3',
      day: 'Wed',
      date: 23,
      startTime: '02:00 PM',
      endTime: '03:00 PM',
      patient: 'Arjun Patel',
      type: 'ADHD Assessment',
      format: 'In-Person',
      location: 'Assessment Room',
      status: 'Confirmed',
      color: 'bg-purple-50 border-l-purple-500',
      textColor: 'text-purple-700',
      startRow: 7,
      span: 2
    },
    {
      id: 'apt4',
      day: 'Thu',
      date: 24,
      startTime: '10:30 AM',
      endTime: '11:15 AM',
      patient: 'Aarav Kumar',
      type: 'Speech Therapy',
      format: 'In-Person',
      location: 'Room 3',
      status: 'Confirmed',
      urgent: true,
      color: 'bg-green-50 border-l-green-500 ring-2 ring-green-200',
      textColor: 'text-green-700',
      startRow: 3.5,
      span: 1
    },
    {
      id: 'apt5',
      day: 'Thu',
      date: 24,
      startTime: '01:00 PM',
      endTime: '02:00 PM',
      patient: 'Maya Singh',
      type: 'IEP Annual Review',
      format: 'In-Person',
      location: 'Conf Room',
      participants: '+4',
      status: 'Confirmed',
      color: 'bg-orange-50 border-l-orange-500',
      textColor: 'text-orange-700',
      startRow: 6,
      span: 2
    },
    {
      id: 'apt6',
      day: 'Fri',
      date: 25,
      startTime: '11:00 AM',
      endTime: '11:45 AM',
      patient: 'Rohan Desai',
      type: 'Follow-up Session',
      status: 'Cancelled',
      color: 'bg-slate-100 border-l-slate-400 opacity-60',
      textColor: 'text-slate-500 line-through',
      startRow: 4,
      span: 1
    }
  ];

  const timeSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
  ];

  const weekDays = [
    { day: 'Mon', date: 21 },
    { day: 'Tue', date: 22 },
    { day: 'Wed', date: 23 },
    { day: 'Thu', date: 24, today: true },
    { day: 'Fri', date: 25 },
    { day: 'Sat', date: 26 },
    { day: 'Sun', date: 27 }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 animate-in fade-in duration-500">
      {/* Demo Banner */}
      <div className="w-full bg-amber-50 border-b border-amber-100 py-2.5 px-6 flex items-center justify-center gap-3 sticky top-0 z-50">
        <AlertTriangle size={16} className="text-amber-600" />
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-[#2563EB] hover:text-blue-700 transition-colors mb-6">
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Schedule & Calendar</h1>
            <p className="text-slate-500 font-medium mt-1">Manage appointments and view your schedule</p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-3 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:border-slate-300 transition-all flex items-center gap-2">
              <Download size={18} /> Export Schedule
            </button>
            <button 
              onClick={() => onNavigate('appointment-booking')}
              className="px-6 py-3 bg-[#2563EB] text-white rounded-xl text-sm font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <Plus size={20} /> New Appointment
            </button>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 mb-8 shadow-sm flex flex-col xl:flex-row items-center justify-between gap-6">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            {['Day', 'Week', 'Month', 'Agenda'].map((v) => (
              <button 
                key={v}
                onClick={() => setView(v.toLowerCase() as any)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  view === v.toLowerCase() ? 'bg-white text-[#2563EB] shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600"><ChevronLeft size={24} /></button>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">October 21 - 27, 2024</h2>
            <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600"><ChevronRight size={24} /></button>
            <button className="text-xs font-black text-[#2563EB] uppercase tracking-widest border border-blue-100 px-4 py-2 rounded-lg hover:bg-blue-50">Today</button>
          </div>

          <div className="flex items-center gap-4 border-l border-slate-100 pl-6">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Show:</span>
             <div className="flex gap-3">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                   <div className="w-3 h-3 rounded-full bg-green-500" /> In-Person
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                   <div className="w-3 h-3 rounded-full bg-blue-500" /> Virtual
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                   <div className="w-3 h-3 rounded-full bg-purple-500" /> Assess
                </label>
             </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 h-full">
           {/* Main Calendar Grid */}
           <div className="flex-1 bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[800px]">
              {/* Days Header */}
              <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-slate-100">
                 <div className="p-4 border-r border-slate-50"></div>
                 {weekDays.map(d => (
                   <div key={d.day} className={`p-4 text-center border-r border-slate-50 last:border-0 ${d.today ? 'bg-blue-50/30' : ''}`}>
                      <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${d.today ? 'text-[#2563EB]' : 'text-slate-400'}`}>{d.day}</p>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto text-lg font-black ${d.today ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-200' : 'text-slate-700'}`}>
                         {d.date}
                      </div>
                   </div>
                 ))}
              </div>

              {/* Time Grid */}
              <div className="flex-1 overflow-y-auto relative">
                 {/* Grid Lines */}
                 <div className="absolute inset-0 grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr_1fr]">
                    <div className="border-r border-slate-50 bg-slate-50/30"></div>
                    {weekDays.map(d => (
                       <div key={d.day} className={`border-r border-slate-50 last:border-0 ${d.today ? 'bg-blue-50/10' : ''}`}>
                          {/* Current Time Indicator for Today */}
                          {d.today && (
                             <div className="absolute left-0 right-0 top-[340px] border-t-2 border-red-400 z-20 flex items-center pointer-events-none">
                                <div className="absolute -left-1.5 -top-1.5 w-3 h-3 bg-red-500 rounded-full" />
                                <span className="ml-2 text-[9px] font-black text-red-500 bg-white px-1 rounded">10:24 AM</span>
                             </div>
                          )}
                       </div>
                    ))}
                 </div>

                 {/* Time Labels & Rows */}
                 {timeSlots.map((time, i) => (
                    <div key={time} className="grid grid-cols-[80px_1fr] h-24 border-b border-slate-50 relative z-10 pointer-events-none">
                       <div className="p-2 text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider -mt-2.5 pr-4">
                          {time}
                       </div>
                       <div className="w-full"></div> {/* Placeholder for appointments */}
                    </div>
                 ))}

                 {/* Appointments Overlay */}
                 <div className="absolute inset-0 grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] pointer-events-none">
                    <div></div> {/* Spacer for time col */}
                    {weekDays.map(d => (
                       <div key={d.day} className="relative h-full pointer-events-auto">
                          {appointments.filter(a => a.day === d.day).map(apt => (
                             <div 
                               key={apt.id}
                               onClick={() => setSelectedAppointment(apt)}
                               className={`absolute left-1 right-1 rounded-xl border-l-4 p-3 shadow-sm hover:shadow-md transition-all cursor-pointer group ${apt.color} ${apt.urgent ? 'animate-pulse-slow ring-2 ring-green-200' : ''}`}
                               style={{ 
                                 top: `${(apt.startRow - 1) * 96 + 24}px`, // 96px per hour + offset
                                 height: `${apt.span * 96 - 8}px`
                               }}
                             >
                                <div className="flex justify-between items-start mb-1">
                                   <span className={`text-[10px] font-black ${apt.textColor}`}>{apt.startTime}</span>
                                   {apt.format === 'Virtual' && <Video size={12} className={apt.textColor} />}
                                </div>
                                <h4 className="text-xs font-black text-slate-900 leading-tight mb-0.5">{apt.patient}</h4>
                                <p className={`text-[10px] font-bold ${apt.textColor} opacity-80 truncate`}>{apt.type}</p>
                                {apt.location && <p className="text-[9px] font-medium text-slate-500 mt-1 flex items-center gap-1"><MapPin size={8} /> {apt.location}</p>}
                                {apt.participants && <div className="absolute bottom-2 right-2 text-[9px] font-black text-slate-400 bg-white/50 px-1.5 rounded">{apt.participants}</div>}
                             </div>
                          ))}
                          
                          {/* Blocked Lunch (Wed) */}
                          {d.day === 'Wed' && (
                             <div className="absolute left-1 right-1 top-[396px] h-[84px] bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] bg-slate-100/50 rounded-xl border-2 border-slate-200 border-dashed flex items-center justify-center opacity-60">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white/80 px-2 py-1 rounded">🍽 Lunch Break</span>
                             </div>
                          )}
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Right Sidebar */}
           <aside className="w-full lg:w-[320px] shrink-0 space-y-8">
              
              {/* Today Summary */}
              <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Today's Schedule</h3>
                 <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl border border-green-100">
                       <div className="text-center">
                          <p className="text-xs font-black text-green-700">10:30</p>
                          <p className="text-[10px] font-bold text-green-600 uppercase">AM</p>
                       </div>
                       <div className="flex-1 border-l border-green-200 pl-4">
                          <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-0.5">Happening Now</p>
                          <p className="text-sm font-bold text-slate-800">Aarav Kumar</p>
                          <p className="text-xs text-slate-500">Speech Therapy • Room 3</p>
                       </div>
                       <button className="p-2 bg-white rounded-xl text-green-600 shadow-sm hover:scale-105 transition-transform" onClick={() => onNavigate('consultation-manager')}>
                          <Monitor size={16} />
                       </button>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl opacity-60">
                       <div className="text-center w-[30px]">
                          <p className="text-xs font-black text-slate-400">01:00</p>
                          <p className="text-[10px] font-bold text-slate-300 uppercase">PM</p>
                       </div>
                       <div className="flex-1 border-l border-slate-100 pl-4">
                          <p className="text-sm font-bold text-slate-700">Maya Singh</p>
                          <p className="text-xs text-slate-400">IEP Meeting • Conf Room</p>
                       </div>
                    </div>
                 </div>
                 <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between text-xs font-bold text-slate-500">
                    <span>4 Appointments</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-green-600">3 Confirmed</span>
                 </div>
              </div>

              {/* Mini Calendar */}
              <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-slate-800">October 2024</h3>
                    <div className="flex gap-2">
                       <button className="p-1 hover:bg-slate-50 rounded"><ChevronLeft size={16} className="text-slate-400" /></button>
                       <button className="p-1 hover:bg-slate-50 rounded"><ChevronRight size={16} className="text-slate-400" /></button>
                    </div>
                 </div>
                 <div className="grid grid-cols-7 text-center gap-y-3 text-xs">
                    {['S','M','T','W','T','F','S'].map(d => <span key={d} className="text-[10px] font-bold text-slate-300">{d}</span>)}
                    {[...Array(31)].map((_, i) => (
                       <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center relative cursor-pointer hover:bg-slate-50 ${i+1 === 24 ? 'bg-[#2563EB] text-white font-bold shadow-md' : 'text-slate-600'}`}>
                          {i+1}
                          {[21,22,23,24,25].includes(i+1) && <div className={`absolute bottom-1 w-1 h-1 rounded-full ${i+1 === 24 ? 'bg-white' : 'bg-green-500'}`} />}
                       </div>
                    ))}
                 </div>
              </div>

              {/* Pending Actions */}
              <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Pending Actions</h3>
                 <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
                       <div className="p-1.5 bg-white rounded-lg text-orange-500 shadow-sm"><AlertCircle size={14} /></div>
                       <div className="flex-1">
                          <p className="text-xs font-bold text-slate-800">Confirm: Priya S.</p>
                          <p className="text-[10px] text-orange-600 font-medium">Tue, Oct 29 • Awaiting Parent</p>
                       </div>
                       <button className="text-[10px] font-black text-slate-400 hover:text-slate-600">Remind</button>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                       <div className="p-1.5 bg-white rounded-lg text-red-500 shadow-sm"><X size={14} /></div>
                       <div className="flex-1">
                          <p className="text-xs font-bold text-slate-800">Cancelled: Rohan D.</p>
                          <p className="text-[10px] text-red-600 font-medium">Fri, Oct 25 • Parent Request</p>
                       </div>
                       <button className="text-[10px] font-black text-slate-400 hover:text-slate-600">Details</button>
                    </div>
                 </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                 {[
                   { l: 'View Availability', i: <Clock size={16} /> },
                   { l: 'Send Reminders', i: <MessageSquare size={16} /> },
                   { l: 'Calendar Settings', i: <Monitor size={16} /> }
                 ].map((a, i) => (
                   <button key={i} className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all text-left group">
                      <div className="flex items-center gap-3">
                         <span className="text-slate-300 group-hover:text-[#2563EB] transition-colors">{a.i}</span>
                         <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 uppercase tracking-wide">{a.l}</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-200 group-hover:text-[#2563EB]" />
                   </button>
                 ))}
              </div>

           </aside>
        </div>
      </div>

      {/* APPOINTMENT DETAIL MODAL */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                 <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Appointment Details</h2>
                    <div className="flex items-center gap-2 mt-1">
                       <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${selectedAppointment.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                          {selectedAppointment.status}
                       </span>
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedAppointment.day}, Oct {selectedAppointment.date}</span>
                    </div>
                 </div>
                 <button onClick={() => setSelectedAppointment(null)} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-600 shadow-sm transition-colors"><X size={20} /></button>
              </div>

              <div className="p-8 space-y-8">
                 <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-[1.5rem] border-4 border-slate-50 shadow-lg overflow-hidden">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedAppointment.patient}`} alt={selectedAppointment.patient} className="w-full h-full object-cover" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-900">{selectedAppointment.patient}</h3>
                       <div className="flex gap-2 mt-1">
                          <span className="text-xs font-bold text-slate-500">7 years • #DAI-8291</span>
                       </div>
                       <button onClick={() => { setSelectedAppointment(null); onNavigate('profile', 'aarav'); }} className="text-[10px] font-black text-[#2563EB] uppercase tracking-widest hover:underline mt-2 flex items-center gap-1">
                          View Profile <ChevronRight size={10} />
                       </button>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Time</p>
                       <p className="text-sm font-bold text-slate-800">{selectedAppointment.startTime} - {selectedAppointment.endTime}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Type</p>
                       <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                          {selectedAppointment.format === 'Virtual' ? <Video size={14} className="text-blue-500" /> : <MapPin size={14} className="text-green-500" />} 
                          {selectedAppointment.type}
                       </p>
                    </div>
                 </div>

                 {selectedAppointment.location && (
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3">
                       <MapPin size={20} className="text-blue-600" />
                       <div>
                          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Location</p>
                          <p className="text-sm font-bold text-blue-900">{selectedAppointment.location}</p>
                       </div>
                    </div>
                 )}

                 {selectedAppointment.platform && (
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3">
                       <Video size={20} className="text-blue-600" />
                       <div className="flex-1">
                          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Platform</p>
                          <p className="text-sm font-bold text-blue-900">{selectedAppointment.platform}</p>
                       </div>
                       <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg">Join Meeting</button>
                    </div>
                 )}

                 <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Related Records</p>
                    <div className="flex flex-wrap gap-2">
                       <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-50 hover:text-[#2563EB] transition-colors">View Intervention Plan</button>
                       <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-50 hover:text-[#2563EB] transition-colors">IEP Goals</button>
                       <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-50 hover:text-[#2563EB] transition-colors">Previous Session Note</button>
                    </div>
                 </div>
              </div>

              <div className="p-8 border-t border-slate-100 bg-slate-50 flex gap-4">
                 <button className="flex-1 h-12 border-2 border-red-100 text-red-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-50 transition-colors">Cancel Appt</button>
                 <button onClick={() => onNavigate('appointment-reschedule')} className="flex-1 h-12 border-2 border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:border-slate-300 transition-colors">Reschedule</button>
                 <button 
                   onClick={() => { setSelectedAppointment(null); onNavigate('consultation-manager'); }}
                   className="flex-[1.5] h-12 bg-[#2563EB] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
                 >
                   Start Session
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleCalendar;
