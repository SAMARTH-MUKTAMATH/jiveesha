# REDESIGN_01: Complete Unified Schema - CONTEXT

## Overview

**Prompt:** REDESIGN_01  
**Phase:** 0 - Schema Redesign  
**Step:** 1 of 3  
**Time Estimate:** 4-6 hours  
**Complexity:** High  
**Priority:** 🔴 CRITICAL - Foundation for everything

---

## Objective

Create a complete, production-ready Prisma schema that implements the three-view architecture with zero data redundancy and unified access control.

---

## Current State

**What exists:**
- Old schema with `children`, `patients`, `parent_children` tables
- Data duplication across tables
- Complex consent system
- ~55 tables

**What we're building:**
- New schema with `Person` core entity
- Three view tables (ParentChildView, ClinicianPatientView, SchoolStudentView)
- Unified `AccessGrant` table
- ~60 tables (slightly more due to proper separation)

---

## Schema Design Principles

### 1. Single Source of Truth

**Rule:** All demographic data lives in `Person` table ONCE

```prisma
// ✅ CORRECT
model Person {
  firstName String
  lastName String
  dateOfBirth DateTime
}

model ParentChildView {
  personId String
  parentNotes String  // Only parent-specific data
}

// ❌ WRONG (old way)
model Child {
  firstName String  // Duplicate!
  lastName String   // Duplicate!
}
model Patient {
  firstName String  // Duplicate!
  lastName String   // Duplicate!
}
```

### 2. View Tables Only Store Perspective-Specific Data

**Rule:** View tables contain ONLY data unique to that perspective

```prisma
// Parent view: home context
model ParentChildView {
  parentNotes String
  currentConcerns String
  // NO firstName, lastName, etc.
}

// Clinician view: clinical context
model ClinicianPatientView {
  diagnosis String
  treatmentPlan String
  // NO firstName, lastName, etc.
}
```

### 3. One-to-One Relationships

**Rule:** Person can have at most ONE of each view type

```prisma
model Person {
  id String @id
  parentView ParentChildView?      // Optional, one-to-one
  clinicianView ClinicianPatientView?  // Optional, one-to-one
  schoolView SchoolStudentView?    // Optional, one-to-one
}
```

### 4. Polymorphic Access Control

**Rule:** AccessGrant works for any combination of grantor/grantee

```prisma
model AccessGrant {
  grantorType String  // parent | clinician | school
  grantorId String
  granteeType String  // parent | clinician | school
  granteeId String
  personId String
}

// Examples:
// parent → clinician (parent grants clinician access)
// clinician → parent (clinician shares reports with parent)
// parent → school (parent grants school access)
// school → clinician (school shares academic data with clinician)
```

### 5. Feature Tables Reference Person

**Rule:** All feature tables link to Person, not to view tables

```prisma
// ✅ CORRECT
model Screening {
  personId String  // Links to Person
  person Person @relation(...)
}

// ❌ WRONG
model Screening {
  childId String  // Would link to view table
}
```

---

## Complete Schema Structure

### Category A: Core Entities (5 tables)

1. **Person** - Core entity, all demographics
2. **ParentChildView** - Parent's perspective
3. **ClinicianPatientView** - Clinician's perspective
4. **SchoolStudentView** - School's perspective
5. **AccessGrant** - Unified permissions

### Category B: User Accounts (8 tables)

6. **User** - Core authentication
7. **Parent** - Parent profile
8. **ClinicianProfile** - Clinician profile
9. **School** - School/institution profile
10. **Teacher** - Teacher profile
11. **Credential** - Professional credentials
12. **RefreshToken** - JWT tokens
13. **UserPreferences** - User settings

### Category C: Contacts & Documents (3 tables)

14. **Contact** - Person's contacts (shared)
15. **Document** - Person's documents (shared)
16. **AuditLog** - System audit trail

### Category D: Locations & Scheduling (6 tables)

17. **PracticeLocation** - Clinician locations
18. **School** - School locations
19. **ClinicianAvailability** - Weekly schedules
20. **ClinicianTimeOff** - Time off periods
21. **Appointment** - Scheduled appointments
22. **AppointmentHistory** - Change tracking

### Category E: Screenings (5 tables)

23. **Screening** - Unified screenings (M-CHAT, ASQ)
24. **ScreeningResponse** - Individual answers
25. **MChatQuestion** - M-CHAT question bank
26. **ASQQuestion** - ASQ question bank
27. **ScreeningType** - Available screening types

