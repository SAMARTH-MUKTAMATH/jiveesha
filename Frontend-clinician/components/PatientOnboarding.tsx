
import React, { useState, useRef } from 'react';
import {
   ArrowLeft, CheckCircle2, User, Key, FileText,
   ChevronRight, AlertTriangle, ShieldCheck, Mail,
   Phone, Calendar, Upload, Plus, X, Search, Heart,
   Baby, Home, Globe, School, Lock, Save, HelpCircle,
   Clock, Check, ArrowRight, Loader2
} from 'lucide-react';
import { apiClient } from '../services/api';

interface PatientOnboardingProps {
   onBack: () => void;
   onFinish: (id: string) => void;
   patientId?: string | null;
}

const PatientOnboarding: React.FC<PatientOnboardingProps> = ({ onBack, onFinish, patientId }) => {
   const [method, setMethod] = useState<'token' | 'manual' | null>(null);
   const [step, setStep] = useState(1);

   // Token Flow State
   const [token, setToken] = useState(['', '', '', '', '', '', '', '']);
   const [tokenStatus, setTokenStatus] = useState<'idle' | 'validating' | 'success'>('idle');
   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

   // Manual Flow State
   const [manualStep, setManualStep] = useState(1);
   const [showSuccess, setShowSuccess] = useState(false);
   const [isSaving, setIsSaving] = useState(false);
   const [createdPatient, setCreatedPatient] = useState<any>(null);

   // Form data state
   const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      addressLine1: '',
      city: '',
      pinCode: '',
      primaryConcerns: '',
      existingDiagnosis: '',
      diagnosedBy: '',
      hasExistingDiagnosis: false,
      firstWordsAge: '',
      walkingAge: '',
      guardianName: '',
      guardianRelationship: 'Mother',
      guardianPhone: '',
      guardianEmail: '',
      addSchoolInfo: false,
      schoolName: '',
      schoolGrade: '',
      schoolLocation: '',
      hipaaAgreement: false,
      consentStatus: 'digital_request' // digital_request, upload_form, pending
   });

   const handleFormChange = (field: string, value: string | boolean) => {
      setFormData(prev => ({ ...prev, [field]: value }));
   };

   // Auto-navigate to consent step when editing existing patient
   React.useEffect(() => {
      if (patientId) {
         setMethod('manual');
         setManualStep(4);
      }
   }, [patientId]);

   const handleTokenChange = (index: number, value: string) => {
      if (value.length > 1) value = value.slice(-1);
      const newToken = [...token];
      newToken[index] = value.toUpperCase();
      setToken(newToken);
      if (value && index < 7) inputRefs.current[index + 1]?.focus();
   };

   const handleTokenSubmit = () => {
      setTokenStatus('validating');
      setTimeout(() => setTokenStatus('success'), 1500);
   };

   const handleManualNext = async () => {
      // Validation
      if (manualStep === 1) {
         if (!formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.gender || !formData.addressLine1 || !formData.city || !formData.pinCode) {
            alert('Please fill in all required fields in Patient Information.');
            return;
         }
      }
      if (manualStep === 2) {
         if (!formData.primaryConcerns || !formData.firstWordsAge || !formData.walkingAge) {
            alert('Please fill in all required fields including Primary Concerns and Developmental Milestones.');
            return;
         }
         if (formData.hasExistingDiagnosis && (!formData.existingDiagnosis || !formData.diagnosedBy)) {
            alert('Please fill in Diagnosis Name and Diagnosed By.');
            return;
         }
      }
      if (manualStep === 3) {
         if (!formData.guardianName || !formData.guardianPhone || !formData.guardianEmail) {
            alert('Please fill in Guardian Name, Phone and Email.');
            return;
         }
         if (formData.addSchoolInfo && (!formData.schoolName || !formData.schoolGrade || !formData.schoolLocation)) {
            alert('Please fill in all school information fields.');
            return;
         }
      }
      if (manualStep === 4) {
         if (!formData.hipaaAgreement) {
            alert('Please agree to HIPAA compliance to continue.');
            return;
         }
      }

      if (manualStep < 5) {
         setManualStep(prev => prev + 1);
         window.scrollTo(0, 0);
      } else {
         // Save patient to database
         await savePatient();
      }
   };

   const savePatient = async () => {
      try {
         setIsSaving(true);
         const patientData = {
            first_name: formData.firstName,
            last_name: formData.lastName,
            date_of_birth: formData.dateOfBirth,
            gender: formData.gender || 'male',
            address_line1: formData.addressLine1,
            city: formData.city,
            pin_code: formData.pinCode,
            primary_concerns: formData.primaryConcerns,
            existing_diagnosis: formData.hasExistingDiagnosis ? formData.existingDiagnosis : null,
            developmental_milestones: JSON.stringify({
               firstWordsAge: formData.firstWordsAge,
               walkingAge: formData.walkingAge
            }),
            status: (formData.consentStatus === 'pending' || formData.consentStatus === 'digital_request' || formData.consentStatus === 'upload_form') ? 'pending' : 'active',
            // Map guardian info to contacts if backend supports it (or just store in patient for now if contacts endpoint distinct)
            // Ideally backend createPatient should handle contacts, but we'll stick to basic fields first
            // Note: backend might not save guardian info yet as it wasn't in main createPatient body in controller?
            // Let's assume standard fields for now.
         };

         const response = await apiClient.createPatient(patientData);

         if (response.success && response.data) {
            setCreatedPatient(response.data);
            setShowSuccess(true);

            // Dispatch event to notify dashboard to refresh
            window.dispatchEvent(new CustomEvent('patientAdded'));
         } else {
            alert('Failed to creat patient: ' + (response.error?.message || 'Unknown error'));
         }
      } catch (error: any) {
         console.error('Failed to save patient:', error);
         alert('Failed to save patient. Please try again.');
      } finally {
         setIsSaving(false);
      }
   };

   const handleManualBack = () => {
      if (manualStep > 1) setManualStep(prev => prev - 1);
      else setMethod(null);
   };

   return (
      <div className="min-h-screen bg-[#F8FAFC] pb-20 animate-in fade-in duration-500 relative">

         <div className="max-w-[1200px] mx-auto px-6 py-10">
            {/* Header - Only show when adding new patient, not when editing consent */}
            {!showSuccess && !patientId && (
               <div className="text-center mb-12">
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">Add New Patient</h1>
                  <p className="text-slate-500 mt-2 font-medium">Register a new patient to your caseload</p>
               </div>
            )}

            {/* METHOD SELECTION */}
            {!method && (
               <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {/* Token Option */}
                     <div className="bg-white rounded-[2.5rem] border-2 border-blue-100 p-8 hover:border-blue-500 hover:shadow-xl transition-all relative overflow-hidden group cursor-pointer" onClick={() => setMethod('token')}>
                        <div className="absolute top-6 right-6 px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-200">Recommended</div>
                        <div className="w-20 h-20 bg-blue-50 text-[#2563EB] rounded-[2rem] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                           <Key size={40} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">Add via Consent Token</h3>
                        <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed">Patient's parent has generated a consent token and shared their information with you.</p>

                        <ul className="space-y-3 mb-8">
                           {['Patient info pre-filled', 'Consent already granted', 'Records auto-linked', 'Faster onboarding'].map((item, i) => (
                              <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                                 <CheckCircle2 size={14} className="text-green-500" /> {item}
                              </li>
                           ))}
                        </ul>
                        <button className="w-full py-4 bg-[#2563EB] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-100 group-hover:bg-blue-700 transition-all">Use Token</button>
                     </div>

                     {/* Manual Option */}
                     <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-8 hover:border-slate-300 hover:shadow-lg transition-all group cursor-pointer" onClick={() => setMethod('manual')}>
                        <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-[2rem] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                           <FileText size={40} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">Manual Registration</h3>
                        <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed">Manually enter patient information and request consent later.</p>

                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl mb-8">
                           <p className="text-[10px] font-bold text-amber-700 leading-relaxed flex gap-2">
                              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                              You'll need to obtain parent consent before accessing full records or starting interventions.
                           </p>
                        </div>

                        <button className="w-full py-4 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-slate-400 hover:text-slate-800 transition-all">Manual Entry</button>
                     </div>
                  </div>

                  <button onClick={onBack} className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 mx-auto transition-colors uppercase tracking-widest">
                     <ArrowLeft size={14} /> Cancel and go back
                  </button>
               </div>
            )}

            {/* TOKEN FLOW */}
            {method === 'token' && !showSuccess && (
               <div className="max-w-2xl mx-auto animate-in slide-in-from-right-8 duration-500">
                  {tokenStatus !== 'success' ? (
                     <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-10 shadow-xl">
                        <button onClick={() => setMethod(null)} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 mb-8 uppercase tracking-widest">
                           <ArrowLeft size={14} /> Back to options
                        </button>

                        <div className="text-center mb-10">
                           <div className="w-16 h-16 bg-blue-50 text-[#2563EB] rounded-2xl flex items-center justify-center mx-auto mb-4">
                              <Key size={32} />
                           </div>
                           <h2 className="text-2xl font-black text-slate-900">Enter Consent Token</h2>
                           <p className="text-slate-500 mt-2 text-sm font-medium">Enter the 8-character code provided by the parent</p>
                        </div>

                        <div className="flex justify-center gap-2 mb-8">
                           {token.map((char, i) => (
                              <React.Fragment key={i}>
                                 <input
                                    ref={el => inputRefs.current[i] = el}
                                    type="text"
                                    maxLength={1}
                                    value={char}
                                    onChange={(e) => handleTokenChange(i, e.target.value)}
                                    className="w-12 h-14 bg-slate-50 border-2 border-slate-200 rounded-xl text-center text-2xl font-black text-[#2563EB] focus:border-[#2563EB] focus:bg-white outline-none transition-all uppercase shadow-sm"
                                 />
                                 {i === 3 && <div className="w-4 h-0.5 bg-slate-300 self-center rounded-full" />}
                              </React.Fragment>
                           ))}
                        </div>

                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl mb-8 flex gap-3">
                           <div className="p-1.5 bg-white rounded-lg shadow-sm h-fit"><HelpCircle size={14} className="text-blue-500" /></div>
                           <div className="text-xs text-blue-800">
                              <p className="font-bold mb-1">Demo Tip:</p>
                              <p>Use any 8 characters or try <strong>DEMO-1234</strong> to simulate a valid token.</p>
                           </div>
                        </div>

                        <button
                           onClick={handleTokenSubmit}
                           className="w-full h-14 bg-[#2563EB] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                        >
                           {tokenStatus === 'validating' ? 'Validating...' : 'Validate & Continue'}
                        </button>
                     </div>
                  ) : (
                     <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-10 shadow-xl animate-in zoom-in-95 duration-500">
                        <div className="text-center mb-8">
                           <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-100">
                              <CheckCircle2 size={40} />
                           </div>
                           <h2 className="text-2xl font-black text-slate-900">Token Validated!</h2>
                           <p className="text-slate-500 mt-1 text-sm font-bold">Review patient details before adding</p>
                        </div>

                        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 mb-8">
                           <div className="flex items-center gap-4 mb-6">
                              <div className="w-16 h-16 rounded-2xl bg-white border-2 border-slate-100 overflow-hidden shadow-sm">
                                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rivera" className="w-full h-full object-cover" />
                              </div>
                              <div>
                                 <h3 className="text-lg font-black text-slate-900">Aarav Kumar</h3>
                                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">7 years • Male • #DAI-8291</p>
                              </div>
                           </div>
                           <div className="space-y-3">
                              <div className="flex justify-between text-xs font-medium">
                                 <span className="text-slate-400 font-bold uppercase tracking-widest">Parent</span>
                                 <span className="text-slate-800 font-bold">Mrs. Priya Kumar (Mother)</span>
                              </div>
                              <div className="flex justify-between text-xs font-medium">
                                 <span className="text-slate-400 font-bold uppercase tracking-widest">School</span>
                                 <span className="text-slate-800 font-bold">Delhi Public School</span>
                              </div>
                              <div className="h-px bg-slate-200 my-2" />
                              <div className="flex gap-2">
                                 <span className="text-[10px] font-black text-green-600 bg-green-100 px-2 py-1 rounded uppercase tracking-widest">Full Access</span>
                                 <span className="text-[10px] font-black text-blue-600 bg-blue-100 px-2 py-1 rounded uppercase tracking-widest">Assessment</span>
                              </div>
                           </div>
                        </div>

                        <label className="flex items-start gap-3 p-4 border-2 border-slate-100 rounded-2xl cursor-pointer hover:border-blue-200 transition-all mb-8">
                           <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                           <span className="text-xs font-bold text-slate-600 leading-relaxed">
                              I confirm I will maintain patient confidentiality and comply with HIPAA regulations regarding this patient's data.
                           </span>
                        </label>

                        <div className="flex gap-4">
                           <button onClick={() => setTokenStatus('idle')} className="flex-1 h-12 border-2 border-slate-200 text-slate-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50">Back</button>
                           <button onClick={() => setShowSuccess(true)} className="flex-[2] h-12 bg-[#2563EB] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100">Accept & Add Patient</button>
                        </div>
                     </div>
                  )}
               </div>
            )}

            {/* MANUAL FLOW */}
            {method === 'manual' && !showSuccess && (
               <div className="flex flex-col lg:flex-row gap-8 animate-in slide-in-from-right-8 duration-500">

                  {/* Main Form */}
                  <div className="flex-1">
                     <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">

                        {/* Step 1: Basic Info */}
                        {manualStep === 1 && (
                           <div className="space-y-8 animate-in fade-in">
                              <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                 <div className="w-10 h-10 bg-blue-50 text-[#2563EB] rounded-xl flex items-center justify-center"><User size={20} /></div>
                                 Patient Information
                              </h2>

                              <div className="flex items-center gap-6">
                                 <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all">
                                    <Upload size={20} />
                                    <span className="text-[9px] font-black uppercase tracking-widest mt-1">Upload</span>
                                 </div>
                                 <div className="space-y-1">
                                    <p className="text-sm font-bold text-slate-700">Profile Photo</p>
                                    <p className="text-xs text-slate-400">JPG, PNG up to 5MB</p>
                                 </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">First Name *</label>
                                    <input type="text" value={formData.firstName} onChange={(e) => handleFormChange("firstName", e.target.value)} className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Name *</label>
                                    <input type="text" value={formData.lastName} onChange={(e) => handleFormChange("lastName", e.target.value)} className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date of Birth *</label>
                                    <input type="date" value={formData.dateOfBirth} onChange={(e) => handleFormChange("dateOfBirth", e.target.value)} className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gender *</label>
                                    <div className="flex gap-2">
                                       {['Male', 'Female', 'Other'].map(g => (
                                          <label key={g} className="flex-1 h-12 flex items-center justify-center bg-slate-50 border-2 border-slate-100 rounded-xl cursor-pointer hover:border-blue-200 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500 has-[:checked]:text-blue-700 transition-all">
                                             <input type="radio" name="gender" className="hidden" checked={formData.gender.toLowerCase() === g.toLowerCase()} onChange={() => handleFormChange("gender", g.toLowerCase())} />
                                             <span className="text-xs font-black uppercase tracking-widest">{g}</span>
                                          </label>
                                       ))}
                                    </div>
                                 </div>
                              </div>

                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Address *</label>
                                 <input type="text" placeholder="Street Address" value={formData.addressLine1} onChange={(e) => handleFormChange("addressLine1", e.target.value)} className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all mb-3" />
                                 <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="City" value={formData.city} onChange={(e) => handleFormChange("city", e.target.value)} className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" />
                                    <input type="text" placeholder="PIN Code" value={formData.pinCode} onChange={(e) => handleFormChange("pinCode", e.target.value)} className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" />
                                 </div>
                              </div>
                           </div>
                        )}

                        {/* Step 2: Medical History */}
                        {manualStep === 2 && (
                           <div className="space-y-8 animate-in fade-in">
                              <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                 <div className="w-10 h-10 bg-blue-50 text-[#2563EB] rounded-xl flex items-center justify-center"><Heart size={20} /></div>
                                 Medical History
                              </h2>

                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Concerns *</label>
                                 <textarea placeholder="Describe the main concerns, symptoms, or developmental delays..." value={formData.primaryConcerns} onChange={(e) => handleFormChange("primaryConcerns", e.target.value)} className="w-full h-32 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-slate-700 outline-none focus:border-blue-500 transition-all resize-none" />
                              </div>

                              <div className="space-y-4">
                                 <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={formData.hasExistingDiagnosis} onChange={(e) => handleFormChange('hasExistingDiagnosis', e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="text-sm font-bold text-slate-700">Patient has existing diagnosis</span>
                                 </label>
                                 {formData.hasExistingDiagnosis && (
                                    <div className="pl-8 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
                                       <input type="text" value={formData.existingDiagnosis} onChange={(e) => handleFormChange("existingDiagnosis", e.target.value)} placeholder="Diagnosis Name (e.g. ASD) *" className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" />
                                       <input type="text" value={formData.diagnosedBy} onChange={(e) => handleFormChange("diagnosedBy", e.target.value)} placeholder="Diagnosed By *" className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" />
                                    </div>
                                 )}
                              </div>

                              <div className="space-y-3">
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Developmental Milestones *</p>
                                 <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">First Words Age *</label>
                                       <input type="text" value={formData.firstWordsAge} onChange={(e) => handleFormChange("firstWordsAge", e.target.value)} placeholder="e.g., 18 months" className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Walking Age *</label>
                                       <input type="text" value={formData.walkingAge} onChange={(e) => handleFormChange("walkingAge", e.target.value)} placeholder="e.g., 14 months" className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" />
                                    </div>
                                 </div>
                              </div>
                           </div>
                        )}

                        {/* Step 3: Contacts */}
                        {manualStep === 3 && (
                           <div className="space-y-8 animate-in fade-in">
                              <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                 <div className="w-10 h-10 bg-blue-50 text-[#2563EB] rounded-xl flex items-center justify-center"><Phone size={20} /></div>
                                 Contact Information
                              </h2>

                              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                                 <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-2">Primary Guardian</h3>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name *</label>
                                       <input type="text" value={formData.guardianName} onChange={(e) => handleFormChange("guardianName", e.target.value)} className="w-full h-12 px-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500" />
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Relationship *</label>
                                       <select value={formData.guardianRelationship} onChange={(e) => handleFormChange("guardianRelationship", e.target.value)} className="w-full h-12 px-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500">
                                          <option value="">Select Relationship</option><option>Mother</option><option>Father</option><option>Guardian</option>
                                       </select>
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone *</label>
                                       <input type="tel" value={formData.guardianPhone} onChange={(e) => handleFormChange("guardianPhone", e.target.value)} className="w-full h-12 px-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500" />
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email *</label>
                                       <input type="email" value={formData.guardianEmail} onChange={(e) => handleFormChange("guardianEmail", e.target.value)} className="w-full h-12 px-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500" />
                                    </div>
                                 </div>
                              </div>

                              <div className="flex items-center gap-3">
                                 <input type="checkbox" checked={formData.addSchoolInfo} onChange={(e) => handleFormChange('addSchoolInfo', e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                 <span className="text-sm font-bold text-slate-600">Add School Information</span>
                              </div>
                              {formData.addSchoolInfo && (
                                 <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 space-y-3 animate-in fade-in">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                       <input type="text" value={formData.schoolName} onChange={(e) => handleFormChange("schoolName", e.target.value)} placeholder="School Name *" className="w-full h-12 px-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500" />
                                       <input type="text" value={formData.schoolGrade} onChange={(e) => handleFormChange("schoolGrade", e.target.value)} placeholder="Standard/Grade *" className="w-full h-12 px-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500" />
                                    </div>
                                    <input type="text" value={formData.schoolLocation} onChange={(e) => handleFormChange("schoolLocation", e.target.value)} placeholder="School Location *" className="w-full h-12 px-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500" />
                                 </div>
                              )}
                           </div>
                        )}

                        {/* Step 4: Consent */}
                        {manualStep === 4 && (
                           <div className="space-y-8 animate-in fade-in">
                              <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                 <div className="w-10 h-10 bg-blue-50 text-[#2563EB] rounded-xl flex items-center justify-center"><ShieldCheck size={20} /></div>
                                 Consent & Access
                              </h2>

                              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3">
                                 <Lock size={18} className="text-amber-600 shrink-0 mt-0.5" />
                                 <p className="text-xs font-bold text-amber-800 leading-relaxed">
                                    Parent consent is required before clinical assessment. Select how you want to proceed.
                                 </p>
                              </div>

                              <div className="space-y-4">
                                 <label className="flex items-start gap-4 p-4 rounded-2xl border-2 border-blue-500 bg-blue-50/20 cursor-pointer">
                                    <input type="radio" name="consent" checked={formData.consentStatus === 'digital_request'} onChange={() => handleFormChange('consentStatus', 'digital_request')} className="mt-1 w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500" />
                                    <div>
                                       <span className="block text-sm font-black text-slate-900">Send Digital Consent Request</span>
                                       <span className="text-xs font-medium text-slate-500 block mt-1">Send an email/SMS to parent with secure link</span>
                                       <div className="mt-3 flex gap-2">
                                          <span className="px-2 py-1 bg-white border border-blue-200 text-blue-600 rounded text-[10px] font-bold uppercase">To: priya@email.com</span>
                                       </div>
                                    </div>
                                 </label>

                                 <label className="flex items-start gap-4 p-4 rounded-2xl border-2 border-slate-100 hover:border-slate-300 cursor-pointer">
                                    <input type="radio" name="consent" checked={formData.consentStatus === 'upload_form'} onChange={() => handleFormChange('consentStatus', 'upload_form')} className="mt-1 w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500" />
                                    <div>
                                       <span className="block text-sm font-black text-slate-900">Upload Signed Form</span>
                                       <span className="text-xs font-medium text-slate-500 block mt-1">If you have a physical copy</span>
                                    </div>
                                 </label>

                                 <label className="flex items-start gap-4 p-4 rounded-2xl border-2 border-slate-100 hover:border-slate-300 cursor-pointer">
                                    <input type="radio" name="consent" checked={formData.consentStatus === 'pending'} onChange={() => handleFormChange('consentStatus', 'pending')} className="mt-1 w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500" />
                                    <div>
                                       <span className="block text-sm font-black text-slate-900">Mark as Pending</span>
                                       <span className="text-xs font-medium text-slate-500 block mt-1">Limited access until consent obtained</span>
                                    </div>
                                 </label>
                              </div>

                              <label className="flex items-start gap-3 mt-6">
                                 <input type="checkbox" checked={formData.hipaaAgreement || false} onChange={(e) => handleFormChange('hipaaAgreement', e.target.checked)} className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                 <span className="text-xs font-bold text-slate-600 leading-relaxed">
                                    I understand and agree to maintain patient confidentiality in accordance with HIPAA and professional ethical standards. *
                                 </span>
                              </label>
                           </div>
                        )}

                        {/* Step 5: Review */}
                        {manualStep === 5 && (
                           <div className="space-y-8 animate-in fade-in">
                              <h2 className="text-xl font-black text-slate-900">Review Information</h2>

                              <div className="space-y-4">
                                 <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className="flex justify-between items-center mb-2">
                                       <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Basic Info</h4>
                                       <button onClick={() => setManualStep(1)} className="text-[10px] font-bold text-blue-600 uppercase hover:underline">Edit</button>
                                    </div>
                                    <div className="flex items-center gap-4">
                                       <div className="w-12 h-12 bg-white rounded-xl border border-slate-200"></div>
                                       <div>
                                          <p className="text-sm font-black text-slate-900">{formData.firstName} {formData.lastName}</p>
                                          <p className="text-xs font-medium text-slate-500">7 years • Male</p>
                                       </div>
                                    </div>
                                 </div>

                                 <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className="flex justify-between items-center mb-2">
                                       <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Contacts</h4>
                                       <button onClick={() => setManualStep(3)} className="text-[10px] font-bold text-blue-600 uppercase hover:underline">Edit</button>
                                    </div>
                                    <p className="text-sm font-bold text-slate-800">{formData.guardianName || "Not provided"} ({formData.guardianRelationship})</p>
                                    <p className="text-xs text-slate-500">{formData.guardianEmail || "No email"} • {formData.guardianPhone || "No phone"}</p>
                                 </div>

                                 <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className="flex justify-between items-center mb-2">
                                       <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Consent Status</h4>
                                       <button onClick={() => setManualStep(4)} className="text-[10px] font-bold text-blue-600 uppercase hover:underline">Edit</button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                       <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                                       <p className="text-sm font-bold text-slate-800">Digital Request Pending</p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        )}

                        {/* Footer Actions */}
                        <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-center">
                           <button onClick={handleManualBack} className="px-6 py-3 text-xs font-black text-slate-500 uppercase tracking-widest hover:text-slate-800 transition-colors">
                              {manualStep === 1 ? 'Cancel' : 'Back'}
                           </button>
                           <button
                              onClick={handleManualNext}
                              className="px-8 py-3 bg-[#2563EB] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2"
                           >
                              {manualStep === 5 ? 'Complete Registration' : 'Continue'} <ArrowRight size={14} />
                           </button>
                        </div>
                     </div>
                  </div>

                  {/* Right Sidebar */}
                  <div className="w-full lg:w-72 shrink-0 space-y-6">
                     <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Registration Progress</h3>
                        <div className="space-y-4">
                           {[1, 2, 3, 4, 5].map(s => (
                              <div key={s} className="flex items-center gap-3">
                                 <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 ${manualStep > s ? 'bg-green-500 border-green-500 text-white' :
                                    manualStep === s ? 'border-[#2563EB] text-[#2563EB]' : 'border-slate-200 text-slate-300'
                                    }`}>
                                    {manualStep > s ? <Check size={12} strokeWidth={4} /> : s}
                                 </div>
                                 <span className={`text-xs font-bold ${manualStep === s ? 'text-slate-900' : 'text-slate-400'}`}>
                                    {['Basic Info', 'Medical History', 'Contacts', 'Consent', 'Review'][s - 1]}
                                 </span>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Need Help?</h3>
                        <div className="space-y-3">
                           <p className="text-xs font-medium text-slate-300 leading-relaxed">
                              Can't find UDID? It's optional for initial registration but recommended for government benefits.
                           </p>
                           <button className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-white transition-colors">Read Guide →</button>
                        </div>
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
                  <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Patient Added Successfully!</h2>
                  <p className="text-lg text-slate-500 font-medium mb-10">{createdPatient?.first_name} {createdPatient?.last_name} is now in your caseload</p>

                  <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm mb-10">
                     <div className="flex items-center gap-6 mb-8 text-left">
                        <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${createdPatient?.first_name || 'Patient'}`} className="w-full h-full object-cover" />
                        </div>
                        <div>
                           <h3 className="text-xl font-black text-slate-900">{createdPatient?.first_name} {createdPatient?.last_name}</h3>
                           <p className="text-sm font-bold text-slate-500">#DAI-8291 • 7 years</p>
                           <div className="flex gap-2 mt-2">
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[9px] font-black uppercase tracking-widest">Active</span>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${method === 'token' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                 {method === 'token' ? 'Consent Verified' : 'Consent Pending'}
                              </span>
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button onClick={() => onFinish(createdPatient?.id)} className="h-14 bg-[#2563EB] text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">View Patient Profile</button>
                        <button className="h-14 border-2 border-slate-100 text-slate-600 rounded-xl text-sm font-black uppercase tracking-widest hover:border-slate-300 transition-all">Schedule Assessment</button>
                     </div>
                  </div>

                  <button onClick={() => { setShowSuccess(false); setMethod(null); setManualStep(1); }} className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600">
                     Add Another Patient
                  </button>
               </div>
            )}
         </div>
      </div>
   );
};

export default PatientOnboarding;














