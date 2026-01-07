import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import TeacherLogin from './components/TeacherLogin';
import TeacherDashboard from './components/TeacherDashboard';
import MyStudentsList from './components/MyStudentsList';
import StudentProfile from './components/StudentProfile';
import Phase1Checklist from './components/Phase1Checklist';
import Phase1BasicObservation from './components/Phase1BasicObservation';
import Phase2GazeTracking from './components/Phase2GazeTracking';
import Phase2Handwriting from './components/Phase2Handwriting';
import Phase2MultiModal from './components/Phase2MultiModal';
import Phase2Speech from './components/Phase2Speech';
import Phase3ASMA from './components/Phase3ASMA';
import Phase3SLD from './components/Phase3SLD';
import Phase3ADHD from './components/Phase3ADHD';
import Phase4Games from './components/Phase4Games';
import TeacherSettings from './components/TeacherSettings';
import AddStudent from './components/AddStudent';
import ScreeningResults from './components/ScreeningResults';
import PEPPlan from './components/PEPPlan';
import AppLayout from './components/AppLayout';

import React from 'react';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.JSX.Element }) => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Wrappers to adapt useParams to component props
const StudentProfileWrapper = ({ onNavigate }: { onNavigate: (v: string, d?: any) => void }) => {
  const { studentId } = useParams();
  if (!studentId) return <Navigate to="/dashboard" />;
  return <StudentProfile studentId={studentId} onNavigate={onNavigate} />;
};

const Phase1ChecklistWrapper = ({ onNavigate }: { onNavigate: (v: string, d?: any) => void }) => {
  const { studentId } = useParams();
  if (!studentId) return <Navigate to="/dashboard" />;
  return <Phase1Checklist onNavigate={onNavigate} studentId={studentId} />;
};

const Phase1BasicObservationWrapper = ({ onNavigate }: { onNavigate: (v: string, d?: any) => void }) => {
  const { studentId } = useParams();
  if (!studentId) return <Navigate to="/dashboard" />;
  // @ts-ignore
  return <Phase1BasicObservation onNavigate={onNavigate} studentId={studentId} />;
};

const ScreeningResultsWrapper = ({ onNavigate }: { onNavigate: (v: string, d?: any) => void }) => {
  const { studentId } = useParams();
  if (!studentId) return <Navigate to="/dashboard" />;
  return <ScreeningResults studentId={studentId} onNavigate={onNavigate} />;
};

const PEPPlanWrapper = ({ onNavigate }: { onNavigate: (v: string, d?: any) => void }) => {
  const { studentId } = useParams();
  if (!studentId) return <Navigate to="/dashboard" />;
  return <PEPPlan studentId={studentId} onNavigate={onNavigate} />;
};

const Phase2GazeTrackingWrapper = ({ onNavigate }: { onNavigate: (v: string, d?: any) => void }) => {
  const { studentId } = useParams();
  if (!studentId) return <Navigate to="/dashboard" />;
  // @ts-ignore
  return <Phase2GazeTracking onNavigate={onNavigate} studentId={studentId} />;
};

const Phase2HandwritingWrapper = ({ onNavigate }: { onNavigate: (v: string, d?: any) => void }) => {
  const { studentId } = useParams();
  if (!studentId) return <Navigate to="/dashboard" />;
  // @ts-ignore
  return <Phase2Handwriting onNavigate={onNavigate} studentId={studentId} />;
};

const Phase2MultiModalWrapper = ({ onNavigate }: { onNavigate: (v: string, d?: any) => void }) => {
  const { studentId } = useParams();
  if (!studentId) return <Navigate to="/dashboard" />;
  // @ts-ignore
  return <Phase2MultiModal onNavigate={onNavigate} studentId={studentId} />;
};

const Phase2SpeechWrapper = ({ onNavigate }: { onNavigate: (v: string, d?: any) => void }) => {
  const { studentId } = useParams();
  if (!studentId) return <Navigate to="/dashboard" />;
  // @ts-ignore
  return <Phase2Speech onNavigate={onNavigate} studentId={studentId} />;
};

const Phase3ASMAWrapper = ({ onNavigate }: { onNavigate: (v: string, d?: any) => void }) => {
  const { studentId } = useParams();
  if (!studentId) return <Navigate to="/dashboard" />;
  // @ts-ignore
  return <Phase3ASMA onNavigate={onNavigate} studentId={studentId} />;
};

const Phase3SLDWrapper = ({ onNavigate }: { onNavigate: (v: string, d?: any) => void }) => {
  const { studentId } = useParams();
  if (!studentId) return <Navigate to="/dashboard" />;
  // @ts-ignore
  return <Phase3SLD onNavigate={onNavigate} studentId={studentId} />;
};

const Phase3ADHDWrapper = ({ onNavigate }: { onNavigate: (v: string, d?: any) => void }) => {
  const { studentId } = useParams();
  if (!studentId) return <Navigate to="/dashboard" />;
  // @ts-ignore
  return <Phase3ADHD onNavigate={onNavigate} studentId={studentId} />;
};

const Phase4GamesWrapper = ({ onNavigate }: { onNavigate: (v: string, d?: any) => void }) => {
  const { studentId } = useParams();
  if (!studentId) return <Navigate to="/dashboard" />;
  // @ts-ignore
  return <Phase4Games onNavigate={onNavigate} studentId={studentId} />;
};

