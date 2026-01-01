# PHASE 2-H1: PARENT SCREENING MODELS
## Add Parent-Led Screening Database Models (M-CHAT, ASQ, etc.)

**Prompt ID:** 2-H1  
**Phase:** 2 - Parent Portal Backend  
**Section:** H - Parent Screening  
**Dependencies:** Phase 2-F and 2-G complete  
**Estimated Time:** 15-20 minutes

---

## 🎯 OBJECTIVE

Create **MODULAR** parent screening database models designed for easy replacement:
- Generic ParentScreening model (screening-type agnostic)
- Flexible JSON schema for responses (no hardcoded questions)
- Plugin-style question banks (M-CHAT, ASQ as examples)
- Swappable scoring engines
- Risk level determination
- Follow-up recommendations

**MODULARITY NOTES:**
- Models are generic - can support ANY screening type
- Question banks are separate reference tables (easy to add/remove)
- Responses stored as JSON (no schema changes needed)
- Scoring logic isolated in separate utility (swappable)
- New screening types can be added without migration

---

## 📂 WORKING DIRECTORY

```
/Users/anikaet/Downloads/Jiveesha-Clinical/backend/
```

---

## 📝 TASK INSTRUCTIONS

### Step 1: Add Parent Screening Models to Prisma Schema

**File:** `prisma/schema.prisma`

**Action:** APPEND these models to the end of the file:

```prisma
// ============================================
// PARENT SCREENING - Added in Phase 2-H1
// ============================================

model ParentScreening {
  id                    String    @id @default(uuid())
  
  // Relationships
  parentId              String    @map("parent_id")
  patientId             String    @map("patient_id")
  
  // Screening details
  screeningType         String    @map("screening_type") // M-CHAT-R, M-CHAT-F, ASQ-3, ASQ-SE-2
  ageAtScreening        Int       @map("age_at_screening") // Age in months
  
  // Progress
  status                String    @default("in_progress") // in_progress, completed, abandoned
  currentQuestion       Int       @default(1) @map("current_question")
  totalQuestions        Int       @map("total_questions")
  
  // Responses
  responses             Json      @default("{}") // {question_id: answer}
  
  // Results (calculated after completion)
  totalScore            Int?      @map("total_score")
  riskLevel             String?   @map("risk_level") // low, medium, high
  screenerResult        String?   @map("screener_result") // pass, fail, follow_up_needed
  
  // Recommendations
  recommendations       Json?     // Auto-generated based on score
  followUpRequired      Boolean   @default(false) @map("follow_up_required")
  professionalReferral  Boolean   @default(false) @map("professional_referral")
  
  // M-CHAT specific fields
  mchatInitialScore     Int?      @map("mchat_initial_score")
  mchatFollowUpScore    Int?      @map("mchat_follow_up_score")
  
  // Timestamps
  startedAt             DateTime  @default(now()) @map("started_at")
  completedAt           DateTime? @map("completed_at")
  
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")
  
  parent                Parent    @relation(fields: [parentId], references: [id], onDelete: Cascade)
  patient               Patient   @relation(fields: [patientId], references: [id], onDelete: Cascade)
  
  @@index([parentId])
  @@index([patientId])
  @@index([screeningType])
  @@index([status])
  @@map("parent_screenings")
}

model ScreeningResponse {
  id                    String    @id @default(uuid())
  screeningId           String    @map("screening_id")
  
  questionId            String    @map("question_id")
  questionText          String    @db.Text @map("question_text")
  answer                String    // yes, no, sometimes, etc.
  answerValue           Int       @map("answer_value") // Numerical value for scoring
  
  // For follow-up questions
  isFollowUp            Boolean   @default(false) @map("is_follow_up")
  parentFollowUpAnswer  String?   @map("parent_follow_up_answer") @db.Text
  
  answeredAt            DateTime  @default(now()) @map("answered_at")
  
  @@index([screeningId])
  @@map("screening_responses")
}

// M-CHAT Question Bank (Reference Data)
model MChatQuestion {
  id                    String    @id @default(uuid())
  questionNumber        Int       @map("question_number")
  questionText          String    @db.Text @map("question_text")
  
  // Question type
  isInitialScreener     Boolean   @default(true) @map("is_initial_screener")
  isFollowUp            Boolean   @default(false) @map("is_follow_up")
  
  // Scoring
  criticalItem          Boolean   @default(false) @map("critical_item")
  scoringKey            String    @map("scoring_key") // Which answer indicates risk (yes/no)
  
  // Follow-up details
  followUpPrompt        String?   @db.Text @map("follow_up_prompt")
  
  createdAt             DateTime  @default(now()) @map("created_at")
  
  @@unique([questionNumber, isInitialScreener])
  @@map("mchat_questions")
}

// ASQ-3 Question Bank (Reference Data)
model ASQQuestion {
  id                    String    @id @default(uuid())
  ageRange              String    @map("age_range") // "2-months", "4-months", etc.
  domain                String    // communication, gross_motor, fine_motor, problem_solving, personal_social
  questionNumber        Int       @map("question_number")
  questionText          String    @db.Text @map("question_text")
  
  // Scoring
  yesValue              Int       @default(10) @map("yes_value")
  sometimesValue        Int       @default(5) @map("sometimes_value")
  notYetValue           Int       @default(0) @map("not_yet_value")
  
  createdAt             DateTime  @default(now()) @map("created_at")
  
  @@unique([ageRange, domain, questionNumber])
  @@map("asq_questions")
}
```

