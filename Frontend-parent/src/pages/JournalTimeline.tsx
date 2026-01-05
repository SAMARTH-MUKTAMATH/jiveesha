import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Plus, Search, Filter, BookOpen, Calendar,
    Image as ImageIcon, Video, FileText, Tag, Smile, Meh,
    Frown, PartyPopper, Share2, Edit, Trash2, Eye, Sparkles,
    CheckCircle2, Clock, Activity, TrendingUp, X, Upload,
    Star, AlertCircle, User
} from 'lucide-react';
import Layout from '../components/Layout';
import journalService from '../services/journal.service';
import childrenService from '../services/children.service';
import type { JournalEntry, JournalFilters } from '../services/journal.service';
import type { Child } from '../services/children.service';

type EntryTypeFilter = 'all' | 'general' | 'pep';

export default function JournalTimeline() {
    const navigate = useNavigate();
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
    const [children, setChildren] = useState<Child[]>([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState<EntryTypeFilter>('all');
    const [childFilter, setChildFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Create Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newEntryCaption, setNewEntryCaption] = useState('');
    const [creating, setCreating] = useState(false);

    // Initial Load
    useEffect(() => {
        initialize();
    }, []);

    // Fetch entries when child filter changes (because API is per-child)
    useEffect(() => {
        if (childFilter !== 'all') {
            loadJournal(childFilter);
        }
    }, [childFilter]);

    // Local filter when other filters change or data updates
    useEffect(() => {
        filterEntries();
    }, [entries, typeFilter, searchQuery]);

    const initialize = async () => {
        try {
            const childrenRes = await childrenService.getChildren();
            if (childrenRes.success) {
                setChildren(childrenRes.data);
                // Default to first child if available
                if (childrenRes.data.length > 0) {
                    setChildFilter(childrenRes.data[0].id);
                    // Triggered by useEffect above
                } else {
                    setLoading(false);
                }
            }
        } catch (error) {
            console.error('Failed to load children:', error);
            setLoading(false);
        }
    };

    const loadJournal = async (childId: string) => {
        setLoading(true);
        try {
            const response = await journalService.getEntries({ childId });
            if (response.success) {
                setEntries(response.data);
            }
        } catch (error) {
            console.error('Failed to load journal:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterEntries = () => {
        let filtered = entries;

        // Filter by type
        if (typeFilter !== 'all') {
            filtered = filtered.filter(e => e.entryType === typeFilter);
        }

        // Filter by search
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(e =>
                e.caption.toLowerCase().includes(query) ||
                (e.title && e.title.toLowerCase().includes(query)) ||
                e.activityTitle?.toLowerCase().includes(query)
            );
        }

        setFilteredEntries(filtered);
    };

    const handleCreateEntry = async () => {
        if (!newEntryCaption.trim() || childFilter === 'all') return;

        try {
            setCreating(true);
            await journalService.createGeneralEntry({
                childId: childFilter,
                caption: newEntryCaption,
                mood: 'neutral',
                tags: [], // Could add tag selector
                visibility: 'shared'
            });

            // Reload
            await loadJournal(childFilter);

            setShowCreateModal(false);
            setNewEntryCaption('');
        } catch (error) {
            console.error('Failed to create entry:', error);
            alert('Failed to create entry');
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteEntry = async (id: string) => {
        if (!confirm('Delete this journal entry?')) return;

        try {
            await journalService.deleteEntry(id);
            if (childFilter !== 'all') loadJournal(childFilter);
        } catch (error) {
            console.error('Failed to delete entry:', error);
            alert('Failed to delete entry. Please try again.');
        }
    };


    const formatDateShort = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
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
            case 'pep': return 'bg-blue-100 text-blue-700';
            case 'general': return 'bg-purple-100 text-purple-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    if (loading && children.length === 0) { // Only full page load on initial
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
                        <p className="mt-4 text-slate-600">Loading journal...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="w-full max-w-[900px] mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex flex-col gap-1">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-2 text-slate-600 hover:text-[#2563EB] font-semibold transition-colors mb-2"
                        >
                            <ArrowLeft size={20} />
                            <span>Dashboard</span>
                        </button>
                        <h1 className="text-slate-900 text-3xl md:text-4xl font-black leading-tight tracking-tight">
                            Journal
                        </h1>
                        <p className="text-slate-600 text-base">
                            Track milestones and daily moments
                        </p>
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-purple-200"
                    >
                        <Plus size={18} />
                        <span>New Entry</span>
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search entries..."
                                className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                            />
                        </div>

                        <div className="relative">
                            <Filter className="absolute left-3 top-3.5 text-slate-400" size={18} />
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value as EntryTypeFilter)}
                                className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all appearance-none"
                            >
                                <option value="all">All Entries</option>
                                <option value="general">General Only</option>
                                <option value="pep">PEP Activities Only</option>
                            </select>
                        </div>

                        <div className="relative">
                            <Filter className="absolute left-3 top-3.5 text-slate-400" size={18} />
                            <select
                                value={childFilter}
                                onChange={(e) => setChildFilter(e.target.value)}
                                className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all appearance-none"
                            >
                                <option value="all" disabled>Select Child</option>
                                {children.map((child) => (
                                    <option key={child.id} value={child.id}>
                                        {child.firstName} {child.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400 mx-auto"></div>
                    </div>
                ) : filteredEntries.length > 0 ? (
                    <div className="space-y-4">
                        {filteredEntries.map((entry) => {
                            return (
                                <div
                                    key={entry.id}
                                    className={`bg-white rounded-xl shadow-md border-2 overflow-hidden hover:shadow-lg transition-all ${entry.entryType === 'pep' ? 'border-blue-100' : 'border-purple-100'
                                        }`}
                                >
                                    {/* Entry Header */}
                                    <div className={`p-4 bg-slate-50/50`}>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                                    {getEntryTypeIcon(entry.entryType)}
                                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${getEntryTypeColor(entry.entryType)}`}>
                                                        {entry.entryType === 'pep' ? 'Activity' : entry.entryType}
                                                    </span>
                                                    {entry.createdByType === 'clinician' ? (
                                                        <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700 flex items-center gap-1">
                                                            <User size={12} /> Clinician
                                                        </span>
                                                    ) : (
                                                        <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-green-100 text-green-700 flex items-center gap-1">
                                                            <User size={12} /> Parent
                                                        </span>
                                                    )}
                                                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {formatDateShort(entry.timestamp)}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-slate-900 text-lg leading-tight">
                                                    {entry.title || entry.caption.substring(0, 40) + '...'}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Entry Content */}
                                    <div className="p-4">
                                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                                            {entry.caption}
                                        </p>

                                        {/* PEP Details */}
                                        {entry.entryType === 'pep' && entry.activityDuration && (
                                            <div className="mt-3 flex items-center gap-2">
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">
                                                    <Clock size={14} />
                                                    Duration: {entry.activityDuration} min
                                                </div>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        {entry.entryType === 'general' && (
                                            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleDeleteEntry(entry.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete Entry"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center">
                        <BookOpen className="mx-auto text-slate-300 mb-4" size={48} />
                        <h3 className="text-lg font-bold text-slate-900 mb-1">No Entries Yet</h3>
                        <p className="text-slate-500 mb-6 text-sm">Start recording your observations or complete activities</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold text-sm transition-all"
                        >
                            Create Entry
                        </button>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-slate-900">New Journal Entry</h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Observation / Note</label>
                                <textarea
                                    value={newEntryCaption}
                                    onChange={(e) => setNewEntryCaption(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none transition-all resize-none"
                                    placeholder="What did you observe today?"
                                />
                            </div>

                            <button
                                onClick={handleCreateEntry}
                                disabled={creating || !newEntryCaption.trim()}
                                className="w-full mt-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {creating ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <CheckCircle2 size={18} />}
                                <span>Save Entry</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
