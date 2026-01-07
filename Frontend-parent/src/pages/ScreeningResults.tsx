import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Download, Share2, Calendar, User, Activity,
    CheckCircle2, AlertCircle, TrendingUp, FileText
} from 'lucide-react';

import screeningService from '../services/screening.service';
import childrenService from '../services/children.service';
import type { Screening } from '../services/screening.service';

export default function ScreeningResults() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [screening, setScreening] = useState<Screening | null>(null);
    const [childName, setChildName] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadResults(id);
        }
    }, [id]);

    const loadResults = async (screeningId: string) => {
        try {
            const response = await screeningService.getScreening(screeningId);
            if (response.success) {
                setScreening(response.data);

                // Load child name
                try {
                    const childRes = await childrenService.getChild(response.data.childId);
                    if (childRes.success) {
                        setChildName(`${childRes.data.firstName} ${childRes.data.lastName}`);
                    }
                } catch (error) {
                    setChildName('Unknown Child');
                }
            }
            setLoading(false);
        } catch (error) {
            console.error('Failed to load results:', error);
            setLoading(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
                        <p className="mt-4 text-slate-600">Loading results...</p>
                    </div>
                </div>
            </>
        );
    }

    if (!screening) {
        return (
            <>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Results Not Found</h2>
                        <p className="text-slate-600 mb-6">This screening doesn't exist or hasn't been completed yet.</p>
                        <button
                            onClick={() => navigate('/screening/history')}
                            className="px-6 py-3 bg-[#2563EB] text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
                        >
                            Back to History
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="w-full max-w-[1000px] mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/screening/history')}
                    className="flex items-center gap-2 text-slate-600 hover:text-[#2563EB] font-semibold transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back to History</span>
                </button>

                {/* Header Card */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-8">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-2">
                                        <CheckCircle2 size={16} />
                                        <span className="text-xs font-bold">Completed</span>
                                    </div>
                                </div>
                                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                    {screening.screeningTypeId.toUpperCase()} Screening Results
                                </h1>
                                <div className="flex flex-wrap gap-4 text-sm">
                                    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                        <User size={16} className="text-[#2563EB]" />
                                        <span className="font-semibold text-slate-700">{childName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                        <Calendar size={16} className="text-[#2563EB]" />
                                        <span className="font-semibold text-slate-700">
                                            {formatDate(screening.completedAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => alert('Download functionality to be implemented')}
                                    className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-300 rounded-lg font-semibold transition-all"
                                >
                                    <Download size={18} />
                                    <span>Download PDF</span>
                                </button>
                                <button
                                    onClick={() => navigate(`/children/${screening.childId}/share`)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-300 rounded-lg font-semibold transition-all"
                                >
                                    <Share2 size={18} />
                                    <span>Share</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 
            ====================================================================
            INTEGRATION POINT: YOUR RESULTS DISPLAY FRAMEWORK GOES HERE
            ====================================================================
            
            This is where you'll insert your screening results display components.
            
            Example Integration:
            
            {screening.screeningTypeId === 'mchat' && (
              <MChatResults
                screening={screening}
                childName={childName}
              />
            )}
            
            {screening.screeningTypeId === 'asq' && (
              <ASQResults
                screening={screening}
                childName={childName}
              />
            )}
            
            Your results components should display:
            - Overall score/interpretation
            - Domain-specific scores
            - Recommendations
            - Next steps
            - Visualizations (charts, graphs)
            
            ====================================================================
          */}

                    {/* PLACEHOLDER CONTENT - Remove this when you add your results frameworks */}
                    <div className="p-8">
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-6">
                                <TrendingUp className="text-[#2563EB]" size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3">
                                Results Display Integration Point
                            </h2>
                            <p className="text-slate-600 mb-6 max-w-md mx-auto">
                                This is a placeholder. Your pre-coded results display components
                                (M-CHAT, ASQ, etc.) will be integrated here.
                            </p>

                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-left max-w-2xl mx-auto space-y-4">
                                <p className="text-sm font-semibold text-slate-700">Screening Data Available:</p>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-white rounded-lg p-4">
                                        <p className="text-xs font-semibold text-slate-600 mb-1">Screening ID</p>
                                        <code className="text-sm text-slate-900 font-mono">{screening.id}</code>
                                    </div>
                                    <div className="bg-white rounded-lg p-4">
                                        <p className="text-xs font-semibold text-slate-600 mb-1">Type</p>
                                        <code className="text-sm text-slate-900 font-mono">{screening.screeningTypeId}</code>
                                    </div>
                                    <div className="bg-white rounded-lg p-4">
                                        <p className="text-xs font-semibold text-slate-600 mb-1">Status</p>
                                        <code className="text-sm text-slate-900 font-mono">{screening.status}</code>
                                    </div>
                                    <div className="bg-white rounded-lg p-4">
                                        <p className="text-xs font-semibold text-slate-600 mb-1">Completed</p>
                                        <code className="text-sm text-slate-900 font-mono">{formatDate(screening.completedAt)}</code>
                                    </div>
                                </div>

                                {screening.results && (
                                    <div className="bg-white rounded-lg p-4">
                                        <p className="text-xs font-semibold text-slate-600 mb-2">Results Data</p>
                                        <pre className="text-xs text-slate-900 font-mono overflow-auto max-h-40">
                                            {JSON.stringify(screening.results, null, 2)}
                                        </pre>
                                    </div>
                                )}

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <FileText className="text-[#2563EB] shrink-0 mt-0.5" size={20} />
                                        <div className="text-sm text-slate-700">
                                            <p className="font-semibold mb-1">Integration Instructions:</p>
                                            <p>Replace this placeholder with your screening-specific results component that displays scores, interpretations, recommendations, and visualizations.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* END PLACEHOLDER */}
                </div>
            </div>
        </>
    );
}
