import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Plus, Search, Filter, TrendingUp, Target,
    Activity, Calendar, Archive, Trash2, CheckCircle2,
    Clock, AlertCircle, Eye, Edit, ArchiveRestore
} from 'lucide-react';
import Layout from '../components/Layout';
import pepService from '../services/pep.service';
import childrenService from '../services/children.service';
import type { PEP } from '../services/pep.service';
import type { Child } from '../services/children.service';

type StatusFilter = 'all' | 'active' | 'draft' | 'archived';

export default function PEPDashboard() {
    const navigate = useNavigate();
    const [peps, setPEPs] = useState<PEP[]>([]);
    const [filteredPEPs, setFilteredPEPs] = useState<PEP[]>([]);
    const [children, setChildren] = useState<Child[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPEP, setSelectedPEP] = useState<PEP | null>(null);
    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedChildId, setSelectedChildId] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        filterPEPs();
    }, [peps, statusFilter, searchQuery]);

    const loadData = async () => {
        try {
            const [pepsRes, childrenRes] = await Promise.all([
                pepService.getPEPs(),
                childrenService.getChildren(),
            ]);

            if (pepsRes.success) {
                setPEPs(pepsRes.data);
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

    const filterPEPs = () => {
        let filtered = peps;

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(p => p.status === statusFilter);
        }

        // Filter by search query
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.childName.toLowerCase().includes(query)
            );
        }

        setFilteredPEPs(filtered);
    };

    const handleCreatePEP = async () => {
        if (!selectedChildId) {
            alert('Please select a child');
            return;
        }

        try {
            setProcessing(true);
            const response = await pepService.createPEP({ childId: selectedChildId });

            if (response.success) {
                // Navigate to PEP details/goals page
                navigate(`/pep/${response.data.id}/goals`);
            }
        } catch (error) {
            console.error('Failed to create PEP:', error);
            alert('Failed to create PEP. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const handleArchivePEP = async () => {
        if (!selectedPEP) return;

        try {
            setProcessing(true);
            if (selectedPEP.status === 'archived') {
                await pepService.unarchivePEP(selectedPEP.id);
            } else {
                await pepService.archivePEP(selectedPEP.id);
            }
            await loadData();
            setShowArchiveModal(false);
            setSelectedPEP(null);
        } catch (error) {
            console.error('Failed to archive/unarchive PEP:', error);
            alert('Failed to update PEP. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const handleDeletePEP = async () => {
        if (!selectedPEP) return;

        try {
            setProcessing(true);
            await pepService.deletePEP(selectedPEP.id);
            await loadData();
            setShowDeleteModal(false);
            setSelectedPEP(null);
        } catch (error) {
            console.error('Failed to delete PEP:', error);
            alert('Failed to delete PEP. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const getStatusBadge = (status: PEP['status']) => {
        const badges = {
            active: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle2, label: 'Active' },
            draft: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock, label: 'Draft' },
            archived: { color: 'bg-slate-100 text-slate-600 border-slate-200', icon: Archive, label: 'Archived' },
        };

        const badge = badges[status];
        const Icon = badge.icon;

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
                <Icon size={14} />
                {badge.label}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getInitials = (name: string) => {
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
                        <p className="mt-4 text-slate-600">Loading PEPs...</p>
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
                            Education Planning
                        </p>
                        <h1 className="text-slate-900 text-3xl md:text-4xl font-black leading-tight tracking-tight">
                            My PEPs
                        </h1>
                        <p className="text-slate-600 text-base">
                            Personalized Education Plans for your children
                        </p>
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl"
                    >
                        <Plus size={20} />
                        <span>Create New PEP</span>
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by child name..."
                                className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-3.5 text-slate-400" size={18} />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                                className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all appearance-none"
                            >
                                <option value="all">All Statuses</option>
                                <option value="active">Active Only</option>
                                <option value="draft">Draft Only</option>
                                <option value="archived">Archived Only</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                        <p className="text-sm font-semibold text-slate-600 mb-1">Total</p>
                        <p className="text-2xl font-bold text-slate-900">{peps.length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                        <p className="text-sm font-semibold text-slate-600 mb-1">Active</p>
                        <p className="text-2xl font-bold text-green-600">
                            {peps.filter(p => p.status === 'active').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                        <p className="text-sm font-semibold text-slate-600 mb-1">Draft</p>
                        <p className="text-2xl font-bold text-yellow-600">
                            {peps.filter(p => p.status === 'draft').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                        <p className="text-sm font-semibold text-slate-600 mb-1">Archived</p>
                        <p className="text-2xl font-bold text-slate-600">
                            {peps.filter(p => p.status === 'archived').length}
                        </p>
                    </div>
                </div>

                {/* PEPs Grid */}
                {filteredPEPs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPEPs.map((pep) => (
                            <div
                                key={pep.id}
                                className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-all"
                            >
                                {/* Card Header */}
                                <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="size-12 rounded-full bg-white text-[#2563EB] flex items-center justify-center font-bold text-lg shadow-lg">
                                                {getInitials(pep.childName)}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900">
                                                    {pep.childName}
                                                </h3>
                                                <p className="text-sm text-slate-700">PEP Plan</p>
                                            </div>
                                        </div>
                                        {getStatusBadge(pep.status)}
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-6 space-y-4">
                                    {/* Progress Bar */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm font-semibold text-slate-700">Overall Progress</p>
                                            <p className="text-sm font-bold text-[#2563EB]">{pep.progress}%</p>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-2">
                                            <div
                                                className="bg-[#2563EB] h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${pep.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-blue-50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Target size={16} className="text-[#2563EB]" />
                                                <p className="text-xs font-semibold text-slate-600">Goals</p>
                                            </div>
                                            <p className="text-2xl font-bold text-slate-900">{pep.goalsCount}</p>
                                        </div>
                                        <div className="bg-purple-50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Activity size={16} className="text-purple-600" />
                                                <p className="text-xs font-semibold text-slate-600">Activities</p>
                                            </div>
                                            <p className="text-2xl font-bold text-slate-900">{pep.activitiesCount}</p>
                                        </div>
                                    </div>

                                    {/* Dates */}
                                    <div className="pt-3 border-t border-slate-200 space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Calendar size={14} className="text-[#2563EB]" />
                                            <span>Created: {formatDate(pep.createdAt)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Clock size={14} className="text-[#2563EB]" />
                                            <span>Updated: {formatDate(pep.updatedAt)}</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-200">
                                        <button
                                            onClick={() => navigate(`/pep/${pep.id}/activities`)}
                                            className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg hover:bg-blue-50 transition-colors text-[#2563EB]"
                                            title="View Goals"
                                        >
                                            <Eye size={18} />
                                            <span className="text-xs font-semibold">View</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedPEP(pep);
                                                setShowArchiveModal(true);
                                            }}
                                            className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
                                            title={pep.status === 'archived' ? 'Unarchive' : 'Archive'}
                                        >
                                            {pep.status === 'archived' ? (
                                                <>
                                                    <ArchiveRestore size={18} />
                                                    <span className="text-xs font-semibold">Restore</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Archive size={18} />
                                                    <span className="text-xs font-semibold">Archive</span>
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedPEP(pep);
                                                setShowDeleteModal(true);
                                            }}
                                            className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                                            title="Delete PEP"
                                        >
                                            <Trash2 size={18} />
                                            <span className="text-xs font-semibold">Delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center">
                        <TrendingUp className="mx-auto text-slate-300 mb-4" size={64} />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                            {peps.length === 0 ? 'No PEPs Yet' : 'No Matching PEPs'}
                        </h3>
                        <p className="text-slate-600 mb-6">
                            {peps.length === 0
                                ? 'Create your first Personalized Education Plan to get started.'
                                : 'Try adjusting your filters or search query.'}
                        </p>
                        {peps.length === 0 && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="px-6 py-3 bg-[#2563EB] text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
                            >
                                Create First PEP
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Create PEP Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="size-12 rounded-full bg-purple-100 flex items-center justify-center">
                                <Plus className="text-purple-600" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Create New PEP</h3>
                                <p className="text-sm text-slate-600">Select a child to begin</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="text-sm font-semibold text-slate-700 mb-2 block">
                                Select Child
                            </label>
                            <select
                                value={selectedChildId}
                                onChange={(e) => setSelectedChildId(e.target.value)}
                                className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                            >
                                <option value="">Choose a child...</option>
                                {children.map((child) => (
                                    <option key={child.id} value={child.id}>
                                        {child.firstName} {child.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setSelectedChildId('');
                                }}
                                disabled={processing}
                                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreatePEP}
                                disabled={processing || !selectedChildId}
                                className="flex-1 px-4 py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Creating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus size={18} />
                                        <span>Create PEP</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Archive/Unarchive Modal */}
            {showArchiveModal && selectedPEP && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center">
                                {selectedPEP.status === 'archived' ? (
                                    <ArchiveRestore className="text-slate-600" size={24} />
                                ) : (
                                    <Archive className="text-slate-600" size={24} />
                                )}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">
                                    {selectedPEP.status === 'archived' ? 'Unarchive' : 'Archive'} PEP
                                </h3>
                                <p className="text-sm text-slate-600">
                                    For {selectedPEP.childName}
                                </p>
                            </div>
                        </div>

                        <p className="text-slate-700 mb-6 text-sm">
                            {selectedPEP.status === 'archived'
                                ? 'This will restore the PEP to active status. You can continue working on it.'
                                : 'This will archive the PEP. You can restore it later if needed.'}
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowArchiveModal(false)}
                                disabled={processing}
                                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleArchivePEP}
                                disabled={processing}
                                className="flex-1 px-4 py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
                            >
                                {processing ? 'Processing...' : selectedPEP.status === 'archived' ? 'Unarchive' : 'Archive'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedPEP && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="size-12 rounded-full bg-red-100 flex items-center justify-center">
                                <Trash2 className="text-red-600" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Delete PEP</h3>
                                <p className="text-sm text-slate-600">This action cannot be undone</p>
                            </div>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-red-900 mb-2">
                                You are about to permanently delete:
                            </p>
                            <ul className="text-sm text-red-800 space-y-1">
                                <li>• PEP for <strong>{selectedPEP.childName}</strong></li>
                                <li>• <strong>{selectedPEP.goalsCount}</strong> goals</li>
                                <li>• <strong>{selectedPEP.activitiesCount}</strong> activities</li>
                                <li>• All progress data</li>
                            </ul>
                        </div>

                        <p className="text-slate-700 mb-6 text-sm">
                            Are you absolutely sure you want to delete this PEP?
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={processing}
                                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeletePEP}
                                disabled={processing}
                                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Deleting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={18} />
                                        <span>Delete Permanently</span>
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
