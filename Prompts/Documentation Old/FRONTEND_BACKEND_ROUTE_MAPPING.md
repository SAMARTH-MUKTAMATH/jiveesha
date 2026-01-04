# FRONTEND-TO-BACKEND ROUTE MAPPING
## Daira Platform Integration Guide

**Purpose:** Connect existing frontend components to backend APIs  
**Frontend:** React 19 + TypeScript  
**Backend:** REST API with JWT

---

## PHASE 0: AUTHENTICATION & FOUNDATION

### ✅ LoginPage.tsx
**View State:** `'login'`  
**APIs Required:**
```
POST /api/v1/auth/login
```

**Integration Points:**
```typescript
// Login handler
const handleLogin = async (email: string, password: string) => {
  const response = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const { data } = await response.json();
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  
  // Navigate to dashboard
  setView('dashboard');
};
```

---

### ✅ SignupForm.tsx
**View State:** `'signup'`  
**APIs Required:**
```
POST /api/v1/auth/register
```

**Integration:**
```typescript
const handleSignup = async (formData) => {
  const response = await fetch('/api/v1/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  
  // Move to verification step
  setStep(2);
};
```

---

### ✅ CredentialsRCI.tsx / CredentialsNMC.tsx
**View State:** Part of signup flow (step 2)  
**APIs Required:**
```
POST /api/v1/credentials (multipart/form-data)
```

**Integration:**
```typescript
const handleCredentialUpload = async (file: File, credentialData) => {
  const formData = new FormData();
  formData.append('document', file);
  formData.append('credential_type', 'RCI');
  formData.append('credential_number', credentialData.number);
  formData.append('issue_date', credentialData.issueDate);
  formData.append('expiry_date', credentialData.expiryDate);
  
  const response = await fetch('/api/v1/credentials', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    },
    body: formData
  });
  
  // Move to pending verification
  setView('verification-pending');
};
```

---

### ✅ VerificationPending.tsx
**View State:** After credential upload  
**APIs Required:**
```
GET /api/v1/auth/me (poll for status updates)
```

**Integration:**
```typescript
// Poll every 30 seconds
useEffect(() => {
  const interval = setInterval(async () => {
    const response = await fetch('/api/v1/auth/me', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    
    const { data } = await response.json();
    
    if (data.profile.verification_status === 'verified') {
      setView('verification-approved');
    } else if (data.profile.verification_status === 'rejected') {
      setView('verification-rejected');
    }
  }, 30000);
  
  return () => clearInterval(interval);
}, []);
```

---

## PHASE 1: DASHBOARD & SETTINGS

### ✅ Dashboard.tsx
**View State:** `'dashboard'`  
**APIs Required:**
```
GET /api/v1/dashboard/stats
GET /api/v1/dashboard/recent-activity
GET /api/v1/dashboard/today-schedule
GET /api/v1/dashboard/pending-tasks
```

**Integration:**
```typescript
useEffect(() => {
  const fetchDashboardData = async () => {
    const [stats, activity, schedule, tasks] = await Promise.all([
      fetch('/api/v1/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(r => r.json()),
      fetch('/api/v1/dashboard/recent-activity', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(r => r.json()),
      fetch('/api/v1/dashboard/today-schedule', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(r => r.json()),
      fetch('/api/v1/dashboard/pending-tasks', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(r => r.json())
    ]);
    
    setStats(stats.data);
    setActivity(activity.data);
    setSchedule(schedule.data);
    setTasks(tasks.data);
  };
  
  fetchDashboardData();
}, []);
```

---

### ✅ CredentialsManagement.tsx
**View State:** `'credentials'`  
**APIs Required:**
```
GET /api/v1/credentials
POST /api/v1/credentials
PUT /api/v1/credentials/:id
DELETE /api/v1/credentials/:id
```

---

### ✅ SettingsProfile.tsx
**View State:** `'settings'`  
**APIs Required:**
```
GET /api/v1/clinician/profile
PUT /api/v1/clinician/profile
POST /api/v1/clinician/profile/photo

GET /api/v1/clinician/locations
POST /api/v1/clinician/locations
PUT /api/v1/clinician/locations/:id
DELETE /api/v1/clinician/locations/:id

GET /api/v1/clinician/availability
PUT /api/v1/clinician/availability

GET /api/v1/settings/preferences
PUT /api/v1/settings/preferences
```

