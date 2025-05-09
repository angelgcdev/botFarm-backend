/*
  Warnings:

  - You are about to drop the `hist_int_facebook` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `hist_int_tiktok` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `int_programada_facebook` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `int_programada_tiktok` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "hist_int_facebook";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "hist_int_tiktok";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "int_programada_facebook";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "int_programada_tiktok";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "scheduled_tiktok_interaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cuenta_red_social_id" INTEGER NOT NULL,
    "url_video" TEXT NOT NULL,
    "views_count" INTEGER NOT NULL,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "saved" BOOLEAN NOT NULL DEFAULT false,
    "comment" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "scheduled_tiktok_interaction_cuenta_red_social_id_fkey" FOREIGN KEY ("cuenta_red_social_id") REFERENCES "cuenta_red_social" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "scheduled_facebook_interaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cuenta_red_social_id" INTEGER NOT NULL,
    "url_post" TEXT NOT NULL,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "comment" TEXT,
    "shared_groups_count" INTEGER NOT NULL DEFAULT 0,
    "time_between_posts" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "scheduled_facebook_interaction_cuenta_red_social_id_fkey" FOREIGN KEY ("cuenta_red_social_id") REFERENCES "cuenta_red_social" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tiktok_interaction_history" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "int_programada_tiktok_id" INTEGER NOT NULL,
    "tiktok_account_name" TEXT,
    "status" TEXT NOT NULL,
    "total_views" INTEGER NOT NULL DEFAULT 0,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "video_saved" BOOLEAN NOT NULL DEFAULT false,
    "commented" BOOLEAN NOT NULL DEFAULT false,
    "finished_at" DATETIME,
    CONSTRAINT "tiktok_interaction_history_int_programada_tiktok_id_fkey" FOREIGN KEY ("int_programada_tiktok_id") REFERENCES "scheduled_tiktok_interaction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "facebook_interaction_history" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "int_programada_facebook_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "shared_groups" INTEGER NOT NULL DEFAULT 0,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "commented" BOOLEAN NOT NULL DEFAULT false,
    "finished_at" DATETIME,
    CONSTRAINT "facebook_interaction_history_int_programada_facebook_id_fkey" FOREIGN KEY ("int_programada_facebook_id") REFERENCES "scheduled_facebook_interaction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
