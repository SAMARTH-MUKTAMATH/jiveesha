
import React, { useState } from 'react';
import { Shield, AlertCircle, Info, ArrowLeft, ArrowRight, BookOpen, HeartPulse, GraduationCap, ChevronDown } from 'lucide-react';

interface VerificationStepProps {
  onNext: (type?: string) => void;
  onBack: () => void;
}

const VerificationStep: React.FC<VerificationStepProps> = ({ onNext, onBack }) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [specialization, setSpecialization] = useState('');

  const licenseTypes = [
    {
      id: 'rci',
      icon: <GraduationCap size={24} />,
      title: "RCI Registered",
      subtitle: "Rehabilitation Council of India",
      description: "For Clinical Psychologists, Special Educators, Speech & Language Pathologists, Occupational Therapists",
      badge: "RCI Registration Number"
    },
    {
      id: 'nmc',
      icon: <HeartPulse size={24} />,
      title: "NMC Registered",
      subtitle: "National Medical Commission",
      description: "For Pediatricians, Psychiatrists, Neurologists, Developmental Pediatricians",
      badge: "NMC Registration Number"
    },
    {
      id: 'other',
      icon: <BookOpen size={24} />,
      title: "Other License",
      subtitle: "International or Other Certification",
      description: "For internationally certified professionals or other recognized credentials",
      badge: "Manual Review Required",
      note: "Verification may take 3-5 business days"
    }
  ];

  const specializations = [
    "Clinical Psychology",
    "Developmental Pediatrics",
    "Speech-Language Pathology",
    "Occupational Therapy",
    "Special Education",
    "Child Psychiatry",
    "Behavioral Therapy",
    "Applied Behavior Analysis (ABA)",
    "Educational Psychology",
    "Other"
  ];

  return (
    <div className="p-8 sm:p-10">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <Shield className="text-[#2563EB]" size={32} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Professional Verification</h2>
        <p className="text-slate-600">Select your professional license type to begin verification.</p>
      </div>

      <div className="bg-[#FFFBEB] border border-amber-200 rounded-xl p-4 mb-10 flex gap-4">
        <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="text-sm font-bold text-amber-800 leading-tight">⚠ Verification Required</h4>
          <p className="text-sm text-amber-700 leading-relaxed mt-0.5">
            All professionals must be RCI/NMC verified before accessing patient data.
          </p>
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-[20px] font-semibold text-slate-800 mb-6">Select Your Professional License</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {licenseTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`text-left p-6 rounded-xl border-2 transition-all flex flex-col h-full group
                ${selectedType === type.id 
                  ? 'border-[#2563EB] bg-blue-50/30' 
                  : 'border-slate-200 hover:border-blue-300 bg-white shadow-sm'}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${selectedType === type.id ? 'bg-[#2563EB] text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-[#2563EB]'}`}>
                  {type.icon}
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                  ${selectedType === type.id ? 'border-[#2563EB] bg-[#2563EB]' : 'border-slate-300'}`}>
                  {selectedType === type.id && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
              
              <h4 className="text-[18px] font-bold text-slate-900 leading-tight mb-1">{type.title}</h4>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{type.subtitle}</p>
              <p className="text-sm text-slate-500 mb-4 flex-grow leading-relaxed">{type.description}</p>
              
              <div className="flex flex-col gap-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600 w-fit">
                  {type.badge}
                </span>
                {type.note && (
                  <p className="text-[11px] text-amber-600 font-medium italic">{type.note}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className={`transition-all duration-300 ${selectedType ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'}`}>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Primary Specialization <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select 
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="w-full h-12 px-4 pr-10 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all appearance-none text-slate-800"
          >
            <option value="" disabled>Select a specialization...</option>
            {specializations.map(spec => (
              <option key={spec} value={spec.toLowerCase()}>{spec}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={20} />
        </div>
      </div>

      <div className="border-t border-slate-100 pt-8 mt-10">
        <button 
          onClick={() => setIsAccordionOpen(!isAccordionOpen)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors w-full text-left font-medium"
        >
          <Info size={18} />
          <span>Why do we verify credentials?</span>
          <ChevronDown className={`ml-auto transition-transform ${isAccordionOpen ? 'rotate-180' : ''}`} size={18} />
        </button>
        {isAccordionOpen && (
          <div className="mt-4 p-5 bg-slate-50 rounded-xl border border-slate-100 animate-in fade-in slide-in-from-top-2">
            <p className="text-sm text-slate-600 leading-relaxed">
              Patient safety and data security are our top priorities. Credential verification ensures that only qualified professionals access clinical tools and sensitive patient information. This process typically takes 24-48 hours.
            </p>
          </div>
        )}
      </div>

      <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={onBack}
          className="w-full sm:w-auto px-8 h-12 rounded-lg font-bold text-slate-600 border border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft size={20} /> Previous
        </button>
        <button
          onClick={() => onNext(selectedType || 'rci')}
          className="flex-1 w-full h-12 rounded-lg font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all bg-[#2563EB] hover:bg-blue-700 active:scale-[0.98]"
        >
          Continue to Credentials <ArrowRight size={20} />
        </button>
      </div>

      <div className="text-center mt-6">
        <button className="text-sm text-slate-400 hover:text-[#2563EB] font-medium transition-colors underline decoration-dotted underline-offset-4">
          Not sure which license type? Contact Support
        </button>
      </div>
    </div>
  );
};

export default VerificationStep;
