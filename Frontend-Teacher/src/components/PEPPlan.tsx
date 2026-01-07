import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

interface PEPPlanProps {
    studentId: string;
    onNavigate: (view: string, data?: any) => void;
}

const PEPPlan: React.FC<PEPPlanProps> = ({ studentId, onNavigate }) => {
    const [pepData, setPepData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

    useEffect(() => {
        fetchPEP();
    }, [studentId]);

    const fetchPEP = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_BASE_URL}/teacher/students/${studentId}/pep`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to load PEP');
            }
            const data = await response.json();
            setPepData(data.pep);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (error || !pepData) return (
        <div className="min-h-screen bg-slate-50">
            {pepData?.teacher && (
                <Navbar
                    teacherName={pepData.teacher.name}
                    teacherAssignment={pepData.teacher.assignment}
                    schoolName={pepData.teacher.schoolName}
                    onNavigate={onNavigate}
                    activeView="my-students"
                />
            )}
            <div className="max-w-md mx-auto mt-20 text-center p-8 bg-white rounded-xl shadow-sm border border-slate-200">
                <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">assignment_late</span>
                <h3 className="text-lg font-bold text-slate-900">No PEP Available</h3>
                <p className="text-slate-500 mb-6">{error || "A Personalized Education Program has not been created for this student yet."}</p>
                <button
                    onClick={() => onNavigate('student-profile', { studentId })}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                    Back to Profile
                </button>
            </div>
        </div>
    );

    const { student, teacher, goals, activities } = pepData;

    return (
        <div className="bg-slate-50 min-h-screen font-display pb-12">
            <Navbar
                teacherName={teacher.name}
                teacherAssignment={teacher.assignment}
                schoolName={teacher.schoolName}
                onNavigate={onNavigate}
                activeView="my-students"
            />

            <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
                {/* Breadcrumbs & Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                        <button onClick={() => onNavigate('dashboard')} className="hover:text-blue-600">Dashboard</button>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        <button onClick={() => onNavigate('my-students')} className="hover:text-blue-600">My Students</button>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        <button onClick={() => onNavigate('student-profile', { studentId })} className="hover:text-blue-600">Profile</button>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        <span className="font-medium text-slate-900">PEP Plan</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-blue-200">
                                {student.firstName[0]}{student.lastName[0]}
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">
                                    {pepData.planName}
                                </h1>
                                <p className="text-slate-500 flex items-center gap-2">
                                    <span className="font-bold text-slate-900">{student.firstName} {student.lastName}</span>
                                    <span>•</span>
                                    <span>ID: {student.studentId}</span>
                                    <span>•</span>
                                    <span>Grade {student.grade}-{student.section}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Overall Progress</div>
                                <div className="flex items-center gap-3">
                                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-600 transition-all duration-1000"
                                            style={{ width: `${pepData.overallProgress}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-bold text-slate-900">{pepData.overallProgress}%</span>
                                </div>
                            </div>
                            <button className="h-12 w-12 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                                <span className="material-symbols-outlined">print</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Focus Areas & Description */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-600">target</span>
                                Focus Areas
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {pepData.focusAreas.map((area: string) => (
                                    <span key={area} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full capitalize">
                                        {area.replace('_', ' ')}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-600">info</span>
                                Plan Overview
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                                {pepData.description || "No description provided for this personalized education program."}
                            </p>
                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Start Date</div>
                                        <div className="text-sm font-semibold text-slate-900">
                                            {new Date(pepData.startDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Status</div>
                                        <div className="text-sm font-semibold text-green-600 flex items-center gap-1">
                                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                            Active
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Activities Section */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-600">skateboarding</span>
                                Recommended Activities
                            </h3>
                            <div className="space-y-4">
                                {activities.map((activity: any) => (
                                    <div key={activity.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors group">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{activity.activityName}</h4>
                                            <span className="text-[10px] px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-500 font-bold uppercase tracking-wider">
                                                {activity.activityType.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 mb-3 line-clamp-2">{activity.description}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                                                    {activity.duration} min
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">event_repeat</span>
                                                    {activity.frequency}
                                                </span>
                                            </div>
                                            <button className="text-blue-600 hover:text-blue-700">
                                                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {activities.length === 0 && (
                                    <p className="text-center text-slate-400 text-sm py-4 italic">No activities assigned yet.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Goals Progress */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-blue-600">emoji_events</span>
                                    Learning Goals
                                </h3>
                                <span className="text-xs font-bold text-slate-400">{goals.length} active goals</span>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {goals.map((goal: any) => (
                                    <div key={goal.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                                                        {goal.goalNumber}
                                                    </span>
                                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase tracking-wider">
                                                        {goal.domain}
                                                    </span>
                                                </div>
                                                <h4 className="text-lg font-bold text-slate-900 mb-2 leading-relaxed">
                                                    {goal.goalStatement}
                                                </h4>
                                                {goal.targetDate && (
                                                    <p className="text-xs text-slate-400 flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                                        Target Date: {new Date(goal.targetDate).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <div className="text-2xl font-black text-blue-600 leading-none mb-1">{goal.currentProgress}%</div>
                                                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">Current Mastery</div>
                                            </div>
                                        </div>

                                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-6 border border-slate-50">
                                            <div
                                                className="h-full bg-blue-600 transition-all duration-1000 relative"
                                                style={{ width: `${goal.currentProgress}%` }}
                                            >
                                                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                                            </div>
                                        </div>

                                        {goal.latestUpdate ? (
                                            <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-100">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-orange-500 text-[18px]">psychology</span>
                                                        <span className="text-xs font-bold text-orange-700">Latest Observation</span>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-orange-400">
                                                        {new Date(goal.latestUpdate.updateDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600 italic leading-relaxed">
                                                    "{goal.latestUpdate.notes}"
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-400 italic">No progress observations recorded yet.</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Teacher's Note Placeholder */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl shadow-slate-200">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-white">lightbulb</span>
                                </div>
                                <div>
                                    <h4 className="font-bold mb-1">Implementing this PEP at School</h4>
                                    <p className="text-white/70 text-sm leading-relaxed mb-4">
                                        These goals and activities are personalized based on the latest screenings. Focus on incorporating the learning goals during class rotations and individual workstation time.
                                    </p>
                                    <button className="text-xs font-bold text-white bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors">
                                        View Implementation Guide
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

export default PEPPlan;
