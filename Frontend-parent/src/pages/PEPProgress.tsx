import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Download, Share2, TrendingUp, TrendingDown,
    Activity, Users, Brain, MessageCircle, Hand, Sparkles,
    Calendar, CheckCircle2, BarChart3, PieChart, Clock,
    Dumbbell, Music, TreePine, Palette, Gamepad2, AlertCircle,
    Loader2, FileText
} from 'lucide-react';
import Layout from '../components/Layout';
import pepService from '../services/pep.service';
import type { PEP, PEPProgressData } from '../services/pep.service';

export default function PEPProgress() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [pep, setPEP] = useState<PEP | null>(null);
    const [progressData, setProgressData] = useState<PEPProgressData | null>(null);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [dateRange, setDateRange] = useState<'7days' | '30days' | '90days' | 'all'>('30days');

    useEffect(() => {
        if (id) {
            loadData(id);
        }
    }, [id, dateRange]);

    const loadData = async (pepId: string) => {
        try {
            const now = new Date();
            let startDate: string | undefined;

            if (dateRange === '7days') {
                startDate = new Date(now.setDate(now.getDate() - 7)).toISOString();
            } else if (dateRange === '30days') {
                startDate = new Date(now.setDate(now.getDate() - 30)).toISOString();
            } else if (dateRange === '90days') {
                startDate = new Date(now.setDate(now.getDate() - 90)).toISOString();
            }

            const [pepRes, progressRes] = await Promise.all([
                pepService.getPEP(pepId),
                pepService.getPEPProgress(pepId, startDate),
            ]);

            if (pepRes.success) {
                setPEP(pepRes.data);
            }
            if (progressRes.success) {
                setProgressData(progressRes.data);
            }

            setLoading(false);
        } catch (error) {
            console.error('Failed to load progress data:', error);
            setLoading(false);
        }
    };

    const handleExport = async (format: 'pdf' | 'csv') => {
        if (!id) return;

        try {
            setExporting(true);
            const response = await pepService.exportPEPReport(id, format);
            if (response.success) {
                // Open download URL
                window.open(response.url, '_blank');
            }
        } catch (error) {
            console.error('Failed to export:', error);
            alert('Failed to export report. Please try again.');
        } finally {
            setExporting(false);
        }
    };

    /* 
      ========================================================================
      GENAI INTEGRATION POINT: AI Progress Insights
      ========================================================================
      
      When GenAI service is ready, implement:
      
      const handleGetAIInsights = async () => {
        try {
          setLoadingInsights(true);
          
          const insights = await genAIService.analyzeProgress({
            pepId: id,
            completions: progressData.recentCompletions,
            timeframe: dateRange,
            domainProgress: progressData.domainProgress,
          });
          
          // Display insights modal with:
          // - Strengths identified
          // - Areas needing attention
          // - Optimal activity times
          // - Difficulty recommendations
          // - Early warnings
          
          setAIInsights(insights);
          setShowInsightsModal(true);
          
        } catch (error) {
          console.error('Failed to get AI insights:', error);
        } finally {
          setLoadingInsights(false);
        }
      };
      
      AI analyzes:
      - Completion patterns over time
      - Domain-specific trends
      - Activity difficulty vs success rate
      - Parent engagement consistency
      - Time-of-day performance
      
      Returns actionable insights and recommendations
      
      ========================================================================
    */

    const handleGetAIInsights = () => {
        alert('GenAI Integration Point: This will analyze progress patterns and provide insights. Implementation pending.');
    };

    const getDomainIcon = (domain: string) => {
        const icons: any = {
            motor: Activity,
            social: Users,
            cognitive: Brain,
            communication: MessageCircle,
            adaptive: Hand,
        };
        return icons[domain] || Activity;
    };

    const getCategoryIcon = (category: string) => {
        const icons: any = {
            sports: Dumbbell,
            music: Music,
            recreation: TreePine,
            arts: Palette,
            games: Gamepad2,
        };
        return icons[category] || Activity;
    };

    const getProgressColor = (progress: number) => {
        if (progress >= 80) return 'text-green-600';
        if (progress >= 50) return 'text-blue-600';
        if (progress >= 30) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getProgressBgColor = (progress: number) => {
        if (progress >= 80) return 'bg-green-100 border-green-200';
        if (progress >= 50) return 'bg-blue-100 border-blue-200';
        if (progress >= 30) return 'bg-yellow-100 border-yellow-200';
        return 'bg-red-100 border-red-200';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
                        <p className="mt-4 text-slate-600">Loading progress...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!pep || !progressData) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">PEP Not Found</h2>
                        <p className="text-slate-600 mb-6">This PEP doesn't exist or has been deleted.</p>
                        <button
                            onClick={() => navigate('/pep')}
                            className="px-6 py-3 bg-[#2563EB] text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
                        >
                            Back to PEPs
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
                {/* Back Button */}
                <button
                    onClick={() => navigate(`/pep/${id}/activities`)}
                    className="flex items-center gap-2 text-slate-600 hover:text-[#2563EB] font-semibold transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Activities</span>
                </button>

                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-slate-900 mb-2">
                                Progress Tracking
                            </h1>
                            <p className="text-slate-600">
                                PEP for <strong>{pep.childName}</strong>
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleExport('pdf')}
                                disabled={exporting}
                                className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg font-semibold text-sm transition-all disabled:opacity-50"
                            >
                                {exporting ? (
                                    <Loader2 className="animate-spin" size={16} />
                                ) : (
                                    <Download size={16} />
                                )}
                                <span>Export PDF</span>
                            </button>
                            <button
                                onClick={() => handleExport('csv')}
                                disabled={exporting}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-[#2563EB] rounded-lg font-semibold text-sm transition-all disabled:opacity-50"
                            >
                                {exporting ? (
                                    <Loader2 className="animate-spin" size={16} />
                                ) : (
                                    <FileText size={16} />
                                )}
                                <span>Export CSV</span>
                            </button>
                        </div>
                    </div>

                    {/* Date Range Filter */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <Clock size={18} className="text-slate-600" />
                        <span className="text-sm font-semibold text-slate-700">Time Period:</span>
                        <div className="flex gap-2 flex-wrap">
                            {[
                                { value: '7days', label: 'Last 7 Days' },
                                { value: '30days', label: 'Last 30 Days' },
                                { value: '90days', label: 'Last 90 Days' },
                                { value: 'all', label: 'All Time' },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setDateRange(option.value as any)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${dateRange === option.value
                                            ? 'bg-[#2563EB] text-white'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* AI Insights Panel */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="size-14 rounded-full bg-purple-600 flex items-center justify-center shrink-0">
                            <Sparkles className="text-white" size={28} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                AI-Powered Progress Insights
                            </h3>
                            <p className="text-slate-600 mb-4">
                                Get intelligent analysis of progress patterns, strengths, areas needing attention,
                                and personalized recommendations based on completion data.
                            </p>
                            <button
                                onClick={handleGetAIInsights}
                                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
                            >
                                <Sparkles size={18} />
                                <span>Generate AI Insights</span>
                            </button>
                            <p className="text-xs text-purple-700 mt-3">
                                <strong>Integration Pending:</strong> This feature will be available once GenAI analytics service is connected.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Overall Progress */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <TrendingUp className="text-[#2563EB]" size={24} />
                        Overall Progress
                    </h2>

                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="relative size-32 mx-auto mb-3">
                                <svg className="size-32 transform -rotate-90">
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="none"
                                        className="text-slate-200"
                                    />
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="none"
                                        strokeDasharray={`${2 * Math.PI * 56}`}
                                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - progressData.overallProgress / 100)}`}
                                        className="text-[#2563EB] transition-all duration-1000"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-3xl font-bold text-slate-900">
                                        {progressData.overallProgress}%
                                    </span>
                                </div>
                            </div>
                            <p className="font-semibold text-slate-700">Overall Progress</p>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
                            <p className="text-3xl font-bold text-[#2563EB] mb-1">
                                {progressData.totalActivities}
                            </p>
                            <p className="text-sm font-semibold text-slate-600">Total Activities</p>
                        </div>

                        <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
                            <p className="text-3xl font-bold text-green-600 mb-1">
                                {progressData.completedActivities}
                            </p>
                            <p className="text-sm font-semibold text-slate-600">Completed</p>
                        </div>

                        <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-200">
                            <p className="text-3xl font-bold text-purple-600 mb-1">
                                {progressData.totalCompletions}
                            </p>
                            <p className="text-sm font-semibold text-slate-600">Total Sessions</p>
                        </div>
                    </div>
                </div>

                {/* Domain Progress */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <BarChart3 className="text-[#2563EB]" size={24} />
                        Progress by Domain
                    </h2>

                    <div className="space-y-4">
                        {Object.entries(progressData.domainProgress).map(([domain, progress]) => {
                            const Icon = getDomainIcon(domain);
                            const progressColor = getProgressColor(progress);
                            const bgColor = getProgressBgColor(progress);

                            return (
                                <div key={domain} className={`border-2 rounded-xl p-4 ${bgColor}`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-lg bg-white flex items-center justify-center">
                                                <Icon className={progressColor} size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 capitalize">
                                                    {domain}
                                                </h3>
                                            </div>
                                        </div>
                                        <span className={`text-2xl font-bold ${progressColor}`}>
                                            {progress}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-white/50 rounded-full h-3">
                                        <div
                                            className={`h-3 rounded-full transition-all duration-500 ${progress >= 80 ? 'bg-green-600' :
                                                    progress >= 50 ? 'bg-blue-600' :
                                                        progress >= 30 ? 'bg-yellow-600' :
                                                            'bg-red-600'
                                                }`}
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Category Progress */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <PieChart className="text-[#2563EB]" size={24} />
                        Progress by Category
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {Object.entries(progressData.categoryProgress).map(([category, progress]) => {
                            const Icon = getCategoryIcon(category);
                            const progressColor = getProgressColor(progress);

                            return (
                                <div
                                    key={category}
                                    className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center"
                                >
                                    <div className="size-12 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center mx-auto mb-3">
                                        <Icon className={progressColor} size={24} />
                                    </div>
                                    <p className="font-bold text-slate-900 capitalize mb-1">{category}</p>
                                    <p className={`text-2xl font-bold ${progressColor}`}>{progress}%</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Completion Timeline */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Calendar className="text-[#2563EB]" size={24} />
                        Completion Timeline
                    </h2>

                    {progressData.completionsByDate.length > 0 ? (
                        <div className="space-y-2">
                            {progressData.completionsByDate.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                                >
                                    <Calendar className="text-[#2563EB] shrink-0" size={20} />
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-900">{formatDate(item.date)}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="text-green-600" size={18} />
                                        <span className="font-bold text-slate-900">{item.count}</span>
                                        <span className="text-sm text-slate-600">
                                            completion{item.count !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-500">
                            <Calendar className="mx-auto mb-2" size={40} />
                            <p>No completions in selected time period</p>
                        </div>
                    )}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Activity className="text-[#2563EB]" size={24} />
                        Recent Activity
                    </h2>

                    {progressData.recentCompletions.length > 0 ? (
                        <div className="space-y-3">
                            {progressData.recentCompletions.slice(0, 10).map((completion) => (
                                <div
                                    key={completion.id}
                                    className="flex items-start gap-4 p-4 bg-green-50 border border-green-200 rounded-lg"
                                >
                                    <CheckCircle2 className="text-green-600 shrink-0 mt-1" size={20} />
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-900">
                                            Activity Completed
                                        </p>
                                        <p className="text-sm text-slate-600">
                                            {formatDate(completion.completedAt)}
                                            {completion.duration && ` • ${completion.duration} minutes`}
                                        </p>
                                        {completion.notes && (
                                            <p className="text-sm text-slate-700 mt-1">{completion.notes}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-500">
                            <Activity className="mx-auto mb-2" size={40} />
                            <p>No recent activity</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
