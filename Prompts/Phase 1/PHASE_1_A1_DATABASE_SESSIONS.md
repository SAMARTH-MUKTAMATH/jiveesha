# PHASE 1-A1: DATABASE SESSIONS & JOURNAL MODELS
## Add Consultation Sessions, Journal, and Notifications to Database

**Prompt ID:** 1-A1  
**Phase:** 1 - Complete Clinician Backend  
**Section:** A - Database Foundation  
**Dependencies:** None (first prompt)  
**Estimated Time:** 15-20 minutes

---

## 🎯 OBJECTIVE

Add database models for:
1. **Consultation Sessions** - Track therapy/assessment sessions
2. **Session Attachments** - Files uploaded during sessions
3. **Session Participants** - Who attended sessions
4. **Session Templates** - Pre-defined note templates
5. **Journal Entries** - Patient observation journal
6. **Journal Attachments** - Evidence files for journal
7. **Notifications** - In-app notification system

---

## 📂 WORKING DIRECTORY

```
/Users/anikaet/Downloads/Jiveesha-Clinical/backend/
```

---

## 📝 TASK INSTRUCTIONS

### Step 1: Open Prisma Schema

**File:** `prisma/schema.prisma`

**Action:** Open this file. You'll see existing models like `User`, `ClinicianProfile`, `Patient`, etc.

---

### Step 2: Add New Models

**Action:** Scroll to the end of the file and add these models:

```prisma
// ============================================
// CONSULTATION SESSIONS - Added in 1-A1
// ============================================

model ConsultationSession {
  id                    String    @id @default(uuid())
  patientId             String    @map("patient_id")
  clinicianId           String    @map("clinician_id")
  sessionDate           DateTime  @map("session_date") @db.Date
  duration              Int       // in minutes
  sessionType           String    @map("session_type") // Speech Therapy, OT, Assessment, Follow-up
  format                String    // In-Person, Virtual, Phone
  location              String?
  notes                 String?   @db.Text
  
  // Linked records
  linkedGoalId          String?   @map("linked_goal_id")
  linkedInterventionId  String?   @map("linked_intervention_id")
  templateUsed          String?   @map("template_used")
  
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")

  patient               Patient   @relation(fields: [patientId], references: [id], onDelete: Cascade)
  clinician             User      @relation(fields: [clinicianId], references: [id])
  attachments           SessionAttachment[]
  participants          SessionParticipant[]
  
  @@index([patientId])
  @@index([clinicianId])
  @@index([sessionDate])
  @@map("consultation_sessions")
}

model SessionAttachment {
  id                    String    @id @default(uuid())
  sessionId             String    @map("session_id")
  fileType              String    @map("file_type") // video, photo, document, audio
  fileName              String    @map("file_name")
  fileUrl               String    @map("file_url")
  fileSize              Int?      @map("file_size")
  description           String?   @db.Text
  uploadedAt            DateTime  @default(now()) @map("uploaded_at")

  session               ConsultationSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  
  @@map("session_attachments")
}

model SessionParticipant {
  id                    String    @id @default(uuid())
  sessionId             String    @map("session_id")
  participantType       String    @map("participant_type") // parent, teacher, therapist, other
  participantName       String    @map("participant_name")
  
  session               ConsultationSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  
  @@map("session_participants")
}

model SessionTemplate {
  id                    String    @id @default(uuid())
  name                  String
  sessionType           String    @map("session_type")
  templateContent       String    @map("template_content") @db.Text
  createdBy             String    @map("created_by")
  isGlobal              Boolean   @default(false) @map("is_global") // True = available to all clinicians
  
  createdAt             DateTime  @default(now()) @map("created_at")
  
  @@map("session_templates")
}

// ============================================
// PATIENT JOURNAL - Added in 1-A1
// ============================================

model JournalEntry {
  id                    String    @id @default(uuid())
  patientId             String    @map("patient_id")
  entryType             String    @map("entry_type") // milestone, observation, concern, success, parent_note
  title                 String
  content               String    @db.Text
  tags                  Json      @default("[]") // [speech, motor, behavior]
  
  // Linking
  linkedSessionId       String?   @map("linked_session_id")
  linkedGoalId          String?   @map("linked_goal_id")
  linkedInterventionId  String?   @map("linked_intervention_id")
  
  // Metadata
  visibility            String    @default("clinician_only") // clinician_only, shared_with_parent
  createdBy             String    @map("created_by")
  createdByType         String    @map("created_by_type") // clinician, parent
  createdByName         String    @map("created_by_name")
  
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")
  
  patient               Patient   @relation(fields: [patientId], references: [id], onDelete: Cascade)
  attachments           JournalAttachment[]
  
  @@index([patientId])
  @@index([entryType])
  @@index([createdAt])
  @@map("journal_entries")
}

model JournalAttachment {
  id                    String    @id @default(uuid())
  entryId               String    @map("entry_id")
  fileType              String    @map("file_type") // photo, video, document, audio
  fileName              String    @map("file_name")
  fileUrl               String    @map("file_url")
  fileSize              Int?      @map("file_size")
  
  entry                 JournalEntry @relation(fields: [entryId], references: [id], onDelete: Cascade)
  
  @@map("journal_attachments")
}

// ============================================
// NOTIFICATIONS - Added in 1-A1
// ============================================

model Notification {
  id                    String    @id @default(uuid())
  userId                String    @map("user_id")
  userType              String    @map("user_type") // clinician, parent, admin
  
  notificationType      String    @map("notification_type") // appointment_reminder, assessment_complete, message_received, consent_granted
  title                 String
  message               String    @db.Text
  actionUrl             String?   @map("action_url") // Deep link to relevant page
  actionData            Json?     @map("action_data") // Additional context
  
  priority              String    @default("normal") // low, normal, high, urgent
  category              String?   // appointments, messages, assessments, system
  
  isRead                Boolean   @default(false) @map("is_read")
  readAt                DateTime? @map("read_at")
  
  sentVia               Json      @default("[]") @map("sent_via") // [in_app, email, sms]
  
  createdAt             DateTime  @default(now()) @map("created_at")
  expiresAt             DateTime? @map("expires_at")
  
  @@index([userId, userType])
  @@index([isRead])
  @@index([notificationType])
  @@index([createdAt])
  @@map("notifications")
}
```

