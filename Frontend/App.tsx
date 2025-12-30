
import React, { useState } from 'react';
import Header from './components/Header';
import Stepper from './components/Stepper';
import SignupForm from './components/SignupForm';
import VerificationStep from './components/VerificationStep';
import CredentialsRCI from './components/CredentialsRCI';
import CredentialsNMC from './components/CredentialsNMC';
import VerificationPending from './components/VerificationPending';
import VerificationApproved from './components/VerificationApproved';
import LoginPage from './components/LoginPage';
import WelcomeView from './components/WelcomeView';
import Dashboard from './components/Dashboard';
import CredentialsManagement from './components/CredentialsManagement';
import PatientRegistry from './components/PatientRegistry';
import PatientProfile from './components/PatientProfile';
import ConsentCenter from './components/ConsentCenter';
import DiagnosticSuite from './components/DiagnosticSuite';
import AssessmentISAA from './components/AssessmentISAA';
import AssessmentASDDeepDive from './components/AssessmentASDDeepDive';
import AssessmentADHD from './components/AssessmentADHD';
import AssessmentGLAD from './components/AssessmentGLAD';
import AssessmentResultsISAA from './components/AssessmentResultsISAA';
import IEPBuilder from './components/IEPBuilder';
import InterventionsDashboard from './components/InterventionsDashboard';
import InterventionPlanDetail from './components/InterventionPlanDetail';
import ReportGenerator from './components/ReportGenerator';
import ReportsLibrary from './components/ReportsLibrary';
import ReportViewer from './components/ReportViewer';
import IEPView from './components/IEPView';
import PatientJournal from './components/PatientJournal';
import MessagesCenter from './components/MessagesCenter';
import CaseTriage from './components/CaseTriage';
import ConsultationManager from './components/ConsultationManager';
import SettingsProfile from './components/SettingsProfile';
import HelpCenter from './components/HelpCenter';
import GlobalSearch from './components/GlobalSearch';
import NotificationCenter from './components/NotificationCenter';
import ScheduleCalendar from './components/ScheduleCalendar';
import AppointmentBooking from './components/AppointmentBooking';
import AppointmentReschedule from './components/AppointmentReschedule';
import PatientOnboarding from './components/PatientOnboarding';
import PatientDischarge from './components/PatientDischarge';
import ComponentDemo from './components/ComponentDemo';
import Footer from './components/Footer';

