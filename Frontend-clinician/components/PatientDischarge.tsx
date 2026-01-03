
import React, { useState } from 'react';
import { 
  ArrowLeft, CheckCircle2, AlertTriangle, FileText, 
  ChevronRight, ArrowRight, UserCheck, PauseCircle, 
  UserMinus, Calendar, PenTool, Check, Download,
  ShieldAlert, Info, Clock, Printer
} from 'lucide-react';

interface PatientDischargeProps {
  onBack: () => void;
  onFinish: () => void;
}

const PatientDischarge: React.FC<PatientDischargeProps> = ({ onBack, onFinish }) => {
  const [type, setType] = useState<'success' | 'transfer' | 'discontinue' | null>(null);
  const [step, setStep] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [signature, setSignature] = useState('');

  const handleNext = () => {
    if (step < 4) setStep(s => s + 1);
    else setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    setShowSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 animate-in fade-in duration-500 relative">
      {/* Demo Banner */}
      <div className="w-full bg-amber-50 border-b border-amber-100 py-2.5 px-6 flex items-center justify-center gap-3 sticky top-0 z-50">
        <ShieldAlert size={16} className="text-amber-600" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-10">
        {/* Header */}
        {!showSuccess && (
          <div className="flex items-center justify-between mb-12">
             <div>
                <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-[#2563EB] hover:text-blue-700 transition-colors mb-4">
                   <ArrowLeft size={18} /> Back to Patient Profile
                </button>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Discharge Patient: Aarav Kumar</h1>
                <p className="text-slate-500 mt-1 font-medium">Close case file and archive records</p>
             </div>
             <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Status: Active</span>
             </div>
          </div>
        )}

        {/* TYPE SELECTION */}
        {!type && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
             <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-2xl flex gap-4">
                <AlertTriangle size={24} className="text-amber-600 shrink-0" />
                <div>
                   <h3 className="font-bold text-amber-900 mb-1">Important: Case Closure Actions</h3>
                   <p className="text-sm text-amber-800/80 leading-relaxed">
                      Discharging a patient will end all active interventions, close the current IEP, generate a final summary, and archive records. You can reactivate the patient later if needed.
                   </p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { id: 'success', title: 'Successful Discharge', desc: 'Goals met, no further services needed', icon: <CheckCircle2 size={40} />, color: 'text-green-600', border: 'hover:border-green-500', bg: 'hover:bg-green-50' },
                  { id: 'transfer', title: 'Transfer of Care', desc: 'Continuing with another provider', icon: <UserCheck size={40} />, color: 'text-blue-600', border: 'hover:border-blue-500', bg: 'hover:bg-blue-50' },
                  { id: 'discontinue', title: 'Discontinuation', desc: 'Services ending before completion', icon: <UserMinus size={40} />, color: 'text-orange-600', border: 'hover:border-orange-500', bg: 'hover:bg-orange-50' }
                ].map(opt => (
                  <button 
                    key={opt.id}
                    onClick={() => setType(opt.id as any)}
                    className={`bg-white rounded-[2.5rem] border-2 border-slate-100 p-8 text-left transition-all group ${opt.border} ${opt.bg} hover:shadow-xl hover:-translate-y-1`}
                  >
                     <div className={`mb-6 ${opt.color}`}>{opt.icon}</div>
                     <h3 className="text-xl font-black text-slate-900 mb-2">{opt.title}</h3>
                     <p className="text-sm font-medium text-slate-500">{opt.desc}</p>
                  </button>
                ))}
             </div>
          </div>
        )}

        {/* WIZARD FLOW */}
        {type && !showSuccess && (
          <div className="flex flex-col lg:flex-row gap-10 animate-in slide-in-from-right-8 duration-500">
             <div className="flex-1 space-y-8">
                {/* Step Content */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm min-h-[500px]">
                   
                   {/* Step 1: Details */}
                   {step === 1 && (
                      <div className="space-y-8 animate-in fade-in">
                         <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-4">
                            <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">1</span>
                            Discharge Details
                         </h2>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Discharge Date</label>
                               <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500" />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Final Status</label>
                               <select className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500">
                                  <option>Goals Met</option><option>Symptoms Resolved</option><option>Max Improvement Reached</option>
                               </select>
                            </div>
                         </div>

                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reason for Discharge *</label>
                            <textarea 
                              className="w-full h-40 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-slate-700 outline-none focus:border-blue-500 resize-none leading-relaxed"
                              defaultValue="Aarav has successfully completed the intervention program and achieved all IEP goals. Communication skills have improved significantly from baseline..."
                            />
                         </div>

                         <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                            <h4 className="text-xs font-black text-blue-900 uppercase tracking-widest mb-4">Goal Summary</h4>
                            <div className="space-y-3">
                               {[
                                 { g: 'Communication', s: 'Achieved (100%)' },
                                 { g: 'Reading Skills', s: 'Achieved (95%)' },
                                 { g: 'Social Skills', s: 'Achieved (88%)' }
                               ].map((g, i) => (
                                 <div key={i} className="flex items-center justify-between text-sm font-bold text-blue-800">
                                    <span>{g.g}</span>
                                    <span className="flex items-center gap-1"><CheckCircle2 size={14} /> {g.s}</span>
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>
                   )}

                   {/* Step 2: Summary */}
                   {step === 2 && (
                      <div className="space-y-8 animate-in fade-in">
                         <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-4">
                            <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">2</span>
                            Clinical Summary
                         </h2>
                         
                         <div className="space-y-4">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Interventions Provided</label>
                               <textarea className="w-full h-32 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-slate-700 outline-none resize-none" defaultValue="Speech & Language Therapy (2x/week), Occupational Therapy (1x/week), Special Education Support..." />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress & Outcomes</label>
                               <textarea className="w-full h-32 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-slate-700 outline-none resize-none" defaultValue="Advanced from 1-2 word to consistent 5-6 word sentences. Initiated peer interactions independently..." />
                            </div>
                         </div>
                      </div>
                   )}

                   {/* Step 3: Recommendations */}
                   {step === 3 && (
                      <div className="space-y-8 animate-in fade-in">
                         <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-4">
                            <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">3</span>
                            Recommendations
                         </h2>
                         
                         <div className="space-y-4">
                            <label className="flex items-start gap-3 p-4 border-2 border-slate-100 rounded-2xl cursor-pointer hover:border-blue-200 transition-all">
                               <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 text-blue-600 rounded border-slate-300" />
                               <div>
                                  <span className="font-bold text-slate-800 text-sm block">Continue General Education</span>
                                  <span className="text-xs text-slate-500">Maintain placement without specialized services</span>
                               </div>
                            </label>
                            <label className="flex items-start gap-3 p-4 border-2 border-slate-100 rounded-2xl cursor-pointer hover:border-blue-200 transition-all">
                               <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 text-blue-600 rounded border-slate-300" />
                               <div>
                                  <span className="font-bold text-slate-800 text-sm block">Home Maintenance Plan</span>
                                  <span className="text-xs text-slate-500">Continue reading routine and social exposure</span>
                               </div>
                            </label>
                         </div>

                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Future Follow-up</label>
                            <div className="flex gap-4">
                               <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="followup" defaultChecked /> <span className="text-sm font-bold text-slate-700">None needed</span></label>
                               <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="followup" /> <span className="text-sm font-bold text-slate-700">Check-in (6mo)</span></label>
                            </div>
                         </div>
                      </div>
                   )}

                   {/* Step 4: Review */}
                   {step === 4 && (
                      <div className="space-y-8 animate-in fade-in">
                         <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-4">
                            <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">4</span>
                            Final Review & Sign
                         </h2>
                         
                         <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm text-slate-600 font-medium leading-relaxed max-h-60 overflow-y-auto">
                            <p className="font-black text-slate-900 mb-2 uppercase text-xs tracking-widest">Discharge Summary Preview</p>
                            <p>Aarav Kumar (DOB: 15/03/2017) is being discharged from clinical services following successful completion of treatment goals...</p>
                            <p className="mt-2">Diagnosis: ASD (Level 1) - Resolved/Managed</p>
                            <p className="mt-2">Outcome: Excellent. All IEP goals met.</p>
                         </div>

                         <div className="space-y-4">
                            <label className="flex items-center gap-3 cursor-pointer">
                               <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600" />
                               <span className="text-sm font-bold text-slate-700">Family informed of discharge</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                               <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600" />
                               <span className="text-sm font-bold text-slate-700">School team notified</span>
                            </label>
                         </div>

                         <div className="pt-4 border-t border-slate-100">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Digital Signature</label>
                            <input 
                              type="text" 
                              placeholder="Type 'Dr. Jane Rivera' to sign" 
                              value={signature}
                              onChange={(e) => setSignature(e.target.value)}
                              className="w-full h-12 px-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:border-blue-500" 
                            />
                         </div>
                      </div>
                   )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-4">
                   <button 
                     onClick={() => step > 1 ? setStep(s => s - 1) : setType(null)} 
                     className="px-6 py-3 border-2 border-slate-200 rounded-xl text-xs font-black text-slate-500 hover:bg-slate-50 uppercase tracking-widest transition-all"
                   >
                      Back
                   </button>
                   <button 
                     onClick={handleNext}
                     disabled={step === 4 && signature.length < 3}
                     className={`px-8 py-3 rounded-xl text-xs font-black text-white uppercase tracking-widest shadow-lg transition-all ${step === 4 && signature.length < 3 ? 'bg-slate-300 cursor-not-allowed' : 'bg-[#2563EB] hover:bg-blue-700 hover:shadow-blue-200'}`}
                   >
                      {step === 4 ? 'Finalize Discharge' : 'Continue'}
                   </button>
                </div>
             </div>

             {/* Sidebar Info */}
             <div className="w-full lg:w-72 shrink-0 space-y-6">
                <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Checklist</h3>
                   <div className="space-y-3">
                      {[
                        { l: 'Details Entered', d: step > 1 },
                        { l: 'Summary Complete', d: step > 2 },
                        { l: 'Recommendations', d: step > 3 },
                        { l: 'Signed', d: step === 4 && signature.length > 3 }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                           <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${item.d ? 'bg-green-500 border-green-500 text-white' : 'border-slate-200'}`}>
                              {item.d && <Check size={12} strokeWidth={4} />}
                           </div>
                           <span className={`text-xs font-bold ${item.d ? 'text-slate-800' : 'text-slate-400'}`}>{item.l}</span>
                        </div>
                      ))}
                   </div>
                </div>
                
                <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl">
                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Patient Stats</h3>
                   <div className="space-y-4">
                      <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase">Time in Care</p>
                         <p className="text-xl font-black">7 Months</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase">Total Sessions</p>
                         <p className="text-xl font-black">76</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* CONFIRM MODAL */}
        {showConfirm && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 text-center shadow-2xl animate-in zoom-in-95">
                 <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle size={40} />
                 </div>
                 <h2 className="text-2xl font-black text-slate-900 mb-2">Confirm Discharge?</h2>
                 <p className="text-slate-500 font-medium mb-8">This will close the case file, archive records, and end active interventions. You can reactivate later.</p>
                 <div className="flex flex-col gap-3">
                    <button onClick={handleConfirm} className="w-full py-4 bg-red-600 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-red-700 shadow-lg shadow-red-100 transition-all">Confirm Discharge</button>
                    <button onClick={() => setShowConfirm(false)} className="w-full py-4 bg-white text-slate-500 rounded-xl text-sm font-black uppercase tracking-widest hover:text-slate-800 transition-all">Cancel</button>
                 </div>
              </div>
           </div>
        )}

        {/* SUCCESS SCREEN */}
        {showSuccess && (
           <div className="max-w-2xl mx-auto text-center animate-in zoom-in duration-500">
              <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-xl">
                 <CheckCircle2 size={64} className="text-green-500" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Patient Successfully Discharged</h2>
              <p className="text-lg text-slate-500 font-medium mb-10">Records have been archived securely</p>

              <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm mb-10">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Generated Documents</h3>
                 <div className="space-y-4">
                    {[
                      'Discharge Summary (PDF)',
                      'Final Progress Report (PDF)',
                      'Parent Summary (PDF)'
                    ].map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                         <div className="flex items-center gap-3">
                            <FileText size={20} className="text-slate-400" />
                            <span className="text-sm font-bold text-slate-700">{doc}</span>
                         </div>
                         <button className="text-blue-600 hover:text-blue-800"><Download size={18} /></button>
                      </div>
                    ))}
                 </div>
              </div>

              <button onClick={onFinish} className="px-10 py-4 bg-[#2563EB] text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">Return to Dashboard</button>
           </div>
        )}
      </div>
    </div>
  );
};

export default PatientDischarge;
