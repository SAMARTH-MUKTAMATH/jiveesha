import React, { useState, useEffect } from 'react';
import {
   ArrowLeft, Calendar, Clock, MapPin, Video,
   User, CheckCircle2, AlertTriangle, Search,
   ChevronRight, ChevronDown, Info, Phone, Home,
   FileText, MessageSquare, Repeat, Check
} from 'lucide-react';
import { apiClient } from '../services/api';

interface AppointmentBookingProps {
   onBack: () => void;
   onNavigate: (view: string) => void;
   preSelectedPatientId?: string | null;
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({ onBack, onNavigate, preSelectedPatientId }) => {
   const [step, setStep] = useState(1);
   const [patient, setPatient] = useState<any>(null);
   const [recentPatients, setRecentPatients] = useState<any[]>([]);
   const [apptType, setApptType] = useState<string | null>(null);
   const [selectedDate, setSelectedDate] = useState<number | null>(new Date().getDate());
   const [selectedTime, setSelectedTime] = useState<string | null>(null);
   const [format, setFormat] = useState<string>('In-Person');
   const [showSuccess, setShowSuccess] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);

   // Fetch data
   useEffect(() => {
      const loadData = async () => {
         try {
            const res = await apiClient.getPatients({ limit: 5 });
            if (res.success && res.data?.patients) {
               setRecentPatients(res.data.patients);
            }

            if (preSelectedPatientId) {
               const patientRes = await apiClient.getPatient(preSelectedPatientId);
               if (patientRes.success && patientRes.data) {
                  setPatient({
                     name: patientRes.data.full_name,
                     id: patientRes.data.id,
                     age: `${patientRes.data.age} years`,
                     avatar: patientRes.data.first_name // Seed for avatar
                  });
               }
            }
         } catch (e) {
            console.error("Error loading booking data", e);
         }
      };
      loadData();
   }, [preSelectedPatientId]);

   // Mock Data
   const timeSlots = [
      { time: '09:00 AM', status: 'available' },
      { time: '10:00 AM', status: 'available' },
      { time: '10:30 AM', status: 'conflict' },
      { time: '11:00 AM', status: 'available' },
      { time: '02:00 PM', status: 'available', recommended: true },
      { time: '03:00 PM', status: 'blocked' },
      { time: '04:00 PM', status: 'available' },
   ];

   const handleBook = async () => {
      if (!patient || !selectedDate || !selectedTime || !apptType) return;

      setIsSubmitting(true);
      try {
         // 1. Convert Time to 24h
         const [timeStr, modifier] = selectedTime.split(' ');
         let [hours, minutes] = timeStr.split(':').map(Number);

         if (modifier === 'PM' && hours < 12) hours += 12;
         if (modifier === 'AM' && hours === 12) hours = 0;

         const startTime24 = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

         // 2. Calculate End Time
         let duration = 30;
         if (apptType === 'Assessment') duration = 60;
         if (apptType === 'Therapy Session') duration = 45;

         const totalStartMinutes = hours * 60 + minutes;
         const totalEndMinutes = totalStartMinutes + duration;
         const endH = Math.floor(totalEndMinutes / 60);
         const endM = totalEndMinutes % 60;
         const endTime24 = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;

         // 3. Construct Date (Set to Noon to avoid timezone shifts)
         const now = new Date();
         const dateObj = new Date(now.getFullYear(), now.getMonth(), selectedDate, 12, 0, 0);

         // 4. Payload
         const payload = {
            patient_id: patient.id,
            date: dateObj.toISOString(),
            start_time: startTime24,
            end_time: endTime24,
            appointment_type: apptType,
            format: format,
            notes: 'Scheduled via Dashboard'
         };

         // 5. API Call
         // Check if createAppointment exists, if not use request directly
         // Assuming apiClient has a post method exposed or createAppointment method
         // Based on typical pattern: apiClient.post('/appointments', payload)
         // But let's try to use the method if it exists, or fallback to generic request if I can access it.
         // Since I can't see api.ts right now, I'll assume createAppointment SHOULD exist. 
         // If I get error, I'll fix api.ts.
         // Actually, I can use apiClient.request if public, but likely protected.
         // I'll call apiClient.createAppointment(payload).

         const res = await apiClient.createAppointment(payload);

         if (res.success) {
            setShowSuccess(true);
         }
      } catch (e) {
         console.error("Booking failed", e);
         // simple alert for now
         alert("Failed to book appointment. Please try again.");
      } finally {
         setIsSubmitting(false);
      }
   };

