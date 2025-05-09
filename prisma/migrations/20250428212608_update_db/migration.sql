/*
  Warnings:

  - You are about to drop the `cuenta_google` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cuenta_red_social` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dispositivo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `red_social` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `finished_at` on the `facebook_interaction_history` table. All the data in the column will be lost.
  - You are about to drop the column `int_programada_facebook_id` on the `facebook_interaction_history` table. All the data in the column will be lost.
  - You are about to drop the column `shared_groups` on the `facebook_interaction_history` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `facebook_interaction_history` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `scheduled_facebook_interaction` table. All the data in the column will be lost.
  - You are about to drop the column `cuenta_red_social_id` on the `scheduled_facebook_interaction` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `scheduled_facebook_interaction` table. All the data in the column will be lost.
  - You are about to drop the column `url_post` on the `scheduled_facebook_interaction` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `scheduled_tiktok_interaction` table. All the data in the column will be lost.
  - You are about to drop the column `cuenta_red_social_id` on the `scheduled_tiktok_interaction` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `scheduled_tiktok_interaction` table. All the data in the column will be lost.
  - You are about to drop the column `url_video` on the `scheduled_tiktok_interaction` table. All the data in the column will be lost.
  - You are about to drop the column `finished_at` on the `tiktok_interaction_history` table. All the data in the column will be lost.
  - You are about to drop the column `int_programada_tiktok_id` on the `tiktok_interaction_history` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `tiktok_interaction_history` table. All the data in the column will be lost.
  - Added the required column `post_url` to the `scheduled_facebook_interaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `video_url` to the `scheduled_tiktok_interaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "cuenta_google_email_key";

-- DropIndex
DROP INDEX "usuario_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "cuenta_google";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "cuenta_red_social";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "dispositivo";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "red_social";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "usuario";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "device" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "udid" TEXT NOT NULL,
    "device_type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'INACTIVO',
    "os_version" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "connected_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_activity" DATETIME,
    "complete_config" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "device_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "google_account" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "device_id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVO',
    CONSTRAINT "google_account_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "device" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "social_network" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "social_network_account" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "social_network_id" INTEGER NOT NULL,
    "google_account_id" INTEGER NOT NULL,
    "username" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVO',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "social_network_account_google_account_id_fkey" FOREIGN KEY ("google_account_id") REFERENCES "google_account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "social_network_account_social_network_id_fkey" FOREIGN KEY ("social_network_id") REFERENCES "social_network" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "device_scheduled_tiktok_interaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "device_id" INTEGER NOT NULL,
    "scheduled_tiktok_interaction_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'PENDIENTE',
    CONSTRAINT "device_scheduled_tiktok_interaction_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "device" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "device_scheduled_tiktok_interaction_scheduled_tiktok_interaction_id_fkey" FOREIGN KEY ("scheduled_tiktok_interaction_id") REFERENCES "scheduled_tiktok_interaction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "device_scheduled_facebook_interaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "device_id" INTEGER NOT NULL,
    "scheduled_facebook_interaction_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'PENDIENTE',
    CONSTRAINT "device_scheduled_facebook_interaction_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "device" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "device_scheduled_facebook_interaction_scheduled_facebook_interaction_id_fkey" FOREIGN KEY ("scheduled_facebook_interaction_id") REFERENCES "scheduled_facebook_interaction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "device_tiktok_interaction_history" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "device_id" INTEGER NOT NULL,
    "tiktok_interaction_history_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "finished_at" DATETIME,
    CONSTRAINT "device_tiktok_interaction_history_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "device" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "device_tiktok_interaction_history_tiktok_interaction_history_id_fkey" FOREIGN KEY ("tiktok_interaction_history_id") REFERENCES "tiktok_interaction_history" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "device_facebook_interaction_history" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "device_id" INTEGER NOT NULL,
    "facebook_interaction_history_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "finished_at" DATETIME,
    CONSTRAINT "device_facebook_interaction_history_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "device" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "device_facebook_interaction_history_facebook_interaction_history_id_fkey" FOREIGN KEY ("facebook_interaction_history_id") REFERENCES "facebook_interaction_history" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_facebook_interaction_history" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shared_groups_count" INTEGER NOT NULL DEFAULT 0,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "commented" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_facebook_interaction_history" ("commented", "id", "liked") SELECT "commented", "id", "liked" FROM "facebook_interaction_history";
DROP TABLE "facebook_interaction_history";
ALTER TABLE "new_facebook_interaction_history" RENAME TO "facebook_interaction_history";
CREATE TABLE "new_scheduled_facebook_interaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "post_url" TEXT NOT NULL,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "comment" TEXT,
    "shared_groups_count" INTEGER NOT NULL DEFAULT 0,
    "time_between_posts" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_scheduled_facebook_interaction" ("comment", "id", "liked", "shared_groups_count", "time_between_posts") SELECT "comment", "id", "liked", "shared_groups_count", "time_between_posts" FROM "scheduled_facebook_interaction";
DROP TABLE "scheduled_facebook_interaction";
ALTER TABLE "new_scheduled_facebook_interaction" RENAME TO "scheduled_facebook_interaction";
CREATE TABLE "new_scheduled_tiktok_interaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "video_url" TEXT NOT NULL,
    "views_count" INTEGER NOT NULL,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "saved" BOOLEAN NOT NULL DEFAULT false,
    "comment" TEXT
);
INSERT INTO "new_scheduled_tiktok_interaction" ("comment", "id", "liked", "saved", "views_count") SELECT "comment", "id", "liked", "saved", "views_count" FROM "scheduled_tiktok_interaction";
DROP TABLE "scheduled_tiktok_interaction";
ALTER TABLE "new_scheduled_tiktok_interaction" RENAME TO "scheduled_tiktok_interaction";
CREATE TABLE "new_tiktok_interaction_history" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tiktok_account_name" TEXT,
    "total_views" INTEGER NOT NULL DEFAULT 0,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "video_saved" BOOLEAN NOT NULL DEFAULT false,
    "commented" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_tiktok_interaction_history" ("commented", "id", "liked", "tiktok_account_name", "total_views", "video_saved") SELECT "commented", "id", "liked", "tiktok_account_name", "total_views", "video_saved" FROM "tiktok_interaction_history";
DROP TABLE "tiktok_interaction_history";
ALTER TABLE "new_tiktok_interaction_history" RENAME TO "tiktok_interaction_history";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "google_account_email_key" ON "google_account"("email");
