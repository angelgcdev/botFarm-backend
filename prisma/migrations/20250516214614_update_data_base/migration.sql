/*
  Warnings:

  - You are about to drop the `device_scheduled_facebook_interaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `device_scheduled_tiktok_interaction` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_id` to the `scheduled_facebook_interaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "device_scheduled_facebook_interaction";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "device_scheduled_tiktok_interaction";
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
    "status" TEXT NOT NULL DEFAULT 'FALLIDA',
    CONSTRAINT "facebook_interaction_history_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "device" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_facebook_interaction_history" ("commented", "device_id", "finished_at", "id", "liked", "shared_groups_count", "status") SELECT "commented", "device_id", "finished_at", "id", "liked", "shared_groups_count", "status" FROM "facebook_interaction_history";
DROP TABLE "facebook_interaction_history";
ALTER TABLE "new_facebook_interaction_history" RENAME TO "facebook_interaction_history";
CREATE TABLE "new_scheduled_facebook_interaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "post_url" TEXT NOT NULL,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "comment" TEXT,
    "shared_groups_count" INTEGER NOT NULL DEFAULT 0,
    "time_between_posts" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDIENTE',
    CONSTRAINT "scheduled_facebook_interaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_scheduled_facebook_interaction" ("comment", "id", "liked", "post_url", "shared_groups_count", "time_between_posts") SELECT "comment", "id", "liked", "post_url", "shared_groups_count", "time_between_posts" FROM "scheduled_facebook_interaction";
DROP TABLE "scheduled_facebook_interaction";
ALTER TABLE "new_scheduled_facebook_interaction" RENAME TO "scheduled_facebook_interaction";
CREATE TABLE "new_scheduled_tiktok_interaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "video_url" TEXT NOT NULL,
    "views_count" INTEGER NOT NULL DEFAULT 0,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "saved" BOOLEAN NOT NULL DEFAULT false,
    "comment" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDIENTE',
    CONSTRAINT "scheduled_tiktok_interaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_scheduled_tiktok_interaction" ("comment", "id", "liked", "saved", "user_id", "video_url", "views_count") SELECT "comment", "id", "liked", "saved", "user_id", "video_url", "views_count" FROM "scheduled_tiktok_interaction";
DROP TABLE "scheduled_tiktok_interaction";
ALTER TABLE "new_scheduled_tiktok_interaction" RENAME TO "scheduled_tiktok_interaction";
CREATE TABLE "new_tiktok_interaction_history" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "device_id" INTEGER NOT NULL,
    "username" TEXT,
    "total_views" INTEGER NOT NULL DEFAULT 0,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "video_saved" BOOLEAN NOT NULL DEFAULT false,
    "commented" TEXT,
    "finished_at" DATETIME,
    "video_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'FALLIDA',
    CONSTRAINT "tiktok_interaction_history_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "device" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_tiktok_interaction_history" ("commented", "device_id", "finished_at", "id", "liked", "status", "total_views", "username", "video_saved", "video_url") SELECT "commented", "device_id", "finished_at", "id", "liked", "status", "total_views", "username", "video_saved", "video_url" FROM "tiktok_interaction_history";
DROP TABLE "tiktok_interaction_history";
ALTER TABLE "new_tiktok_interaction_history" RENAME TO "tiktok_interaction_history";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
