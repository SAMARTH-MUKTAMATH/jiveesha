import { api } from '../services/api';
import React, { useState, useEffect } from 'react';
import {
    Settings,
    Building2,
    Bell,
    Save,
    CalendarDays,
    ShieldCheck,
    History,
    HelpCircle
} from 'lucide-react';

interface SchoolSettingsProps {
    onBack: () => void;
    onNavigateToConfig?: () => void;
    onNavigateToConsent?: () => void;
    user?: any;
}

interface SchoolProfile {
    schoolName: string;
    district: string;
    schoolCode: string;
    principalName: string;
    email: string;
    phone: string;
    address: string;
}

interface NotificationSettings {
    emailNotifications: boolean;
    smsNotifications: boolean;
    weeklyDigest: boolean;
    criticalAlerts: boolean;
    screeningReminders: boolean;
    reportReminders: boolean;
}

interface AcademicSettings {
    academicYear: string;
    semesterStart: string;
    semesterEnd: string;
    gradingPeriods: string;
}

interface SystemSettings {
    language: string;
    timezone: string;
    dateFormat: string;
    autoConsentDays: number;
}

const SchoolSettings: React.FC<SchoolSettingsProps> = ({ onNavigateToConfig, onNavigateToConsent, user }) => {
    const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'academic' | 'system'>('profile');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // State Management
    const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>({
        schoolName: user?.schoolProfile?.schoolName || '',
        district: user?.schoolProfile?.district || '',
        schoolCode: user?.schoolProfile?.schoolCode || '',
        principalName: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: ''
    });

    const [notifications, setNotifications] = useState<NotificationSettings>({
        emailNotifications: true,
        smsNotifications: false,
        weeklyDigest: true,
        criticalAlerts: true,
        screeningReminders: true,
        reportReminders: false
    });

    const [academic, setAcademic] = useState<AcademicSettings>({
        academicYear: '2023-2024',
        semesterStart: '2023-08-20',
        semesterEnd: '2024-05-30',
        gradingPeriods: 'Quarters'
    });

    const [system, setSystem] = useState<SystemSettings>({
        language: 'English',
        timezone: '(UTC-05:00) Eastern Time',
        dateFormat: 'MM/DD/YYYY',
        autoConsentDays: 7
    });

    // Fetch Settings on Mount
    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/school-admin/settings');
                if (response.data && response.data.data) {
                    const data = response.data.data;
                    setSchoolProfile(prev => ({ ...prev, ...data.schoolProfile }));
                    if (data.notifications) setNotifications(prev => ({ ...prev, ...data.notifications }));
                    if (data.system) setSystem(prev => ({ ...prev, ...data.system }));
                    // Academic settings mock for now as per controller
                }
            } catch (error: any) {
                console.error("Failed to fetch settings", error);

                if (error.response && error.response.status === 401) {
                    // Redirect to login if unauthorized
                    window.location.href = '/login';
                    return;
                }

                const errorMsg = error.response?.data?.message || error.response?.data?.error?.message || 'Failed to load settings. Using local data.';
                setMessage({ type: 'error', text: errorMsg });
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleChange = (section: string, key: string, value: any) => {
        setHasUnsavedChanges(true);
        setMessage(null);
        if (section === 'profile') setSchoolProfile({ ...schoolProfile, [key]: value });
        if (section === 'notifications') setNotifications({ ...notifications, [key]: value });
        if (section === 'academic') setAcademic({ ...academic, [key]: value });
        if (section === 'system') setSystem({ ...system, [key]: value });
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);
        try {
            await api.put('/school-admin/settings', {
                schoolProfile,
                notifications,
                academic,
                system
            });
            setHasUnsavedChanges(false);
            setMessage({ type: 'success', text: 'Settings saved successfully.' });

            // Clear success message after 3 seconds
            setTimeout(() => setMessage(null), 3000);
        } catch (error: any) {
            console.error('Error saving settings:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.message || error.response?.data?.error?.message || 'Failed to save settings. Please try again.'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        // ideally re-fetch or revert to previous state
        // For now just clear flag
        setHasUnsavedChanges(false);
        // Refresh page or re-fetch logic could be here
        window.location.reload();
    };


    return (
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-10 lg:px-40 py-8">

            {/* Page Title & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 animate-fade-in-up">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 uppercase tracking-wide">Administration</span>
                    </div>
                    <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-bold tracking-tight">School Settings</h1>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Settings size={16} />
                        <p className="text-base font-medium">Manage profile, preferences, and system defaults</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            {message && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800'}`}>
                    <span className="material-symbols-outlined text-lg">{message.type === 'success' ? 'check_circle' : 'error'}</span>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Sidebar Tabs */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <nav className="flex flex-col p-2 space-y-1">
                            {[
                                { id: 'profile', label: 'School Profile', icon: Building2 },
                                { id: 'notifications', label: 'Notifications', icon: Bell },
                                { id: 'academic', label: 'Academic Year', icon: CalendarDays },
                                { id: 'system', label: 'System Preferences', icon: Settings }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id as any)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id ? 'bg-blue-50 dark:bg-blue-900/20 text-primary dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                >
                                    <item.icon size={20} />
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Quick Links */}
                    <div className="bg-slate-50 dark:bg-slate-900/20 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <button onClick={onNavigateToConfig} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 hover:text-primary transition-colors w-full text-left">
                                    <Settings size={16} />
                                    Program Configuration
                                </button>
                            </li>
                            <li>
                                <button onClick={onNavigateToConsent} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 hover:text-primary transition-colors w-full text-left">
                                    <ShieldCheck size={16} />
                                    Consent & Compliance
                                </button>
                            </li>
                            <li>
                                <button onClick={() => console.log('Audit Logs')} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 hover:text-primary transition-colors w-full text-left">
                                    <History size={16} />
                                    Audit Logs
                                </button>
                            </li>
                            <li>
                                <button onClick={() => console.log('Help Center')} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 hover:text-primary transition-colors w-full text-left">
                                    <HelpCircle size={16} />
                                    Help Center
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden min-h-[500px]">

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-[500px] text-slate-400">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
                                <p>Loading settings...</p>
                            </div>
                        ) : (
                            <>
                                {/* Tab Content: Profile */}
                                {activeTab === 'profile' && (
                                    <div>
                                        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">School Profile Details</h3>
                                            <p className="text-sm text-slate-500">General information about your institution.</p>
                                        </div>
                                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="col-span-1 md:col-span-2">
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">School Name</label>
                                                <input type="text" value={schoolProfile.schoolName} onChange={(e) => handleChange('profile', 'schoolName', e.target.value)} className="form-input w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 bg-white dark:bg-slate-800 dark:border-slate-600 text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">District / City</label>
                                                <input type="text" value={schoolProfile.district} onChange={(e) => handleChange('profile', 'district', e.target.value)} className="form-input w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 bg-white dark:bg-slate-800 dark:border-slate-600 text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">School Code</label>
                                                <input type="text" value={schoolProfile.schoolCode} onChange={(e) => handleChange('profile', 'schoolCode', e.target.value)} className="form-input w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 bg-white dark:bg-slate-800 dark:border-slate-600 text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Principal Name</label>
                                                <input type="text" value={schoolProfile.principalName} onChange={(e) => handleChange('profile', 'principalName', e.target.value)} className="form-input w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 bg-white dark:bg-slate-800 dark:border-slate-600 text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Contact Email</label>
                                                <input type="email" value={schoolProfile.email} onChange={(e) => handleChange('profile', 'email', e.target.value)} className="form-input w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 bg-white dark:bg-slate-800 dark:border-slate-600 text-sm" disabled />
                                                <p className="text-xs text-slate-500 mt-1">Contact support to update email address.</p>
                                            </div>
                                            <div className="col-span-1 md:col-span-2">
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                                                <input type="tel" value={schoolProfile.phone} onChange={(e) => handleChange('profile', 'phone', e.target.value)} className="form-input w-full md:w-1/2 rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 bg-white dark:bg-slate-800 dark:border-slate-600 text-sm" />
                                            </div>
                                            <div className="col-span-1 md:col-span-2">
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Address</label>
                                                <textarea value={schoolProfile.address} onChange={(e) => handleChange('profile', 'address', e.target.value)} rows={3} className="form-textarea w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 bg-white dark:bg-slate-800 dark:border-slate-600 text-sm"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Tab Content: Notifications */}
                                {activeTab === 'notifications' && (
                                    <div>
                                        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Notification Preferences</h3>
                                            <p className="text-sm text-slate-500">Manage how you receive updates and alerts.</p>
                                        </div>
                                        <div className="p-6 space-y-6">
                                            {Object.entries(notifications).map(([key, value]) => (
                                                <div key={key} className="flex items-center justify-between pb-4 border-b border-slate-50 dark:border-slate-700/50 last:border-0 last:pb-0">
                                                    <div>
                                                        <p className="font-bold text-slate-800 dark:text-white text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                                        <p className="text-xs text-slate-500">Receive notifications via {key.toLowerCase().includes('email') ? 'email' : key.toLowerCase().includes('sms') ? 'SMS' : 'system alerts'}.</p>
                                                    </div>
                                                    <div className="relative inline-block w-10 align-middle select-none">
                                                        <input
                                                            type="checkbox"
                                                            checked={value}
                                                            onChange={(e) => handleChange('notifications', key, e.target.checked)}
                                                            className={`toggle - checkbox absolute block w - 5 h - 5 rounded - full bg - white border - 4 appearance - none cursor - pointer border - slate - 300 checked: border - green - 500 transition - all duration - 300 align - top ${value ? 'right-0 border-green-500' : 'left-0'}`}
                                                        />
                                                        <label className={`toggle - label block overflow - hidden h - 5 rounded - full cursor - pointer ${value ? 'bg-green-500' : 'bg-slate-300'}`}></label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tab Content: Academic */}
                                {activeTab === 'academic' && (
                                    <div>
                                        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Academic Year Settings</h3>
                                            <p className="text-sm text-slate-500">Configure current terms and scheduling.</p>
                                        </div>
                                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Academic Year</label>
                                                <select value={academic.academicYear} onChange={(e) => handleChange('academic', 'academicYear', e.target.value)} className="form-select w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 bg-white dark:bg-slate-800 dark:border-slate-600 text-sm">
                                                    <option>2023-2024</option>
                                                    <option>2024-2025</option>
                                                    <option>2025-2026</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Grading Periods</label>
                                                <select value={academic.gradingPeriods} onChange={(e) => handleChange('academic', 'gradingPeriods', e.target.value)} className="form-select w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 bg-white dark:bg-slate-800 dark:border-slate-600 text-sm">
                                                    <option>Quarters</option>
                                                    <option>Trimesters</option>
                                                    <option>Semesters</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Semester 1 Start</label>
                                                <input type="date" value={academic.semesterStart} onChange={(e) => handleChange('academic', 'semesterStart', e.target.value)} className="form-input w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 bg-white dark:bg-slate-800 dark:border-slate-600 text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Semester 2 End</label>
                                                <input type="date" value={academic.semesterEnd} onChange={(e) => handleChange('academic', 'semesterEnd', e.target.value)} className="form-input w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 bg-white dark:bg-slate-800 dark:border-slate-600 text-sm" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Tab Content: System */}
                                {activeTab === 'system' && (
                                    <div>
                                        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">System Preferences</h3>
                                            <p className="text-sm text-slate-500">Localization and global policy defaults.</p>
                                        </div>
                                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Default Language</label>
                                                <select value={system.language} onChange={(e) => handleChange('system', 'language', e.target.value)} className="form-select w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 bg-white dark:bg-slate-800 dark:border-slate-600 text-sm">
                                                    <option>English</option>
                                                    <option>Spanish</option>
                                                    <option>Hindi</option>
                                                    <option>Mandarin</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Timezone</label>
                                                <select value={system.timezone} onChange={(e) => handleChange('system', 'timezone', e.target.value)} className="form-select w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 bg-white dark:bg-slate-800 dark:border-slate-600 text-sm">
                                                    <option>(UTC-05:00) Eastern Time</option>
                                                    <option>(UTC-06:00) Central Time</option>
                                                    <option>(UTC-07:00) Mountain Time</option>
                                                    <option>(UTC-08:00) Pacific Time</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Date Format</label>
                                                <select value={system.dateFormat} onChange={(e) => handleChange('system', 'dateFormat', e.target.value)} className="form-select w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 bg-white dark:bg-slate-800 dark:border-slate-600 text-sm">
                                                    <option>MM/DD/YYYY</option>
                                                    <option>DD/MM/YYYY</option>
                                                    <option>YYYY-MM-DD</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Auto-Consent Policy (Days)</label>
                                                <input type="number" value={system.autoConsentDays} onChange={(e) => handleChange('system', 'autoConsentDays', e.target.value)} className="form-input w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 bg-white dark:bg-slate-800 dark:border-slate-600 text-sm" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Action Bar */}
            <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between px-4 md:px-10 lg:px-40">
                    <div className="text-sm text-slate-500">
                        {hasUnsavedChanges ? <span className="text-amber-600 font-bold flex items-center gap-1"><Settings size={16} /> Unsaved changes</span> : 'All changes saved'}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleCancel}
                            disabled={!hasUnsavedChanges || isSaving}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!hasUnsavedChanges || isSaving}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
                        >
                            {isSaving ? (
                                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                            ) : (
                                <Save size={18} className="inline-block mr-2" />
                            )}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default SchoolSettings;



