import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

interface AppLayoutProps {
    onNavigate: (view: string, data?: any) => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ onNavigate }) => {
    const location = useLocation();
    const [teacherData, setTeacherData] = useState<any>(null);
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

    // Determine active view from location
    const getActiveView = () => {
        const path = location.pathname;
        const params = new URLSearchParams(location.search);
        const filter = params.get('filter');

        if (path.includes('dashboard')) return 'dashboard';
        if (path.includes('student') && !path.includes('my-students') && !path.includes('add-student')) return 'student-profile';
        if (path.includes('screening-results')) return 'results'; // Or handle nested navigation active states
        if (path.includes('settings')) return 'settings';

        if (path.includes('my-students')) {
            if (filter === 'completed') return 'results';
            if (filter === 'pep') return 'reports';
            return 'my-students';
        }

        return 'dashboard';
    };

    const activeView = getActiveView();

    // Fetch minimal teacher data for Navbar if not available
    // We can use the profile endpoint or similar. For now using the dashboard endpoint as it's known.
    useEffect(() => {
        const fetchTeacherProfile = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                // Using dashboard endpoint to get teacher info - usually lightweight enough 
                // In production, should probably have a dedicated /me or /profile endpoint
                const response = await fetch(`${API_BASE_URL}/teacher/dashboard`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setTeacherData(data.teacher);
                }
            } catch (error) {
                console.error("Failed to fetch teacher profile for Navbar", error);
            }
        };

        fetchTeacherProfile();
    }, []);

    return (
        <div className="bg-slate-50 min-h-screen font-display">
            <Navbar
                teacherName={teacherData?.name || 'Teacher'}
                teacherAssignment={teacherData?.assignment || ''}
                schoolName={teacherData?.school?.name || ''}
                onNavigate={onNavigate}
                activeView={activeView}
            />
            <Outlet />
        </div>
    );
};

export default AppLayout;