const App: React.FC = () => {
  // views: 'welcome', 'login', 'signup', 'dashboard', 'credentials', 'registry', 'profile', 'consent', 'diagnostics', 'assessment-isaa', 'assessment-asd-deep', 'assessment-adhd', 'assessment-glad', 'assessment-results-isaa', 'iep-builder', 'iep-view', 'interventions', 'intervention-detail', 'report-generator', 'reports-library', 'report-viewer', 'patient-journal', 'messages', 'case-triage', 'consultation-manager', 'settings', 'help', 'search', 'schedule', 'patient-onboarding', 'patient-discharge', 'appointment-booking', 'appointment-reschedule', 'component-demo'
  const [view, setView] = useState<'welcome' | 'login' | 'signup' | 'dashboard' | 'credentials' | 'registry' | 'profile' | 'consent' | 'diagnostics' | 'assessment-isaa' | 'assessment-asd-deep' | 'assessment-adhd' | 'assessment-glad' | 'assessment-results-isaa' | 'iep-builder' | 'iep-view' | 'interventions' | 'intervention-detail' | 'report-generator' | 'reports-library' | 'report-viewer' | 'patient-journal' | 'messages' | 'case-triage' | 'consultation-manager' | 'settings' | 'help' | 'search' | 'schedule' | 'patient-onboarding' | 'patient-discharge' | 'appointment-booking' | 'appointment-reschedule' | 'component-demo'>('welcome');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [licenseType, setLicenseType] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleNext = (type?: string) => {
    if (type) setLicenseType(type);
    
    if (step === 2.1) {
      setStep(2.2);
    } else if (step === 2.2) {
      setStep(3);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step === 2.2) {
      setStep(2.1);
    } else if (step === 1) {
      setView('welcome');
    } else {
      setStep((prev) => Math.max(prev - 1, 1));
    }
  };

  const startSignup = () => {
    setView('signup');
    setStep(1);
  };

  const startLogin = () => {
    setView('login');
  };

  const navigateToProfile = (id: string) => {
    setSelectedPatientId(id);
    setView('profile');
  };

  const handleGlobalNavigate = (targetView: string, id?: string) => {
    setShowNotifications(false);
    if (id && targetView === 'profile') {
      setSelectedPatientId(id);
    }
    // Type assertion to allow string navigation
    setView(targetView as any);
  };

  const renderView = () => {
    if (view === 'welcome') {
      return <WelcomeView onLogin={startLogin} onSignup={startSignup} />;
    }
    
    if (view === 'login') {
      return <LoginPage onBack={() => setView('welcome')} onLoginSuccess={() => setView('dashboard')} />;
    }

    if (view === 'dashboard') {
      return (
        <Dashboard 
          onManageCredentials={() => setView('credentials')} 
          onPatientClick={navigateToProfile}
          onMessagesClick={() => setView('messages')}
          onTriageClick={() => setView('case-triage')}
          onScheduleClick={() => setView('schedule')}
          onNewPatient={() => setView('patient-onboarding')}
        />
      );
    }

    if (view === 'credentials') {
      return <CredentialsManagement onBack={() => setView('dashboard')} />;
    }

    if (view === 'registry') {
      return <PatientRegistry onPatientClick={navigateToProfile} onNewPatient={() => setView('patient-onboarding')} />;
    }

    if (view === 'patient-onboarding') {
      return <PatientOnboarding onBack={() => setView('registry')} onFinish={(id) => navigateToProfile(id)} />;
    }

    if (view === 'profile') {
      return (
        <PatientProfile 
          onBack={() => setView('registry')} 
          patientId={selectedPatientId} 
          onViewJournal={() => setView('patient-journal')}
          onViewMessages={() => setView('messages')}
          onViewConsultations={() => setView('consultation-manager')}
          onDischarge={() => setView('patient-discharge')}
        />
      );
    }

    if (view === 'patient-discharge') {
      return <PatientDischarge onBack={() => setView('profile')} onFinish={() => setView('registry')} />;
    }

    if (view === 'consent') {
      return <ConsentCenter onBack={() => setView('dashboard')} />;
    }

    if (view === 'diagnostics') {
      return <DiagnosticSuite 
        onBack={() => setView('dashboard')} 
        onStartAssessment={(id) => {
          if (id === 'isaa') setView('assessment-isaa');
          if (id === 'asd-deep') setView('assessment-asd-deep');
          if (id === 'adhd') setView('assessment-adhd');
          if (id === 'glad') setView('assessment-glad');
        }}
        onViewResults={() => setView('assessment-results-isaa')}
      />;
    }

    if (view === 'assessment-isaa') {
      return <AssessmentISAA onExit={() => setView('diagnostics')} />;
    }

    if (view === 'assessment-asd-deep') {
      return <AssessmentASDDeepDive onExit={() => setView('diagnostics')} />;
    }

    if (view === 'assessment-adhd') {
      return <AssessmentADHD onExit={() => setView('diagnostics')} />;
    }

    if (view === 'assessment-glad') {
      return <AssessmentGLAD onExit={() => setView('diagnostics')} />;
    }

    if (view === 'assessment-results-isaa') {
      return (
        <AssessmentResultsISAA 
          onBack={() => setView('diagnostics')} 
          onGenerateReport={() => setView('report-generator')}
          onCreateIEP={() => setView('iep-builder')}
        />
      );
    }

    if (view === 'interventions') {
      return (
        <InterventionsDashboard 
          onStartIEP={() => setView('iep-builder')} 
          onViewPlan={() => setView('intervention-detail')}
          onViewReports={() => setView('reports-library')}
        />
      );
    }

    if (view === 'intervention-detail') {
      return (
        <InterventionPlanDetail 
          onBack={() => setView('interventions')} 
          onGenerateReport={() => setView('report-generator')} 
        />
      );
    }

    if (view === 'iep-builder') {
      return <IEPBuilder onBack={() => setView('interventions')} onFinish={() => setView('iep-view')} />;
    }

    if (view === 'iep-view') {
      return <IEPView onBack={() => setView('profile')} onNavigateToIntervention={() => setView('interventions')} />;
    }

    if (view === 'report-generator') {
      return <ReportGenerator onBack={() => setView('profile')} onFinish={() => setView('reports-library')} />;
    }

    if (view === 'reports-library') {
      return <ReportsLibrary onBack={() => setView('dashboard')} onGenerateNew={() => setView('report-generator')} onViewReport={() => setView('report-viewer')} />;
    }

    if (view === 'report-viewer') {
      return <ReportViewer onBack={() => setView('reports-library')} onNavigateToPatient={navigateToProfile} />;
    }

    if (view === 'patient-journal') {
      return <PatientJournal onBack={() => setView('profile')} />;
    }

    if (view === 'messages') {
      return <MessagesCenter onBack={() => setView('dashboard')} />;
    }

    if (view === 'case-triage') {
      return <CaseTriage onBack={() => setView('dashboard')} />;
    }

    if (view === 'consultation-manager') {
      return <ConsultationManager onBack={() => setView('profile')} />;
    }

    if (view === 'settings') {
      return <SettingsProfile onBack={() => setView('dashboard')} />;
    }

    if (view === 'help') {
      return <HelpCenter onBack={() => setView('dashboard')} />;
    }

    if (view === 'search') {
      return <GlobalSearch onBack={() => setView('dashboard')} onNavigate={handleGlobalNavigate} />;
    }

    if (view === 'schedule') {
      return <ScheduleCalendar onBack={() => setView('dashboard')} onNavigate={handleGlobalNavigate} />;
    }

    if (view === 'appointment-booking') {
      return <AppointmentBooking onBack={() => setView('schedule')} onNavigate={handleGlobalNavigate} preSelectedPatientId={selectedPatientId} />;
    }

    if (view === 'appointment-reschedule') {
      return <AppointmentReschedule onBack={() => setView('schedule')} onNavigate={handleGlobalNavigate} />;
    }

    if (view === 'component-demo') {
      return <ComponentDemo onBack={() => setView('dashboard')} />;
    }

    // Signup flow
    switch (step) {
      case 1:
        return <SignupForm onNext={() => setStep(2.1)} />;
      case 2.1:
        return <VerificationStep onNext={handleNext} onBack={handleBack} />;
      case 2.2:
        return licenseType === 'nmc' 
          ? <CredentialsNMC onNext={handleNext} onBack={handleBack} />
          : <CredentialsRCI onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <VerificationPending onApprove={() => setStep(4)} />;
      case 4:
        return <VerificationApproved onDashboard={() => setView('dashboard')} />;
      default:
        return <SignupForm onNext={() => setStep(2.1)} />;
    }
  };

  const visualStep = step === 1 ? 1 : (step < 3 ? 2 : 3);
  const isApproved = view === 'signup' && step === 4;
  const isDashboardView = ['dashboard', 'credentials', 'registry', 'profile', 'consent', 'diagnostics', 'assessment-isaa', 'assessment-asd-deep', 'assessment-adhd', 'assessment-glad', 'assessment-results-isaa', 'iep-builder', 'iep-view', 'interventions', 'intervention-detail', 'report-generator', 'reports-library', 'report-viewer', 'patient-journal', 'messages', 'case-triage', 'consultation-manager', 'settings', 'help', 'search', 'schedule', 'patient-onboarding', 'patient-discharge', 'appointment-booking', 'appointment-reschedule', 'component-demo'].includes(view);
  const isAssessmentMode = ['assessment-isaa', 'assessment-asd-deep', 'assessment-adhd', 'assessment-glad'].includes(view);
  const isDemoView = view === 'component-demo';

  const getActiveTab = () => {
    if (view === 'registry' || view === 'profile' || view === 'report-generator' || view === 'patient-journal' || view === 'consultation-manager' || view === 'patient-onboarding' || view === 'patient-discharge' || view === 'appointment-booking' || view === 'appointment-reschedule') return 'Patients';
    if (view === 'consent') return 'Consent';
    if (view === 'diagnostics' || view === 'assessment-results-isaa' || isAssessmentMode) return 'Diagnostics';
    if (view === 'interventions' || view === 'iep-builder' || view === 'iep-view' || view === 'intervention-detail' || view === 'reports-library' || view === 'report-viewer') return 'Interventions';
    if (view === 'dashboard' || view === 'credentials' || view === 'schedule' || view === 'case-triage') return 'Dashboard';
    if (view === 'messages') return 'Messages';
    return '';
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {!isAssessmentMode && !isDemoView && (
        <Header 
          variant={isDashboardView ? 'dashboard' : (view === 'welcome' ? 'landing' : (view === 'login' ? 'signup' : (step === 4 ? 'landing' : 'help')))} 
          activeTab={getActiveTab()}
          onTabChange={(tab) => {
            if (tab === 'Dashboard') setView('dashboard');
            if (tab === 'Patients') setView('registry');
            if (tab === 'Consent') setView('consent');
            if (tab === 'Diagnostics') setView('diagnostics');
            if (tab === 'Interventions') setView('interventions');
            if (tab === 'Messages') setView('messages');
          }}
          onAction={view === 'login' ? startSignup : startLogin}
          actionLabel={view === 'login' ? 'Create Account' : 'Sign In'}
          onSettingsClick={() => setView('settings')}
          onHelpClick={() => setView('help')}
          onLogout={() => setView('welcome')}
          onSearchClick={() => setView('search')}
          onNotificationsClick={() => setShowNotifications(true)}
        />
      )}

      <NotificationCenter 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
        onNavigate={handleGlobalNavigate}
      />

      <main className={`flex-1 flex flex-col items-center ${isDashboardView || isDemoView ? 'w-full' : 'py-8 px-4 sm:px-6 lg:px-8'} ${isApproved ? 'bg-gradient-to-b from-blue-50 to-white' : ''}`}>
        <div className={isDashboardView || isDemoView ? "w-full" : "w-full max-w-[720px]"}>
          {view === 'signup' && step < 4 && (
            <Stepper 
              currentStep={visualStep} 
              isSubStep={step === 2.2} 
              labelSuffix={step === 2.2 ? (licenseType?.toUpperCase() + ' Verification') : ''} 
            />
          )}
          
          <div className={`${isApproved || view === 'welcome' || isDashboardView || isDemoView ? '' : 'bg-white rounded-[12px] shadow-lg border border-slate-200 overflow-hidden mt-8 mb-6'}`}>
            {renderView()}
          </div>

          {!isApproved && view !== 'welcome' && !isDashboardView && !isDemoView && (
            <div className="text-center px-4 mb-12">
              <p className="text-xs text-slate-400 leading-relaxed">
                Protected by reCAPTCHA and subject to the Google{' '}
                <a href="#" className="underline hover:text-blue-600">Privacy Policy</a> and{' '}
                <a href="#" className="underline hover:text-blue-600">Terms of Service</a>.
              </p>
            </div>
          )}
        </div>
      </main>

      {!isDashboardView && !isDemoView && <Footer />}
      {isDashboardView && (
        <div className="bg-slate-50 border-t border-slate-200 py-4 text-center">
           <button onClick={() => setView('component-demo')} className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-[#2563EB]">
              View System Demos & States
           </button>
        </div>
      )}
    </div>
  );
};

export default App;
