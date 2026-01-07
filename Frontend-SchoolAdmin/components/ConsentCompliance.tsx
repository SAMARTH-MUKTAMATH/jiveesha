import React, { useState } from 'react';
import {
    Shield,
    ChartBar,
    Download,
    Search,
    ClipboardCheck,
    FolderOpen,
    FileWarning,
    CheckCircle2,
    FileText,
    Filter,
    MoreVertical,
    BellPlus,
    RefreshCcw,
    History,
    FileIcon,
    Lock,
    Scale,
    CheckCircle
} from 'lucide-react';

interface ConsentComplianceProps {
    onNavigateToReports?: () => void;
    user?: any;
}

interface ConsentRecord {
    id: string;
    studentId: string;
    type: 'Screening' | 'Referral' | 'Data Sharing';
    status: 'Granted' | 'Pending' | 'Expired';
    statusColor: 'green' | 'amber' | 'slate';
    requestedOn: string;
    validUntil: string;
}

interface AuditEntry {
    id: string;
    user: string;
    action: string;
    role: 'Teacher' | 'Admin' | 'System';
    roleColor: 'blue' | 'purple' | 'slate';
    timestamp: string;
}

const ConsentCompliance: React.FC<ConsentComplianceProps> = ({ onNavigateToReports, user }) => {
    // Mock Data
    const [consentRecords] = useState<ConsentRecord[]>([
        {
            id: '1',
            studentId: '#8392-XT',
            type: 'Screening',
            status: 'Granted',
            statusColor: 'green',
            requestedOn: 'Oct 12, 2023',
            validUntil: 'Oct 12, 2024'
        },
        {
            id: '2',
            studentId: '#9921-AB',
            type: 'Referral',
            status: 'Pending',
            statusColor: 'amber',
            requestedOn: 'Nov 01, 2023',
            validUntil: '--'
        },
        {
            id: '3',
            studentId: '#1023-CD',
            type: 'Data Sharing',
            status: 'Expired',
            statusColor: 'slate',
            requestedOn: 'Sep 15, 2022',
            validUntil: 'Sep 15, 2023'
        },
        {
            id: '4',
            studentId: '#7221-KL',
            type: 'Screening',
            status: 'Granted',
            statusColor: 'green',
            requestedOn: 'Oct 20, 2023',
            validUntil: 'Oct 20, 2024'
        },
        {
            id: '5',
            studentId: '#5519-OP',
            type: 'Referral',
            status: 'Granted',
            statusColor: 'green',
            requestedOn: 'Oct 25, 2023',
            validUntil: 'Oct 25, 2024'
        }
    ]);

    const [auditTrail] = useState<AuditEntry[]>([
        {
            id: '1',
            user: 'Sarah Jenkins',
            action: 'Viewed Consent Record #8392-XT',
            role: 'Teacher',
            roleColor: 'blue',
            timestamp: 'Oct 26, 10:42 AM'
        },
        {
            id: '2',
            user: 'System Auto',
            action: 'Flagged Expired Consent #1023-CD',
            role: 'System',
            roleColor: 'slate',
            timestamp: 'Oct 26, 09:00 AM'
        },
        {
            id: '3',
            user: user?.name || 'Admin User',
            action: 'Sent Reminder for #9921-AB',
            role: 'Admin',
            roleColor: 'purple',
            timestamp: 'Oct 25, 04:15 PM'
        },
        {
            id: '4',
            user: 'Sarah Jenkins',
            action: 'Uploaded Signed Form #5519-OP',
            role: 'Teacher',
            roleColor: 'blue',
            timestamp: 'Oct 25, 02:30 PM'
        }
    ]);

    // Helper styles
    const getStatusStyles = (color: string) => {
        switch (color) {
            case 'green': return 'bg-green-50 text-green-700 border-green-100';
            case 'amber': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'slate': return 'bg-slate-100 text-slate-600 border-slate-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    const getRoleStyles = (color: string) => {
        switch (color) {
            case 'blue': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'purple': return 'bg-purple-50 text-purple-700 border-purple-100';
            case 'slate': return 'bg-slate-100 text-slate-600 border-slate-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-10 lg:px-40 py-8">

            {/* Page Title & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 animate-fade-in-up">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-0.5 rounded border border-blue-100 uppercase tracking-wide">Governance</span>
                    </div>
                    <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-bold tracking-tight">Consent & Compliance</h1>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Shield size={16} />
                        <p className="text-base font-medium">Data Privacy Portal</p>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <p className="text-base">Audit Ready</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    {/* BUG FIX BUTTON */}
                    <button
                        onClick={onNavigateToReports}
                        className="flex h-10 items-center gap-2 rounded-lg bg-blue-50 text-primary border border-blue-100 px-4 hover:border-blue-300 transition-colors shadow-sm font-semibold"
                    >
                        <ChartBar size={18} />
                        <span className="text-sm">View Reports</span>
                    </button>
                    <button className="flex h-10 items-center gap-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 hover:border-primary/50 transition-colors shadow-sm text-slate-600 dark:text-slate-300" onClick={() => console.log('Export Report')}>
                        <Download size={18} />
                        <span className="text-sm font-medium">Export Report</span>
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-lg font-semibold border border-slate-200 shadow-sm transition-all" onClick={() => console.log('Global Search')}>
                        <Search size={20} />
                        <span>Global Search</span>
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Card 1 */}
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                        <ClipboardCheck size={80} strokeWidth={1} />
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                            <ClipboardCheck size={20} />
                        </div>
                        <p className="text-sm font-bold text-slate-600 dark:text-slate-400 leading-tight">Screening Consent</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">96%</p>
                        <p className="text-xs text-slate-500 font-medium mt-1">420/438 Students Covered</p>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                        <FolderOpen size={80} strokeWidth={1} />
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <FolderOpen size={20} />
                        </div>
                        <p className="text-sm font-bold text-slate-600 dark:text-slate-400 leading-tight">Referral Consent</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">88%</p>
                        <p className="text-xs text-slate-500 font-medium mt-1">Active Cases</p>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                        <FileWarning size={80} strokeWidth={1} />
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300">
                            <FileWarning size={20} />
                        </div>
                        <p className="text-sm font-bold text-slate-600 dark:text-slate-400 leading-tight">Missing / Expired</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">12</p>
                        <p className="text-xs text-slate-500 font-medium mt-1">Action Required</p>
                    </div>
                </div>

                {/* Card 4 */}
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700 hover:border-green-200 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                        <CheckCircle2 size={80} strokeWidth={1} />
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
                            <CheckCircle2 size={20} />
                        </div>
                        <p className="text-sm font-bold text-slate-600 dark:text-slate-400 leading-tight">Audit Status</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">Ready</p>
                        <p className="text-xs text-green-600 font-medium mt-1">Last Checked: 09:15 AM</p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                {/* Main Table Section (Span 2) */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-slate-700 overflow-hidden h-full">
                        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800">
                            <div className="flex items-center gap-2">
                                <FileText className="text-slate-400" size={20} />
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Consent Records</h3>
                                <span className="bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-200 text-xs px-2 py-0.5 rounded-full font-bold ml-2">Total 450</span>
                            </div>
                            <div className="flex gap-2">
                                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                    <Filter size={20} />
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
                                        <th className="px-6 py-4">Consent Type</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Requested On</th>
                                        <th className="px-6 py-4">Valid Until</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-body text-sm">
                                    {consentRecords.map((record) => (
                                        <tr key={record.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors group">
                                            <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-300">{record.studentId}</td>
                                            <td className="px-6 py-4 text-slate-700 dark:text-slate-200 font-medium">
                                                {record.type}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyles(record.statusColor)}`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{record.requestedOn}</td>
                                            <td className={`px-6 py-4 ${record.validUntil === '--' ? 'text-slate-400 italic' : 'text-slate-600 dark:text-slate-400'}`}>{record.validUntil}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                                    {record.status === 'Pending' ? (
                                                        <button className="text-primary hover:bg-blue-50 p-1.5 rounded transition-colors" title="Send Reminder" onClick={() => console.log('Send Reminder', record.studentId)}>
                                                            <BellPlus size={20} />
                                                        </button>
                                                    ) : record.status === 'Expired' ? (
                                                        <button className="text-primary hover:bg-blue-50 p-1.5 rounded transition-colors" title="Renew Request" onClick={() => console.log('Renew', record.studentId)}>
                                                            <RefreshCcw size={20} />
                                                        </button>
                                                    ) : (
                                                        <button className="text-primary hover:bg-blue-50 p-1.5 rounded transition-colors" title="View Log" onClick={() => console.log('View Log', record.studentId)}>
                                                            <History size={20} />
                                                        </button>
                                                    )}
                                                    <button className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 p-1.5 rounded transition-colors" title="Download PDF" onClick={() => console.log('Download', record.studentId)}>
                                                        <FileIcon size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 py-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                            <p className="text-sm text-slate-500">Showing <span className="font-bold text-slate-700 dark:text-slate-300">1-5</span> of <span className="font-bold text-slate-700 dark:text-slate-300">450</span> records</p>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-700 text-sm disabled:opacity-50" disabled>Previous</button>
                                <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-700 text-sm">Next</button>
                            </div>
                        </div>
                    </div>

                    {/* Audit Trail Section was nested in reference inside Span 2 div, but let's separate as per plan if needed. 
                Wait, reference had audit trail inside the main column too? No, it was split. 
                Reference: <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                   <div class="lg:col-span-2"> ... Audit Trail Table ... </div>
                   <div class="lg:col-span-1"> ... Compliance Notice ... </div>
                </div>
                The previous table was separate. Let's fix structure.
            */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700 overflow-hidden h-full">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Lock className="text-slate-400" size={20} />
                                Audit Trail
                            </h3>
                            <a className="text-primary text-sm font-medium hover:underline cursor-pointer" onClick={() => console.log('View All Logs')}>View All Logs</a>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-xs text-slate-500 uppercase bg-slate-50/50 dark:bg-slate-900/50">
                                        <th className="px-6 py-3 font-semibold">User</th>
                                        <th className="px-6 py-3 font-semibold">Action</th>
                                        <th className="px-6 py-3 font-semibold">Role</th>
                                        <th className="px-6 py-3 font-semibold text-right">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                                    {auditTrail.map((entry) => (
                                        <tr key={entry.id} className="hover:bg-slate-50/50">
                                            <td className="px-6 py-3 text-slate-700 dark:text-slate-200">{entry.user}</td>
                                            <td className="px-6 py-3 text-slate-600 dark:text-slate-400">{entry.action}</td>
                                            <td className="px-6 py-3">
                                                <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold ${getRoleStyles(entry.roleColor)}`}>
                                                    {entry.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-slate-500 text-right font-mono text-xs">{entry.timestamp}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar Section (Compliance Notice) */}
                <div className="lg:col-span-1">
                    <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-6 h-full flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                            <Scale className="text-primary" size={32} />
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Compliance Notice</h3>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                            All data access and consent records are maintained in accordance with educational privacy and child data protection regulations. System logs are immutable and retained for 7 years.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                <CheckCircle size={16} className="text-green-600" />
                                <span>FERPA Compliant Storage</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                <CheckCircle size={16} className="text-green-600" />
                                <span>COPPA Data Guidelines</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                <CheckCircle size={16} className="text-green-600" />
                                <span>Role-Based Access Control</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-8 text-center border-t border-slate-200 dark:border-slate-800 pt-8 pb-4">
                <div className="flex flex-col items-center gap-2">
                    <p className="text-sm text-slate-500 italic">Confidential Compliance Dashboard. Access is logged for audit purposes.</p>
                    <p className="text-xs text-slate-400 mt-2">© {new Date().getFullYear()} Daira Education Platform. All rights reserved. <br className="hidden md:inline" />Strictly confidential. FERPA/HIPAA Compliant.</p>
                </div>
            </footer>

        </div>
    );
};

export default ConsentCompliance;

