import React, { useState } from 'react';
import {
    School,
    ShieldCheck,
    FileText,
    PieChart,
    Stethoscope,
    Brain,
    Wrench,
    Wand2,
    History,
    RefreshCw,
    Table,
    Download,
    Lock
} from 'lucide-react';

interface ReportsSubmissionsProps {
    onNavigateToConsent?: () => void;
    user?: any;
}

interface ComplianceReport {
    id: string;
    title: string;
    description: string;
    icon: string;
    iconBgColor: string;
    iconColor: string;
    options: string[];
}

interface HistoryEntry {
    id: string;
    name: string;
    type: 'PDF' | 'CSV' | 'XLS';
    user: string;
    date: string;
    status: 'Ready' | 'Processing';
}

const ReportsSubmissions: React.FC<ReportsSubmissionsProps> = ({ onNavigateToConsent, user }) => {
    const [format, setFormat] = useState<'PDF' | 'CSV'>('PDF');

    // Mock Data
    const [reports] = useState<ComplianceReport[]>([
        {
            id: '1',
            title: 'Government Compliance Report',
            description: 'Mandated format for annual submission to regional education authority. Includes aggregated status counts.',
            icon: 'policy',
            iconBgColor: 'bg-blue-50 dark:bg-blue-900/20',
            iconColor: 'text-primary dark:text-blue-400',
            options: ['Current Academic Year', 'Last Quarter', 'Previous Year']
        },
        {
            id: '2',
            title: 'Annual Screening Coverage',
            description: 'Detailed breakdown of screened vs. unscreened students by grade level and phase completion.',
            icon: 'donut_large',
            iconBgColor: 'bg-purple-50 dark:bg-purple-900/20',
            iconColor: 'text-purple-600 dark:text-purple-400',
            options: ['Year to Date', 'Last Month']
        },
        {
            id: '3',
            title: 'Referral & Follow-Up Summary',
            description: 'Tracking of external referrals, parent consent rates, and case closure timelines.',
            icon: 'medical_services',
            iconBgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
            iconColor: 'text-emerald-600 dark:text-emerald-400',
            options: ['Last 30 Days', 'Current Academic Year']
        },
        {
            id: '4',
            title: 'PEP Adoption & Usage',
            description: 'Analysis of Personalized Education Plan creation and teacher adherence metrics.',
            icon: 'psychology',
            iconBgColor: 'bg-amber-50 dark:bg-amber-900/20',
            iconColor: 'text-amber-600 dark:text-amber-400',
            options: ['All Time', 'Current Term']
        },
        {
            id: '5',
            title: 'Teacher Activity Summary',
            description: 'Operational log of teacher login activity, screening completion rates, and system engagement.',
            icon: 'school',
            iconBgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
            iconColor: 'text-indigo-600 dark:text-indigo-400',
            options: ['Last Month', 'Last Week']
        }
    ]);

    const [history] = useState<HistoryEntry[]>([
        {
            id: '1',
            name: 'Government Compliance Report',
            type: 'PDF',
            user: user?.name || 'Admin User',
            date: 'Oct 24, 2023 • 09:42 AM',
            status: 'Ready'
        },
        {
            id: '2',
            name: 'Custom Export: Grade 2 (Phase 3)',
            type: 'CSV',
            user: 'Admin User',
            date: 'Oct 23, 2023 • 04:15 PM',
            status: 'Ready'
        },
        {
            id: '3',
            name: 'Annual Screening Coverage',
            type: 'PDF',
            user: 'System (Auto)',
            date: 'Oct 01, 2023 • 00:00 AM',
            status: 'Ready'
        },
        {
            id: '4',
            name: 'Teacher Activity Summary (Large)',
            type: 'XLS',
            user: 'Admin User',
            date: 'Oct 24, 2023 • 10:05 AM',
            status: 'Processing'
        }
    ]);

    return (
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-10 lg:px-40 py-8">

            {/* Page Title & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 animate-fade-in-up">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-0.5 rounded border border-blue-100 uppercase tracking-wide">Admin Reporting</span>
                    </div>
                    <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-bold tracking-tight">Reports & Submissions</h1>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <School size={16} />
                        <p className="text-base font-medium">{user?.schoolProfile?.schoolName || 'School Dashboard'}</p>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <p className="text-base">Operational Compliance</p>
                    </div>
                </div>
                {/* BUG FIX BUTTON */}
                <div className="flex justify-end">
                    <button
                        onClick={onNavigateToConsent}
                        className="flex h-10 items-center gap-2 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 px-4 hover:border-indigo-300 transition-colors shadow-sm font-semibold"
                    >
                        <ShieldCheck size={18} />
                        <span className="text-sm">View Consent & Compliance</span>
                    </button>
                </div>
            </div>

            {/* Required Compliance Reports */}
            <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                    <FileText className="text-slate-400" size={20} />
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Required Compliance Reports</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {reports.map((report) => (
                        <div key={report.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700 hover:border-blue-200 hover:shadow-md transition-all flex flex-col justify-between h-full">
                            <div>
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`p-2 ${report.iconBgColor} rounded-lg ${report.iconColor}`}>
                                        {report.icon === 'policy' && <FileText size={20} />}
                                        {report.icon === 'donut_large' && <PieChart size={20} />}
                                        {report.icon === 'medical_services' && <Stethoscope size={20} />}
                                        {report.icon === 'psychology' && <Brain size={20} />}
                                        {report.icon === 'school' && <School size={20} />}
                                    </div>
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{report.title}</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">{report.description}</p>
                            </div>
                            <div className="pt-4 border-t border-slate-50 dark:border-slate-700/50 flex items-center gap-3">
                                <select className="form-select w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm rounded-lg px-3 py-2 text-slate-600 focus:ring-primary focus:border-primary cursor-pointer">
                                    {report.options.map((opt, idx) => (
                                        <option key={idx}>{opt}</option>
                                    ))}
                                </select>
                                <button className="bg-primary hover:bg-blue-700 text-white p-2 rounded-lg transition-colors shadow-sm flex-shrink-0" title="Generate Report" onClick={() => console.log('Generate', report.title)}>
                                    <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Custom Report Builder */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-slate-700 overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 flex items-center gap-2">
                    <Wrench className="text-slate-500" size={20} />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Custom Report Builder</h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        {[
                            { label: 'Date Range', options: ['Last 30 Days', 'Academic Year To Date', 'Custom Range'] },
                            { label: 'Grade Level', options: ['All Grades', 'Grade 1', 'Grade 2', 'Grade 3'] },
                            { label: 'Screening Phase', options: ['All Phases', 'Phase 1: Initial', 'Phase 2: Observation', 'Phase 4: Referral'] },
                            { label: 'Risk Category', options: ['All Categories', 'Flagged (Attention)', 'At Risk (Action Required)', 'Cleared'] }
                        ].map((filter, i) => (
                            <div key={i}>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">{filter.label}</label>
                                <select className="form-select w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-700 focus:ring-primary focus:border-primary cursor-pointer">
                                    {filter.options.map(opt => <option key={opt}>{opt}</option>)}
                                </select>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-100 dark:border-slate-700 pt-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
                            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                                <label className="flex items-center gap-2 cursor-pointer px-2">
                                    <input
                                        type="radio"
                                        name="format"
                                        className="text-primary focus:ring-primary border-slate-300"
                                        checked={format === 'PDF'}
                                        onChange={() => setFormat('PDF')}
                                    />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">PDF Report</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer px-2">
                                    <input
                                        type="radio"
                                        name="format"
                                        className="text-primary focus:ring-primary border-slate-300"
                                        checked={format === 'CSV'}
                                        onChange={() => setFormat('CSV')}
                                    />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">CSV Data</span>
                                </label>
                            </div>
                            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg border border-amber-100 dark:border-amber-900/30">
                                <span className="material-symbols-outlined text-[18px]">warning</span>
                                <span className="text-xs font-semibold">Custom reports may omit compliance fields required for official submission.</span>
                            </div>
                        </div>
                        <button className="w-full md:w-auto bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2" onClick={() => console.log('Generate Custom')}>
                            <Wand2 size={20} />
                            Generate Custom Report
                        </button>
                    </div>
                </div>
            </div>

            {/* History Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-slate-700 overflow-hidden mb-6">
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800">
                    <div className="flex items-center gap-2">
                        <History className="text-slate-400" size={20} />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Submission & Download History</h3>
                    </div>
                    <div className="flex gap-2">
                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                            <RefreshCw size={20} />
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                                <th className="px-6 py-4">Report Name</th>
                                <th className="px-6 py-4">Generated By</th>
                                <th className="px-6 py-4">Date & Time</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-body text-sm">
                            {history.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-1.5 rounded ${item.type === 'PDF' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                                {item.type === 'PDF' ? <FileText size={18} /> : <Table size={18} />}
                                            </div>
                                            <span className={`font-medium ${item.status === 'Processing' ? 'text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>{item.name}</span>
                                        </div>
                                    </td>
                                    <td className={`px-6 py-4 ${item.status === 'Processing' ? 'text-slate-400' : 'text-slate-600 dark:text-slate-400'}`}>{item.user}</td>
                                    <td className={`px-6 py-4 ${item.status === 'Processing' ? 'text-slate-400' : 'text-slate-600 dark:text-slate-400'}`}>{item.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${item.status === 'Ready' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            className={`p-2 rounded-full transition-colors ${item.status === 'Ready' ? 'text-primary hover:bg-blue-50' : 'text-slate-300 cursor-not-allowed'}`}
                                            title="Download"
                                            disabled={item.status !== 'Ready'}
                                            onClick={() => item.status === 'Ready' && console.log('Download', item.id)}
                                        >
                                            <Download size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <p className="text-sm text-slate-500">Showing <span className="font-bold text-slate-700 dark:text-slate-300">1-4</span> of <span className="font-bold text-slate-700 dark:text-slate-300">28</span> reports</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-700 text-sm disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-700 text-sm">Next</button>
                    </div>
                </div>
            </div>

            {/* Data Privacy Notice */}
            <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg p-4 flex items-start gap-3 mb-8">
                <Lock className="text-primary mt-0.5" size={20} />
                <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Data Privacy & Export Controls</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">All generated reports are stripped of raw student data and identifiable health labels to comply with platform governance. Reports are logged for audit purposes upon generation.</p>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-8 text-center border-t border-slate-200 dark:border-slate-800 pt-8 pb-4">
                <div className="flex flex-col items-center gap-2">
                    <p className="text-sm text-slate-500 italic">Confidential. Authorized administrative use only.</p>
                    <p className="text-xs text-slate-400 mt-2">© {new Date().getFullYear()} Daira Education Platform. All rights reserved. <br className="hidden md:inline" />Strictly confidential. FERPA/HIPAA Compliant.</p>
                </div>
            </footer>

        </div>
    );
};

export default ReportsSubmissions;
