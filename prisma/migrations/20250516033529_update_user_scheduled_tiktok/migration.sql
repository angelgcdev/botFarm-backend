/*
  Warnings:

  - Added the required column `user_id` to the `scheduled_tiktok_interaction` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_scheduled_tiktok_interaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "video_url" TEXT NOT NULL,
    "views_count" INTEGER NOT NULL,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "saved" BOOLEAN NOT NULL DEFAULT false,
    "comment" TEXT,
    CONSTRAINT "scheduled_tiktok_interaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_scheduled_tiktok_interaction" ("comment", "id", "liked", "saved", "video_url", "views_count") SELECT "comment", "id", "liked", "saved", "video_url", "views_count" FROM "scheduled_tiktok_interaction";
DROP TABLE "scheduled_tiktok_interaction";
ALTER TABLE "new_scheduled_tiktok_interaction" RENAME TO "scheduled_tiktok_interaction";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
