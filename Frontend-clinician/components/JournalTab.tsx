import React, { useState, useEffect } from 'react';
import {
    Plus, Calendar, User, FileText, Filter, Loader2,
    MessageCircle, Star, AlertCircle, TrendingUp
} from 'lucide-react';
import { apiClient } from '../services/api';
import AddJournalModal from './AddJournalModal';

interface JournalTabProps {
    patientId: string;
}

interface JournalEntry {
    id: string;
    entryType: string;
    title: string;
    content: string;
    tags: string[];
    visibility: string;
    createdBy: string;
    createdByType: 'clinician' | 'parent';
    createdByName: string;
    createdAt: string;
}

const JournalTab: React.FC<JournalTabProps> = ({ patientId }) => {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'clinician' | 'parent'>('all');
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        fetchEntries();
    }, [patientId, filter]);

    const fetchEntries = async () => {
        try {
            setLoading(true);
            const res = await apiClient.request(`/journal/patient/${patientId}`, {
                method: 'GET'
            });

            console.log('[Journal] API Response:', res);

            if (res.success) {
                // Handle both res.data being array directly or res.data.entries
                let allEntries = Array.isArray(res.data) ? res.data : (res.data?.entries || []);

                console.log('[Journal] All entries:', allEntries);

                let filtered = allEntries;
                if (filter === 'clinician') {
                    filtered = allEntries.filter((e: JournalEntry) => e.createdByType === 'clinician');
                } else if (filter === 'parent') {
                    filtered = allEntries.filter((e: JournalEntry) => e.createdByType === 'parent');
                }
                setEntries(filtered);
            } else {
                setEntries([]);
            }
        } catch (err) {
            console.error('Failed to fetch journal entries:', err);
            setEntries([]);
        } finally {
            setLoading(false);
        }
    };

    const getEntryTypeIcon = (type: string) => {
        switch (type) {
            case 'milestone': return <Star size={16} className="text-yellow-600" />;
            case 'concern': return <AlertCircle size={16} className="text-red-600" />;
            case 'success': return <TrendingUp size={16} className="text-green-600" />;
            default: return <FileText size={16} className="text-blue-600" />;
        }
    };

    const getEntryTypeColor = (type: string) => {
        switch (type) {
            case 'milestone': return 'bg-yellow-100 text-yellow-700';
            case 'concern': return 'bg-red-100 text-red-700';
            case 'success': return 'bg-green-100 text-green-700';
            case 'observation': return 'bg-blue-100 text-blue-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header with Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        All Entries
                    </button>
                    <button
                        onClick={() => setFilter('clinician')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${filter === 'clinician' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        My Entries
                    </button>
                    <button
                        onClick={() => setFilter('parent')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${filter === 'parent' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        Parent Entries
                    </button>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                    <Plus size={20} /> Add Entry
                </button>
            </div>

            {/* Journal Timeline */}
            <div className="space-y-4">
                {entries.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
                        <MessageCircle size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No journal entries yet</h3>
                        <p className="text-sm text-slate-500 mb-6">Start documenting this patient's journey</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all"
                        >
                            Create First Entry
                        </button>
                    </div>
                ) : (
                    entries.map((entry) => (
                        <div
                            key={entry.id}
                            className={`bg-white rounded-3xl border-2 p-6 shadow-sm hover:shadow-md transition-all ${entry.createdByType === 'parent' ? 'border-green-200 bg-green-50/30' : 'border-slate-200'
                                }`}
                        >
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    {getEntryTypeIcon(entry.entryType)}
                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${getEntryTypeColor(entry.entryType)}`}>
                                        {entry.entryType}
                                    </span>
                                    {entry.createdByType === 'parent' && (
                                        <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-green-100 text-green-700 flex items-center gap-1">
                                            <User size={12} /> Parent
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                                    <Calendar size={14} />
                                    {new Date(entry.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            <h3 className="text-lg font-black text-slate-900 mb-2">{entry.title}</h3>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">{entry.content}</p>

                            {entry.tags && (Array.isArray(entry.tags) ? entry.tags : JSON.parse(entry.tags || '[]')).length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {(Array.isArray(entry.tags) ? entry.tags : JSON.parse(entry.tags || '[]')).map((tag: string, i: number) => (
                                        <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                <span className="text-xs font-bold text-slate-500">
                                    By {entry.createdByName || 'Unknown'}
                                </span>
                                {entry.visibility === 'shared_with_parent' && (
                                    <span className="text-xs font-bold text-blue-600">Shared with parent</span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>


            {/* Add Entry Modal */}
            {showAddModal && (
                <AddJournalModal
                    patientId={patientId}
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => fetchEntries()}
                />
            )}
        </div>
    );
};

export default JournalTab;
