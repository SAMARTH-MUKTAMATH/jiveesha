import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Save, X, Shield, Activity, TrendingUp, FileText,
    CheckCircle2, Calendar, Clock, AlertCircle, Loader2, Edit,
    History, ToggleLeft, ToggleRight
} from 'lucide-react';
import Layout from '../components/Layout';
import consentService from '../services/consent.service';
import type { Consent } from '../services/consent.service';

export default function EditConsentPermissions() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [consent, setConsent] = useState<Consent | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [hasChanges, setHasChanges] = useState(false);

    const [editedPermissions, setEditedPermissions] = useState({
        screenings: false,
        peps: false,
        medicalHistory: false,
        assessments: false,
        reports: false,
    });

    const [originalPermissions, setOriginalPermissions] = useState({
        screenings: false,
        peps: false,
        medicalHistory: false,
        assessments: false,
        reports: false,
    });

    useEffect(() => {
        if (id) {
            loadConsent(id);
        }
    }, [id]);

    useEffect(() => {
        // Check if permissions have changed
        const changed = JSON.stringify(editedPermissions) !== JSON.stringify(originalPermissions);
        setHasChanges(changed);
    }, [editedPermissions, originalPermissions]);

    const loadConsent = async (consentId: string) => {
        try {
            const response = await consentService.getConsent(consentId);
            if (response.success) {
                setConsent(response.data);
                setEditedPermissions(response.data.permissions);
                setOriginalPermissions(response.data.permissions);
            }
            setLoading(false);
        } catch (error) {
            console.error('Failed to load consent:', error);
            setError('Failed to load consent details');
            setLoading(false);
        }
    };

    const togglePermission = (key: keyof typeof editedPermissions) => {
        const newPermissions = { ...editedPermissions, [key]: !editedPermissions[key] };

        // Check if at least one permission remains enabled
        const hasActivePermission = Object.values(newPermissions).some(Boolean);

        if (!hasActivePermission) {
            setError('At least one permission must be enabled');
            return;
        }

        setEditedPermissions(newPermissions);
        setError('');
    };

    const handleSave = async () => {
        if (!id) return;

        // Validate at least one permission is selected
        const hasActivePermission = Object.values(editedPermissions).some(Boolean);
        if (!hasActivePermission) {
            setError('At least one permission must be enabled');
            return;
        }

        try {
            setSaving(true);
            setError('');

            await consentService.updatePermissions(id, editedPermissions);

            // Reload consent to get updated data
            await loadConsent(id);
            setHasChanges(false);

            // Show success message
            alert('Permissions updated successfully!');
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to update permissions. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (hasChanges) {
            const confirmCancel = window.confirm('You have unsaved changes. Are you sure you want to cancel?');
            if (!confirmCancel) return;
        }
        navigate(-1);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getPermissionChanges = () => {
        const changes: { type: string; action: 'added' | 'removed' }[] = [];

        Object.keys(editedPermissions).forEach((key) => {
            const k = key as keyof typeof editedPermissions;
            const original = originalPermissions[k];
            const edited = editedPermissions[k];

            if (original !== edited) {
                changes.push({
                    type: key,
                    action: edited ? 'added' : 'removed',
                });
            }
        });

        return changes;
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
                        <p className="mt-4 text-slate-600">Loading consent...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!consent) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Consent Not Found</h2>
                        <p className="text-slate-600 mb-6">This consent doesn't exist or has been deleted.</p>
                        <button
                            onClick={() => navigate('/consent')}
                            className="px-6 py-3 bg-[#2563EB] text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
                        >
                            Back to Consents
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    const permissionItems = [
        {
            key: 'screenings',
            label: 'Screening Results',
            icon: Activity,
            description: 'M-CHAT, ASQ, and other developmental screening assessments',
            bgEnabled: 'bg-blue-100',
            textEnabled: 'text-blue-600',
            badgeBg: 'bg-blue-100',
            badgeText: 'text-blue-700',
        },
        {
            key: 'peps',
            label: 'Personalized Education Plans',
            icon: TrendingUp,
            description: 'PEP goals, activities, and progress tracking data',
            bgEnabled: 'bg-purple-100',
            textEnabled: 'text-purple-600',
            badgeBg: 'bg-purple-100',
            badgeText: 'text-purple-700',
        },
        {
            key: 'medicalHistory',
            label: 'Medical History',
            icon: FileText,
            description: 'Health conditions, diagnoses, and medical background',
            bgEnabled: 'bg-green-100',
            textEnabled: 'text-green-600',
            badgeBg: 'bg-green-100',
            badgeText: 'text-green-700',
        },
        {
            key: 'assessments',
            label: 'Professional Assessments',
            icon: CheckCircle2,
            description: 'Clinical evaluations, diagnoses, and professional reports',
            bgEnabled: 'bg-orange-100',
            textEnabled: 'text-orange-600',
            badgeBg: 'bg-orange-100',
            badgeText: 'text-orange-700',
        },
        {
            key: 'reports',
            label: 'Progress Reports',
            icon: Calendar,
            description: 'Developmental progress, milestone tracking, and reports',
            bgEnabled: 'bg-teal-100',
            textEnabled: 'text-teal-600',
            badgeBg: 'bg-teal-100',
            badgeText: 'text-teal-700',
        },
    ];

    const changes = getPermissionChanges();

    return (
        <Layout>
            <div className="w-full max-w-[900px] mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
                {/* Back Button */}
                <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 text-slate-600 hover:text-[#2563EB] font-semibold transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>

                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="size-16 rounded-full bg-blue-100 flex items-center justify-center">
                            <Shield className="text-[#2563EB]" size={32} />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-slate-900 mb-2">Edit Permissions</h1>
                            <p className="text-slate-600 mb-3">
                                Manage data access for <strong>{consent.professionalName}</strong>
                            </p>
                            <div className="flex flex-wrap gap-3 text-sm">
                                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                                    <Calendar size={14} className="text-[#2563EB]" />
                                    <span className="text-slate-700">
                                        Granted: {formatDate(consent.grantedAt)}
                                    </span>
                                </div>
                                {consent.expiresAt && (
                                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                                        <Clock size={14} className="text-[#2563EB]" />
                                        <span className="text-slate-700">
                                            Expires: {formatDate(consent.expiresAt)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Professional Info */}
                    <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-600">Professional:</span>
                            <span className="font-bold text-slate-900">{consent.professionalName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Role:</span>
                            <span className="font-bold text-slate-900">{consent.professionalRole}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Facility:</span>
                            <span className="font-bold text-slate-900">{consent.facility}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Child:</span>
                            <span className="font-bold text-slate-900">{consent.childName}</span>
                        </div>
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 text-red-700">
                        <AlertCircle size={20} className="shrink-0 mt-0.5" />
                        <p className="text-sm font-semibold">{error}</p>
                    </div>
                )}

                {/* Changes Summary */}
                {hasChanges && changes.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <History className="text-[#2563EB]" size={20} />
                            <h3 className="font-bold text-slate-900">Pending Changes ({changes.length})</h3>
                        </div>
                        <div className="space-y-2">
                            {changes.map((change, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                    {change.action === 'added' ? (
                                        <CheckCircle2 className="text-green-600" size={16} />
                                    ) : (
                                        <X className="text-red-600" size={16} />
                                    )}
                                    <span className="text-slate-700">
                                        <strong>{change.type.replace(/([A-Z])/g, ' $1').trim()}</strong>{' '}
                                        will be <strong>{change.action === 'added' ? 'enabled' : 'disabled'}</strong>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Permissions Editor */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Data Permissions</h2>

                    <div className="space-y-4">
                        {permissionItems.map((item) => {
                            const Icon = item.icon;
                            const isEnabled = editedPermissions[item.key as keyof typeof editedPermissions];
                            const ToggleIcon = isEnabled ? ToggleRight : ToggleLeft;

                            return (
                                <div
                                    key={item.key}
                                    className={`border-2 rounded-xl p-5 transition-all ${isEnabled
                                            ? 'border-[#2563EB] bg-blue-50'
                                            : 'border-slate-200 bg-white hover:border-slate-300'
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div
                                            className={`size-12 rounded-lg flex items-center justify-center ${isEnabled ? item.bgEnabled : 'bg-slate-100'
                                                }`}
                                        >
                                            <Icon
                                                className={isEnabled ? item.textEnabled : 'text-slate-400'}
                                                size={24}
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-bold text-slate-900 text-lg">{item.label}</h3>
                                                {isEnabled && (
                                                    <span className={`px-2 py-0.5 ${item.badgeBg} ${item.badgeText} text-xs font-bold rounded`}>
                                                        Enabled
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-600 mb-4">{item.description}</p>

                                            {/* Toggle Button */}
                                            <button
                                                onClick={() => togglePermission(item.key as keyof typeof editedPermissions)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${isEnabled
                                                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                                        : 'bg-[#2563EB] hover:bg-blue-700 text-white'
                                                    }`}
                                            >
                                                <ToggleIcon size={18} />
                                                <span>{isEnabled ? 'Disable Access' : 'Enable Access'}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Info Note */}
                    <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-sm text-amber-900">
                            <strong>Note:</strong> At least one permission must remain enabled. Changes take effect immediately after saving.
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleCancel}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all"
                        >
                            <X size={18} />
                            <span>Cancel</span>
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={saving || !hasChanges}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#2563EB] text-white rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    <span>Saving Changes...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>
                    </div>

                    {!hasChanges && (
                        <p className="text-sm text-slate-500 text-center mt-3">
                            Make changes to enable the save button
                        </p>
                    )}
                </div>
            </div>
        </Layout>
    );
}
