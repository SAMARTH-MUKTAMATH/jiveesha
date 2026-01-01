# PHASE 2-I1: PEP BUILDER MODELS
## Add Personalized Education Plan (PEP) Database Models

**Prompt ID:** 2-I1  
**Phase:** 2 - Parent Portal Backend  
**Section:** I - Parent Education & Resources  
**Dependencies:** Phase 2-F, 2-G, 2-H complete  
**Estimated Time:** 15-20 minutes

---

## 🎯 OBJECTIVE

Create PEP (Personalized Education Plan) database models:
- PEP model (parent-created home education plans)
- PEP goals and activities
- Progress tracking for home activities
- Resource library integration
- Activity completion tracking
- Parent notes and observations

**PEP vs IEP:**
- **IEP** = Clinician-created, formal, school-based
- **PEP** = Parent-created, informal, home-based
- PEP can link to IEP goals for alignment

---

## 📂 WORKING DIRECTORY

```
/Users/anikaet/Downloads/Jiveesha-Clinical/backend/
```

---

## 📝 TASK INSTRUCTIONS

### Step 1: Add PEP Models to Prisma Schema

**File:** `prisma/schema.prisma`

**Action:** APPEND these models to the end of the file:

```prisma
// ============================================
// PEP (PERSONALIZED EDUCATION PLAN) - Added in Phase 2-I1
// ============================================

model PEP {
  id                    String    @id @default(uuid())
  
  // Relationships
  parentId              String    @map("parent_id")
  patientId             String    @map("patient_id")
  
  // Plan details
  planName              String    @map("plan_name")
  focusAreas            Json      @default("[]") // ["communication", "social_skills", "motor_skills"]
  startDate             DateTime  @map("start_date")
  endDate               DateTime? @map("end_date")
  
  // Linked to professional IEP (optional)
  linkedIEPId           String?   @map("linked_iep_id")
  
  // Status
  status                String    @default("active") // active, completed, archived
  
  // Progress
  overallProgress       Int       @default(0) @map("overall_progress") // 0-100%
  
  // Notes
  description           String?   @db.Text
  parentNotes           String?   @db.Text @map("parent_notes")
  
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")
  
  parent                Parent    @relation(fields: [parentId], references: [id], onDelete: Cascade)
  patient               Patient   @relation(fields: [patientId], references: [id], onDelete: Cascade)
  linkedIEP             IEP?      @relation("PEPToIEP", fields: [linkedIEPId], references: [id])
  
  goals                 PEPGoal[]
  activities            PEPActivity[]
  
  @@index([parentId])
  @@index([patientId])
  @@index([status])
  @@map("peps")
}

model PEPGoal {
  id                    String    @id @default(uuid())
  pepId                 String    @map("pep_id")
  
  // Goal details
  goalNumber            Int       @map("goal_number")
  domain                String    // communication, social, academic, motor, self_care, behavior
  goalStatement         String    @db.Text @map("goal_statement")
  
  // Linked to professional IEP goal (optional)
  linkedIEPGoalId       String?   @map("linked_iep_goal_id")
  
  // Target
  targetDate            DateTime? @map("target_date")
  targetCriteria        String?   @db.Text @map("target_criteria")
  
  // Progress
  currentProgress       Int       @default(0) @map("current_progress") // 0-100%
  progressStatus        String    @default("not_started") @map("progress_status") // not_started, in_progress, achieved
  
  // Milestones
  milestones            Json      @default("[]") // [{name: "", completed: false, date: null}]
  
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")
  
  pep                   PEP       @relation(fields: [pepId], references: [id], onDelete: Cascade)
  linkedIEPGoal         IEPGoal?  @relation("PEPGoalToIEPGoal", fields: [linkedIEPGoalId], references: [id])
  
  activities            PEPActivity[]
  progressUpdates       PEPGoalProgress[]
  
  @@index([pepId])
  @@map("pep_goals")
}

model PEPActivity {
  id                    String    @id @default(uuid())
  pepId                 String    @map("pep_id")
  goalId                String?   @map("goal_id") // Optional link to specific goal
  
  // Activity details
  activityName          String    @map("activity_name")
  activityType          String    @map("activity_type") // home_activity, educational_game, sensory_play, reading, outdoor
  description           String    @db.Text
  
  // Instructions
  instructions          String?   @db.Text
  materials             Json?     // ["blocks", "paper", "crayons"]
  duration              Int?      // Duration in minutes
  frequency             String?   // "daily", "3x per week", etc.
  
  // Linked resource (optional)
  linkedResourceId      String?   @map("linked_resource_id")
  
  // Completion tracking
  completionCount       Int       @default(0) @map("completion_count")
  lastCompletedAt       DateTime? @map("last_completed_at")
  
  // Notes
  parentNotes           String?   @db.Text @map("parent_notes")
  
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")
  
  pep                   PEP       @relation(fields: [pepId], references: [id], onDelete: Cascade)
  goal                  PEPGoal?  @relation(fields: [goalId], references: [id], onDelete: SetNull)
  linkedResource        Resource? @relation(fields: [linkedResourceId], references: [id])
  
  completions           ActivityCompletion[]
  
  @@index([pepId])
  @@index([goalId])
  @@map("pep_activities")
}

model ActivityCompletion {
  id                    String    @id @default(uuid())
  activityId            String    @map("activity_id")
  
  completedAt           DateTime  @default(now()) @map("completed_at")
  duration              Int?      // Actual duration in minutes
  
  // Feedback
  childEngagement       String?   @map("child_engagement") // high, medium, low
  parentObservations    String?   @db.Text @map("parent_observations")
  challengesFaced       String?   @db.Text @map("challenges_faced")
  successesNoted        String?   @db.Text @map("successes_noted")
  
  // Media
  photos                Json?     // URLs to photos
  videos                Json?     // URLs to videos
  
  activity              PEPActivity @relation(fields: [activityId], references: [id], onDelete: Cascade)
  
  @@index([activityId])
  @@index([completedAt])
  @@map("activity_completions")
}

model PEPGoalProgress {
  id                    String    @id @default(uuid())
  goalId                String    @map("goal_id")
  
  updateDate            DateTime  @default(now()) @map("update_date")
  progressPercentage    Int       @map("progress_percentage") // 0-100
  status                String    // not_started, in_progress, achieved, regression
  
  notes                 String?   @db.Text
  observations          String?   @db.Text
  
  goal                  PEPGoal   @relation(fields: [goalId], references: [id], onDelete: Cascade)
  
  @@index([goalId])
  @@map("pep_goal_progress")
}

// ============================================
// RESOURCE LIBRARY - Added in Phase 2-I1
// ============================================

model Resource {
  id                    String    @id @default(uuid())
  
  // Resource details
  title                 String
  description           String    @db.Text
  resourceType          String    @map("resource_type") // article, video, activity, worksheet, app, book
  
  // Content
  contentUrl            String?   @map("content_url")
  thumbnailUrl          String?   @map("thumbnail_url")
  fileUrl               String?   @map("file_url")
  
  // Categorization
  category              String    // communication, social_skills, motor_development, etc.
  ageRange              String    @map("age_range") // "0-2", "2-4", "4-6", "6-12", "12+"
  tags                  Json      @default("[]") // ["autism", "speech", "nonverbal"]
  
  // Difficulty
  difficulty            String?   // beginner, intermediate, advanced
  
  // Engagement
  views                 Int       @default(0)
  favorites             Int       @default(0)
  
  // Source
  author                String?
  sourceUrl             String?   @map("source_url")
  
  // Status
  isPublished           Boolean   @default(true) @map("is_published")
  isFeatured            Boolean   @default(false) @map("is_featured")
  
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")
  
  activities            PEPActivity[]
  
  @@index([resourceType])
  @@index([category])
  @@index([ageRange])
  @@index([isPublished])
  @@map("resources")
}
```

