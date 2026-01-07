import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Welcome from './pages/Welcome';
import AddChild from './pages/AddChild';
import Dashboard from './pages/Dashboard';
import ChildrenList from './pages/ChildrenList';
import ChildProfile from './pages/ChildProfile';
import EditChild from './pages/EditChild';
import ScreeningSelect from './pages/ScreeningSelect';
import ScreeningInProgress from './pages/ScreeningInProgress';
import ScreeningHistory from './pages/ScreeningHistory';
import ScreeningResults from './pages/ScreeningResults';
import ConsentManagement from './pages/ConsentManagement';
import ShareWithProfessional from './pages/ShareWithProfessional';
import ProfessionalReferrals from './pages/ProfessionalReferrals';
import EditConsentPermissions from './pages/EditConsentPermissions';
import PEPDashboard from './pages/PEPDashboard';
import PEPActivities from './pages/PEPActivities';
import ActivityDetails from './pages/ActivityDetails';
import PEPProgress from './pages/PEPProgress';
import ResourceLibrary from './pages/ResourceLibrary';
import Settings from './pages/Settings';
import JournalTimeline from './pages/JournalTimeline';
import ProtectedLayout from './components/ProtectedLayout';
import authService from './services/auth.service';
import { useEffect, useState } from 'react';

function App() {
  const [authReady, setAuthReady] = useState(false);

  // AUTO-LOGIN BYPASS FOR TESTING - Remove in production
  // AUTO-LOGIN BYPASS FOR TESTING - Remove in production
  useEffect(() => {
    // Only run if not already authenticated
    if (!authService.isAuthenticated()) {
      const mockToken = 'dev-token-parent';
      const mockUser = {
        id: 'a7eae539-a807-464e-b87b-9b6274bb8bc2',
        email: 'parent@test.com',
        role: 'parent',
        firstName: 'Test',
        lastName: 'Parent'
      };
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('userRole', 'parent');
    }
    setAuthReady(true);
  }, []);

  if (!authReady) {
    return <div className="flex items-center justify-center h-screen">Initializing Test Mode...</div>;
  }

  const isAuthenticated = authService.isAuthenticated();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
        />

        {/* Protected Routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/onboarding/add-child" element={<AddChild />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/children" element={<ChildrenList />} />
          <Route path="/children/:id" element={<ChildProfile />} />
          <Route path="/children/:id/edit" element={<EditChild />} />
          <Route path="/screening/select" element={<ScreeningSelect />} />
          <Route path="/screening/:id/start" element={<ScreeningInProgress />} />
          <Route path="/screening/history" element={<ScreeningHistory />} />
          <Route path="/screening/:id/results" element={<ScreeningResults />} />
          <Route path="/consent" element={<ConsentManagement />} />
          <Route path="/consent/share" element={<ShareWithProfessional />} />
          <Route path="/consent/:id/edit" element={<EditConsentPermissions />} />
          <Route path="/referrals" element={<ProfessionalReferrals />} />
          <Route path="/pep" element={<PEPDashboard />} />
          <Route path="/pep/:id/activities" element={<PEPActivities />} />
          <Route path="/pep/:pepId/activities/:activityId" element={<ActivityDetails />} />
          <Route path="/pep/:id/progress" element={<PEPProgress />} />
          <Route path="/resources" element={<ResourceLibrary />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/journal" element={<JournalTimeline />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
