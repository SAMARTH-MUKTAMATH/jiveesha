
import React, { useState } from 'react';
import { Stethoscope, Eye, EyeOff, Lock, ShieldCheck, Mail, ArrowRight } from 'lucide-react';

interface SignupFormProps {
  onNext: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onNext }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  // Simple password strength logic
  const getStrength = () => {
    if (!password) return { label: 'Weak', color: 'bg-slate-200', width: '0%' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;

    if (score === 1) return { label: 'Weak', color: 'bg-red-500', width: '33.33%' };
    if (score === 2) return { label: 'Medium', color: 'bg-orange-500', width: '66.66%' };
    return { label: 'Strong', color: 'bg-green-500', width: '100%' };
  };

  const strength = getStrength();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Proceed regardless of "agreed" state for prototype
    onNext();
  };

  return (
    <div className="p-8 sm:p-10">
      {/* Form Header */}
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <Stethoscope className="text-[#2563EB]" size={32} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Professional Account</h2>
        <p className="text-slate-600">Step 1 of 3: Let's start with your basic details.</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Dr. Jane Doe"
            className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
          />
          <p className="mt-1.5 text-xs text-slate-500 italic">Include prefix (Dr./Prof.) if applicable</p>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Professional Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="email"
              placeholder="jane.doe@clinic.com"
              className="w-full h-12 pl-4 pr-10 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
            />
            <Mail className="absolute right-3 top-3.5 text-slate-400" size={18} />
          </div>
          <p className="mt-1.5 text-xs text-slate-500 italic">Use your professional/institutional email</p>
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            <select className="w-[120px] h-12 px-3 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all text-sm">
              <option value="us">🇺🇸 US +1</option>
              <option value="uk">🇬🇧 UK +44</option>
              <option value="in">🇮🇳 IN +91</option>
            </select>
            <input
              type="tel"
              placeholder="(555) 000-0000"
              className="flex-1 h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
            />
          </div>
          <p className="mt-1.5 text-xs text-slate-500 italic">We'll send verification codes here</p>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Create Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 pl-4 pr-10 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          {/* Strength Bar */}
          <div className="mt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Strength: {strength.label}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${strength.color}`} 
                style={{ width: strength.width }}
              />
            </div>
          </div>

          <ul className="mt-3 space-y-1">
            <li className={`text-xs flex items-center gap-1.5 ${password.length >= 8 ? 'text-green-600' : 'text-slate-400'}`}>
              <div className={`w-1 h-1 rounded-full ${password.length >= 8 ? 'bg-green-600' : 'bg-slate-400'}`} />
              At least 8 characters
            </li>
            <li className={`text-xs flex items-center gap-1.5 ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-slate-400'}`}>
              <div className={`w-1 h-1 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-600' : 'bg-slate-400'}`} />
              One uppercase letter
            </li>
            <li className={`text-xs flex items-center gap-1.5 ${/[0-9]/.test(password) ? 'text-green-600' : 'text-slate-400'}`}>
              <div className={`w-1 h-1 rounded-full ${/[0-9]/.test(password) ? 'bg-green-600' : 'bg-slate-400'}`} />
              One number
            </li>
          </ul>
        </div>

        {/* Agreement */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
          />
          <span className="text-sm text-slate-600 leading-tight">
            I agree to Daira's <a href="#" className="text-[#2563EB] hover:underline">Terms of Service</a> and <a href="#" className="text-[#2563EB] hover:underline">Privacy Policy</a>.
          </span>
        </label>

        {/* Security Badges */}
        <div className="flex items-center justify-center gap-8 py-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 tracking-widest uppercase">
            <Lock size={14} className="text-slate-400" />
            256-BIT SSL SECURE
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 tracking-widest uppercase">
            <ShieldCheck size={14} className="text-slate-400" />
            HIPAA COMPLIANT
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            type="submit"
            className="w-full h-12 rounded-lg font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-[0.98]"
          >
            Next: Verification <ArrowRight size={20} />
          </button>
          
          <div className="text-center">
            <span className="text-sm text-slate-500">
              Already have an account?{' '}
              <button type="button" className="text-[#2563EB] font-bold hover:underline">Sign In</button>
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
