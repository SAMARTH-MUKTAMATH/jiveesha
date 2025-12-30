# DAIRA BACKEND API SPECIFICATION
## Frontend-Backend Integration Guide

**Frontend Stack:** React 19 + TypeScript + Vite  
**Frontend Routing:** State-based navigation (useState)  
**Backend Required:** REST

API with JWT authentication  
**Database:** PostgreSQL recommended  
**Version:** 1.0  
**Date:** December 30, 2024

---

## FRONTEND ANALYSIS

### Current Components (46 screens built)
```
✅ LoginPage.tsx
✅ SignupForm.tsx
✅ VerificationStep.tsx
✅ CredentialsRCI.tsx / CredentialsNMC.tsx
✅ VerificationPending.tsx / VerificationApproved.tsx
✅ Dashboard.tsx
✅ CredentialsManagement.tsx
✅ PatientRegistry.tsx
✅ PatientProfile.tsx
✅ PatientOnboarding.tsx
✅ PatientDischarge.tsx
✅ ConsentCenter.tsx
✅ DiagnosticSuite.tsx
✅ AssessmentISAA.tsx
✅ AssessmentASDDeepDive.tsx
✅ AssessmentADHD.tsx
✅ AssessmentGLAD.tsx
✅ AssessmentResultsISAA.tsx
✅ IEPBuilder.tsx
✅ IEPView.tsx
✅ InterventionsDashboard.tsx
✅ InterventionPlanDetail.tsx
✅ ReportGenerator.tsx
✅ ReportsLibrary.tsx
✅ ReportViewer.tsx
✅ PatientJournal.tsx
✅ MessagesCenter.tsx
✅ CaseTriage.tsx
✅ ConsultationManager.tsx
✅ ScheduleCalendar.tsx
✅ AppointmentBooking.tsx
✅ AppointmentReschedule.tsx
✅ SettingsProfile.tsx
✅ HelpCenter.tsx
✅ GlobalSearch.tsx
✅ NotificationCenter.tsx
✅ ErrorPage.tsx
✅ EmptyState.tsx
✅ LoadingStates.tsx
```

### Current Navigation Flow
- Uses `useState` for view management (no React Router yet)
- State-based navigation via `setView()` function
- All views are in App.tsx as conditional renders

---

# PHASE-BY-PHASE BACKEND DEVELOPMENT PLAN

## IMPLEMENTATION STRATEGY

### Priority Levels
1. **P0 - Foundation (Week 1-2):** Must complete before anything else
2. **P1 - Core Features (Week 3-5):** Essential functionality
3. **P2 - Clinical Features (Week 6-8):** Assessment & IEP
4. **P3 - Advanced (Week 9-10):** Reports, analytics
5. **P4 - Nice-to-Have (Week 11+):** Enhancements

### Dependency-Based Sequencing
- Each phase builds on previous
- Parallel development possible within phases
- Each phase independently deployable

---

# PHASE 0: FOUNDATION (P0 - Week 1-2)
*Zero dependencies - Build first*

## 0.1 Authentication System

### API Endpoints

```
POST   /api/v1/auth/register              # Clinician registration
POST   /api/v1/auth/login                 # Login
POST   /api/v1/auth/logout                # Logout
POST   /api/v1/auth/refresh-token         # Refresh JWT
GET    /api/v1/auth/me                    # Get current user
PUT    /api/v1/auth/profile               # Update profile
POST   /api/v1/auth/verify-email          # Email verification
POST   /api/v1/auth/forgot-password       # Forgot password
POST   /api/v1/auth/reset-password        # Reset password with token
```

### Related Frontend Components
- `LoginPage.tsx` → `/api/v1/auth/login`
- `SignupForm.tsx` → `/api/v1/auth/register`
- `VerificationStep.tsx` → `/api/v1/auth/verify-email`

### Database Schema

