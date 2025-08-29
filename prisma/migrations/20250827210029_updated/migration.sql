/*
  Warnings:

  - You are about to drop the column `device_id` on the `facebook_interaction_history` table. All the data in the column will be lost.
  - You are about to drop the column `device_id` on the `tiktok_interaction_history` table. All the data in the column will be lost.
  - Added the required column `social_network_account_id` to the `facebook_interaction_history` table without a default value. This is not possible if the table is not empty.
  - Made the column `username` on table `social_network_account` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `social_network_account_id` to the `tiktok_interaction_history` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_facebook_interaction_history" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "social_network_account_id" INTEGER NOT NULL,
    "shared_groups_count" INTEGER NOT NULL DEFAULT 0,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "commented" BOOLEAN NOT NULL DEFAULT false,
    "finished_at" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'FALLIDA',
    CONSTRAINT "facebook_interaction_history_social_network_account_id_fkey" FOREIGN KEY ("social_network_account_id") REFERENCES "social_network_account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_facebook_interaction_history" ("commented", "finished_at", "id", "liked", "shared_groups_count", "status") SELECT "commented", "finished_at", "id", "liked", "shared_groups_count", "status" FROM "facebook_interaction_history";
DROP TABLE "facebook_interaction_history";
ALTER TABLE "new_facebook_interaction_history" RENAME TO "facebook_interaction_history";
CREATE TABLE "new_social_network_account" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "social_network_id" INTEGER NOT NULL,
    "google_account_id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVO',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "social_network_account_google_account_id_fkey" FOREIGN KEY ("google_account_id") REFERENCES "google_account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "social_network_account_social_network_id_fkey" FOREIGN KEY ("social_network_id") REFERENCES "social_network" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_social_network_account" ("created_at", "google_account_id", "id", "social_network_id", "status", "username") SELECT "created_at", "google_account_id", "id", "social_network_id", "status", "username" FROM "social_network_account";
DROP TABLE "social_network_account";
ALTER TABLE "new_social_network_account" RENAME TO "social_network_account";
CREATE TABLE "new_tiktok_interaction_history" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "social_network_account_id" INTEGER NOT NULL,
    "username" TEXT,
    "total_views" INTEGER NOT NULL DEFAULT 0,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "video_saved" BOOLEAN NOT NULL DEFAULT false,
    "commented" TEXT,
    "finished_at" DATETIME,
    "video_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'FALLIDA',
    CONSTRAINT "tiktok_interaction_history_social_network_account_id_fkey" FOREIGN KEY ("social_network_account_id") REFERENCES "social_network_account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_tiktok_interaction_history" ("commented", "finished_at", "id", "liked", "status", "total_views", "username", "video_saved", "video_url") SELECT "commented", "finished_at", "id", "liked", "status", "total_views", "username", "video_saved", "video_url" FROM "tiktok_interaction_history";
DROP TABLE "tiktok_interaction_history";
ALTER TABLE "new_tiktok_interaction_history" RENAME TO "tiktok_interaction_history";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
