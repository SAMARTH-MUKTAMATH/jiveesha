
import React from 'react';
import { ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

const TrustBadges: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-6 border-t border-slate-200">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        <CheckCircle2 size={14} className="text-green-500" />
        <span>NIEPID Validated</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        <ShieldCheck size={14} className="text-blue-500" />
        <span>HIPAA Compliant</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        <Lock size={14} className="text-orange-500" />
        <span>Secure & Private</span>
      </div>
    </div>
  );
};

export default TrustBadges;