```sql
-- Core users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'clinician',
    status VARCHAR(50) NOT NULL DEFAULT 'pending_verification',
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    email_verification_expires TIMESTAMP,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login_at TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Clinician profiles
CREATE TABLE clinician_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    professional_title VARCHAR(100),
    designation VARCHAR(100),
    specializations JSONB DEFAULT '[]',
    languages JSONB DEFAULT '[]',
    phone VARCHAR(20),
    alternate_phone VARCHAR(20),
    date_of_birth DATE,
    years_of_practice INTEGER,
    bio TEXT,
    photo_url VARCHAR(500),
    verification_status VARCHAR(50) DEFAULT 'pending',
    verified_at TIMESTAMP,
    verified_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Professional credentials
CREATE TABLE credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    credential_type VARCHAR(50) NOT NULL, -- 'RCI', 'NMC', 'degree', 'certificate'
    credential_number VARCHAR(100),
    issuing_authority VARCHAR(200),
    issue_date DATE,
    expiry_date DATE,
    document_url VARCHAR(500),
    verification_status VARCHAR(50) DEFAULT 'pending',
    verification_notes TEXT,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Refresh tokens
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    revoked_at TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);

-- Audit logs (HIPAA requirement)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    ip_address INET,
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
```

### Sample Request/Response

**POST /api/v1/auth/register**
```json
Request:
{
  "email": "jane.rivera@clinic.com",
  "password": "SecurePass123!",
  "first_name": "Jane",
  "last_name": "Rivera",
  "professional_title": "Clinical Psychologist",
  "phone": "+91 98765 43210"
}

Response (201):
{
  "success": true,
  "data": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "jane.rivera@clinic.com",
    "status": "pending_verification",
    "message": "Registration successful. Please verify your email."
  }
}
```

**POST /api/v1/auth/login**
```json
Request:
{
  "email": "jane.rivera@clinic.com",
  "password": "SecurePass123!"
}

Response (200):
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 7200,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "jane.rivera@clinic.com",
      "role": "clinician",
      "status": "active",
      "profile": {
        "first_name": "Jane",
        "last_name": "Rivera",
        "professional_title": "Clinical Psychologist",
        "verification_status": "verified",
        "photo_url": null
      }
    }
  }
}
```

**GET /api/v1/auth/me**
```
Headers:
Authorization: Bearer <access_token>

Response (200):
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "jane.rivera@clinic.com",
    "role": "clinician",
    "status": "active",
    "email_verified": true,
    "profile": {
      "first_name": "Jane",
      "last_name": "Rivera",
      "professional_title": "Clinical Psychologist",
      "designation": "Clinical Psychologist",
      "specializations": ["ASD", "ADHD", "Speech Delays"],
      "languages": ["English", "Hindi", "Marathi"],
      "phone": "+91 98765 43210",
      "years_of_practice": 8,
      "bio": "Dr. Jane Rivera is a licensed clinical psychologist...",
      "photo_url": "https://cdn.daira.health/photos/user-123.jpg",
      "verification_status": "verified",
      "verified_at": "2024-10-25T10:30:00Z"
    },
    "credentials": [
      {
        "id": "cred-123",
        "type": "RCI",
        "number": "RCI/12345/2020",
        "expiry_date": "2025-01-15",
        "status": "verified"
      }
    ]
  }
}
```

### Business Logic & Validation

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

**Email Verification:**
- Send verification email on registration
- Token valid for 24 hours
- Resend option available after 60 seconds

**JWT Tokens:**
- Access token: 2 hours expiry
- Refresh token: 30 days expiry
- Store refresh tokens in database for revocation

**Session Management:**
- Max 5 concurrent sessions per user
- Auto-logout after 2 hours inactivity
- Track device/IP for security

---

## 0.2 Credential Verification System

### API Endpoints

