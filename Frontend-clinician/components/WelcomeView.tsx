
import React from 'react';
import { LogIn, UserPlus, ArrowRight } from 'lucide-react';

interface WelcomeViewProps {
  onLogin: () => void;
  onSignup: () => void;
}

const WelcomeView: React.FC<WelcomeViewProps> = ({ onLogin, onSignup }) => {
  return (
    <div className="w-full max-w-[480px] mx-auto mt-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Welcome to Daira</h1>
      <p className="text-lg text-slate-500 mb-10">Supporting your child's developmental journey</p>
      
      <div className="space-y-4">
        <button 
          onClick={onLogin}
          className="w-full flex items-center justify-between p-6 bg-white border-2 border-slate-200 rounded-2xl hover:border-[#2563EB] hover:shadow-xl hover:-translate-y-1 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-[#2563EB] rounded-xl group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
              <LogIn size={24} />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-slate-800">Sign In</h3>
              <p className="text-sm text-slate-500">Access your professional account</p>
            </div>
          </div>
          <ArrowRight className="text-slate-300 group-hover:text-[#2563EB] transition-colors" />
        </button>

        <button 
          onClick={onSignup}
          className="w-full flex items-center justify-between p-6 bg-[#2563EB] text-white border-2 border-[#2563EB] rounded-2xl hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all group shadow-lg shadow-blue-200"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 text-white rounded-xl transition-colors">
              <UserPlus size={24} />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold">Create Account</h3>
              <p className="text-sm text-blue-100">Join our community of professionals</p>
            </div>
          </div>
          <ArrowRight className="text-white/70 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="mt-12 p-6 border-t border-slate-200">
        <p className="text-slate-500 text-sm">
          New to Daira? <a href="#" className="text-[#2563EB] font-bold hover:underline">Learn how it works →</a>
        </p>
      </div>
    </div>
  );
};

export default WelcomeView;
