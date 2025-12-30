
import React, { useEffect, useState } from 'react';
import { CheckCircle2, UserPlus, Calendar, Search, ArrowRight, Star, ExternalLink, GraduationCap, ShieldCheck, Smartphone } from 'lucide-react';

interface VerificationApprovedProps {
  onDashboard?: () => void;
}

const VerificationApproved: React.FC<VerificationApprovedProps> = ({ onDashboard }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative overflow-hidden pt-10 pb-20 px-4 sm:px-6">
      {/* Celebration Effect Layer */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-0">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className={`absolute w-2 h-2 rounded-full opacity-60 animate-bounce`} 
              style={{ 
                left: `${Math.random() * 100}%`, 
                top: `${-10 - Math.random() * 20}%`,
                backgroundColor: ['#2563EB', '#22C55E', '#F97316', '#EF4444'][i % 4],
                animationDuration: `${2 + Math.random() * 3}s`,
                animationDelay: `${Math.random() * 2}s`
              }} 
            />
          ))}
        </div>
      )}

      <div className="max-w-[640px] mx-auto text-center relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl mb-8 animate-in zoom-in duration-500">
            <CheckCircle2 className="text-green-500" size={80} strokeWidth={2} />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">🎉 Welcome to Daira, Dr. Rivera!</h1>
          <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
            Your account has been verified and activated. You're all set to start helping children!
          </p>
        </div>

        {/* Badge Card */}
        <div className="bg-white rounded-3xl p-1 border-2 border-green-400/30 shadow-[0_0_40px_rgba(34,197,94,0.15)] mb-12">
          <div className="bg-gradient-to-br from-green-50 to-white rounded-[22px] px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-200">
                <ShieldCheck size={28} />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-bold text-green-600 uppercase tracking-widest mb-0.5">Verified Professional</div>
                <h3 className="text-lg font-bold text-slate-800">RCI Registration: RCI/12345/2020</h3>
                <p className="text-sm text-slate-500 font-medium">Clinical Psychology • Oct 25, 2024</p>
              </div>
            </div>
            <div className="flex flex-col items-center sm:items-end">
              <div className="flex gap-0.5 mb-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
              </div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider">TRUST SCORE: <span className="text-green-600">100/100</span></span>
            </div>
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="text-left mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 px-2">Get Started in 3 Steps</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: <UserPlus className="text-blue-600" size={24} />, title: 'Add Your First Patient', desc: 'Start by adding a patient via token or registration', btn: 'Add Patient' },
              { icon: <Calendar className="text-blue-600" size={24} />, title: 'Complete Your Profile', desc: 'Add availability, hours, and practice details', btn: 'Setup Profile' },
              { icon: <Search className="text-blue-600" size={24} />, title: 'Explore Assessment Tools', desc: 'Familiarize yourself with ISAA, GLAD, and NABS', btn: 'View Tools' }
            ].map((card, i) => (
              <div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all flex flex-col h-full">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">{card.icon}</div>
                <h4 className="font-bold text-slate-900 mb-2 leading-tight">{card.title}</h4>
                <p className="text-xs text-slate-500 mb-6 flex-grow leading-relaxed">{card.desc}</p>
                <button className="w-full py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-widest">{card.btn}</button>
              </div>
            ))}
          </div>
        </div>

        {/* Features List */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 text-left mb-12">
          <h3 className="text-lg font-bold text-slate-900 mb-6">What you can do now:</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
            {[
              'Conduct clinical diagnostics (ISAA, GLAD, NABS)',
              'Create evidence-based IEPs',
              'Manage patient interventions',
              'Generate clinical reports',
              'Secure messaging with parents',
              'Access national clinical resources'
            ].map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                <div className="mt-0.5 p-0.5 bg-green-100 rounded-full text-green-600"><CheckCircle2 size={14} /></div>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Onboarding Tour */}
        <div className="bg-gradient-to-r from-[#1E40AF] to-[#2563EB] rounded-3xl p-8 text-white text-left mb-12 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap size={24} />
              <h3 className="text-xl font-bold">Take a 5-Minute Tour</h3>
            </div>
            <p className="text-blue-100 text-sm opacity-90 leading-relaxed">Get familiar with the platform through our guided walkthrough and unlock your first achievement badge.</p>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-8 py-4 bg-white text-[#2563EB] font-bold rounded-xl hover:bg-blue-50 transition-colors whitespace-nowrap">Start Tour</button>
            <button className="text-white/80 font-semibold hover:text-white transition-colors">Skip for Now</button>
          </div>
        </div>

        {/* Action Button */}
        <div className="space-y-6">
          <button 
            onClick={onDashboard}
            className="w-full h-16 bg-[#2563EB] text-white text-lg font-bold rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            Go to Dashboard <ArrowRight size={24} />
          </button>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
            <button className="hover:text-blue-600 transition-colors">Complete My Profile</button>
            <button className="hover:text-blue-600 transition-colors">Browse Clinical Library</button>
            <button className="hover:text-blue-600 transition-colors">Contact Support</button>
          </div>
        </div>

        {/* Support Box */}
        <div className="mt-20 p-8 border-t border-slate-100 text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Need help getting started?</p>
          <p className="text-slate-500 font-medium mb-4">Our clinical support team is available 24/7</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-slate-700 font-bold">
            <a href="tel:+918012345678" className="flex items-center gap-2 hover:text-[#2563EB] transition-colors">
              <span className="p-2 bg-slate-50 rounded-lg"><Smartphone size={18} /></span> +91 80 1234 5678
            </a>
            <a href="mailto:support@daira.health" className="flex items-center gap-2 hover:text-[#2563EB] transition-colors">
              <span className="p-2 bg-slate-50 rounded-lg"><ExternalLink size={18} /></span> support@daira.health
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationApproved;
