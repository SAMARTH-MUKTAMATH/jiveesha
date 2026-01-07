import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import { View } from '../types';

const AppLayout = ({ onLogout }: { onLogout: () => void }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const userStr = localStorage.getItem('school_admin_user');
    const user = userStr ? JSON.parse(userStr) : null;

    // Helper to determine active view based on path
    const getCurrentView = (pathname: string): View => {
        if (pathname.includes('/dashboard')) return 'school-overview-dashboard';
        if (pathname.includes('/teachers')) {
            if (pathname.includes('/students')) return 'teacher-student-list';
            return 'teachers-directory';
        }
        if (pathname.includes('/students/import')) return 'bulk-student-import';
        if (pathname.includes('/analytics')) return 'screening-analytics';
        // if (pathname.includes('/exceptions')) return 'exceptions-escalations'; // Merged into analytics visual
        if (pathname.includes('/reports')) return 'reports-submissions';
        if (pathname.includes('/consent')) return 'consent-compliance';
        if (pathname.includes('/settings')) return 'school-settings';
        if (pathname.includes('/configuration')) return 'program-configuration';

        return 'school-overview-dashboard';
    };

    const currentView = getCurrentView(location.pathname);

    return (
        <div className="bg-gradient-to-b from-blue-50/50 to-white dark:bg-background-dark font-display text-[#111318] dark:text-white transition-colors duration-200 min-h-screen flex flex-col">
            <Header
                currentView={currentView}
                onNavigate={(view) => {
                    switch (view) {
                        case 'school-overview-dashboard': navigate('/dashboard'); break;
                        case 'teachers-directory': navigate('/teachers'); break;
                        case 'teacher-student-list': navigate('/teachers/students'); break;
                        case 'bulk-student-import': navigate('/students/import'); break;
                        case 'screening-analytics': navigate('/analytics'); break;
                        case 'exceptions-escalations': navigate('/exceptions'); break;
                        case 'consent-compliance': navigate('/consent'); break;
                        case 'reports-submissions': navigate('/reports'); break;
                        case 'program-configuration': navigate('/configuration'); break;
                        case 'school-settings': navigate('/settings'); break;
                        default: navigate('/dashboard');
                    }
                }}
                onLogout={onLogout}
                user={user}
            />
            <main className="layout-container flex flex-col w-full max-w-[1440px] mx-auto px-4 lg:px-10 py-8 grow">
                <Outlet />
            </main>
        </div>
    );
};

export default AppLayout;
