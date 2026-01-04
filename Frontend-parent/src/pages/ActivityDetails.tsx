import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, CheckCircle2, Calendar, Clock, StickyNote,
    Image as ImageIcon, Video, Upload, Trash2, Plus,
    TrendingUp, BarChart3, Sparkles, Edit, AlertCircle,
    Loader2, X, Camera, FileText
} from 'lucide-react';
import Layout from '../components/Layout';
import pepService from '../services/pep.service';
import type { PEPActivity, ActivityNote, ActivityMedia, ActivityCompletion } from '../services/pep.service';

export default function ActivityDetails() {
    const { pepId, activityId } = useParams<{ pepId: string; activityId: string }>();
    const navigate = useNavigate();
    const [activity, setActivity] = useState<PEPActivity | null>(null);
    const [notes, setNotes] = useState<ActivityNote[]>([]);
    const [media, setMedia] = useState<ActivityMedia[]>([]);
    const [completions, setCompletions] = useState<ActivityCompletion[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddNoteModal, setShowAddNoteModal] = useState(false);
    const [showRecordCompletionModal, setShowRecordCompletionModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [completionData, setCompletionData] = useState({ duration: '', notes: '' });
    const [processing, setProcessing] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [mediaCaption, setMediaCaption] = useState('');

    useEffect(() => {
        if (pepId && activityId) {
            loadActivityDetails();
        }
    }, [pepId, activityId]);

    const loadActivityDetails = async () => {
        if (!pepId || !activityId) return;

        try {
            const response = await pepService.getActivityDetails(pepId, activityId);
            if (response.success) {
                setActivity(response.data.activity);
                setNotes(response.data.notes || []);
                setMedia(response.data.media || []);
                setCompletions(response.data.completions || []);
            }
            setLoading(false);
        } catch (error) {
            console.error('Failed to load activity details:', error);
            setLoading(false);
        }
    };

    const handleAddNote = async () => {
        if (!pepId || !activityId || !newNote.trim()) {
            alert('Please enter a note');
            return;
        }

        try {
            setProcessing(true);
            await pepService.addActivityNote(pepId, activityId, newNote);
            await loadActivityDetails();
            setShowAddNoteModal(false);
            setNewNote('');
        } catch (error) {
            console.error('Failed to add note:', error);
            alert('Failed to add note. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const handleDeleteNote = async (noteId: string) => {
        if (!pepId || !activityId) return;
        if (!confirm('Are you sure you want to delete this note?')) return;

        try {
            await pepService.deleteActivityNote(pepId, activityId, noteId);
            await loadActivityDetails();
        } catch (error) {
            console.error('Failed to delete note:', error);
            alert('Failed to delete note. Please try again.');
        }
    };

    const handleUploadMedia = async () => {
        if (!pepId || !activityId || !selectedFile) {
            alert('Please select a file');
            return;
        }

        try {
            setProcessing(true);
            const formData = new FormData();
            formData.append('file', selectedFile);
            if (mediaCaption) {
                formData.append('caption', mediaCaption);
            }

            await pepService.uploadActivityMedia(pepId, activityId, formData);
            await loadActivityDetails();
            setShowUploadModal(false);
            setSelectedFile(null);
            setMediaCaption('');
        } catch (error) {
            console.error('Failed to upload media:', error);
            alert('Failed to upload media. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const handleDeleteMedia = async (mediaId: string) => {
        if (!pepId || !activityId) return;
        if (!confirm('Are you sure you want to delete this media?')) return;

        try {
            await pepService.deleteActivityMedia(pepId, activityId, mediaId);
            await loadActivityDetails();
        } catch (error) {
            console.error('Failed to delete media:', error);
            alert('Failed to delete media. Please try again.');
        }
    };

    const handleRecordCompletion = async () => {
        if (!pepId || !activityId) return;

        try {
            setProcessing(true);
            const data = {
                duration: completionData.duration ? parseInt(completionData.duration) : undefined,
                notes: completionData.notes || undefined,
            };

            await pepService.recordCompletion(pepId, activityId, data);
            await loadActivityDetails();
            setShowRecordCompletionModal(false);
            setCompletionData({ duration: '', notes: '' });
        } catch (error) {
            console.error('Failed to record completion:', error);
            alert('Failed to record completion. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    /* 
      ========================================================================
      GENAI INTEGRATION POINT: Difficulty Adjustment
      ========================================================================
      
      When GenAI service is ready, implement:
      
      const handleAdjustDifficulty = async () => {
        try {
          setProcessing(true);
          
          const suggestions = await genAIService.adjustDifficulty({
            activityId,
            completions: completions.length,
            recentCompletions: completions.slice(-5),
            parentNotes: notes,
            childAge: activity.childAge,
          });
          
          // Show modal with suggestions:
          // - Easier variation
          // - Current level
          // - Harder variation
          // - Alternative approach
          
          setDifficultySuggestions(suggestions);
          setShowDifficultyModal(true);
          
        } catch (error) {
          console.error('Failed to get difficulty suggestions:', error);
        } finally {
          setProcessing(false);
        }
      };
      
      AI will analyze:
      - Completion frequency (struggling vs. mastering)
      - Parent notes (positive vs. concerning observations)
      - Time between completions
      - Child's developmental progress
      
      Returns variations with different difficulty levels
      
      ========================================================================
    */

    const handleAdjustDifficulty = () => {
        alert('GenAI Integration Point: This will analyze progress and suggest easier/harder variations. Implementation pending.');
    };

    const handleGetVariations = () => {
        alert('GenAI Integration Point: This will suggest alternative approaches to the same skill. Implementation pending.');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
                        <p className="mt-4 text-slate-600">Loading activity...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!activity) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Activity Not Found</h2>
                        <p className="text-slate-600 mb-6">This activity doesn't exist or has been deleted.</p>
                        <button
                            onClick={() => navigate(`/pep/${pepId}/activities`)}
                            className="px-6 py-3 bg-[#2563EB] text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
                        >
                            Back to Activities
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
                    onClick={() => navigate(`/pep/${pepId}/activities`)}
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
                                {activity.title}
                            </h1>
                            <p className="text-slate-600 text-base mb-4">
                                {activity.description}
                            </p>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                                    {activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}
                                </span>
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
                                    {activity.domain.charAt(0).toUpperCase() + activity.domain.slice(1)}
                                </span>
                                {activity.completed && (
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold flex items-center gap-1">
                                        <CheckCircle2 size={14} />
                                        Completed
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate(`/pep/${pepId}/activities`)}
                                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-[#2563EB] rounded-lg font-semibold text-sm transition-all flex items-center gap-2"
                            >
                                <Edit size={16} />
                                <span>Edit</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-[#2563EB]">{completions.length}</p>
                            <p className="text-sm text-slate-600">Times Completed</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">{notes.length}</p>
                            <p className="text-sm text-slate-600">Notes</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{media.length}</p>
                            <p className="text-sm text-slate-600">Photos/Videos</p>
                        </div>
                    </div>
                </div>

                {/* GenAI Integration Buttons */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <Sparkles className="text-purple-600" size={24} />
                            <h3 className="font-bold text-slate-900">Adjust Difficulty</h3>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">
                            Get AI-powered suggestions for easier or harder variations based on progress.
                        </p>
                        <button
                            onClick={handleAdjustDifficulty}
                            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm transition-all"
                        >
                            Suggest Difficulty Adjustments
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <TrendingUp className="text-[#2563EB]" size={24} />
                            <h3 className="font-bold text-slate-900">Get Variations</h3>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">
                            Discover alternative approaches to practice the same skill.
                        </p>
                        <button
                            onClick={handleGetVariations}
                            className="w-full px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-all"
                        >
                            Show Activity Variations
                        </button>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-4">
                    <button
                        onClick={() => setShowRecordCompletionModal(true)}
                        className="bg-white border-2 border-green-200 hover:border-green-300 rounded-xl p-4 text-left transition-all group"
                    >
                        <CheckCircle2 className="text-green-600 mb-2" size={28} />
                        <h3 className="font-bold text-slate-900 mb-1">Record Completion</h3>
                        <p className="text-sm text-slate-600">Mark this activity as completed</p>
                    </button>

                    <button
                        onClick={() => setShowAddNoteModal(true)}
                        className="bg-white border-2 border-blue-200 hover:border-blue-300 rounded-xl p-4 text-left transition-all group"
                    >
                        <StickyNote className="text-[#2563EB] mb-2" size={28} />
                        <h3 className="font-bold text-slate-900 mb-1">Add Note</h3>
                        <p className="text-sm text-slate-600">Record observations or progress</p>
                    </button>

                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="bg-white border-2 border-purple-200 hover:border-purple-300 rounded-xl p-4 text-left transition-all group"
                    >
                        <Upload className="text-purple-600 mb-2" size={28} />
                        <h3 className="font-bold text-slate-900 mb-1">Upload Media</h3>
                        <p className="text-sm text-slate-600">Add photos or videos</p>
                    </button>
                </div>

                {/* Completion History */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Calendar className="text-[#2563EB]" size={24} />
                            Completion History
                        </h2>
                    </div>

                    {completions.length > 0 ? (
                        <div className="space-y-3">
                            {completions.map((completion) => (
                                <div
                                    key={completion.id}
                                    className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg"
                                >
                                    <CheckCircle2 className="text-green-600 shrink-0" size={24} />
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-900">
                                            {formatDate(completion.completedAt)}
                                        </p>
                                        {completion.duration && (
                                            <p className="text-sm text-slate-600 flex items-center gap-1">
                                                <Clock size={14} />
                                                {completion.duration} minutes
                                            </p>
                                        )}
                                        {completion.notes && (
                                            <p className="text-sm text-slate-700 mt-1">{completion.notes}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-500">
                            <Calendar className="mx-auto mb-2" size={40} />
                            <p>No completions recorded yet</p>
                        </div>
                    )}
                </div>

                {/* Notes */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <StickyNote className="text-[#2563EB]" size={24} />
                            Notes & Observations
                        </h2>
                    </div>

                    {notes.length > 0 ? (
                        <div className="space-y-3">
                            {notes.map((note) => (
                                <div
                                    key={note.id}
                                    className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                                >
                                    <FileText className="text-[#2563EB] shrink-0 mt-1" size={20} />
                                    <div className="flex-1">
                                        <p className="text-slate-900">{note.note}</p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {formatDate(note.createdAt)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteNote(note.id)}
                                        className="text-red-600 hover:text-red-700 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-500">
                            <StickyNote className="mx-auto mb-2" size={40} />
                            <p>No notes yet</p>
                        </div>
                    )}
                </div>

                {/* Media Gallery */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Camera className="text-[#2563EB]" size={24} />
                            Photos & Videos
                        </h2>
                    </div>

                    {media.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {media.map((item) => (
                                <div
                                    key={item.id}
                                    className="relative group bg-slate-100 rounded-lg overflow-hidden aspect-square"
                                >
                                    {item.type === 'photo' ? (
                                        <img
                                            src={item.url}
                                            alt={item.caption || 'Activity media'}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-200">
                                            <Video className="text-slate-400" size={40} />
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            onClick={() => handleDeleteMedia(item.id)}
                                            className="size-10 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>

                                    {item.caption && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2">
                                            <p className="text-xs truncate">{item.caption}</p>
                                        </div>
                                    )}

                                    <div className="absolute top-2 right-2">
                                        <span className="px-2 py-1 bg-white/90 text-xs font-bold rounded">
                                            {item.type === 'photo' ? '📷' : '🎥'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-500">
                            <Camera className="mx-auto mb-2" size={40} />
                            <p>No photos or videos yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Record Completion Modal */}
            {showRecordCompletionModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="size-12 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle2 className="text-green-600" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Record Completion</h3>
                                <p className="text-sm text-slate-600">Mark activity as completed</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                    Duration (minutes) - Optional
                                </label>
                                <input
                                    type="number"
                                    value={completionData.duration}
                                    onChange={(e) => setCompletionData({ ...completionData, duration: e.target.value })}
                                    className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                                    placeholder="e.g., 15"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                    Notes - Optional
                                </label>
                                <textarea
                                    value={completionData.notes}
                                    onChange={(e) => setCompletionData({ ...completionData, notes: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all resize-none"
                                    placeholder="Any observations or notes..."
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowRecordCompletionModal(false);
                                    setCompletionData({ duration: '', notes: '' });
                                }}
                                disabled={processing}
                                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRecordCompletion}
                                disabled={processing}
                                className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        <span>Recording...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={18} />
                                        <span>Record</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Note Modal */}
            {showAddNoteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <StickyNote className="text-[#2563EB]" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Add Note</h3>
                                <p className="text-sm text-slate-600">Record observation or progress</p>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                Note
                            </label>
                            <textarea
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all resize-none"
                                placeholder="Enter your observation..."
                                autoFocus
                            />
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowAddNoteModal(false);
                                    setNewNote('');
                                }}
                                disabled={processing}
                                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddNote}
                                disabled={processing || !newNote.trim()}
                                className="flex-1 px-4 py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        <span>Adding...</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus size={18} />
                                        <span>Add Note</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Media Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="size-12 rounded-full bg-purple-100 flex items-center justify-center">
                                <Upload className="text-purple-600" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Upload Media</h3>
                                <p className="text-sm text-slate-600">Add photos or videos</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                    Select File
                                </label>
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                    className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                                />
                                {selectedFile && (
                                    <p className="text-sm text-slate-600 mt-2">
                                        Selected: {selectedFile.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                    Caption - Optional
                                </label>
                                <input
                                    type="text"
                                    value={mediaCaption}
                                    onChange={(e) => setMediaCaption(e.target.value)}
                                    className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                                    placeholder="Add a caption..."
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowUploadModal(false);
                                    setSelectedFile(null);
                                    setMediaCaption('');
                                }}
                                disabled={processing}
                                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUploadMedia}
                                disabled={processing || !selectedFile}
                                className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        <span>Uploading...</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={18} />
                                        <span>Upload</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