```
POST   /api/v1/credentials                 # Upload credential
GET    /api/v1/credentials                  # List user credentials
GET    /api/v1/credentials/:id              # Get specific credential
PUT    /api/v1/credentials/:id              # Update credential
DELETE /api/v1/credentials/:id              # Delete credential

# Admin endpoints
GET    /api/v1/admin/credentials/pending   # List pending verifications
PUT    /api/v1/admin/credentials/:id/verify # Approve credential
PUT    /api/v1/admin/credentials/:id/reject # Reject credential
```

### Related Frontend Components
- `CredentialsRCI.tsx` → `/api/v1/credentials`
- `CredentialsNMC.tsx` → `/api/v1/credentials`
- `CredentialsManagement.tsx` → `/api/v1/credentials`
- `VerificationPending.tsx` → Status check
- `VerificationApproved.tsx` → Status display

### Sample Requests

**POST /api/v1/credentials**
```json
Request (multipart/form-data):
{
  "credential_type": "RCI",
  "credential_number": "RCI/12345/2020",
  "issuing_authority": "Rehabilitation Council of India",
  "issue_date": "2020-01-15",
  "expiry_date": "2025-01-15",
  "document": <file>
}

Response (201):
{
  "success": true,
  "data": {
    "id": "cred-123",
    "credential_type": "RCI",
    "credential_number": "RCI/12345/2020",
    "document_url": "https://cdn.daira.health/credentials/cred-123.pdf",
    "verification_status": "pending",
    "created_at": "2024-12-30T10:30:00Z"
  }
}
```

**PUT /api/v1/admin/credentials/:id/verify**
```json
Request:
{
  "verification_notes": "RCI registration verified against official database"
}

Response (200):
{
  "success": true,
  "data": {
    "id": "cred-123",
    "verification_status": "verified",
    "verified_at": "2024-12-30T11:00:00Z",
    "verified_by": "admin-user-id"
  }
}
```

---

# PHASE 1: SETTINGS & PROFILE (P1 - Week 3)
*Depends on: Authentication*

## 1.1 Profile Management

### API Endpoints

```
GET    /api/v1/clinician/profile            # Get full profile
PUT    /api/v1/clinician/profile            # Update profile
POST   /api/v1/clinician/profile/photo      # Upload photo
DELETE /api/v1/clinician/profile/photo      # Remove photo
```

### Related Frontend
- `SettingsProfile.tsx`
- `Dashboard.tsx` (profile display)

### Database (extends existing)
```sql
-- Already in Phase 0: clinician_profiles table
```

### Sample Request

**PUT /api/v1/clinician/profile**
```json
Request:
{
  "first_name": "Jane",
  "middle_name": "Marie",
  "last_name": "Rivera",
  "professional_title": "Clinical Psychologist",
  "designation": "Clinical Psychologist",
  "specializations": ["ASD", "ADHD", "SLD", "Speech Delays"],
  "languages": ["English", "Hindi", "Marathi", "Spanish"],
  "phone": "+91 98765 43210",
  "alternate_phone": "+91 98765 43211",
  "date_of_birth": "1985-03-15",
  "years_of_practice": 8,
  "bio": "Dr. Jane Rivera is a licensed clinical psychologist specializing in autism spectrum disorders and developmental delays in children."
}

Response (200):
{
  "success": true,
  "data": {
    // Full profile object
  }
}
```

---

## 1.2 Practice Locations & Availability

### API Endpoints

```
GET    /api/v1/clinician/locations          # List locations
POST   /api/v1/clinician/locations          # Add location
PUT    /api/v1/clinician/locations/:id      # Update location
DELETE /api/v1/clinician/locations/:id      # Delete location

GET    /api/v1/clinician/availability       # Get availability
PUT    /api/v1/clinician/availability       # Update availability

GET    /api/v1/clinician/time-off           # List time off
POST   /api/v1/clinician/time-off           # Add time off
DELETE /api/v1/clinician/time-off/:id       # Delete time off
```