**Integration:**
```typescript
// Fetch profile on mount
useEffect(() => {
  const fetchProfile = async () => {
    const response = await fetch('/api/v1/clinician/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const { data } = await response.json();
    setProfileData(data);
  };
  
  fetchProfile();
}, []);

// Update profile
const handleProfileUpdate = async (updatedData) => {
  await fetch('/api/v1/clinician/profile', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedData)
  });
};
```

---

## PHASE 2: PATIENT MANAGEMENT

### ✅ PatientOnboarding.tsx
**View State:** `'patient-onboarding'`  
**APIs Required:**
```
POST /api/v1/patients
POST /api/v1/patients/:id/contacts
POST /api/v1/patients/:id/documents
```

**Integration:**
```typescript
const handlePatientCreate = async (patientData) => {
  // Step 1: Create patient
  const patientResponse = await fetch('/api/v1/patients', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(patientData)
  });
  
  const { data: patient } = await patientResponse.json();
  
  // Step 2: Add contacts
  for (const contact of patientData.contacts) {
    await fetch(`/api/v1/patients/${patient.id}/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contact)
    });
  }
  
  // Step 3: Upload documents if any
  if (patientData.documents?.length > 0) {
    for (const doc of patientData.documents) {
      const formData = new FormData();
      formData.append('document', doc.file);
      formData.append('document_type', doc.type);
      
      await fetch(`/api/v1/patients/${patient.id}/documents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
    }
  }
  
  // Navigate to patient profile
  setSelectedPatientId(patient.id);
  setView('profile');
};
```

---

### ✅ PatientRegistry.tsx
**View State:** `'registry'`  
**APIs Required:**
```
GET /api/v1/patients?page=1&limit=20&status=active&search=query
```

**Integration:**
```typescript
const [patients, setPatients] = useState([]);
const [filters, setFilters] = useState({ status: 'all', search: '' });
const [page, setPage] = useState(1);

useEffect(() => {
  const fetchPatients = async () => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '20',
      ...(filters.status !== 'all' && { status: filters.status }),
      ...(filters.search && { search: filters.search })
    });
    
    const response = await fetch(`/api/v1/patients?${params}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const { data } = await response.json();
    setPatients(data.patients);
    setPagination(data.pagination);
  };
  
  fetchPatients();
}, [filters, page]);

// Search handler
const handleSearch = (searchTerm) => {
  setFilters(prev => ({ ...prev, search: searchTerm }));
  setPage(1);
};

