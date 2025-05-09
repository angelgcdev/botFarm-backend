/*
  Warnings:

  - You are about to drop the column `finished_at` on the `int_programada_facebook` table. All the data in the column will be lost.
  - You are about to drop the column `finished_at` on the `int_programada_tiktok` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_int_programada_facebook" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cuenta_red_social_id" INTEGER NOT NULL,
    "url_post" TEXT NOT NULL,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "comment" TEXT,
    "shared_groups_count" INTEGER NOT NULL DEFAULT 0,
    "time_between_posts" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "int_programada_facebook_cuenta_red_social_id_fkey" FOREIGN KEY ("cuenta_red_social_id") REFERENCES "cuenta_red_social" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_int_programada_facebook" ("comment", "created_at", "cuenta_red_social_id", "id", "liked", "shared_groups_count", "status", "time_between_posts", "url_post") SELECT "comment", "created_at", "cuenta_red_social_id", "id", "liked", "shared_groups_count", "status", "time_between_posts", "url_post" FROM "int_programada_facebook";
DROP TABLE "int_programada_facebook";
ALTER TABLE "new_int_programada_facebook" RENAME TO "int_programada_facebook";
CREATE TABLE "new_int_programada_tiktok" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cuenta_red_social_id" INTEGER NOT NULL,
    "url_video" TEXT NOT NULL,
    "views_count" INTEGER NOT NULL,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "saved" BOOLEAN NOT NULL DEFAULT false,
    "comment" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "int_programada_tiktok_cuenta_red_social_id_fkey" FOREIGN KEY ("cuenta_red_social_id") REFERENCES "cuenta_red_social" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_int_programada_tiktok" ("comment", "created_at", "cuenta_red_social_id", "id", "liked", "saved", "status", "url_video", "views_count") SELECT "comment", "created_at", "cuenta_red_social_id", "id", "liked", "saved", "status", "url_video", "views_count" FROM "int_programada_tiktok";
DROP TABLE "int_programada_tiktok";
ALTER TABLE "new_int_programada_tiktok" RENAME TO "int_programada_tiktok";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
