import React, { useState } from 'react';
import {
    Clock,
    Flag,
    FileWarning,
    TimerOff,
    List,
    RefreshCw,
    MoreVertical,
    Filter,
    History,
    Info,
    Eye,
    FileEdit,
    BellPlus,
    User,
    Users,
    Server,
    AlertTriangle,
    GraduationCap
} from 'lucide-react';

interface ExceptionsEscalationsProps {
    onViewCase?: (caseId: string) => void;
    user?: any;
}

interface StatusTag {
    label: string;
    color: 'amber' | 'red' | 'blue' | 'slate' | 'gray';
    icon?: string;
}

interface ExceptionCase {
    id: string;
    studentId: string;
    phase: string;
    phaseColor: 'blue' | 'slate' | 'indigo' | 'purple';
    issueType: string;
    daysPending: number;
    responsibleRole: 'Teacher' | 'Parent' | 'System';
    roleIcon: string;
    statusTags: StatusTag[];
    isCritical?: boolean;
}

const ExceptionsEscalations: React.FC<ExceptionsEscalationsProps> = ({ onViewCase, user }) => {
    // Mock Data
    const [exceptions] = useState<ExceptionCase[]>([
        {
            id: '1',
            studentId: '#8392-XT',
            phase: 'Phase 2',
            phaseColor: 'blue',
            issueType: 'Phase 4 Retry Pending',
            daysPending: 2,
            responsibleRole: 'Teacher',
            roleIcon: 'person',
            statusTags: [
                { label: 'Teacher Pending', color: 'amber' }
            ]
        },
        {
            id: '2',
            studentId: '#9921-AB',
            phase: 'Phase 1',
            phaseColor: 'slate',
            issueType: 'Consent Delay',
            daysPending: 15,
            responsibleRole: 'Parent',
            roleIcon: 'family_restroom',
            statusTags: [
                { label: 'SLA Breach', color: 'red', icon: 'warning' },
                { label: 'High Risk', color: 'gray' }
            ],
            isCritical: true
        },
        {
            id: '3',
            studentId: '#1023-CD',
            phase: 'Phase 3',
            phaseColor: 'indigo',
            issueType: 'System Flag',
            daysPending: 1,
            responsibleRole: 'System',
            roleIcon: 'dns',
            statusTags: [
                { label: 'Review Needed', color: 'blue' }
            ]
        },
        {
            id: '4',
            studentId: '#4552-KL',
            phase: 'Phase 4',
            phaseColor: 'purple',
            issueType: 'Below Threshold',
            daysPending: 0,
            responsibleRole: 'System',
            roleIcon: 'dns',
            statusTags: [
                { label: 'Auto-Flagged', color: 'slate' }
            ]
        },
        {
            id: '5',
            studentId: '#7712-OP',
            phase: 'Phase 1',
            phaseColor: 'slate',
            issueType: 'Parent Pending',
            daysPending: 5,
            responsibleRole: 'Parent',
            roleIcon: 'family_restroom',
            statusTags: [
                { label: 'Reminder Sent (1)', color: 'amber' }
            ]
        }
    ]);

    // Helper to get phase styling
    const getPhaseStyles = (color: string) => {
        switch (color) {
            case 'blue': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'indigo': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
            case 'purple': return 'bg-purple-50 text-purple-700 border-purple-100';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    // Helper to get tag styling
    const getTagStyles = (color: string) => {
        switch (color) {
            case 'red': return 'bg-red-50 text-red-700 border-red-100';
            case 'amber': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'blue': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'gray': return 'bg-slate-100 text-slate-500 border-slate-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-10 lg:px-40 py-8">

            {/* Page Title & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 animate-fade-in-up">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-0.5 rounded border border-red-100 uppercase tracking-wide">Admin Control</span>
                    </div>
                    <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-bold tracking-tight">Exceptions & Escalations</h1>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <GraduationCap size={16} />
                            <p className="text-base font-medium">{user?.schoolProfile?.schoolName || 'School Dashboard'}</p>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <p className="text-base">System Audit Log</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <button className="flex h-10 items-center gap-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 hover:border-primary/50 transition-colors shadow-sm text-slate-600 dark:text-slate-300" onClick={() => console.log('Filter Queue')}>
                        <Filter size={18} />
                        <span className="text-sm font-medium">Filter Queue</span>
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-lg font-semibold border border-slate-200 shadow-sm transition-all" onClick={() => console.log('View Logs')}>
                        <History size={20} />
                        <span>View Logs</span>
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Card 1 */}
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700 hover:border-amber-200 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Clock size={80} strokeWidth={1} />
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600 dark:text-amber-400">
                            <Clock size={20} />
                        </div>
                        <p className="text-sm font-bold text-slate-600 dark:text-slate-400 leading-tight">Stuck Between Phases</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">12</p>
                        <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">Action required by Teacher</p>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700 hover:border-red-200 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Flag size={80} strokeWidth={1} />
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
                            <Flag size={20} />
                        </div>
                        <p className="text-sm font-bold text-slate-600 dark:text-slate-400 leading-tight">Phase 4 Failures</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">5</p>
                        <p className="text-xs text-red-500 font-medium mt-1">Below Threshold</p>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                        <FileWarning size={80} strokeWidth={1} />
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                            <FileWarning size={20} />
                        </div>
                        <p className="text-sm font-bold text-slate-600 dark:text-slate-400 leading-tight">Referrals Pending Consent</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">8</p>
                        <p className="text-xs text-slate-500 font-medium mt-1">Awaiting Parent Action</p>
                    </div>
                </div>

                {/* Card 4 */}
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700 hover:border-red-200 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TimerOff size={80} strokeWidth={1} />
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600 dark:text-amber-400">
                            <TimerOff size={20} />
                        </div>
                        <p className="text-sm font-bold text-slate-600 dark:text-slate-400 leading-tight">Overdue Screenings</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">3</p>
                        <p className="text-xs text-red-500 font-medium mt-1">SLA Breach Risk</p>
                    </div>
                </div>
            </div>

            {/* Escalation Queue Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-slate-700 overflow-hidden mb-6">
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800">
                    <div className="flex items-center gap-2">
                        <List className="text-slate-400" size={20} />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Escalation Queue</h3>
                        <span className="bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-200 text-xs px-2 py-0.5 rounded-full font-bold ml-2">28 Active</span>
                    </div>
                    <div className="flex gap-2">
                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                            <RefreshCw size={20} />
                        </button>
                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                            <MoreVertical size={20} />
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                                <th className="px-6 py-4">Student ID (Anon)</th>
                                <th className="px-6 py-4">Current Phase</th>
                                <th className="px-6 py-4">Issue Type</th>
                                <th className="px-6 py-4">Days Pending</th>
                                <th className="px-6 py-4">Responsible Role</th>
                                <th className="px-6 py-4">Status & Tags</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-body text-sm">
                            {exceptions.map((item) => (
                                <tr
                                    key={item.id}
                                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors group ${item.isCritical ? 'border-l-4 border-l-red-500' : ''}`}
                                >
                                    <td className={`px-6 py-4 font-mono ${item.isCritical ? 'text-slate-900 dark:text-slate-100 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>
                                        {item.studentId}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getPhaseStyles(item.phaseColor)}`}>
                                            {item.phase}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-700 dark:text-slate-200 font-medium float-left w-max">
                                        {item.issueType}
                                    </td>
                                    <td className={`px-6 py-4 ${item.daysPending > 10 ? 'text-red-600 font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                                        {item.daysPending} Days
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                            {/* Start Dynamic Icon Rendering */}
                                            {item.roleIcon === 'person' && <User size={18} className={item.responsibleRole === 'System' ? 'text-primary' : 'text-slate-400'} />}
                                            {item.roleIcon === 'family_restroom' && <Users size={18} className={item.responsibleRole === 'System' ? 'text-primary' : 'text-slate-400'} />}
                                            {item.roleIcon === 'dns' && <Server size={18} className={item.responsibleRole === 'System' ? 'text-primary' : 'text-slate-400'} />}
                                            {/* End Dynamic Icon Rendering */}
                                            {item.responsibleRole}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1.5">
                                            {item.statusTags.map((tag, idx) => (
                                                <span key={idx} className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${getTagStyles(tag.color)}`}>
                                                    {tag.icon === 'warning' && <AlertTriangle size={12} className="mr-1" />}
                                                    {tag.label}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                            {item.isCritical ? (
                                                <button
                                                    className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-3 py-1 rounded text-xs font-bold transition-all"
                                                    onClick={() => console.log('Escalate', item.studentId)}
                                                >
                                                    Escalate
                                                </button>
                                            ) : item.responsibleRole === 'System' ? (
                                                <>
                                                    <button className="text-primary hover:bg-blue-50 p-1.5 rounded transition-colors" title="View Details" onClick={() => onViewCase?.(item.studentId)}>
                                                        <Eye size={20} />
                                                    </button>
                                                    {item.issueType === 'Below Threshold' ? (
                                                        <button className="bg-primary hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold transition-all shadow-sm" onClick={() => console.log('Process', item.studentId)}>
                                                            Process
                                                        </button>
                                                    ) : (
                                                        <button className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 p-1.5 rounded transition-colors" title="Add Note" onClick={() => console.log('Add Note', item.studentId)}>
                                                            <FileEdit size={20} />
                                                        </button>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <button className="text-primary hover:bg-blue-50 p-1.5 rounded transition-colors" title="View Case" onClick={() => onViewCase?.(item.studentId)}>
                                                        <Eye size={20} />
                                                    </button>
                                                    <button className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 p-1.5 rounded transition-colors" title="Send Reminder" onClick={() => console.log('Notify', item.studentId)}>
                                                        <BellPlus size={20} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                <div className="px-6 py-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <p className="text-sm text-slate-500">Showing <span className="font-bold text-slate-700 dark:text-slate-300">1-5</span> of <span className="font-bold text-slate-700 dark:text-slate-300">28</span> exceptions</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-700 text-sm disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-700 text-sm">Next</button>
                    </div>
                </div>
            </div>

            {/* System Guardrails Notice */}
            <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg p-4 flex items-start gap-3 mb-8">
                <Info className="text-primary mt-0.5" size={20} />
                <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">System Guardrails Active</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">No diagnosis or clinical scores are displayed on this administrative view. Direct parent communication is restricted from this console to ensure compliance. All actions are subject to the system's phase-gate logic.</p>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-8 text-center border-t border-slate-200 dark:border-slate-800 pt-8 pb-4">
                <div className="flex flex-col items-center gap-2">
                    <p className="text-sm text-slate-500 italic">This page highlights system exceptions. Resolution actions are logged for audit purposes.</p>
                    <p className="text-xs text-slate-400 mt-2">© {new Date().getFullYear()} Daira Education Platform. All rights reserved. <br className="hidden md:inline" />Strictly confidential. FERPA/HIPAA Compliant.</p>
                </div>
            </footer>

        </div>
    );
};

export default ExceptionsEscalations;
