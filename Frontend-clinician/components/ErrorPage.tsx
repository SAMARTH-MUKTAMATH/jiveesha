
import React from 'react';
import { 
  Home, Search, RefreshCw, ArrowLeft, ArrowRight, Lock, AlertTriangle, 
  Clock, HelpCircle, Mail, Phone, FileText, ServerCrash, 
  ShieldAlert, Activity, WifiOff, FileQuestion, Key,
  ChevronRight, ExternalLink
} from 'lucide-react';

interface ErrorPageProps {
  code: 404 | 500 | 403 | 401 | 503 | 429;
  onBack?: () => void;
  onDashboard?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ code, onBack, onDashboard }) => {
  const timestamp = new Date().toLocaleString();
  const errorId = `${code}-${new Date().getTime().toString().slice(-8)}`;

  const config = {
    404: {
      title: "Page Not Found",
      desc: "The page you're looking for doesn't exist or may have been moved.",
      icon: <FileQuestion size={64} />,
      color: "text-blue-500",
      bg: "bg-blue-50",
      border: "border-blue-100",
      actions: [
        { label: "Return to Dashboard", icon: <Home size={18} />, primary: true, onClick: onDashboard },
        { label: "Search Content", icon: <Search size={18} /> },
      ]
    },
    500: {
      title: "Something Went Wrong",
      desc: "We're experiencing technical difficulties. Our team has been notified.",
      icon: <ServerCrash size={64} />,
      color: "text-orange-500",
      bg: "bg-orange-50",
      border: "border-orange-100",
      actions: [
        { label: "Refresh Page", icon: <RefreshCw size={18} />, primary: true, onClick: () => window.location.reload() },
        { label: "Contact Support", icon: <Mail size={18} /> },
      ]
    },
    403: {
      title: "Access Denied",
      desc: "You don't have permission to access this resource.",
      icon: <ShieldAlert size={64} />,
      color: "text-red-500",
      bg: "bg-red-50",
      border: "border-red-100",
      actions: [
        { label: "Switch Account", icon: <UserSwitch size={18} />, primary: true },
        { label: "Request Access", icon: <Lock size={18} /> },
      ]
    },
    401: {
      title: "Session Expired",
      desc: "Your session has expired for security reasons. Please sign in again.",
      icon: <Key size={64} />,
      color: "text-slate-500",
      bg: "bg-slate-100",
      border: "border-slate-200",
      actions: [
        { label: "Sign In Again", icon: <ArrowRight size={18} />, primary: true },
        { label: "Forgot Password?", icon: <HelpCircle size={18} /> },
      ]
    },
    503: {
      title: "System Maintenance",
      desc: "Daira is temporarily unavailable for scheduled maintenance.",
      icon: <Activity size={64} />,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      actions: [
        { label: "Check Status", icon: <ExternalLink size={18} />, primary: true },
        { label: "Try Again Later", icon: <Clock size={18} /> },
      ]
    },
    429: {
      title: "Slow Down",
      desc: "You've made too many requests. Please wait a moment.",
      icon: <WifiOff size={64} />,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-100",
      actions: [
        { label: "Wait & Retry", icon: <Clock size={18} />, primary: true },
        { label: "Contact Support", icon: <Phone size={18} /> },
      ]
    }
  };

  const current = config[code] || config[500];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
      {/* Top Nav Placeholder */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 z-50 flex items-center px-6 lg:px-12">
         <span className="text-xl font-bold text-[#1E40AF]">Daira</span>
      </div>

      <div className="max-w-2xl w-full text-center space-y-8 mt-10">
        {/* Illustration */}
        <div className={`w-40 h-40 mx-auto rounded-full flex items-center justify-center ${current.bg} ${current.color} shadow-xl border-4 border-white`}>
           {current.icon}
        </div>

        {/* Content */}
        <div className="space-y-4">
           <h1 className="text-6xl font-black text-slate-200 tracking-tighter">{code}</h1>
           <h2 className="text-3xl font-black text-slate-900">{current.title}</h2>
           <p className="text-lg text-slate-500 font-medium max-w-md mx-auto leading-relaxed">{current.desc}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
           {current.actions.map((action, i) => (
             <button 
               key={i}
               onClick={action.onClick}
               className={`h-12 px-8 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                 action.primary 
                   ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1' 
                   : 'bg-white border-2 border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800'
               }`}
             >
                {action.icon} {action.label}
             </button>
           ))}
           {onBack && (
             <button onClick={onBack} className="h-12 px-8 rounded-xl font-black text-sm uppercase tracking-widest bg-white border-2 border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800 transition-all">
                Go Back
             </button>
           )}
        </div>

        {/* Help Section */}
        <div className="mt-12 pt-8 border-t border-slate-200 max-w-lg mx-auto">
           <div className="flex flex-col items-center gap-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Need help?</p>
              <div className="flex gap-6">
                 <button className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#2563EB] transition-colors">
                    <Mail size={16} /> Contact Support
                 </button>
                 <button className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#2563EB] transition-colors">
                    <FileText size={16} /> Documentation
                 </button>
              </div>
           </div>
        </div>

        {/* Footer Meta */}
        <div className="text-[10px] font-mono text-slate-300 mt-8">
           Error ID: {errorId} • {timestamp}
        </div>
      </div>
    </div>
  );
};

// Helper for missing icon
const UserSwitch = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <polyline points="16 11 18 13 22 9" />
  </svg>
);

export default ErrorPage;