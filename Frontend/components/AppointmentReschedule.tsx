
import React, { useState } from 'react';
import { 
  ArrowLeft, Calendar, Clock, MapPin, Video, 
  User, CheckCircle2, AlertTriangle, Search, 
  ChevronRight, ChevronDown, Info, Phone, Home,
  FileText, MessageSquare, Repeat, Check, AlertCircle, X
} from 'lucide-react';

interface AppointmentRescheduleProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
}

const AppointmentReschedule: React.FC<AppointmentRescheduleProps> = ({ onBack, onNavigate }) => {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [reason, setReason] = useState('Patient Request');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const suggestions = [
    { date: 'Oct 29', time: '10:30 AM', type: 'Same Time', rec: true },
    { date: 'Oct 25', time: '02:00 PM', type: 'This Week' },
    { date: 'Oct 31', time: '10:00 AM', type: 'Next Week' },
  ];

  const handleReschedule = () => {
    setShowConfirm(false);
    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 animate-in zoom-in duration-300">
        <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl p-12 text-center">
          <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-xl">
             <CheckCircle2 size={64} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">Rescheduled Successfully!</h2>
          <p className="text-lg text-slate-500 font-medium mb-10">Updated details sent to parent.</p>

          <div className="flex flex-col gap-4">
             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase">Old Date</span>
                <span className="text-sm font-bold text-slate-500 line-through">Oct 24, 10:30 AM</span>
             </div>
             <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex justify-between items-center">
                <span className="text-xs font-bold text-green-600 uppercase">New Date</span>
                <span className="text-sm font-black text-green-700">{selectedDate ? `Oct ${selectedDate}` : 'Oct 29'}, {selectedTime || '10:30 AM'}</span>
             </div>
          </div>

          <button onClick={() => onNavigate('schedule')} className="mt-10 px-10 py-4 bg-[#2563EB] text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-all">Return to Calendar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col animate-in fade-in duration-500 relative pb-24">
      {/* Demo Banner */}
      <div className="w-full bg-amber-50 border-b border-amber-100 py-2.5 px-6 flex items-center justify-center gap-3 sticky top-0 z-[60]">
        <AlertTriangle size={16} className="text-amber-600" />
      </div>

      <div className="max-w-[1200px] mx-auto w-full p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
         
         {/* LEFT COLUMN */}
         <div className="lg:col-span-7 space-y-10">
            <div className="flex items-center gap-4 mb-4">
               <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
                  <ArrowLeft size={24} />
               </button>
               <h1 className="text-3xl font-black text-slate-900 tracking-tight">Reschedule Appointment</h1>
            </div>

            {/* Current Appointment */}
            <div className="bg-orange-50/50 rounded-[2rem] border-2 border-orange-100 p-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 px-4 py-2 bg-orange-100 rounded-bl-2xl text-[10px] font-black text-orange-700 uppercase tracking-widest">Current Booking</div>
               <div className="flex items-center gap-6 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-orange-100 overflow-hidden shadow-sm">
                     <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rivera" className="w-full h-full object-cover" />
                  </div>
                  <div>
                     <h3 className="text-xl font-black text-slate-900">Aarav Kumar</h3>
                     <p className="text-sm font-bold text-slate-500">Speech Therapy Session</p>
                  </div>
               </div>
               <div className="flex gap-8 text-slate-700">
                  <div className="flex items-center gap-2">
                     <Calendar size={18} className="text-orange-500" />
                     <span className="text-sm font-bold">Oct 24, 2024</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Clock size={18} className="text-orange-500" />
                     <span className="text-sm font-bold">10:30 AM - 11:15 AM</span>
                  </div>
               </div>
            </div>

            {/* Reason */}
            <div className="space-y-4">
               <h3 className="text-lg font-black text-slate-900">Reason for Reschedule</h3>
               <div className="grid grid-cols-2 gap-4">
                  {['Patient Request', 'Provider Conflict', 'Illness', 'Other'].map(r => (
                    <button 
                      key={r} 
                      onClick={() => setReason(r)}
                      className={`p-4 rounded-xl border-2 text-xs font-bold uppercase tracking-widest transition-all ${reason === r ? 'border-slate-800 bg-slate-800 text-white' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-300'}`}
                    >
                       {r}
                    </button>
                  ))}
               </div>
               <textarea placeholder="Add optional notes..." className="w-full h-24 p-4 bg-white border-2 border-slate-100 rounded-2xl text-sm font-medium outline-none focus:border-blue-400 transition-all resize-none" />
            </div>

            {/* New Time Selection */}
            <div className="space-y-6">
               <h3 className="text-lg font-black text-slate-900">Select New Time</h3>
               
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Suggested Slots</p>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {suggestions.map((s, i) => (
                    <button 
                      key={i}
                      onClick={() => { setSelectedDate(parseInt(s.date.split(' ')[1])); setSelectedTime(s.time); }}
                      className={`p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden group ${
                        selectedTime === s.time ? 'border-blue-500 bg-blue-50' : 'border-slate-100 bg-white hover:border-blue-200'
                      }`}
                    >
                       {s.rec && <div className="absolute top-0 right-0 px-2 py-1 bg-green-500 text-white text-[8px] font-black uppercase tracking-widest rounded-bl-lg">Best</div>}
                       <p className="text-sm font-black text-slate-900">{s.date}</p>
                       <p className="text-lg font-black text-blue-600 my-1">{s.time}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase">{s.type}</p>
                    </button>
                  ))}
               </div>

               <div className="flex items-center gap-4 my-4">
                  <div className="h-px bg-slate-200 flex-1" />
                  <span className="text-xs font-bold text-slate-400 uppercase">Or select custom</span>
                  <div className="h-px bg-slate-200 flex-1" />
               </div>
               
               <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between cursor-pointer hover:border-blue-400 transition-all">
                  <span className="text-sm font-bold text-slate-600">Choose from Calendar</span>
                  <ChevronRight size={18} className="text-slate-400" />
               </div>
            </div>
         </div>

         {/* RIGHT COLUMN - SUMMARY */}
         <div className="lg:col-span-5 space-y-8">
            <div className="sticky top-32 bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-xl shadow-slate-200/50 p-8">
               <h3 className="text-lg font-black text-slate-900 mb-8">Changes Summary</h3>

               <div className="space-y-8 relative">
                  <div className="flex items-start gap-6 opacity-50">
                     <div className="w-10 text-right pt-1">
                        <span className="text-xs font-bold text-slate-400 uppercase">Was</span>
                     </div>
                     <div className="flex-1 p-4 rounded-2xl bg-slate-50 border border-slate-100 relative">
                        <div className="absolute -left-[31px] top-4 w-3 h-3 rounded-full bg-slate-300 ring-4 ring-white" />
                        <div className="absolute -left-[20px] top-7 w-[2px] h-20 bg-slate-200" />
                        <p className="text-sm font-bold text-slate-500 line-through">Oct 24, 10:30 AM</p>
                        <p className="text-xs text-slate-400">Rivera Clinic</p>
                     </div>
                  </div>

                  <div className="flex items-start gap-6">
                     <div className="w-10 text-right pt-1">
                        <span className="text-xs font-black text-blue-600 uppercase">New</span>
                     </div>
                     <div className="flex-1 p-4 rounded-2xl bg-blue-50 border border-blue-100 relative shadow-sm">
                        <div className="absolute -left-[31px] top-4 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white" />
                        <p className="text-lg font-black text-slate-900">{selectedDate ? `Oct ${selectedDate}` : 'Select Date'}</p>
                        <p className="text-sm font-bold text-blue-600">{selectedTime || '--:--'}</p>
                        <p className="text-xs text-slate-500 mt-2">Rivera Clinic - Room 3</p>
                     </div>
                  </div>
               </div>

               <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
                  <label className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-all">
                     <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 text-blue-600 rounded" />
                     <div>
                        <span className="text-xs font-bold text-slate-700 block">Notify Parent</span>
                        <span className="text-[10px] text-slate-400">Email & SMS will be sent</span>
                     </div>
                  </label>
                  <label className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-all">
                     <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 text-blue-600 rounded" />
                     <div>
                        <span className="text-xs font-bold text-slate-700 block">Update Recurring Series</span>
                        <span className="text-[10px] text-slate-400">Apply to future appointments</span>
                     </div>
                  </label>
               </div>

               <button 
                 onClick={() => setShowConfirm(true)}
                 disabled={!selectedTime}
                 className={`w-full h-14 mt-6 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all ${selectedTime ? 'bg-[#2563EB] text-white shadow-blue-200 hover:bg-blue-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}
               >
                  Confirm Reschedule
               </button>
            </div>
         </div>
      </div>

      {/* CONFIRM MODAL */}
      {showConfirm && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 text-center shadow-2xl animate-in zoom-in-95">
               <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Repeat size={32} />
               </div>
               <h2 className="text-2xl font-black text-slate-900 mb-2">Confirm Changes?</h2>
               <p className="text-slate-500 font-medium mb-8 text-sm">This will move the appointment to Oct {selectedDate || '29'} at {selectedTime}.</p>
               <div className="flex flex-col gap-3">
                  <button onClick={handleReschedule} className="w-full py-4 bg-[#2563EB] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">Confirm Update</button>
                  <button onClick={() => setShowConfirm(false)} className="w-full py-4 bg-white text-slate-500 rounded-xl text-xs font-black uppercase tracking-widest hover:text-slate-800 transition-all">Back</button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default AppointmentReschedule;
