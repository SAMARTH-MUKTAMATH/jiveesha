import React, { useState } from 'react';
import logo from '@common/logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Menu, X, LogOut, Settings, User, BookOpen } from 'lucide-react';
import authService from '../services/auth.service';

import { motion, LayoutGroup } from 'framer-motion';

const NavItem = ({ path, label, active, isMobile = false, onNavigate, setMobileMenuOpen }: any) => (
    <button
        onClick={() => {
            onNavigate(path);
            if (isMobile) {
                setTimeout(() => setMobileMenuOpen(false), 450);
            }
        }}
        className={`
            relative px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-2 z-10
            ${isMobile ? 'w-full justify-start py-3 rounded-lg' : 'rounded-full'}
            ${active
                ? 'text-[#2563EB]'
                : 'text-slate-600 hover:text-[#2563EB]'
            }
        `}
    >
        {active && (
            <motion.div
                layoutId={isMobile ? "navbar-indicator-mobile" : "navbar-indicator"}
                className={`absolute inset-0 shadow-sm border border-blue-100/50 ${isMobile ? 'rounded-lg bg-blue-50' : 'rounded-full bg-slate-50 shadow-blue-100'}`}
                style={{ zIndex: -1 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
        )}
        <span className="relative z-10">{label}</span>
    </button>
);

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const user = authService.getCurrentUser();

    const navLinks = [
        { label: 'Dashboard', path: '/dashboard', active: location.pathname === '/dashboard' },
        { label: 'My Children', path: '/children', active: location.pathname.startsWith('/children') },
        { label: 'Screening', path: '/screening/select', active: location.pathname.startsWith('/screening') && !location.pathname.includes('history') && !location.pathname.includes('results') },
        { label: 'Results', path: '/screening/history', active: location.pathname.includes('/screening/history') || location.pathname.includes('/results') },
        { label: 'PEP Builder', path: '/pep', active: location.pathname.startsWith('/pep') },
        { label: 'Resources', path: '/resources', active: location.pathname.startsWith('/resources') },
        { label: 'Access & Consent', path: '/consent', active: location.pathname.startsWith('/consent') },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white flex flex-col">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div className="flex items-center gap-3 cursor-pointer group pr-6" onClick={() => navigate('/dashboard')}>
                            <img src={logo} alt="Daira Logo" className="h-12 w-auto" />
                            <div className="flex flex-col">
                                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mt-0.5 group-hover:text-[#2563EB] transition-colors">Parent Portal</span>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1 justify-center flex-1 bg-slate-100/50 p-1.5 rounded-full border border-slate-200/60 backdrop-blur-sm mx-4">
                            <LayoutGroup>
                                {navLinks.map((link) => (
                                    <NavItem
                                        key={link.path}
                                        path={link.path}
                                        label={link.label}
                                        active={link.active}
                                        onNavigate={navigate}
                                        setMobileMenuOpen={setMobileMenuOpen}
                                    />
                                ))}
                            </LayoutGroup>
                        </nav>

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
                        <div className="lg:hidden absolute top-[81px] left-0 w-full bg-white border-b border-slate-100 shadow-xl py-4 px-4 flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200">
                            {navLinks.map((link) => (
                                <NavItem
                                    key={link.path}
                                    isMobile
                                    path={link.path}
                                    label={link.label}
                                    active={link.active}
                                    onNavigate={navigate}
                                    setMobileMenuOpen={setMobileMenuOpen}
                                />
                            ))}
                        </div>
                    )}
                </div>
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
