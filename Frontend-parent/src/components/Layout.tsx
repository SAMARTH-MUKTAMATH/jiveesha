import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Bell, Menu, X, LogOut, Settings, User, BookOpen } from 'lucide-react';
import authService from '../services/auth.service';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const user = authService.getCurrentUser();

    const navLinks = [
        { label: 'Dashboard', path: '/dashboard', active: window.location.pathname === '/dashboard' },
        { label: 'My Children', path: '/children', active: window.location.pathname.startsWith('/children') },
        { label: 'Screening', path: '/screening/select', active: window.location.pathname.startsWith('/screening') && !window.location.pathname.includes('history') && !window.location.pathname.includes('results') },
        { label: 'Results', path: '/screening/history', active: window.location.pathname.includes('/screening/history') || window.location.pathname.includes('/results') },
        { label: 'PEP Builder', path: '/pep', active: window.location.pathname.startsWith('/pep') },
        { label: 'Resources', path: '/resources', active: window.location.pathname.startsWith('/resources') },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white flex flex-col">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 lg:px-10 py-3 shadow-sm">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-4 text-[#2563EB]">
                        <div className="size-8 flex items-center justify-center bg-blue-50 rounded-lg text-[#2563EB]">
                            <Heart className="w-5 h-5" />
                        </div>
                        <h2 className="text-slate-900 text-xl font-bold leading-tight tracking-tight">Daira</h2>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex flex-1 justify-center gap-8">
                        {navLinks.map((link) => (
                            <button
                                key={link.path}
                                onClick={() => navigate(link.path)}
                                className={`text-sm font-semibold leading-normal transition-colors ${link.active
                                    ? 'text-[#2563EB]'
                                    : 'text-slate-600 hover:text-[#2563EB]'
                                    }`}
                            >
                                {link.label}
                            </button>
                        ))}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="lg:hidden flex-1 flex justify-end mr-4">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-slate-900 p-2"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/journal')}
                            className="flex items-center justify-center rounded-full size-10 hover:bg-purple-100 transition-colors text-slate-900 hover:text-purple-600"
                            title="Journal"
                        >
                            <BookOpen size={20} />
                        </button>
                        <button className="flex items-center justify-center rounded-full size-10 hover:bg-slate-100 transition-colors text-slate-900 relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-white"></span>
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                className="bg-blue-100 rounded-full size-10 flex items-center justify-center text-[#2563EB] font-bold hover:bg-blue-200 transition-colors"
                            >
                                {user?.firstName?.[0] || 'U'}
                            </button>

                            {profileMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50">
                                    <button
                                        onClick={() => {
                                            navigate('/settings');
                                            setProfileMenuOpen(false);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                                    >
                                        <Settings size={16} />
                                        Settings
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigate('/profile');
                                            setProfileMenuOpen(false);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                                    >
                                        <User size={16} />
                                        Profile
                                    </button>
                                    <div className="border-t border-slate-200 my-2"></div>
                                    <button
                                        onClick={() => {
                                            authService.logout();
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="lg:hidden mt-4 pb-4 border-t border-slate-200 pt-4">
                        <div className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <button
                                    key={link.path}
                                    onClick={() => {
                                        navigate(link.path);
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`text-sm font-semibold py-2 px-4 rounded-lg text-left transition-colors ${link.active
                                        ? 'bg-blue-50 text-[#2563EB]'
                                        : 'text-slate-600 hover:bg-slate-100'
                                        }`}
                                >
                                    {link.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Footer */}
            <footer className="mt-auto border-t border-slate-200 bg-white py-4">
                <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-6 text-xs text-slate-600">
                        <button className="hover:text-[#2563EB] transition-colors">English (US)</button>
                        <button className="hover:text-[#2563EB] transition-colors">Accessibility</button>
                        <button className="hover:text-[#2563EB] transition-colors">Data Privacy & Consent</button>
                    </div>
                    <p className="text-xs text-slate-500">© 2024 Daira. HIPAA Compliant.</p>
                </div>
            </footer>
        </div>
    );
}
