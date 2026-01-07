import React, { useState, useEffect } from 'react';


// Interfaces
interface TeacherDashboardProps {
    onNavigate: (view: string, data?: any) => void;
}

interface StudentCard {
    id: string;
    name: string;
    grade: string;
    section: string;
    screeningStatus: 'not_screened' | 'in_progress' | 'completed';
    lastScreening: string | null;
    consentStatus: boolean;
    urgentFlag: boolean;
}

interface Activity {
    id: string;
    type: 'screening_completed' | 'flag_raised' | 'consent_received';
    studentName: string;
    timestamp: string;
    message: string;
}

interface DashboardData {
    teacher: {
        id: string;
        name: string;
        assignment: string;
        school: {
            name: string;
            district: string;
        };
    };
    stats: {
        totalStudents: number;
        pendingScreenings: number;
        completedToday: number;
        flagged: number;
    };
    students: StudentCard[];
    recentActivity: Activity[];
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onNavigate }) => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'flagged'>('all');

    // Use environment variable or default for API URL
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('auth_token');

            const response = await fetch(`${API_BASE_URL}/teacher/dashboard`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to load dashboard data');

            const data = await response.json();
            setDashboardData(data);
            return;
        } catch (err: any) {
            setError(err.message || 'Failed to fetch dashboard data');
        } finally {
            setIsLoading(false);
        }


    };

    const handleViewStudent = (studentId: string) => {
        onNavigate('student-profile', { studentId });
    };

    const handleStartScreening = (studentId: string) => {
        onNavigate('screening-flow', { studentId, phase: 1 });
    };

    const handleViewAllStudents = () => {
        onNavigate('my-students');
    };

    const handleDownloadReport = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_BASE_URL}/teacher/reports/class`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Download failed');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `class-report-${Date.now()}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (e) {
            console.error(e);
            alert('Failed to download report');
        }
    };

    const handleFilterChange = (filter: 'all' | 'pending' | 'flagged') => {
        setSelectedFilter(filter);
    };

    const getFilteredStudents = () => {
        if (!dashboardData) return [];
        return dashboardData.students.filter(student => {
            if (selectedFilter === 'pending') return student.screeningStatus === 'not_screened';
            if (selectedFilter === 'flagged') return student.urgentFlag;
            return true;
        });
    };

    // Helper for KPI Cards
    const KPICard = ({ title, value, icon, color, trend }: any) => (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between h-full relative overflow-hidden">
            <div className={`absolute top-0 right-0 p-3 opacity-10 rounded-bl-2xl bg-${color}-500 text-${color}-600`}>
                <span className="material-symbols-outlined text-4xl">{icon}</span>
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{title}</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">{value}</h3>
            </div>
            {trend && (
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-green-600">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span>
                    <span>{trend}</span>
                </div>
            )}
        </div>
    );

    // Helper for Activity Item
    const ActivityItem = ({ activity }: { activity: Activity }) => {
        let icon = 'info';
        let colorClass = 'bg-slate-100 text-slate-600';

        if (activity.type === 'screening_completed') {
            icon = 'check_circle';
            colorClass = 'bg-green-100 text-green-600';
        } else if (activity.type === 'flag_raised') {
            icon = 'flag';
            colorClass = 'bg-red-100 text-red-600';
        } else if (activity.type === 'consent_received') {
            icon = 'assignment_turned_in';
            colorClass = 'bg-amber-100 text-amber-600';
        }

        return (
            <div className="flex gap-3 pb-6 last:pb-0 relative group">
                <div className="absolute left-[19px] top-8 bottom-0 w-0.5 bg-slate-100 group-last:hidden"></div>
                <div className={`relative z-10 size-10 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
                    <span className="material-symbols-outlined text-[20px]">{icon}</span>
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-900">
                        {activity.message} <span className="font-bold">({activity.studentName})</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">schedule</span>
                        {activity.timestamp}
                    </p>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error || !dashboardData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-sm border border-slate-200">
                    <span className="material-symbols-outlined text-4xl text-red-500 mb-3">error</span>
                    <h3 className="text-lg font-bold text-slate-900">Unable to load dashboard</h3>
                    <p className="text-slate-500 mt-2 mb-4">{error || 'Unknown error occurred'}</p>
                    <button
                        onClick={fetchDashboardData}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen font-display">
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Welcome Section */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Welcome back, {dashboardData?.teacher?.name || 'Teacher'}</h2>
                    <p className="text-slate-500">Here is an overview of your assigned class: <span className="font-semibold text-slate-700">{dashboardData?.teacher?.assignment || 'Class'}</span></p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KPICard
                        title="Total Students"
                        value={dashboardData.stats.totalStudents}
                        icon="groups"
                        color="blue"
                    />
                    <KPICard
                        title="Pending Screenings"
                        value={dashboardData.stats.pendingScreenings}
                        icon="hourglass_top"
                        color="amber"
                        trend="Action Needed"
                    />
                    <KPICard
                        title="Completed Today"
                        value={dashboardData.stats.completedToday}
                        icon="check_circle"
                        color="green"
                        trend="+2 from yesterday"
                    />
                    <KPICard
                        title="Urgent Flags"
                        value={dashboardData.stats.flagged}
                        icon="flag"
                        color="red"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Column: Pending Screenings / Students List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <h3 className="font-bold text-lg text-slate-900">Class Overview</h3>
                                <div className="flex bg-slate-100 p-1 rounded-lg">
                                    {(['all', 'pending', 'flagged'] as const).map((filter) => (
                                        <button
                                            key={filter}
                                            onClick={() => handleFilterChange(filter)}
                                            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all capitalize ${selectedFilter === filter
                                                ? 'bg-white text-blue-600 shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700'
                                                }`}
                                        >
                                            {filter}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-3 font-semibold">Student Name</th>
                                            <th className="px-6 py-3 font-semibold">Grade/Sec</th>
                                            <th className="px-6 py-3 font-semibold">Consent</th>
                                            <th className="px-6 py-3 font-semibold">Status</th>
                                            <th className="px-6 py-3 font-semibold text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {getFilteredStudents().slice(0, 5).map((student) => (
                                            <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-slate-900">{student.name}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500">
                                                    {student.grade}-{student.section}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {student.consentStatus ? (
                                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                                            <span className="material-symbols-outlined text-[12px]">check</span> Received
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                                                            <span className="material-symbols-outlined text-[12px]">schedule</span> Pending
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {student.screeningStatus === 'completed' && (
                                                        <span className="text-xs font-bold text-green-600">Completed</span>
                                                    )}
                                                    {student.screeningStatus === 'in_progress' && (
                                                        <span className="text-xs font-bold text-blue-600">In Progress</span>
                                                    )}
                                                    {student.screeningStatus === 'not_screened' && (
                                                        <span className="text-xs font-bold text-slate-400">Not Started</span>
                                                    )}
                                                    {student.urgentFlag && (
                                                        <span className="ml-2 inline-flex items-center text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-1.5 rounded">
                                                            FLAG
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {student.screeningStatus !== 'completed' && student.consentStatus ? (
                                                        <button
                                                            onClick={() => handleStartScreening(student.id)}
                                                            className="text-blue-600 hover:text-blue-800 text-sm font-semibold hover:underline"
                                                        >
                                                            {student.screeningStatus === 'in_progress' ? 'Resume' : 'Start'}
                                                        </button>
                                                    ) : !student.consentStatus ? (
                                                        <button className="text-amber-600 hover:text-amber-800 text-sm font-semibold hover:underline">
                                                            Request
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleViewStudent(student.id)}
                                                            className="text-slate-400 hover:text-slate-600 text-sm font-medium hover:underline"
                                                        >
                                                            View
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {getFilteredStudents().length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-8 text-center text-slate-400 text-sm">
                                                    No students found matching this filter.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-center">
                                <button
                                    onClick={handleViewAllStudents}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                    View All Students
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Column: Recent Activity & Quick Actions */}
                    <div className="space-y-6">

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                            <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={handleViewAllStudents}
                                    className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-blue-50 hover:border-blue-100 hover:text-blue-600 transition-all group"
                                >
                                    <span className="material-symbols-outlined text-[24px] mb-1 group-hover:scale-110 transition-transform">groups</span>
                                    <span className="text-xs font-semibold">My Class</span>
                                </button>
                                <button
                                    onClick={handleDownloadReport}
                                    className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-blue-50 hover:border-blue-100 hover:text-blue-600 transition-all group"
                                >
                                    <span className="material-symbols-outlined text-[24px] mb-1 group-hover:scale-110 transition-transform">download</span>
                                    <span className="text-xs font-semibold">Report</span>
                                </button>
                                <button
                                    onClick={() => onNavigate('settings')}
                                    className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-blue-50 hover:border-blue-100 hover:text-blue-600 transition-all group"
                                >
                                    <span className="material-symbols-outlined text-[24px] mb-1 group-hover:scale-110 transition-transform">settings</span>
                                    <span className="text-xs font-semibold">Settings</span>
                                </button>
                                <button
                                    onClick={() => window.open('https://help.daira.edu', '_blank')}
                                    className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-blue-50 hover:border-blue-100 hover:text-blue-600 transition-all group"
                                >
                                    <span className="material-symbols-outlined text-[24px] mb-1 group-hover:scale-110 transition-transform">help</span>
                                    <span className="text-xs font-semibold">Help</span>
                                </button>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-slate-900">Recent Activity</h3>
                                <button className="text-xs font-medium text-blue-600 hover:underline">View All</button>
                            </div>
                            <div>
                                {(dashboardData.recentActivity || []).map(activity => (
                                    <ActivityItem key={activity.id} activity={activity} />
                                ))}
                                {(dashboardData.recentActivity || []).length === 0 && (
                                    <p className="text-center text-slate-400 text-sm py-4">No recent activity.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TeacherDashboard;
