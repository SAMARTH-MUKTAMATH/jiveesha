import React, { useState, useEffect } from 'react';
import { X, Share2 } from 'lucide-react';
import childrenService from '../../services/children.service';
import { consentService, type CreateGrantRequest } from '../../services/consent.service';
import TokenDisplay from './TokenDisplay';

interface Props {
    onClose: () => void;
    onSuccess: () => void;
}

const ShareAccessModal: React.FC<Props> = ({ onClose, onSuccess }) => {
    const [children, setChildren] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedToken, setGeneratedToken] = useState<string | null>(null);
    const [tokenExpiresAt, setTokenExpiresAt] = useState<string | null>(null);

    const [formData, setFormData] = useState<CreateGrantRequest>({
        childId: '',
        clinicianEmail: '',
        permissions: {
            viewDemographics: true,
            viewMedical: true,
            viewScreenings: true,
            viewAssessments: true,
            viewReports: true,
            editNotes: false
        },
        accessLevel: 'view',
        expiresAt: ''
    });

    useEffect(() => {
        loadChildren();
    }, []);

    const loadChildren = async () => {
        try {
            const response = await childrenService.getChildren();
            if (response.success) {
                setChildren(response.data);
                if (response.data.length > 0) {
                    setFormData(prev => ({ ...prev, childId: response.data[0].id }));
                }
            }
        } catch (err: any) {
            setError('Failed to load children');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.childId) {
            setError('Please select a child');
            return;
        }
        if (!formData.clinicianEmail) {
            setError('Please enter clinician email');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clinicianEmail)) {
            setError('Please enter a valid email address');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await consentService.create(formData);
            setGeneratedToken(response.token);
            setTokenExpiresAt(response.tokenExpiresAt);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create access grant');
        } finally {
            setLoading(false);
        }
    };

    const handlePermissionChange = (permission: keyof typeof formData.permissions) => {
        setFormData(prev => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [permission]: !prev.permissions[permission]
            }
        }));
    };

    // If token generated, show success
    if (generatedToken) {
        return (
            <TokenDisplay
                token={generatedToken}
                expiresAt={tokenExpiresAt!}
                clinicianEmail={formData.clinicianEmail}
                childName={children.find(c => c.id === formData.childId)?.firstName || ''}
                onClose={() => {
                    onSuccess();
                    onClose();
                }}
            />
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <Share2 className="h-6 w-6 text-blue-600" />
                        <h2 className="text-xl font-bold text-gray-900">
                            Share Child's Information
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-800 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Select Child */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Child *
                        </label>
                        <select
                            value={formData.childId}
                            onChange={(e) => setFormData({ ...formData, childId: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="">Choose a child</option>
                            {children.map(child => (
                                <option key={child.id} value={child.id}>
                                    {child.firstName} {child.lastName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Clinician Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Clinician Email *
                        </label>
                        <input
                            type="email"
                            value={formData.clinicianEmail}
                            onChange={(e) => setFormData({ ...formData, clinicianEmail: e.target.value })}
                            placeholder="doctor@example.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Permissions */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Permissions
                        </label>
                        <div className="space-y-2">
                            {Object.entries({
                                viewDemographics: 'View Demographics',
                                viewMedical: 'View Medical History',
                                viewScreenings: 'View Screenings',
                                viewAssessments: 'View Assessments',
                                viewReports: 'View Reports',
                                editNotes: 'Edit Notes'
                            }).map(([key, label]) => (
                                <label key={key} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.permissions[key as keyof typeof formData.permissions]}
                                        onChange={() => handlePermissionChange(key as keyof typeof formData.permissions)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-3 text-sm text-gray-700">{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Access Level */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Access Level *
                        </label>
                        <div className="space-y-2">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="view"
                                    checked={formData.accessLevel === 'view'}
                                    onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value as 'view' })}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <span className="ml-3 text-sm text-gray-700">View Only</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="edit"
                                    checked={formData.accessLevel === 'edit'}
                                    onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value as 'edit' })}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <span className="ml-3 text-sm text-gray-700">View & Comment</span>
                            </label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-wait"
                        >
                            {loading ? 'Generating...' : 'Generate Access Token'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ShareAccessModal;
