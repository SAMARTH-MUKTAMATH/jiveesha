# Frontend Cross-Role Analysis & Endpoint Unification Guide

## Jiveesha/Daira Clinical Platform

**Document Version:** 1.0
**Generated:** January 2026
**Purpose:** Cross-role feature comparison, synchronization analysis, and endpoint unification recommendations

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Platform Architecture Overview](#platform-architecture-overview)
3. [Cross-Role Features Analysis](#cross-role-features-analysis)
4. [Feature-by-Feature Sync Status](#feature-by-feature-sync-status)
5. [Endpoint Mapping & Unification](#endpoint-mapping--unification)
6. [Critical Desync Issues](#critical-desync-issues)
7. [Implementation Recommendations](#implementation-recommendations)
8. [Appendix: Full Endpoint Reference](#appendix-full-endpoint-reference)

---

## Executive Summary

### Current State

| Frontend | Implementation | Backend Connected | Cross-Role Ready |
|----------|---------------|-------------------|------------------|
| **Clinician** | 85% | 75% | ⚠️ Partial |
| **Parent** | 80% | 60% | ⚠️ Partial |
| **Backend** | 95% | N/A | ✅ Ready |

### Key Findings

1. **Consent System**: Both frontends have consent features but use **different backend endpoints** - causing bidirectional sync failure
2. **Journal/Timeline**: Parent has journal feature but clinician's PatientJournal uses **different data model** - incompatible
3. **PEP ↔ IEP Linkage**: Backend supports `linkedIEPId` but neither frontend utilizes this connection
4. **Messaging**: Only clinician frontend has messaging - parents have **no communication channel**
5. **Reports**: Clinician can generate reports but parents **cannot view shared reports**

### Critical Data Flow Gaps

```
┌─────────────────┐                         ┌─────────────────┐
│  Parent Portal  │ ──── BROKEN ────────── │ Clinician Portal│
│                 │                         │                 │
│ • Journal ──────┼───X─── NOT SYNCED ───X──┼── PatientJournal│
│ • PEP ──────────┼───X─── NO LINKAGE ───X──┼── IEP          │
│ • Consent ──────┼───✓─── BACKEND OK ───✓──┼── ConsentCenter │
│ • Screening ────┼───✓─── ONE-WAY ──────X──┼── Assessments  │
│ • NO Messages ──┼───X─── MISSING ──────✓──┼── MessagesCenter│
│ • NO Reports ───┼───X─── MISSING ──────✓──┼── ReportsLibrary│
└─────────────────┘                         └─────────────────┘
```

---

## Platform Architecture Overview

### Frontend Structure Comparison

#### Clinician Frontend (`Frontend-clinician/`)

```
Frontend-clinician/
├── components/              # 48 total components
│   ├── LoginPage.tsx
│   ├── Dashboard.tsx
│   ├── PatientRegistry.tsx
│   ├── PatientProfile.tsx
│   ├── PatientJournal.tsx      # Clinician's view of patient timeline
│   ├── ConsentCenter.tsx       # Token validation & consent management
│   ├── IEPBuilder.tsx          # Create/edit IEPs
│   ├── IEPView.tsx             # View IEP details
│   ├── MessagesCenter.tsx      # Communication with parents/team
│   ├── ReportsLibrary.tsx      # Report management
│   ├── AssessmentADHD.tsx
│   ├── AssessmentISAA.tsx
│   └── ... (35 more)
├── services/
│   └── api.ts                  # Single API service file
└── App.tsx                     # Main routing
```

#### Parent Frontend (`Frontend-parent/`)

```
Frontend-parent/
├── pages/                   # 23 page components
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── ChildrenList.tsx
│   ├── ChildProfile.tsx
│   ├── JournalTimeline.tsx     # Parent's journal entries
│   ├── ConsentManagement.tsx   # Grant/revoke consent
│   ├── PEPDashboard.tsx        # Personalized Education Plan
│   ├── PEPActivities.tsx
│   ├── ScreeningInProgress.tsx
│   └── ... (14 more)
├── services/                # Modular service files
│   ├── api.ts
│   ├── auth.service.ts
│   ├── children.service.ts
│   ├── consent.service.ts
│   ├── journal.service.ts
│   ├── pep.service.ts
│   ├── screening.service.ts
│   ├── settings.service.ts
│   └── resource.service.ts
└── App.tsx
```

### Backend Route Mapping

```
/api/v1/
├── auth/                    # Clinician auth (9 endpoints)
├── parent/auth/             # Parent auth (5 endpoints)
├── patients/                # Clinician patient management
├── parent/children/         # Parent child management
├── consent/                 # Shared consent system
├── journal/                 # Clinician journal entries
├── parent/screening/        # Parent screening
├── assessments/             # Clinician assessments
├── iep/                     # Clinician IEP
├── parent/pep/              # Parent PEP
├── messages/                # Messaging (clinician-only currently)
├── reports/                 # Reports (clinician-only currently)
└── parent/resources/        # Parent resources
```

---

## Cross-Role Features Analysis

### 1. Consent System

**Purpose:** Allow parents to grant clinicians access to child data

#### Parent Side (ConsentManagement.tsx)

| Feature | Status | Implementation |
|---------|--------|----------------|
| View consents | ✅ | `GET /parent/consents` (WRONG PATH) |
| Grant consent | ✅ | `POST /parent/consents/grant` (WRONG PATH) |
| Revoke consent | ✅ | `POST /parent/consents/:id/revoke` |
| Edit permissions | ✅ | `PUT /parent/consents/:id/permissions` |
| Token generation | ✅ | Client-side mock only |

#### Clinician Side (ConsentCenter.tsx)

| Feature | Status | Implementation |
|---------|--------|----------------|
| View received | ✅ | `GET /consent/received` |
| Validate token | ✅ | `POST /consent/claim` |
| Token input UI | ✅ | 8-character input |
| Pending requests | ✅ | Display only, no API call |
| Request consent | 🟡 | UI only, no backend |

#### Backend Reality (`consent.routes.ts`)

```javascript
// Actual backend routes:
POST   /consent/grant          // Parent grants consent
POST   /consent/claim          // Clinician claims with token
POST   /consent/:id/revoke     // Either party revokes
GET    /consent/granted        // Parent's granted consents
GET    /consent/received       // Clinician's received consents
PUT    /consent/:id/permissions // Update permissions
GET    /consent/check/:patientId/:clinicianId // Check status
POST   /consent/:id/resend     // Resend invitation
```

#### ❌ DESYNC ISSUES

| Issue | Frontend | Backend | Fix Required |
|-------|----------|---------|--------------|
| Wrong path | Parent: `/parent/consents/*` | `/consent/*` | Update `consent.service.ts` |
| Missing API | Token generation | Not implemented | Add `POST /consent/generate-token` |
| Missing API | Request consent (clinician) | Not implemented | Add `POST /consent/request` |
| No notification | Both | No webhook/polling | Implement notification system |

### 2. Journal System

**Purpose:** Document child progress, milestones, and observations

#### Parent Side (JournalTimeline.tsx + journal.service.ts)

| Feature | Status | Data Model |
|---------|--------|------------|
| Create general entry | ✅ | `entryType: 'general' \| 'pep'` |
| Create PEP entry | ✅ | Links to activity |
| View timeline | ✅ | Filterable by type/child |
| Media uploads | ✅ | Photos, videos, documents |
| Visibility control | ✅ | `private \| shared` |
| Mood tracking | ✅ | `happy \| neutral \| concerned \| celebrating` |
| Tags | ✅ | Array of strings |

**Parent Journal Data Model:**
```typescript
interface JournalEntry {
    id: string;
    childId: string;
    entryType: 'general' | 'pep';
    pepId?: string;
    pepActivityId?: string;
    caption: string;
    mediaType: 'photo' | 'video' | 'document' | 'none';
    mediaUrls: string[];
    timestamp: string;
    visibility: 'private' | 'shared';
    sharedWithClinicianIds: string[];
    tags: string[];
    mood?: 'happy' | 'neutral' | 'concerned' | 'celebrating';
}
```

#### Clinician Side (PatientJournal.tsx)

| Feature | Status | Data Model |
|---------|--------|------------|
| View patient timeline | ✅ | Mixed entry types |
| Add clinical notes | ✅ | `type: 'Clinical Note'` |
| View parent submissions | ✅ | Display only |
| Reply to parent | ✅ | Nested replies |
| Milestones | ✅ | `type: 'Milestone Achieved'` |
| Media evidence | ✅ | `type: 'Media Evidence'` |
| Medication tracking | ✅ | `type: 'Medication'` |

**Clinician Journal Data Model (DIFFERENT!):**
```typescript
interface JournalEntry {
    id: string;
    type: 'Clinical Note' | 'Parent Submission' | 'Milestone Achieved' | 
          'Media Evidence' | 'Medication';
    date: string;
    author: string;
    role: string;
    content?: string;
    tags?: string[];
    attachment?: { name: string; size: string };
    media?: { type: string; thumb: string; title: string; duration: string };
    photos?: string[];
    mood?: string;
    reply?: { author: string; time: string; text: string; liked: boolean };
    medication?: string;
    // ... additional fields
}
```

#### Backend Reality (`journal.routes.ts`)

```javascript
// Actual backend routes (CLINICIAN-ONLY):
POST   /journal/                    // Create entry
GET    /journal/patient/:patientId  // Get patient entries
GET    /journal/clinician/recent    // Clinician's recent
GET    /journal/type/:entryType     // Filter by type
GET    /journal/:id                 // Get single entry
PUT    /journal/:id                 // Update entry
DELETE /journal/:id                 // Delete entry
POST   /journal/:id/attachments     // Add attachment
```

#### ❌ CRITICAL DESYNC

| Issue | Impact | Fix Required |
|-------|--------|--------------|
| **NO parent journal routes** | Parent journal entries don't persist to backend | Add `/parent/journal/*` routes |
| **Different data models** | Cannot sync between portals | Unify schema |
| **No shared visibility** | Clinician can't see parent entries marked "shared" | Add cross-role query |
| **No reply sync** | Clinician replies not visible to parent | Add reply relationship |

### 3. PEP ↔ IEP Linkage

**Purpose:** Connect parent activities to professional goals

#### Parent PEP (pep.service.ts)

```typescript
interface PEP {
    id: string;
    childId: string;
    status: 'active' | 'draft' | 'archived';
    goalsCount: number;
    activitiesCount: number;
    progress: number;
}

interface PEPActivity {
    id: string;
    pepId: string;
    title: string;
    description: string;
    category: 'sports' | 'music' | 'recreation' | 'arts' | 'games';
    domain: 'motor' | 'social' | 'cognitive' | 'communication' | 'adaptive';
    completed: boolean;
}
```

#### Clinician IEP (iep.routes.ts)

```typescript
interface IEP {
    id: string;
    patientId: string;
    status: 'draft' | 'active' | 'completed';
    goals: IEPGoal[];
    accommodations: Accommodation[];
    services: Service[];
    team: TeamMember[];
}
```

#### Backend PEP Controller (pep.controller.ts)

The backend **supports** linking:
```typescript
// In createPEP controller:
const pep = await prisma.pEP.create({
    data: {
        patientId,
        clinicianId: req.user!.userId,
        linkedIEPId,  // ← LINKAGE EXISTS BUT UNUSED
        status: 'draft'
    }
});
```

#### ❌ MISSED OPPORTUNITIES

| Feature | Backend Status | Parent Frontend | Clinician Frontend |
|---------|---------------|-----------------|-------------------|
| Link PEP to IEP | ✅ Implemented | ❌ Not used | ❌ Not used |
| View linked PEP from IEP | ❌ Missing | N/A | ❌ Not shown |
| View linked IEP from PEP | ❌ Missing | ❌ Not shown | N/A |
| Sync PEP progress to IEP goals | ❌ Missing | ❌ No API | ❌ No view |

### 4. Messaging System

**Purpose:** Enable communication between parents and clinicians

#### Clinician Side (MessagesCenter.tsx)

| Feature | Status | API |
|---------|--------|-----|
| View conversations | ✅ | `GET /messages/conversations/my` |
| Send message | ✅ | `POST /messages/:conversationId` |
| Create conversation | ✅ | `POST /messages/conversations` |
| Unread count | ✅ | `GET /messages/unread/count` |
| Mark as read | ✅ | `PUT /messages/:messageId/read` |
| Group conversations | ✅ | UI present |

#### Parent Side

| Feature | Status |
|---------|--------|
| **NONE** | ❌ No messaging component exists |

#### Backend (messages.routes.ts)

```javascript
// ALL routes require authentication but are user-agnostic
POST   /messages/conversations     // Create conversation
GET    /messages/conversations/my  // Get my conversations
GET    /messages/unread/count      // Unread count
GET    /messages/:conversationId   // Get conversation
POST   /messages/:conversationId   // Send message
PUT    /messages/:messageId/read   // Mark read
```

#### ❌ MISSING IMPLEMENTATION

| Item | Status | Action Required |
|------|--------|-----------------|
| Parent messaging UI | ❌ Missing | Create `MessagesPage.tsx` in parent frontend |
| Dashboard message widget | ❌ Missing | Add to parent Dashboard.tsx |
| Notification integration | ❌ Missing | Add push/email notifications |

### 5. Reports System

**Purpose:** Generate and share clinical reports

#### Clinician Side (ReportsLibrary.tsx)

| Feature | Status |
|---------|--------|
| Create reports | ✅ |
| View reports list | ✅ |
| Share with parent | ✅ (UI only) |
| Download/export | ✅ |
| Finalize reports | ✅ |

#### Parent Side

| Feature | Status |
|---------|--------|
| View shared reports | ❌ **MISSING** |
| Download reports | ❌ **MISSING** |
| Report notifications | ❌ **MISSING** |

#### Backend (reports.routes.ts)

```javascript
POST   /reports/              // Create report
GET    /reports/patient/:patientId  // Get patient reports
GET    /reports/:id           // Get single report
PUT    /reports/:id           // Update report
DELETE /reports/:id           // Delete report
POST   /reports/:id/share     // Share report
POST   /reports/:id/finalize  // Finalize report
```

#### ❌ NEEDED ADDITIONS

```javascript
// Required parent endpoints:
GET    /parent/reports                   // List shared reports
GET    /parent/reports/:id               // View specific report
GET    /parent/reports/:id/download      // Download report
```

### 6. Screening ↔ Assessment Link

**Purpose:** Connect parent screenings to professional assessments

#### Data Flow (Should Be)

```
Parent Screening (M-CHAT, ASQ)
        │
        ▼
    [Results]
        │
        ▼
Clinician Views Results
        │
        ▼
Clinician Conducts Assessment (ISAA, ADHD-specific)
        │
        ▼
    [Assessment Results]
        │
        ▼
Parent Views Summary ← MISSING
```

#### Current State

| Flow | Status | Notes |
|------|--------|-------|
| Parent → Screening | ✅ | Works |
| Screening → Backend | ✅ | Saved |
| Clinician views screening | ⚠️ | No dedicated view |
| Clinician → Assessment | ✅ | Works |
| Assessment → Parent | ❌ | No view for parent |

---

## Feature-by-Feature Sync Status

### Complete Feature Matrix

| Feature | Parent Has | Clinician Has | Backend | Synced? |
|---------|-----------|---------------|---------|---------|
| **Authentication** | ✅ | ✅ | ✅ | ✅ Separate flows |
| **Dashboard** | ✅ | ✅ | ⚠️ Parent missing | ⚠️ |
| **Child/Patient List** | ✅ | ✅ | ✅ | ✅ |
| **Child/Patient Profile** | ✅ | ✅ | ✅ | ✅ |
| **Consent Management** | ✅ | ✅ | ✅ | ⚠️ Path mismatch |
| **Screening** | ✅ | ❌ (views only) | ✅ | ⚠️ One-way |
| **Assessment** | ❌ | ✅ | ✅ | ❌ Parent can't view |
| **Journal/Timeline** | ✅ | ✅ | ⚠️ Clinician only | ❌ **BROKEN** |
| **PEP (Parent)** | ✅ | ❌ | ✅ | ⚠️ No clinician view |
| **IEP (Clinician)** | ❌ | ✅ | ✅ | ⚠️ No parent view |
| **Messaging** | ❌ | ✅ | ✅ | ❌ **MISSING** |
| **Reports** | ❌ | ✅ | ✅ | ❌ **MISSING** |
| **Resources** | ✅ | ❌ | ✅ | ⚠️ One-way |
| **Settings** | ✅ | ✅ | ⚠️ Partial | ⚠️ |
| **Notifications** | ⚠️ Mock | ✅ | ⚠️ Partial | ⚠️ |

---

## Endpoint Mapping & Unification

### Consent Endpoints

#### Current State

| Frontend | Calls | Backend Expects | Fix |
|----------|-------|-----------------|-----|
| Parent | `GET /parent/consents` | `GET /consent/granted` | Change path |
| Parent | `GET /parent/consents/:id` | N/A | Remove or add backend |
| Parent | `POST /parent/consents/grant` | `POST /consent/grant` | Change path |
| Parent | `POST /parent/consents/:id/revoke` | `POST /consent/:id/revoke` | Change path |
| Parent | `PUT /parent/consents/:id/permissions` | `PUT /consent/:id/permissions` | Change path |
| Clinician | `GET /consent/received` | ✅ Correct | None |
| Clinician | `POST /consent/claim` | ✅ Correct | None |

#### Unified Consent Service (Parent)

```typescript
// consent.service.ts - CORRECTED
class ConsentService {
    async getConsents(childId?: string) {
        // CHANGE FROM: /parent/consents
        // CHANGE TO: /consent/granted
        const response = await api.get('/consent/granted', { 
            params: childId ? { childId } : {} 
        });
        return response.data;
    }

    async grantConsent(data: GrantConsentData) {
        // CHANGE FROM: /parent/consents/grant
        // CHANGE TO: /consent/grant
        const response = await api.post('/consent/grant', data);
        return response.data;
    }

    async revokeConsent(id: string) {
        // CHANGE FROM: /parent/consents/:id/revoke
        // CHANGE TO: /consent/:id/revoke
        const response = await api.post(`/consent/${id}/revoke`);
        return response.data;
    }

    async updatePermissions(id: string, permissions: Consent['permissions']) {
        // CHANGE FROM: /parent/consents/:id/permissions
        // CHANGE TO: /consent/:id/permissions
        const response = await api.put(`/consent/${id}/permissions`, { permissions });
        return response.data;
    }
}
```

### Screening Endpoints

#### Current State

| Frontend | Calls | Backend Expects | Fix |
|----------|-------|-----------------|-----|
| Parent | `GET /parent/screenings/types` | N/A | Add backend endpoint |
| Parent | `POST /parent/screenings/start` | `POST /parent/screening/start` | Change path (singular) |
| Parent | `GET /parent/screenings/:id` | `GET /parent/screening/:id` | Change path |
| Parent | `PUT /parent/screenings/:id/progress` | `PUT /parent/screening/:id/responses` | Change path & name |
| Parent | `POST /parent/screenings/:id/complete` | `POST /parent/screening/:id/complete` | Change path |
| Parent | `GET /parent/screenings` | `GET /parent/screening/history` | Change path |

#### Unified Screening Service

```typescript
// screening.service.ts - CORRECTED
class ScreeningService {
    // CHANGE ALL: /parent/screenings/* → /parent/screening/*

    async getScreeningTypes() {
        // Backend needs this endpoint added
        const response = await api.get('/parent/screening/types');
        return response.data;
    }

    async startScreening(data: StartScreeningData) {
        const response = await api.post('/parent/screening/start', data);
        return response.data;
    }

    async getScreening(id: string) {
        const response = await api.get(`/parent/screening/${id}`);
        return response.data;
    }

    async saveProgress(id: string, responses: Record<string, any>, progress: number) {
        // Note: backend expects 'responses' not 'progress' field
        const response = await api.put(`/parent/screening/${id}/responses`, { responses });
        return response.data;
    }

    async completeScreening(id: string, responses: Record<string, any>) {
        const response = await api.post(`/parent/screening/${id}/complete`, { responses });
        return response.data;
    }

    async getScreeningHistory(childId?: string) {
        const params = childId ? { childId } : {};
        const response = await api.get('/parent/screening/history', { params });
        return response.data;
    }
}
```

### PEP Endpoints

#### Current State

| Frontend | Calls | Backend Expects | Fix |
|----------|-------|-----------------|-----|
| Parent | `GET /parent/peps` | `GET /parent/pep/child/:patientId` | Change structure |
| Parent | `GET /parent/peps/:id` | `GET /parent/pep/:id` | Change path |
| Parent | `POST /parent/peps` | `POST /parent/pep` | Change path |
| Parent | `PUT /parent/peps/:id/status` | `PUT /parent/pep/:id` | Change path, merge |
| Parent | `DELETE /parent/peps/:id` | N/A | Add backend endpoint |
| Parent | `GET /parent/peps/:id/activities` | N/A | Add backend endpoint |
| Parent | `POST /parent/peps/:id/activities` | `POST /parent/pep/:id/activities` | Change path |

#### Unified PEP Service

```typescript
// pep.service.ts - CORRECTED
class PEPService {
    async getPEPs(childId?: string) {
        if (childId) {
            // Backend requires patientId in path
            const response = await api.get(`/parent/pep/child/${childId}`);
            return response.data;
        }
        // Need to add endpoint for all PEPs
        const response = await api.get('/parent/pep');
        return response.data;
    }

    async getPEP(id: string) {
        const response = await api.get(`/parent/pep/${id}`);
        return response.data;
    }

    async createPEP(data: CreatePEPData) {
        const response = await api.post('/parent/pep', data);
        return response.data;
    }

    async updatePEP(id: string, data: Partial<PEP>) {
        const response = await api.put(`/parent/pep/${id}`, data);
        return response.data;
    }

    // MISSING IN BACKEND - Need to add
    async deletePEP(id: string) {
        const response = await api.delete(`/parent/pep/${id}`);
        return response.data;
    }

    async getActivities(pepId: string) {
        // Need to add this endpoint to backend
        const response = await api.get(`/parent/pep/${pepId}/activities`);
        return response.data;
    }

    async createActivity(pepId: string, data: CreateActivityData) {
        const response = await api.post(`/parent/pep/${pepId}/activities`, data);
        return response.data;
    }

    async completeActivity(activityId: string) {
        const response = await api.post(`/parent/pep/activities/${activityId}/complete`);
        return response.data;
    }
}
```

### Settings Endpoints

#### Current State

| Frontend | Calls | Backend Expects | Fix |
|----------|-------|-----------------|-----|
| Parent | `GET /parent/auth/me` | ✅ Correct | None |
| Parent | `PUT /parent/auth/profile` | ✅ Correct | None |
| Parent | `POST /parent/auth/change-password` | ✅ Correct | None |
| Parent | `POST /parent/profile/photo` | N/A | Add backend |
| Parent | `GET /parent/settings/notifications` | N/A | Add backend |
| Parent | `PUT /parent/settings/notifications` | N/A | Add backend |
| Parent | `GET /parent/settings/privacy` | N/A | Add backend |
| Parent | `PUT /parent/settings/privacy` | N/A | Add backend |
| Clinician | `GET /settings/preferences` | ✅ Correct | None |
| Clinician | `PUT /settings/preferences` | ✅ Correct | None |

---

## Critical Desync Issues

### Priority 1: Broken Features

#### 1.1 Parent Journal Not Persisted

**Impact:** Parent journal entries only exist in mock data
**Root Cause:** No `/parent/journal/*` routes in backend
**Fix Required:**

```typescript
// Add to backend app.ts
import parentJournalRoutes from './routes/parent-journal.routes';
app.use(`${API_PREFIX}/parent/journal`, parentJournalRoutes);

// Create parent-journal.routes.ts
router.post('/', createParentJournalEntry);
router.get('/', getParentJournalEntries);
router.get('/:id', getParentJournalEntry);
router.put('/:id', updateParentJournalEntry);
router.delete('/:id', deleteParentJournalEntry);
router.post('/media', uploadJournalMedia);
```

#### 1.2 No Parent Messaging

**Impact:** Parents cannot communicate with clinicians
**Root Cause:** No MessagesPage component in parent frontend
**Fix Required:**

```typescript
// Create Frontend-parent/src/pages/Messages.tsx
// Add route in App.tsx: <Route path="/messages" element={<Messages />} />
// Add navigation in Layout component
// Create message.service.ts
```

#### 1.3 Consent Path Mismatch

**Impact:** All parent consent API calls fail
**Root Cause:** Frontend uses `/parent/consents/*`, backend expects `/consent/*`
**Fix Required:** Update `consent.service.ts` (see unified service above)

### Priority 2: Missing Cross-Role Features

#### 2.1 Clinician Cannot See Parent Journal Entries

**Database Change:**
```sql
-- Add to JournalEntry model
sharedWithClinicians Boolean @default(false)
sharedClinicianIds   String[] @default([])
```

**API Addition:**
```typescript
// GET /journal/shared/:patientId - Get entries shared by parent
router.get('/shared/:patientId', getSharedJournalEntries);
```

#### 2.2 Parent Cannot View Assessment Results

**API Addition:**
```typescript
// GET /parent/assessments/:childId - Get child's assessments
// GET /parent/assessments/:id/results - Get assessment results
router.get('/:childId', getChildAssessments);
router.get('/:id/results', getAssessmentResults);
```

#### 2.3 Parent Cannot View Shared Reports

**API Addition:**
```typescript
// GET /parent/reports - Get shared reports
// GET /parent/reports/:id - Get specific report
router.get('/', getParentReports);
router.get('/:id', getParentReport);
```

### Priority 3: Missing Linkages

#### 3.1 PEP-IEP Link Not Utilized

**Frontend Changes:**
```typescript
// In PEPDashboard.tsx - Add link display
{pep.linkedIEPId && (
    <Link to={`/iep/${pep.linkedIEPId}`}>
        View Professional IEP →
    </Link>
)}

// In IEPView.tsx - Add linked PEPs section
{iep.linkedPEPs && iep.linkedPEPs.length > 0 && (
    <section>
        <h3>Parent Activities</h3>
        {iep.linkedPEPs.map(pep => ...)}
    </section>
)}
```

**API Addition:**
```typescript
// GET /iep/:id/linked-peps - Get PEPs linked to this IEP
// GET /parent/pep/:id/linked-iep - Get IEP linked to this PEP
```

---

## Implementation Recommendations

### Phase 1: Critical Fixes (Week 1-2)

1. **Fix consent.service.ts paths** - 2 hours
2. **Fix screening.service.ts paths** - 2 hours
3. **Fix pep.service.ts paths** - 2 hours
4. **Add missing backend endpoints for parent dashboard** - 4 hours
5. **Add parent journal backend routes** - 8 hours

### Phase 2: Cross-Role Features (Week 3-4)

1. **Create parent MessagesPage.tsx** - 8 hours
2. **Create parent ReportsPage.tsx** - 6 hours
3. **Add shared journal viewing for clinician** - 6 hours
4. **Add assessment results viewing for parent** - 6 hours

### Phase 3: Linkage Features (Week 5-6)

1. **Implement PEP-IEP linkage UI** - 8 hours
2. **Add screening-to-assessment flow** - 6 hours
3. **Create unified notification system** - 12 hours
4. **Add real-time updates (WebSocket)** - 16 hours

### File Changes Summary

#### Parent Frontend

| File | Action | Changes |
|------|--------|---------|
| `consent.service.ts` | **Modify** | Fix all paths |
| `screening.service.ts` | **Modify** | Fix paths, add types endpoint |
| `pep.service.ts` | **Modify** | Fix paths |
| `messages.service.ts` | **Create** | New service |
| `reports.service.ts` | **Create** | New service |
| `pages/Messages.tsx` | **Create** | New page |
| `pages/Reports.tsx` | **Create** | New page |
| `components/Layout.tsx` | **Modify** | Add nav items |

#### Backend

| File | Action | Changes |
|------|--------|---------|
| `parent-journal.routes.ts` | **Create** | New route file |
| `parent-journal.controller.ts` | **Create** | New controller |
| `parent-reports.routes.ts` | **Create** | New route file |
| `parent-reports.controller.ts` | **Create** | New controller |
| `parent-assessments.routes.ts` | **Create** | New route file |
| `parent-screening.controller.ts` | **Modify** | Add types endpoint |
| `pep.controller.ts` | **Modify** | Add delete, get activities |
| `app.ts` | **Modify** | Register new routes |

---

## Appendix: Full Endpoint Reference

### Backend Endpoints (Actual Implementation)

#### Authentication
```
POST   /api/v1/auth/register                    # Clinician register
POST   /api/v1/auth/login                       # Clinician login
POST   /api/v1/auth/logout                      # Logout
POST   /api/v1/auth/refresh-token               # Refresh token
GET    /api/v1/auth/me                          # Get profile
PUT    /api/v1/auth/profile                     # Update profile
POST   /api/v1/auth/change-password             # Change password
POST   /api/v1/auth/forgot-password             # Forgot password
POST   /api/v1/auth/reset-password              # Reset password

POST   /api/v1/parent/auth/register             # Parent register
POST   /api/v1/parent/auth/login                # Parent login
GET    /api/v1/parent/auth/me                   # Get parent profile
PUT    /api/v1/parent/auth/profile              # Update parent profile
POST   /api/v1/parent/auth/change-password      # Change password
```

#### Consent
```
POST   /api/v1/consent/grant                    # Grant consent
POST   /api/v1/consent/claim                    # Claim with token
POST   /api/v1/consent/:id/revoke               # Revoke consent
GET    /api/v1/consent/granted                  # Parent's granted
GET    /api/v1/consent/received                 # Clinician's received
PUT    /api/v1/consent/:id/permissions          # Update permissions
GET    /api/v1/consent/check/:patientId/:clinicianId  # Check status
POST   /api/v1/consent/:id/resend               # Resend invitation
```

#### Parent Screening
```
POST   /api/v1/parent/screening/start           # Start screening
GET    /api/v1/parent/screening/:id             # Get screening
GET    /api/v1/parent/screening/:id/questions   # Get questions
PUT    /api/v1/parent/screening/:id/responses   # Save responses
POST   /api/v1/parent/screening/:id/complete    # Complete screening
GET    /api/v1/parent/screening/:id/results     # Get results
GET    /api/v1/parent/screening/history         # Screening history
GET    /api/v1/parent/screening/child/:childId  # Child's screenings
```

#### Parent PEP
```
POST   /api/v1/parent/pep                       # Create PEP
GET    /api/v1/parent/pep/child/:patientId      # Get child's PEPs
GET    /api/v1/parent/pep/:id                   # Get PEP
PUT    /api/v1/parent/pep/:id                   # Update PEP
POST   /api/v1/parent/pep/:id/goals             # Add goal
POST   /api/v1/parent/pep/goals/:goalId/progress  # Update goal progress
POST   /api/v1/parent/pep/:id/activities        # Add activity
POST   /api/v1/parent/pep/activities/:activityId/complete  # Complete activity
```

#### Messages
```
POST   /api/v1/messages/conversations           # Create conversation
GET    /api/v1/messages/conversations/my        # My conversations
GET    /api/v1/messages/unread/count            # Unread count
GET    /api/v1/messages/:conversationId         # Get conversation
POST   /api/v1/messages/:conversationId         # Send message
PUT    /api/v1/messages/:messageId/read         # Mark as read
```

### Missing Backend Endpoints (Needed)

```
# Parent Dashboard
GET    /api/v1/parent/dashboard/stats           # Dashboard statistics
GET    /api/v1/parent/dashboard/next-action     # Next recommended action

# Screening Types
GET    /api/v1/parent/screening/types           # Available screening types

# PEP Extensions
DELETE /api/v1/parent/pep/:id                   # Delete PEP
GET    /api/v1/parent/pep/:id/activities        # List activities
PUT    /api/v1/parent/pep/:id/activities/:activityId  # Update activity
DELETE /api/v1/parent/pep/:id/activities/:activityId  # Delete activity
GET    /api/v1/parent/pep/:id/progress          # Progress data

# Parent Journal (New)
POST   /api/v1/parent/journal                   # Create entry
GET    /api/v1/parent/journal                   # List entries
GET    /api/v1/parent/journal/:id               # Get entry
PUT    /api/v1/parent/journal/:id               # Update entry
DELETE /api/v1/parent/journal/:id               # Delete entry
POST   /api/v1/parent/journal/media             # Upload media

# Parent Reports (New)
GET    /api/v1/parent/reports                   # Shared reports
GET    /api/v1/parent/reports/:id               # Get report

# Parent Assessments (New)
GET    /api/v1/parent/assessments/:childId      # Child's assessments
GET    /api/v1/parent/assessments/:id/results   # Assessment results

# Resources Extensions
POST   /api/v1/parent/resources/:id/favorite    # Toggle favorite
GET    /api/v1/parent/resources/favorites       # List favorites

# Settings Extensions
POST   /api/v1/parent/profile/photo             # Upload photo
GET    /api/v1/parent/settings/notifications    # Notification prefs
PUT    /api/v1/parent/settings/notifications    # Update notifications
GET    /api/v1/parent/settings/privacy          # Privacy settings
PUT    /api/v1/parent/settings/privacy          # Update privacy
POST   /api/v1/parent/account/export            # Export data
POST   /api/v1/parent/account/delete            # Delete account
```

---

## Conclusion

The Jiveesha/Daira platform has a solid foundation but suffers from **incomplete cross-role integration**. The backend is largely ready (95%) but the frontends operate in silos with:

1. **Path mismatches** that cause API failures
2. **Missing features** that break user workflows
3. **No bidirectional data flow** for key features like journal and messaging

The recommended implementation phases address these issues systematically, starting with critical fixes that can be completed in 1-2 weeks, followed by cross-role features and linkages over the subsequent 4 weeks.

**Total Estimated Effort:** 80-100 developer hours

**Key Success Metrics:**
- All consent operations working: 0 → 100%
- Parent-clinician message flow: 0 → 100%
- Cross-role journal visibility: 0 → 100%
- PEP-IEP linkage utilization: 0 → 100%
