import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, User, Lock, Bell, Shield, Globe, HelpCircle,
    Settings as SettingsIcon, Camera, Mail, Phone, Save, X,
    Download, Trash2, AlertCircle, CheckCircle2, Eye, EyeOff,
    Loader2
} from 'lucide-react';

import settingsService from '../services/settings.service';
import type {
    UserProfile,
    NotificationPreferences,
    PrivacySettings,
    UserPreferences,
    UpdatePasswordData,
} from '../services/settings.service';

type SettingsTab = 'profile' | 'security' | 'notifications' | 'privacy' | 'preferences' | 'help' | 'account';

export default function Settings() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences | null>(null);
    const [privacySettings, setPrivacySettings] = useState<PrivacySettings | null>(null);
    const [preferences, setPreferences] = useState<UserPreferences | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [passwordData, setPasswordData] = useState<UpdatePasswordData>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [photoFile, setPhotoFile] = useState<File | null>(null);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const [profileRes, notifRes, privacyRes, prefsRes] = await Promise.all([
                settingsService.getProfile(),
                settingsService.getNotificationPreferences(),
                settingsService.getPrivacySettings(),
                settingsService.getPreferences(),
            ]);

            if (profileRes.success) setProfile(profileRes.data);
            if (notifRes.success) setNotificationPrefs(notifRes.data);
            if (privacyRes.success) setPrivacySettings(privacyRes.data);
            if (prefsRes.success) setPreferences(prefsRes.data);

            setLoading(false);
        } catch (error) {
            console.error('Failed to load settings:', error);
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        if (!profile) return;

        try {
            setSaving(true);
            await settingsService.updateProfile({
                firstName: profile.firstName,
                lastName: profile.lastName,
                email: profile.email,
                phone: profile.phone,
            });

            if (photoFile) {
                const photoRes = await settingsService.uploadPhoto(photoFile);
                if (photoRes.success) {
                    setProfile({ ...profile, photoUrl: photoRes.photoUrl });
                }
            }

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Failed to update profile:', error);
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match!' });
            return;
        }

        if (passwordData.newPassword.length < 8) {
            setMessage({ type: 'error', text: 'Password must be at least 8 characters!' });
            return;
        }

        try {
            setSaving(true);
            await settingsService.updatePassword(passwordData);
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setShowPasswordFields(false);
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Failed to update password:', error);
            setMessage({ type: 'error', text: 'Failed to update password. Check your current password.' });
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateNotifications = async () => {
        if (!notificationPrefs) return;

        try {
            setSaving(true);
            await settingsService.updateNotificationPreferences(notificationPrefs);
            setMessage({ type: 'success', text: 'Notification preferences updated!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Failed to update notifications:', error);
            setMessage({ type: 'error', text: 'Failed to update preferences. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    const handleUpdatePrivacy = async () => {
        if (!privacySettings) return;

        try {
            setSaving(true);
            await settingsService.updatePrivacySettings(privacySettings);
            setMessage({ type: 'success', text: 'Privacy settings updated!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Failed to update privacy:', error);
            setMessage({ type: 'error', text: 'Failed to update settings. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    const handleUpdatePreferences = async () => {
        if (!preferences) return;

        try {
            setSaving(true);
            await settingsService.updatePreferences(preferences);
            setMessage({ type: 'success', text: 'Preferences updated!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Failed to update preferences:', error);
            setMessage({ type: 'error', text: 'Failed to update preferences. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    const handleExportData = async () => {
        if (!confirm('Export all your data? This will generate a downloadable file.')) return;

        try {
            setSaving(true);
            const response = await settingsService.exportData();
            if (response.success) {
                window.open(response.downloadUrl, '_blank');
                setMessage({ type: 'success', text: 'Data export started! Check your downloads.' });
            }
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Failed to export data:', error);
            setMessage({ type: 'error', text: 'Failed to export data. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        const password = prompt('Enter your password to confirm account deletion:');
        if (!password) return;

        if (!confirm('⚠️ WARNING: This will permanently delete your account and all data. This action CANNOT be undone. Are you absolutely sure?')) {
            return;
        }

        try {
            setSaving(true);
            await settingsService.deleteAccount(password);
            alert('Account deleted successfully. You will be logged out.');
            // Logout and redirect to login
            localStorage.removeItem('token');
            navigate('/login');
        } catch (error) {
            console.error('Failed to delete account:', error);
            setMessage({ type: 'error', text: 'Failed to delete account. Check your password.' });
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'privacy', label: 'Privacy', icon: Shield },
        { id: 'preferences', label: 'Preferences', icon: Globe },
        { id: 'help', label: 'Help & Support', icon: HelpCircle },
        { id: 'account', label: 'Account', icon: SettingsIcon },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
                    <p className="mt-4 text-slate-600">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-slate-600 hover:text-[#2563EB] font-semibold transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Dashboard</span>
                </button>

                {/* Header */}
                <div>
                    <h1 className="text-slate-900 text-3xl md:text-4xl font-black leading-tight tracking-tight mb-2">
                        Settings
                    </h1>
                    <p className="text-slate-600 text-base">
                        Manage your account, preferences, and privacy settings
                    </p>
                </div>

                {/* Success/Error Message */}
                {message && (
                    <div
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 ${message.type === 'success'
                            ? 'bg-green-50 border-green-200 text-green-700'
                            : 'bg-red-50 border-red-200 text-red-700'
                            }`}
                    >
                        {message.type === 'success' ? (
                            <CheckCircle2 size={20} />
                        ) : (
                            <AlertCircle size={20} />
                        )}
                        <p className="font-semibold">{message.text}</p>
                    </div>
                )}

                {/* Tabs & Content */}
                <div className="grid md:grid-cols-4 gap-6">
                    {/* Sidebar Tabs */}
                    <div className="md:col-span-1 space-y-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as SettingsTab)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-left transition-all ${activeTab === tab.id
                                        ? 'bg-[#2563EB] text-white'
                                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Content Area */}
                    <div className="md:col-span-3">
                        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
                            {/* PROFILE TAB */}
                            {activeTab === 'profile' && profile && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Profile Information</h2>

                                    {/* Photo Upload */}
                                    <div className="flex items-center gap-6">
                                        <div className="relative">
                                            {profile.photoUrl ? (
                                                <img
                                                    src={profile.photoUrl}
                                                    alt="Profile"
                                                    className="size-24 rounded-full object-cover border-4 border-slate-200"
                                                />
                                            ) : (
                                                <div className="size-24 rounded-full bg-slate-200 flex items-center justify-center border-4 border-slate-300">
                                                    <User className="text-slate-500" size={40} />
                                                </div>
                                            )}
                                            <label className="absolute bottom-0 right-0 size-8 bg-[#2563EB] text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                                                <Camera size={16} />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Profile Photo</p>
                                            <p className="text-sm text-slate-600">JPG, PNG or GIF. Max 5MB.</p>
                                        </div>
                                    </div>

                                    {/* Name Fields */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                value={profile.firstName}
                                                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                                className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                value={profile.lastName}
                                                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                                className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Email & Phone */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                                <input
                                                    type="email"
                                                    value={profile.email}
                                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                                    className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                                Phone Number
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                                <input
                                                    type="tel"
                                                    value={profile.phone || ''}
                                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                                    className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                                                    placeholder="Optional"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleUpdateProfile}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2 className="animate-spin" size={18} />
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                <span>Save Changes</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* SECURITY TAB */}
                            {activeTab === 'security' && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Security Settings</h2>

                                    {!showPasswordFields ? (
                                        <button
                                            onClick={() => setShowPasswordFields(true)}
                                            className="flex items-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
                                        >
                                            <Lock size={18} />
                                            <span>Change Password</span>
                                        </button>
                                    ) : (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                                    Current Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showCurrentPassword ? 'text' : 'password'}
                                                        value={passwordData.currentPassword}
                                                        onChange={(e) =>
                                                            setPasswordData({ ...passwordData, currentPassword: e.target.value })
                                                        }
                                                        className="w-full h-12 px-4 pr-12 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                        className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                                                    >
                                                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                                    New Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showNewPassword ? 'text' : 'password'}
                                                        value={passwordData.newPassword}
                                                        onChange={(e) =>
                                                            setPasswordData({ ...passwordData, newPassword: e.target.value })
                                                        }
                                                        className="w-full h-12 px-4 pr-12 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                                                    >
                                                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    Minimum 8 characters
                                                </p>
                                            </div>

                                            <div>
                                                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                                    Confirm New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={passwordData.confirmPassword}
                                                    onChange={(e) =>
                                                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                                                    }
                                                    className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                                                />
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => {
                                                        setShowPasswordFields(false);
                                                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                                    }}
                                                    className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all"
                                                >
                                                    <X size={18} />
                                                    <span>Cancel</span>
                                                </button>
                                                <button
                                                    onClick={handleUpdatePassword}
                                                    disabled={saving}
                                                    className="flex items-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
                                                >
                                                    {saving ? (
                                                        <>
                                                            <Loader2 className="animate-spin" size={18} />
                                                            <span>Updating...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save size={18} />
                                                            <span>Update Password</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-8 pt-8 border-t border-slate-200">
                                        <h3 className="font-bold text-slate-900 mb-2">Two-Factor Authentication</h3>
                                        <p className="text-sm text-slate-600 mb-4">
                                            Add an extra layer of security to your account (Coming soon)
                                        </p>
                                        <button
                                            disabled
                                            className="px-6 py-3 bg-slate-200 text-slate-500 rounded-lg font-semibold cursor-not-allowed"
                                        >
                                            Enable 2FA (Coming Soon)
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* NOTIFICATIONS TAB */}
                            {activeTab === 'notifications' && notificationPrefs && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Notification Preferences</h2>

                                    {/* Email Notifications */}
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-4">Email Notifications</h3>
                                        <div className="space-y-3">
                                            {Object.entries(notificationPrefs.emailNotifications).map(([key, value]) => (
                                                <label key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                                                    <span className="font-semibold text-slate-700">
                                                        {key.replace(/([A-Z])/g, ' $1').trim().replace(/^\w/, (c) => c.toUpperCase())}
                                                    </span>
                                                    <input
                                                        type="checkbox"
                                                        checked={value}
                                                        onChange={(e) =>
                                                            setNotificationPrefs({
                                                                ...notificationPrefs,
                                                                emailNotifications: {
                                                                    ...notificationPrefs.emailNotifications,
                                                                    [key]: e.target.checked,
                                                                },
                                                            })
                                                        }
                                                        className="size-5 text-[#2563EB] rounded focus:ring-2 focus:ring-blue-500/20"
                                                    />
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* SMS Notifications */}
                                    <div className="pt-6 border-t border-slate-200">
                                        <h3 className="font-bold text-slate-900 mb-4">SMS Notifications</h3>
                                        <div className="space-y-3">
                                            {Object.entries(notificationPrefs.smsNotifications).map(([key, value]) => (
                                                <label key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                                                    <span className="font-semibold text-slate-700">
                                                        {key.replace(/([A-Z])/g, ' $1').trim().replace(/^\w/, (c) => c.toUpperCase())}
                                                    </span>
                                                    <input
                                                        type="checkbox"
                                                        checked={value}
                                                        onChange={(e) =>
                                                            setNotificationPrefs({
                                                                ...notificationPrefs,
                                                                smsNotifications: {
                                                                    ...notificationPrefs.smsNotifications,
                                                                    [key]: e.target.checked,
                                                                },
                                                            })
                                                        }
                                                        className="size-5 text-[#2563EB] rounded focus:ring-2 focus:ring-blue-500/20"
                                                    />
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleUpdateNotifications}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 mt-6"
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2 className="animate-spin" size={18} />
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                <span>Save Preferences</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* PRIVACY TAB */}
                            {activeTab === 'privacy' && privacySettings && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Privacy Settings</h2>

                                    {/* Data Sharing */}
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-4">Data Sharing</h3>
                                        <div className="space-y-3">
                                            {Object.entries(privacySettings.dataSharing).map(([key, value]) => (
                                                <label key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                                                    <div>
                                                        <p className="font-semibold text-slate-700">
                                                            {key.replace(/([A-Z])/g, ' $1').trim().replace(/^\w/, (c) => c.toUpperCase())}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {key === 'shareWithClinicians' && 'Allow authorized clinicians to view your child\'s data'}
                                                            {key === 'shareForResearch' && 'Help improve services through anonymized data'}
                                                            {key === 'shareAnonymousData' && 'Share usage statistics to improve the platform'}
                                                        </p>
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        checked={value}
                                                        onChange={(e) =>
                                                            setPrivacySettings({
                                                                ...privacySettings,
                                                                dataSharing: {
                                                                    ...privacySettings.dataSharing,
                                                                    [key]: e.target.checked,
                                                                },
                                                            })
                                                        }
                                                        className="size-5 text-[#2563EB] rounded focus:ring-2 focus:ring-blue-500/20"
                                                    />
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Visibility */}
                                    <div className="pt-6 border-t border-slate-200">
                                        <h3 className="font-bold text-slate-900 mb-4">Profile Visibility</h3>
                                        <div className="space-y-3">
                                            {Object.entries(privacySettings.visibility).map(([key, value]) => (
                                                <label key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                                                    <span className="font-semibold text-slate-700">
                                                        {key.replace(/([A-Z])/g, ' $1').trim().replace(/^\w/, (c) => c.toUpperCase())}
                                                    </span>
                                                    <input
                                                        type="checkbox"
                                                        checked={value}
                                                        onChange={(e) =>
                                                            setPrivacySettings({
                                                                ...privacySettings,
                                                                visibility: {
                                                                    ...privacySettings.visibility,
                                                                    [key]: e.target.checked,
                                                                },
                                                            })
                                                        }
                                                        className="size-5 text-[#2563EB] rounded focus:ring-2 focus:ring-blue-500/20"
                                                    />
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleUpdatePrivacy}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 mt-6"
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2 className="animate-spin" size={18} />
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                <span>Save Settings</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* PREFERENCES TAB */}
                            {activeTab === 'preferences' && preferences && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6">User Preferences</h2>

                                    <div>
                                        <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                            Language
                                        </label>
                                        <select
                                            value={preferences.language}
                                            onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                                            className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                                        >
                                            <option value="en">English</option>
                                            <option value="hi">हिन्दी (Hindi)</option>
                                            <option value="ta">தமிழ் (Tamil)</option>
                                            <option value="te">తెలుగు (Telugu)</option>
                                            <option value="kn">ಕನ್ನಡ (Kannada)</option>
                                            <option value="ml">മലയാളം (Malayalam)</option>
                                        </select>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Select your preferred language (multilingual support via Bhashini API)
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                            Timezone
                                        </label>
                                        <select
                                            value={preferences.timezone}
                                            onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                                            className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                                        >
                                            <option value="Asia/Kolkata">India Standard Time (IST)</option>
                                            <option value="America/New_York">Eastern Time (ET)</option>
                                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                            <option value="Europe/London">British Time (GMT)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                                            Theme
                                        </label>
                                        <select
                                            value={preferences.theme}
                                            onChange={(e) => setPreferences({ ...preferences, theme: e.target.value as any })}
                                            className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] outline-none transition-all"
                                        >
                                            <option value="light">Light</option>
                                            <option value="dark">Dark (Coming Soon)</option>
                                            <option value="auto">Auto (System)</option>
                                        </select>
                                    </div>

                                    <button
                                        onClick={handleUpdatePreferences}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2 className="animate-spin" size={18} />
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                <span>Save Preferences</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* HELP & SUPPORT TAB */}
                            {activeTab === 'help' && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Help & Support</h2>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <a
                                            href="https://docs.daira.com/parent-guide"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-6 bg-blue-50 border-2 border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
                                        >
                                            <h3 className="font-bold text-slate-900 mb-2">📚 User Guide</h3>
                                            <p className="text-sm text-slate-600">
                                                Learn how to use all features of the parent portal
                                            </p>
                                        </a>

                                        <a
                                            href="https://docs.daira.com/faq"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-6 bg-purple-50 border-2 border-purple-200 rounded-xl hover:bg-purple-100 transition-colors"
                                        >
                                            <h3 className="font-bold text-slate-900 mb-2">❓ FAQs</h3>
                                            <p className="text-sm text-slate-600">
                                                Find answers to frequently asked questions
                                            </p>
                                        </a>

                                        <a
                                            href="mailto:support@daira.com"
                                            className="p-6 bg-green-50 border-2 border-green-200 rounded-xl hover:bg-green-100 transition-colors"
                                        >
                                            <h3 className="font-bold text-slate-900 mb-2">📧 Email Support</h3>
                                            <p className="text-sm text-slate-600">
                                                support@daira.com
                                            </p>
                                        </a>

                                        <a
                                            href="tel:+911234567890"
                                            className="p-6 bg-orange-50 border-2 border-orange-200 rounded-xl hover:bg-orange-100 transition-colors"
                                        >
                                            <h3 className="font-bold text-slate-900 mb-2">📞 Phone Support</h3>
                                            <p className="text-sm text-slate-600">
                                                +91 123 456 7890
                                            </p>
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* ACCOUNT TAB */}
                            {activeTab === 'account' && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Account Management</h2>

                                    {/* Export Data */}
                                    <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
                                        <h3 className="font-bold text-slate-900 mb-2">Export Your Data</h3>
                                        <p className="text-sm text-slate-600 mb-4">
                                            Download a copy of all your data including children profiles, screening results, PEPs, and journal entries.
                                        </p>
                                        <button
                                            onClick={handleExportData}
                                            disabled={saving}
                                            className="flex items-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
                                        >
                                            {saving ? (
                                                <>
                                                    <Loader2 className="animate-spin" size={18} />
                                                    <span>Exporting...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Download size={18} />
                                                    <span>Export Data</span>
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Delete Account */}
                                    <div className="p-6 bg-red-50 border-2 border-red-200 rounded-xl">
                                        <h3 className="font-bold text-slate-900 mb-2">Delete Account</h3>
                                        <p className="text-sm text-slate-600 mb-4">
                                            ⚠️ <strong>Warning:</strong> This action is permanent and cannot be undone. All your data will be permanently deleted.
                                        </p>
                                        <button
                                            onClick={handleDeleteAccount}
                                            disabled={saving}
                                            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
                                        >
                                            {saving ? (
                                                <>
                                                    <Loader2 className="animate-spin" size={18} />
                                                    <span>Deleting...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Trash2 size={18} />
                                                    <span>Delete Account</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