// Filter handler
const handleFilterChange = (status) => {
  setFilters(prev => ({ ...prev, status }));
  setPage(1);
};
```

---

### ✅ PatientProfile.tsx
**View State:** `'profile'` with `selectedPatientId`  
**APIs Required:**
```
GET /api/v1/patients/:id
GET /api/v1/patients/:id/timeline
PUT /api/v1/patients/:id
GET /api/v1/patients/:id/sessions
GET /api/v1/assessments?patient_id=:id
GET /api/v1/interventions?patient_id=:id
GET /api/v1/iep?patient_id=:id
```

**Integration:**
```typescript
useEffect(() => {
  const fetchPatientData = async () => {
    if (!selectedPatientId) return;
    
    const response = await fetch(`/api/v1/patients/${selectedPatientId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const { data } = await response.json();
    setPatientData(data);
    
    // Fetch timeline
    const timelineResponse = await fetch(
      `/api/v1/patients/${selectedPatientId}/timeline`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    setTimeline(timelineResponse.data);
  };
  
  fetchPatientData();
}, [selectedPatientId]);
```

---

### ✅ PatientDischarge.tsx
**View State:** `'patient-discharge'`  
**APIs Required:**
```
POST /api/v1/patients/:id/discharge
PUT /api/v1/patients/:id/discharge/:discharge_id
POST /api/v1/patients/:id/discharge/:discharge_id/finalize
```

---

## PHASE 3: SCHEDULING

### ✅ ScheduleCalendar.tsx
**View State:** `'schedule'`  
**APIs Required:**
```
GET /api/v1/calendar/appointments?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD&view=week
GET /api/v1/clinician/availability
```

**Integration:**
```typescript
const [currentWeek, setCurrentWeek] = useState(new Date());

useEffect(() => {
  const fetchAppointments = async () => {
    const startDate = getWeekStart(currentWeek);
    const endDate = getWeekEnd(currentWeek);
    
    const response = await fetch(
      `/api/v1/calendar/appointments?start_date=${startDate}&end_date=${endDate}&view=week`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    
    const { data } = await response.json();
    setAppointments(data.appointments);
  };
  
  fetchAppointments();
}, [currentWeek]);
```

---

### ✅ AppointmentBooking.tsx
**View State:** `'appointment-booking'`  
**APIs Required:**
```
GET /api/v1/patients (for patient selection)
GET /api/v1/availability/slots?date=YYYY-MM-DD&duration=45
POST /api/v1/appointments
POST /api/v1/appointments/recurring (if recurring)
```

**Integration:**
```typescript
const handleBookAppointment = async (appointmentData) => {
  const endpoint = appointmentData.is_recurring
    ? '/api/v1/appointments/recurring'
    : '/api/v1/appointments';
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(appointmentData)
  });
  
  const { data } = await response.json();
  
  // Navigate to calendar
  setView('schedule');
};

// Fetch available slots
const fetchAvailableSlots = async (date, duration) => {
  const response = await fetch(
    `/api/v1/availability/slots?date=${date}&duration=${duration}`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
  
  const { data } = await response.json();
  setAvailableSlots(data.slots);
};
```

---

### ✅ AppointmentReschedule.tsx
**View State:** `'appointment-reschedule'`  
**APIs Required:**
```
GET /api/v1/appointments/:id
PUT /api/v1/appointments/:id/reschedule
PUT /api/v1/appointments/series/:id/reschedule (if recurring)
POST /api/v1/appointments/:id/reschedule/conflict-check
```

---

## PHASE 4: CONSULTATION NOTES

### ✅ ConsultationManager.tsx
**View State:** `'consultation-manager'`  
**APIs Required:**
```
GET /api/v1/patients/:id/sessions
POST /api/v1/sessions
PUT /api/v1/sessions/:id
GET /api/v1/sessions/:id
POST /api/v1/sessions/:id/attachments
GET /api/v1/sessions/templates
```

**Integration:**
```typescript
const handleSessionCreate = async (sessionData) => {
  const response = await fetch('/api/v1/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sessionData)
  });
  
  const { data } = await response.json();
  
  // Upload attachments if any
  if (sessionData.attachments?.length > 0) {
    for (const file of sessionData.attachments) {
      const formData = new FormData();
      formData.append('file', file);
      
      await fetch(`/api/v1/sessions/${data.id}/attachments`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
    }
  }
};
```

---

### ✅ PatientJournal.tsx
**View State:** `'patient-journal'`  
**APIs Required:**
```
GET /api/v1/patients/:id/journal?filters
POST /api/v1/patients/:id/journal
PUT /api/v1/journal/:id
DELETE /api/v1/journal/:id
```

---

## PHASE 5: ASSESSMENTS

### ✅ DiagnosticSuite.tsx
**View State:** `'diagnostics'`  
**APIs Required:**
```
GET /api/v1/assessments/types
GET /api/v1/patients/:id/assessments
POST /api/v1/assessments (start new)
```

---

### ✅ AssessmentISAA.tsx
**View State:** `'assessment-isaa'`  
**APIs Required:**
```
GET /api/v1/assessments/:id
PUT /api/v1/assessments/:id (auto-save progress)
POST /api/v1/assessments/:id/complete
```

**Integration:**
```typescript
// Auto-save every 30 seconds
useEffect(() => {
  const interval = setInterval(() => {
    if (assessmentData) {
      fetch(`/api/v1/assessments/${assessmentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          responses: assessmentData.responses,
          current_question: assessmentData.currentQuestion,
          status: 'in_progress'
        })
      });
    }
  }, 30000);
  
  return () => clearInterval(interval);
}, [assessmentData]);