---

### Step 2: Update Related Models

**File:** `prisma/schema.prisma`

**Action:** Find the `Patient` model and ADD:

```prisma
model Patient {
  // ... existing fields ...
  
  parentScreenings      ParentScreening[] // Add this line
  
  // ... rest of existing relations ...
}
```

---

### Step 3: Run Migration

**Commands:**
```bash
cd backend
npx prisma migrate dev --name add_parent_screening_models
npx prisma generate
```

**Expected Output:**
```
✔ Prisma Migrate applied the migration
✔ Generated Prisma Client

Database changes:
- Created table "parent_screenings"
- Created table "screening_responses"
- Created table "mchat_questions"
- Created table "asq_questions"
- Updated table "patients" (added relation)
```

---

### Step 4: Create Screening Question Seed Data

**File:** `prisma/seed-screening-questions.ts`

**Action:** Create this NEW file with M-CHAT questions:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const mchatQuestions = [
  {
    questionNumber: 1,
    questionText: "If you point at something across the room, does your child look at it?",
    isInitialScreener: true,
    criticalItem: true,
    scoringKey: "no",
    followUpPrompt: "Does your child look when you point and say 'look at the ____'?"
  },
  {
    questionNumber: 2,
    questionText: "Have you ever wondered if your child might be deaf?",
    isInitialScreener: true,
    criticalItem: false,
    scoringKey: "yes"
  },
  {
    questionNumber: 3,
    questionText: "Does your child play pretend or make-believe?",
    isInitialScreener: true,
    criticalItem: true,
    scoringKey: "no",
    followUpPrompt: "Does your child pretend to talk on the phone, feed a doll, or pretend other things?"
  },
  {
    questionNumber: 4,
    questionText: "Does your child like climbing on things?",
    isInitialScreener: true,
    criticalItem: false,
    scoringKey: "no"
  },
  {
    questionNumber: 5,
    questionText: "Does your child make unusual finger movements near his or her eyes?",
    isInitialScreener: true,
    criticalItem: false,
    scoringKey: "yes"
  },
  {
    questionNumber: 6,
    questionText: "Does your child point with one finger to ask for something or to get help?",
    isInitialScreener: true,
    criticalItem: true,
    scoringKey: "no",
    followUpPrompt: "Does your child point to show you something interesting or to get your attention?"
  },
  {
    questionNumber: 7,
    questionText: "Does your child point with one finger to show you something interesting?",
    isInitialScreener: true,
    criticalItem: true,
    scoringKey: "no",
    followUpPrompt: "When you are looking at a book with your child, does he or she look at the pictures when you point to them?"
  },
  {
    questionNumber: 8,
    questionText: "Is your child interested in other children?",
    isInitialScreener: true,
    criticalItem: false,
    scoringKey: "no"
  },
  {
    questionNumber: 9,
    questionText: "Does your child show you things by bringing them to you or holding them up for you to see - not to get help, but just to share?",
    isInitialScreener: true,
    criticalItem: true,
    scoringKey: "no",
    followUpPrompt: "Does your child show you objects by holding them out or giving them to you?"
  },
  {
    questionNumber: 10,
    questionText: "Does your child respond when you call his or her name?",
    isInitialScreener: true,
    criticalItem: true,
    scoringKey: "no",
    followUpPrompt: "If you call your child's name from across the room, does your child look or turn toward you?"
  },
  {
    questionNumber: 11,
    questionText: "When you smile at your child, does he or she smile back at you?",
    isInitialScreener: true,
    criticalItem: false,
    scoringKey: "no"
  },
  {
    questionNumber: 12,
    questionText: "Does your child get upset by everyday noises?",
    isInitialScreener: true,
    criticalItem: false,
    scoringKey: "yes"
  },
  {
    questionNumber: 13,
    questionText: "Does your child walk?",
    isInitialScreener: true,
    criticalItem: false,
    scoringKey: "no"
  },
  {
    questionNumber: 14,
    questionText: "Does your child look you in the eye when you are talking to him or her, playing with him or her, or dressing him or her?",
    isInitialScreener: true,
    criticalItem: true,
    scoringKey: "no",
    followUpPrompt: "Does your child look at you when you call his or her name?"
  },
  {
    questionNumber: 15,
    questionText: "Does your child try to copy what you do?",
    isInitialScreener: true,
    criticalItem: false,
    scoringKey: "no"
  },
  {
    questionNumber: 16,
    questionText: "If you turn your head to look at something, does your child look around to see what you are looking at?",
    isInitialScreener: true,
    criticalItem: false,
    scoringKey: "no"
  },
  {
    questionNumber: 17,
    questionText: "Does your child try to get you to watch him or her?",
    isInitialScreener: true,
    criticalItem: false,
    scoringKey: "no"
  },
  {
    questionNumber: 18,
    questionText: "Does your child understand when you tell him or her to do something?",
    isInitialScreener: true,
    criticalItem: false,
    scoringKey: "no"
  },
  {
    questionNumber: 19,
    questionText: "If something new happens, does your child look at your face to see how you feel about it?",
    isInitialScreener: true,
    criticalItem: false,
    scoringKey: "no"
  },
  {
    questionNumber: 20,
    questionText: "Does your child like movement activities?",
    isInitialScreener: true,
    criticalItem: false,
    scoringKey: "no"
  }
];

