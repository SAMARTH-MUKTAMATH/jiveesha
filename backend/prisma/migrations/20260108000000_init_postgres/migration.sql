-- CreateTable
CREATE TABLE "persons" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
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
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "persons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parent_child_views" (
    "id" TEXT NOT NULL,
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
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parent_child_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinician_patient_views" (
    "id" TEXT NOT NULL,
    "person_id" TEXT NOT NULL,
    "clinician_id" TEXT NOT NULL,
    "primary_concerns" TEXT,
    "presenting_problems" TEXT,
    "chief_complaint" TEXT,
    "existing_diagnosis" TEXT,
    "diagnosis_codes" TEXT NOT NULL DEFAULT '[]',
    "diagnosis_date" TIMESTAMP(3),
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
    "admitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "discharged_at" TIMESTAMP(3),
    "referral_source" TEXT,
    "referral_date" TIMESTAMP(3),
    "referral_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clinician_patient_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_student_views" (
    "id" TEXT NOT NULL,
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
    "attendance_rate" DOUBLE PRECISION,
    "behavior_rating" TEXT,
    "receiving_support" BOOLEAN NOT NULL DEFAULT false,
    "support_type" TEXT,
    "accommodations" TEXT NOT NULL DEFAULT '[]',
    "teacher_notes" TEXT,
    "behavior_notes" TEXT,
    "academic_notes" TEXT,
    "enrollment_status" TEXT NOT NULL DEFAULT 'active',
    "enrolled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "withdrawn_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "school_student_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "access_grants" (
    "id" TEXT NOT NULL,
    "grantor_type" TEXT NOT NULL,
    "grantor_id" TEXT NOT NULL,
    "grantee_type" TEXT NOT NULL,
    "grantee_id" TEXT NOT NULL,
    "person_id" TEXT NOT NULL,
    "permissions" TEXT NOT NULL DEFAULT '{}',
    "access_level" TEXT NOT NULL DEFAULT 'view',
    "token" TEXT,
    "token_expires_at" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activated_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "granted_by_name" TEXT NOT NULL,
    "granted_by_email" TEXT NOT NULL,
    "grantee_email" TEXT,
    "notes" TEXT,
    "audit_log" TEXT NOT NULL DEFAULT '[]',

    CONSTRAINT "access_grants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'clinician',
    "status" TEXT NOT NULL DEFAULT 'pending_verification',
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "email_verification_token" TEXT,
    "email_verification_expires" TIMESTAMP(3),
    "password_reset_token" TEXT,
    "password_reset_expires" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parents" (
    "id" TEXT NOT NULL,
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
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinician_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "last_name" TEXT NOT NULL,
    "professional_title" TEXT,
    "designation" TEXT,
    "specializations" TEXT NOT NULL DEFAULT '[]',
    "languages" TEXT NOT NULL DEFAULT '[]',
    "phone" TEXT,
    "alternate_phone" TEXT,
    "date_of_birth" TIMESTAMP(3),
    "years_of_practice" INTEGER,
    "bio" TEXT,
    "photo_url" TEXT,
    "verification_status" TEXT NOT NULL DEFAULT 'pending',
    "verified_at" TIMESTAMP(3),
    "verified_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clinician_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schools" (
    "id" TEXT NOT NULL,
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
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teachers" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "subjects" TEXT NOT NULL DEFAULT '[]',
    "grades" TEXT NOT NULL DEFAULT '[]',
    "employee_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credentials" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "credential_type" TEXT NOT NULL,
    "credential_number" TEXT,
    "issuing_authority" TEXT,
    "issue_date" TIMESTAMP(3),
    "expiry_date" TIMESTAMP(3),
    "document_url" TEXT,
    "verification_status" TEXT NOT NULL DEFAULT 'pending',
    "verification_notes" TEXT,
    "verified_by" TEXT,
    "verified_at" TIMESTAMP(3),
    "rejection_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),
    "ip_address" TEXT,
    "user_agent" TEXT,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "user_id" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "date_format" TEXT NOT NULL DEFAULT 'DD/MM/YYYY',
    "time_format" TEXT NOT NULL DEFAULT '12-hour',
    "theme" TEXT NOT NULL DEFAULT 'light',
    "notification_email" BOOLEAN NOT NULL DEFAULT true,
    "notification_sms" BOOLEAN NOT NULL DEFAULT true,
    "notification_push" BOOLEAN NOT NULL DEFAULT true,
    "notification_settings" TEXT NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
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
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "person_id" TEXT NOT NULL,
    "document_type" TEXT,
    "file_name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER,
    "mime_type" TEXT,
    "uploaded_by" TEXT NOT NULL,
    "uploaded_by_type" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'private',

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "person_id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "added_by" TEXT NOT NULL,
    "added_by_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "action" TEXT NOT NULL,
    "resource_type" TEXT,
    "resource_id" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "details" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "practice_locations" (
    "id" TEXT NOT NULL,
    "clinician_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address_line1" TEXT,
    "address_line2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pin_code" TEXT,
    "country" TEXT NOT NULL DEFAULT 'India',
    "room_info" TEXT,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "practice_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinician_availability" (
    "id" TEXT NOT NULL,
    "clinician_id" TEXT NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "location_id" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clinician_availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinician_time_off" (
    "id" TEXT NOT NULL,
    "clinician_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "all_day" BOOLEAN NOT NULL DEFAULT true,
    "start_time" TEXT,
    "end_time" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clinician_time_off_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL,
    "person_id" TEXT NOT NULL,
    "clinician_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "appointment_type" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "location_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "screenings" (
    "id" TEXT NOT NULL,
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
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "screenings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "screening_responses" (
    "id" TEXT NOT NULL,
    "screening_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "question_text" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "answer_value" INTEGER NOT NULL,
    "is_follow_up" BOOLEAN NOT NULL DEFAULT false,
    "parent_follow_up_answer" TEXT,
    "answered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "screening_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mchat_questions" (
    "id" TEXT NOT NULL,
    "question_number" INTEGER NOT NULL,
    "question_text" TEXT NOT NULL,
    "is_initial_screener" BOOLEAN NOT NULL,
    "is_follow_up" BOOLEAN NOT NULL DEFAULT false,
    "critical_item" BOOLEAN NOT NULL DEFAULT false,
    "scoring_key" TEXT NOT NULL,
    "follow_up_prompt" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mchat_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asq_questions" (
    "id" TEXT NOT NULL,
    "age_range" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "question_number" INTEGER NOT NULL,
    "question_text" TEXT NOT NULL,
    "yes_value" INTEGER NOT NULL DEFAULT 10,
    "sometimes_value" INTEGER NOT NULL DEFAULT 5,
    "not_yet_value" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asq_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessments" (
    "id" TEXT NOT NULL,
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
    "administered_date" TIMESTAMP(3),
    "duration" INTEGER,
    "completed_at" TIMESTAMP(3),
    "baseline_assessment_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_evidence" (
    "id" TEXT NOT NULL,
    "assessment_id" TEXT NOT NULL,
    "evidence_type" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER,
    "description" TEXT,
    "timestamp" TEXT,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assessment_evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "education_plans" (
    "id" TEXT NOT NULL,
    "person_id" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_by_type" TEXT NOT NULL,
    "plan_type" TEXT NOT NULL,
    "plan_name" TEXT NOT NULL,
    "academic_year" TEXT,
    "focus_areas" TEXT NOT NULL DEFAULT '[]',
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "next_review_date" TIMESTAMP(3),
    "last_review_date" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "overall_progress" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "notes" TEXT,
    "signed_by_parent" BOOLEAN NOT NULL DEFAULT false,
    "parent_signed_at" TIMESTAMP(3),
    "signed_by_clinician" BOOLEAN NOT NULL DEFAULT false,
    "clinician_signed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "education_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "education_goals" (
    "id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "goal_number" INTEGER NOT NULL,
    "domain" TEXT NOT NULL,
    "priority" TEXT,
    "goal_statement" TEXT NOT NULL,
    "baseline_data" TEXT,
    "target_criteria" TEXT NOT NULL,
    "target_date" TIMESTAMP(3),
    "measurement_method" TEXT,
    "current_progress" INTEGER NOT NULL DEFAULT 0,
    "progress_status" TEXT NOT NULL DEFAULT 'not_started',
    "milestones" TEXT NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "education_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goal_objectives" (
    "id" TEXT NOT NULL,
    "goal_id" TEXT NOT NULL,
    "objective_number" INTEGER NOT NULL,
    "objective_text" TEXT NOT NULL,
    "criteria" TEXT,
    "target_date" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "achieved_date" TIMESTAMP(3),

    CONSTRAINT "goal_objectives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goal_progress_updates" (
    "id" TEXT NOT NULL,
    "goal_id" TEXT NOT NULL,
    "update_date" TIMESTAMP(3) NOT NULL,
    "progress_percentage" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "evidence" TEXT,
    "updated_by" TEXT NOT NULL,
    "updated_by_type" TEXT NOT NULL,

    CONSTRAINT "goal_progress_updates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodations" (
    "id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "accommodation_text" TEXT NOT NULL,
    "frequency" TEXT,

    CONSTRAINT "accommodations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "service_name" TEXT NOT NULL,
    "provider" TEXT,
    "frequency" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "service_type" TEXT NOT NULL,
    "setting" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "sessions_completed" INTEGER NOT NULL DEFAULT 0,
    "total_sessions_planned" INTEGER,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_members" (
    "id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "member_type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "organization" TEXT,
    "signed" BOOLEAN NOT NULL DEFAULT false,
    "signed_at" TIMESTAMP(3),
    "signature" TEXT,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
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
    "last_completed_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_completions" (
    "id" TEXT NOT NULL,
    "activity_id" TEXT NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER,
    "child_engagement" TEXT,
    "parent_observations" TEXT,
    "challenges_faced" TEXT,
    "successes_noted" TEXT,
    "photos" TEXT NOT NULL DEFAULT '[]',
    "videos" TEXT NOT NULL DEFAULT '[]',

    CONSTRAINT "activity_completions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_notes" (
    "id" TEXT NOT NULL,
    "activity_id" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_media" (
    "id" TEXT NOT NULL,
    "activity_id" TEXT NOT NULL,
    "media_type" TEXT NOT NULL,
    "media_url" TEXT NOT NULL,
    "caption" TEXT,
    "uploaded_by" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progress_records" (
    "id" TEXT NOT NULL,
    "person_id" TEXT NOT NULL,
    "recorded_by" TEXT NOT NULL,
    "recorded_by_type" TEXT NOT NULL,
    "record_type" TEXT NOT NULL,
    "domain" TEXT,
    "metric" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "notes" TEXT,
    "record_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "progress_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultation_sessions" (
    "id" TEXT NOT NULL,
    "person_id" TEXT NOT NULL,
    "clinician_id" TEXT NOT NULL,
    "session_date" TIMESTAMP(3) NOT NULL,
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
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consultation_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_attachments" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_participants" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "participant_type" TEXT NOT NULL,
    "participant_id" TEXT NOT NULL,
    "participant_name" TEXT NOT NULL,
    "role" TEXT,

    CONSTRAINT "session_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interventions" (
    "id" TEXT NOT NULL,
    "person_id" TEXT NOT NULL,
    "clinician_id" TEXT NOT NULL,
    "intervention_name" TEXT NOT NULL,
    "intervention_type" TEXT NOT NULL,
    "target_behavior" TEXT NOT NULL,
    "goal_statement" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "frequency" TEXT,
    "duration" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'active',
    "overall_progress" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interventions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intervention_strategies" (
    "id" TEXT NOT NULL,
    "intervention_id" TEXT NOT NULL,
    "strategy_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "implementation" TEXT,
    "expected_outcome" TEXT,

    CONSTRAINT "intervention_strategies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intervention_progress" (
    "id" TEXT NOT NULL,
    "intervention_id" TEXT NOT NULL,
    "record_date" TIMESTAMP(3) NOT NULL,
    "progress_percentage" INTEGER NOT NULL,
    "observations" TEXT,
    "data_points" TEXT,
    "recorded_by" TEXT NOT NULL,

    CONSTRAINT "intervention_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_entries" (
    "id" TEXT NOT NULL,
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
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journal_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_attachments" (
    "id" TEXT NOT NULL,
    "entry_id" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER,

    CONSTRAINT "journal_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "person_id" TEXT NOT NULL,
    "clinician_id" TEXT NOT NULL,
    "report_type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "report_date" TIMESTAMP(3) NOT NULL,
    "reporting_period" TEXT,
    "summary" TEXT NOT NULL,
    "recommendations" TEXT,
    "file_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resources" (
    "id" TEXT NOT NULL,
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
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
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
    "read_at" TIMESTAMP(3),
    "sent_via" TEXT NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL,
    "participants" TEXT NOT NULL DEFAULT '[]',
    "person_id" TEXT,
    "subject" TEXT,
    "last_message_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "sender_type" TEXT NOT NULL,
    "sender_name" TEXT NOT NULL,
    "recipient_id" TEXT NOT NULL,
    "recipient_type" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "attachments" TEXT NOT NULL DEFAULT '[]',
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "read_at" TIMESTAMP(3),
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

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
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "parents_user_id_key" ON "parents"("user_id");

-- CreateIndex
CREATE INDEX "parents_user_id_idx" ON "parents"("user_id");

-- CreateIndex
CREATE INDEX "parents_phone_idx" ON "parents"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "clinician_profiles_user_id_key" ON "clinician_profiles"("user_id");

-- CreateIndex
CREATE INDEX "teachers_school_id_idx" ON "teachers"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "contacts_person_id_idx" ON "contacts"("person_id");

-- CreateIndex
CREATE INDEX "documents_person_id_idx" ON "documents"("person_id");

-- CreateIndex
CREATE INDEX "tags_person_id_idx" ON "tags"("person_id");

-- CreateIndex
CREATE UNIQUE INDEX "tags_person_id_tag_key" ON "tags"("person_id", "tag");

-- CreateIndex
CREATE UNIQUE INDEX "clinician_availability_clinician_id_day_of_week_start_time__key" ON "clinician_availability"("clinician_id", "day_of_week", "start_time", "location_id");

-- CreateIndex
CREATE INDEX "appointments_person_id_idx" ON "appointments"("person_id");

-- CreateIndex
CREATE INDEX "appointments_clinician_id_idx" ON "appointments"("clinician_id");

-- CreateIndex
CREATE INDEX "appointments_date_idx" ON "appointments"("date");

-- CreateIndex
CREATE INDEX "screenings_person_id_idx" ON "screenings"("person_id");

-- CreateIndex
CREATE INDEX "screenings_screening_type_idx" ON "screenings"("screening_type");

-- CreateIndex
CREATE INDEX "screenings_status_idx" ON "screenings"("status");

-- CreateIndex
CREATE INDEX "screening_responses_screening_id_idx" ON "screening_responses"("screening_id");

-- CreateIndex
CREATE UNIQUE INDEX "mchat_questions_question_number_is_initial_screener_key" ON "mchat_questions"("question_number", "is_initial_screener");

-- CreateIndex
CREATE UNIQUE INDEX "asq_questions_age_range_domain_question_number_key" ON "asq_questions"("age_range", "domain", "question_number");

-- CreateIndex
CREATE INDEX "assessments_person_id_idx" ON "assessments"("person_id");

-- CreateIndex
CREATE INDEX "assessments_clinician_id_idx" ON "assessments"("clinician_id");

-- CreateIndex
CREATE INDEX "assessments_assessment_type_idx" ON "assessments"("assessment_type");

-- CreateIndex
CREATE INDEX "assessments_status_idx" ON "assessments"("status");

-- CreateIndex
CREATE INDEX "assessment_evidence_assessment_id_idx" ON "assessment_evidence"("assessment_id");

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
CREATE INDEX "goal_progress_updates_goal_id_idx" ON "goal_progress_updates"("goal_id");

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
CREATE INDEX "activity_completions_activity_id_idx" ON "activity_completions"("activity_id");

-- CreateIndex
CREATE INDEX "activity_completions_completed_at_idx" ON "activity_completions"("completed_at");

-- CreateIndex
CREATE INDEX "activity_notes_activity_id_idx" ON "activity_notes"("activity_id");

-- CreateIndex
CREATE INDEX "activity_notes_created_at_idx" ON "activity_notes"("created_at");

-- CreateIndex
CREATE INDEX "activity_media_activity_id_idx" ON "activity_media"("activity_id");

-- CreateIndex
CREATE INDEX "activity_media_uploaded_at_idx" ON "activity_media"("uploaded_at");

-- CreateIndex
CREATE INDEX "progress_records_person_id_idx" ON "progress_records"("person_id");

-- CreateIndex
CREATE INDEX "progress_records_record_date_idx" ON "progress_records"("record_date");

-- CreateIndex
CREATE INDEX "consultation_sessions_person_id_idx" ON "consultation_sessions"("person_id");

-- CreateIndex
CREATE INDEX "consultation_sessions_clinician_id_idx" ON "consultation_sessions"("clinician_id");

-- CreateIndex
CREATE INDEX "consultation_sessions_session_date_idx" ON "consultation_sessions"("session_date");

-- CreateIndex
CREATE INDEX "session_attachments_session_id_idx" ON "session_attachments"("session_id");

-- CreateIndex
CREATE INDEX "session_participants_session_id_idx" ON "session_participants"("session_id");

-- CreateIndex
CREATE INDEX "interventions_person_id_idx" ON "interventions"("person_id");

-- CreateIndex
CREATE INDEX "interventions_clinician_id_idx" ON "interventions"("clinician_id");

-- CreateIndex
CREATE INDEX "interventions_status_idx" ON "interventions"("status");

-- CreateIndex
CREATE INDEX "intervention_strategies_intervention_id_idx" ON "intervention_strategies"("intervention_id");

-- CreateIndex
CREATE INDEX "intervention_progress_intervention_id_idx" ON "intervention_progress"("intervention_id");

-- CreateIndex
CREATE INDEX "journal_entries_person_id_idx" ON "journal_entries"("person_id");

-- CreateIndex
CREATE INDEX "journal_entries_created_by_created_by_type_idx" ON "journal_entries"("created_by", "created_by_type");

-- CreateIndex
CREATE INDEX "journal_entries_entry_type_idx" ON "journal_entries"("entry_type");

-- CreateIndex
CREATE INDEX "journal_attachments_entry_id_idx" ON "journal_attachments"("entry_id");

-- CreateIndex
CREATE INDEX "reports_person_id_idx" ON "reports"("person_id");

-- CreateIndex
CREATE INDEX "reports_clinician_id_idx" ON "reports"("clinician_id");

-- CreateIndex
CREATE INDEX "reports_report_type_idx" ON "reports"("report_type");

-- CreateIndex
CREATE INDEX "resources_resource_type_idx" ON "resources"("resource_type");

-- CreateIndex
CREATE INDEX "resources_category_idx" ON "resources"("category");

-- CreateIndex
CREATE INDEX "resources_age_range_idx" ON "resources"("age_range");

-- CreateIndex
CREATE INDEX "resources_is_published_idx" ON "resources"("is_published");

-- CreateIndex
CREATE INDEX "notifications_user_id_user_type_idx" ON "notifications"("user_id", "user_type");

-- CreateIndex
CREATE INDEX "notifications_is_read_idx" ON "notifications"("is_read");

-- CreateIndex
CREATE INDEX "notifications_notification_type_idx" ON "notifications"("notification_type");

-- CreateIndex
CREATE INDEX "conversations_person_id_idx" ON "conversations"("person_id");

-- CreateIndex
CREATE INDEX "messages_conversation_id_idx" ON "messages"("conversation_id");

-- CreateIndex
CREATE INDEX "messages_sender_id_sender_type_idx" ON "messages"("sender_id", "sender_type");

-- CreateIndex
CREATE INDEX "messages_recipient_id_recipient_type_idx" ON "messages"("recipient_id", "recipient_type");

-- CreateIndex
CREATE INDEX "messages_is_read_idx" ON "messages"("is_read");

-- AddForeignKey
ALTER TABLE "parent_child_views" ADD CONSTRAINT "parent_child_views_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_child_views" ADD CONSTRAINT "parent_child_views_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "parents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinician_patient_views" ADD CONSTRAINT "clinician_patient_views_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinician_patient_views" ADD CONSTRAINT "clinician_patient_views_clinician_id_fkey" FOREIGN KEY ("clinician_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_student_views" ADD CONSTRAINT "school_student_views_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_student_views" ADD CONSTRAINT "school_student_views_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_student_views" ADD CONSTRAINT "school_student_views_primary_teacher_id_fkey" FOREIGN KEY ("primary_teacher_id") REFERENCES "teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_grants" ADD CONSTRAINT "access_grants_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parents" ADD CONSTRAINT "parents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinician_profiles" ADD CONSTRAINT "clinician_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_locations" ADD CONSTRAINT "practice_locations_clinician_id_fkey" FOREIGN KEY ("clinician_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinician_availability" ADD CONSTRAINT "clinician_availability_clinician_id_fkey" FOREIGN KEY ("clinician_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinician_availability" ADD CONSTRAINT "clinician_availability_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "practice_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinician_time_off" ADD CONSTRAINT "clinician_time_off_clinician_id_fkey" FOREIGN KEY ("clinician_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_clinician_id_fkey" FOREIGN KEY ("clinician_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "practice_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "screenings" ADD CONSTRAINT "screenings_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "screening_responses" ADD CONSTRAINT "screening_responses_screening_id_fkey" FOREIGN KEY ("screening_id") REFERENCES "screenings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_clinician_id_fkey" FOREIGN KEY ("clinician_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_evidence" ADD CONSTRAINT "assessment_evidence_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "education_plans" ADD CONSTRAINT "education_plans_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "education_goals" ADD CONSTRAINT "education_goals_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "education_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goal_objectives" ADD CONSTRAINT "goal_objectives_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "education_goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goal_progress_updates" ADD CONSTRAINT "goal_progress_updates_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "education_goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodations" ADD CONSTRAINT "accommodations_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "education_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "education_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "education_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_completions" ADD CONSTRAINT "activity_completions_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_notes" ADD CONSTRAINT "activity_notes_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_media" ADD CONSTRAINT "activity_media_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress_records" ADD CONSTRAINT "progress_records_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultation_sessions" ADD CONSTRAINT "consultation_sessions_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultation_sessions" ADD CONSTRAINT "consultation_sessions_clinician_id_fkey" FOREIGN KEY ("clinician_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_attachments" ADD CONSTRAINT "session_attachments_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "consultation_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_participants" ADD CONSTRAINT "session_participants_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "consultation_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interventions" ADD CONSTRAINT "interventions_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interventions" ADD CONSTRAINT "interventions_clinician_id_fkey" FOREIGN KEY ("clinician_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intervention_strategies" ADD CONSTRAINT "intervention_strategies_intervention_id_fkey" FOREIGN KEY ("intervention_id") REFERENCES "interventions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intervention_progress" ADD CONSTRAINT "intervention_progress_intervention_id_fkey" FOREIGN KEY ("intervention_id") REFERENCES "interventions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_attachments" ADD CONSTRAINT "journal_attachments_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "journal_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_clinician_id_fkey" FOREIGN KEY ("clinician_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

