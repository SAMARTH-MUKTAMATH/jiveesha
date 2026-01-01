/*
  Warnings:

  - Added the required column `administered_by` to the `assessments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clinician_id` to the `assessments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "assessment_evidence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assessment_id" TEXT NOT NULL,
    "evidence_type" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER,
    "description" TEXT,
    "timestamp" TEXT,
    "uploaded_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "assessment_evidence_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "assessments" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ieps" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patient_id" TEXT NOT NULL,
    "academic_year" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "academic_performance" TEXT,
    "functional_performance" TEXT,
    "strengths" TEXT,
    "concerns" TEXT,
    "impact_of_disability" TEXT,
    "placement_type" TEXT,
    "placement_percentage" INTEGER,
    "placement_justification" TEXT,
    "lre_justification" TEXT,
    "school_name" TEXT,
    "grade" TEXT,
    "teacher" TEXT,
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME NOT NULL,
    "next_review_date" DATETIME,
    "last_review_date" DATETIME,
    "overall_progress" INTEGER NOT NULL DEFAULT 0,
    "signed_by_parent" BOOLEAN NOT NULL DEFAULT false,
    "parent_signed_at" DATETIME,
    "parent_signature" TEXT,
    "signed_by_clinician" BOOLEAN NOT NULL DEFAULT false,
    "clinician_signed_at" DATETIME,
    "clinician_signature" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "ieps_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "iep_goals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "iep_id" TEXT NOT NULL,
    "goal_number" INTEGER NOT NULL,
    "domain" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "goal_statement" TEXT NOT NULL,
    "baseline_data" TEXT NOT NULL,
    "target_criteria" TEXT NOT NULL,
    "target_date" DATETIME,
    "measurement_method" TEXT,
    "current_progress" INTEGER NOT NULL DEFAULT 0,
    "progress_status" TEXT NOT NULL DEFAULT 'not_started',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "iep_goals_iep_id_fkey" FOREIGN KEY ("iep_id") REFERENCES "ieps" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "iep_objectives" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "goal_id" TEXT NOT NULL,
    "objective_number" INTEGER NOT NULL,
    "objective_text" TEXT NOT NULL,
    "criteria" TEXT,
    "target_date" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "achieved_date" DATETIME,
    CONSTRAINT "iep_objectives_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "iep_goals" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "goal_progress_updates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "goal_id" TEXT NOT NULL,
    "update_date" DATETIME NOT NULL,
    "progress_percentage" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "evidence" TEXT,
    "updated_by" TEXT NOT NULL,
    CONSTRAINT "goal_progress_updates_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "iep_goals" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "iep_accommodations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "iep_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "accommodation_text" TEXT NOT NULL,
    "frequency" TEXT,
    CONSTRAINT "iep_accommodations_iep_id_fkey" FOREIGN KEY ("iep_id") REFERENCES "ieps" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "iep_services" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "iep_id" TEXT NOT NULL,
    "service_name" TEXT NOT NULL,
    "provider" TEXT,
    "frequency" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "service_type" TEXT NOT NULL,
    "setting" TEXT NOT NULL,
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME NOT NULL,
    "sessions_completed" INTEGER NOT NULL DEFAULT 0,
    "total_sessions_planned" INTEGER,
    CONSTRAINT "iep_services_iep_id_fkey" FOREIGN KEY ("iep_id") REFERENCES "ieps" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "iep_team_members" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "iep_id" TEXT NOT NULL,
    "member_type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "organization" TEXT,
    "signed" BOOLEAN NOT NULL DEFAULT false,
    "signed_at" DATETIME,
    "signature" TEXT,
    CONSTRAINT "iep_team_members_iep_id_fkey" FOREIGN KEY ("iep_id") REFERENCES "ieps" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "iep_progress_reports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "iep_id" TEXT NOT NULL,
    "report_date" DATETIME NOT NULL,
    "reporting_period" TEXT NOT NULL,
    "overall_progress" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "iep_progress_reports_iep_id_fkey" FOREIGN KEY ("iep_id") REFERENCES "ieps" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "interventions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patient_id" TEXT NOT NULL,
    "clinician_id" TEXT NOT NULL,
    "intervention_name" TEXT NOT NULL,
    "protocol" TEXT,
    "focus" TEXT NOT NULL,
    "target_behaviors" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "frequency" TEXT,
    "duration" INTEGER,
    "total_sessions" INTEGER,
    "sessions_completed" INTEGER NOT NULL DEFAULT 0,
    "provider" TEXT,
    "provider_role" TEXT,
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME,
    "target_completion_date" DATETIME,
    "overall_progress" INTEGER NOT NULL DEFAULT 0,
    "linked_iep_goal_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "interventions_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "interventions_clinician_id_fkey" FOREIGN KEY ("clinician_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "intervention_strategies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "intervention_id" TEXT NOT NULL,
    "strategy_name" TEXT NOT NULL,
    "strategy_text" TEXT NOT NULL,
    "implementation" TEXT NOT NULL,
    "frequency" TEXT,
    CONSTRAINT "intervention_strategies_intervention_id_fkey" FOREIGN KEY ("intervention_id") REFERENCES "interventions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "intervention_progress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "intervention_id" TEXT NOT NULL,
    "update_date" DATETIME NOT NULL,
    "progress_note" TEXT NOT NULL,
    "session_count" INTEGER,
    "data_points" TEXT,
    "attachments" TEXT,
    "updated_by" TEXT NOT NULL,
    CONSTRAINT "intervention_progress_intervention_id_fkey" FOREIGN KEY ("intervention_id") REFERENCES "interventions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patient_id" TEXT NOT NULL,
    "clinician_id" TEXT NOT NULL,
    "report_type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sections" TEXT,
    "file_url" TEXT,
    "file_name" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "linked_assessment_id" TEXT,
    "linked_iep_id" TEXT,
    "shared_with" TEXT NOT NULL DEFAULT '[]',
    "share_log" TEXT NOT NULL DEFAULT '[]',
    "generated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_at" DATETIME NOT NULL,
    CONSTRAINT "reports_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "reports_clinician_id_fkey" FOREIGN KEY ("clinician_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "participants" TEXT NOT NULL,
    "patient_id" TEXT,
    "subject" TEXT,
    "last_message_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "conversation_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "sender_type" TEXT NOT NULL,
    "sender_name" TEXT NOT NULL,
    "recipient_id" TEXT NOT NULL,
    "recipient_type" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "attachments" TEXT DEFAULT '[]',
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "read_at" DATETIME,
    "sent_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_assessments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patient_id" TEXT NOT NULL,
    "clinician_id" TEXT NOT NULL,
    "assessment_type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "responses" TEXT NOT NULL DEFAULT '{}',
    "current_domain" TEXT,
    "current_question" INTEGER,
    "total_questions" INTEGER,
    "total_score" INTEGER,
    "domain_scores" TEXT,
    "interpretation" TEXT,
    "severity_level" TEXT,
    "dsm5_criteria" TEXT,
    "recommendations" TEXT,
    "administered_by" TEXT NOT NULL,
    "administered_date" DATETIME,
    "duration" INTEGER,
    "completed_at" DATETIME,
    "baseline_assessment_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "assessments_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "assessments_clinician_id_fkey" FOREIGN KEY ("clinician_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_assessments" ("assessment_type", "completed_at", "created_at", "current_question", "domain_scores", "id", "interpretation", "patient_id", "responses", "status", "total_score", "updated_at") SELECT "assessment_type", "completed_at", "created_at", "current_question", "domain_scores", "id", "interpretation", "patient_id", "responses", "status", "total_score", "updated_at" FROM "assessments";
DROP TABLE "assessments";
ALTER TABLE "new_assessments" RENAME TO "assessments";
CREATE INDEX "assessments_patient_id_idx" ON "assessments"("patient_id");
CREATE INDEX "assessments_clinician_id_idx" ON "assessments"("clinician_id");
CREATE INDEX "assessments_assessment_type_idx" ON "assessments"("assessment_type");
CREATE INDEX "assessments_status_idx" ON "assessments"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "ieps_patient_id_idx" ON "ieps"("patient_id");

-- CreateIndex
CREATE INDEX "ieps_status_idx" ON "ieps"("status");

-- CreateIndex
CREATE INDEX "ieps_academic_year_idx" ON "ieps"("academic_year");

-- CreateIndex
CREATE INDEX "goal_progress_updates_goal_id_idx" ON "goal_progress_updates"("goal_id");

-- CreateIndex
CREATE INDEX "interventions_patient_id_idx" ON "interventions"("patient_id");

-- CreateIndex
CREATE INDEX "interventions_clinician_id_idx" ON "interventions"("clinician_id");

-- CreateIndex
CREATE INDEX "interventions_status_idx" ON "interventions"("status");

-- CreateIndex
CREATE INDEX "intervention_progress_intervention_id_idx" ON "intervention_progress"("intervention_id");

-- CreateIndex
CREATE INDEX "reports_patient_id_idx" ON "reports"("patient_id");

-- CreateIndex
CREATE INDEX "reports_clinician_id_idx" ON "reports"("clinician_id");

-- CreateIndex
CREATE INDEX "reports_report_type_idx" ON "reports"("report_type");

-- CreateIndex
CREATE INDEX "conversations_patient_id_idx" ON "conversations"("patient_id");

-- CreateIndex
CREATE INDEX "messages_conversation_id_idx" ON "messages"("conversation_id");

-- CreateIndex
CREATE INDEX "messages_sender_id_idx" ON "messages"("sender_id");

-- CreateIndex
CREATE INDEX "messages_recipient_id_idx" ON "messages"("recipient_id");

-- CreateIndex
CREATE INDEX "messages_is_read_idx" ON "messages"("is_read");
