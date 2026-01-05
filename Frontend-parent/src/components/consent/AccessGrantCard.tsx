import React from 'react';
import { UserCheck, Clock, XCircle, Eye, Calendar } from 'lucide-react';
import type { AccessGrant } from '../../services/consent.service';

interface Props {
    grant: AccessGrant;
    onViewDetails: (grant: AccessGrant) => void;
}

const AccessGrantCard: React.FC<Props> = ({ grant, onViewDetails }) => {
    const statusConfig = {
        active: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-700',
            icon: UserCheck,
            label: 'Active'
        },
        pending: {
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            text: 'text-amber-700',
            icon: Clock,
            label: 'Pending'
        },
        revoked: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-700',
            icon: XCircle,
            label: 'Revoked'
        },
        expired: {
            bg: 'bg-gray-50',
            border: 'border-gray-200',
            text: 'text-gray-700',
            icon: Clock,
            label: 'Expired'
        }
    };

    const config = statusConfig[grant.status];
    const StatusIcon = config.icon;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const permissionCount = Object.values(grant.permissions).filter(Boolean).length;

    return (
        <div className={`border-2 ${config.border} ${config.bg} rounded-lg p-6 hover:shadow-md transition-shadow`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {grant.clinicianName || grant.clinicianEmail}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Child: <span className="font-medium">{grant.childName}</span>
                    </p>
                </div>
                <div className={`flex items-center px-3 py-1 rounded-full ${config.bg} ${config.border} border`}>
                    <StatusIcon className={`h-4 w-4 ${config.text} mr-1`} />
                    <span className={`text-sm font-medium ${config.text}`}>
                        {config.label}
                    </span>
                </div>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Granted: {formatDate(grant.grantedAt)}
                </div>
                {grant.activatedAt && (
                    <div className="flex items-center text-sm text-gray-600">
                        <UserCheck className="h-4 w-4 mr-2" />
                        Activated: {formatDate(grant.activatedAt)}
                    </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                    <Eye className="h-4 w-4 mr-2" />
                    {permissionCount} permissions granted
                </div>
            </div>

            {/* Token (if pending) */}
            {grant.status === 'pending' && grant.token && (
                <div className="mb-4 p-3 bg-white border border-amber-200 rounded">
                    <p className="text-xs text-gray-600 mb-1">Access Token:</p>
                    <code className="text-sm font-mono font-semibold text-amber-700">
                        {grant.token}
                    </code>
                </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3">
                <button
                    onClick={() => onViewDetails(grant)}
                    className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                    View Details
                </button>
            </div>
        </div>
    );
};

export default AccessGrantCard;
