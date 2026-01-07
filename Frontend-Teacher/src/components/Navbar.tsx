import React, { useState } from 'react';
import logo from '@common/logo.png';
import { motion } from 'framer-motion';

interface NavbarProps {
    teacherName: string;
    teacherAssignment: string;
    schoolName: string;
    onNavigate: (view: string, data?: any) => void;
    activeView?: string;
}

const NavItem = ({ view, icon, label, active, filter, isMobile = false, onNavigate, setIsMobileMenuOpen }: any) => (
    <button
        onClick={() => {
            onNavigate(view, filter ? { filter } : undefined);
            if (isMobile) {
                setTimeout(() => setIsMobileMenuOpen(false), 450); // Delay closing to show transition
            }
        }}
        className={`
            relative px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-2 z-10
            ${isMobile ? 'w-full justify-start py-3 rounded-lg' : 'rounded-full'}
            ${active
                ? 'text-blue-600' // Active text color
                : 'text-slate-600 hover:text-blue-600'
            }
        `}
    >
        {active && (
            <motion.div
                layoutId={isMobile ? "navbar-indicator-mobile" : "navbar-indicator"}
                className={`absolute inset-0 shadow-sm border border-slate-200/50 ${isMobile ? 'rounded-lg bg-slate-100' : 'rounded-full bg-white'}`}
                style={{ zIndex: -1 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
        )}

        {icon && (
            <span className={`material-symbols-outlined text-[20px] relative z-10 ${active ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}`}>
                {icon}
            </span>
        )}
        <span className="relative z-10">{label}</span>
    </button>
);

const Navbar: React.FC<NavbarProps> = ({
    teacherName,
    teacherAssignment,
    schoolName,
    onNavigate,
    activeView
}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const initials = teacherName ? teacherName.split(' ').map(n => n[0]).join('').toUpperCase() : 'T';

    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Logo Section */}
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('dashboard')}>
                        <img src={logo} alt="Daira Logo" className="h-12 w-auto" />
                        <div className="flex flex-col">
                            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mt-0.5 group-hover:text-blue-700 transition-colors">Teacher Portal</span>
                        </div>
                    </div>

                    {/* Desktop Navigation with Framer Motion */}
                    <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2 bg-slate-100/50 p-1.5 rounded-full border border-slate-200/60 backdrop-blur-sm">
                        <NavItem view="dashboard" label="Dashboard" active={activeView === 'dashboard'} onNavigate={onNavigate} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                        <NavItem view="my-students" label="My Students" active={activeView === 'my-students' || activeView === 'student-profile'} onNavigate={onNavigate} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                        <NavItem view="my-students" filter="completed" label="Results" active={activeView === 'results'} onNavigate={onNavigate} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                        <NavItem view="my-students" filter="pep" label="Reports" active={activeView === 'reports'} onNavigate={onNavigate} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                    </nav>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        >
                            <span className="material-symbols-outlined text-2xl">
                                {isMobileMenuOpen ? 'close' : 'menu'}
                            </span>
                        </button>

                        {/* Profile Info (Desktop) */}
                        <div className="hidden md:flex flex-col items-end mr-1">
                            <div className="text-sm font-bold text-slate-900">{teacherName}</div>
                            <div className="text-xs text-slate-500 font-medium">{teacherAssignment}</div>
                        </div>

                        {/* Actions Icons */}
                        <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-slate-200">
                            <button className="size-9 rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center relative">
                                <span className="material-symbols-outlined text-[22px]">notifications</span>
                                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>

                            <button onClick={() => onNavigate('settings')} className={`size-9 rounded-full transition-colors flex items-center justify-center ${activeView === 'settings' ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'}`}>
                                <span className="material-symbols-outlined text-[22px]">settings</span>
                            </button>

                            {/* Avatar */}
                            <div className="group relative ml-2">
                                <button className="size-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-slate-900/20 hover:ring-2 hover:ring-offset-2 hover:ring-slate-900 transition-all">
                                    {initials}
                                </button>
                                {/* Dropdown */}
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50">
                                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                                        <p className="text-xs text-slate-500">Signed in as</p>
                                        <p className="text-sm font-bold text-slate-900 truncate">{teacherName}</p>
                                    </div>
                                    <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">logout</span>
                                        Log Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-[81px] left-0 w-full bg-white border-b border-slate-100 shadow-xl py-4 px-4 flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200">
                    <NavItem isMobile view="dashboard" label="Dashboard" icon="dashboard" active={activeView === 'dashboard'} onNavigate={onNavigate} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                    <NavItem isMobile view="my-students" label="My Students" icon="groups" active={activeView === 'my-students' || activeView === 'student-profile'} onNavigate={onNavigate} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                    <NavItem isMobile view="my-students" filter="completed" label="Results" icon="analytics" active={activeView === 'results'} onNavigate={onNavigate} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                    <NavItem isMobile view="my-students" filter="pep" label="Reports" icon="assignment" active={activeView === 'reports'} onNavigate={onNavigate} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                    <div className="h-px bg-slate-100 my-2"></div>
                    <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                        <div className="size-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold">
                            {initials}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900">{teacherName}</span>
                            <span className="text-xs text-slate-500">{teacherAssignment}</span>
                        </div>
                    </div>
                    <button onClick={() => onNavigate('settings')} className="w-full text-left px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-3 font-medium">
                        <span className="material-symbols-outlined">settings</span> Settings
                    </button>
                    <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-3 font-medium">
                        <span className="material-symbols-outlined">logout</span> Log Out
                    </button>
                </div>
            )}
        </header>
    );
};

export default Navbar;
