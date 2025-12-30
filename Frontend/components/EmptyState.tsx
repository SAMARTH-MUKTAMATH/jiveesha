
import React from 'react';
import { 
  Plus, Search, Calendar, User, FileText, MessageSquare, 
  AlertTriangle, ClipboardList, BookOpen, UserPlus, FileQuestion,
  CheckCircle2, ArrowRight
} from 'lucide-react';

interface EmptyStateProps {
  type: 'patients' | 'appointments' | 'assessments' | 'reports' | 'messages' | 'interventions' | 'search' | 'filter' | 'done' | 'notes';
  onAction?: () => void;
  actionLabel?: string;
  secondaryAction?: () => void;
  secondaryLabel?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ type, onAction, actionLabel, secondaryAction, secondaryLabel }) => {
  const config = {
    patients: {
      icon: <UserPlus size={48} className="text-blue-500" />,
      title: "No Patients Yet",
      desc: "Add your first patient to start tracking progress and creating assessments.",
      bg: "bg-blue-50",
      color: "text-blue-600",
      action: "Add New Patient"
    },
    appointments: {
      icon: <Calendar size={48} className="text-green-500" />,
      title: "No Appointments Scheduled",
      desc: "Your calendar is clear. Schedule a session to get started.",
      bg: "bg-green-50",
      color: "text-green-600",
      action: "Schedule Session"
    },
    assessments: {
      icon: <ClipboardList size={48} className="text-purple-500" />,
      title: "No Assessments Completed",
      desc: "Start an assessment to establish a clinical baseline.",
      bg: "bg-purple-50",
      color: "text-purple-600",
      action: "Start Assessment"
    },
    reports: {
      icon: <FileText size={48} className="text-orange-500" />,
      title: "No Reports Generated",
      desc: "Create professional reports from your assessment data.",
      bg: "bg-orange-50",
      color: "text-orange-600",
      action: "Generate Report"
    },
    messages: {
      icon: <MessageSquare size={48} className="text-teal-500" />,
      title: "No Messages Yet",
      desc: "Start a conversation with parents or team members.",
      bg: "bg-teal-50",
      color: "text-teal-600",
      action: "New Message"
    },
    interventions: {
      icon: <BookOpen size={48} className="text-indigo-500" />,
      title: "No Active Interventions",
      desc: "Create a therapy plan to track goals and progress.",
      bg: "bg-indigo-50",
      color: "text-indigo-600",
      action: "Create Plan"
    },
    search: {
      icon: <Search size={48} className="text-slate-400" />,
      title: "No Results Found",
      desc: "We couldn't find anything matching your search. Try different keywords.",
      bg: "bg-slate-50",
      color: "text-slate-500",
      action: "Clear Search"
    },
    filter: {
      icon: <FileQuestion size={48} className="text-slate-400" />,
      title: "No Matches",
      desc: "No items match your current filters. Try adjusting them.",
      bg: "bg-slate-50",
      color: "text-slate-500",
      action: "Clear Filters"
    },
    done: {
      icon: <CheckCircle2 size={48} className="text-green-600" />,
      title: "All Caught Up!",
      desc: "You've completed all pending tasks. Great work!",
      bg: "bg-green-100",
      color: "text-green-700",
      action: "Go to Dashboard"
    },
    notes: {
      icon: <FileText size={48} className="text-blue-400" />,
      title: "No Notes Logged",
      desc: "Document your clinical observations and session details here.",
      bg: "bg-blue-50",
      color: "text-blue-600",
      action: "Log Session Note"
    }
  };

  const current = config[type];

  return (
    <div className="flex flex-col items-center justify-center text-center p-12 min-h-[400px] animate-in fade-in zoom-in-95 duration-500">
       <div className={`w-32 h-32 rounded-[2rem] flex items-center justify-center mb-8 ${current.bg} shadow-sm border-4 border-white`}>
          {current.icon}
       </div>
       <h3 className="text-2xl font-black text-slate-900 mb-3">{current.title}</h3>
       <p className="text-slate-500 font-medium max-w-sm mb-10 leading-relaxed">
          {current.desc}
       </p>
       
       <div className="flex flex-col sm:flex-row gap-4">
          {onAction && (
            <button 
              onClick={onAction}
              className={`h-12 px-8 rounded-xl font-black text-xs uppercase tracking-widest text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl flex items-center gap-2 bg-[#2563EB]`}
            >
               {actionLabel || current.action} <Plus size={16} strokeWidth={3} />
            </button>
          )}
          {secondaryAction && (
            <button 
              onClick={secondaryAction}
              className="h-12 px-8 rounded-xl font-black text-xs uppercase tracking-widest text-slate-500 border-2 border-slate-200 hover:border-slate-300 hover:text-slate-700 transition-all"
            >
               {secondaryLabel || 'Learn More'}
            </button>
          )}
       </div>

       <div className="mt-12 pt-8 border-t border-slate-50 w-full max-w-xs">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
             PRO TIP: {type === 'patients' ? 'Use tokens for quick add' : type === 'reports' ? 'Auto-generate from data' : 'Sync calendar for updates'}
          </p>
       </div>
    </div>
  );
};

export default EmptyState;