**Important Notes:**
- These models reference `Patient` and `User` which already exist
- `@map()` provides snake_case database column names
- `@index()` improves query performance
- `onDelete: Cascade` ensures cleanup when parent records are deleted

---

### Step 3: Run Database Migration

**Commands:**
```bash
cd /Users/anikaet/Downloads/Jiveesha-Clinical/backend

# Generate migration
npx prisma migrate dev --name add_sessions_journal_notifications

# Generate Prisma Client
npx prisma generate
```

**Expected Output:**
```
✔ Prisma Migrate applied the migration successfully
✔ Generated Prisma Client

Database schema changes:
- Created table "consultation_sessions"
- Created table "session_attachments"
- Created table "session_participants"
- Created table "session_templates"
- Created table "journal_entries"
- Created table "journal_attachments"
- Created table "notifications"
```

---

### Step 4: Verify Database Tables

**Command:**
```bash
# Connect to database
psql postgresql://postgres:password@localhost:5432/daira_dev

# List tables
\dt

# Should see new tables:
# - consultation_sessions
# - session_attachments
# - session_participants
# - session_templates
# - journal_entries
# - journal_attachments
# - notifications
```

---

## ✅ SUCCESS CRITERIA

**This prompt is complete when:**

1. ✅ All 7 new models added to `schema.prisma`
2. ✅ Migration runs without errors
3. ✅ Prisma Client regenerated successfully
4. ✅ New tables visible in database (`\dt` shows them)
5. ✅ No TypeScript compilation errors
6. ✅ Server can still start: `npm run dev`

---

## 🧪 VERIFICATION TESTS

### Test 1: Check Schema File
```bash
# Check that models were added
grep -A 5 "model ConsultationSession" prisma/schema.prisma
grep -A 5 "model JournalEntry" prisma/schema.prisma
grep -A 5 "model Notification" prisma/schema.prisma
```

**Expected:** Should show the model definitions

### Test 2: Verify Prisma Client
```bash
# Check generated types
cat node_modules/.prisma/client/index.d.ts | grep "ConsultationSession"
```

**Expected:** Should show TypeScript type definitions

### Test 3: Test Database Connection
```bash
# Start server
npm run dev

# Should start without errors
# Check terminal output for: "🚀 Daira Backend Server running"
```

---

## 🐛 TROUBLESHOOTING

### Issue: "Migration failed"
**Solution:** Check PostgreSQL is running
```bash
pg_isready
# If not ready: brew services start postgresql
```

### Issue: "Foreign key constraint failed"
**Solution:** Make sure `Patient` and `User` models exist in schema
```bash
grep "model Patient" prisma/schema.prisma
grep "model User" prisma/schema.prisma
```

### Issue: "Column already exists"
**Solution:** Previous migration may have partially applied
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset
# Then retry migration
```

---

## 📊 DATABASE CHANGES SUMMARY

**Tables Added:** 7
- `consultation_sessions` (main session records)
- `session_attachments` (files linked to sessions)
- `session_participants` (who attended sessions)
- `session_templates` (note templates)
- `journal_entries` (patient observations)
- `journal_attachments` (evidence files)
- `notifications` (user notifications)

**Relationships Created:**
- ConsultationSession → Patient (many-to-one)
- ConsultationSession → User/Clinician (many-to-one)
- SessionAttachment → ConsultationSession (many-to-one)
- SessionParticipant → ConsultationSession (many-to-one)
- JournalEntry → Patient (many-to-one)
- JournalAttachment → JournalEntry (many-to-one)

**Indexes Added:** 8 (for query performance)

---

## 📝 NOTES FOR NEXT PROMPTS

**What This Enables:**
- Prompt 1-B1 will create APIs for consultation sessions
- Prompt 1-B2 will create APIs for journal entries
- Other prompts will link sessions to goals/interventions

**Files Modified:**
- ✅ `prisma/schema.prisma` - Schema updated
- ✅ `prisma/migrations/` - New migration created
- ✅ `node_modules/.prisma/client/` - Types regenerated

**What's NOT Done Yet:**
- ❌ API controllers (coming in 1-B1, 1-B2)
- ❌ Routes (coming in 1-B1, 1-B2)
- ❌ Frontend integration (coming in Phase 3)

---

## ⏭️ NEXT PROMPT

After completing this prompt successfully, proceed to:
**PHASE_1_A2_CLINICAL_MODELS.md**

This will add: Assessments, IEP, Interventions, Reports, Messages models.

---

**Completion Checklist:**
- [ ] Schema file updated
- [ ] Migration executed
- [ ] Prisma Client generated
- [ ] Tables created in database
- [ ] Server starts without errors
- [ ] Ready for next prompt

**Mark this prompt complete and move to 1-A2** ✅
