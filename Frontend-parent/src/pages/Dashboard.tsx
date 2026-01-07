import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AlertTriangle, ArrowRight, Plus, Edit, Eye, CheckCircle,
    FileText, Lightbulb, Activity, BookOpen
} from 'lucide-react';

import childrenService from '../services/children.service';
import type { Child } from '../services/children.service';
import dashboardService from '../services/dashboard.service';
import type { DashboardStats, SkillProgress, RecentActivity } from '../services/dashboard.service';
import authService from '../services/auth.service';

export default function Dashboard() {
    const navigate = useNavigate();
    const [children, setChildren] = useState<Child[]>([]);
    const [selectedChild, setSelectedChild] = useState<Child | null>(null);
    const [stats, setStats] = useState<DashboardStats>({
        activeScreenings: 0,
        pepsDue: 0,
        newRecommendations: 0,
        milestoneProgress: 0,
    });
    const [skills, setSkills] = useState<SkillProgress[]>([]);
    const [activities, setActivities] = useState<RecentActivity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (selectedChild) {
            loadChildStats(selectedChild.id);
        }
    }, [selectedChild]);

    const loadData = async () => {
        try {
            const childrenRes = await childrenService.getChildren();
            if (childrenRes.success && childrenRes.data.length > 0) {
                setChildren(childrenRes.data);
                setSelectedChild(childrenRes.data[0]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            setLoading(false);
        }
    };

    const loadChildStats = async (childId: string) => {
        try {
            // Load stats
            const statsRes = await dashboardService.getStats(childId);
            if (statsRes.success) {
                setStats(statsRes.data);
            }

            // Load skill progress
            const skillsRes = await dashboardService.getSkillProgress(childId);
            if (skillsRes.success) {
                setSkills(skillsRes.data);
            }

            // Load recent activities
            const activitiesRes = await dashboardService.getRecentActivities(childId);
            if (activitiesRes.success) {
                setActivities(activitiesRes.data);
            }
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    };

    const calculateAge = (dateOfBirth: string) => {
        const age = childrenService.calculateAge(dateOfBirth);
        if (age.years === 0) {
            return `${age.months} months`;
        }
        return `${age.years} ${age.years === 1 ? 'year' : 'years'}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
                    <p className="mt-4 text-slate-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                            Welcome back, {authService.getCurrentUser()?.firstName || 'Parent'}
                        </h1>
                        <p className="text-sm sm:text-base text-slate-600 mt-1">Here's what's happening with your family's growth today.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => selectedChild && loadChildStats(selectedChild.id)}
                            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold text-sm transition-all flex items-center gap-2"
                        >
                            <Activity size={16} />
                            Refresh
                        </button>
                        <div className="text-xs sm:text-sm font-semibold text-[#2563EB]">
                            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                    </div>
                </div>

                {/* Main Grid: Left Content (2/3) + Right Sidebar (1/3) */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* My Children Section */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-slate-900">My Children</h2>
                                <button className="text-sm font-semibold text-[#2563EB] hover:underline">
                                    View All
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {children.length > 0 ? (
                                    children.map((child) => (
                                        <div key={child.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                                            {/* Child Header */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    {child.profilePictureUrl ? (
                                                        <img
                                                            src={child.profilePictureUrl}
                                                            alt={`${child.firstName}'s profile`}
                                                            className="w-12 h-12 rounded-full object-cover border border-slate-200"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <span className="text-lg font-bold text-[#2563EB]">{child.firstName[0]}</span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h3 className="text-lg font-bold text-slate-900">{child.firstName} {child.lastName}</h3>
                                                        <p className="text-sm text-slate-600">{calculateAge(child.dateOfBirth)}</p>
                                                    </div>
                                                </div>
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded">
                                                    <AlertTriangle size={12} />
                                                    Action Needed
                                                </span>
                                            </div>

                                            {/* Progress Section */}
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-semibold text-slate-700">Developmental Screening</span>
                                                    <span className="text-xs text-slate-500">Step 2 of 4 • Pending Parent Input</span>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-2">
                                                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <button className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
                                                Resume Screening
                                                <ArrowRight size={16} />
                                            </button>

                                            {/* Secondary Info */}
                                            <div className="mt-4 pt-4 border-t border-slate-100">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-slate-600">Next Milestone Check</span>
                                                    <span className="font-semibold text-slate-900">Scheduled for Nov 12, 2025</span>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                                                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                                                </div>
                                            </div>

                                            {/* View Profile Link */}
                                            <button
                                                onClick={() => navigate(`/children/${child.id}`)}
                                                className="w-full mt-4 text-sm font-semibold text-slate-600 hover:text-[#2563EB] transition-colors"
                                            >
                                                View Profile
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-2 bg-white rounded-xl border-2 border-dashed border-slate-300 p-8 text-center">
                                        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                                            <Plus className="text-[#2563EB]" size={32} />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-2">Add Your First Child</h3>
                                        <p className="text-slate-600 mb-4">Start tracking developmental milestones and screenings</p>
                                        <button
                                            onClick={() => navigate('/onboarding/add-child')}
                                            className="bg-[#2563EB] hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
                                        >
                                            Add Child
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Active Education Plan (PEP) Section */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                        <Activity className="text-[#2563EB]" size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">Active Education Plan (PEP)</h2>
                                        <p className="text-sm text-slate-600">Focusing on {selectedChild?.firstName}'s early literacy and motor skills.</p>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                    <Edit className="text-slate-600" size={18} />
                                </button>
                            </div>

                            {/* Skill Progress Bars */}
                            <div className="space-y-4 mb-6">
                                {skills.length > 0 ? (
                                    skills.map((skill) => {
                                        const getColor = (progress: number) => {
                                            if (progress >= 70) return { bg: 'bg-[#2563EB]', text: 'text-[#2563EB]' };
                                            if (progress >= 40) return { bg: 'bg-orange-500', text: 'text-orange-500' };
                                            return { bg: 'bg-red-500', text: 'text-red-500' };
                                        };
                                        const color = getColor(skill.progress);
                                        const domainName = skill.domain.charAt(0).toUpperCase() + skill.domain.slice(1);

                                        return (
                                            <div key={skill.domain}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-semibold text-slate-700">{domainName}</span>
                                                    <span className={`text-sm font-bold ${color.text}`}>{skill.progress}%</span>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-2">
                                                    <div className={`${color.bg} h-2 rounded-full`} style={{ width: `${skill.progress}%` }}></div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-4">
                                        <p className="text-sm text-slate-600">No skill progress data available yet.</p>
                                        <p className="text-xs text-slate-500 mt-1">Start adding goals to track progress!</p>
                                    </div>
                                )}
                            </div>

                            {/* Recent Activities */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {activities.length > 0 ? (
                                    activities.slice(0, 2).map((activity) => (
                                        <div key={activity.id} className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Activity className="text-[#2563EB]" size={16} />
                                                <h4 className="text-sm font-bold text-slate-900">{activity.activityName}</h4>
                                            </div>
                                            <p className="text-xs text-slate-600 line-clamp-2">{activity.description}</p>
                                            {activity.completionCount > 0 && (
                                                <p className="text-xs text-green-600 mt-1">Completed {activity.completionCount} times</p>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-2 text-center py-4">
                                        <p className="text-sm text-slate-600">No recent activities yet.</p>
                                        <button
                                            onClick={() => navigate('/pep')}
                                            className="text-xs text-[#2563EB] hover:underline mt-1"
                                        >
                                            Manage Education Plan & Activities
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        {/* Data Consent Card */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <h3 className="text-base font-bold text-slate-900 mb-4">Data Consent</h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Share with School</p>
                                        <p className="text-xs text-slate-600">Sunnydale Preschool</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Pediatric Access</p>
                                        <p className="text-xs text-slate-600">Dr. Emily Chen</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Research Data</p>
                                        <p className="text-xs text-slate-600">Anonymized usage</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
                                    </label>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/consent')}
                                className="w-full mt-4 text-[#2563EB] text-sm font-semibold hover:underline"
                            >
                                Manage Consents
                            </button>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
                                <button className="text-sm font-semibold text-[#2563EB] hover:underline">
                                    View All
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                        <Eye className="text-[#2563EB]" size={14} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-900">Report Viewed</p>
                                        <p className="text-xs text-slate-600 mt-0.5">Dr. Chen accessed {selectedChild?.firstName}'s screening results.</p>
                                        <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                        <CheckCircle className="text-green-600" size={14} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-900">Screening Completed</p>
                                        <p className="text-xs text-slate-600 mt-0.5">Mia's 24-month check-up questionnaire submitted.</p>
                                        <p className="text-xs text-slate-400 mt-1">Yesterday</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                                        <FileText className="text-purple-600" size={14} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-900">PEP Updated</p>
                                        <p className="text-xs text-slate-600 mt-0.5">New motor skills activities added for {selectedChild?.firstName}.</p>
                                        <p className="text-xs text-slate-400 mt-1">Oct 20</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Parenting Tip */}
                        <div className="bg-[#2563EB] rounded-xl p-6 text-white shadow-lg">
                            <div className="flex items-center gap-2 mb-3">
                                <Lightbulb className="text-white" size={20} />
                                <h3 className="text-base font-bold">Parenting Tip</h3>
                            </div>
                            <p className="text-sm text-blue-50 mb-4 leading-relaxed">
                                Reading aloud to children helps develop language skills even before they can talk.
                            </p>
                            <button className="bg-white text-[#2563EB] font-semibold py-2 px-4 rounded-lg text-sm hover:bg-blue-50 transition-colors">
                                Read Article
                            </button>
                        </div>

                        {/* Daily Journal Card */}
                        <div
                            onClick={() => navigate('/journal')}
                            className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all group"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <BookOpen className="text-purple-600" size={28} />
                                <h3 className="text-lg font-bold text-slate-900">Daily Journal</h3>
                            </div>
                            <p className="text-sm text-slate-600 mb-4">
                                Document milestones and share with your care team
                            </p>
                            <div className="flex items-center gap-2 text-purple-600 font-semibold text-sm group-hover:gap-3 transition-all">
                                <span>View Timeline</span>
                                <ArrowRight size={16} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