### Related Frontend
- `SettingsProfile.tsx` (Availability & Schedule section)
- `ScheduleCalendar.tsx`
- `AppointmentBooking.tsx`

### Database Schema

```sql
CREATE TABLE practice_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinician_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pin_code VARCHAR(10),
    country VARCHAR(100) DEFAULT 'India',
    room_info VARCHAR(100),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE clinician_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinician_id UUID REFERENCES users(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL, -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location_id UUID REFERENCES practice_locations(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(clinician_id, day_of_week, start_time, location_id)
);

CREATE TABLE clinician_time_off (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinician_id UUID REFERENCES users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason VARCHAR(255),
    all_day BOOLEAN DEFAULT TRUE,
    start_time TIME,
    end_time TIME,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_availability_clinician ON clinician_availability(clinician_id);
CREATE INDEX idx_time_off_clinician_dates ON clinician_time_off(clinician_id, start_date, end_date);
```

### Sample Requests

**POST /api/v1/clinician/locations**
```json
Request:
{
  "name": "Rivera Clinic - Main Branch",
  "address_line1": "123 MG Road",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pin_code": "400001",
  "room_info": "Room 3",
  "is_primary": true
}

Response (201):
{
  "success": true,
  "data": {
    "id": "loc-123",
    "name": "Rivera Clinic - Main Branch",
    "address_line1": "123 MG Road",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pin_code": "400001",
    "room_info": "Room 3",
    "is_primary": true,
    "created_at": "2024-12-30T10:30:00Z"
  }
}
```

**PUT /api/v1/clinician/availability**
```json
Request:
{
  "availability": [
    {
      "day_of_week": 1,
      "start_time": "09:00",
      "end_time": "17:00",
      "location_id": "loc-123"
    },
    {
      "day_of_week": 2,
      "start_time": "09:00",
      "end_time": "17:00",
      "location_id": "loc-123"
    },
    {
      "day_of_week": 3,
      "start_time": "09:00",
      "end_time": "17:00",
      "location_id": "loc-123"
    },
    {
      "day_of_week": 4,
      "start_time": "09:00",
      "end_time": "17:00",
      "location_id": "loc-123"
    },
    {
      "day_of_week": 5,
      "start_time": "09:00",
      "end_time": "17:00",
      "location_id": "loc-123"
    }
  ]
}

Response (200):
{
  "success": true,
  "data": {
    "message": "Availability updated successfully",
    "updated_count": 5
  }
}
```

---

## 1.3 User Preferences

### API Endpoints

```
GET    /api/v1/settings/preferences         # Get preferences
PUT    /api/v1/settings/preferences         # Update preferences

GET    /api/v1/settings/notifications       # Get notification settings
PUT    /api/v1/settings/notifications       # Update notifications
```

### Database Schema

```sql
CREATE TABLE user_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    date_format VARCHAR(20) DEFAULT 'DD/MM/YYYY',
    time_format VARCHAR(10) DEFAULT '12-hour',
    theme VARCHAR(20) DEFAULT 'light',
    notification_email BOOLEAN DEFAULT TRUE,
    notification_sms BOOLEAN DEFAULT TRUE,
    notification_push BOOLEAN DEFAULT TRUE,
    notification_settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Sample Request

**PUT /api/v1/settings/preferences**
```json
Request:
{
  "language": "en",
  "timezone": "Asia/Kolkata",
  "date_format": "DD/MM/YYYY",
  "time_format": "12-hour",
  "theme": "light"
}

Response (200):
{
  "success": true,
  "data": {
    "language": "en",
    "timezone": "Asia/Kolkata",
    "date_format": "DD/MM/YYYY",
    "time_format": "12-hour",
    "theme": "light",
    "updated_at": "2024-12-30T10:30:00Z"
  }
}
```

---

# PHASE 2: PATIENT MANAGEMENT (P1 - Week 4-5)
*Depends on: Auth, Settings*

## 2.1 Patient Registration & Management

### API Endpoints

```
POST   /api/v1/patients                     # Create patient (manual)
GET    /api/v1/patients                     # List patients (with filters)
GET    /api/v1/patients/:id                 # Get patient details
PUT    /api/v1/patients/:id                 # Update patient
DELETE /api/v1/patients/:id                 # Soft delete patient
POST   /api/v1/patients/:id/reactivate      # Reactivate patient