### Category F: Assessments (3 tables)

28. **Assessment** - Clinical assessments (ISAA, ADHD)
29. **AssessmentEvidence** - Supporting media
30. **AssessmentType** - Available assessment types

### Category G: Education Plans (9 tables)

31. **EducationPlan** - Unified PEP/IEP
32. **PlanGoal** - Goals (shared structure)
33. **PlanObjective** - Goal objectives
34. **PlanAccommodation** - Accommodations
35. **PlanService** - Related services
36. **PlanTeamMember** - Team members
37. **GoalProgress** - Progress tracking
38. **PlanProgressReport** - Periodic reports
39. **PlanSignature** - Digital signatures

### Category H: Activities & Tracking (4 tables)

40. **Activity** - Home/clinical activities
41. **ActivityCompletion** - Completion records
42. **ActivityMedia** - Photos/videos
43. **ProgressRecord** - Progress snapshots

### Category I: Sessions & Interventions (6 tables)

44. **ConsultationSession** - Clinical sessions
45. **SessionParticipant** - Session attendees
46. **SessionAttachment** - Session media
47. **Intervention** - Intervention plans
48. **InterventionStrategy** - Strategies
49. **InterventionProgress** - Tracking

### Category J: Journal & Communication (5 tables)

50. **JournalEntry** - Shared journal system
51. **JournalAttachment** - Journal media
52. **Conversation** - Message threads
53. **Message** - Individual messages
54. **Notification** - System notifications

### Category K: Reports & Resources (3 tables)

55. **Report** - Generated reports
56. **Resource** - Educational resources
57. **ResourceFavorite** - User favorites

### Category L: Tags & Metadata (2 tables)

58. **Tag** - Person tags
59. **PatientActivityLog** - Activity tracking

**Total: 59 tables**

---

## Key Relationships

### Person as Central Hub

```
Person
├── parentView (1:1) → ParentChildView
├── clinicianView (1:1) → ClinicianPatientView
├── schoolView (1:1) → SchoolStudentView
├── contacts (1:N) → Contact
├── documents (1:N) → Document
├── screenings (1:N) → Screening
├── assessments (1:N) → Assessment
├── educationPlans (1:N) → EducationPlan
├── activities (1:N) → Activity
├── sessions (1:N) → ConsultationSession
├── interventions (1:N) → Intervention
├── journalEntries (1:N) → JournalEntry
├── progressRecords (1:N) → ProgressRecord
├── accessGrants (1:N) → AccessGrant
└── tags (1:N) → Tag
```

### View Tables Link to Accounts

```
ParentChildView
├── person (N:1) → Person
└── parent (N:1) → Parent

ClinicianPatientView
├── person (N:1) → Person
└── clinician (N:1) → User

SchoolStudentView
├── person (N:1) → Person
├── school (N:1) → School
└── primaryTeacher (N:1) → Teacher
```

### AccessGrant Enables Sharing

```
AccessGrant
├── person → Person (what they access)
├── Polymorphic grantor (who grants)
└── Polymorphic grantee (who receives)
```

---

## Migration Strategy from Old Schema

### Phase 1: Add New Tables (Non-Breaking)

```sql
-- Add Person table
-- Add view tables
-- Add AccessGrant table
-- Keep old tables temporarily
```

### Phase 2: Data Migration Script