async function seedMChatQuestions() {
  console.log('Seeding M-CHAT-R/F questions...');
  
  for (const question of mchatQuestions) {
    await prisma.mChatQuestion.upsert({
      where: {
        questionNumber_isInitialScreener: {
          questionNumber: question.questionNumber,
          isInitialScreener: question.isInitialScreener
        }
      },
      update: question,
      create: question
    });
  }
  
  console.log(`Seeded ${mchatQuestions.length} M-CHAT questions`);
}

async function seedASQQuestions() {
  console.log('Seeding ASQ-3 sample questions...');
  
  // Sample ASQ-3 questions for 24 months
  const asqSampleQuestions = [
    {
      ageRange: "24-months",
      domain: "communication",
      questionNumber: 1,
      questionText: "Without giving help by pointing or repeating the names, ask your child to \"Point to your nose,\" \"Point to your toes,\" and \"Point to your tummy.\" Does your child correctly point to all three?",
      yesValue: 10,
      sometimesValue: 5,
      notYetValue: 0
    },
    {
      ageRange: "24-months",
      domain: "gross_motor",
      questionNumber: 1,
      questionText: "Does your child kick a ball by swinging his or her leg forward without holding onto anything for support?",
      yesValue: 10,
      sometimesValue: 5,
      notYetValue: 0
    },
    {
      ageRange: "24-months",
      domain: "fine_motor",
      questionNumber: 1,
      questionText: "Does your child stack a small block or toy on top of another one?",
      yesValue: 10,
      sometimesValue: 5,
      notYetValue: 0
    },
    {
      ageRange: "24-months",
      domain: "problem_solving",
      questionNumber: 1,
      questionText: "If you put three small toys in front of your child, does he or she give you two when you ask for two?",
      yesValue: 10,
      sometimesValue: 5,
      notYetValue: 0
    },
    {
      ageRange: "24-months",
      domain: "personal_social",
      questionNumber: 1,
      questionText: "Does your child drink from a cup or glass, putting it down again with little spilling?",
      yesValue: 10,
      sometimesValue: 5,
      notYetValue: 0
    }
  ];
  
  for (const question of asqSampleQuestions) {
    await prisma.aSQQuestion.upsert({
      where: {
        ageRange_domain_questionNumber: {
          ageRange: question.ageRange,
          domain: question.domain,
          questionNumber: question.questionNumber
        }
      },
      update: question,
      create: question
    });
  }
  
  console.log(`Seeded ${asqSampleQuestions.length} ASQ-3 sample questions`);
}

