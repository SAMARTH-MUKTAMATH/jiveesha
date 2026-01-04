import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Activity, Calendar, Eye, Download, Share2,
    CheckCircle2, Clock, AlertCircle, Filter, Search
} from 'lucide-react';
import Layout from '../components/Layout';
import screeningService from '../services/screening.service';
import childrenService from '../services/children.service';
import type { Screening } from '../services/screening.service';
import type { Child } from '../services/children.service';

export default function ScreeningHistory() {
    const navigate = useNavigate();
    const [screenings, setScreenings] = useState<Screening[]>([]);
    const [filteredScreenings, setFilteredScreenings] = useState<Screening[]>([]);
    const [children, setChildren] = useState<Child[]>([]);
    const [selectedChildId, setSelectedChildId] = useState<string>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        filterScreenings();
    }, [selectedChildId, screenings]);

    const loadData = async () => {
        try {
            const [screeningsRes, childrenRes] = await Promise.all([
                screeningService.getScreeningHistory(),
                childrenService.getChildren(),
            ]);

            if (screeningsRes.success) {
                setScreenings(screeningsRes.data);
                setFilteredScreenings(screeningsRes.data);
            }

            if (childrenRes.success) {
                setChildren(childrenRes.data);
            }

            setLoading(false);
        } catch (error) {
            console.error('Failed to load data:', error);
            setLoading(false);
        }
    };

    const filterScreenings = () => {
        if (selectedChildId === 'all') {
            setFilteredScreenings(screenings);
        } else {
            setFilteredScreenings(screenings.filter(s => s.childId === selectedChildId));
        }
    };

    const getChildName = (childId: string) => {
        const child = children.find(c => c.id === childId);
        return child ? `${child.firstName} ${child.lastName}` : 'Unknown';
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return {
                    icon: CheckCircle2,
                    text: 'Completed',
                    className: 'bg-green-100 text-green-700 border-green-200',
                };
            case 'in_progress':
                return {
                    icon: Clock,
                    text: 'In Progress',
                    className: 'bg-blue-100 text-blue-700 border-blue-200',
                };
            default:
                return {
                    icon: AlertCircle,
                    text: 'Pending',
                    className: 'bg-amber-100 text-amber-700 border-amber-200',
                };
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
                        <p className="mt-4 text-slate-600">Loading screening history...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-slate-600 hover:text-[#2563EB] font-semibold transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Dashboard</span>
                </button>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex flex-col gap-1">
                        <p className="text-slate-600 text-sm font-semibold uppercase tracking-wide">
                            Screening History
                        </p>
                        <h1 className="text-slate-900 text-3xl md:text-4xl font-black leading-tight tracking-tight">
                            Assessment Results
                        </h1>
                        <p className="text-slate-600 text-base">
                            View and manage completed developmental screenings
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/screening/select')}
                        className="flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl"
                    >
                        <Activity size={20} />
                        <span>New Screening</span>
                    </button>
                </div>

                {/* Filters */}
                {children.length > 1 && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center gap-4">
                            <Filter className="text-slate-400" size={20} />
                            <select
                                value={selectedChildId}
                                onChange={(e) => setSelectedChildId(e.target.value)}
                                className="flex-1 h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                            >
                                <option value="all">All Children</option>
                                {children.map((child) => (
                                    <option key={child.id} value={child.id}>
                                        {child.firstName} {child.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {filteredScreenings.length === 0 && (
                    <div className="flex items-center justify-center min-h-[40vh]">
                        <div className="text-center max-w-md mx-auto">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-6">
                                <Activity className="text-[#2563EB]" size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3">
                                No Screenings Yet
                            </h2>
                            <p className="text-slate-600 mb-8 leading-relaxed">
                                {selectedChildId === 'all'
                                    ? 'Start your first developmental screening to track your child\'s progress.'
                                    : 'No screenings found for this child. Start a new screening to begin tracking.'}
                            </p>
                            <button
                                onClick={() => navigate('/screening/select')}
                                className="flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg hover:shadow-xl mx-auto"
                            >
                                <Activity size={20} />
                                <span>Start First Screening</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Screening List */}
                {filteredScreenings.length > 0 && (
                    <div className="space-y-4">
                        {filteredScreenings.map((screening) => {
                            const statusBadge = getStatusBadge(screening.status);
                            const StatusIcon = statusBadge.icon;

                            return (
                                <div
                                    key={screening.id}
                                    className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-xl transition-all group"
                                >
                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                            {/* Left: Screening Info */}
                                            <div className="flex-1">
                                                <div className="flex items-start gap-4">
                                                    <div className="size-12 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center shrink-0">
                                                        <Activity size={24} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-bold text-slate-900 mb-1">
                                                            {screening.screeningTypeId.toUpperCase()} Screening
                                                        </h3>
                                                        <p className="text-sm text-slate-600 mb-3">
                                                            For: <span className="font-semibold">{getChildName(screening.childId)}</span>
                                                        </p>
                                                        <div className="flex flex-wrap items-center gap-4 text-sm">
                                                            <div className="flex items-center gap-2 text-slate-600">
                                                                <Calendar size={16} className="text-[#2563EB]" />
                                                                <span>
                                                                    {screening.completedAt
                                                                        ? `Completed: ${formatDate(screening.completedAt)}`
                                                                        : `Started: ${formatDate(screening.startedAt)}`}
                                                                </span>
                                                            </div>
                                                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${statusBadge.className}`}>
                                                                <StatusIcon size={14} />
                                                                <span className="font-semibold text-xs">{statusBadge.text}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Progress Bar (for in-progress) */}
                                                {screening.status === 'in_progress' && (
                                                    <div className="mt-4">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <p className="text-xs font-semibold text-slate-600">Progress</p>
                                                            <p className="text-xs font-bold text-[#2563EB]">{screening.progress}%</p>
                                                        </div>
                                                        <div className="w-full bg-slate-200 rounded-full h-2">
                                                            <div
                                                                className="bg-[#2563EB] h-2 rounded-full transition-all"
                                                                style={{ width: `${screening.progress}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Right: Action Buttons */}
                                            <div className="flex flex-wrap gap-2">
                                                {screening.status === 'in_progress' && (
                                                    <button
                                                        onClick={() => navigate(`/screening/${screening.id}/start`)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
                                                    >
                                                        <Clock size={16} />
                                                        <span>Continue</span>
                                                    </button>
                                                )}

                                                {screening.status === 'completed' && (
                                                    <>
                                                        <button
                                                            onClick={() => navigate(`/screening/${screening.id}/results`)}
                                                            className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
                                                        >
                                                            <Eye size={16} />
                                                            <span>View Results</span>
                                                        </button>
                                                        <button
                                                            onClick={() => alert('Download functionality to be implemented')}
                                                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all"
                                                        >
                                                            <Download size={16} />
                                                            <span>Download</span>
                                                        </button>
                                                        <button
                                                            onClick={() => navigate(`/children/${screening.childId}/share`)}
                                                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all"
                                                        >
                                                            <Share2 size={16} />
                                                            <span>Share</span>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </Layout>
    );
}
