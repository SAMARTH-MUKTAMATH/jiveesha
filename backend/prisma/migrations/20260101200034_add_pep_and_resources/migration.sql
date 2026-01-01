-- CreateTable
CREATE TABLE "peps" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "parent_id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "plan_name" TEXT NOT NULL,
    "focusAreas" TEXT NOT NULL DEFAULT '[]',
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME,
    "linked_iep_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "overall_progress" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "parent_notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "peps_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "parents" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "peps_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "peps_linked_iep_id_fkey" FOREIGN KEY ("linked_iep_id") REFERENCES "ieps" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pep_goals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pep_id" TEXT NOT NULL,
    "goal_number" INTEGER NOT NULL,
    "domain" TEXT NOT NULL,
    "goal_statement" TEXT NOT NULL,
    "linked_iep_goal_id" TEXT,
    "target_date" DATETIME,
    "target_criteria" TEXT,
    "current_progress" INTEGER NOT NULL DEFAULT 0,
    "progress_status" TEXT NOT NULL DEFAULT 'not_started',
    "milestones" TEXT NOT NULL DEFAULT '[]',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "pep_goals_pep_id_fkey" FOREIGN KEY ("pep_id") REFERENCES "peps" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "pep_goals_linked_iep_goal_id_fkey" FOREIGN KEY ("linked_iep_goal_id") REFERENCES "iep_goals" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pep_activities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pep_id" TEXT NOT NULL,
    "goal_id" TEXT,
    "activity_name" TEXT NOT NULL,
    "activity_type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "instructions" TEXT,
    "materials" TEXT,
    "duration" INTEGER,
    "frequency" TEXT,
    "linked_resource_id" TEXT,
    "completion_count" INTEGER NOT NULL DEFAULT 0,
    "last_completed_at" DATETIME,
    "parent_notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "pep_activities_pep_id_fkey" FOREIGN KEY ("pep_id") REFERENCES "peps" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "pep_activities_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "pep_goals" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "pep_activities_linked_resource_id_fkey" FOREIGN KEY ("linked_resource_id") REFERENCES "resources" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "activity_completions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "activity_id" TEXT NOT NULL,
    "completed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER,
    "child_engagement" TEXT,
    "parent_observations" TEXT,
    "challenges_faced" TEXT,
    "successes_noted" TEXT,
    "photos" TEXT,
    "videos" TEXT,
    CONSTRAINT "activity_completions_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "pep_activities" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pep_goal_progress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "goal_id" TEXT NOT NULL,
    "update_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "progress_percentage" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "observations" TEXT,
    CONSTRAINT "pep_goal_progress_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "pep_goals" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "resources" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "resource_type" TEXT NOT NULL,
    "content_url" TEXT,
    "thumbnail_url" TEXT,
    "file_url" TEXT,
    "category" TEXT NOT NULL,
    "age_range" TEXT NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "difficulty" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "favorites" INTEGER NOT NULL DEFAULT 0,
    "author" TEXT,
    "source_url" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "peps_parent_id_idx" ON "peps"("parent_id");

-- CreateIndex
CREATE INDEX "peps_patient_id_idx" ON "peps"("patient_id");

-- CreateIndex
CREATE INDEX "peps_status_idx" ON "peps"("status");

-- CreateIndex
CREATE INDEX "pep_goals_pep_id_idx" ON "pep_goals"("pep_id");

-- CreateIndex
CREATE INDEX "pep_activities_pep_id_idx" ON "pep_activities"("pep_id");

-- CreateIndex
CREATE INDEX "pep_activities_goal_id_idx" ON "pep_activities"("goal_id");

-- CreateIndex
CREATE INDEX "activity_completions_activity_id_idx" ON "activity_completions"("activity_id");

-- CreateIndex
CREATE INDEX "activity_completions_completed_at_idx" ON "activity_completions"("completed_at");

-- CreateIndex
CREATE INDEX "pep_goal_progress_goal_id_idx" ON "pep_goal_progress"("goal_id");

-- CreateIndex
CREATE INDEX "resources_resource_type_idx" ON "resources"("resource_type");

-- CreateIndex
CREATE INDEX "resources_category_idx" ON "resources"("category");

-- CreateIndex
CREATE INDEX "resources_age_range_idx" ON "resources"("age_range");

-- CreateIndex
CREATE INDEX "resources_is_published_idx" ON "resources"("is_published");