// Complete assessment
const handleComplete = async () => {
  await fetch(`/api/v1/assessments/${assessmentId}/complete`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      responses: assessmentData.responses,
      completed_at: new Date().toISOString()
    })
  });
  
  setView('assessment-results-isaa');
};
```

---

### ✅ AssessmentResultsISAA.tsx
**View State:** `'assessment-results-isaa'`  
**APIs Required:**
```
GET /api/v1/assessments/:id/results
GET /api/v1/assessments/:id/comparison (if baseline exists)
```

---

## PHASE 6: IEP MANAGEMENT

### ✅ IEPBuilder.tsx
**View State:** `'iep-builder'`  
**APIs Required:**
```
POST /api/v1/iep (create draft)
PUT /api/v1/iep/:id (update/save progress)
GET /api/v1/iep/:id
POST /api/v1/iep/:id/goals
PUT /api/v1/iep/:id/goals/:goal_id
POST /api/v1/iep/:id/accommodations
POST /api/v1/iep/:id/services
POST /api/v1/iep/:id/finalize
POST /api/v1/iep/:id/sign
```

**Integration:**
```typescript
// Create IEP draft on mount
useEffect(() => {
  const createDraft = async () => {
    const response = await fetch('/api/v1/iep', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        patient_id: selectedPatientId,
        academic_year: '2024-2025',
        status: 'draft'
      })
    });
    
    const { data } = await response.json();
    setIepId(data.id);
  };
  
  createDraft();
}, [selectedPatientId]);

