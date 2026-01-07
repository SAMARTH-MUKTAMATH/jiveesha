import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

interface TeacherSettingsProps {
    onNavigate: (view: string, data?: any) => void;
}

const TeacherSettings: React.FC<TeacherSettingsProps> = ({ onNavigate }) => {
    const [activeSection, setActiveSection] = useState('general');
    const [isLoading, setIsLoading] = useState(true);
    const [teacherData, setTeacherData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('auth_token');
                const response = await fetch(`${API_BASE_URL}/teacher/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setTeacherData({
                        name: `${data.teacher.firstName} ${data.teacher.lastName}`,
                        id: data.teacher.employeeId || data.teacher.id.slice(0, 5),
                        assignment: data.teacher.assignment,
                        school: data.teacher.school.name,
                        email: data.teacher.email,
                        verified: data.teacher.status === 'active'
                    });
                } else {
                    throw new Error('Failed to fetch profile');
                }
            } catch (err: any) {
                setError(err.message);
                // Fallback to minimal info if fetch fails for some reason
                setTeacherData({
                    name: "Teacher",
                    id: "---",
                    assignment: "---",
                    school: "---",
                    email: "",
                    verified: false
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="size-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium font-display">Loading settings...</p>
                </div>
            </div>
        );
    }

    if (!teacherData) return null;

    const navItems = [
        { id: 'general', label: 'General Profile', icon: 'person' },
        { id: 'notifications', label: 'Notifications', icon: 'notifications' },
        { id: 'professional', label: 'Professional & School', icon: 'school' },
        { id: 'security', label: 'Security & Privacy', icon: 'shield' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-[#f0f4fa] to-[#e6ecf5] text-[#111318] font-display antialiased">
            <Navbar
                teacherName={teacherData.name}
                teacherAssignment={teacherData.assignment}
                schoolName={teacherData.school}
                onNavigate={onNavigate}
                activeView="settings"
            />

            {/* Main Content */}
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#111318] tracking-tight">Settings</h1>
                    <p className="text-[#616f89] mt-2 text-base">Manage your account preferences, privacy, and professional details.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24 border border-gray-100">
                            <nav className="flex flex-col gap-1">
                                {navItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveSection(item.id)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${activeSection === item.id
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-[#616f89] hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className={`material-symbols-outlined ${activeSection === item.id ? 'icon-fill' : ''}`}>
                                            {item.icon}
                                        </span>
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Content Area */}
                    <main className="flex-1 flex flex-col gap-6">
                        {activeSection === 'general' && (
                            <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 sm:p-8">
                                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                                        <div className="relative group">
                                            <div className="size-24 rounded-full bg-slate-200 flex items-center justify-center text-3xl font-bold text-slate-500 ring-4 ring-white shadow-sm">
                                                {teacherData?.name?.split(' ').map((n: string) => n[0]).join('') || 'T'}
                                            </div>
                                            <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md border border-gray-100 text-gray-500 hover:text-blue-600 transition-colors">
                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                            </button>
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <h2 className="text-2xl font-bold text-[#111318]">{teacherData.name}</h2>
                                                {teacherData.verified && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                                                        <span className="material-symbols-outlined text-[14px]">verified</span>
                                                        Verified Teacher
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[#616f89]">Teacher ID: {teacherData.id}</p>
                                            <p className="text-sm text-blue-600 font-medium hover:underline cursor-pointer">View public profile</p>
                                        </div>
                                    </div>

                                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-[#111318]">Full Name</label>
                                            <input type="text" defaultValue={teacherData.name} className="w-full h-12 rounded-lg border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-600 focus:border-transparent px-4 text-sm" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-[#111318]">Email Address</label>
                                            <input type="email" defaultValue={teacherData.email} className="w-full h-12 rounded-lg border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-600 focus:border-transparent px-4 text-sm" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-[#111318]">Language Preference</label>
                                            <div className="relative">
                                                <select className="w-full h-12 rounded-lg border-gray-200 bg-gray-50 text-[#111318] focus:ring-2 focus:ring-blue-600 focus:border-transparent pl-4 pr-10 appearance-none transition-shadow cursor-pointer text-sm">
                                                    <option selected value="en">English (UK)</option>
                                                    <option value="hi">Hindi</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                                    <span className="material-symbols-outlined">expand_more</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeSection === 'notifications' && (
                            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                        <span className="material-symbols-outlined">notifications_active</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[#111318]">Notifications</h3>
                                        <p className="text-sm text-[#616f89]">Manage how you receive updates regarding screening and results.</p>
                                    </div>
                                </div>
                                <div className="space-y-5">
                                    {[
                                        { title: "Screening Results Ready", desc: "Get notified immediately when a child's screening analysis is complete.", state: true },
                                        { title: "Weekly Progress Digest", desc: "Receive a summary of all class activities and pending screenings every Monday.", state: true },
                                        { title: "Marketing & Product Updates", desc: "Occasional news about new features in Daira platform.", state: false }
                                    ].map((pref, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex-1 pr-4">
                                                <p className="text-sm font-medium text-[#111318]">{pref.title}</p>
                                                <p className="text-sm text-[#616f89]">{pref.desc}</p>
                                            </div>
                                            <button
                                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${pref.state ? 'bg-blue-600' : 'bg-gray-200'}`}
                                                role="switch"
                                                type="button"
                                            >
                                                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${pref.state ? 'translate-x-5' : 'translate-x-0'}`}></span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {activeSection === 'professional' && (
                            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                        <span className="material-symbols-outlined">school</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[#111318]">Professional & School</h3>
                                        <p className="text-sm text-[#616f89]">Manage your school affiliations and class assignments.</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-6">
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-lg bg-white flex items-center justify-center border border-gray-100 text-gray-400">
                                                <span className="material-symbols-outlined">apartment</span>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-[#616f89] uppercase tracking-wide">Current Affiliation</p>
                                                <p className="text-base font-bold text-[#111318]">{teacherData.school}</p>
                                                <p className="text-xs text-[#616f89]">Authorized since Sept 2023</p>
                                            </div>
                                        </div>
                                        <div className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold border border-green-100">
                                            Active
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-[#111318]">Current Assignment</label>
                                        <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 flex items-center gap-3">
                                            <span className="material-symbols-outlined text-blue-600">groups</span>
                                            <span className="text-sm font-medium">{teacherData.assignment}</span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeSection === 'security' && (
                            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                        <span className="material-symbols-outlined">security</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[#111318]">Security & Privacy</h3>
                                        <p className="text-sm text-[#616f89]">Control your active sessions and view data consents.</p>
                                    </div>
                                </div>
                                <div className="grid gap-6">
                                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                                            <span className="text-sm font-semibold text-[#111318]">Active Sessions</span>
                                            <button className="text-xs font-medium text-red-600 hover:text-red-700">Log out other devices</button>
                                        </div>
                                        <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-gray-400">laptop_mac</span>
                                                <div>
                                                    <p className="text-sm font-medium text-[#111318]">Macbook Pro (This device)</p>
                                                    <p className="text-xs text-green-600 flex items-center gap-1">
                                                        <span className="size-1.5 rounded-full bg-green-500"></span>
                                                        Active now
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-400">London, UK</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-blue-600">policy</span>
                                            <div>
                                                <p className="text-sm font-bold text-[#111318]">Data Privacy Consents</p>
                                                <p className="text-xs text-[#616f89]">You last reviewed your consents on Dec 12, 2023.</p>
                                            </div>
                                        </div>
                                        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">View details</button>
                                    </div>
                                </div>
                            </section>
                        )}

                        <div className="flex justify-end gap-3 pt-4">
                            <button onClick={() => onNavigate('dashboard')} className="px-6 py-2.5 rounded-lg border border-gray-200 text-[#111318] font-medium text-sm hover:bg-gray-50 transition-colors">Cancel</button>
                            <button
                                onClick={() => alert('Settings saved successfully (demo)')}
                                className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 shadow-md transition-colors flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[18px]">save</span>
                                Save Changes
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default TeacherSettings;
