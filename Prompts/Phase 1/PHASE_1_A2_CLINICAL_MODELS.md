# PHASE 1-A2: CLINICAL MODELS
## Add Assessments, IEP, Interventions, Reports, and Messages to Database

**Prompt ID:** 1-A2  
**Phase:** 1 - Complete Clinician Backend  
**Section:** A - Database Foundation  
**Dependencies:** 1-A1 complete  
**Estimated Time:** 20-25 minutes

---

## 🎯 OBJECTIVE

Add database models for:
1. **Assessments** - ISAA, ADHD, GLAD, ASD Deep-Dive evaluations
2. **Assessment Evidence** - Files supporting assessments
3. **IEP System** - Individualized Education Programs with goals
4. **Interventions** - Therapy/intervention plans
5. **Reports** - Generated clinical reports
6. **Messages** - Communication between clinicians and parents

---

## 📂 WORKING DIRECTORY

```
/Users/anikaet/Downloads/Jiveesha-Clinical/backend/
```

---

## 📝 TASK INSTRUCTIONS

### Step 1: Open Prisma Schema

**File:** `prisma/schema.prisma`

**Action:** Open the file. You should see the models added in 1-A1 at the end.

---

### Step 2: Add Clinical Models

**Action:** Add these models AFTER the Notification model (at the end of file):

