
import React, { useState, useEffect } from 'react';
import {
   ArrowLeft, ChevronLeft, ChevronRight, Calendar, Clock,
   MapPin, Video, User, Plus, Filter, MoreVertical,
   CheckCircle2, AlertTriangle, X, Download, RefreshCw,
   Search, ChevronDown, Monitor, Home, FileText,
   AlertCircle, MessageSquare, Check
} from 'lucide-react';
import DatePickerModal from './DatePickerModal';
import { apiClient } from '../services/api';

interface ScheduleCalendarProps {
   onBack: () => void;
   onNavigate: (view: string, id?: string) => void;
}

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({ onBack, onNavigate }) => {
   const [view, setView] = useState<'day' | 'week' | 'month'>('week');
   const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
   const [currentDate, setCurrentDate] = useState(new Date());
   const [appointments, setAppointments] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [hoverPosition, setHoverPosition] = useState<number | null>(null);
   const [showDatePicker, setShowDatePicker] = useState(false);
   const [appointmentFilter, setAppointmentFilter] = useState<'all' | 'scheduled' | 'completed' | 'upcoming'>('all');

   // Helper to generate week days based on current date (starting Sunday)
   const getWeekDays = (date: Date) => {
      const startOfWeek = new Date(date);
      const day = startOfWeek.getDay(); // 0 = Sunday, 6 = Saturday
      // Set to Sunday of the current week
      startOfWeek.setDate(startOfWeek.getDate() - day);

      return Array.from({ length: 7 }).map((_, i) => {
         const d = new Date(startOfWeek);
         d.setDate(startOfWeek.getDate() + i);
         return {
            day: d.toLocaleDateString('en-US', { weekday: 'short' }),
            date: d.getDate(),
            fullDate: d,
            today: new Date().toDateString() === d.toDateString()
         };
      });
   };

   const weekDays = getWeekDays(currentDate);
   const weekStart = weekDays[0].fullDate;
   const weekEnd = weekDays[6].fullDate;
   const monthLabel = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

   // Calculate week number of the month
   const getWeekOfMonth = (date: Date) => {
      const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const firstDayOfWeek = firstDayOfMonth.getDay();
      const offsetDate = date.getDate() + firstDayOfWeek - 1;
      return Math.ceil(offsetDate / 7);
   };

   const weekNumber = getWeekOfMonth(currentDate);
   const weekRangeLabel = `${monthLabel} • Week ${weekNumber}`;
   const dayLabel = currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

   // Get days to display based on view
   const displayDays = view === 'day' ? [weekDays.find(d => d.fullDate.toDateString() === currentDate.toDateString()) || weekDays[0]] : weekDays;
   const gridCols = view === 'day' ? 'grid-cols-[80px_1fr]' : 'grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr_1fr]';

   // Get date label based on view
   const getDateLabel = () => {
      if (view === 'day') return dayLabel;
      if (view === 'week') return weekRangeLabel;
      if (view === 'month') return monthLabel;
      return weekRangeLabel;
   };

   const getHoverTime = (y: number) => {
      const totalMinutes = (y / 96) * 60;
      const startMinutes = 8 * 60; // 8:00 AM
      const timeInMinutes = startMinutes + totalMinutes;

      const h = Math.floor(timeInMinutes / 60);
      const m = Math.floor(timeInMinutes % 60);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const formattedH = h > 12 ? h - 12 : (h === 0 || h === 12 ? 12 : h);
      const formattedM = m.toString().padStart(2, '0');

      return `${formattedH}:${formattedM} ${ampm}`;
   }

   // Fetch appointments
   useEffect(() => {
      const fetchAppointments = async () => {
         try {
            setLoading(true);
            const start = weekStart.toISOString().split('T')[0];
            const end = weekEnd.toISOString().split('T')[0];

            // Assuming apiClient exists and is imported (it is imported in line 8 but assumes mock data in original file?)
            // I need to import apiClient properly if not present. Original file line 8: import { apiClient } from '../services/api';

            // Check if apiClient.getCalendarAppointments exists. If not, use getTodaySchedule as fallback or empty.
            // But I confirmed api.ts has it.

            const response = await apiClient.getCalendarAppointments(start, end);

            if (response.success && response.data) {
               // Handle both array and object responses
               const appointmentsData = Array.isArray(response.data) ? response.data : (response.data.appointments || []);

               const mapped = appointmentsData.map((apt: any) => {
                  const aptDate = new Date(apt.date);
                  const startHours = new Date(apt.date + 'T' + apt.startTime); // Approximate parsing or use provided ISO
                  // Better parsing:
                  const [h, m] = apt.startTime.split(':').map(Number);

                  // Simple logic for row calculation
                  // 96px per hour. 8 AM start.
                  // Row 1 = 8 AM.
                  // Start relative hour = h - 8 + (m/60)
                  const rowStart = (h - 8) + (m / 60) + 1;

                  // Duration
                  const [endH, endM] = apt.endTime.split(':').map(Number);
                  const durationHours = (endH - h) + ((endM - m) / 60);

                  return {
                     id: apt.id,
                     day: aptDate.toLocaleDateString('en-US', { weekday: 'short' }),
                     date: aptDate.getDate(),
                     startTime: formatTime(apt.startTime),
                     endTime: formatTime(apt.endTime),
                     patient: apt.patientName,
                     type: apt.type,
                     format: apt.format,
                     location: apt.location,
                     status: apt.status,
                     color: getStatusColor(apt.status),
                     textColor: getStatusTextColor(apt.status),
                     startRow: rowStart,
                     span: durationHours,
                     ...apt
                  };
               });
               setAppointments(mapped);
            }
         } catch (error) {
            console.error("Failed to fetch schedule", error);
            // Fallback to empty
            setAppointments([]);
         } finally {
            setLoading(false);
         }
      };

      fetchAppointments();
   }, [currentDate]);

   const formatTime = (timeStr: string) => {
      // timeStr is HH:mm
      if (!timeStr) return '';
      const [h, m] = timeStr.split(':');
      const hour = parseInt(h);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${m} ${ampm}`;
   }

   const getStatusColor = (status: string) => {
      switch (status?.toLowerCase()) {
         case 'confirmed': return 'bg-green-50 border-l-green-500';
         case 'pending': return 'bg-blue-50 border-l-blue-500';
         case 'cancelled': return 'bg-slate-100 border-l-slate-400 opacity-60';
         default: return 'bg-purple-50 border-l-purple-500';
      }
   }

   const getStatusTextColor = (status: string) => {
      switch (status?.toLowerCase()) {
         case 'confirmed': return 'text-green-700';
         case 'pending': return 'text-blue-700';
         case 'cancelled': return 'text-slate-500 line-through';
         default: return 'text-purple-700';
      }
   }

   const handlePrev = () => {
      const newDate = new Date(currentDate);
      if (view === 'day') {
         newDate.setDate(newDate.getDate() - 1);
      } else if (view === 'week') {
         newDate.setDate(newDate.getDate() - 7);
      } else if (view === 'month') {
         newDate.setMonth(newDate.getMonth() - 1);
      }
      setCurrentDate(newDate);
   }

   const handleNext = () => {
      const newDate = new Date(currentDate);
      if (view === 'day') {
         newDate.setDate(newDate.getDate() + 1);
      } else if (view === 'week') {
         newDate.setDate(newDate.getDate() + 7);
      } else if (view === 'month') {
         newDate.setMonth(newDate.getMonth() + 1);
      }
      setCurrentDate(newDate);
   }

   const timeSlots = [
      '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
      '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
   ];

   return (
      <div className="min-h-screen bg-[#F8FAFC] pb-20 animate-in fade-in duration-500">
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
                  {['Day', 'Week', 'Month'].map((v) => (
                     <button
                        key={v}
                        onClick={() => setView(v.toLowerCase() as any)}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === v.toLowerCase() ? 'bg-white text-[#2563EB] shadow-sm' : 'text-slate-400 hover:text-slate-600'
                           }`}
                     >
                        {v}
                     </button>
                  ))}
               </div>

               <div className="flex items-center gap-6">
                  <button onClick={handlePrev} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600"><ChevronLeft size={24} /></button>
                  <div className="flex items-center gap-3">
                     <h2 className="text-xl font-black text-slate-800 tracking-tight">{getDateLabel()}</h2>
                     <button
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        className="p-2 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-[#2563EB] transition-colors relative"
                        title="Select date"
                     >
                        <Calendar size={20} />
                     </button>
                  </div>
                  <button onClick={handleNext} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600"><ChevronRight size={24} /></button>
                  <button
                     onClick={() => {
                        setCurrentDate(new Date());
                        setView('day');
                     }}
                     className="text-xs font-black text-[#2563EB] uppercase tracking-widest border border-blue-100 px-4 py-2 rounded-lg hover:bg-blue-50"
                  >
                     Today
                  </button>
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
                  <div className={`grid ${gridCols} border-b border-slate-100`}>
                     <div className="p-4 border-r border-slate-50"></div>
                     {displayDays.map(d => (
                        <div key={d.day + d.date} className={`p-4 text-center border-r border-slate-50 last:border-0 ${d.today ? 'bg-blue-50/30' : ''}`}>
                           <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${d.today ? 'text-[#2563EB]' : 'text-slate-400'}`}>{d.day}</p>
                           <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto text-lg font-black ${d.today ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-200' : 'text-slate-700'}`}>
                              {d.date}
                           </div>
                        </div>
                     ))}
                  </div>

                  {/* Time Grid */}
                  <div
                     className="flex-1 overflow-y-auto relative"
                     onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const scrollTop = e.currentTarget.scrollTop;
                        const y = e.clientY - rect.top + scrollTop;
                        setHoverPosition(y);
                     }}
                     onMouseLeave={() => setHoverPosition(null)}
                  >
                     {/* Hover Line */}
                     {hoverPosition !== null && (
                        <div
                           className="absolute left-0 right-0 border-t-2 border-blue-400 border-dashed z-30 pointer-events-none flex items-center"
                           style={{ top: hoverPosition }}
                        >
                           <div className="absolute -left-1 w-2 h-2 bg-blue-500 rounded-full" />
                           <span className="ml-1 text-[10px] font-black text-white bg-blue-500 px-1.5 py-0.5 rounded shadow-sm">
                              {getHoverTime(hoverPosition)}
                           </span>
                        </div>
                     )}

                     {/* Grid Lines */}
                     <div className={`absolute inset-0 grid ${gridCols}`}>
                        <div className="border-r border-slate-50 bg-slate-50/30"></div>
                        {displayDays.map(d => (
                           <div key={d.day + d.date} className={`border-r border-slate-50 last:border-0 ${d.today ? 'bg-blue-50/10' : ''}`}>
                              {/* Current Time Indicator for Today */}
                              {d.today && (() => {
                                 const now = new Date();
                                 const currentHour = now.getHours();
                                 if (currentHour < 8 || currentHour > 18) return null; // Hide if out of view (8am-6pm)

                                 const topPosition = ((currentHour - 8) * 96) + ((now.getMinutes() / 60) * 96);

                                 return (
                                    <div className="absolute left-0 right-0 border-t-2 border-red-400 z-20 flex items-center pointer-events-none" style={{ top: `${topPosition}px` }}>
                                       <div className="absolute -left-1.5 -top-1.5 w-3 h-3 bg-red-500 rounded-full" />
                                       <span className="ml-2 text-[9px] font-black text-red-500 bg-white px-1 rounded shadow-sm">
                                          {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                       </span>
                                    </div>
                                 );
                              })()}
                           </div>
                        ))}
                     </div>

                     {/* Time Labels & Rows */}
                     {timeSlots.map((time, i) => (
                        <div key={time} className="grid grid-cols-[80px_1fr] h-24 border-b border-slate-50 relative z-10 pointer-events-none">
                           <div className="p-2 text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider -mt-2.5 pr-4">
                              {time}
                           </div>
                           <div className="w-full"></div>
                        </div>
                     ))}

                     {/* Appointments Overlay */}
                     <div className={`absolute inset-0 grid ${gridCols} pointer-events-none`}>
                        <div></div> {/* Spacer for time col */}
                        {displayDays.map(d => (
                           <div key={d.day + d.date} className="relative h-full pointer-events-auto">
                              {appointments.filter(a => {
                                 // Compare full dates to handle navigation correctly
                                 return a.date === d.date && new Date(a.fullDate || a.date).getMonth() === d.fullDate.getMonth();
                              }).map(apt => (
                                 <div
                                    key={apt.id}
                                    onClick={() => setSelectedAppointment(apt)}
                                    className={`absolute left-1 right-1 rounded-xl border-l-4 p-3 shadow-sm hover:shadow-md transition-all cursor-pointer group ${apt.color} ${apt.urgent ? 'animate-pulse-slow ring-2 ring-green-200' : ''}`}
                                    style={{
                                       top: `${(apt.startRow - 1) * 96 + 24}px`,
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
                              {d.day === 'Wed' && view === 'week' && (
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
                        {(() => {
                           const todayDay = weekDays.find(wd => wd.today);
                           const todaysAppointments = todayDay ? appointments.filter(a => a.date === todayDay.date) : [];

                           if (todaysAppointments.length > 0) {
                              return todaysAppointments.map((apt, i) => (
                                 <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border ${apt.status === 'Confirmed' ? 'bg-green-50 border-green-100' : 'bg-white border-slate-100'}`}>
                                    <div className="text-center">
                                       <p className={`text-xs font-black ${apt.status === 'Confirmed' ? 'text-green-700' : 'text-slate-400'}`}>{apt.startTime.split(' ')[0]}</p>
                                       <p className={`text-[10px] font-bold uppercase ${apt.status === 'Confirmed' ? 'text-green-600' : 'text-slate-300'}`}>{apt.startTime.split(' ')[1]}</p>
                                    </div>
                                    <div className={`flex-1 border-l pl-4 ${apt.status === 'Confirmed' ? 'border-green-200' : 'border-slate-100'}`}>
                                       {/* "Happening Now" logic: Check if current time is within apt.startTime and apt.endTime */}
                                       {(() => {
                                          const now = new Date();
                                          const [startH, startM] = apt.startTime.split(' ')[0].split(':').map(Number);
                                          const [endH, endM] = apt.endTime.split(' ')[0].split(':').map(Number);
                                          const startAmpm = apt.startTime.split(' ')[1];
                                          const endAmpm = apt.endTime.split(' ')[1];

                                          let aptStartHour24 = startH;
                                          if (startAmpm === 'PM' && startH !== 12) aptStartHour24 += 12;
                                          if (startAmpm === 'AM' && startH === 12) aptStartHour24 = 0;

                                          let aptEndHour24 = endH;
                                          if (endAmpm === 'PM' && endH !== 12) aptEndHour24 += 12;
                                          if (endAmpm === 'AM' && endH === 12) aptEndHour24 = 0;

                                          const aptStartTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), aptStartHour24, startM);
                                          const aptEndTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), aptEndHour24, endM);

                                          if (now >= aptStartTime && now <= aptEndTime) {
                                             return <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-0.5">Happening Now</p>;
                                          }
                                          return null;
                                       })()}
                                       <p className="text-sm font-bold text-slate-800">{apt.patient}</p>
                                       <p className="text-xs text-slate-500">{apt.type}</p>
                                    </div>
                                    <button className="p-2 bg-white rounded-xl text-green-600 shadow-sm hover:scale-105 transition-transform" onClick={() => onNavigate('consultation-manager')}>
                                       <Monitor size={16} />
                                    </button>
                                 </div>
                              ));
                           } else {
                              return (
                                 <div className="text-center py-6 text-slate-400 text-sm italic">
                                    No appointments today
                                 </div>
                              );
                           }
                        })()}
                     </div>
                     <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between text-xs font-bold text-slate-500">
                        <span>{appointments.length} Weekly</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-green-600">Active</span>
                     </div>
                  </div>


                  {/* Pending Actions */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                     <h3 className="text-xs font-bold text-slate-500 mb-3">Pending Actions</h3>
                     <div className="text-center py-6 bg-slate-50 rounded-lg">
                        <CheckCircle2 size={24} className="mx-auto text-green-500 mb-2" />
                        <p className="text-xs font-semibold text-slate-600">All clear!</p>
                        <p className="text-[10px] text-slate-400 mt-1">No pending actions</p>
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

         {/* DATE PICKER MODAL */}
         <DatePickerModal
            show={showDatePicker}
            onClose={() => setShowDatePicker(false)}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            setView={setView}
            appointmentFilter={appointmentFilter}
            setAppointmentFilter={setAppointmentFilter}
            appointments={appointments}
            monthLabel={monthLabel}
         />

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