```typescript
// Pseudocode for migration

async function migrateToUnifiedSchema() {
  // Step 1: Migrate children → Person + ParentChildView
  const oldChildren = await oldPrisma.children.findMany();
  
  for (const child of oldChildren) {
    // Check if Person already exists (via linkedPatientId)
    let person;
    
    if (child.linked_patient_id) {
      // This child is linked to a patient
      const patient = await oldPrisma.patient.findUnique({
        where: { id: child.linked_patient_id }
      });
      
      if (patient) {
        // Create Person from patient data (more complete)
        person = await newPrisma.person.create({
          data: {
            firstName: patient.first_name,
            lastName: patient.last_name,
            dateOfBirth: patient.date_of_birth,
            gender: patient.gender,
            // ... all demographics
          }
        });
        
        // Create ClinicianPatientView
        await newPrisma.clinicianPatientView.create({
          data: {
            personId: person.id,
            clinicianId: patient.clinician_id,
            primaryConcerns: patient.primary_concerns,
            // ... all clinical fields
          }
        });
      }
    } else {
      // No patient link, create Person from child data
      person = await newPrisma.person.create({
        data: {
          firstName: child.first_name,
          lastName: child.last_name,
          dateOfBirth: child.date_of_birth,
          gender: child.gender,
        }
      });
    }
    
    // Create ParentChildView
    await newPrisma.parentChildView.create({
      data: {
        personId: person.id,
        parentId: child.parent_id,
        medicalHistory: child.medical_history,
        currentConcerns: child.current_concerns,
        // ... all parent-specific fields
      }
    });
    
    // Migrate consent_grants → AccessGrant
    if (child.linked_patient_id) {
      const consent = await oldPrisma.consent_grant.findFirst({
        where: {
          parent_id: child.parent_id,
          patient_id: child.linked_patient_id
        }
      });
      
      if (consent) {
        await newPrisma.accessGrant.create({
          data: {
            grantorType: 'clinician',
            grantorId: consent.clinician_id,
            granteeType: 'parent',
            granteeId: consent.parent_id,
            personId: person.id,
            permissions: consent.permissions,
            accessLevel: consent.access_level,
            status: consent.status,
            token: consent.token,
            // ... all consent fields
          }
        });
      }
    }
  }
  
  // Step 2: Migrate standalone patients (no parent link)
  const standalonePatients = await oldPrisma.patient.findMany({
    where: {
      parent_links: { none: {} }  // No parent_children records
    }
  });
  
  for (const patient of standalonePatients) {
    // Create Person
    const person = await newPrisma.person.create({
      data: {
        firstName: patient.first_name,
        // ... all fields
      }
    });
    
    // Create ClinicianPatientView only
    await newPrisma.clinicianPatientView.create({
      data: {
        personId: person.id,
        clinicianId: patient.clinician_id,
        // ... clinical fields
      }
    });
  }
  
  // Step 3: Migrate related data
  // Screenings, Assessments, etc. update personId references
}
```

### Phase 3: Update Application Code

```typescript
// Old code
const children = await prisma.children.findMany({
  where: { parent_id: parentId }
});

// New code
const childViews = await prisma.parentChildView.findMany({
  where: { parentId },
  include: { person: true }
});

// Transform to frontend format
const children = childViews.map(view => ({
  ...view.person,
  view: view
}));
```

### Phase 4: Verify & Drop Old Tables

```sql
-- After verification
DROP TABLE children;
DROP TABLE patients;
DROP TABLE parent_children;
DROP TABLE consent_grants;
```

---

## Critical Data Integrity Rules

### 1. Person Cannot Be Deleted If Views Exist

```prisma
model ParentChildView {
  person Person @relation(fields: [personId], references: [id], onDelete: Restrict)
}
```

### 2. Soft Deletes for Person

```prisma
model Person {
  deletedAt DateTime?
}

// Query with:
where: { deletedAt: null }
```

### 3. Cascade Deletes for Views

```prisma
model ParentChildView {
  parent Parent @relation(fields: [parentId], references: [id], onDelete: Cascade)
}

// If parent account deleted → views are removed
// But Person remains if other views exist
```

### 4. AccessGrant Cascade on Person Delete

```prisma
model AccessGrant {
  person Person @relation(fields: [personId], references: [id], onDelete: Cascade)
}
```

---

## Performance Optimizations

### Critical Indexes

```prisma
model Person {
  @@index([firstName, lastName])
  @@index([dateOfBirth])
  @@index([udidNumber])
}

model ParentChildView {
  @@index([parentId])
  @@index([personId])
}

model ClinicianPatientView {
  @@index([clinicianId])
  @@index([personId])
  @@index([caseStatus])
}

model AccessGrant {
  @@index([grantorId, grantorType])
  @@index([granteeId, granteeType])
  @@index([personId])
  @@index([token])
  @@index([status])
}
```

---

## Expected Outcomes

After REDESIGN_01:

✅ Complete Prisma schema with 59 tables  
✅ Zero data redundancy (Person core + views)  
✅ Unified access control (AccessGrant)  
✅ Proper indexes for performance  
✅ Migration script ready  
✅ Master documentation updated  
✅ Ready for Prisma migrate  

---

## Dependencies

**Requires:**
- ✅ Master documentation created
- ✅ Three-view architecture approved
- ✅ Decision to redesign confirmed

**Enables:**
- 🔄 REDESIGN_02: Execute migration
- 🔄 REDESIGN_03: Update controllers
- 🔄 BACKEND_02: Transformation layer
- 🔄 All frontend integration

---

**Status:** Ready for Activation Prompt  
**Next:** REDESIGN_01 Activation - Complete Prisma Schema