# Contacts
POST   /api/v1/patients/:id/contacts        # Add contact
PUT    /api/v1/patients/:id/contacts/:cid   # Update contact
DELETE /api/v1/patients/:id/contacts/:cid   # Remove contact

# Documents
POST   /api/v1/patients/:id/documents       # Upload document
GET    /api/v1/patients/:id/documents       # List documents
DELETE /api/v1/patients/:id/documents/:did  # Delete document

# Activity/Timeline
GET    /api/v1/patients/:id/timeline        # Get activity timeline
POST   /api/v1/patients/:id/timeline        # Add timeline entry
```

### Related Frontend
- `PatientOnboarding.tsx` → `/api/v1/patients` (POST)
- `PatientRegistry.tsx` → `/api/v1/patients` (GET with filters)
- `PatientProfile.tsx` → `/api/v1/patients/:id`
- `PatientDischarge.tsx` → `/api/v1/patients/:id/discharge`

### Database Schema

```sql
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinician_id UUID REFERENCES users(id),
    
    -- Basic Info
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20),
    place_of_birth VARCHAR(200),
    
    -- Contact
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pin_code VARCHAR(10),
    country VARCHAR(100) DEFAULT 'India',
    
    -- Additional Info
    primary_language VARCHAR(50),
    languages_spoken JSONB DEFAULT '[]',
    udid_number VARCHAR(50),
    aadhaar_number_encrypted VARCHAR(255),
    school_id VARCHAR(100),
    
    -- Medical
    primary_concerns TEXT,
    existing_diagnosis VARCHAR(255),
    diagnosis_codes JSONB DEFAULT '[]', -- ICD-10 codes
    developmental_milestones JSONB,
    medical_history JSONB,
    current_medications JSONB DEFAULT '[]',
    allergies TEXT,
    family_history TEXT,
    
    -- Meta
    status VARCHAR(50) DEFAULT 'active', -- active, discharged, archived
    referral_source VARCHAR(100),
    referral_details TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE TABLE patient_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    contact_type VARCHAR(50) NOT NULL, -- 'primary_parent', 'secondary_parent', 'emergency', 'school'
    relationship VARCHAR(50), -- mother, father, guardian, teacher, etc
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    alternate_phone VARCHAR(20),
    email VARCHAR(255),
    whatsapp_number VARCHAR(20),
    occupation VARCHAR(100),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pin_code VARCHAR(10),
    is_primary_contact BOOLEAN DEFAULT FALSE,
    can_receive_updates BOOLEAN DEFAULT TRUE,
    preferred_contact_method VARCHAR(50), -- phone, email, whatsapp, sms
    language_preference VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE patient_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    document_type VARCHAR(100), -- 'previous_assessment', 'medical_record', 'school_report', etc
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    uploaded_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT NOW(),
    notes TEXT
);

CREATE TABLE patient_tags (
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    tag VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (patient_id, tag)
);

CREATE TABLE patient_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    activity_type VARCHAR(100) NOT NULL,
    description TEXT,
    metadata JSONB,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_patients_clinician ON patients(clinician_id);
