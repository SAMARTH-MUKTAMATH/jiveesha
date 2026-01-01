/*
  Warnings:

  - Added the required column `file_name` to the `session_attachments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "session_participants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_id" TEXT NOT NULL,
    "participant_type" TEXT NOT NULL,
    "participant_name" TEXT NOT NULL,
    CONSTRAINT "session_participants_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "consultation_sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "session_templates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "session_type" TEXT NOT NULL,
    "template_content" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "is_global" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "journal_entries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patient_id" TEXT NOT NULL,
    "entry_type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "linked_session_id" TEXT,
    "linked_goal_id" TEXT,
    "linked_intervention_id" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'clinician_only',
    "created_by" TEXT NOT NULL,
    "created_by_type" TEXT NOT NULL,
    "created_by_name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "journal_entries_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "journal_attachments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entry_id" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER,
    CONSTRAINT "journal_attachments_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "journal_entries" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "user_type" TEXT NOT NULL,
    "notification_type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "action_url" TEXT,
    "action_data" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "category" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "read_at" DATETIME,
    "sent_via" TEXT NOT NULL DEFAULT '[]',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" DATETIME
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_consultation_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patient_id" TEXT NOT NULL,
    "clinician_id" TEXT NOT NULL,
    "session_date" DATETIME NOT NULL,
    "duration" INTEGER NOT NULL,
    "session_type" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "location" TEXT,
    "notes" TEXT,
    "linked_goal_id" TEXT,
    "linked_intervention_id" TEXT,
    "template_used" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "consultation_sessions_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "consultation_sessions_clinician_id_fkey" FOREIGN KEY ("clinician_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_consultation_sessions" ("clinician_id", "created_at", "duration", "format", "id", "location", "notes", "patient_id", "session_date", "session_type", "updated_at") SELECT "clinician_id", "created_at", "duration", "format", "id", "location", "notes", "patient_id", "session_date", "session_type", "updated_at" FROM "consultation_sessions";
DROP TABLE "consultation_sessions";
ALTER TABLE "new_consultation_sessions" RENAME TO "consultation_sessions";
CREATE INDEX "consultation_sessions_patient_id_idx" ON "consultation_sessions"("patient_id");
CREATE INDEX "consultation_sessions_clinician_id_idx" ON "consultation_sessions"("clinician_id");
CREATE INDEX "consultation_sessions_session_date_idx" ON "consultation_sessions"("session_date");
CREATE TABLE "new_session_attachments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_id" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER,
    "description" TEXT,
    "uploaded_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "session_attachments_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "consultation_sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_session_attachments" ("file_type", "file_url", "id", "session_id", "uploaded_at") SELECT "file_type", "file_url", "id", "session_id", "uploaded_at" FROM "session_attachments";
DROP TABLE "session_attachments";
ALTER TABLE "new_session_attachments" RENAME TO "session_attachments";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "journal_entries_patient_id_idx" ON "journal_entries"("patient_id");

-- CreateIndex
CREATE INDEX "journal_entries_entry_type_idx" ON "journal_entries"("entry_type");

-- CreateIndex
CREATE INDEX "journal_entries_created_at_idx" ON "journal_entries"("created_at");

-- CreateIndex
CREATE INDEX "notifications_user_id_user_type_idx" ON "notifications"("user_id", "user_type");

-- CreateIndex
CREATE INDEX "notifications_is_read_idx" ON "notifications"("is_read");

-- CreateIndex
CREATE INDEX "notifications_notification_type_idx" ON "notifications"("notification_type");

-- CreateIndex
CREATE INDEX "notifications_created_at_idx" ON "notifications"("created_at");