---

### Step 2: Update Related Models

**File:** `prisma/schema.prisma`

**Action:** Update these models to add PEP relations:

**Find IEP model and ADD:**
```prisma
model IEP {
  // ... existing fields ...
  
  linkedPEPs            PEP[] @relation("PEPToIEP") // Add this line
  
  // ... rest of existing relations ...
}
```

**Find IEPGoal model and ADD:**
```prisma
model IEPGoal {
  // ... existing fields ...
  
  linkedPEPGoals        PEPGoal[] @relation("PEPGoalToIEPGoal") // Add this line
  
  // ... rest of existing relations ...
}
```

**Find Patient model and ADD:**
```prisma
model Patient {
  // ... existing fields ...
  
  peps                  PEP[] // Add this line
  
  // ... rest of existing relations ...
}
```

---

### Step 3: Run Migration

**Commands:**
```bash
cd backend
npx prisma migrate dev --name add_pep_and_resources
npx prisma generate
```

**Expected Output:**
```
✔ Prisma Migrate applied the migration
✔ Generated Prisma Client

Database changes:
- Created table "peps"
- Created table "pep_goals"
- Created table "pep_activities"
- Created table "activity_completions"
- Created table "pep_goal_progress"
- Created table "resources"
- Updated table "iep" (added relation)
- Updated table "iep_goals" (added relation)
- Updated table "patients" (added relation)
```

---

### Step 4: Create Sample Resource Seed Data

**File:** `prisma/seed-resources.ts`

