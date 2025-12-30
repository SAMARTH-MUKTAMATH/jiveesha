
import React, { useState } from 'react';
import { Shield, ArrowLeft, ArrowRight, Upload, Calendar, Check, Stethoscope, Heart, X, Info } from 'lucide-react';

interface CredentialsNMCProps {
  onNext: () => void;
  onBack: () => void;
}

const CredentialsNMC: React.FC<CredentialsNMCProps> = ({ onNext, onBack }) => {
  const [files, setFiles] = useState<{ [key: string]: File | null }>({});
  const [isCertified, setIsCertified] = useState(false);

  const handleFileUpload = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [key]: e.target.files![0] }));
    }
  };

  const removeFile = (key: string) => {
    setFiles(prev => ({ ...prev, [key]: null }));
  };

  return (
    <div className="p-8 sm:p-10">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-sm font-semibold text-[#2563EB] flex items-center gap-1 hover:underline">
          <ArrowLeft size={16} /> Change License Type
        </button>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
          <Stethoscope className="text-[#2563EB]" size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 leading-tight">NMC Credential Verification</h2>
          <p className="text-slate-500">Enter your National Medical Commission registration details.</p>
        </div>
      </div>

      <form className="space-y-10" onSubmit={(e) => { e.preventDefault(); onNext(); }}>
        {/* Section 1 */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-6">NMC Registration Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">NMC Registration Number <span className="text-red-500">*</span></label>
              <input type="text" placeholder="e.g., 12345-NMC-2020" className="w-full h-12 px-4 rounded-lg border border-slate-300 outline-none focus:border-[#2563EB]" />
              <p className="mt-1.5 text-xs text-slate-500 italic">As on your Medical Council certificate</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">State Medical Council <span className="text-red-500">*</span></label>
              <select className="w-full h-12 px-4 rounded-lg border border-slate-300 bg-white outline-none focus:border-[#2563EB]">
                <option value="">Select state council</option>
                <option>Maharashtra Medical Council</option>
                <option>Delhi Medical Council</option>
                <option>Karnataka Medical Council</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Registration Year <span className="text-red-500">*</span></label>
              <input type="number" min="1970" max="2024" placeholder="YYYY" className="w-full h-12 px-4 rounded-lg border border-slate-300 outline-none focus:border-[#2563EB]" />
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-6">Medical Education</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Primary Medical Degree <span className="text-red-500">*</span></label>
              <select className="w-full h-12 px-4 rounded-lg border border-slate-300 bg-white outline-none focus:border-[#2563EB]">
                <option value="">Select degree</option>
                <option>MBBS</option><option>BDS</option><option>BAMS</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Year of Completion <span className="text-red-500">*</span></label>
              <input type="number" min="1970" max="2024" className="w-full h-12 px-4 rounded-lg border border-slate-300 outline-none focus:border-[#2563EB]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Medical College <span className="text-red-500">*</span></label>
              <input type="text" placeholder="e.g., AIIMS, New Delhi" className="w-full h-12 px-4 rounded-lg border border-slate-300 outline-none focus:border-[#2563EB]" />
            </div>
          </div>
        </div>

        {/* Uploads */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-4">Supporting Documents</h3>
          <div className="space-y-4">
            {[
              { id: 'nmc_cert', label: 'NMC/State Medical Council Certificate *' },
              { id: 'degree_cert', label: 'Medical Degree Certificate *' },
              { id: 'clinic_cert', label: 'Clinic Registration Certificate (Optional)', optional: true }
            ].map(upload => (
              <div key={upload.id}>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">{upload.label}</label>
                {files[upload.id] ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <span className="text-sm font-bold text-green-900 truncate max-w-[80%]">{files[upload.id]!.name}</span>
                    <button type="button" onClick={() => removeFile(upload.id)} className="text-slate-400 hover:text-red-500"><X size={18} /></button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-28 w-full border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 bg-white group transition-colors">
                    <Upload className="text-slate-400 group-hover:text-[#2563EB] mb-1" size={20} />
                    <span className="text-xs font-semibold text-slate-600">Click to upload or drag and drop</span>
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(upload.id, e)} />
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Info box */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-4">
          <Shield className="text-[#2563EB] shrink-0" size={24} />
          <div>
            <h4 className="text-sm font-bold text-blue-900">🔍 NMC Verification Process</h4>
            <p className="text-sm text-blue-800/80 leading-relaxed mt-1">
              We verify with the National Medical Commission database. This process usually takes 24-48 hours. Secure and confidential.
            </p>
          </div>
        </div>

        <label className="flex items-start gap-3 cursor-pointer group">
          <input type="checkbox" checked={isCertified} onChange={(e) => setIsCertified(e.target.checked)} className="mt-1" />
          <span className="text-sm text-slate-600 italic">I certify that I am a registered medical practitioner authorized to practice in India, and the information provided is accurate and complete.</span>
        </label>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button type="button" onClick={onBack} className="w-full sm:w-auto px-8 h-12 rounded-lg font-bold text-slate-600 border border-slate-300 hover:bg-slate-50 transition-colors">Previous</button>
          <button type="submit" className="flex-1 w-full h-12 rounded-lg font-bold text-white shadow-md bg-[#2563EB] hover:bg-blue-700 active:scale-[0.98]">Submit for Verification →</button>
        </div>
      </form>
    </div>
  );
};

export default CredentialsNMC;
