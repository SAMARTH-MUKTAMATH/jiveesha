-- CreateTable
CREATE TABLE "parent_screenings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "parent_id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
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
    CONSTRAINT "parent_screenings_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "parents" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "parent_screenings_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "screening_responses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "screening_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "question_text" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "answer_value" INTEGER NOT NULL,
    "is_follow_up" BOOLEAN NOT NULL DEFAULT false,
    "parent_follow_up_answer" TEXT,
    "answered_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "mchat_questions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "question_number" INTEGER NOT NULL,
    "question_text" TEXT NOT NULL,
    "is_initial_screener" BOOLEAN NOT NULL DEFAULT true,
    "is_follow_up" BOOLEAN NOT NULL DEFAULT false,
    "critical_item" BOOLEAN NOT NULL DEFAULT false,
    "scoring_key" TEXT NOT NULL,
    "follow_up_prompt" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "asq_questions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "age_range" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "question_number" INTEGER NOT NULL,
    "question_text" TEXT NOT NULL,
    "yes_value" INTEGER NOT NULL DEFAULT 10,
    "sometimes_value" INTEGER NOT NULL DEFAULT 5,
    "not_yet_value" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "parent_screenings_parent_id_idx" ON "parent_screenings"("parent_id");

-- CreateIndex
CREATE INDEX "parent_screenings_patient_id_idx" ON "parent_screenings"("patient_id");

-- CreateIndex
CREATE INDEX "parent_screenings_screening_type_idx" ON "parent_screenings"("screening_type");

-- CreateIndex
CREATE INDEX "parent_screenings_status_idx" ON "parent_screenings"("status");

-- CreateIndex
CREATE INDEX "screening_responses_screening_id_idx" ON "screening_responses"("screening_id");

-- CreateIndex
CREATE UNIQUE INDEX "mchat_questions_question_number_is_initial_screener_key" ON "mchat_questions"("question_number", "is_initial_screener");

-- CreateIndex
CREATE UNIQUE INDEX "asq_questions_age_range_domain_question_number_key" ON "asq_questions"("age_range", "domain", "question_number");
