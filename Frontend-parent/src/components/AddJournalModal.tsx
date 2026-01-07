import React, { useState } from 'react';
import { X, Loader2, User } from 'lucide-react';
import journalService from '../services/journal.service';
import type { Child } from '../services/children.service';

interface AddJournalModalProps {
    children: Child[];
    initialChildId?: string;
    onClose: () => void;
    onSuccess: () => void;
}

const AddJournalModal: React.FC<AddJournalModalProps> = ({ children, initialChildId, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        childId: initialChildId || (children.length > 0 ? children[0].id : ''),
        entryType: 'observation',
        title: '',
        content: '',
        tags: '',
        shareWithClinician: true
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

        if (!formData.childId) {
            setError('Please select a target child');
            return;
        }

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

            await journalService.createGeneralEntry({
                childId: formData.childId,
                entryType: formData.entryType,
                title: formData.title,
                caption: formData.content,
                tags: tagsArray,
                visibility: formData.shareWithClinician ? 'shared_with_team' : 'private'
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200 backdrop-blur-[2px]">
            <div className="bg-white rounded-[1.5rem] shadow-2xl max-w-xl w-full animate-in zoom-in-95 duration-200 border border-slate-200">
                <div className="bg-white border-b border-slate-100 px-6 py-4 rounded-t-[1.5rem]">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Add Journal Entry</h2>
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                            disabled={loading}
                        >
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 font-bold flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        {/* Target Child */}
                        <div>
                            <label className="block text-sm font-black text-slate-700 mb-1.5 uppercase tracking-widest text-[9px]">Target Child</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 text-slate-400" size={14} />
                                <select
                                    value={formData.childId}
                                    onChange={(e) => setFormData({ ...formData, childId: e.target.value })}
                                    className="w-full h-10 pl-9 pr-4 rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-600 outline-none transition-all appearance-none font-bold text-slate-700 bg-slate-50/50 text-xs"
                                >
                                    {children.map((child) => (
                                        <option key={child.id} value={child.id}>
                                            {child.firstName} {child.lastName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-black text-slate-700 mb-1.5 uppercase tracking-widest text-[9px]">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full h-10 px-4 bg-slate-50/50 border-2 border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-600 font-bold text-slate-700 transition-all placeholder:text-slate-300 text-xs"
                                placeholder="Brief title for this entry"
                                required
                            />
                        </div>
                    </div>

                    {/* Entry Type */}
                    <div>
                        <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest text-[9px]">Entry Type</label>
                        <div className="flex flex-wrap gap-2">
                            {entryTypes.map(type => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, entryType: type.value })}
                                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all border-2 ${formData.entryType === type.value
                                        ? type.color + ' border-current'
                                        : 'bg-slate-50 border-slate-50 text-slate-500 hover:bg-slate-100'
                                        }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-black text-slate-700 mb-1.5 uppercase tracking-widest text-[9px]">Content</label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50/50 border-2 border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-600 font-bold text-slate-700 transition-all placeholder:text-slate-300 resize-none text-xs"
                            rows={3}
                            placeholder="Describe the observation, milestone, or note..."
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-end">
                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-black text-slate-700 mb-1.5 uppercase tracking-widest text-[9px]">Tags (optional)</label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                className="w-full h-10 px-4 bg-slate-50/50 border-2 border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-600 font-bold text-slate-700 transition-all placeholder:text-slate-300 text-xs"
                                placeholder="e.g. behavior, speech"
                            />
                        </div>

                        {/* Share with Clinician */}
                        <div className="flex items-center gap-3 p-2 bg-purple-50/50 rounded-xl border-2 border-purple-100 transition-all hover:bg-purple-50 hover:border-purple-200 cursor-pointer h-10" onClick={() => setFormData(prev => ({ ...prev, shareWithClinician: !prev.shareWithClinician }))}>
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${formData.shareWithClinician ? 'bg-purple-600 border-purple-600' : 'bg-white border-slate-200'}`}>
                                {formData.shareWithClinician && <X size={10} className="text-white rotate-45" />}
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-purple-900 leading-none">Share with Clinician</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-10 bg-slate-100 text-slate-600 rounded-xl font-black hover:bg-slate-200 transition-all uppercase tracking-widest text-[10px]"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 h-10 bg-purple-600 text-white rounded-xl font-black hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={12} />
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