**Action:** Create this NEW file:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleResources = [
  {
    title: "Picture Exchange Communication System (PECS) Starter Guide",
    description: "Learn how to implement PECS at home to help your child communicate their needs using picture cards.",
    resourceType: "article",
    category: "communication",
    ageRange: "2-6",
    difficulty: "beginner",
    tags: ["nonverbal", "AAC", "communication"],
    author: "Speech Therapy Resources",
    contentUrl: "https://example.com/pecs-guide",
    isPublished: true,
    isFeatured: true
  },
  {
    title: "Social Stories for Autism - Daily Routines",
    description: "Collection of social stories to help children understand and navigate daily routines like brushing teeth, getting dressed, and mealtime.",
    resourceType: "worksheet",
    category: "social_skills",
    ageRange: "4-8",
    difficulty: "beginner",
    tags: ["autism", "routines", "visual_supports"],
    author: "Autism Teaching Resources",
    isPublished: true,
    isFeatured: true
  },
  {
    title: "Sensory Play Activities for Home",
    description: "50+ sensory play ideas using household items to support sensory development and regulation.",
    resourceType: "activity",
    category: "motor_development",
    ageRange: "2-6",
    difficulty: "beginner",
    tags: ["sensory", "play", "fine_motor"],
    author: "OT Parent Resources",
    isPublished: true
  },
  {
    title: "Turn-Taking Games for Social Skills",
    description: "Simple games and activities to practice turn-taking and joint attention at home.",
    resourceType: "activity",
    category: "social_skills",
    ageRange: "3-7",
    difficulty: "intermediate",
    tags: ["social_skills", "play", "games"],
    isPublished: true
  },
  {
    title: "Visual Schedule Creator App",
    description: "Free app to create visual schedules and timers for daily routines.",
    resourceType: "app",
    category: "behavior",
    ageRange: "2-12",
    difficulty: "beginner",
    tags: ["visual_supports", "routines", "technology"],
    author: "Assistive Tech Solutions",
    contentUrl: "https://example.com/visual-schedule-app",
    isPublished: true,
    isFeatured: true
  }
];

async function seedResources() {
  console.log('Seeding resource library...');
  
  for (const resource of sampleResources) {
    await prisma.resource.create({
      data: resource
    });
  }
  
  console.log(`Seeded ${sampleResources.length} resources`);
}

async function main() {
  await seedResources();
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
npx ts-node prisma/seed-resources.ts
```

---

### Step 5: Verify Database Schema

**Commands:**
```bash
# Check tables
psql daira_dev -c "\dt pep*"
psql daira_dev -c "\dt resources"
psql daira_dev -c "\dt activity_completions"

# Check resource count
psql daira_dev -c "SELECT COUNT(*) FROM resources;"

# Check table structure
psql daira_dev -c "\d peps"
```

**Expected:**
- 5 PEP-related tables created
- 1 resources table created
- 5 sample resources seeded

---

## ✅ SUCCESS CRITERIA

1. ✅ PEP model added to schema
2. ✅ PEPGoal model added
3. ✅ PEPActivity model added
4. ✅ ActivityCompletion model added
5. ✅ PEPGoalProgress model added
6. ✅ Resource model added
7. ✅ IEP and Patient models updated with relations
8. ✅ Migration runs successfully
9. ✅ All database tables created
10. ✅ Sample resources seeded

---

## 📊 DATABASE SCHEMA SUMMARY

**PEP System:**
- **PEP** - Parent-created education plan
- **PEPGoal** - Home-based goals (can link to IEP goals)
- **PEPActivity** - Activities to support goals
- **ActivityCompletion** - Track each time activity is done
- **PEPGoalProgress** - Track progress over time

**Resource Library:**
- **Resource** - Library of activities, articles, videos, worksheets
- Tagged and categorized for easy discovery
- Can be linked to PEP activities

**Key Features:**
- PEP can link to professional IEP for alignment
- PEP goals can link to IEP goals
- Activities can link to resource library
- Complete activity tracking with observations
- Progress tracking over time

---

## 🧪 VERIFICATION TESTS

### Test 1: Check Schema
```bash
grep -A 30 "model PEP {" prisma/schema.prisma
```

### Test 2: Check Database
```bash
psql daira_dev -c "SELECT table_name FROM information_schema.tables WHERE table_name LIKE 'pep%' OR table_name = 'resources';"
```

### Test 3: Check Resources
```bash
psql daira_dev -c "SELECT title, resource_type, category FROM resources;"
```

---

## ⏭️ NEXT PROMPT

**PHASE_2_I2** - PEP Builder & Resources API (FINAL Phase 2 prompt!)

---

**Files Created:**
- ✅ `prisma/seed-resources.ts`

**Files Modified:**
- ✅ `prisma/schema.prisma` (6 new models, 3 model updates)

**Mark complete and proceed to 2-I2** ✅
