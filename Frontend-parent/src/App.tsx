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
import authService from './services/auth.service';
import { useEffect, useState } from 'react';

function App() {
  const [authReady, setAuthReady] = useState(false);

  // AUTO-LOGIN BYPASS FOR TESTING - Remove in production
  useEffect(() => {
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhN2VhZTUzOS1hODA3LTQ2NGUtYjg3Yi05YjYyNzRiYjhiYzIiLCJyb2xlIjoicGFyZW50IiwicGFyZW50SWQiOiJjNTc3ZTlkNy01ODM3LTQ4MjAtOTM4MC00ZTFmMjZkOGMzZTgiLCJpYXQiOjE3Njc1OTQxNjMsImV4cCI6MTc2ODE5ODk2M30.ehLYsbtvZDTMiXJR4KF4o5ScejpMMtb3bcm_3mmoOTw';
    const mockUser = {
      id: 'a7eae539-a807-464e-b87b-9b6274bb8bc2',
      email: 'parent@test.com',
      role: 'parent',
      firstName: 'Test',
      lastName: 'Parent'
    };
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    setAuthReady(true);
  }, []);

  const isAuthenticated = authService.isAuthenticated();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/welcome"
          element={isAuthenticated ? <Welcome /> : <Navigate to="/login" />}
        />
        <Route
          path="/onboarding/add-child"
          element={isAuthenticated ? <AddChild /> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/children"
          element={isAuthenticated ? <ChildrenList /> : <Navigate to="/login" />}
        />
        <Route
          path="/children/:id"
          element={isAuthenticated ? <ChildProfile /> : <Navigate to="/login" />}
        />
        <Route
          path="/children/:id/edit"
          element={isAuthenticated ? <EditChild /> : <Navigate to="/login" />}
        />
        <Route
          path="/screening/select"
          element={isAuthenticated ? <ScreeningSelect /> : <Navigate to="/login" />}
        />
        <Route
          path="/screening/:id/start"
          element={isAuthenticated ? <ScreeningInProgress /> : <Navigate to="/login" />}
        />
        <Route
          path="/screening/history"
          element={isAuthenticated ? <ScreeningHistory /> : <Navigate to="/login" />}
        />
        <Route
          path="/screening/:id/results"
          element={isAuthenticated ? <ScreeningResults /> : <Navigate to="/login" />}
        />
        <Route
          path="/consent"
          element={isAuthenticated ? <ConsentManagement /> : <Navigate to="/login" />}
        />
        <Route
          path="/consent/share"
          element={isAuthenticated ? <ShareWithProfessional /> : <Navigate to="/login" />}
        />
        <Route
          path="/consent/:id/edit"
          element={isAuthenticated ? <EditConsentPermissions /> : <Navigate to="/login" />}
        />
        <Route
          path="/referrals"
          element={isAuthenticated ? <ProfessionalReferrals /> : <Navigate to="/login" />}
        />
        <Route
          path="/pep"
          element={isAuthenticated ? <PEPDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/pep/:id/activities"
          element={isAuthenticated ? <PEPActivities /> : <Navigate to="/login" />}
        />
        <Route
          path="/pep/:pepId/activities/:activityId"
          element={isAuthenticated ? <ActivityDetails /> : <Navigate to="/login" />}
        />
        <Route
          path="/pep/:id/progress"
          element={isAuthenticated ? <PEPProgress /> : <Navigate to="/login" />}
        />
        <Route
          path="/resources"
          element={isAuthenticated ? <ResourceLibrary /> : <Navigate to="/login" />}
        />
        <Route
          path="/settings"
          element={isAuthenticated ? <Settings /> : <Navigate to="/login" />}
        />
        <Route
          path="/journal"
          element={isAuthenticated ? <JournalTimeline /> : <Navigate to="/login" />}
        />

        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