```prisma
// ============================================
// ASSESSMENTS - Added in 1-A2
// ============================================

model Assessment {
  id                    String    @id @default(uuid())
  patientId             String    @map("patient_id")
  clinicianId           String    @map("clinician_id")
  assessmentType        String    @map("assessment_type") // ISAA, ADHD, GLAD, ASD-Deep-Dive
  status                String    @default("in_progress") // in_progress, completed, abandoned
  
  // Progress tracking
  responses             Json      @default("{}")
  currentDomain         String?   @map("current_domain")
  currentQuestion       Int?      @map("current_question")
  totalQuestions        Int?      @map("total_questions")
  
  // Scoring
  totalScore            Int?      @map("total_score")
  domainScores          Json?     @map("domain_scores") // {social: 18, motor: 56, communication: 20}
  interpretation        String?   @db.Text
  severityLevel         String?   @map("severity_level") // Mild, Moderate, Severe
  dsm5Criteria          Json?     @map("dsm5_criteria")
  recommendations       String?   @db.Text
  
  // Metadata
  administeredBy        String    @map("administered_by")
  administeredDate      DateTime? @map("administered_date")
  duration              Int?      // in minutes
  completedAt           DateTime? @map("completed_at")
  baselineAssessmentId  String?   @map("baseline_assessment_id")
  
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")

  patient               Patient   @relation(fields: [patientId], references: [id], onDelete: Cascade)
  clinician             User      @relation(fields: [clinicianId], references: [id])
  evidence              AssessmentEvidence[]
  
  @@index([patientId])
  @@index([clinicianId])
  @@index([assessmentType])
  @@index([status])
  @@map("assessments")
}

model AssessmentEvidence {
  id                    String    @id @default(uuid())
  assessmentId          String    @map("assessment_id")
  evidenceType          String    @map("evidence_type") // video, photo, document, audio
  fileName              String    @map("file_name")
  fileUrl               String    @map("file_url")
  fileSize              Int?      @map("file_size")
  description           String?   @db.Text
  timestamp             String?   // Timestamp in video/audio
  uploadedAt            DateTime  @default(now()) @map("uploaded_at")

  assessment            Assessment @relation(fields: [assessmentId], references: [id], onDelete: Cascade)
  
  @@map("assessment_evidence")
}

// ============================================
// IEP SYSTEM - Added in 1-A2
// ============================================

model IEP {
  id                    String    @id @default(uuid())
  patientId             String    @map("patient_id")
  academicYear          String    @map("academic_year") // 2024-2025
  status                String    @default("draft") // draft, active, archived, expired
  
  // PLOP (Present Levels of Performance)
  academicPerformance   String?   @map("academic_performance") @db.Text
  functionalPerformance String?   @map("functional_performance") @db.Text
  strengths             String?   @db.Text
  concerns              String?   @db.Text
  impactOfDisability    String?   @map("impact_of_disability") @db.Text
  
  // Educational Placement
  placementType         String?   @map("placement_type") // General Ed, Resource Room, Self-contained
  placementPercentage   Int?      @map("placement_percentage") // % in general ed
  placementJustification String?  @map("placement_justification") @db.Text
  lreJustification      String?   @map("lre_justification") @db.Text
  
  // School Info
  schoolName            String?   @map("school_name")
  grade                 String?
  teacher               String?
  
  // Dates
  startDate             DateTime  @map("start_date") @db.Date
  endDate               DateTime  @map("end_date") @db.Date
  nextReviewDate        DateTime? @map("next_review_date") @db.Date
  lastReviewDate        DateTime? @map("last_review_date") @db.Date
  
  // Progress
  overallProgress       Int       @default(0) @map("overall_progress") // 0-100
  
  // Signatures
  signedByParent        Boolean   @default(false) @map("signed_by_parent")
  parentSignedAt        DateTime? @map("parent_signed_at")
  parentSignature       String?   @map("parent_signature")
  
  signedByClinician     Boolean   @default(false) @map("signed_by_clinician")
  clinicianSignedAt     DateTime? @map("clinician_signed_at")
  clinicianSignature    String?   @map("clinician_signature")
  
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")
  
  patient               Patient   @relation(fields: [patientId], references: [id], onDelete: Cascade)
  goals                 IEPGoal[]
  accommodations        IEPAccommodation[]
  services              IEPService[]
  teamMembers           IEPTeamMember[]
  progressReports       IEPProgressReport[]
  
  @@index([patientId])
  @@index([status])
  @@index([academicYear])
  @@map("ieps")
}

model IEPGoal {
  id                    String    @id @default(uuid())
  iepId                 String    @map("iep_id")
  goalNumber            Int       @map("goal_number")
  domain                String    // Communication, Academic-Reading, Academic-Math, Social-Emotional, Motor
  priority              String    // High, Medium, Low
  
  goalStatement         String    @map("goal_statement") @db.Text
  baselineData          String    @map("baseline_data") @db.Text
  targetCriteria        String    @map("target_criteria") @db.Text
  targetDate            DateTime? @map("target_date") @db.Date
  measurementMethod     String?   @map("measurement_method") @db.Text
  
  currentProgress       Int       @default(0) @map("current_progress") // 0-100
  progressStatus        String    @default("not_started") @map("progress_status")
  
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")
  
  iep                   IEP       @relation(fields: [iepId], references: [id], onDelete: Cascade)
  objectives            IEPObjective[]
  progressUpdates       GoalProgressUpdate[]
  
  @@map("iep_goals")
}

model IEPObjective {
  id                    String    @id @default(uuid())
  goalId                String    @map("goal_id")
  objectiveNumber       Int       @map("objective_number")
  objectiveText         String    @map("objective_text") @db.Text
  criteria              String?   @db.Text
  targetDate            DateTime? @map("target_date") @db.Date
  status                String    @default("not_started")
  achievedDate          DateTime? @map("achieved_date") @db.Date
  
  goal                  IEPGoal   @relation(fields: [goalId], references: [id], onDelete: Cascade)
  
  @@map("iep_objectives")
}

model GoalProgressUpdate {
  id                    String    @id @default(uuid())
  goalId                String    @map("goal_id")
  updateDate            DateTime  @map("update_date") @db.Date
  progressPercentage    Int       @map("progress_percentage")
  status                String    // on_track, needs_support, regressing
  notes                 String?   @db.Text
  evidence              String?   @db.Text
  updatedBy             String    @map("updated_by")
  
  goal                  IEPGoal   @relation(fields: [goalId], references: [id], onDelete: Cascade)
  
  @@index([goalId])
  @@map("goal_progress_updates")
}

model IEPAccommodation {
  id                    String    @id @default(uuid())
  iepId                 String    @map("iep_id")
  category              String    // Environmental, Instructional, Assessment, Assistive Technology
  accommodationText     String    @map("accommodation_text") @db.Text
  frequency             String?
  
  iep                   IEP       @relation(fields: [iepId], references: [id], onDelete: Cascade)
  
  @@map("iep_accommodations")
}

model IEPService {
  id                    String    @id @default(uuid())
  iepId                 String    @map("iep_id")
  serviceName           String    @map("service_name")
  provider              String?
  frequency             String
  duration              Int       // minutes per session
  serviceType           String    @map("service_type") // Direct, Consultation
  setting               String
  
  startDate             DateTime  @map("start_date") @db.Date
  endDate               DateTime  @map("end_date") @db.Date
  sessionsCompleted     Int       @default(0) @map("sessions_completed")
  totalSessionsPlanned  Int?      @map("total_sessions_planned")
  
  iep                   IEP       @relation(fields: [iepId], references: [id], onDelete: Cascade)
  
  @@map("iep_services")
}

model IEPTeamMember {
  id                    String    @id @default(uuid())
  iepId                 String    @map("iep_id")
  memberType            String    @map("member_type")
  name                  String
  role                  String
  email                 String?
  phone                 String?
  organization          String?
  signed                Boolean   @default(false)
  signedAt              DateTime? @map("signed_at")
  signature             String?
  
  iep                   IEP       @relation(fields: [iepId], references: [id], onDelete: Cascade)
  
  @@map("iep_team_members")
}

model IEPProgressReport {
  id                    String    @id @default(uuid())
  iepId                 String    @map("iep_id")
  reportDate            DateTime  @map("report_date") @db.Date
  reportingPeriod       String    @map("reporting_period")
  overallProgress       Int       @map("overall_progress")
  summary               String    @db.Text
  createdBy             String    @map("created_by")
  createdAt             DateTime  @default(now()) @map("created_at")
  
  iep                   IEP       @relation(fields: [iepId], references: [id], onDelete: Cascade)
  
  @@map("iep_progress_reports")
}

// ============================================
// INTERVENTIONS - Added in 1-A2
// ============================================

model Intervention {
  id                    String    @id @default(uuid())
  patientId             String    @map("patient_id")
  clinicianId           String    @map("clinician_id")
  
  interventionName      String    @map("intervention_name")
  protocol              String?   // PECS, ABA, Orton-Gillingham
  focus                 String    @db.Text
  targetBehaviors       String?   @map("target_behaviors") @db.Text
  status                String    @default("active")
  
  frequency             String?
  duration              Int?
  totalSessions         Int?      @map("total_sessions")
  sessionsCompleted     Int       @default(0) @map("sessions_completed")
  
  provider              String?
  providerRole          String?   @map("provider_role")
  
  startDate             DateTime  @map("start_date") @db.Date
  endDate               DateTime? @map("end_date") @db.Date
  targetCompletionDate  DateTime? @map("target_completion_date") @db.Date
  
  overallProgress       Int       @default(0) @map("overall_progress")
  linkedIEPGoalId       String?   @map("linked_iep_goal_id")
  
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")
  
  patient               Patient   @relation(fields: [patientId], references: [id], onDelete: Cascade)
  clinician             User      @relation(fields: [clinicianId], references: [id])
  strategies            InterventionStrategy[]
  progressTracking      InterventionProgress[]
  
  @@index([patientId])
  @@index([clinicianId])
  @@index([status])
  @@map("interventions")
}

model InterventionStrategy {
  id                    String    @id @default(uuid())
  interventionId        String    @map("intervention_id")
  strategyName          String    @map("strategy_name")
  strategyText          String    @map("strategy_text") @db.Text
  implementation        String    @db.Text
  frequency             String?
  
  intervention          Intervention @relation(fields: [interventionId], references: [id], onDelete: Cascade)
  
  @@map("intervention_strategies")
}

model InterventionProgress {
  id                    String    @id @default(uuid())
  interventionId        String    @map("intervention_id")
  updateDate            DateTime  @map("update_date") @db.Date
  progressNote          String    @map("progress_note") @db.Text
  sessionCount          Int?      @map("session_count")
  dataPoints            Json?     @map("data_points")
  attachments           String?   @db.Text
  updatedBy             String    @map("updated_by")
  
  intervention          Intervention @relation(fields: [interventionId], references: [id], onDelete: Cascade)
  
  @@index([interventionId])
  @@map("intervention_progress")
}

// ============================================
// REPORTS - Added in 1-A2
// ============================================

model Report {
  id                    String    @id @default(uuid())
  patientId             String    @map("patient_id")
  clinicianId           String    @map("clinician_id")
  
  reportType            String    @map("report_type") // Diagnostic, Progress, IEP-Summary
  title                 String
  content               String    @db.Text
  sections              Json?
  
  fileUrl               String?   @map("file_url")
  fileName              String?   @map("file_name")
  status                String    @default("draft")
  
  linkedAssessmentId    String?   @map("linked_assessment_id")
  linkedIEPId           String?   @map("linked_iep_id")
  
  sharedWith            Json      @default("[]") @map("shared_with")
  shareLog              Json      @default("[]") @map("share_log")
  
  generatedAt           DateTime  @default(now()) @map("generated_at")
  lastModifiedAt        DateTime  @updatedAt @map("last_modified_at")
  
  patient               Patient   @relation(fields: [patientId], references: [id], onDelete: Cascade)
  clinician             User      @relation(fields: [clinicianId], references: [id])
  
  @@index([patientId])
  @@index([clinicianId])
  @@index([reportType])
  @@map("reports")
}

// ============================================
// MESSAGES - Added in 1-A2
// ============================================

model Conversation {
  id                    String    @id @default(uuid())
  participants          Json      // [{id, type, name, avatar}]
  patientId             String?   @map("patient_id")
  subject               String?
  lastMessageAt         DateTime? @map("last_message_at")
  
  createdAt             DateTime  @default(now()) @map("created_at")
  
  messages              Message[]
  
  @@index([patientId])
  @@map("conversations")
}

model Message {
  id                    String    @id @default(uuid())
  conversationId        String    @map("conversation_id")
  senderId              String    @map("sender_id")
  senderType            String    @map("sender_type") // clinician, parent
  senderName            String    @map("sender_name")
  
  recipientId           String    @map("recipient_id")
  recipientType         String    @map("recipient_type")
  
  body                  String    @db.Text
  attachments           Json?     @default("[]")
  
  isRead                Boolean   @default(false) @map("is_read")
  readAt                DateTime? @map("read_at")
  
  sentAt                DateTime  @default(now()) @map("sent_at")
  
  conversation          Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  
  @@index([conversationId])
  @@index([senderId])
  @@index([recipientId])
  @@index([isRead])
  @@map("messages")
}
```

---

### Step 3: Run Migration

**Commands:**
```bash
cd /Users/anikaet/Downloads/Jiveesha-Clinical/backend

npx prisma migrate dev --name add_clinical_models

npx prisma generate
```

**Expected Output:**
```
✔ Created migration: add_clinical_models
✔ Applied migration
✔ Generated Prisma Client

Database changes:
- Created 18 new tables
```

---

## ✅ SUCCESS CRITERIA

1. ✅ All 18 models added to schema
2. ✅ Migration runs without errors
3. ✅ Prisma Client regenerated
4. ✅ 18 new tables in database
5. ✅ Server starts: `npm run dev`

---

## 🧪 VERIFICATION

```bash
# Check tables
\dt

# Should see:
# - assessments
# - assessment_evidence
# - ieps
# - iep_goals
# - iep_objectives
# - goal_progress_updates
# - iep_accommodations
# - iep_services
# - iep_team_members
# - iep_progress_reports
# - interventions
# - intervention_strategies
# - intervention_progress
# - reports
# - conversations
# - messages
```

---

## ⏭️ NEXT PROMPT

**PHASE_1_B1_SESSIONS_CONTROLLER.md** - Create APIs for consultation sessions

---

**Mark complete and proceed to 1-B1** ✅
