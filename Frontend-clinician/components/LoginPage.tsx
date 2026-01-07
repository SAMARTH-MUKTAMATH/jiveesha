
import React, { useState } from 'react';
import logo from '@common/logo.png';
import { Briefcase, Eye, EyeOff, Mail, Lock, Shield, Clock, ArrowRight, Loader2, XCircle } from 'lucide-react';
import { apiClient } from '../services/api';

interface LoginPageProps {
  onBack: () => void;
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBack, onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('demo@daira.health');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.login(email, password);

      if (response.success) {
        onLoginSuccess();
      } else {
        setError(response.error?.message || 'Login failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.error?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 sm:p-10 animate-in fade-in slide-in-from-top-4 duration-500 max-w-[440px] mx-auto">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="mb-4">
          <img src={logo} alt="Daira Logo" className="h-20 w-auto" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Welcome Back</h2>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-slate-600 text-sm font-medium mb-1">
          <Mail size={14} className="text-slate-400" />
          <span>{email}</span>
        </div>
        <button onClick={onBack} className="text-xs font-bold text-[#2563EB] hover:underline uppercase tracking-wider">Change account</button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3 text-red-700 animate-in shake duration-300">
          <XCircle className="shrink-0" size={20} />
          <div className="text-sm">
            <p className="font-bold">{error}</p>
            <button className="text-red-800 font-bold hover:underline mt-1">Need help? Contact support</button>
          </div>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleLogin}>
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full h-12 pl-4 pr-10 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <button type="button" className="text-xs font-bold text-[#2563EB] hover:underline uppercase tracking-wider">Forgot password?</button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your secure password"
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
          <p className="text-xs text-slate-400 mt-1">Demo: Demo@123</p>
        </div>

        <label className="flex items-center gap-3 cursor-pointer group">
          <input type="checkbox" className="w-4 h-4 rounded text-[#2563EB] border-slate-300 focus:ring-[#2563EB]" />
          <div className="text-sm">
            <span className="font-medium text-slate-700">Keep me signed in on this device</span>
            <p className="text-[11px] text-slate-400">Not recommended on shared computers</p>
          </div>
        </label>

        <button
          type="submit"
          disabled={loading}
          className={`w-full h-12 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all
            ${loading
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-[#2563EB] hover:bg-blue-700 hover:shadow-blue-200 active:scale-[0.98]'}`}
        >
          {loading ? (
            <><Loader2 className="animate-spin" size={20} /> Signing in...</>
          ) : (
            <><Lock size={18} /> Secure Login</>
          )}
        </button>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-bold tracking-widest">OR</span></div>
        </div>

        <button type="button" className="w-full h-12 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all flex flex-col items-center justify-center gap-0 leading-tight">
          Login with OTP
          <span className="text-[10px] text-slate-400 font-medium">Receive a one-time password via SMS</span>
        </button>
      </form>

      {/* Verification Notice */}
      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-4">
        <Shield className="text-[#2563EB] shrink-0" size={24} />
        <div>
          <h4 className="text-sm font-bold text-blue-900">Verification Required</h4>
          <p className="text-xs text-blue-800/70 leading-relaxed mt-0.5">
            Professional access requires license verification. Approved accounts can login directly.
          </p>
          <div className="mt-2 text-xs font-bold text-green-600 flex items-center gap-1">
            ✓ Your status: Verified
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center text-center gap-1.5">
          <Lock size={14} className="text-slate-400" />
          <span className="text-[9px] font-bold text-slate-400 uppercase leading-tight tracking-wider">End-to-end encryption</span>
        </div>
        <div className="flex flex-col items-center text-center gap-1.5">
          <Shield size={14} className="text-slate-400" />
          <span className="text-[9px] font-bold text-slate-400 uppercase leading-tight tracking-wider">2FA Available</span>
        </div>
        <div className="flex flex-col items-center text-center gap-1.5">
          <Clock size={14} className="text-slate-400" />
          <span className="text-[9px] font-bold text-slate-400 uppercase leading-tight tracking-wider">Session timeout: 30 min</span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button className="text-sm font-medium text-slate-500 hover:text-[#2563EB] transition-colors group">
          Not a professional? <span className="font-bold">Go to Parent & Guardian Login</span> <ArrowRight className="inline-block group-hover:translate-x-1 transition-transform" size={14} />
        </button>
      </div>

      <div className="mt-12 flex justify-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-t border-slate-50 pt-6">
        <a href="#" className="hover:text-slate-600 transition-colors">Help Center</a>
        <span className="opacity-20">|</span>
        <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
      </div>
    </div>
  );
};

export default LoginPage;
