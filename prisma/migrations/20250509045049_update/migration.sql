/*
  Warnings:

  - You are about to drop the `device_facebook_interaction_history` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `device_tiktok_interaction_history` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `device_id` to the `facebook_interaction_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `device_id` to the `tiktok_interaction_history` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "device_facebook_interaction_history";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "device_tiktok_interaction_history";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_facebook_interaction_history" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "device_id" INTEGER NOT NULL,
    "shared_groups_count" INTEGER NOT NULL DEFAULT 0,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "commented" BOOLEAN NOT NULL DEFAULT false,
    "finished_at" DATETIME,
    CONSTRAINT "facebook_interaction_history_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "device" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_facebook_interaction_history" ("commented", "id", "liked", "shared_groups_count") SELECT "commented", "id", "liked", "shared_groups_count" FROM "facebook_interaction_history";
DROP TABLE "facebook_interaction_history";
ALTER TABLE "new_facebook_interaction_history" RENAME TO "facebook_interaction_history";
CREATE TABLE "new_tiktok_interaction_history" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "device_id" INTEGER NOT NULL,
    "username" TEXT,
    "total_views" INTEGER NOT NULL DEFAULT 0,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "video_saved" BOOLEAN NOT NULL DEFAULT false,
    "commented" TEXT,
    "finished_at" DATETIME,
    CONSTRAINT "tiktok_interaction_history_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "device" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_tiktok_interaction_history" ("commented", "id", "liked", "total_views", "username", "video_saved") SELECT "commented", "id", "liked", "total_views", "username", "video_saved" FROM "tiktok_interaction_history";
DROP TABLE "tiktok_interaction_history";
ALTER TABLE "new_tiktok_interaction_history" RENAME TO "tiktok_interaction_history";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
