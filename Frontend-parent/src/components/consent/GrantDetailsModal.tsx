import React, { useState } from 'react';
import { X, User, Calendar, Shield, Eye, AlertTriangle } from 'lucide-react';
import { consentService, type AccessGrant } from '../../services/consent.service';

interface Props {
    grant: AccessGrant;
    onClose: () => void;
    onRevokeSuccess: () => void;
}

const GrantDetailsModal: React.FC<Props> = ({ grant, onClose, onRevokeSuccess }) => {
    const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);
    const [revoking, setRevoking] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRevoke = async () => {
        try {
            setRevoking(true);
            setError(null);
            await consentService.revoke(grant.id);
            onRevokeSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to revoke access');
        } finally {
            setRevoking(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const permissionLabels: Record<string, string> = {
        viewDemographics: 'View Demographics',
        viewMedical: 'View Medical History',
        viewScreenings: 'View Screenings',
        viewAssessments: 'View Assessments',
        viewReports: 'View Reports',
        editNotes: 'Edit Notes'
    };

    if (showRevokeConfirm) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg max-w-md w-full p-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                        <h3 className="text-xl font-bold text-gray-900">Revoke Access?</h3>
                    </div>

                    <p className="text-gray-600 mb-6">
                        Are you sure you want to revoke access for{' '}
                        <span className="font-semibold">{grant.clinicianName || grant.clinicianEmail}</span>{' '}
                        to view {grant.childName}'s information?
                        <br /><br />
                        This action cannot be undone. The clinician will immediately lose access to all information.
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    <div className="flex space-x-3">
                        <button
                            onClick={() => setShowRevokeConfirm(false)}
                            disabled={revoking}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleRevoke}
                            disabled={revoking}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            {revoking ? 'Revoking...' : 'Yes, Revoke Access'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <Shield className="h-6 w-6 text-blue-600" />
                        <h2 className="text-xl font-bold text-gray-900">
                            Access Grant Details
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Clinician Info */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Clinician</h3>
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                                <User className="h-10 w-10 text-gray-400" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">
                                    {grant.clinicianName || 'Pending Claim'}
                                </p>
                                <p className="text-sm text-gray-600">{grant.clinicianEmail}</p>
                            </div>
                        </div>
                    </div>

                    {/* Child Info */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Child</h3>
                        <p className="font-semibold text-gray-900">{grant.childName}</p>
                    </div>

                    {/* Status & Dates */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-3">Status & Timeline</h3>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    Granted: <span className="font-medium">{formatDate(grant.grantedAt)}</span>
                                </span>
                            </div>
                            {grant.activatedAt && (
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                        Activated: <span className="font-medium">{formatDate(grant.activatedAt)}</span>
                                    </span>
                                </div>
                            )}
                            {grant.expiresAt && (
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                        Expires: <span className="font-medium">{formatDate(grant.expiresAt)}</span>
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Permissions */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-3">Permissions Granted</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(grant.permissions).map(([key, value]) => (
                                <div
                                    key={key}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${value ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'
                                        }`}
                                >
                                    {value ? (
                                        <Eye className="h-4 w-4" />
                                    ) : (
                                        <X className="h-4 w-4" />
                                    )}
                                    <span className="text-sm">{permissionLabels[key]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Access Level */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Access Level</h3>
                        <p className="text-gray-900 font-medium capitalize">{grant.accessLevel}</p>
                    </div>

                    {grant.lastAccessedAt && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Last Accessed</h3>
                            <p className="text-gray-900">{formatDate(grant.lastAccessedAt)}</p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-gray-200 flex space-x-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        Close
                    </button>
                    {grant.status === 'active' && (
                        <button
                            onClick={() => setShowRevokeConfirm(true)}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                            Revoke Access
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GrantDetailsModal;
