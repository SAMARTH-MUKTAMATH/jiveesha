-- CreateTable
CREATE TABLE "consent_grants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "parent_id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "clinician_id" TEXT,
    "permissions" TEXT NOT NULL DEFAULT '{"view": true, "edit": false, "assessments": true, "reports": true, "iep": false}',
    "access_level" TEXT NOT NULL DEFAULT 'view',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "granted_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activated_at" DATETIME,
    "expires_at" DATETIME,
    "revoked_at" DATETIME,
    "granted_by_name" TEXT NOT NULL,
    "granted_by_email" TEXT NOT NULL,
    "clinician_email" TEXT,
    "notes" TEXT,
    "audit_log" TEXT NOT NULL DEFAULT '[]',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "consent_grants_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "parents" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "consent_grants_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "consent_grants_clinician_id_fkey" FOREIGN KEY ("clinician_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "consent_grants_token_key" ON "consent_grants"("token");

-- CreateIndex
CREATE INDEX "consent_grants_parent_id_idx" ON "consent_grants"("parent_id");

-- CreateIndex
CREATE INDEX "consent_grants_patient_id_idx" ON "consent_grants"("patient_id");

-- CreateIndex
CREATE INDEX "consent_grants_clinician_id_idx" ON "consent_grants"("clinician_id");

-- CreateIndex
CREATE INDEX "consent_grants_token_idx" ON "consent_grants"("token");

-- CreateIndex
CREATE INDEX "consent_grants_status_idx" ON "consent_grants"("status");