// AppRoutes component content
function AppRoutes() {
  const navigate = useNavigate();

  // Navigation handler to pass to components
  const handleNavigate = (view: string, data?: any) => {
    switch (view) {
      case 'screening-results':
        navigate(`/screening-results/${data.studentId}`);
        break;
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'my-students':
        navigate(data?.filter ? `/my-students?filter=${data.filter}` : '/my-students');
        break;
      case 'student-profile':
        navigate(`/student/${data?.studentId}`);
        break;
      case 'screening-flow':
        // Handle explicit phase navigation
        if (data?.phase === 1) {
          navigate(`/screening/${data?.studentId}/phase/1/checklist`);
        } else if (data?.phase === 2) {
          navigate(`/screening/${data?.studentId}/phase/2/multi-modal`);
        } else if (data?.phase === 3) {
          navigate(`/screening/${data?.studentId}/phase/3/asma`); // Defaulting to ASMA for phase 3 start
        } else if (data?.phase === 4) {
          navigate(`/screening/${data?.studentId}/phase/4/games`);
        } else {
          navigate(`/screening/${data?.studentId}/phase/1/checklist`);
        }
        break;
      case 'view-pep':
        navigate(`/student/${data?.studentId}/pep`);
        break;
      // Explicit routes for specific tools if needed by components
      case 'phase1-checklist': navigate(`/screening/${data?.studentId}/phase/1/checklist`); break;
      case 'phase1-observation': navigate(`/screening/${data?.studentId}/phase/1/observation`); break;
      case 'phase2-gaze': navigate(`/screening/${data?.studentId}/phase/2/gaze`); break;
      case 'phase2-handwriting': navigate(`/screening/${data?.studentId}/phase/2/handwriting`); break;
      case 'phase2-speech': navigate(`/screening/${data?.studentId}/phase/2/speech`); break;
      case 'phase3-asma': navigate(`/screening/${data?.studentId}/phase/3/asma`); break;
      case 'phase3-sld': navigate(`/screening/${data?.studentId}/phase/3/sld`); break;
      case 'phase3-adhd': navigate(`/screening/${data?.studentId}/phase/3/adhd`); break;
      case 'phase4-games': navigate(`/screening/${data?.studentId}/phase/4/games`); break;

      case 'teacher-login':
      case 'login':
        navigate('/login');
        break;
      case 'forgot-password':
        navigate('/forgot-password');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'add-student':
        navigate('/add-student');
        break;
      default:
        console.warn(`Unknown view: ${view}`);
        navigate('/dashboard');
    }
  };

  const onLoginSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <Routes>
      <Route path="/login" element={<TeacherLogin onLoginSuccess={onLoginSuccess} onNavigate={handleNavigate} />} />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Authenticated Layout Routes */}
      <Route element={
        <ProtectedRoute>
          <AppLayout onNavigate={handleNavigate} />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<TeacherDashboard onNavigate={handleNavigate} />} />

        <Route path="/my-students" element={<MyStudentsList onNavigate={handleNavigate} />} />

        <Route path="/student/:studentId" element={<StudentProfileWrapper onNavigate={handleNavigate} />} />

        {/* Phase 1 */}
        <Route path="/screening/:studentId/phase/1/checklist" element={<Phase1ChecklistWrapper onNavigate={handleNavigate} />} />
        <Route path="/screening/:studentId/phase/1/observation" element={<Phase1BasicObservationWrapper onNavigate={handleNavigate} />} />

        {/* Phase 2 */}
        <Route path="/screening/:studentId/phase/2/gaze" element={<Phase2GazeTrackingWrapper onNavigate={handleNavigate} />} />
        <Route path="/screening/:studentId/phase/2/handwriting" element={<Phase2HandwritingWrapper onNavigate={handleNavigate} />} />
        <Route path="/screening/:studentId/phase/2/multi-modal" element={<Phase2MultiModalWrapper onNavigate={handleNavigate} />} />
        <Route path="/screening/:studentId/phase/2/speech" element={<Phase2SpeechWrapper onNavigate={handleNavigate} />} />

        {/* Phase 3 */}
        <Route path="/screening/:studentId/phase/3/asma" element={<Phase3ASMAWrapper onNavigate={handleNavigate} />} />
        <Route path="/screening/:studentId/phase/3/sld" element={<Phase3SLDWrapper onNavigate={handleNavigate} />} />
        <Route path="/screening/:studentId/phase/3/adhd" element={<Phase3ADHDWrapper onNavigate={handleNavigate} />} />

        {/* Phase 4 */}
        <Route path="/screening/:studentId/phase/4/games" element={<Phase4GamesWrapper onNavigate={handleNavigate} />} />

        <Route path="/screening-results/:studentId" element={<ScreeningResultsWrapper onNavigate={handleNavigate} />} />
        <Route path="/student/:studentId/pep" element={<PEPPlanWrapper onNavigate={handleNavigate} />} />

        <Route path="/settings" element={<TeacherSettings onNavigate={handleNavigate} />} />
        <Route path="/add-student" element={<AddStudent onNavigate={handleNavigate} />} />
      </Route>

      {/* Route for generic screening flow */}
      <Route path="/screening/:studentId/phase/:phase" element={
        <Navigate to="/screening/:studentId/phase/:phase/checklist" />
      } />

    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
