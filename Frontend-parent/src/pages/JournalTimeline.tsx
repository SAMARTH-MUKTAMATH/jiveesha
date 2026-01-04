import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Plus, Search, Filter, BookOpen, Calendar,
    Image as ImageIcon, Video, FileText, Tag, Smile, Meh,
    Frown, PartyPopper, Share2, Edit, Trash2, Eye, Sparkles,
    CheckCircle2, Clock, Activity, TrendingUp
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
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        filterEntries();
    }, [entries, typeFilter, childFilter, searchQuery]);

    const loadData = async () => {
        try {
            const [journalRes, childrenRes] = await Promise.all([
                journalService.getEntries(),
                childrenService.getChildren(),
            ]);

            if (journalRes.success) setEntries(journalRes.data);
            if (childrenRes.success) setChildren(childrenRes.data);

            setLoading(false);
        } catch (error) {
            console.error('Failed to load journal:', error);
            setLoading(false);
        }
    };

    const filterEntries = () => {
        let filtered = entries;

        // Filter by type
        if (typeFilter !== 'all') {
            filtered = filtered.filter(e => e.entryType === typeFilter);
        }

        // Filter by child
        if (childFilter !== 'all') {
            filtered = filtered.filter(e => e.childId === childFilter);
        }

        // Filter by search
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(e =>
                e.caption.toLowerCase().includes(query) ||
                e.childName.toLowerCase().includes(query) ||
                e.activityTitle?.toLowerCase().includes(query)
            );
        }

        setFilteredEntries(filtered);
    };

    const handleDeleteEntry = async (id: string) => {
        if (!confirm('Delete this journal entry?')) return;

        try {
            await journalService.deleteEntry(id);
            await loadData();
        } catch (error) {
            console.error('Failed to delete entry:', error);
            alert('Failed to delete entry. Please try again.');
        }
    };

    const getMoodIcon = (mood?: string) => {
        const icons: Record<string, typeof Smile> = {
            happy: Smile,
            neutral: Meh,
            concerned: Frown,
            celebrating: PartyPopper,
        };
        return mood ? icons[mood] : null;
    };

    const getMoodColor = (mood?: string) => {
        const colors: Record<string, string> = {
            happy: 'text-green-600',
            neutral: 'text-slate-600',
            concerned: 'text-orange-600',
            celebrating: 'text-purple-600',
        };
        return mood ? colors[mood] : 'text-slate-600';
    };

    const formatDateShort = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
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
                        <p className="mt-4 text-slate-600">Loading journal...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="w-full max-w-[900px] mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
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
                            Family Timeline
                        </p>
                        <h1 className="text-slate-900 text-3xl md:text-4xl font-black leading-tight tracking-tight">
                            Journal
                        </h1>
                        <p className="text-slate-600 text-base">
                            Document milestones, activities, and daily observations
                        </p>
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all"
                    >
                        <Plus size={18} />
                        <span>New Entry</span>
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <div className="grid md:grid-cols-3 gap-4">
                        {/* Search */}
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

                        {/* Type Filter */}
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

                        {/* Child Filter */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-3.5 text-slate-400" size={18} />
                            <select
                                value={childFilter}
                                onChange={(e) => setChildFilter(e.target.value)}
                                className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all appearance-none"
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
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                        <p className="text-sm font-semibold text-slate-600 mb-1">Total</p>
                        <p className="text-2xl font-bold text-slate-900">{entries.length}</p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 shadow-sm">
                        <p className="text-sm font-semibold text-purple-700 mb-1">General</p>
                        <p className="text-2xl font-bold text-purple-600">
                            {entries.filter(e => e.entryType === 'general').length}
                        </p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm">
                        <p className="text-sm font-semibold text-blue-700 mb-1">PEP</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {entries.filter(e => e.entryType === 'pep').length}
                        </p>
                    </div>
                </div>

                {/* Timeline */}
                {filteredEntries.length > 0 ? (
                    <div className="space-y-4">
                        {filteredEntries.map((entry) => {
                            const MoodIcon = getMoodIcon(entry.mood);
                            const moodColor = getMoodColor(entry.mood);

                            return (
                                <div
                                    key={entry.id}
                                    className={`bg-white rounded-xl shadow-md border-2 overflow-hidden hover:shadow-lg transition-all ${entry.entryType === 'pep'
                                        ? 'border-blue-200'
                                        : 'border-purple-200'
                                        }`}
                                >
                                    {/* Header */}
                                    <div className={`p-4 ${entry.entryType === 'pep' ? 'bg-blue-50' : 'bg-purple-50'
                                        }`}>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${entry.entryType === 'pep'
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-purple-600 text-white'
                                                        }`}>
                                                        {entry.entryType.toUpperCase()}
                                                    </span>
                                                    {entry.entryType === 'pep' && entry.activityTitle && (
                                                        <span className="px-3 py-1 bg-white border border-blue-200 text-blue-700 rounded-full text-xs font-bold">
                                                            {entry.activityTitle}
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="font-bold text-slate-900 text-lg">
                                                    {entry.childName}
                                                </h3>
                                                <p className="text-sm text-slate-600">
                                                    {formatDateShort(entry.timestamp)}
                                                </p>
                                            </div>

                                            {/* Mood Icon */}
                                            {MoodIcon && (
                                                <div className={`size-10 rounded-full bg-white flex items-center justify-center ${moodColor}`}>
                                                    <MoodIcon size={24} />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Media */}
                                    {entry.mediaUrls && entry.mediaUrls.length > 0 && (
                                        <div className={`grid ${entry.mediaUrls.length === 1 ? 'grid-cols-1' :
                                            entry.mediaUrls.length === 2 ? 'grid-cols-2' :
                                                'grid-cols-3'
                                            } gap-2 p-4 bg-slate-50`}>
                                            {entry.mediaUrls.map((url, index) => (
                                                <div key={index} className="relative aspect-square bg-slate-200 rounded-lg overflow-hidden">
                                                    {entry.mediaType === 'photo' ? (
                                                        <img
                                                            src={url}
                                                            alt={`Media ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : entry.mediaType === 'video' ? (
                                                        <div className="w-full h-full flex items-center justify-center bg-slate-300">
                                                            <Video className="text-slate-500" size={40} />
                                                        </div>
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-slate-300">
                                                            <FileText className="text-slate-500" size={40} />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Caption */}
                                    <div className="p-4">
                                        <p className="text-slate-900 text-base leading-relaxed">
                                            {entry.caption}
                                        </p>
                                    </div>

                                    {/* PEP Activity Details */}
                                    {entry.entryType === 'pep' && (
                                        <div className="px-4 pb-4 flex flex-wrap gap-2">
                                            {entry.activityCompletion && (
                                                <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                                    <CheckCircle2 size={14} />
                                                    Completed
                                                </span>
                                            )}
                                            {entry.activityDuration && (
                                                <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                                                    <Clock size={14} />
                                                    {entry.activityDuration} min
                                                </span>
                                            )}
                                            {entry.activityCategory && (
                                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                                                    {entry.activityCategory}
                                                </span>
                                            )}
                                            {entry.activityDomain && (
                                                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                                                    {entry.activityDomain}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Tags */}
                                    {entry.tags && entry.tags.length > 0 && (
                                        <div className="px-4 pb-4 flex flex-wrap gap-2">
                                            {entry.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-semibold"
                                                >
                                                    <Tag size={12} />
                                                    {tag.replace(/-/g, ' ')}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="px-4 pb-4 pt-2 border-t border-slate-200 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-slate-600">
                                            {entry.visibility === 'shared' && (
                                                <span className="flex items-center gap-1">
                                                    <Share2 size={14} className="text-[#2563EB]" />
                                                    Shared with clinicians
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => alert('View entry details - coming soon!')}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-all"
                                            >
                                                <Eye size={14} />
                                                <span>View</span>
                                            </button>
                                            {entry.entryType === 'general' && (
                                                <>
                                                    <button
                                                        onClick={() => alert('Edit entry - coming soon!')}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#2563EB] rounded-lg text-sm font-semibold transition-all"
                                                    >
                                                        <Edit size={14} />
                                                        <span>Edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteEntry(entry.id)}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-semibold transition-all"
                                                    >
                                                        <Trash2 size={14} />
                                                        <span>Delete</span>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center">
                        <BookOpen className="mx-auto text-slate-300 mb-4" size={64} />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                            {entries.length === 0 ? 'No Journal Entries Yet' : 'No Matching Entries'}
                        </h3>
                        <p className="text-slate-600 mb-6">
                            {entries.length === 0
                                ? 'Start documenting your child\'s journey!'
                                : 'Try adjusting your filters or search query.'}
                        </p>
                        {entries.length === 0 && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all"
                            >
                                Create First Entry
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Create Entry Modal - Placeholder */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Create Journal Entry</h3>
                        <p className="text-slate-600 mb-6">
                            Create entry form with caption, media upload, tags, mood, child selection, and visibility options will be implemented here.
                        </p>
                        <div className="space-y-4">
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                <p className="text-sm text-purple-700 font-semibold">💡 Quick Tip</p>
                                <p className="text-sm text-purple-600 mt-1">
                                    PEP entries are created automatically when you record activity completions in PEP Builder!
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(false)}
                            className="w-full mt-6 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </Layout>
    );
}