// Auto-save on step completion
const handleStepComplete = async (stepData) => {
  await fetch(`/api/v1/iep/${iepId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(stepData)
  });
  
  setCurrentStep(prev => prev + 1);
};
```

---

### ✅ IEPView.tsx
**View State:** `'iep-view'`  
**APIs Required:**
```
GET /api/v1/iep/:id (full IEP with all sections)
GET /api/v1/iep/:id/signatures
PUT /api/v1/iep/:id/progress (update goal progress)
```

---

## PHASE 7: INTERVENTIONS

### ✅ InterventionsDashboard.tsx
**View State:** `'interventions'`  
**APIs Required:**
```
GET /api/v1/interventions?clinician_id=current&status=active
POST /api/v1/interventions
```

---

### ✅ InterventionPlanDetail.tsx
**View State:** `'intervention-detail'`  
**APIs Required:**
```
GET /api/v1/interventions/:id
PUT /api/v1/interventions/:id
GET /api/v1/interventions/:id/sessions
POST /api/v1/interventions/:id/progress
```

---

## PHASE 8: REPORTS

### ✅ ReportGenerator.tsx
**View State:** `'report-generator'`  
**APIs Required:**
```
POST /api/v1/reports/generate
GET /api/v1/reports/types
GET /api/v1/patients/:id/assessments (for report data)
```

---

### ✅ ReportsLibrary.tsx
**View State:** `'reports-library'`  
**APIs Required:**
```
GET /api/v1/reports?page=1&limit=20&filters
```

---

### ✅ ReportViewer.tsx
**View State:** `'report-viewer'`  
**APIs Required:**
```
GET /api/v1/reports/:id
POST /api/v1/reports/:id/share
```

---

## PHASE 9: COMMUNICATION

### ✅ MessagesCenter.tsx
**View State:** `'messages'`  
**APIs Required:**
```
GET /api/v1/messages/conversations
GET /api/v1/messages/conversations/:id
POST /api/v1/messages
PUT /api/v1/messages/:id/read
```

---

### ✅ NotificationCenter.tsx
**View State:** Overlay panel (triggered by bell icon)  
**APIs Required:**
```
GET /api/v1/notifications?unread=true
PUT /api/v1/notifications/:id/read
PUT /api/v1/notifications/mark-all-read
```

---

## PHASE 10: SEARCH & TRIAGE

### ✅ GlobalSearch.tsx
**View State:** `'search'`  
**APIs Required:**
```
POST /api/v1/search
GET /api/v1/search/suggestions?q=query
```

**Integration:**
```typescript
const handleSearch = async (query) => {
  const response = await fetch('/api/v1/search', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query,
      filters: {
        types: ['patients', 'sessions', 'reports', 'assessments']
      },
      limit: 50
    })
  });
  
  const { data } = await response.json();
  setSearchResults(data.results);
};
```

---

### ✅ CaseTriage.tsx
**View State:** `'case-triage'`  
**APIs Required:**
```
GET /api/v1/cases/queue?priority=all
PUT /api/v1/cases/:id/assign
PUT /api/v1/cases/:id/priority
PUT /api/v1/cases/:id/status
```

---

## PHASE 11: HELP

### ✅ HelpCenter.tsx
**View State:** `'help'`  
**APIs Required:**
```
GET /api/v1/help/articles
GET /api/v1/help/faqs
POST /api/v1/support/ticket
```

---

## AUTHENTICATION HEADERS

All authenticated requests must include:
```typescript
headers: {
  'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
  'Content-Type': 'application/json' // except for multipart/form-data
}
```

**Token Refresh:**
```typescript
// Interceptor for 401 responses
const refreshToken = async () => {
  const response = await fetch('/api/v1/auth/refresh-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      refresh_token: localStorage.getItem('refresh_token')
    })
  });
  
  const { data } = await response.json();
  localStorage.setItem('access_token', data.access_token);
  
  return data.access_token;
};
```

---

## ERROR HANDLING

**Standard Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input provided",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

**Frontend Error Handling:**
```typescript
try {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const error = await response.json();
    
    // Show user-friendly error
    if (error.error.code === 'VALIDATION_ERROR') {
      setValidationErrors(error.error.details);
    } else {
      showToast(error.error.message, 'error');
    }
    
    return;
  }
  
  const data = await response.json();
  // Handle success
  
} catch (err) {
  showToast('Network error. Please try again.', 'error');
}
```

---

## DEPLOYMENT CHECKLIST

### Backend Setup
- [ ] Database migrations run
- [ ] Environment variables configured
- [ ] JWT secret keys set
- [ ] File upload storage configured (S3/local)
- [ ] CORS enabled for frontend domain
- [ ] HTTPS certificates installed

### Frontend Setup
- [ ] API base URL configured in environment
- [ ] Token storage implemented
- [ ] Axios/Fetch interceptors for auth
- [ ] Error boundary components
- [ ] Loading states on all API calls
- [ ] Form validation before API calls

### Testing
- [ ] Test all authentication flows
- [ ] Test patient CRUD operations
- [ ] Test file uploads
- [ ] Test token refresh
- [ ] Test error scenarios
- [ ] Test pagination
- [ ] Test search functionality

---

## PRIORITY IMPLEMENTATION ORDER

**Week 1-2: Authentication**
1. POST /api/v1/auth/register
2. POST /api/v1/auth/login
3. GET /api/v1/auth/me
4. POST /api/v1/credentials
5. Admin credential verification

**Week 3: Profile & Settings**
6. GET/PUT /api/v1/clinician/profile
7. GET/POST/PUT/DELETE /api/v1/clinician/locations
8. GET/PUT /api/v1/clinician/availability

**Week 4-5: Patient Management**
9. POST /api/v1/patients
10. GET /api/v1/patients (list with filters)
11. GET /api/v1/patients/:id
12. Patient contacts endpoints
13. Patient documents endpoints

**Week 6: Scheduling**
14. GET /api/v1/calendar/appointments
15. POST /api/v1/appointments
16. PUT /api/v1/appointments/:id/reschedule
17. GET /api/v1/availability/slots

**Week 7: Sessions**
18. POST /api/v1/sessions
19. GET /api/v1/patients/:id/sessions
20. POST /api/v1/sessions/:id/attachments

**Week 8-9: Assessments**
21. POST /api/v1/assessments
22. PUT /api/v1/assessments/:id (auto-save)
23. POST /api/v1/assessments/:id/complete
24. GET /api/v1/assessments/:id/results

**Week 10+: Advanced Features**
25. IEP endpoints
26. Interventions endpoints
27. Reports endpoints
28. Messages endpoints
29. Search endpoints

---

This document provides a complete mapping of all 46 frontend components to their required backend APIs. Use it as a checklist for implementation!

