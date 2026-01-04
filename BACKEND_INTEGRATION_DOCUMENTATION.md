# Daira Backend Integration Documentation
## Complete API Reference & Implementation Status

> **Last Updated:** January 2025  
> **Backend Version:** 1.0.0  
> **Database:** SQLite (Prisma ORM)  
> **Runtime:** Node.js + TypeScript + Express

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Authentication System](#2-authentication-system)
3. [API Endpoints Reference](#3-api-endpoints-reference)
4. [Database Schema Summary](#4-database-schema-summary)
5. [Middleware & Utilities](#5-middleware--utilities)
6. [Implementation Status by Module](#6-implementation-status-by-module)

---

## 1. Architecture Overview

### Tech Stack
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** SQLite with Prisma ORM
- **Authentication:** JWT (Access + Refresh tokens)
- **File Uploads:** Multer
- **Security:** Helmet, CORS, bcryptjs

### Directory Structure
```
backend/
├── src/
│   ├── app.ts                    # Main application entry
│   ├── config/
│   │   └── database.ts           # Database configuration
│   ├── controllers/              # Business logic handlers
│   │   ├── auth.controller.ts
│   │   ├── parent-auth.controller.ts
│   │   ├── parent-children.controller.ts
│   │   ├── parent-screening.controller.ts
│   │   ├── consent.controller.ts
│   │   ├── pep.controller.ts
│   │   ├── resources.controller.ts
│   │   ├── clinician.controller.ts
│   │   ├── patients.controller.ts
│   │   ├── appointments.controller.ts
│   │   ├── dashboard.controller.ts
│   │   ├── sessions.controller.ts
│   │   ├── journal.controller.ts
│   │   ├── assessments.controller.ts
│   │   ├── iep.controller.ts
│   │   ├── interventions.controller.ts
│   │   ├── reports.controller.ts
│   │   ├── messages.controller.ts
│   │   ├── settings.controller.ts
│   │   └── credentials.controller.ts
│   ├── middleware/
│   │   ├── auth.ts               # JWT authentication
│   │   ├── errorHandler.ts       # Global error handler
│   │   └── notFound.ts           # 404 handler
│   ├── routes/                   # Route definitions
│   └── utils/
│       ├── screening-scorer.ts   # M-CHAT-R, ASQ-3 scoring
│       └── token-generator.ts    # Consent token generation
├── prisma/
│   ├── schema.prisma             # Database schema
│   ├── seed.ts                   # Seed data
│   └── migrations/               # Database migrations
└── uploads/                      # File upload storage
```

### API Base URL
```
/api/v1
```

### Health Check
```
GET /health
Response: { status: 'ok', timestamp: '...', environment: '...' }
```

---

## 2. Authentication System

### Overview
The backend supports **two authentication flows**:
1. **Clinician Authentication** (`/api/v1/auth/*`)
2. **Parent Authentication** (`/api/v1/parent/auth/*`)

Both use JWT tokens but with different claims and associated profiles.

### Clinician Authentication

#### Register
```
POST /api/v1/auth/register
Body: {
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  professionalTitle?: string,
  phone?: string
}
Response: {
  success: true,
  data: {
    user_id: string,
    email: string,
    status: string,
    message: string
  }
}
```

#### Login
```
POST /api/v1/auth/login
Body: {
  email: string,
  password: string
}
Response: {
  success: true,
  data: {
    access_token: string,
    refresh_token: string,
    token_type: 'Bearer',
    expires_in: 7200,
    user: {
      id: string,
      email: string,
      role: string,
      status: string,
      profile: { ... }
    }
  }
}
```

#### Logout (Protected)
```
POST /api/v1/auth/logout
Headers: Authorization: Bearer <token>
Body: { refresh_token?: string }
```

#### Refresh Token
```
POST /api/v1/auth/refresh-token
Body: { refresh_token: string }
```

#### Get Current User (Protected)
```
GET /api/v1/auth/me
Headers: Authorization: Bearer <token>
```

#### Update Profile (Protected)
```
PUT /api/v1/auth/profile
Headers: Authorization: Bearer <token>
```

#### Other Auth Endpoints
```
POST /api/v1/auth/verify-email      # Placeholder
POST /api/v1/auth/forgot-password   # Placeholder
POST /api/v1/auth/reset-password    # Placeholder
```

### Parent Authentication

#### Register
```
POST /api/v1/parent/auth/register
Body: {
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone?: string,
  preferredLanguage?: string,
  emergencyContact?: string,
  emergencyPhone?: string
}
Response: {
  success: true,
  data: {
    user: { id, email, role },
    parent: { ... },
    token: string
  }
}
```

#### Login
```
POST /api/v1/parent/auth/login
Body: {
  email: string,
  password: string
}
```

#### Get Profile (Protected)
```
GET /api/v1/parent/auth/me
```

#### Update Profile (Protected)
```
PUT /api/v1/parent/auth/profile
```

#### Change Password (Protected)
```
POST /api/v1/parent/auth/change-password
Body: {
  currentPassword: string,
  newPassword: string
}
```

### JWT Token Structure

**Clinician Token Claims:**
```json
{
  "userId": "uuid",
  "email": "string",
  "role": "clinician"
}
```

**Parent Token Claims:**
```json
{
  "userId": "uuid",
  "role": "parent",
  "parentId": "uuid"
}
```

---

## 3. API Endpoints Reference

### 3.1 Parent Portal APIs

#### Children Management (`/api/v1/parent/children`)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/` | Add child to parent account | ✅ Implemented |
| GET | `/` | Get all children for parent | ✅ Implemented |
| GET | `/:patientId` | Get single child details | ✅ Implemented |
| PUT | `/:patientId` | Update child details | ✅ Implemented |
| DELETE | `/:patientId` | Remove child from account | ✅ Implemented |
| GET | `/:patientId/verify-access` | Verify parent access to child | ✅ Implemented |
| GET | `/:patientId/activity` | Get child's activity timeline | ✅ Implemented |

**Note:** Uses `Child` model for parent-added children (not linked to Patient until consent is granted to a clinician).

#### Parent Screening (`/api/v1/parent/screening`)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/` | Start new screening | ✅ Implemented |
| GET | `/:id/questions` | Get screening questions | ✅ Implemented |
| POST | `/:id/response` | Save individual response | ✅ Implemented |
| POST | `/:id/complete` | Complete and score screening | ✅ Implemented |
| GET | `/:id/results` | Get screening results | ✅ Implemented |
| GET | `/child/:patientId` | Get screenings for child | ✅ Implemented |
| GET | `/my` | Get all screenings for parent | ✅ Implemented |
| DELETE | `/:id` | Delete in-progress screening | ✅ Implemented |

**Supported Screening Types:**
- M-CHAT-R (20 questions)
- M-CHAT-F (20 questions)
- ASQ-3 (30 questions)
- ASQ-SE-2 (30 questions)

#### PEP - Personalized Education Plan (`/api/v1/parent/pep`)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/` | Create new PEP | ✅ Implemented |
| GET | `/child/:patientId` | Get all PEPs for child | ✅ Implemented |
| GET | `/:id` | Get PEP details with goals/activities | ✅ Implemented |
| PUT | `/:id` | Update PEP | ✅ Implemented |
| POST | `/:id/goals` | Add goal to PEP | ✅ Implemented |
| POST | `/goals/:goalId/progress` | Update goal progress | ✅ Implemented |
| POST | `/:id/activities` | Add activity to PEP | ✅ Implemented |
| POST | `/activities/:activityId/complete` | Record activity completion | ✅ Implemented |

#### Resources (`/api/v1/parent/resources`)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/` | Get all resources (filterable) | ✅ Implemented |
| GET | `/featured` | Get featured resources | ✅ Implemented |
| GET | `/category/:category` | Get resources by category | ✅ Implemented |
| GET | `/:id` | Get single resource (increments view count) | ✅ Implemented |

---

### 3.2 Consent Management (`/api/v1/consent`)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/grant` | Parent grants consent (generates token) | ✅ Implemented |
| POST | `/claim` | Clinician claims consent token | ✅ Implemented |
| POST | `/:id/revoke` | Parent revokes consent | ✅ Implemented |
| GET | `/granted` | Get consents granted by parent | ✅ Implemented |
| GET | `/received` | Get consents received by clinician | ✅ Implemented |
| PUT | `/:id/permissions` | Update consent permissions | ✅ Implemented |
| GET | `/check/:patientId/:clinicianId` | Check consent status | ✅ Implemented |
| POST | `/:id/resend` | Resend consent invitation | ✅ Implemented |

**Consent Token Format:** `XXXX-XXXX` (8 alphanumeric characters)

**Permission Structure:**
```json
{
  "view": true,
  "edit": false,
  "assessments": true,
  "reports": true,
  "iep": false
}
```

---

### 3.3 Clinician Portal APIs

#### Clinician Profile (`/api/v1/clinician`)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/profile` | Get clinician profile | ✅ Implemented |
| PUT | `/profile` | Update clinician profile | ✅ Implemented |
| POST | `/profile/photo` | Upload profile photo | ✅ Implemented |
| GET | `/locations` | Get practice locations | ✅ Implemented |
| POST | `/locations` | Create new location | ✅ Implemented |
| PUT | `/locations/:id` | Update location | ✅ Implemented |
| DELETE | `/locations/:id` | Delete location | ✅ Implemented |
| GET | `/availability` | Get availability schedule | ✅ Implemented |
| PUT | `/availability` | Update availability | ✅ Implemented |
| GET | `/time-off` | Get time-off entries | ✅ Implemented |
| POST | `/time-off` | Create time-off entry | ✅ Implemented |
| DELETE | `/time-off/:id` | Delete time-off entry | ✅ Implemented |

#### Dashboard (`/api/v1/dashboard`)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/stats` | Get dashboard statistics | ✅ Implemented |
| GET | `/recent-activity` | Get recent activity log | ✅ Implemented |
| GET | `/today-schedule` | Get today's appointments | ✅ Implemented |
| GET | `/pending-tasks` | Get pending tasks | ✅ Implemented |

#### Patients (`/api/v1/patients`)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/` | Create patient | ✅ Implemented |
| GET | `/` | Get patients (with filters) | ✅ Implemented |
| GET | `/:id` | Get patient details | ✅ Implemented |
| PUT | `/:id` | Update patient | ✅ Implemented |
| DELETE | `/:id` | Soft delete patient | ✅ Implemented |
| POST | `/:id/reactivate` | Reactivate patient | ✅ Implemented |
| POST | `/:id/contacts` | Add patient contact | ✅ Implemented |
| PUT | `/:id/contacts/:contactId` | Update contact | ✅ Implemented |
| DELETE | `/:id/contacts/:contactId` | Delete contact | ✅ Implemented |
| GET | `/:id/timeline` | Get patient timeline | ✅ Implemented |
| POST | `/:id/timeline` | Add timeline entry | ✅ Implemented |

#### Appointments (`/api/v1/appointments`)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/` | Create appointment | ✅ Implemented |
| GET | `/` | Get appointments (with filters) | ✅ Implemented |
| GET | `/calendar` | Get calendar view appointments | ✅ Implemented |
| GET | `/slots` | Get available time slots | ✅ Implemented |
| GET | `/:id` | Get appointment details | ✅ Implemented |
| PUT | `/:id` | Update appointment | ✅ Implemented |
| PUT | `/:id/cancel` | Cancel appointment | ✅ Implemented |

#### Sessions (`/api/v1/sessions`)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/` | Create consultation session | ✅ Implemented |
| GET | `/patient/:patientId` | Get patient sessions | ✅ Implemented |
| GET | `/clinician/me` | Get clinician's sessions | ✅ Implemented |
| GET | `/:id` | Get session details | ✅ Implemented |
| PUT | `/:id` | Update session | ✅ Implemented |
| DELETE | `/:id` | Delete session | ✅ Implemented |
| GET | `/templates/list` | Get session templates | ✅ Implemented |
| POST | `/templates` | Create session template | ✅ Implemented |
| POST | `/:id/attachments` | Add session attachment | ✅ Implemented |

#### Journal (`/api/v1/journal`)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/` | Create journal entry | ✅ Implemented |
| GET | `/patient/:patientId` | Get patient's journal entries | ✅ Implemented |
| GET | `/clinician/recent` | Get clinician's recent entries | ✅ Implemented |
| GET | `/type/:entryType` | Get entries by type | ✅ Implemented |
| GET | `/:id` | Get journal entry | ✅ Implemented |
| PUT | `/:id` | Update journal entry | ✅ Implemented |
| DELETE | `/:id` | Delete journal entry | ✅ Implemented |
| POST | `/:id/attachments` | Add journal attachment | ✅ Implemented |

**Entry Types:** milestone, observation, concern, success, parent_note

#### Assessments (`/api/v1/assessments`)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/` | Start assessment | ✅ Implemented |
| PUT | `/:id/progress` | Save progress (auto-save) | ✅ Implemented |
| POST | `/:id/complete` | Complete and score | ✅ Implemented |
| GET | `/:id` | Get assessment | ✅ Implemented |
| GET | `/:id/insights` | Get domain insights | ✅ Implemented |
| GET | `/:id/compare/:baselineId` | Compare assessments | ✅ Implemented |
| GET | `/patient/:patientId` | Get patient assessments | ✅ Implemented |
| GET | `/patient/:patientId/summary` | Get assessment summary | ✅ Implemented |
| GET | `/patient/:patientId/progress` | Get progress over time | ✅ Implemented |
| GET | `/clinician/recent` | Get recent assessments | ✅ Implemented |
| POST | `/:id/evidence` | Upload evidence | ✅ Implemented |
| PUT | `/:id/interpretation` | Update interpretation | ✅ Implemented |
| DELETE | `/:id` | Delete assessment | ✅ Implemented |

**Assessment Types:** ISAA, ADHD, GLAD, ASD-Deep-Dive

#### IEP (`/api/v1/iep`)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/` | Create IEP | ✅ Implemented |
| GET | `/patient/:patientId` | Get patient IEPs | ✅ Implemented |
| GET | `/:id` | Get IEP with all relations | ✅ Implemented |
| GET | `/:id/summary` | Get IEP summary | ✅ Implemented |
| GET | `/:id/statistics` | Get IEP statistics | ✅ Implemented |
| PUT | `/:id` | Update IEP | ✅ Implemented |
| DELETE | `/:id` | Delete IEP | ✅ Implemented |
| POST | `/:id/goals` | Add goal | ✅ Implemented |
| PUT | `/goals/:goalId` | Update goal | ✅ Implemented |
| DELETE | `/goals/:goalId` | Delete goal | ✅ Implemented |
| POST | `/goals/:goalId/progress` | Add goal progress | ✅ Implemented |
| POST | `/:id/accommodations` | Add accommodation | ✅ Implemented |
| DELETE | `/accommodations/:accommodationId` | Delete accommodation | ✅ Implemented |
| POST | `/:id/services` | Add service | ✅ Implemented |
| PUT | `/services/:serviceId` | Update service | ✅ Implemented |
| DELETE | `/services/:serviceId` | Delete service | ✅ Implemented |
| POST | `/services/:serviceId/session` | Record service session | ✅ Implemented |
| POST | `/:id/team` | Add team member | ✅ Implemented |
| PUT | `/team/:memberId` | Update team member | ✅ Implemented |
| DELETE | `/team/:memberId` | Delete team member | ✅ Implemented |
| POST | `/team/:memberId/sign` | Sign team member | ✅ Implemented |
| POST | `/:id/progress-report` | Create progress report | ✅ Implemented |
| GET | `/:id/progress-reports` | Get progress reports | ✅ Implemented |
| POST | `/:id/sign` | Sign IEP (parent/clinician) | ✅ Implemented |

#### Interventions (`/api/v1/interventions`)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/` | Create intervention | ✅ Implemented |
| GET | `/patient/:patientId` | Get patient interventions | ✅ Implemented |
| GET | `/:id` | Get intervention details | ✅ Implemented |
| GET | `/:id/statistics` | Get intervention statistics | ✅ Implemented |
| PUT | `/:id` | Update intervention | ✅ Implemented |
| DELETE | `/:id` | Delete intervention | ✅ Implemented |
| PUT | `/:id/status` | Update status | ✅ Implemented |
| POST | `/:id/strategies` | Add strategy | ✅ Implemented |
| PUT | `/strategies/:strategyId` | Update strategy | ✅ Implemented |
| DELETE | `/strategies/:strategyId` | Delete strategy | ✅ Implemented |
| POST | `/:id/progress` | Add progress update | ✅ Implemented |
| GET | `/:id/progress` | Get progress timeline | ✅ Implemented |

#### Reports (`/api/v1/reports`)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/` | Create report | ✅ Implemented |
| GET | `/patient/:patientId` | Get patient reports | ✅ Implemented |
| GET | `/:id` | Get report | ✅ Implemented |
| PUT | `/:id` | Update report | ✅ Implemented |
| DELETE | `/:id` | Delete report | ✅ Implemented |
| POST | `/:id/share` | Share report | ✅ Implemented |
| POST | `/:id/finalize` | Finalize report | ✅ Implemented |

**Report Types:** Diagnostic, Progress, IEP-Summary

#### Messages (`/api/v1/messages`)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/conversations` | Create conversation | ✅ Implemented |
| GET | `/conversations/my` | Get user's conversations | ✅ Implemented |
| GET | `/unread/count` | Get unread count | ✅ Implemented |
| GET | `/:conversationId` | Get conversation | ✅ Implemented |
| POST | `/:conversationId` | Send message | ✅ Implemented |
| PUT | `/:messageId/read` | Mark as read | ✅ Implemented |

#### Settings (`/api/v1/settings`)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/preferences` | Get user preferences | ✅ Implemented |
| PUT | `/preferences` | Update preferences | ✅ Implemented |
| GET | `/notifications` | Get notification settings | ✅ Implemented |
| PUT | `/notifications` | Update notification settings | ✅ Implemented |

#### Credentials (`/api/v1/credentials`)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/` | Create credential (with file upload) | ✅ Implemented |
| GET | `/` | Get all credentials | ✅ Implemented |
| GET | `/:id` | Get credential | ✅ Implemented |
| PUT | `/:id` | Update credential | ✅ Implemented |
| DELETE | `/:id` | Delete credential | ✅ Implemented |

---

## 4. Database Schema Summary

### Core User Models

| Model | Description |
|-------|-------------|
| `User` | Base user account (email, password, role) |
| `ClinicianProfile` | Clinician-specific profile data |
| `Parent` | Parent-specific profile data |
| `Child` | Children added directly by parents |
| `Patient` | Patients managed by clinicians |
| `ParentChild` | Links parents to patients (after consent) |

### Consent & Access

| Model | Description |
|-------|-------------|
| `ConsentGrant` | Consent tokens and permissions |
| `RefreshToken` | JWT refresh tokens |
| `AuditLog` | System activity audit trail |

### Clinical Records

| Model | Description |
|-------|-------------|
| `Appointment` | Scheduled appointments |
| `ConsultationSession` | Session notes and records |
| `JournalEntry` | Patient journal entries |
| `Assessment` | Screening/assessment data |
| `IEP` | Individualized Education Programs |
| `Intervention` | Intervention plans |
| `Report` | Generated reports |

### Communication

| Model | Description |
|-------|-------------|
| `Conversation` | Message threads |
| `Message` | Individual messages |
| `Notification` | System notifications |

### Parent Portal Specific

| Model | Description |
|-------|-------------|
| `ParentScreening` | Parent-initiated screenings |
| `PEP` | Personalized Education Plans |
| `PEPGoal` | PEP goals |
| `PEPActivity` | PEP activities |
| `ActivityCompletion` | Completed activities |
| `Resource` | Resource library items |

### Reference Data

| Model | Description |
|-------|-------------|
| `MChatQuestion` | M-CHAT-R/F questions |
| `ASQQuestion` | ASQ-3 questions |
| `SessionTemplate` | Session note templates |

---

## 5. Middleware & Utilities

### Authentication Middleware (`/src/middleware/auth.ts`)

```typescript
// Protect routes - requires valid JWT
authenticate(req, res, next)

// Optional auth - attaches user if token present
optionalAuth(req, res, next)

// Role-based access
requireRole(...roles)(req, res, next)
```

**Request Extension:**
```typescript
interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
  userRole?: string;
}
```

### Error Handler (`/src/middleware/errorHandler.ts`)

**AppError Class:**
```typescript
new AppError(message, statusCode, code, details?)
```

**Standard Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": []
  }
}
```

### Screening Scorer (`/src/utils/screening-scorer.ts`)

```typescript
// M-CHAT-R scoring
scoreMChatR(responses): {
  totalScore, criticalScore, riskLevel,
  screenerResult, followUpRequired, professionalReferral
}

// ASQ-3 scoring
scoreASQ3(responses, ageRange): {
  domainScores, totalScore, riskLevel,
  areasOfConcern, recommendations
}

// Generic recommendations
generateRecommendations(screeningType, riskLevel, screenerResult?)
```

### Token Generator (`/src/utils/token-generator.ts`)

```typescript
// Generate 8-char consent token (XXXX-XXXX format)
generateConsentToken(): string

// Validate token format
isValidTokenFormat(token): boolean

// Generate unique token (checks DB)
generateUniqueConsentToken(prisma): Promise<string>
```

---

## 6. Implementation Status by Module

### ✅ Fully Implemented

| Module | Endpoints | Notes |
|--------|-----------|-------|
| Clinician Auth | 9/9 | Full JWT flow |
| Parent Auth | 5/5 | Full JWT flow |
| Clinician Profile | 12/12 | Including photo upload |
| Dashboard | 4/4 | Stats, activity, schedule, tasks |
| Patients | 11/11 | Full CRUD + contacts + timeline |
| Appointments | 7/7 | Calendar view + slot availability |
| Sessions | 9/9 | Templates + attachments |
| Journal | 8/8 | Entry types + attachments |
| Assessments | 14/14 | Comparison + insights |
| IEP | 24/24 | Goals, services, team, signatures |
| Interventions | 13/13 | Strategies + progress tracking |
| Reports | 7/7 | Share + finalize |
| Messages | 6/6 | Conversations + notifications |
| Settings | 4/4 | Preferences + notifications |
| Credentials | 5/5 | File uploads |
| Parent Children | 7/7 | Child model + activity |
| Parent Screening | 8/8 | M-CHAT + ASQ scoring |
| PEP | 8/8 | Goals + activities |
| Resources | 4/4 | Filterable library |
| Consent | 8/8 | Token-based consent |

### ⚠️ Placeholder/Partial Implementations

| Feature | Status | Notes |
|---------|--------|-------|
| Email Verification | Placeholder | Returns success, no email sent |
| Password Reset | Placeholder | Returns success, no email sent |
| Consent Email | Placeholder | Token generated, no email sent |
| File Storage | Local | Uses `/uploads` directory |

### 🔮 Not Yet Implemented (Future)

| Feature | Notes |
|---------|-------|
| GenAI Report Generation | Integration point marked |
| Teacher Portal | Schema ready, no endpoints |
| School Admin Portal | Not started |
| Bhashini Translation | Integration planned |
| Real-time Notifications | WebSocket not implemented |
| Push Notifications | Infrastructure not set up |

---

## Appendix: API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": ["Additional info"]
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "total_pages": 5
    }
  }
}
```

---

## Appendix: Environment Variables

```env
# Server
PORT=5001
NODE_ENV=development

# Database
DATABASE_URL=file:./dev.db

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=2h
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRES_IN=30d

# Frontend
FRONTEND_URL=http://localhost:3000,http://localhost:5173

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

---

## 7. Frontend-Backend Integration Status (Parent Portal)

This section compares the API calls made by the Frontend-Parent services against the implemented backend endpoints.

### 7.1 Auth Service

| Frontend Call | Backend Endpoint | Status |
|---------------|------------------|--------|
| `POST /parent/auth/login` | ✅ `POST /api/v1/parent/auth/login` | Connected |
| `POST /parent/auth/register` | ✅ `POST /api/v1/parent/auth/register` | Connected |
| `GET /parent/auth/me` | ✅ `GET /api/v1/parent/auth/me` | Connected |
| `PUT /parent/auth/profile` | ✅ `PUT /api/v1/parent/auth/profile` | Connected |
| `POST /parent/auth/change-password` | ✅ `POST /api/v1/parent/auth/change-password` | Connected |

### 7.2 Children Service

| Frontend Call | Backend Endpoint | Status |
|---------------|------------------|--------|
| `POST /parent/children` | ✅ `POST /api/v1/parent/children` | Connected |
| `GET /parent/children` | ✅ `GET /api/v1/parent/children` | Connected |
| `GET /parent/children/:id` | ✅ `GET /api/v1/parent/children/:patientId` | Connected |
| `PUT /parent/children/:id` | ✅ `PUT /api/v1/parent/children/:patientId` | Connected |
| `DELETE /parent/children/:id` | ✅ `DELETE /api/v1/parent/children/:patientId` | Connected |

### 7.3 Screening Service

| Frontend Call | Backend Endpoint | Status | Notes |
|---------------|------------------|--------|-------|
| `GET /parent/screenings/types` | ❌ Not implemented | **Missing** | Frontend uses mock data |
| `POST /parent/screenings/start` | ⚠️ Mismatch: `POST /api/v1/parent/screening` | **Mismatch** | Endpoint exists but path differs |
| `GET /parent/screenings/:id` | ⚠️ Mismatch | **Mismatch** | Backend uses `/parent/screening/:id/results` |
| `PUT /parent/screenings/:id/progress` | ⚠️ Mismatch: `POST /parent/screening/:id/response` | **Mismatch** | Different approach |
| `POST /parent/screenings/:id/complete` | ⚠️ Mismatch: `POST /parent/screening/:id/complete` | Path Match | |
| `GET /parent/screenings` (history) | ✅ `GET /api/v1/parent/screening/my` | Path Mismatch | |

**Recommended Action:** Update frontend screening.service.ts to match backend paths:
- `/parent/screenings/*` → `/parent/screening/*`
- Add `/parent/screening/:id/questions` endpoint usage
- Add `/parent/screening/:id/response` for individual responses

### 7.4 PEP Service

| Frontend Call | Backend Endpoint | Status | Notes |
|---------------|------------------|--------|-------|
| `GET /parent/peps` | ⚠️ `GET /api/v1/parent/pep/child/:patientId` | **Mismatch** | Backend requires patientId |
| `GET /parent/peps/:id` | ✅ `GET /api/v1/parent/pep/:id` | Connected |
| `POST /parent/peps` | ⚠️ Mismatch | **Mismatch** | Backend uses different payload |
| `PUT /parent/peps/:id/status` | ❌ Not implemented | **Missing** | |
| `POST /parent/peps/:id/archive` | ❌ Not implemented | **Missing** | Use PUT /:id with status |
| `POST /parent/peps/:id/unarchive` | ❌ Not implemented | **Missing** | Use PUT /:id with status |
| `DELETE /parent/peps/:id` | ❌ Not implemented | **Missing** | |
| `GET /parent/peps/:id/goals` | ❌ Part of `GET /:id` response | Include in main response |
| `GET /parent/peps/:id/activities` | ❌ Part of `GET /:id` response | Include in main response |
| `POST /parent/peps/:id/activities` | ✅ `POST /api/v1/parent/pep/:id/activities` | Connected |
| `PUT /parent/peps/:id/activities/:activityId` | ❌ Not implemented | **Missing** | |
| `DELETE /parent/peps/:id/activities/:activityId` | ❌ Not implemented | **Missing** | |
| `POST /.../activities/:activityId/toggle-completion` | ⚠️ Use `POST /activities/:activityId/complete` | **Different pattern** |
| `GET /.../activities/:activityId/details` | ❌ Not implemented | **Missing** | |
| `POST /.../activities/:activityId/notes` | ❌ Not implemented | **Missing** | |
| `DELETE /.../notes/:noteId` | ❌ Not implemented | **Missing** | |
| `POST /.../activities/:activityId/media` | ❌ Not implemented | **Missing** | |
| `DELETE /.../media/:mediaId` | ❌ Not implemented | **Missing** | |
| `POST /.../activities/:activityId/completions` | ✅ `POST /activities/:activityId/complete` | Connected |
| `GET /parent/peps/:id/progress` | ❌ Not implemented | **Missing** | Need progress aggregation |
| `POST /parent/peps/:id/export` | ❌ Not implemented | **Missing** | |
| `POST /parent/peps/:id/share-progress` | ❌ Not implemented | **Missing** | |

### 7.5 Consent Service

| Frontend Call | Backend Endpoint | Status | Notes |
|---------------|------------------|--------|-------|
| `GET /parent/consents` | ⚠️ `GET /api/v1/consent/granted` | Path Mismatch | |
| `GET /parent/consents/:id` | ❌ Not implemented as-is | **Missing** | |
| `POST /parent/consents/grant` | ✅ `POST /api/v1/consent/grant` | Connected |
| `POST /parent/consents/:id/revoke` | ✅ `POST /api/v1/consent/:id/revoke` | Connected |
| `PUT /parent/consents/:id/permissions` | ✅ `PUT /api/v1/consent/:id/permissions` | Connected |

### 7.6 Dashboard Service

| Frontend Call | Backend Endpoint | Status | Notes |
|---------------|------------------|--------|-------|
| `GET /parent/dashboard/stats` | ❌ Not implemented | **Missing** | Only clinician dashboard exists |
| `GET /parent/dashboard/next-action` | ❌ Not implemented | **Missing** | |
| `GET /parent/messages/recent` | ❌ Not implemented | **Missing** | |
| `GET /parent/children/:childId/milestones` | ❌ Not implemented | **Missing** | |

### 7.7 Resource Service

| Frontend Call | Backend Endpoint | Status |
|---------------|------------------|--------|
| `GET /parent/resources` | ✅ `GET /api/v1/parent/resources` | Connected |
| `GET /parent/resources/:id` | ✅ `GET /api/v1/parent/resources/:id` | Connected |
| `POST /parent/resources/:id/favorite` | ❌ Not implemented | **Missing** |
| `GET /parent/resources/favorites` | ❌ Not implemented | **Missing** |
| `POST /parent/resources/:id/view` | ❌ Automatic in GET | N/A |
| `POST /parent/resources/:id/download` | ❌ Not implemented | **Missing** |
| `POST /parent/resources/:id/share` | ❌ Not implemented | **Missing** |

### 7.8 Settings Service

| Frontend Call | Backend Endpoint | Status | Notes |
|---------------|------------------|--------|-------|
| `GET /parent/auth/me` | ✅ Works | Connected | |
| `PUT /parent/auth/profile` | ✅ Works | Connected | |
| `POST /parent/auth/change-password` | ✅ Works | Connected | |
| `POST /parent/profile/photo` | ❌ Not implemented | **Missing** | |
| `GET /parent/settings/notifications` | ❌ Not implemented | **Missing** | Use `/api/v1/settings/notifications` |
| `PUT /parent/settings/notifications` | ❌ Not implemented | **Missing** | |
| `GET /parent/settings/privacy` | ❌ Not implemented | **Missing** | |
| `PUT /parent/settings/privacy` | ❌ Not implemented | **Missing** | |
| `GET /parent/settings/preferences` | ❌ Not implemented | **Missing** | Use `/api/v1/settings/preferences` |
| `PUT /parent/settings/preferences` | ❌ Not implemented | **Missing** | |
| `POST /parent/account/export` | ❌ Not implemented | **Missing** | |
| `POST /parent/account/delete` | ❌ Not implemented | **Missing** | |

### 7.9 Journal Service

| Frontend Call | Backend Endpoint | Status | Notes |
|---------------|------------------|--------|-------|
| `GET /parent/journal` | ⚠️ Partial | **Path Mismatch** | Backend: `/api/v1/journal/patient/:patientId` |
| `GET /parent/journal/:id` | ✅ `GET /api/v1/journal/:id` | Works |
| `POST /parent/journal` | ✅ `POST /api/v1/journal` | Works | Requires clinician auth |
| `POST /parent/journal/pep` | ❌ Not implemented | **Missing** | Use regular journal entry |
| `PUT /parent/journal/:id` | ✅ `PUT /api/v1/journal/:id` | Works |
| `DELETE /parent/journal/:id` | ✅ `DELETE /api/v1/journal/:id` | Works |
| `POST /parent/journal/media` | ⚠️ `POST /journal/:id/attachments` | **Different pattern** |

---

## 8. Summary: Missing Backend Endpoints

### Critical (Blocking Features)

1. **Parent Dashboard** - None of the parent-specific dashboard endpoints exist
   - `GET /parent/dashboard/stats`
   - `GET /parent/dashboard/next-action`
   
2. **Screening Types** - No endpoint to list available screening types
   - `GET /parent/screening/types`

3. **PEP Management** - Several PEP endpoints missing
   - `DELETE /parent/pep/:id` (delete PEP)
   - `PUT /parent/pep/:id/activities/:activityId` (update activity)
   - `DELETE /parent/pep/:id/activities/:activityId` (delete activity)
   - `GET /parent/pep/:id/progress` (progress visualization)

### Important (Enhanced UX)

1. **Resource Favorites** - No favorite tracking
   - `POST /parent/resources/:id/favorite`
   - `GET /parent/resources/favorites`

2. **Parent Settings** - Parent-specific settings routes not implemented
   - Need to extend `/settings` for parent role or create `/parent/settings`

3. **Account Management**
   - `POST /parent/profile/photo`
   - `POST /parent/account/export`
   - `POST /parent/account/delete`

### Nice to Have

1. **Journal Media Upload** - Direct media upload endpoint
2. **PEP Export** - PDF/CSV export functionality
3. **Share with Clinician** - Enhanced sharing capabilities

---

## 9. API Path Corrections Needed

Several frontend services use slightly different paths than the backend. Here are the corrections needed:

| Frontend Path | Backend Path | Fix Location |
|---------------|--------------|--------------|
| `/parent/screenings/*` | `/parent/screening/*` | screening.service.ts |
| `/parent/peps/*` | `/parent/pep/*` | pep.service.ts |
| `/parent/consents/*` | `/consent/*` | consent.service.ts |
| `/parent/settings/*` | `/settings/*` | settings.service.ts |

---

*This documentation is auto-generated based on actual backend implementation analysis.*

