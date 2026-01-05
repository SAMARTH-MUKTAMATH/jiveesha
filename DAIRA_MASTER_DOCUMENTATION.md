# DAIRA PLATFORM - MASTER ARCHITECTURE DOCUMENTATION
## Single Source of Truth - Living Document

**Version:** 2.0.0  
**Last Updated:** January 4, 2026  
**Status:** 🔄 Active Development - Schema Redesign Phase  
**Maintainer:** Anikaet + Claude

---

## 📋 TABLE OF CONTENTS

1. [System Overview](#system-overview)
2. [Core Architecture](#core-architecture)
3. [Database Schema](#database-schema)
4. [API Specification](#api-specification)
5. [Shared Interfaces](#shared-interfaces)
6. [Implementation Status](#implementation-status)
7. [Development Phases](#development-phases)
8. [Change Log](#change-log)

---

## 1. SYSTEM OVERVIEW

### 1.1 Platform Purpose

Daira is a unified neurodevelopmental screening and intervention platform serving three primary stakeholder groups:

1. **Parents/Caregivers** - Home-based screening, activity tracking, progress monitoring
2. **Clinical Professionals** - Diagnostic assessment, treatment planning, professional interventions
3. **Educational Institutions** - Academic tracking, classroom interventions, progress monitoring (future)

### 1.2 Core Principle: Three Views, One Person

**CRITICAL CONCEPT:**

```
Child = Patient = Student = SAME PERSON

One individual can have up to three perspectives:
- Parent View (home/family context)
- Clinician View (medical/therapeutic context)  
- School View (educational context) [FUTURE]

All views reference the same core Person entity.
```

### 1.3 Technology Stack

- **Backend:** Node.js + Express + TypeScript
- **Database:** SQLite with Prisma ORM
- **Frontend (Parent):** React + TypeScript + Vite
- **Frontend (Clinician):** React + TypeScript + Vite
- **Frontend (School):** [FUTURE]
- **API Style:** RESTful with transformation layer
- **Shared Types:** `@daira/shared` npm package

### 1.4 Deployment

- **Backend:** Render
- **Frontend:** Netlify/Vercel
- **Database:** SQLite file-based (will migrate to PostgreSQL for production)

---

## 2. CORE ARCHITECTURE

### 2.1 Three-View Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     CORE ENTITY                              │
│                                                              │
│                      ┌──────────┐                            │
│                      │  Person  │                            │
│                      │          │                            │
│                      │ Core     │                            │
│                      │ Demographics                          │
│                      └────┬─────┘                            │
│                           │                                  │
│            ┌──────────────┼──────────────┐                   │
│            │              │              │                   │
│     ┌──────▼─────┐ ┌─────▼──────┐ ┌────▼──────┐            │
│     │   Parent   │ │ Clinician  │ │  School   │            │
│     │ Child View │ │Patient View│ │Student View            │
│     │            │ │            │ │           │            │
│     │ Home       │ │ Clinical   │ │ Academic  │            │
│     │ Context    │ │ Context    │ │ Context   │            │
│     └────────────┘ └────────────┘ └───────────┘            │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  ACCESS CONTROL LAYER                        │
│                                                              │
│                    ┌──────────────┐                          │
│                    │ AccessGrant  │                          │
│                    │              │                          │
│                    │ Unified      │                          │
│                    │ Permissions  │                          │
│                    └──────────────┘                          │
│                                                              │
│  Controls cross-view data sharing via token-based consent    │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow Patterns

#### Pattern 1: Parent-Only Journey

```
1. Parent creates account → User (role: parent) + Parent profile
2. Parent adds child → Person + ParentChildView
3. Parent runs screenings → Screenings linked to Person
4. Parent creates activities → Activities linked to Person

NO clinician or school involvement yet.
```

#### Pattern 2: Clinician-Only Journey

```
1. Person visits clinician directly
2. Clinician creates account → User (role: clinician) + ClinicianProfile
3. Clinician creates patient → Person + ClinicianPatientView
4. Clinician runs assessments → Assessments linked to Person
5. Clinician creates IEP → IEP linked to Person

NO parent portal or school involvement.
```

#### Pattern 3: Unified Journey (All Three)

```
STEP 1: Parent Portal
────────────────────
Parent adds child
→ Person created (person-123)
→ ParentChildView created (links parent → person-123)

STEP 2: Clinician Portal
────────────────────────
Clinician sees patient
→ ClinicianPatientView created (links clinician → person-123)
→ SAME Person entity!

STEP 3: Access Grant
─────────────────────
Clinician generates token: "ABC12345"
Parent enters token
→ AccessGrant created:
  - grantor: clinician
  - grantee: parent
  - person: person-123
  - permissions: {viewAssessments: true, viewIEP: true}

STEP 4: School Enrollment (FUTURE)
───────────────────────────────────
School enrolls student
→ SchoolStudentView created (links school → person-123)
→ SAME Person entity!

Parent grants school access
→ AccessGrant created:
  - grantor: parent
  - grantee: school
  - person: person-123
  - permissions: {viewProgress: true}

RESULT: One Person, Three Views, Controlled Sharing
```

### 2.3 API Transformation Layer

```
┌─────────────────────────────────────────────────────────────┐
│                    REQUEST FLOW                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Frontend (camelCase)                                        │
│    ↓                                                         │
│  { firstName: "Emma", dateOfBirth: "2020-03-15" }           │
│    ↓                                                         │
│  [REQUEST TRANSFORMER] - toSnakeCase()                       │
│    ↓                                                         │
│  { first_name: "Emma", date_of_birth: "2020-03-15" }        │
│    ↓                                                         │
│  Controller → Prisma → Database (snake_case)                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   RESPONSE FLOW                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Database → Prisma → Controller (snake_case)                 │
│    ↓                                                         │
│  { first_name: "Emma", date_of_birth: "2020-03-15" }        │
│    ↓                                                         │
│  [RESPONSE TRANSFORMER] - toCamelCase()                      │
│    ↓                                                         │
│  { firstName: "Emma", dateOfBirth: "2020-03-15" }           │
│    ↓                                                         │
│  Frontend (camelCase) ✅ Matches @daira/shared types!        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Why Transform?**
- Database/Prisma: snake_case (SQL/database convention)
- Frontend/TypeScript: camelCase (JavaScript convention)
- Transformation happens at API boundary (DRY principle)

---

## 3. DATABASE SCHEMA

### 3.1 Schema Version: 2.0.0 (REDESIGNED)

**Database:** SQLite (development) → PostgreSQL (production)  
**ORM:** Prisma  
**Total Tables:** ~60 (redesigned from 55)

### 3.2 Core Entity Tables

#### 3.2.1 Person (Core Entity)

**Purpose:** Single source of truth for all individuals in the system

```prisma
model Person {
  id                    String    @id @default(uuid())
  
  // Basic Information
  firstName             String    @map("first_name")
  lastName              String    @map("last_name")
  middleName            String?   @map("middle_name")
  dateOfBirth           DateTime  @map("date_of_birth")
  gender                String
  placeOfBirth          String?   @map("place_of_birth")
  
  // Address (unified across all views)
  addressLine1          String?   @map("address_line1")
  addressLine2          String?   @map("address_line2")
  city                  String?
  state                 String?
  pinCode               String?   @map("pin_code")
  country               String    @default("India")
  
  // National Identifiers
  udidNumber            String?   @unique @map("udid_number")
  aadhaarEncrypted      String?   @map("aadhaar_encrypted")
  
  // Language
  primaryLanguage       String?   @map("primary_language")
  languagesSpoken       String    @default("[]") @map("languages_spoken")
  
  // Metadata
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")
  deletedAt             DateTime? @map("deleted_at")
  
  // Relationships to views (one-to-one)
  parentView            ParentChildView?
  clinicianView         ClinicianPatientView?
  schoolView            SchoolStudentView?
  
  // Contacts (shared across all views)
  contacts              Contact[]
  
  // Documents (shared across all views)
  documents             Document[]
  
  // Screenings (can be initiated by parent or clinician)
  screenings            Screening[]
  
  // Assessments (clinician-administered)
  assessments           Assessment[]
  
  // Education Plans (unified PEP/IEP)
  educationPlans        EducationPlan[]
  
  // Activities (home or clinical)
  activities            Activity[]
  
  // Progress records
  progressRecords       ProgressRecord[]
  
  // Journal entries (from any stakeholder)
  journalEntries        JournalEntry[]
  
  // Access grants (who can access this person's data)
  accessGrants          AccessGrant[]
  
  @@index([firstName, lastName])
  @@index([dateOfBirth])
  @@index([udidNumber])
  @@map("persons")
}
```

**Key Design Decisions:**
- All demographic data lives here ONCE
- No duplication across views
- Soft delete support via deletedAt
- Indexed for common queries

---

#### 3.2.2 ParentChildView (Parent Perspective)

**Purpose:** Parent-specific view and data for a Person

```prisma
model ParentChildView {
  id                    String    @id @default(uuid())
  personId              String    @unique @map("person_id")
  parentId              String    @map("parent_id")
  
  // Parent-specific fields
  nickname              String?
  medicalHistory        String?   @map("medical_history")
  currentConcerns       String?   @map("current_concerns")
  developmentalNotes    String?   @map("developmental_notes")
  parentNotes           String?   @map("parent_notes")
  allergyNotes          String?   @map("allergy_notes")
  
  // Relationship metadata
  relationshipType      String    @map("relationship_type") // mother, father, guardian, grandparent, other
  isPrimaryCaregiver    Boolean   @default(false) @map("is_primary_caregiver")
  
  // Preferences
  preferredContactMethod String?  @map("preferred_contact_method")
  reminderPreferences   String    @default("{}") @map("reminder_preferences")
  
  // Timestamps
  addedAt               DateTime  @default(now()) @map("added_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")
  
  // Relationships
  person                Person    @relation(fields: [personId], references: [id], onDelete: Cascade)
  parent                Parent    @relation(fields: [parentId], references: [id], onDelete: Cascade)
  
  @@index([parentId])
  @@index([personId])
  @@map("parent_child_views")
}
```

**Key Design Decisions:**
- One-to-one with Person
- Only parent-specific context stored here
- Links to Parent account

---

#### 3.2.3 ClinicianPatientView (Clinician Perspective)

**Purpose:** Clinical view and data for a Person

```prisma
model ClinicianPatientView {
  id                    String    @id @default(uuid())
  personId              String    @unique @map("person_id")
  clinicianId           String    @map("clinician_id")
  
  // Clinical Information
  primaryConcerns       String?   @map("primary_concerns")
  presentingProblems    String?   @map("presenting_problems")
  chiefComplaint        String?   @map("chief_complaint")
  
  // Diagnosis
  existingDiagnosis     String?   @map("existing_diagnosis")
  diagnosisCodes        String    @default("[]") @map("diagnosis_codes") // JSON: ICD-10/DSM-5
  diagnosisDate         DateTime? @map("diagnosis_date")
  
  // Clinical History
  developmentalHistory  String?   @map("developmental_history")
  birthHistory          String?   @map("birth_history")
  medicalHistory        String?   @map("medical_history")
  familyHistory         String?   @map("family_history")
  socialHistory         String?   @map("social_history")
  
  // Current Status
  currentMedications    String    @default("[]") @map("current_medications") // JSON
  allergies             String?
  immunizationStatus    String?   @map("immunization_status")
  
  // Treatment
  treatmentPlan         String?   @map("treatment_plan")
  clinicalNotes         String?   @map("clinical_notes")
  
  // Case Management
  caseStatus            String    @default("active") // active, inactive, discharged, transferred
  admittedAt            DateTime  @default(now()) @map("admitted_at")
  dischargedAt          DateTime? @map("discharged_at")
  
  // Referral
  referralSource        String?   @map("referral_source")
  referralDate          DateTime? @map("referral_date")
  referralNotes         String?   @map("referral_notes")
  
  // Timestamps
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")
  
  // Relationships
  person                Person    @relation(fields: [personId], references: [id], onDelete: Cascade)
  clinician             User      @relation(fields: [clinicianId], references: [id])
  
  @@index([clinicianId])
  @@index([personId])
  @@index([caseStatus])
  @@map("clinician_patient_views")
}
```

**Key Design Decisions:**
- One-to-one with Person
- Comprehensive clinical data
- Case management status tracking
- Links to Clinician account

---

#### 3.2.4 SchoolStudentView (School Perspective - FUTURE)

**Purpose:** Educational view and data for a Person

```prisma
model SchoolStudentView {
  id                    String    @id @default(uuid())
  personId              String    @unique @map("person_id")
  schoolId              String    @map("school_id")
  primaryTeacherId      String?   @map("primary_teacher_id")
  
  // School Identification
  studentId             String?   @map("student_id")
  rollNumber            String?   @map("roll_number")
  admissionNumber       String?   @map("admission_number")
  
  // Academic Information
  currentGrade          String?   @map("current_grade")
  section               String?
  academicYear          String?   @map("academic_year")
  
  // Performance
  academicPerformance   String?   @map("academic_performance") // JSON: subject-wise
  attendanceRate        Float?    @map("attendance_rate")
  behaviorRating        String?   @map("behavior_rating")
  
  // Support Services
  receivingSupport      Boolean   @default(false) @map("receiving_support")
  supportType           String?   @map("support_type") // Special Ed, Resource Room, etc.
  accommodations        String    @default("[]") @map("accommodations") // JSON
  
  // Notes
  teacherNotes          String?   @map("teacher_notes")
  behaviorNotes         String?   @map("behavior_notes")
  academicNotes         String?   @map("academic_notes")
  
  // Status
  enrollmentStatus      String    @default("active") // active, transferred, graduated, withdrawn
  enrolledAt            DateTime  @default(now()) @map("enrolled_at")
  withdrawnAt           DateTime? @map("withdrawn_at")
  
  // Timestamps
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")
  
  // Relationships
  person                Person    @relation(fields: [personId], references: [id], onDelete: Cascade)
  school                School    @relation(fields: [schoolId], references: [id])
  
  @@index([schoolId])
  @@index([primaryTeacherId])
  @@index([personId])
  @@index([enrollmentStatus])
  @@map("school_student_views")
}
```

**Key Design Decisions:**
- One-to-one with Person
- Academic and behavioral tracking
- Links to School and Teacher
- Support services tracking

---

### 3.3 Access Control Tables

#### 3.3.1 AccessGrant (Unified Permissions)

**Purpose:** Control cross-view data sharing and permissions

```prisma
model AccessGrant {
  id                    String    @id @default(uuid())
  
  // Who is granting access (owner of the data)
  grantorType           String    @map("grantor_type") // parent, clinician, school
  grantorId             String    @map("grantor_id")
  
  // Who is receiving access
  granteeType           String    @map("grantee_type") // parent, clinician, school
  granteeId             String    @map("grantee_id")
  
  // What they can access
  personId              String    @map("person_id")
  
  // Permissions (JSON)
  permissions           String    @default("{}") @map("permissions")
  // {
  //   viewDemographics: true,
  //   viewMedical: true,
  //   viewAcademic: false,
  //   viewAssessments: true,
  //   viewPlans: true,
  //   viewReports: true,
  //   editNotes: false,
  //   editActivities: false
  // }
  
  // Access Level
  accessLevel           String    @default("view") @map("access_level") // view, edit, full_access
  
  // Token-based claiming
  token                 String?   @unique
  tokenExpiresAt        DateTime? @map("token_expires_at")
  
  // Status
  status                String    @default("pending") // pending, active, revoked, expired
  
  // Timestamps
  grantedAt             DateTime  @default(now()) @map("granted_at")
  activatedAt           DateTime? @map("activated_at")
  expiresAt             DateTime? @map("expires_at")
  revokedAt             DateTime? @map("revoked_at")
  
  // Metadata
  grantedByName         String    @map("granted_by_name")
  grantedByEmail        String    @map("granted_by_email")
  granteeEmail          String?   @map("grantee_email")
  notes                 String?
  
  // Audit Trail (JSON array)
  auditLog              String    @default("[]") @map("audit_log")
  // [{action: "granted", timestamp: "...", userId: "..."}]
  
  // Relationships
  person                Person    @relation(fields: [personId], references: [id], onDelete: Cascade)
  
  @@index([grantorId, grantorType])
  @@index([granteeId, granteeType])
  @@index([personId])
  @@index([token])
  @@index([status])
  @@map("access_grants")
}
```

**Key Design Decisions:**
- Universal access control for all three views
- Token-based claiming mechanism
- Granular permissions via JSON
- Full audit trail
- Polymorphic grantor/grantee (parent, clinician, school)

---

### 3.4 User Account Tables

[Continue in next section - this is getting long, maintaining single source]

**STATUS UPDATE:**
- ✅ Core architecture defined
- ✅ Three-view model documented
- ✅ Person entity designed
- ✅ View tables designed
- ✅ Access control designed
- 🔄 User tables next
- 🔄 Feature tables next
- 🔄 API spec next

---

## [DOCUMENT CONTINUES - TO BE EXPANDED AS WE BUILD]

### Next Sections to Add:
- 3.4 User Account Tables (User, Parent, Clinician, School)
- 3.5 Feature Tables (Screenings, Assessments, EducationPlans, Activities)
- 3.6 Supporting Tables (Contacts, Documents, JournalEntries)
- 4. API Specification (All endpoints)
- 5. Shared Interfaces (TypeScript types)
- 6. Implementation Status (What's done, what's next)

---

## 8. CHANGE LOG

### Version 2.0.0 - January 4, 2026
**MAJOR REDESIGN - Three-View Architecture**

**Added:**
- Three-view architecture (Parent/Clinician/School)
- Person core entity (single source of truth)
- ParentChildView table (parent perspective)
- ClinicianPatientView table (clinician perspective)
- SchoolStudentView table (school perspective - future)
- AccessGrant unified permissions table

**Changed:**
- Eliminated data duplication (children/patients merged into Person + views)
- Simplified access control (single AccessGrant table)
- Prepared for school integration

**Removed:**
- [Will be deprecated]: children, patients, parent_children tables
- [Will be deprecated]: consent_grants table (replaced by AccessGrant)

**Migration Required:** Yes - see REDESIGN_01 phase

---

**Document Maintained By:** Anikaet + Claude  
**Living Document:** This file is continuously updated as system evolves  
**Version Control:** Track all changes in Change Log section