async function main() {
  await seedMChatQuestions();
  await seedASQQuestions();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Run seed:**
```bash
npx ts-node prisma/seed-screening-questions.ts
```

---

### Step 5: Verify Database Schema

**Command:**
```bash
# Check tables
psql daira_dev -c "\dt parent_screenings"
psql daira_dev -c "\dt screening_responses"
psql daira_dev -c "\dt mchat_questions"
psql daira_dev -c "\dt asq_questions"

# Check question count
psql daira_dev -c "SELECT COUNT(*) FROM mchat_questions;"
```

**Expected:**
- 4 new tables created
- 20 M-CHAT questions seeded
- 5 ASQ sample questions seeded

---

## 🔧 MODULARITY & EXTENSIBILITY

**The screening system is designed to be plug-and-play:**

### Adding a NEW Screening Type (No Code Changes Needed!)
1. Add questions to reference table (mchat_questions, asq_questions, etc.)
2. Add scoring logic to `screening-scorer.ts` (new function)
3. Update `screeningType` enum in code (optional)
4. That's it! No database migrations needed.

### Removing/Replacing a Screening Type
1. Delete questions from reference table
2. Remove scoring function
3. No database changes - old screening records remain intact

### Why This Works
- `ParentScreening.responses` is JSON → accepts any structure
- `ParentScreening.screeningType` is string → accepts any value
- Question banks are separate → can be swapped independently
- Scoring functions are isolated → easy to modify/replace

### Real-World Validation Workflow
1. **Test Phase**: Add new screening as another type
2. **Compare**: Run both old and new in parallel
3. **Migrate**: Simple data update query if needed
4. **Remove**: Delete old question bank when ready

---

## ✅ SUCCESS CRITERIA

1. ✅ ParentScreening model added to schema
2. ✅ ScreeningResponse model added
3. ✅ MChatQuestion model added (reference data)
4. ✅ ASQQuestion model added (reference data)
5. ✅ Patient model updated with parentScreenings relation
6. ✅ Migration runs successfully
7. ✅ All database tables created
8. ✅ Seed script runs successfully
9. ✅ 20 M-CHAT questions in database
10. ✅ Sample ASQ questions in database

---

## 📊 DATABASE SCHEMA SUMMARY

**Table: parent_screenings**
- Tracks parent-administered screenings
- Supports M-CHAT-R/F, ASQ-3, ASQ:SE-2
- Auto-scoring with risk levels
- Follow-up recommendations

**Table: screening_responses**
- Individual question responses
- Follow-up answer tracking
- Timestamped responses

**Table: mchat_questions**
- M-CHAT-R/F question bank
- Critical item flagging
- Follow-up prompts

**Table: asq_questions**
- ASQ-3 question bank by age range
- Domain-specific questions
- Flexible scoring (yes/sometimes/not yet)

---

## 🧪 VERIFICATION TESTS

### Test 1: Check Models
```bash
grep -A 20 "model ParentScreening" prisma/schema.prisma
```

### Test 2: Check Migration
```bash
psql daira_dev -c "SELECT table_name FROM information_schema.tables WHERE table_name LIKE '%screening%';"
```

### Test 3: Count Questions
```bash
psql daira_dev -c "SELECT COUNT(*) as mchat_count FROM mchat_questions; SELECT COUNT(*) as asq_count FROM asq_questions;"
```

---

## ⏭️ NEXT PROMPT

**PHASE_2_H2** - Parent Screening API (start, save, complete, score)

---

**Files Created:**
- ✅ `prisma/seed-screening-questions.ts`

**Files Modified:**
- ✅ `prisma/schema.prisma` (4 new models)

**Mark complete and proceed to 2-H2** ✅