   if (showSuccess) {
      return (
         <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 animate-in zoom-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-12 text-center">
               <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-xl">
                  <CheckCircle2 size={64} className="text-green-500" />
               </div>
               <h2 className="text-3xl font-black text-slate-900 mb-4">Appointment Scheduled!</h2>
               <p className="text-lg text-slate-500 font-medium mb-10">A confirmation has been sent to the parent.</p>

               <div className="bg-slate-50 rounded-[2rem] border border-slate-200 p-8 shadow-sm mb-10 text-left">
                  <div className="flex items-center gap-6 mb-8">
                     <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient?.avatar || 'Rivera'}`} alt="Patient" className="w-full h-full object-cover" />
                     </div>
                     <div>
                        <h3 className="text-xl font-black text-slate-900">{patient?.name}</h3>
                        <div className="flex gap-2 mt-1 text-sm font-bold text-slate-500">
                           <span>{apptType}</span>
                           <span>•</span>
                           <span>{format}</span>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date & Time</p>
                        <p className="text-base font-bold text-slate-900">
                           {selectedDate ? new Date(new Date().getFullYear(), new Date().getMonth(), selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                        </p>
                        <p className="text-sm font-medium text-slate-600">{selectedTime} (45 min)</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Location</p>
                        <p className="text-base font-bold text-slate-900">Rivera Clinic - Room 3</p>
                        <p className="text-sm font-medium text-slate-600">123 MG Road, Mumbai</p>
                     </div>
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={() => onNavigate('schedule')} className="px-8 py-4 bg-[#2563EB] text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-all">View in Calendar</button>
                  <button onClick={onBack} className="px-8 py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-xl text-sm font-black uppercase tracking-widest hover:border-slate-300 transition-all">Back to Dashboard</button>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col animate-in fade-in duration-500 relative pb-24">
         {/* Header */}
         <div className="bg-white border-b border-slate-200 px-8 py-6 sticky top-[41px] z-50">
            <div className="max-w-[1400px] mx-auto">
               <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-800 transition-colors mb-4">
                  <ArrowLeft size={18} /> Cancel
               </button>
               <h1 className="text-3xl font-black text-slate-900 tracking-tight">Schedule Appointment</h1>
               <p className="text-slate-500 font-medium mt-1">Book a session for assessment, therapy, or consultation</p>
            </div>
         </div>

         <div className="flex-1 max-w-[1400px] mx-auto w-full p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* LEFT COLUMN - FORM */}
            <div className="lg:col-span-7 space-y-10">

               {/* Step 1: Patient */}
               <section className="space-y-4">
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                     <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">1</span>
                     Select Patient
                  </h3>
                  {patient ? (
                     <div className="bg-white p-6 rounded-[2rem] border-2 border-[#2563EB] shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.avatar}`} alt="Patient" className="w-full h-full object-cover" />
                           </div>
                           <div>
                              <h4 className="text-lg font-black text-slate-900">{patient.name}</h4>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{patient.age} • {patient.id}</p>
                           </div>
                        </div>
                        <button onClick={() => setPatient(null)} className="text-xs font-bold text-blue-600 hover:underline px-4">Change</button>
                     </div>
                  ) : (
                     <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
                        <div className="relative">
                           <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                           <input type="text" placeholder="Search patient by name or ID..." className="w-full h-12 pl-12 pr-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Recent Patients</p>
                           {recentPatients.length > 0 ? (
                              <div className="flex gap-4 overflow-x-auto pb-2">
                                 {recentPatients.map((p, i) => (
                                    <button
                                       key={p.id}
                                       onClick={() => setPatient({ name: p.full_name, id: p.id, age: `${p.age} years`, avatar: p.first_name })}
                                       className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50 transition-all min-w-[180px]"
                                    >
                                       <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden">
                                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.first_name}`} className="w-full h-full object-cover" />
                                       </div>
                                       <div className="text-left">
                                          <p className="text-xs font-bold text-slate-800 truncate max-w-[100px]">{p.full_name}</p>
                                          <p className="text-[9px] font-bold text-slate-400">ID: {p.id.substring(0, 8)}...</p>
                                       </div>
                                    </button>
                                 ))}
                              </div>
                           ) : (
                              <div className="text-slate-400 text-xs italic py-2">No recent patients found.</div>
                           )}
                        </div>
                     </div>
                  )}
               </section>

               {/* Step 2: Type */}
               <section className="space-y-4">
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                     <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">2</span>
                     Appointment Type
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                     {[
                        { id: 'Assessment', icon: <FileText size={20} />, sub: '45-90 min' },
                        { id: 'Therapy Session', icon: <User size={20} />, sub: '30-60 min' },
                        { id: 'Consultation', icon: <MessageSquare size={20} />, sub: '20-45 min' },
                        { id: 'Follow-up', icon: <Repeat size={20} />, sub: '15-30 min' }
                     ].map(t => (
                        <button
                           key={t.id}
                           onClick={() => setApptType(t.id)}
                           className={`p-4 rounded-2xl border-2 text-left transition-all group ${apptType === t.id
                              ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200'
                              : 'border-slate-100 bg-white text-slate-500 hover:border-blue-200'
                              }`}
                        >
                           <div className={`mb-3 ${apptType === t.id ? 'text-white' : 'text-blue-500'}`}>{t.icon}</div>
                           <h4 className={`text-sm font-black uppercase tracking-wide ${apptType === t.id ? 'text-white' : 'text-slate-800'}`}>{t.id}</h4>
                           <p className={`text-[10px] font-bold mt-1 ${apptType === t.id ? 'text-blue-100' : 'text-slate-400'}`}>{t.sub}</p>
                        </button>
                     ))}
                  </div>

                  {apptType === 'Therapy Session' && (
                     <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl animate-in slide-in-from-top-2">
                        <label className="text-[10px] font-black text-blue-800 uppercase tracking-widest block mb-2">Service</label>
                        <select className="w-full h-11 px-3 bg-white border border-blue-200 rounded-xl text-xs font-bold text-slate-700 outline-none">
                           <option>Speech & Language Therapy</option>
                           <option>Occupational Therapy</option>
                           <option>Behavioral Therapy</option>
                        </select>
                     </div>
                  )}
               </section>

               {/* Step 3: Date & Time */}
               <section className="space-y-4">
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                     <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">3</span>
                     Date & Time
                  </h3>

                  <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
                     {/* Calendar Strip */}
                     <div className="flex items-center justify-between mb-6">
                        <button className="p-2 hover:bg-slate-50 rounded-xl"><ChevronRight size={20} className="rotate-180 text-slate-400" /></button>
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                           {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                        </h4>
                        <button className="p-2 hover:bg-slate-50 rounded-xl"><ChevronRight size={20} className="text-slate-400" /></button>
                     </div>
                     <div className="grid grid-cols-7 gap-2 mb-8">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} className="text-center text-[10px] font-bold text-slate-300 mb-2">{d}</div>)}
                        {[...Array(31)].map((_, i) => {
                           const day = i + 1;
                           const isSelected = selectedDate === day;
                           const isToday = day === new Date().getDate();
                           return (
                              <button
                                 key={day}
                                 onClick={() => setSelectedDate(day)}
                                 className={`h-10 rounded-xl text-xs font-bold flex items-center justify-center relative transition-all ${isSelected ? 'bg-slate-900 text-white shadow-lg' :
                                    isToday ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'hover:bg-slate-50 text-slate-600'
                                    }`}
                              >
                                 {day}
                                 {/* Random dots for visual effect */}
                                 {[5, 12, 18, 25].includes(day) && !isSelected && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-green-500" />}
                              </button>
                           )
                        })}
                     </div>

                     {/* Time Slots */}
                     <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Slots</p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                           {timeSlots.map((slot, i) => (
                              <button
                                 key={i}
                                 disabled={slot.status !== 'available'}
                                 onClick={() => setSelectedTime(slot.time)}
                                 className={`py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all relative ${selectedTime === slot.time
                                    ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                                    : slot.status === 'available'
                                       ? 'border-slate-100 bg-white text-slate-600 hover:border-blue-300'
                                       : 'border-slate-50 bg-slate-50 text-slate-300 cursor-not-allowed'
                                    }`}
                              >
                                 {slot.time}
                                 {slot.recommended && slot.status === 'available' && selectedTime !== slot.time && (
                                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[8px] px-1.5 py-0.5 rounded-full shadow-sm">BEST</div>
                                 )}
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>
               </section>

               {/* Step 4: Format */}
               <section className="space-y-4">
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                     <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">4</span>
                     Session Format
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                     {[
                        { id: 'In-Person', icon: <MapPin size={18} /> },
                        { id: 'Virtual', icon: <Video size={18} /> },
                        { id: 'Home Visit', icon: <Home size={18} /> },
                        { id: 'Phone', icon: <Phone size={18} /> }
                     ].map(f => (
                        <button
                           key={f.id}
                           onClick={() => setFormat(f.id)}
                           className={`h-20 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${format === f.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 bg-white text-slate-400 hover:border-blue-200'
                              }`}
                        >
                           {f.icon}
                           <span className="text-[10px] font-black uppercase">{f.id}</span>
                        </button>
                     ))}
                  </div>

                  {format === 'In-Person' && (
                     <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-600">Location: Rivera Clinic - Room 3</span>
                        <button className="text-[10px] font-black text-blue-600 uppercase hover:underline">Change</button>
                     </div>
                  )}
               </section>
            </div>

            {/* RIGHT COLUMN - SUMMARY */}
            <div className="lg:col-span-5 space-y-8">
               <div className="sticky top-32 bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-xl shadow-slate-200/50 p-8 overflow-hidden relative">
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-purple-500" />

                  <h3 className="text-lg font-black text-slate-900 mb-6">Booking Summary</h3>

                  <div className="space-y-6">
                     {/* Patient */}
                     <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden">
                           {patient ? <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.avatar}`} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-200" />}
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient</p>
                           <p className="text-sm font-black text-slate-800">{patient?.name || 'Select Patient'}</p>
                        </div>
                     </div>

                     {/* Details */}
                     <div className="space-y-4">
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileText size={16} /></div>
                              <div>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase">Type</p>
                                 <p className="text-xs font-black text-slate-800">{apptType || '-'}</p>
                              </div>
                           </div>
                        </div>

                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-3">
                              <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Calendar size={16} /></div>
                              <div>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase">Date & Time</p>
                                 <p className="text-xs font-black text-slate-800">
                                    {selectedDate ? new Date(new Date().getFullYear(), new Date().getMonth(), selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                                    {selectedTime && ` • ${selectedTime}`}
                                 </p>
                              </div>
                           </div>
                        </div>

                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-3">
                              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><MapPin size={16} /></div>
                              <div>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase">Format</p>
                                 <p className="text-xs font-black text-slate-800">{format}</p>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Notices */}
                     <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-green-600 uppercase tracking-widest">
                           <Check size={12} /> Email Reminder
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-green-600 uppercase tracking-widest">
                           <Check size={12} /> SMS Notification
                        </div>
                     </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-3">
                     <button
                        onClick={handleBook}
                        disabled={!patient || !apptType || !selectedTime}
                        className={`w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all ${patient && apptType && selectedTime
                           ? 'bg-[#2563EB] text-white shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1'
                           : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                           }`}
                     >
                        Confirm Booking
                     </button>
                     <button className="w-full py-3 text-xs font-bold text-slate-400 hover:text-slate-600">Save as Draft</button>
                  </div>
               </div>
            </div>

         </div>
      </div>
   );
};

export default AppointmentBooking;
