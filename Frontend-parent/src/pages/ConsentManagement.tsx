import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Shield, Plus, Search, Filter, CheckCircle2,
    Clock, XCircle, AlertTriangle, Eye, Trash2, Calendar,
    FileText, Activity, TrendingUp, User, Mail, Building2, Edit
} from 'lucide-react';
import Layout from '../components/Layout';
import consentService from '../services/consent.service';
import type { Consent } from '../services/consent.service';

type StatusFilter = 'all' | 'active' | 'pending' | 'expired' | 'revoked';

export default function ConsentManagement() {
    const navigate = useNavigate();
    const [consents, setConsents] = useState<Consent[]>([]);
    const [filteredConsents, setFilteredConsents] = useState<Consent[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedConsent, setSelectedConsent] = useState<Consent | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showRevokeModal, setShowRevokeModal] = useState(false);
    const [revoking, setRevoking] = useState(false);

    useEffect(() => {
        loadConsents();
    }, []);

    useEffect(() => {
        filterConsents();
    }, [consents, statusFilter, searchQuery]);

    const loadConsents = async () => {
        try {
            const response = await consentService.getConsents();
            if (response.success) {
                setConsents(response.data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Failed to load consents:', error);
            setLoading(false);
        }
    };

    const filterConsents = () => {
        let filtered = consents;

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(c => c.status === statusFilter);
        }

        // Filter by search query
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(c =>
                c.professionalName.toLowerCase().includes(query) ||
                c.facility.toLowerCase().includes(query) ||
                c.childName.toLowerCase().includes(query)
            );
        }

        setFilteredConsents(filtered);
    };

    const handleRevokeConsent = async () => {
        if (!selectedConsent) return;

        try {
            setRevoking(true);
            await consentService.revokeConsent(selectedConsent.id);
            await loadConsents();
            setShowRevokeModal(false);
            setSelectedConsent(null);
        } catch (error) {
            console.error('Failed to revoke consent:', error);
            alert('Failed to revoke consent. Please try again.');
        } finally {
            setRevoking(false);
        }
    };

    const getStatusBadge = (status: Consent['status']) => {
        const badges = {
            active: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle2, label: 'Active' },
            pending: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock, label: 'Pending' },
            expired: { color: 'bg-slate-100 text-slate-600 border-slate-200', icon: AlertTriangle, label: 'Expired' },
            revoked: { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle, label: 'Revoked' },
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

    const getPermissionCount = (permissions: Consent['permissions']) => {
        return Object.values(permissions).filter(Boolean).length;
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
                        <p className="mt-4 text-slate-600">Loading consents...</p>
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
                            Data Privacy & Consent
                        </p>
                        <h1 className="text-slate-900 text-3xl md:text-4xl font-black leading-tight tracking-tight">
                            Manage Consents
                        </h1>
                        <p className="text-slate-600 text-base">
                            Control who has access to your child's data
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/consent/share')}
                        className="flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl"
                    >
                        <Plus size={20} />
                        <span>Share with Professional</span>
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
                                placeholder="Search by professional, facility, or child..."
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
                                <option value="pending">Pending Only</option>
                                <option value="expired">Expired Only</option>
                                <option value="revoked">Revoked Only</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                        <p className="text-sm font-semibold text-slate-600 mb-1">Total</p>
                        <p className="text-2xl font-bold text-slate-900">{consents.length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                        <p className="text-sm font-semibold text-slate-600 mb-1">Active</p>
                        <p className="text-2xl font-bold text-green-600">
                            {consents.filter(c => c.status === 'active').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                        <p className="text-sm font-semibold text-slate-600 mb-1">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600">
                            {consents.filter(c => c.status === 'pending').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                        <p className="text-sm font-semibold text-slate-600 mb-1">Expired</p>
                        <p className="text-2xl font-bold text-slate-600">
                            {consents.filter(c => c.status === 'expired').length}
                        </p>
                    </div>
                </div>

                {/* Consents List */}
                {filteredConsents.length > 0 ? (
                    <div className="space-y-4">
                        {filteredConsents.map((consent) => (
                            <div
                                key={consent.id}
                                className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-all"
                            >
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    {/* Left Side - Professional Info */}
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="size-12 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold text-lg">
                                                        {consent.professionalName[0]}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-slate-900">
                                                            {consent.professionalName}
                                                        </h3>
                                                        <p className="text-sm text-slate-600">{consent.professionalRole}</p>
                                                    </div>
                                                </div>
                                                {getStatusBadge(consent.status)}
                                            </div>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-3 text-sm">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Building2 size={16} className="text-[#2563EB]" />
                                                <span>{consent.facility}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <User size={16} className="text-[#2563EB]" />
                                                <span>Child: {consent.childName}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Calendar size={16} className="text-[#2563EB]" />
                                                <span>Granted: {formatDate(consent.grantedAt)}</span>
                                            </div>
                                            {consent.expiresAt && (
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Clock size={16} className="text-[#2563EB]" />
                                                    <span>Expires: {formatDate(consent.expiresAt)}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Permissions */}
                                        <div className="flex flex-wrap gap-2">
                                            <span className="text-xs font-semibold text-slate-600">
                                                Permissions ({getPermissionCount(consent.permissions)}):
                                            </span>
                                            {consent.permissions.screenings && (
                                                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded">
                                                    Screenings
                                                </span>
                                            )}
                                            {consent.permissions.peps && (
                                                <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded">
                                                    PEPs
                                                </span>
                                            )}
                                            {consent.permissions.medicalHistory && (
                                                <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded">
                                                    Medical History
                                                </span>
                                            )}
                                            {consent.permissions.assessments && (
                                                <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs font-semibold rounded">
                                                    Assessments
                                                </span>
                                            )}
                                            {consent.permissions.reports && (
                                                <span className="px-2 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded">
                                                    Reports
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Side - Actions */}
                                    <div className="flex md:flex-col gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedConsent(consent);
                                                setShowDetailsModal(true);
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-[#2563EB] rounded-lg font-semibold transition-all text-sm"
                                        >
                                            <Eye size={16} />
                                            <span>Details</span>
                                        </button>
                                        {consent.status === 'active' && (
                                            <button
                                                onClick={() => navigate(`/consent/${consent.id}/edit`)}
                                                className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg font-semibold transition-all text-sm"
                                            >
                                                <Edit size={16} />
                                                <span>Edit</span>
                                            </button>
                                        )}
                                        {consent.status === 'active' && (
                                            <button
                                                onClick={() => {
                                                    setSelectedConsent(consent);
                                                    setShowRevokeModal(true);
                                                }}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-semibold transition-all text-sm"
                                            >
                                                <Trash2 size={16} />
                                                <span>Revoke</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center">
                        <Shield className="mx-auto text-slate-300 mb-4" size={64} />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                            {consents.length === 0 ? 'No Consents Yet' : 'No Matching Consents'}
                        </h3>
                        <p className="text-slate-600 mb-6">
                            {consents.length === 0
                                ? 'Start by sharing your child\'s data with a professional.'
                                : 'Try adjusting your filters or search query.'}
                        </p>
                        {consents.length === 0 && (
                            <button
                                onClick={() => navigate('/consent/share')}
                                className="px-6 py-3 bg-[#2563EB] text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
                            >
                                Share with Professional
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Details Modal */}
            {showDetailsModal && selectedConsent && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-slate-900">Consent Details</h3>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="size-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600"
                            >
                                <XCircle size={20} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Professional Info */}
                            <div>
                                <p className="text-sm font-semibold text-slate-600 mb-2">Professional</p>
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <p className="font-bold text-slate-900">{selectedConsent.professionalName}</p>
                                    <p className="text-sm text-slate-600">{selectedConsent.professionalRole}</p>
                                    <p className="text-sm text-slate-600">{selectedConsent.facility}</p>
                                </div>
                            </div>

                            {/* Child Info */}
                            <div>
                                <p className="text-sm font-semibold text-slate-600 mb-2">Child</p>
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <p className="font-bold text-slate-900">{selectedConsent.childName}</p>
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <p className="text-sm font-semibold text-slate-600 mb-2">Status</p>
                                <div>{getStatusBadge(selectedConsent.status)}</div>
                            </div>

                            {/* Dates */}
                            <div>
                                <p className="text-sm font-semibold text-slate-600 mb-2">Timeline</p>
                                <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
                                    <p><strong>Granted:</strong> {formatDate(selectedConsent.grantedAt)}</p>
                                    {selectedConsent.expiresAt && (
                                        <p><strong>Expires:</strong> {formatDate(selectedConsent.expiresAt)}</p>
                                    )}
                                    {selectedConsent.revokedAt && (
                                        <p><strong>Revoked:</strong> {formatDate(selectedConsent.revokedAt)}</p>
                                    )}
                                </div>
                            </div>

                            {/* Permissions */}
                            <div>
                                <p className="text-sm font-semibold text-slate-600 mb-2">Shared Data</p>
                                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                                    {Object.entries(selectedConsent.permissions).map(([key, value]) => (
                                        <div key={key} className="flex items-center justify-between">
                                            <span className="text-sm text-slate-700 capitalize">
                                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                            </span>
                                            {value ? (
                                                <CheckCircle2 className="text-green-600" size={18} />
                                            ) : (
                                                <XCircle className="text-slate-300" size={18} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Access Token */}
                            {selectedConsent.accessToken && (
                                <div>
                                    <p className="text-sm font-semibold text-slate-600 mb-2">Access Token</p>
                                    <div className="bg-slate-50 rounded-lg p-4">
                                        <code className="text-xs text-slate-700 break-all">
                                            {selectedConsent.accessToken}
                                        </code>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Revoke Confirmation Modal */}
            {showRevokeModal && selectedConsent && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="size-12 rounded-full bg-red-100 flex items-center justify-center">
                                <Trash2 className="text-red-600" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Revoke Consent</h3>
                                <p className="text-sm text-slate-600">This action cannot be undone</p>
                            </div>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-red-900 mb-2">
                                You are about to revoke data access for:
                            </p>
                            <ul className="text-sm text-red-800 space-y-1">
                                <li>• <strong>{selectedConsent.professionalName}</strong></li>
                                <li>• {selectedConsent.facility}</li>
                                <li>• Access to <strong>{selectedConsent.childName}</strong>'s data</li>
                            </ul>
                        </div>

                        <p className="text-slate-700 mb-6 text-sm">
                            They will immediately lose access to all shared data. Are you sure you want to proceed?
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowRevokeModal(false)}
                                disabled={revoking}
                                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRevokeConsent}
                                disabled={revoking}
                                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {revoking ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Revoking...</span>
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={18} />
                                        <span>Revoke Access</span>
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
