import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { apiClient } from '../services/api';

interface AddJournalModalProps {
    patientId: string;
    onClose: () => void;
    onSuccess: () => void;
}

const AddJournalModal: React.FC<AddJournalModalProps> = ({ patientId, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        entryType: 'observation',
        title: '',
        content: '',
        tags: '',
        shareWithParent: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const entryTypes = [
        { value: 'milestone', label: 'Milestone', color: 'bg-yellow-100 text-yellow-700' },
        { value: 'observation', label: 'Observation', color: 'bg-blue-100 text-blue-700' },
        { value: 'concern', label: 'Concern', color: 'bg-red-100 text-red-700' },
        { value: 'success', label: 'Success', color: 'bg-green-100 text-green-700' },
        { value: 'general', label: 'General Note', color: 'bg-slate-100 text-slate-700' }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.title.trim() || !formData.content.trim()) {
            setError('Title and content are required');
            return;
        }

        try {
            setLoading(true);
            const tagsArray = formData.tags
                .split(',')
                .map(t => t.trim())
                .filter(t => t.length > 0);

            await apiClient.request('/journal', {
                method: 'POST',
                body: JSON.stringify({
                    personId: patientId,
                    entryType: formData.entryType,
                    title: formData.title,
                    content: formData.content,
                    tags: tagsArray,
                    visibility: formData.shareWithParent ? 'shared_with_parent' : 'clinician_only'
                })
            });

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to create journal entry');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 rounded-t-3xl">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-slate-900">Add Journal Entry</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                            disabled={loading}
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Entry Type */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3">Entry Type</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {entryTypes.map(type => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, entryType: type.value })}
                                    className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${formData.entryType === type.value
                                        ? type.color + ' ring-2 ring-offset-2 ring-blue-500'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="Brief title for this entry"
                            required
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Content</label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                            rows={6}
                            placeholder="Describe the observation, milestone, or note..."
                            required
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Tags (optional)</label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="Separate tags with commas (e.g., behavior, speech, progress)"
                        />
                    </div>

                    {/* Share with Parent */}
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <input
                            type="checkbox"
                            id="shareWithParent"
                            checked={formData.shareWithParent}
                            onChange={(e) => setFormData({ ...formData, shareWithParent: e.target.checked })}
                            className="w-5 h-5 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="shareWithParent" className="text-sm font-bold text-blue-900 cursor-pointer">
                            Share this entry with parent
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} />
                                    Creating...
                                </>
                            ) : (
                                'Create Entry'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddJournalModal;
