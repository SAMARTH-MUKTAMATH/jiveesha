import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Save, X, CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';

import screeningService from '../services/screening.service';
import type { Screening } from '../services/screening.service';

export default function ScreeningInProgress() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [screening, setScreening] = useState<Screening | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (id) {
            loadScreening(id);
        }
    }, [id]);

    const loadScreening = async (screeningId: string) => {
        try {
            const response = await screeningService.getScreening(screeningId);
            if (response.success) {
                setScreening(response.data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Failed to load screening:', error);
            setLoading(false);
        }
    };

    const handleSaveProgress = async () => {
        if (!id || !screening) return;

        try {
            setSaving(true);
            await screeningService.saveProgress(id, screening.responses, screening.progress);
            alert('Progress saved! You can continue later.');
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to save progress:', error);
            alert('Failed to save progress. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleComplete = async () => {
        if (!id || !screening) return;

        try {
            await screeningService.completeScreening(id, screening.responses);
            navigate(`/screening/${id}/results`);
        } catch (error) {
            console.error('Failed to complete screening:', error);
            alert('Failed to complete screening. Please try again.');
        }
    };

    if (loading) {
        return (
            <>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
                        <p className="mt-4 text-slate-600">Loading screening...</p>
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
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Screening Not Found</h2>
                        <p className="text-slate-600 mb-6">This screening doesn't exist or has been deleted.</p>
                        <button
                            onClick={() => navigate('/screening/select')}
                            className="px-6 py-3 bg-[#2563EB] text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
                        >
                            Start New Screening
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="w-full max-w-[900px] mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
                {/* Header with Progress */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 mb-1">Screening in Progress</h1>
                            <p className="text-slate-600">Complete the questions below</p>
                        </div>
                        <button
                            onClick={handleSaveProgress}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all disabled:opacity-50"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    <span>Save & Continue Later</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold text-slate-700">Progress</p>
                            <p className="text-sm font-bold text-[#2563EB]">{screening.progress}% Complete</p>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                            <div
                                className="bg-[#2563EB] h-3 rounded-full transition-all duration-500"
                                style={{ width: `${screening.progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* 
          ====================================================================
          INTEGRATION POINT: YOUR PRE-CODED SCREENING FRAMEWORK GOES HERE
          ====================================================================
          
          This is where you'll insert your M-CHAT, ASQ, or other screening
          framework components.
          
          Example Integration:
          
          {screening.screeningTypeId === 'mchat' && (
            <MChatFramework
              screeningId={screening.id}
              responses={screening.responses}
              onProgressUpdate={(responses, progress) => {
                setScreening({ ...screening, responses, progress });
              }}
              onComplete={handleComplete}
            />
          )}
          
          {screening.screeningTypeId === 'asq' && (
            <ASQFramework
              screeningId={screening.id}
              responses={screening.responses}
              onProgressUpdate={(responses, progress) => {
                setScreening({ ...screening, responses, progress });
              }}
              onComplete={handleComplete}
            />
          )}
          
          ====================================================================
        */}

                {/* PLACEHOLDER CONTENT - Remove this when you add your frameworks */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-6">
                            <AlertCircle className="text-[#2563EB]" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-3">
                            Screening Framework Integration Point
                        </h2>
                        <p className="text-slate-600 mb-6 max-w-md mx-auto">
                            This is a placeholder. Your pre-coded M-CHAT, ASQ, or other screening
                            framework components will be integrated here.
                        </p>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-left max-w-2xl mx-auto">
                            <p className="text-sm font-semibold text-slate-700 mb-2">Integration Details:</p>
                            <ul className="text-sm text-slate-600 space-y-1">
                                <li>• Screening ID: <code className="bg-white px-2 py-1 rounded">{screening.id}</code></li>
                                <li>• Screening Type: <code className="bg-white px-2 py-1 rounded">{screening.screeningTypeId}</code></li>
                                <li>• Child ID: <code className="bg-white px-2 py-1 rounded">{screening.childId}</code></li>
                                <li>• Status: <code className="bg-white px-2 py-1 rounded">{screening.status}</code></li>
                                <li>• Progress: <code className="bg-white px-2 py-1 rounded">{screening.progress}%</code></li>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* END PLACEHOLDER */}

                {/* Action Buttons (for testing - remove when framework is integrated) */}
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all"
                    >
                        <X size={18} />
                        <span>Cancel</span>
                    </button>
                    <button
                        onClick={handleComplete}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
                    >
                        <CheckCircle2 size={18} />
                        <span>Complete Screening (Test)</span>
                    </button>
                </div>
            </div>
        </>
    );
}
