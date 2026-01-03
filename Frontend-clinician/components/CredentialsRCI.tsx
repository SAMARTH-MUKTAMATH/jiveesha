
import React, { useState } from 'react';
import { Shield, ArrowLeft, ArrowRight, Upload, FileText, Calendar, Check, GraduationCap, X, HelpCircle } from 'lucide-react';

interface CredentialsRCIProps {
  onNext: () => void;
  onBack: () => void;
}

const CredentialsRCI: React.FC<CredentialsRCIProps> = ({ onNext, onBack }) => {
  const [rciNumber, setRciNumber] = useState('');
  const [files, setFiles] = useState<{ [key: string]: File | null }>({});
  const [isCertified, setIsCertified] = useState(false);

  const isValidRci = /^RCI\/\d+\/\d{4}$/.test(rciNumber);

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
          <Shield className="text-[#2563EB]" size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 leading-tight">RCI Credential Verification</h2>
          <p className="text-slate-500">Enter your Rehabilitation Council of India registration details.</p>
        </div>
      </div>

      <form className="space-y-10" onSubmit={(e) => { e.preventDefault(); onNext(); }}>
        {/* Section 1 */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-6">Registration Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                RCI Registration Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g., RCI/12345/2020"
                  value={rciNumber}
                  onChange={(e) => setRciNumber(e.target.value)}
                  className={`w-full h-12 pl-4 pr-10 rounded-lg border outline-none transition-all ${isValidRci ? 'border-green-500 ring-2 ring-green-500/10' : 'border-slate-300 focus:border-[#2563EB]'}`}
                />
                {isValidRci && <Check className="absolute right-3 top-3.5 text-green-500" size={18} />}
              </div>
              <p className="mt-1.5 text-xs text-slate-500">Format: RCI/[Number]/[Year]. Found on your RCI certificate.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Registration Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input type="date" className="w-full h-12 px-4 rounded-lg border border-slate-300 outline-none focus:border-[#2563EB]" />
                <Calendar className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Issuing Authority/State Council <span className="text-red-500">*</span>
              </label>
              <select className="w-full h-12 px-4 rounded-lg border border-slate-300 bg-white outline-none focus:border-[#2563EB]">
                <option value="">Select issuing state</option>
                <option value="central">Central RCI</option>
                <option value="mh">Maharashtra</option>
                <option value="ka">Karnataka</option>
                <option value="dl">Delhi</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-3">Professional Category <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['Clinical Psychologist (RCP)', 'Speech & Language Pathologist (SLP)', 'Occupational Therapist (OT)', 'Special Educator', 'Rehabilitation Psychologist'].map(cat => (
                  <label key={cat} className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input type="radio" name="category" className="text-[#2563EB]" />
                    <span className="text-sm text-slate-700">{cat}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-6">Educational Background</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Highest Degree <span className="text-red-500">*</span></label>
              <select className="w-full h-12 px-4 rounded-lg border border-slate-300 bg-white outline-none focus:border-[#2563EB]">
                <option value="">Select degree</option>
                <option>M.Phil Clinical Psychology</option>
                <option>PhD Psychology</option>
                <option>M.Sc. Speech & Language Pathology</option>
                <option>M.Sc. Occupational Therapy</option>
                <option>B.Ed. Special Education</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Institution/University <span className="text-red-500">*</span></label>
              <input type="text" placeholder="e.g., NIMHANS, Bangalore" className="w-full h-12 px-4 rounded-lg border border-slate-300 outline-none focus:border-[#2563EB]" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Year of Completion <span className="text-red-500">*</span></label>
              <input type="number" min="1990" max="2024" placeholder="YYYY" className="w-full h-12 px-4 rounded-lg border border-slate-300 outline-none focus:border-[#2563EB]" />
            </div>
          </div>
        </div>

        {/* Section 3 Uploads */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-4">Supporting Documents</h3>
          <div className="bg-blue-50/50 p-4 rounded-xl flex gap-3 mb-6">
            <FileText className="text-blue-600 shrink-0" size={20} />
            <div className="text-sm text-blue-800">
              <p className="font-bold mb-1">Please upload the following:</p>
              <ul className="list-disc list-inside space-y-0.5 opacity-90">
                <li>RCI Registration Certificate (Required)</li>
                <li>Degree Certificate (Required)</li>
                <li>Photo ID Proof (Optional but recommended)</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { id: 'rci_cert', label: 'Upload RCI Certificate *', icon: <Shield size={18} /> },
              { id: 'degree_cert', label: 'Upload Degree Certificate *', icon: <GraduationCap size={18} /> },
              { id: 'id_proof', label: 'Upload Photo ID (Optional)', icon: <FileText size={18} />, optional: true }
            ].map(upload => (
              <div key={upload.id}>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{upload.label}</label>
                {files[upload.id] ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500 text-white rounded-md"><Check size={16} /></div>
                      <div>
                        <p className="text-sm font-bold text-green-900">{files[upload.id]!.name}</p>
                        <p className="text-[10px] text-green-700">{(files[upload.id]!.size / 1024 / 1024).toFixed(2)} MB • PDF/IMG</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => removeFile(upload.id)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={18} /></button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-32 w-full border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors bg-white group">
                    <Upload className="text-slate-400 group-hover:text-[#2563EB] mb-2" size={24} />
                    <span className="text-sm font-semibold text-slate-600">Click to upload or drag and drop</span>
                    <span className="text-[11px] text-slate-400 mt-1">PDF, JPG, PNG up to 5MB</span>
                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileUpload(upload.id, e)} />
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Verification Timeline Info */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-4">
          <Calendar className="text-slate-400 shrink-0" size={24} />
          <div>
            <h4 className="text-sm font-bold text-slate-700">Verification Timeline</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              RCI credentials are typically verified within 24-48 hours. You'll receive an email once verification is complete.
            </p>
          </div>
        </div>

        {/* Consent */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={isCertified}
            onChange={(e) => setIsCertified(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
          />
          <span className="text-sm text-slate-600 leading-relaxed italic">
            I certify that the information provided is accurate and I am authorized to practice in my declared specialization. I understand that providing false information may result in account termination.
          </span>
        </label>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button type="button" onClick={onBack} className="w-full sm:w-auto px-8 h-12 rounded-lg font-bold text-slate-600 border border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
            <ArrowLeft size={20} /> Previous
          </button>
          <button 
            type="submit"
            className="flex-1 w-full h-12 rounded-lg font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all bg-[#2563EB] hover:bg-blue-700 active:scale-[0.98]"
          >
            Submit for Verification <ArrowRight size={20} />
          </button>
        </div>
        
        <div className="text-center">
          <button type="button" className="text-sm text-slate-400 font-semibold hover:text-[#2563EB] transition-colors">Save as Draft</button>
        </div>
      </form>

      {/* Help Section */}
      <div className="mt-12 border-t border-slate-100 pt-8">
        <button type="button" className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors w-full text-left font-medium">
          <HelpCircle size={18} />
          <span>Need help finding your RCI number?</span>
        </button>
      </div>
    </div>
  );
};

export default CredentialsRCI;
