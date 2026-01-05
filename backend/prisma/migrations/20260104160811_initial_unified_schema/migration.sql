/*
  Warnings:

  - You are about to drop the `appointment_history` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `appointment_participants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `appointment_reminders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `consent_grants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `iep_accommodations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `iep_goals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `iep_objectives` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `iep_progress_reports` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `iep_services` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `iep_team_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ieps` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `parent_children` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `parent_screenings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `patient_activity_log` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `patient_contacts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `patient_documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `patient_tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `patients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pep_activities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pep_goal_progress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pep_goals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `peps` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `session_templates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `patient_id` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `series_id` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `patient_id` on the `assessments` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `consultation_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `linked_goal_id` on the `consultation_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `linked_intervention_id` on the `consultation_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `consultation_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `consultation_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `patient_id` on the `consultation_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `template_used` on the `consultation_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `patient_id` on the `conversations` table. All the data in the column will be lost.
  - You are about to drop the column `attachments` on the `intervention_progress` table. All the data in the column will be lost.
  - You are about to drop the column `progress_note` on the `intervention_progress` table. All the data in the column will be lost.
  - You are about to drop the column `session_count` on the `intervention_progress` table. All the data in the column will be lost.
  - You are about to drop the column `update_date` on the `intervention_progress` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `intervention_progress` table. All the data in the column will be lost.
  - You are about to drop the column `frequency` on the `intervention_strategies` table. All the data in the column will be lost.
  - You are about to drop the column `strategy_text` on the `intervention_strategies` table. All the data in the column will be lost.
  - You are about to drop the column `focus` on the `interventions` table. All the data in the column will be lost.
  - You are about to drop the column `linked_iep_goal_id` on the `interventions` table. All the data in the column will be lost.
  - You are about to drop the column `patient_id` on the `interventions` table. All the data in the column will be lost.
  - You are about to drop the column `protocol` on the `interventions` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `interventions` table. All the data in the column will be lost.
  - You are about to drop the column `provider_role` on the `interventions` table. All the data in the column will be lost.
  - You are about to drop the column `sessions_completed` on the `interventions` table. All the data in the column will be lost.
  - You are about to drop the column `target_behaviors` on the `interventions` table. All the data in the column will be lost.
  - You are about to drop the column `target_completion_date` on the `interventions` table. All the data in the column will be lost.
  - You are about to drop the column `total_sessions` on the `interventions` table. All the data in the column will be lost.
  - You are about to drop the column `patient_id` on the `journal_entries` table. All the data in the column will be lost.
  - You are about to drop the column `accountStatus` on the `parents` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `file_name` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `generated_at` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `last_modified_at` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `linked_assessment_id` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `linked_iep_id` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `patient_id` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `sections` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `share_log` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `shared_with` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `session_attachments` table. All the data in the column will be lost.
  - Added the required column `person_id` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `person_id` to the `assessments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_time` to the `consultation_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `person_id` to the `consultation_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `consultation_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by_type` to the `goal_progress_updates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `progress_percentage` to the `intervention_progress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `record_date` to the `intervention_progress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recorded_by` to the `intervention_progress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `intervention_strategies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `goal_statement` to the `interventions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `intervention_type` to the `interventions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `person_id` to the `interventions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `target_behavior` to the `interventions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `person_id` to the `journal_entries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `person_id` to the `reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `report_date` to the `reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `participant_id` to the `session_participants` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "consent_grants_status_idx";

-- DropIndex
DROP INDEX "consent_grants_token_idx";

-- DropIndex
DROP INDEX "consent_grants_clinician_id_idx";

-- DropIndex
DROP INDEX "consent_grants_patient_id_idx";

-- DropIndex
DROP INDEX "consent_grants_parent_id_idx";

-- DropIndex
DROP INDEX "consent_grants_token_key";

-- DropIndex
DROP INDEX "ieps_academic_year_idx";

-- DropIndex
DROP INDEX "ieps_status_idx";

-- DropIndex
DROP INDEX "ieps_patient_id_idx";

-- DropIndex
DROP INDEX "notifications_created_at_idx";

-- DropIndex
DROP INDEX "parent_children_parent_id_patient_id_key";

-- DropIndex
DROP INDEX "parent_children_patient_id_idx";

-- DropIndex
DROP INDEX "parent_children_parent_id_idx";

-- DropIndex
DROP INDEX "parent_screenings_status_idx";

-- DropIndex
DROP INDEX "parent_screenings_screening_type_idx";

-- DropIndex
DROP INDEX "parent_screenings_patient_id_idx";

-- DropIndex
DROP INDEX "parent_screenings_parent_id_idx";

-- DropIndex
DROP INDEX "pep_activities_goal_id_idx";

-- DropIndex
DROP INDEX "pep_activities_pep_id_idx";

-- DropIndex
DROP INDEX "pep_goal_progress_goal_id_idx";

-- DropIndex
DROP INDEX "pep_goals_pep_id_idx";

-- DropIndex
DROP INDEX "peps_status_idx";

-- DropIndex
DROP INDEX "peps_patient_id_idx";

-- DropIndex
DROP INDEX "peps_parent_id_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "appointment_history";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "appointment_participants";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "appointment_reminders";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "consent_grants";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "iep_accommodations";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "iep_goals";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "iep_objectives";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "iep_progress_reports";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "iep_services";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "iep_team_members";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ieps";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "parent_children";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "parent_screenings";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "patient_activity_log";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "patient_contacts";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "patient_documents";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "patient_tags";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "patients";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "pep_activities";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "pep_goal_progress";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "pep_goals";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "peps";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "session_templates";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "persons" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "date_of_birth" DATETIME NOT NULL,
    "gender" TEXT NOT NULL,
    "place_of_birth" TEXT,
    "address_line1" TEXT,
    "address_line2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pin_code" TEXT,
    "country" TEXT NOT NULL DEFAULT 'India',
    "udid_number" TEXT,
    "aadhaar_encrypted" TEXT,
    "primary_language" TEXT,
    "languages_spoken" TEXT NOT NULL DEFAULT '[]',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME
);

-- CreateTable
CREATE TABLE "parent_child_views" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "person_id" TEXT NOT NULL,
    "parent_id" TEXT NOT NULL,
    "nickname" TEXT,
    "medical_history" TEXT,
    "current_concerns" TEXT,
    "developmental_notes" TEXT,
    "parent_notes" TEXT,
    "allergy_notes" TEXT,
    "relationship_type" TEXT NOT NULL,
    "is_primary_caregiver" BOOLEAN NOT NULL DEFAULT false,
    "preferred_contact_method" TEXT,
    "reminder_preferences" TEXT NOT NULL DEFAULT '{}',
    "added_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "parent_child_views_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "parent_child_views_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "parents" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "clinician_patient_views" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "person_id" TEXT NOT NULL,
    "clinician_id" TEXT NOT NULL,
    "primary_concerns" TEXT,
    "presenting_problems" TEXT,
    "chief_complaint" TEXT,
    "existing_diagnosis" TEXT,
    "diagnosis_codes" TEXT NOT NULL DEFAULT '[]',
    "diagnosis_date" DATETIME,
    "developmental_history" TEXT,
    "birth_history" TEXT,
    "medical_history" TEXT,
    "family_history" TEXT,
    "social_history" TEXT,
    "current_medications" TEXT NOT NULL DEFAULT '[]',
    "allergies" TEXT,
    "immunization_status" TEXT,
    "treatment_plan" TEXT,
    "clinical_notes" TEXT,
    "case_status" TEXT NOT NULL DEFAULT 'active',
    "admitted_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "discharged_at" DATETIME,
    "referral_source" TEXT,
    "referral_date" DATETIME,
    "referral_notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "clinician_patient_views_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "clinician_patient_views_clinician_id_fkey" FOREIGN KEY ("clinician_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "school_student_views" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "person_id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "primary_teacher_id" TEXT,
    "student_id" TEXT,
    "roll_number" TEXT,
    "admission_number" TEXT,
    "current_grade" TEXT,
    "section" TEXT,
    "academic_year" TEXT,
    "academic_performance" TEXT,
    "attendance_rate" REAL,
    "behavior_rating" TEXT,
    "receiving_support" BOOLEAN NOT NULL DEFAULT false,
    "support_type" TEXT,
    "accommodations" TEXT NOT NULL DEFAULT '[]',
    "teacher_notes" TEXT,
    "behavior_notes" TEXT,
    "academic_notes" TEXT,
    "enrollment_status" TEXT NOT NULL DEFAULT 'active',
    "enrolled_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "withdrawn_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "school_student_views_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "school_student_views_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "school_student_views_primary_teacher_id_fkey" FOREIGN KEY ("primary_teacher_id") REFERENCES "teachers" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "access_grants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "grantor_type" TEXT NOT NULL,
    "grantor_id" TEXT NOT NULL,
    "grantee_type" TEXT NOT NULL,
    "grantee_id" TEXT NOT NULL,
    "person_id" TEXT NOT NULL,
    "permissions" TEXT NOT NULL DEFAULT '{}',
    "access_level" TEXT NOT NULL DEFAULT 'view',
    "token" TEXT,
    "token_expires_at" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "granted_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activated_at" DATETIME,
    "expires_at" DATETIME,
    "revoked_at" DATETIME,
    "granted_by_name" TEXT NOT NULL,
    "granted_by_email" TEXT NOT NULL,
    "grantee_email" TEXT,
    "notes" TEXT,
    "audit_log" TEXT NOT NULL DEFAULT '[]',
    CONSTRAINT "access_grants_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "schools" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "school_type" TEXT NOT NULL,
    "address_line1" TEXT,
    "address_line2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pin_code" TEXT,
    "country" TEXT NOT NULL DEFAULT 'India',
    "phone" TEXT,
    "email" TEXT,
    "principal_name" TEXT,
    "established_year" INTEGER,
    "affiliation_number" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "teachers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "school_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "subjects" TEXT NOT NULL DEFAULT '[]',
    "grades" TEXT NOT NULL DEFAULT '[]',
    "employee_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "teachers_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "person_id" TEXT NOT NULL,
    "contact_type" TEXT NOT NULL,
    "relationship" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT,
    "alternate_phone" TEXT,
    "email" TEXT,
    "whatsapp_number" TEXT,
    "occupation" TEXT,
    "address_line1" TEXT,
    "address_line2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pin_code" TEXT,
    "is_primary_contact" BOOLEAN NOT NULL DEFAULT false,
    "can_receive_updates" BOOLEAN NOT NULL DEFAULT true,
    "preferred_contact_method" TEXT,
    "language_preference" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "contacts_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "person_id" TEXT NOT NULL,
    "document_type" TEXT,
    "file_name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER,
    "mime_type" TEXT,
    "uploaded_by" TEXT NOT NULL,
    "uploaded_by_type" TEXT NOT NULL,
    "uploaded_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'private',
    CONSTRAINT "documents_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "person_id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "added_by" TEXT NOT NULL,
    "added_by_type" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tags_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "screenings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "person_id" TEXT NOT NULL,
    "conducted_by" TEXT NOT NULL,
    "conducted_by_type" TEXT NOT NULL,
    "screening_type" TEXT NOT NULL,
    "age_at_screening" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "current_question" INTEGER NOT NULL DEFAULT 1,
    "total_questions" INTEGER NOT NULL,
    "responses" TEXT NOT NULL DEFAULT '{}',
    "total_score" INTEGER,
    "risk_level" TEXT,
    "screener_result" TEXT,
    "recommendations" TEXT,
    "follow_up_required" BOOLEAN NOT NULL DEFAULT false,
    "professional_referral" BOOLEAN NOT NULL DEFAULT false,
    "mchat_initial_score" INTEGER,
    "mchat_follow_up_score" INTEGER,
    "started_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "screenings_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "education_plans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "person_id" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_by_type" TEXT NOT NULL,
    "plan_type" TEXT NOT NULL,
    "plan_name" TEXT NOT NULL,
    "academic_year" TEXT,
    "focus_areas" TEXT NOT NULL DEFAULT '[]',
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME,
    "next_review_date" DATETIME,
    "last_review_date" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'active',
    "overall_progress" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "notes" TEXT,
    "signed_by_parent" BOOLEAN NOT NULL DEFAULT false,
    "parent_signed_at" DATETIME,
    "signed_by_clinician" BOOLEAN NOT NULL DEFAULT false,
    "clinician_signed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "education_plans_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "education_goals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "plan_id" TEXT NOT NULL,
    "goal_number" INTEGER NOT NULL,
    "domain" TEXT NOT NULL,
    "priority" TEXT,
    "goal_statement" TEXT NOT NULL,
    "baseline_data" TEXT,
    "target_criteria" TEXT NOT NULL,
    "target_date" DATETIME,
    "measurement_method" TEXT,
    "current_progress" INTEGER NOT NULL DEFAULT 0,
    "progress_status" TEXT NOT NULL DEFAULT 'not_started',
    "milestones" TEXT NOT NULL DEFAULT '[]',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "education_goals_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "education_plans" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "goal_objectives" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "goal_id" TEXT NOT NULL,
    "objective_number" INTEGER NOT NULL,
    "objective_text" TEXT NOT NULL,
    "criteria" TEXT,
    "target_date" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "achieved_date" DATETIME,
    CONSTRAINT "goal_objectives_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "education_goals" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "accommodations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "plan_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "accommodation_text" TEXT NOT NULL,
    "frequency" TEXT,
    CONSTRAINT "accommodations_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "education_plans" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "plan_id" TEXT NOT NULL,
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
    CONSTRAINT "services_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "education_plans" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "team_members" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "plan_id" TEXT NOT NULL,
    "member_type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "organization" TEXT,
    "signed" BOOLEAN NOT NULL DEFAULT false,
    "signed_at" DATETIME,
    "signature" TEXT,
    CONSTRAINT "team_members_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "education_plans" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "person_id" TEXT NOT NULL,
    "goal_id" TEXT,
    "created_by" TEXT NOT NULL,
    "created_by_type" TEXT NOT NULL,
    "activity_name" TEXT NOT NULL,
    "activity_type" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "instructions" TEXT,
    "materials" TEXT NOT NULL DEFAULT '[]',
    "duration" INTEGER,
    "frequency" TEXT,
    "linked_resource_id" TEXT,
    "completion_count" INTEGER NOT NULL DEFAULT 0,
    "last_completed_at" DATETIME,
    "notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "activities_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "progress_records" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "person_id" TEXT NOT NULL,
    "recorded_by" TEXT NOT NULL,
    "recorded_by_type" TEXT NOT NULL,
    "record_type" TEXT NOT NULL,
    "domain" TEXT,
    "metric" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "notes" TEXT,
    "record_date" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "progress_records_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_activity_completions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "activity_id" TEXT NOT NULL,
    "completed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER,
    "child_engagement" TEXT,
    "parent_observations" TEXT,
    "challenges_faced" TEXT,
    "successes_noted" TEXT,
    "photos" TEXT NOT NULL DEFAULT '[]',
    "videos" TEXT NOT NULL DEFAULT '[]',
    CONSTRAINT "activity_completions_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_activity_completions" ("activity_id", "challenges_faced", "child_engagement", "completed_at", "duration", "id", "parent_observations", "photos", "successes_noted", "videos") SELECT "activity_id", "challenges_faced", "child_engagement", "completed_at", "duration", "id", "parent_observations", coalesce("photos", '[]') AS "photos", "successes_noted", coalesce("videos", '[]') AS "videos" FROM "activity_completions";
DROP TABLE "activity_completions";
ALTER TABLE "new_activity_completions" RENAME TO "activity_completions";
CREATE INDEX "activity_completions_activity_id_idx" ON "activity_completions"("activity_id");
CREATE INDEX "activity_completions_completed_at_idx" ON "activity_completions"("completed_at");
CREATE TABLE "new_appointments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "person_id" TEXT NOT NULL,
    "clinician_id" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "appointment_type" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "location_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "appointments_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "appointments_clinician_id_fkey" FOREIGN KEY ("clinician_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "appointments_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "practice_locations" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_appointments" ("appointment_type", "clinician_id", "created_at", "date", "end_time", "format", "id", "location_id", "notes", "start_time", "status", "updated_at") SELECT "appointment_type", "clinician_id", "created_at", "date", "end_time", "format", "id", "location_id", "notes", "start_time", "status", "updated_at" FROM "appointments";
DROP TABLE "appointments";
ALTER TABLE "new_appointments" RENAME TO "appointments";
CREATE INDEX "appointments_person_id_idx" ON "appointments"("person_id");
CREATE INDEX "appointments_clinician_id_idx" ON "appointments"("clinician_id");
CREATE INDEX "appointments_date_idx" ON "appointments"("date");
CREATE TABLE "new_assessments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "person_id" TEXT NOT NULL,
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
    CONSTRAINT "assessments_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "assessments_clinician_id_fkey" FOREIGN KEY ("clinician_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_assessments" ("administered_by", "administered_date", "assessment_type", "baseline_assessment_id", "clinician_id", "completed_at", "created_at", "current_domain", "current_question", "domain_scores", "dsm5_criteria", "duration", "id", "interpretation", "recommendations", "responses", "severity_level", "status", "total_questions", "total_score", "updated_at") SELECT "administered_by", "administered_date", "assessment_type", "baseline_assessment_id", "clinician_id", "completed_at", "created_at", "current_domain", "current_question", "domain_scores", "dsm5_criteria", "duration", "id", "interpretation", "recommendations", "responses", "severity_level", "status", "total_questions", "total_score", "updated_at" FROM "assessments";
DROP TABLE "assessments";
ALTER TABLE "new_assessments" RENAME TO "assessments";
CREATE INDEX "assessments_person_id_idx" ON "assessments"("person_id");
CREATE INDEX "assessments_clinician_id_idx" ON "assessments"("clinician_id");
CREATE INDEX "assessments_assessment_type_idx" ON "assessments"("assessment_type");
CREATE INDEX "assessments_status_idx" ON "assessments"("status");
CREATE TABLE "new_consultation_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "person_id" TEXT NOT NULL,
    "clinician_id" TEXT NOT NULL,
    "session_date" DATETIME NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "session_type" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "objectives" TEXT,
    "activities_conducted" TEXT,
    "observations" TEXT,
    "child_response" TEXT,
    "progress_notes" TEXT,
    "home_recommendations" TEXT,
    "next_session_plan" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "consultation_sessions_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "consultation_sessions_clinician_id_fkey" FOREIGN KEY ("clinician_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_consultation_sessions" ("clinician_id", "created_at", "format", "id", "session_date", "session_type", "updated_at") SELECT "clinician_id", "created_at", "format", "id", "session_date", "session_type", "updated_at" FROM "consultation_sessions";
DROP TABLE "consultation_sessions";
ALTER TABLE "new_consultation_sessions" RENAME TO "consultation_sessions";
CREATE INDEX "consultation_sessions_person_id_idx" ON "consultation_sessions"("person_id");
CREATE INDEX "consultation_sessions_clinician_id_idx" ON "consultation_sessions"("clinician_id");
CREATE INDEX "consultation_sessions_session_date_idx" ON "consultation_sessions"("session_date");
CREATE TABLE "new_conversations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "participants" TEXT NOT NULL DEFAULT '[]',
    "person_id" TEXT,
    "subject" TEXT,
    "last_message_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_conversations" ("created_at", "id", "last_message_at", "participants", "subject") SELECT "created_at", "id", "last_message_at", "participants", "subject" FROM "conversations";
DROP TABLE "conversations";
ALTER TABLE "new_conversations" RENAME TO "conversations";
CREATE INDEX "conversations_person_id_idx" ON "conversations"("person_id");
CREATE TABLE "new_goal_progress_updates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "goal_id" TEXT NOT NULL,
    "update_date" DATETIME NOT NULL,
    "progress_percentage" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "evidence" TEXT,
    "updated_by" TEXT NOT NULL,
    "updated_by_type" TEXT NOT NULL,
    CONSTRAINT "goal_progress_updates_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "education_goals" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_goal_progress_updates" ("evidence", "goal_id", "id", "notes", "progress_percentage", "status", "update_date", "updated_by") SELECT "evidence", "goal_id", "id", "notes", "progress_percentage", "status", "update_date", "updated_by" FROM "goal_progress_updates";
DROP TABLE "goal_progress_updates";
ALTER TABLE "new_goal_progress_updates" RENAME TO "goal_progress_updates";
CREATE INDEX "goal_progress_updates_goal_id_idx" ON "goal_progress_updates"("goal_id");
CREATE TABLE "new_intervention_progress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "intervention_id" TEXT NOT NULL,
    "record_date" DATETIME NOT NULL,
    "progress_percentage" INTEGER NOT NULL,
    "observations" TEXT,
    "data_points" TEXT,
    "recorded_by" TEXT NOT NULL,
    CONSTRAINT "intervention_progress_intervention_id_fkey" FOREIGN KEY ("intervention_id") REFERENCES "interventions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_intervention_progress" ("data_points", "id", "intervention_id") SELECT "data_points", "id", "intervention_id" FROM "intervention_progress";
DROP TABLE "intervention_progress";
ALTER TABLE "new_intervention_progress" RENAME TO "intervention_progress";
CREATE INDEX "intervention_progress_intervention_id_idx" ON "intervention_progress"("intervention_id");
CREATE TABLE "new_intervention_strategies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "intervention_id" TEXT NOT NULL,
    "strategy_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "implementation" TEXT,
    "expected_outcome" TEXT,
    CONSTRAINT "intervention_strategies_intervention_id_fkey" FOREIGN KEY ("intervention_id") REFERENCES "interventions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_intervention_strategies" ("id", "implementation", "intervention_id", "strategy_name") SELECT "id", "implementation", "intervention_id", "strategy_name" FROM "intervention_strategies";
DROP TABLE "intervention_strategies";
ALTER TABLE "new_intervention_strategies" RENAME TO "intervention_strategies";
CREATE INDEX "intervention_strategies_intervention_id_idx" ON "intervention_strategies"("intervention_id");
CREATE TABLE "new_interventions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "person_id" TEXT NOT NULL,
    "clinician_id" TEXT NOT NULL,
    "intervention_name" TEXT NOT NULL,
    "intervention_type" TEXT NOT NULL,
    "target_behavior" TEXT NOT NULL,
    "goal_statement" TEXT NOT NULL,
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME,
    "frequency" TEXT,
    "duration" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'active',
    "overall_progress" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "interventions_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "interventions_clinician_id_fkey" FOREIGN KEY ("clinician_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_interventions" ("clinician_id", "created_at", "duration", "end_date", "frequency", "id", "intervention_name", "overall_progress", "start_date", "status", "updated_at") SELECT "clinician_id", "created_at", "duration", "end_date", "frequency", "id", "intervention_name", "overall_progress", "start_date", "status", "updated_at" FROM "interventions";
DROP TABLE "interventions";
ALTER TABLE "new_interventions" RENAME TO "interventions";
CREATE INDEX "interventions_person_id_idx" ON "interventions"("person_id");
CREATE INDEX "interventions_clinician_id_idx" ON "interventions"("clinician_id");
CREATE INDEX "interventions_status_idx" ON "interventions"("status");
CREATE TABLE "new_journal_entries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "person_id" TEXT NOT NULL,
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
    CONSTRAINT "journal_entries_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_journal_entries" ("content", "created_at", "created_by", "created_by_name", "created_by_type", "entry_type", "id", "linked_goal_id", "linked_intervention_id", "linked_session_id", "tags", "title", "updated_at", "visibility") SELECT "content", "created_at", "created_by", "created_by_name", "created_by_type", "entry_type", "id", "linked_goal_id", "linked_intervention_id", "linked_session_id", "tags", "title", "updated_at", "visibility" FROM "journal_entries";
DROP TABLE "journal_entries";
ALTER TABLE "new_journal_entries" RENAME TO "journal_entries";
CREATE INDEX "journal_entries_person_id_idx" ON "journal_entries"("person_id");
CREATE INDEX "journal_entries_created_by_created_by_type_idx" ON "journal_entries"("created_by", "created_by_type");
CREATE INDEX "journal_entries_entry_type_idx" ON "journal_entries"("entry_type");
CREATE TABLE "new_mchat_questions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "question_number" INTEGER NOT NULL,
    "question_text" TEXT NOT NULL,
    "is_initial_screener" BOOLEAN NOT NULL,
    "is_follow_up" BOOLEAN NOT NULL DEFAULT false,
    "critical_item" BOOLEAN NOT NULL DEFAULT false,
    "scoring_key" TEXT NOT NULL,
    "follow_up_prompt" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_mchat_questions" ("created_at", "critical_item", "follow_up_prompt", "id", "is_follow_up", "is_initial_screener", "question_number", "question_text", "scoring_key") SELECT "created_at", "critical_item", "follow_up_prompt", "id", "is_follow_up", "is_initial_screener", "question_number", "question_text", "scoring_key" FROM "mchat_questions";
DROP TABLE "mchat_questions";
ALTER TABLE "new_mchat_questions" RENAME TO "mchat_questions";
CREATE UNIQUE INDEX "mchat_questions_question_number_is_initial_screener_key" ON "mchat_questions"("question_number", "is_initial_screener");
CREATE TABLE "new_messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "conversation_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "sender_type" TEXT NOT NULL,
    "sender_name" TEXT NOT NULL,
    "recipient_id" TEXT NOT NULL,
    "recipient_type" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "attachments" TEXT NOT NULL DEFAULT '[]',
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "read_at" DATETIME,
    "sent_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_messages" ("attachments", "body", "conversation_id", "id", "is_read", "read_at", "recipient_id", "recipient_type", "sender_id", "sender_name", "sender_type", "sent_at") SELECT coalesce("attachments", '[]') AS "attachments", "body", "conversation_id", "id", "is_read", "read_at", "recipient_id", "recipient_type", "sender_id", "sender_name", "sender_type", "sent_at" FROM "messages";
DROP TABLE "messages";
ALTER TABLE "new_messages" RENAME TO "messages";
CREATE INDEX "messages_conversation_id_idx" ON "messages"("conversation_id");
CREATE INDEX "messages_sender_id_sender_type_idx" ON "messages"("sender_id", "sender_type");
CREATE INDEX "messages_recipient_id_recipient_type_idx" ON "messages"("recipient_id", "recipient_type");
CREATE INDEX "messages_is_read_idx" ON "messages"("is_read");
CREATE TABLE "new_parents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "phone" TEXT,
    "phone_verified" BOOLEAN NOT NULL DEFAULT false,
    "emergency_contact" TEXT,
    "emergency_phone" TEXT,
    "preferred_language" TEXT NOT NULL DEFAULT 'en',
    "profile_picture_url" TEXT,
    "email_notifications" BOOLEAN NOT NULL DEFAULT true,
    "sms_notifications" BOOLEAN NOT NULL DEFAULT false,
    "account_status" TEXT NOT NULL DEFAULT 'active',
    "last_login_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "parents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_parents" ("created_at", "email_notifications", "emergency_contact", "emergency_phone", "id", "last_login_at", "phone", "phone_verified", "preferred_language", "sms_notifications", "updated_at", "user_id") SELECT "created_at", "email_notifications", "emergency_contact", "emergency_phone", "id", "last_login_at", "phone", "phone_verified", "preferred_language", "sms_notifications", "updated_at", "user_id" FROM "parents";
DROP TABLE "parents";
ALTER TABLE "new_parents" RENAME TO "parents";
CREATE UNIQUE INDEX "parents_user_id_key" ON "parents"("user_id");
CREATE INDEX "parents_user_id_idx" ON "parents"("user_id");
CREATE INDEX "parents_phone_idx" ON "parents"("phone");
CREATE TABLE "new_reports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "person_id" TEXT NOT NULL,
    "clinician_id" TEXT NOT NULL,
    "report_type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "report_date" DATETIME NOT NULL,
    "reporting_period" TEXT,
    "summary" TEXT NOT NULL,
    "recommendations" TEXT,
    "file_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "reports_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reports_clinician_id_fkey" FOREIGN KEY ("clinician_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_reports" ("clinician_id", "file_url", "id", "report_type", "status", "title") SELECT "clinician_id", "file_url", "id", "report_type", "status", "title" FROM "reports";
DROP TABLE "reports";
ALTER TABLE "new_reports" RENAME TO "reports";
CREATE INDEX "reports_person_id_idx" ON "reports"("person_id");
CREATE INDEX "reports_clinician_id_idx" ON "reports"("clinician_id");
CREATE INDEX "reports_report_type_idx" ON "reports"("report_type");
CREATE TABLE "new_screening_responses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "screening_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "question_text" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "answer_value" INTEGER NOT NULL,
    "is_follow_up" BOOLEAN NOT NULL DEFAULT false,
    "parent_follow_up_answer" TEXT,
    "answered_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "screening_responses_screening_id_fkey" FOREIGN KEY ("screening_id") REFERENCES "screenings" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_screening_responses" ("answer", "answer_value", "answered_at", "id", "is_follow_up", "parent_follow_up_answer", "question_id", "question_text", "screening_id") SELECT "answer", "answer_value", "answered_at", "id", "is_follow_up", "parent_follow_up_answer", "question_id", "question_text", "screening_id" FROM "screening_responses";
DROP TABLE "screening_responses";
ALTER TABLE "new_screening_responses" RENAME TO "screening_responses";
CREATE INDEX "screening_responses_screening_id_idx" ON "screening_responses"("screening_id");
CREATE TABLE "new_session_attachments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_id" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER,
    "uploaded_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "session_attachments_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "consultation_sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_session_attachments" ("file_name", "file_size", "file_type", "file_url", "id", "session_id", "uploaded_at") SELECT "file_name", "file_size", "file_type", "file_url", "id", "session_id", "uploaded_at" FROM "session_attachments";
DROP TABLE "session_attachments";
ALTER TABLE "new_session_attachments" RENAME TO "session_attachments";
CREATE INDEX "session_attachments_session_id_idx" ON "session_attachments"("session_id");
CREATE TABLE "new_session_participants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_id" TEXT NOT NULL,
    "participant_type" TEXT NOT NULL,
    "participant_id" TEXT NOT NULL,
    "participant_name" TEXT NOT NULL,
    "role" TEXT,
    CONSTRAINT "session_participants_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "consultation_sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_session_participants" ("id", "participant_name", "participant_type", "session_id") SELECT "id", "participant_name", "participant_type", "session_id" FROM "session_participants";
DROP TABLE "session_participants";
ALTER TABLE "new_session_participants" RENAME TO "session_participants";
CREATE INDEX "session_participants_session_id_idx" ON "session_participants"("session_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "persons_udid_number_key" ON "persons"("udid_number");

-- CreateIndex
CREATE INDEX "persons_first_name_last_name_idx" ON "persons"("first_name", "last_name");

-- CreateIndex
CREATE INDEX "persons_date_of_birth_idx" ON "persons"("date_of_birth");

-- CreateIndex
CREATE INDEX "persons_udid_number_idx" ON "persons"("udid_number");

-- CreateIndex
CREATE INDEX "persons_deleted_at_idx" ON "persons"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "parent_child_views_person_id_key" ON "parent_child_views"("person_id");

-- CreateIndex
CREATE INDEX "parent_child_views_parent_id_idx" ON "parent_child_views"("parent_id");

-- CreateIndex
CREATE INDEX "parent_child_views_person_id_idx" ON "parent_child_views"("person_id");

-- CreateIndex
CREATE UNIQUE INDEX "clinician_patient_views_person_id_key" ON "clinician_patient_views"("person_id");

-- CreateIndex
CREATE INDEX "clinician_patient_views_clinician_id_idx" ON "clinician_patient_views"("clinician_id");

-- CreateIndex
CREATE INDEX "clinician_patient_views_person_id_idx" ON "clinician_patient_views"("person_id");

-- CreateIndex
CREATE INDEX "clinician_patient_views_case_status_idx" ON "clinician_patient_views"("case_status");

-- CreateIndex
CREATE UNIQUE INDEX "school_student_views_person_id_key" ON "school_student_views"("person_id");

-- CreateIndex
CREATE INDEX "school_student_views_school_id_idx" ON "school_student_views"("school_id");

-- CreateIndex
CREATE INDEX "school_student_views_primary_teacher_id_idx" ON "school_student_views"("primary_teacher_id");

-- CreateIndex
CREATE INDEX "school_student_views_person_id_idx" ON "school_student_views"("person_id");

-- CreateIndex
CREATE INDEX "school_student_views_enrollment_status_idx" ON "school_student_views"("enrollment_status");

-- CreateIndex
CREATE UNIQUE INDEX "access_grants_token_key" ON "access_grants"("token");

-- CreateIndex
CREATE INDEX "access_grants_grantor_id_grantor_type_idx" ON "access_grants"("grantor_id", "grantor_type");

-- CreateIndex
CREATE INDEX "access_grants_grantee_id_grantee_type_idx" ON "access_grants"("grantee_id", "grantee_type");

-- CreateIndex
CREATE INDEX "access_grants_person_id_idx" ON "access_grants"("person_id");

-- CreateIndex
CREATE INDEX "access_grants_token_idx" ON "access_grants"("token");

-- CreateIndex
CREATE INDEX "access_grants_status_idx" ON "access_grants"("status");

-- CreateIndex
CREATE INDEX "teachers_school_id_idx" ON "teachers"("school_id");

-- CreateIndex
CREATE INDEX "contacts_person_id_idx" ON "contacts"("person_id");

-- CreateIndex
CREATE INDEX "documents_person_id_idx" ON "documents"("person_id");

-- CreateIndex
CREATE INDEX "tags_person_id_idx" ON "tags"("person_id");

-- CreateIndex
CREATE UNIQUE INDEX "tags_person_id_tag_key" ON "tags"("person_id", "tag");

-- CreateIndex
CREATE INDEX "screenings_person_id_idx" ON "screenings"("person_id");

-- CreateIndex
CREATE INDEX "screenings_screening_type_idx" ON "screenings"("screening_type");

-- CreateIndex
CREATE INDEX "screenings_status_idx" ON "screenings"("status");

-- CreateIndex
CREATE INDEX "education_plans_person_id_idx" ON "education_plans"("person_id");

-- CreateIndex
CREATE INDEX "education_plans_created_by_created_by_type_idx" ON "education_plans"("created_by", "created_by_type");

-- CreateIndex
CREATE INDEX "education_plans_plan_type_idx" ON "education_plans"("plan_type");

-- CreateIndex
CREATE INDEX "education_plans_status_idx" ON "education_plans"("status");

-- CreateIndex
CREATE INDEX "education_goals_plan_id_idx" ON "education_goals"("plan_id");

-- CreateIndex
CREATE INDEX "goal_objectives_goal_id_idx" ON "goal_objectives"("goal_id");

-- CreateIndex
CREATE INDEX "accommodations_plan_id_idx" ON "accommodations"("plan_id");

-- CreateIndex
CREATE INDEX "services_plan_id_idx" ON "services"("plan_id");

-- CreateIndex
CREATE INDEX "team_members_plan_id_idx" ON "team_members"("plan_id");

-- CreateIndex
CREATE INDEX "activities_person_id_idx" ON "activities"("person_id");

-- CreateIndex
CREATE INDEX "activities_goal_id_idx" ON "activities"("goal_id");

-- CreateIndex
CREATE INDEX "activities_created_by_created_by_type_idx" ON "activities"("created_by", "created_by_type");

-- CreateIndex
CREATE INDEX "progress_records_person_id_idx" ON "progress_records"("person_id");

-- CreateIndex
CREATE INDEX "progress_records_record_date_idx" ON "progress_records"("record_date");

-- CreateIndex
CREATE INDEX "assessment_evidence_assessment_id_idx" ON "assessment_evidence"("assessment_id");

-- CreateIndex
CREATE INDEX "journal_attachments_entry_id_idx" ON "journal_attachments"("entry_id");
