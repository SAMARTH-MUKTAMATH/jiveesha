-- DropIndex
DROP INDEX "parent_child_views_person_id_key";

-- CreateTable
CREATE TABLE "activity_notes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "activity_id" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "activity_notes_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "activity_media" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "activity_id" TEXT NOT NULL,
    "media_type" TEXT NOT NULL,
    "media_url" TEXT NOT NULL,
    "caption" TEXT,
    "uploaded_by" TEXT NOT NULL,
    "uploaded_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "activity_media_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "activity_notes_activity_id_idx" ON "activity_notes"("activity_id");

-- CreateIndex
CREATE INDEX "activity_notes_created_at_idx" ON "activity_notes"("created_at");

-- CreateIndex
CREATE INDEX "activity_media_activity_id_idx" ON "activity_media"("activity_id");

-- CreateIndex
CREATE INDEX "activity_media_uploaded_at_idx" ON "activity_media"("uploaded_at");
