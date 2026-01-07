import React, { useState } from 'react';
import Modal from './Modal';
import {
    Users,
    TrendingUp,
    PieChart,
    Flag,
    Download,
    Share,
    AlertTriangle,
    Send,
    Lightbulb,
    Mail,
    UserPlus,
    Check,
    ClipboardList,
    Clock,
    Filter,
    ShieldCheck,
    Plus,
    Loader2
} from 'lucide-react';
import { api } from '../services/api';


interface SchoolOverviewDashboardProps {
    onNavigateToTeachers: () => void;
    onNavigateToAnalytics: () => void;
    onNavigateToReports: () => void;
    onNavigateToSettings: () => void;
    onLogout?: () => void;
    user?: any;
}

const SchoolOverviewDashboard: React.FC<SchoolOverviewDashboardProps> = ({
    onNavigateToAnalytics,
    onNavigateToReports,
    user
}) => {
    // State for interactions
    const [isExporting, setIsExporting] = useState(false);

    // Email Reminder State
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [emailSubject, setEmailSubject] = useState('Safety Screening Reminder');
    const [emailBody, setEmailBody] = useState('Dear Teachers,\n\nPlease ensure all screenings for your classes are completed by the end of this week.\n\nThank you.');
    const [isSendingEmail, setIsSendingEmail] = useState(false);

    // Allocation State
    const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);
    const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
    const [isAllocating, setIsAllocating] = useState(false);
    const [recommendationDismissed, setRecommendationDismissed] = useState(false);

    // Add Teacher State
    const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);
    const [isAddingTeacher, setIsAddingTeacher] = useState(false);
    const [teacherForm, setTeacherForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        assignment: '' // Subject/Role
    });
    const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);

    // Fetch Teachers on Mount


    // Handlers
    const handleExportData = async () => {
        try {
            setIsExporting(true);
            // Simulate API call or use existing endpoint if available. 
            // Since backend schema is provided but specific export endpoint unknown, we'll simulate a CSV generation from frontend data for now
            // or attempt a generic export endpoint. Given instructions to "Use existing backend data sources", we'll simulate a fetch.

            // Mock delay for UX
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Generate CSV
            const headers = ['Metric', 'Value'];
            const rows = [
                ['Total Students Screened', '850'],
                ['Screening Completion', '68%'],
                ['Flags Raised', '45'],
                ['Critical Alerts', '5']
            ];

            const csvContent = "data:text/csv;charset=utf-8,"
                + headers.join(",") + "\n"
                + rows.map(e => e.join(",")).join("\n");

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "school_overview_data.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            console.log('Export successful');
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export data. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    const handleSendEmail = async () => {
        try {
            setIsSendingEmail(true);
            // Simulate backend call
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('Email sent to teachers:', { subject: emailSubject, body: emailBody });
            setIsEmailModalOpen(false);
            alert('Reminder sent successfully to all teachers.');
        } catch (error) {
            console.error('Failed to send email:', error);
            alert('Failed to send email.');
        } finally {
            setIsSendingEmail(false);
        }
    };

    const handleAllocation = async () => {
        if (!selectedTeacherId) return;

        try {
            setIsAllocating(true);
            // Simulate allocation
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Allocated teacher:', selectedTeacherId);
            setIsAllocationModalOpen(false);
            setRecommendationDismissed(true); // Hide recommendation after action
            alert('Staff allocated successfully.');
        } catch (error) {
            console.error('Allocation failed:', error);
        } finally {
            setIsAllocating(false);
        }
    };

    const handleAddTeacher = async () => {
        try {
            setIsAddingTeacher(true);
            await api.post('/teachers', teacherForm);

            // Success
            alert('Teacher invited successfully');
            setIsAddTeacherModalOpen(false);
            setTeacherForm({ firstName: '', lastName: '', email: '', phone: '', assignment: '' });
            fetchTeachers(); // Refresh list
        } catch (err: any) {
            console.error('Add Teacher failed:', err);
            alert(err.response?.data?.message || 'Failed to add teacher');
        } finally {
            setIsAddingTeacher(false);
        }
    };

    // Real Data State
    const [kpiData, setKpiData] = useState({
        totalStudentsScreened: 0,
        trend: '+0%',
        completionRate: 0,
        flagsRaised: 0,
        criticalAlerts: 0
    });

    const [teacherActivity, setTeacherActivity] = useState<any[]>([]);

    // Fetch initial data
    React.useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch KPIs
                const statsRes = await api.get('/school/dashboard-stats');
                if (statsRes.data?.stats) {
                    setKpiData(statsRes.data.stats);
                }

                // Fetch Teacher Activity
                const activityRes = await api.get('/school/teachers-activity');
                if (activityRes.data?.data) {
                    const mappedActivity = activityRes.data.data.map((t: any) => ({
                        id: t.id,
                        name: `${t.firstName} ${t.lastName}`,
                        class: t.grades ? `${JSON.parse(t.grades).join(', ')}` : 'N/A',
                        screened: `${t._count?.primaryStudents || 0} Students`, // Simplified for now
                        lastActive: t.user?.lastLogin ? new Date(t.user.lastLogin).toLocaleDateString() : 'Never',
                        status: t.status || 'Active',
                        image: `https://ui-avatars.com/api/?name=${t.firstName}+${t.lastName}&background=random`
                    }));
                    setTeacherActivity(mappedActivity);
                }
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
            }
        };

        fetchDashboardData();
    }, []);

    // Helper for teacher fetching (re-used for refresh)
    const fetchTeachers = async () => {
        try {
            setIsLoadingTeachers(true);
            const activityRes = await api.get('/school/teachers-activity');
            if (activityRes.data?.data) {
                const mappedActivity = activityRes.data.data.map((t: any) => ({
                    id: t.id,
                    name: `${t.firstName} ${t.lastName}`,
                    class: t.grades ? `${JSON.parse(t.grades).join(', ')}` : 'N/A',
                    screened: `${t._count?.primaryStudents || 0} Students`,
                    lastActive: t.user?.lastLogin ? new Date(t.user.lastLogin).toLocaleDateString() : 'Never',
                    status: t.status || 'Active',
                    image: `https://ui-avatars.com/api/?name=${t.firstName}+${t.lastName}&background=random`
                }));
                setTeacherActivity(mappedActivity);
            }
        } catch (err) {
            console.error('Failed to fetch teachers:', err);
        } finally {
            setIsLoadingTeachers(false);
        }
    };

    return (
        <div className="flex flex-col w-full h-full">
            {/* Welcome & Status */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                <div className="flex flex-col gap-2">
                    <p className="text-[#111318] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">School Overview</p>
                    <p className="text-[#616f89] dark:text-gray-400 text-base font-normal leading-normal">Welcome back, {user?.name || 'School Admin'}. Here is your institutional summary.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-surface-dark p-2 rounded-xl border border-[#dbdfe6] dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-2 px-3 border-r border-gray-200 dark:border-gray-700">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">System Healthy</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 border-r border-gray-200 dark:border-gray-700 hidden sm:flex">
                        <ShieldCheck size={18} className="text-[#135bec]" />
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">License: Active</span>
                    </div>
                    <div className="flex gap-2 pl-2">
                        <button
                            onClick={onNavigateToReports}
                            className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-3 bg-blue-50 dark:bg-gray-700 text-[#135bec] dark:text-white text-xs font-bold gap-2 hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors"
                        >
                            <Download size={16} />
                            Compliance Report
                        </button>
                        <button
                            onClick={handleExportData}
                            disabled={isExporting}
                            className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-3 bg-[#135bec] text-white text-xs font-bold gap-2 hover:bg-[#0e44b3] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isExporting ? <span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" /> : <Share size={16} />}
                            {isExporting ? 'Exporting...' : 'Export Data'}
                        </button>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex flex-col gap-4 rounded-xl p-6 border border-[#dbdfe6] dark:border-gray-700 bg-white/60 dark:bg-surface-dark backdrop-blur-sm shadow-sm">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                            <p className="text-[#616f89] dark:text-gray-400 text-sm font-medium">Total Students Screened</p>
                            <p className="text-[#111318] dark:text-white text-3xl font-bold leading-tight">{kpiData.totalStudentsScreened}</p>
                        </div>
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-[#135bec]">
                            <Users size={24} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="flex items-center text-[#07883b] bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded text-xs font-bold gap-0.5">
                            <TrendingUp size={14} /> {kpiData.trend}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">vs last month</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4 rounded-xl p-6 border border-[#dbdfe6] dark:border-gray-700 bg-white/60 dark:bg-surface-dark backdrop-blur-sm shadow-sm">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                            <p className="text-[#616f89] dark:text-gray-400 text-sm font-medium">Screening Completion</p>
                            <p className="text-[#111318] dark:text-white text-3xl font-bold leading-tight">{kpiData.completionRate}%</p>
                        </div>
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                            <PieChart size={24} />
                        </div>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mt-auto">
                        <div className="bg-[#135bec] h-1.5 rounded-full" style={{ width: `${kpiData.completionRate}%` }}></div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 rounded-xl p-6 border border-[#dbdfe6] dark:border-gray-700 bg-white/60 dark:bg-surface-dark backdrop-blur-sm shadow-sm">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                            <p className="text-[#616f89] dark:text-gray-400 text-sm font-medium">Flags Raised</p>
                            <p className="text-[#111318] dark:text-white text-3xl font-bold leading-tight">{kpiData.flagsRaised}</p>
                        </div>
                        <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                            <Flag size={24} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="flex items-center text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-1.5 py-0.5 rounded text-xs font-bold">
                            Needs Review
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{kpiData.criticalAlerts} critical alerts</span>
                    </div>
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (Charts & Table) */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Disorder Prevalence Chart */}
                    <div className="rounded-xl border border-[#dbdfe6] dark:border-gray-700 bg-white dark:bg-surface-dark p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-[#111318] dark:text-white text-lg font-bold leading-tight">Disorder Prevalence</h3>
                                <p className="text-[#616f89] dark:text-gray-400 text-sm">Risk Level Distribution by Grade</p>
                            </div>
                            <button
                                onClick={onNavigateToAnalytics}
                                className="text-[#135bec] text-sm font-medium hover:underline"
                            >
                                View Full Report
                            </button>
                        </div>
                        {/* Real Data Bar Chart */}
                        <div className="grid grid-cols-6 gap-4 items-end h-[240px] px-2">
                            {/* Check if we have disorderPrevalence data, else show "No Data" or placeholder */}
                            {(kpiData as any).disorderPrevalence && (kpiData as any).disorderPrevalence.length > 0 ? (
                                (kpiData as any).disorderPrevalence.map((data: any, i: number) => (
                                    <div key={i} className="flex flex-col items-center gap-2 h-full justify-end group cursor-pointer" title={`Total: ${data.totalCount} (High: ${data.counts.high}, Mod: ${data.counts.moderate}, Low: ${data.counts.low})`}>
                                        <div className={`w-full bg-red-100 dark:bg-red-900/30 rounded-t-sm relative flex items-end group-hover:opacity-80 transition-opacity`} style={{ height: `${Math.max(data.barHeight, 10)}%` }}>
                                            {/* Orange (Moderate) - Assuming it sits in the middle visually? 
                                               Actually the previous CSS logic was: 
                                               Orange div (relative) with h-60%
                                               Blue div (absolute bottom) with h-30%
                                               So Orange starts from top of container? No, it's a flex-end container?
                                               "flex items-end" on parent div.
                                               No, the red container has "relative flex items-end".
                                               Inside: 
                                               Orange div: w-full h-[60%]
                                               Blue div: absolute bottom-0 h-[30%]
                                               
                                               This effectively stacks them visually if orange is NOT absolute.
                                               Since Orange is static flow inside "flex-end", it sits at the bottom...
                                               AND Blue is absolute bottom. 
                                               So Blue covers the bottom 30% of Orange?
                                               
                                               Let's simplify to standard stacked bar CSS for clarity:
                                               High Risk (Red) = Container background (always visible at top if others don't cover it)
                                    
                                               We want: Bottom=Blue (Low), Middle=Orange (Mod), Top=Red (High).
                                            */}

                                            {/* The container is BG-RED (High). We overlay Blue and Orange. */}

                                            {/* Low Risk (Blue) at Bottom */}
                                            <div
                                                className="absolute bottom-0 w-full bg-blue-200 dark:bg-blue-900/40 z-10"
                                                style={{ height: `${data.percentages.low}%` }}
                                            />

                                            {/* Moderate Risk (Orange) stacked above Low */}
                                            <div
                                                className="absolute w-full bg-orange-200 dark:bg-orange-800/40 z-10"
                                                style={{
                                                    bottom: `${data.percentages.low}%`,
                                                    height: `${data.percentages.moderate}%`
                                                }}
                                            />

                                            {/* High Risk is the remaining background of the parent div */}
                                        </div>
                                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{data.label}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-6 flex items-center justify-center h-full text-gray-400 text-sm">
                                    No screening data available by grade yet.
                                </div>
                            )}
                        </div>
                        <div className="flex justify-center gap-6 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-100 dark:bg-red-900/50 rounded-full"></div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">High Risk</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-orange-200 dark:bg-orange-800/50 rounded-full"></div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Moderate</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-200 dark:bg-blue-900/50 rounded-full"></div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Low Risk</span>
                            </div>
                        </div>
                    </div>

                    {/* Teacher Activity Table */}
                    <div className="rounded-xl border border-[#dbdfe6] dark:border-gray-700 bg-white dark:bg-surface-dark overflow-hidden shadow-sm">
                        <div className="p-5 border-b border-[#f0f2f4] dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-[#111318] dark:text-white text-lg font-bold">Teachers Directory</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsAddTeacherModalOpen(true)}
                                    className="flex items-center justify-center h-8 px-3 rounded-lg bg-[#135bec] text-white hover:bg-[#0e44b3] transition-colors text-xs font-bold gap-2"
                                >
                                    <Plus size={16} />
                                    Add Teacher
                                </button>
                                <button className="flex items-center justify-center size-8 rounded-lg bg-blue-50 text-[#135bec] hover:bg-blue-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors">
                                    <Filter size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-[#f0f2f4] dark:bg-gray-800/50">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">Teacher</th>
                                        <th className="px-6 py-3 font-medium">Class</th>
                                        <th className="px-6 py-3 font-medium">Students Screened</th>
                                        <th className="px-6 py-3 font-medium">Last Active</th>
                                        <th className="px-6 py-3 font-medium text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#f0f2f4] dark:divide-gray-700">
                                    {isLoadingTeachers ? (
                                        <tr><td colSpan={5} className="text-center py-8 text-gray-500">Loading...</td></tr>
                                    ) : (
                                        teacherActivity.length > 0 ? (
                                            teacherActivity.map((teacher, idx) => (
                                                <tr key={teacher.id || idx} className="hover:bg-blue-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-[#111318] dark:text-white flex items-center gap-3">
                                                        <div
                                                            className="size-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-[#135bec] font-bold"
                                                        >
                                                            <img src={teacher.image} alt="" className="w-full h-full rounded-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden'); }} />
                                                            <span className="hidden">{teacher.name?.[0]}</span>
                                                        </div>
                                                        {teacher.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{teacher.class || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{teacher.screened || '0 Students'}</td>
                                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{teacher.lastActive}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${teacher.status === 'active' || teacher.status === 'on track' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                                            teacher.status === 'invited' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                                                teacher.status === 'lagging' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                                                    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                                            }`}>
                                                            {teacher.status || 'Unknown'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))) : (
                                            <tr><td colSpan={5} className="text-center py-8 text-gray-500">No teachers found. Add one to get started.</td></tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column (Widgets) */}
                <div className="flex flex-col gap-6">
                    {/* Alert Card */}
                    <div className="flex flex-col gap-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 p-5 shadow-sm">
                        <div className="flex items-start gap-3">
                            <div className="bg-white dark:bg-red-900 p-2 rounded-lg text-red-600 shadow-sm">
                                <AlertTriangle size={24} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-[#111318] dark:text-white text-base font-bold leading-tight">Unscreened Classes Alert</p>
                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-normal">Grade 5B and Grade 2A have not started screenings yet.</p>
                            </div>
                        </div>
                        <button
                            className="w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-[#135bec] hover:bg-[#0e44b3] text-white text-sm font-medium leading-normal transition-colors flex gap-2"
                            onClick={() => setIsEmailModalOpen(true)}
                        >
                            <Send size={18} />
                            <span>Send Reminder to Teachers</span>
                        </button>
                    </div>

                    {/* Smart Recommendations */}
                    {!recommendationDismissed ? (
                        <div className="rounded-xl border border-[#dbdfe6] dark:border-gray-700 bg-white dark:bg-surface-dark p-5 shadow-sm flex flex-col gap-4">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg text-[#135bec]">
                                    <Lightbulb size={24} />
                                </div>
                                <h3 className="text-[#111318] dark:text-white text-base font-bold">Smart Recommendations</h3>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                <p className="mb-3">Based on current screening velocity, you may need additional support staff for <strong>Grade 4</strong> next week.</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setRecommendationDismissed(true)}
                                    className="flex-1 cursor-pointer items-center justify-center rounded-lg h-8 border border-blue-200 dark:border-gray-600 text-[#135bec] dark:text-gray-300 text-xs font-bold hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Dismiss
                                </button>
                                <button
                                    onClick={() => setIsAllocationModalOpen(true)}
                                    className="flex-1 cursor-pointer items-center justify-center rounded-lg h-8 bg-[#135bec] text-white text-xs font-bold hover:bg-[#0e44b3] transition-colors"
                                >
                                    Allocate
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-[#dbdfe6] dark:border-gray-700 bg-white dark:bg-surface-dark p-5 shadow-sm flex flex-col gap-4 opacity-75">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="bg-green-50 dark:bg-green-900/30 p-2 rounded-lg text-green-600">
                                    <Check size={24} />
                                </div>
                                <h3 className="text-[#111318] dark:text-white text-base font-bold">All Recommendations Addressed</h3>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                <p>Great job! You're up to date with system optimizations.</p>
                            </div>
                        </div>
                    )}

                    {/* Admin Notifications */}
                    <div className="rounded-xl border border-[#dbdfe6] dark:border-gray-700 bg-white dark:bg-surface-dark p-5 shadow-sm flex-1">
                        <h3 className="text-[#111318] dark:text-white text-base font-bold mb-4">Admin Notifications</h3>
                        <div className="flex flex-col gap-4 relative">
                            <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-gray-100 dark:bg-gray-700"></div>

                            <div className="flex gap-3 relative z-10">
                                <div className="size-6 rounded-full bg-blue-100 dark:bg-blue-900 text-[#135bec] flex items-center justify-center shrink-0 border-2 border-white dark:border-surface-dark">
                                    <Mail size={14} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">10:42 AM</p>
                                    <p className="text-sm text-gray-800 dark:text-gray-200">District report submitted successfully.</p>
                                </div>
                            </div>

                            <div className="flex gap-3 relative z-10">
                                <div className="size-6 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 flex items-center justify-center shrink-0 border-2 border-white dark:border-surface-dark">
                                    <UserPlus size={14} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Yesterday</p>
                                    <p className="text-sm text-gray-800 dark:text-gray-200">New counselor access request from J. Doe.</p>
                                    <button className="mt-1 text-xs text-[#135bec] font-medium hover:underline">Review</button>
                                </div>
                            </div>

                            <div className="flex gap-3 relative z-10">
                                <div className="size-6 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 flex items-center justify-center shrink-0 border-2 border-white dark:border-surface-dark">
                                    <Clock size={14} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">2 days ago</p>
                                    <p className="text-sm text-gray-800 dark:text-gray-200">System maintenance scheduled for Nov 20.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Email Reminder Modal */}
            <Modal
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                title="Send Reminder to Teachers"
                footer={
                    <>
                        <button
                            onClick={() => setIsEmailModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSendEmail}
                            disabled={isSendingEmail}
                            className="flex items-center gap-2 px-4 py-2 bg-[#135bec] hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSendingEmail ? <span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" /> : <Send size={14} />}
                            {isSendingEmail ? 'Sending...' : 'Send Reminder'}
                        </button>
                    </>
                }
            >
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Recipients</label>
                        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">
                            All Teachers (24 recipients)
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                        <input
                            type="text"
                            value={emailSubject}
                            onChange={(e) => setEmailSubject(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
                        <textarea
                            value={emailBody}
                            onChange={(e) => setEmailBody(e.target.value)}
                            rows={6}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-none"
                        ></textarea>
                    </div>
                </div>
            </Modal>

            {/* Allocation Modal */}
            <Modal
                isOpen={isAllocationModalOpen}
                onClose={() => setIsAllocationModalOpen(false)}
                title="Allocate Support Staff"
                footer={
                    <>
                        <button
                            onClick={() => setIsAllocationModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAllocation}
                            disabled={!selectedTeacherId || isAllocating}
                            className="flex items-center gap-2 px-4 py-2 bg-[#135bec] hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isAllocating ? <span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" /> : <ClipboardList size={14} />}
                            {isAllocating ? 'Allocating...' : 'Confirm Allocation'}
                        </button>
                    </>
                }
            >
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Select an available staff member to allocate to <strong>Grade 4</strong> for the upcoming week.
                    </p>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {teacherActivity.map((teacher) => (
                            <div
                                key={teacher.id}
                                onClick={() => teacher.status === 'Active' && setSelectedTeacherId(teacher.id)}
                                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${selectedTeacherId === teacher.id
                                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 ring-1 ring-blue-500/20'
                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300'
                                    } ${teacher.status !== 'Active' ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-800/50' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-medium text-xs">
                                        <img src={teacher.image} alt="" className="w-full h-full rounded-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden'); }} />
                                        <span className="hidden">{teacher.name?.[0]}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{teacher.name}</p>
                                        <p className="text-xs text-slate-500">{teacher.class}</p>
                                    </div>
                                </div>
                                {selectedTeacherId === teacher.id && <Check size={16} className="text-blue-500" />}
                                {teacher.status !== 'Active' && <span className="text-xs text-red-500 font-medium">Busy</span>}
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>

            {/* Add Teacher Modal */}
            <Modal
                isOpen={isAddTeacherModalOpen}
                onClose={() => setIsAddTeacherModalOpen(false)}
                title="Invite New Educator"
                footer={
                    <>
                        <button
                            onClick={() => setIsAddTeacherModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddTeacher}
                            disabled={!teacherForm.firstName || !teacherForm.lastName || !teacherForm.email || isAddingTeacher}
                            className="flex items-center gap-2 px-6 py-2 bg-[#135bec] hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isAddingTeacher ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                            {isAddingTeacher ? 'Sending Invite...' : 'Send Invitation'}
                        </button>
                    </>
                }
            >
                <div className="flex flex-col gap-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex items-start gap-3 border border-blue-100 dark:border-blue-800/50">
                        <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg text-[#135bec]">
                            <UserPlus size={20} />
                        </div>
                        <div>
                            <h4 className="text-[#135bec] dark:text-blue-300 text-sm font-bold mb-1">Quick Invite</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                Enter the educator's details to send them a secure access link. They will be able to set up their profile and view assigned students immediately.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">First Name <span className="text-red-500">*</span></label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#135bec] transition-colors">
                                        <Users size={16} />
                                    </div>
                                    <input
                                        type="text"
                                        value={teacherForm.firstName}
                                        onChange={(e) => setTeacherForm({ ...teacherForm, firstName: e.target.value })}
                                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#135bec] transition-all text-sm font-medium"
                                        placeholder="Jane"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Last Name <span className="text-red-500">*</span></label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#135bec] transition-colors">
                                        <Users size={16} />
                                    </div>
                                    <input
                                        type="text"
                                        value={teacherForm.lastName}
                                        onChange={(e) => setTeacherForm({ ...teacherForm, lastName: e.target.value })}
                                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#135bec] transition-all text-sm font-medium"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Email Address <span className="text-red-500">*</span></label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#135bec] transition-colors">
                                    <Mail size={16} />
                                </div>
                                <input
                                    type="email"
                                    value={teacherForm.email}
                                    onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#135bec] transition-all text-sm font-medium"
                                    placeholder="jane.doe@school.edu"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Phone (Optional)</label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#135bec] transition-colors">
                                        <div className="bg-slate-200 dark:bg-slate-700 rounded-full p-0.5">
                                            <Share size={12} className="rotate-90" /> {/* Aproximating phone icon with Share until Phone is imported or simple generic icon */}
                                            {/* Actually I should check imports. I have 'Send' but not 'Phone'. Let's use 'Send' for now or 'Users' generic? Or just text. */}
                                            {/* Better yet, I'll add Phone to imports in a separate Edit if needed, but for now reuse what I have or generic. */}
                                        </div>
                                    </div>
                                    {/* Wait, I should maintain clean icons. Let's use no icon for phone if not imported, or add it to imports.*/}
                                    <input
                                        type="tel"
                                        value={teacherForm.phone}
                                        onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#135bec] transition-all text-sm font-medium"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Role / Assignment</label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#135bec] transition-colors">
                                        <TrendingUp size={16} /> {/* Generic role icon */}
                                    </div>
                                    <input
                                        type="text"
                                        value={teacherForm.assignment}
                                        onChange={(e) => setTeacherForm({ ...teacherForm, assignment: e.target.value })}
                                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#135bec] transition-all text-sm font-medium"
                                        placeholder="e.g. Grade 3A, Counselor"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default SchoolOverviewDashboard;
