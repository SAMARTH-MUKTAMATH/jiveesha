import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

// School Admin Components
import SchoolAdminLogin from './components/SchoolAdminLogin';
import SchoolAdminSignup from './components/SchoolAdminSignup';
import SchoolOverviewDashboard from './components/SchoolOverviewDashboard';
import TeachersDirectory from './components/TeachersDirectory';
import TeacherStudentList from './components/TeacherStudentList';
import BulkStudentImport from './components/BulkStudentImport';
import ScreeningAnalytics from './components/ScreeningAnalytics';
import ExceptionsEscalations from './components/ExceptionsEscalations';
import ConsentCompliance from './components/ConsentCompliance';
import ReportsSubmissions from './components/ReportsSubmissions';
import ProgramConfiguration from './components/ProgramConfiguration';
import SchoolSettings from './components/SchoolSettings';



// View types
import AppLayout from './components/AppLayout';

// Wrapper to provide navigation prop to Layout and Components
const AppContent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentUser, setCurrentUser] = useState<any>(null);

    // Auto-login from localStorage
    useEffect(() => {
        const token = localStorage.getItem('school_admin_token');
        const userStr = localStorage.getItem('school_admin_user');

        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                setCurrentUser(user);
                // Don't auto-redirect if we are already on a valid page (unless it's login)
                if (location.pathname === '/' || location.pathname === '/login') {
                    navigate('/dashboard');
                }
            } catch (e) {
                // Invalid user data
                localStorage.removeItem('school_admin_token');
                localStorage.removeItem('school_admin_user');
            }
        }
    }, []);

    const handleLogin = useCallback((user: any) => {
        setCurrentUser(user);
        navigate('/dashboard');
    }, [navigate]);

    const handleLogout = useCallback(() => {
        setCurrentUser(null);
        localStorage.removeItem('school_admin_token');
        localStorage.removeItem('school_admin_user');
        navigate('/login');
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Routes>
                <Route path="/login" element={
                    <SchoolAdminLogin
                        onLogin={handleLogin}
                        onSignup={() => navigate('/signup')}
                    />
                } />

                <Route path="/signup" element={
                    <SchoolAdminSignup
                        onBack={() => navigate('/login')}
                    />
                } />

                {/* Authenticated Routes Wrapped in Persistant Layout */}
                <Route element={<AppLayout onLogout={handleLogout} />}>
                    {/* Dashboard */}
                    <Route path="/dashboard" element={
                        <SchoolOverviewDashboard
                            onNavigateToTeachers={() => navigate('/teachers')}
                            onNavigateToAnalytics={() => navigate('/analytics')}
                            onNavigateToReports={() => navigate('/reports')}
                            onNavigateToSettings={() => navigate('/settings')}
                            onLogout={handleLogout}
                            user={currentUser}
                        />
                    } />

                    {/* Teachers */}
                    <Route path="/teachers" element={
                        <TeachersDirectory
                            onBack={() => navigate('/dashboard')}
                            onViewTeacher={(teacherId: string) => {
                                navigate('/teachers/students', { state: { teacherId } });
                            }}
                        />
                    } />

                    {/* Teacher's Student List */}
                    <Route path="/teachers/students" element={<TeacherStudentListWrapper />} />

                    {/* Bulk Import */}
                    <Route path="/students/import" element={
                        <BulkStudentImport
                            onBack={() => navigate('/dashboard')}
                            onComplete={() => navigate('/dashboard')}
                        />
                    } />

                    {/* Analytics */}
                    <Route path="/analytics" element={
                        <ScreeningAnalytics
                            onBack={() => navigate('/dashboard')}
                            onNavigateToReports={() => navigate('/reports')}
                            onBuildCustomReport={() => console.log('Build custom report')}
                            user={currentUser}
                        />
                    } />

                    {/* Reports */}
                    <Route path="/reports" element={
                        <ReportsSubmissions
                            onNavigateToConsent={() => navigate('/consent')}
                            user={currentUser}
                        />
                    } />

                    {/* Consent */}
                    <Route path="/consent" element={
                        <ConsentCompliance
                            onNavigateToReports={() => navigate('/reports')}
                            user={currentUser}
                        />
                    } />

                    {/* Settings */}
                    <Route path="/settings" element={
                        <SchoolSettings
                            onBack={() => navigate('/dashboard')}
                            onNavigateToConfig={() => navigate('/configuration')}
                            onNavigateToConsent={() => navigate('/consent')}
                            user={currentUser}
                        />
                    } />

                    {/* Config */}
                    <Route path="/configuration" element={
                        <ProgramConfiguration
                            onBack={() => navigate('/dashboard')}
                            onNavigateToConsent={() => navigate('/consent')}
                            onViewAuditLog={() => console.log('View audit log')}
                            user={currentUser}
                        />
                    } />

                    {/* Exceptions */}
                    <Route path="/exceptions" element={
                        <ExceptionsEscalations
                            onViewCase={(caseId: string) => console.log('View case:', caseId)}
                            user={currentUser}
                        />
                    } />
                </Route>

                {/* Redirect root to login */}
                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </div>
    );
};

// Wrapper for TeacherStudentList to inject ID from navigation state
function TeacherStudentListWrapper() {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as { teacherId: string } | null;
    const teacherId = state?.teacherId || '';

    return (
        <TeacherStudentList
            teacherId={teacherId}
            onBack={() => navigate('/teachers')}
        />
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