CREATE INDEX idx_patients_status ON patients(status);
CREATE INDEX idx_patients_dob ON patients(date_of_birth);
CREATE INDEX idx_patient_contacts_patient ON patient_contacts(patient_id);
CREATE INDEX idx_patient_documents_patient ON patient_documents(patient_id);
CREATE INDEX idx_patient_activity_patient ON patient_activity_log(patient_id, created_at DESC);
```

### Sample Requests

**POST /api/v1/patients**
```json
Request:
{
  "first_name": "Aarav",
  "last_name": "Kumar",
  "date_of_birth": "2017-03-15",
  "gender": "Male",
  "primary_language": "Hindi",
  "languages_spoken": ["Hindi", "English"],
  "address_line1": "123 MG Road",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pin_code": "400001",
  "udid_number": "MH-01-2024-012345",
  "primary_concerns": "Speech delay, social interaction difficulties",
  "referral_source": "School referral",
  "contacts": [
    {
      "contact_type": "primary_parent",
      "relationship": "Mother",
      "first_name": "Priya",
      "last_name": "Kumar",
      "phone": "+91 98765 43210",
      "email": "priya.kumar@email.com",
      "is_primary_contact": true
    }
  ],
  "tags": ["ASD", "Speech Delay"]
}

Response (201):
{
  "success": true,
  "data": {
    "id": "pat-123",
    "first_name": "Aarav",
    "last_name": "Kumar",
    "patient_id": "DAI-8291", // Display ID
    "date_of_birth": "2017-03-15",
    "age_years": 7,
    "age_months": 4,
    "status": "active",
    "created_at": "2024-12-30T10:30:00Z"
  }
}
```

**GET /api/v1/patients?status=active&search=aarav&page=1&limit=20**
```json
Response (200):
{
  "success": true,
  "data": {
    "patients": [
      {
        "id": "pat-123",
        "patient_id": "DAI-8291",
        "first_name": "Aarav",
        "last_name": "Kumar",
        "date_of_birth": "2017-03-15",
        "age_years": 7,
        "age_months": 4,
        "gender": "Male",
        "status": "active",
        "tags": ["ASD", "Speech Delay"],
        "primary_contact": {
          "name": "Mrs. Priya Kumar",
          "phone": "+91 98765 43210"
        },
        "last_session": "2024-10-20T10:30:00Z",
        "next_appointment": "2024-10-29T10:30:00Z",
        "active_interventions_count": 3,
        "has_active_iep": true,
        "created_at": "2024-03-15T10:00:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 20,
      "total_pages": 2,
      "total_count": 28
    }
  }
}
```

**GET /api/v1/patients/pat-123**
```json
Response (200):
{
  "success": true,
  "data": {
    "id": "pat-123",
    "patient_id": "DAI-8291",
    "first_name": "Aarav",
    "last_name": "Kumar",
    "date_of_birth": "2017-03-15",
    "age_years": 7,
    "age_months": 4,
    "gender": "Male",
    "primary_language": "Hindi",
    "languages_spoken": ["Hindi", "English"],
    "address": {
      "line1": "123 MG Road",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pin_code": "400001",
      "country": "India"
    },
    "udid_number": "MH-01-2024-012345",
    "status": "active",
    "tags": ["ASD", "Speech Delay"],
    "contacts": [
      {
        "id": "cont-123",
        "contact_type": "primary_parent",
        "relationship": "Mother",
        "first_name": "Priya",
        "last_name": "Kumar",
        "phone": "+91 98765 43210",
        "email": "priya.kumar@email.com",
        "is_primary_contact": true
      }
    ],
    "medical_info": {
      "primary_concerns": "Speech delay, social interaction difficulties",
      "existing_diagnosis": null,
      "medications": [],
      "allergies": "Peanuts, lactose"
    },
    "school_info": {
      "name": "Delhi Public School",
      "grade": "Grade 2",
      "section": "Section B",
      "teacher": "Mrs. Meena Sharma"
    },
    "stats": {
      "total_sessions": 24,
      "total_assessments": 3,
      "active_interventions": 3,
      "has_active_iep": true
    },
    "created_at": "2024-03-15T10:00:00Z",
    "updated_at": "2024-12-30T10:30:00Z"
  }
}
```

---

Continue in next part due to length...

