import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Share2, UserCheck, Clock, XCircle, Plus, ArrowLeft } from 'lucide-react';
import { consentService, type AccessGrant } from '../services/consent.service';
import ShareAccessModal from '../components/consent/ShareAccessModal';
import AccessGrantCard from '../components/consent/AccessGrantCard';
import GrantDetailsModal from '../components/consent/GrantDetailsModal';

type FilterType = 'all' | 'active' | 'pending' | 'revoked';

const ConsentManagement: React.FC = () => {
    const navigate = useNavigate();
    const [grants, setGrants] = useState<AccessGrant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<FilterType>('all');
    const [showShareModal, setShowShareModal] = useState(false);
    const [selectedGrant, setSelectedGrant] = useState<AccessGrant | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        loadGrants();
    }, []);

    const loadGrants = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await consentService.getAll();
            setGrants(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load access grants');
        } finally {
            setLoading(false);
        }
    };

    const handleShareSuccess = () => {
        setShowShareModal(false);
        loadGrants(); // Reload to show new grant
    };

    const handleViewDetails = (grant: AccessGrant) => {
        setSelectedGrant(grant);
        setShowDetailsModal(true);
    };

    const handleRevokeSuccess = () => {
        setShowDetailsModal(false);
        setSelectedGrant(null);
        loadGrants();
    };

    const filteredGrants = grants.filter(grant => {
        if (filter === 'all') return true;
        return grant.status === filter;
    });

    const activeCount = grants.filter(g => g.status === 'active').length;
    const pendingCount = grants.filter(g => g.status === 'pending').length;
    const revokedCount = grants.filter(g => g.status === 'revoked').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Button */}
            <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-semibold transition-colors mb-6"
            >
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
            </button>

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Shield className="h-8 w-8 text-blue-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Access & Consent Management
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Share your child's information with clinicians securely
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowShareModal(true)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Share2 className="h-5 w-5 mr-2" />
                        Share Access
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800">{error}</p>
                </div>
            )}

            {/* Filter Tabs */}
            <div className="mb-6 border-b border-gray-200">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => setFilter('all')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${filter === 'all'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        All ({grants.length})
                    </button>
                    <button
                        onClick={() => setFilter('active')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${filter === 'active'
                            ? 'border-green-600 text-green-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <UserCheck className="h-4 w-4 mr-2" />
                        Active ({activeCount})
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${filter === 'pending'
                            ? 'border-amber-600 text-amber-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <Clock className="h-4 w-4 mr-2" />
                        Pending ({pendingCount})
                    </button>
                    <button
                        onClick={() => setFilter('revoked')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${filter === 'revoked'
                            ? 'border-red-600 text-red-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <XCircle className="h-4 w-4 mr-2" />
                        Revoked ({revokedCount})
                    </button>
                </nav>
            </div>

            {/* Grants List */}
            {filteredGrants.length === 0 ? (
                <div className="text-center py-12">
                    <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No {filter !== 'all' ? filter : ''} access grants
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {filter === 'all'
                            ? "You haven't shared access with any clinicians yet."
                            : `You have no ${filter} access grants.`}
                    </p>
                    {filter === 'all' && (
                        <button
                            onClick={() => setShowShareModal(true)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Share Access
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredGrants.map(grant => (
                        <AccessGrantCard
                            key={grant.id}
                            grant={grant}
                            onViewDetails={handleViewDetails}
                        />
                    ))}
                </div>
            )}

            {/* Modals */}
            {showShareModal && (
                <ShareAccessModal
                    onClose={() => setShowShareModal(false)}
                    onSuccess={handleShareSuccess}
                />
            )}

            {showDetailsModal && selectedGrant && (
                <GrantDetailsModal
                    grant={selectedGrant}
                    onClose={() => {
                        setShowDetailsModal(false);
                        setSelectedGrant(null);
                    }}
                    onRevokeSuccess={handleRevokeSuccess}
                />
            )}
        </div>
    );
};

export default ConsentManagement;
