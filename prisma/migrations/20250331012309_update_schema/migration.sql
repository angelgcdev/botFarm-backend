/*
  Warnings:

  - You are about to drop the `historial_interacciones_facebook` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `historial_interacciones_tiktok` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `interaccion_programada_facebook` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `interaccion_programada_tiktok` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `dispositivoId` on the `cuenta_google` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `cuenta_google` table. All the data in the column will be lost.
  - You are about to drop the column `cuentaGoogleId` on the `cuenta_red_social` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `cuenta_red_social` table. All the data in the column will be lost.
  - You are about to drop the column `redSocialId` on the `cuenta_red_social` table. All the data in the column will be lost.
  - You are about to drop the column `add_at` on the `dispositivo` table. All the data in the column will be lost.
  - You are about to drop the column `conexion` on the `dispositivo` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `dispositivo` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `dispositivo` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioId` on the `dispositivo` table. All the data in the column will be lost.
  - You are about to drop the column `descripcion` on the `red_social` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `red_social` table. All the data in the column will be lost.
  - You are about to drop the column `rol` on the `usuario` table. All the data in the column will be lost.
  - Added the required column `dispositivo_id` to the `cuenta_google` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cuenta_google_id` to the `cuenta_red_social` table without a default value. This is not possible if the table is not empty.
  - Added the required column `red_social_id` to the `cuenta_red_social` table without a default value. This is not possible if the table is not empty.
  - Added the required column `connection` to the `dispositivo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `device_type` to the `dispositivo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuario_id` to the `dispositivo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `red_social` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "historial_interacciones_facebook";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "historial_interacciones_tiktok";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "interaccion_programada_facebook";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "interaccion_programada_tiktok";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "int_programada_tiktok" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cuenta_red_social_id" INTEGER NOT NULL,
    "url_video" TEXT NOT NULL,
    "views_count" INTEGER NOT NULL,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "saved" BOOLEAN NOT NULL DEFAULT false,
    "comment" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" DATETIME,
    CONSTRAINT "int_programada_tiktok_cuenta_red_social_id_fkey" FOREIGN KEY ("cuenta_red_social_id") REFERENCES "cuenta_red_social" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "int_programada_facebook" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cuenta_red_social_id" INTEGER NOT NULL,
    "url_post" TEXT NOT NULL,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "comment" TEXT,
    "shared_groups_count" INTEGER NOT NULL DEFAULT 0,
    "time_between_posts" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" DATETIME,
    CONSTRAINT "int_programada_facebook_cuenta_red_social_id_fkey" FOREIGN KEY ("cuenta_red_social_id") REFERENCES "cuenta_red_social" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "hist_int_tiktok" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "int_programada_tiktok_id" INTEGER NOT NULL,
    "tiktok_account_name" TEXT,
    "status" TEXT NOT NULL,
    "total_views" INTEGER NOT NULL DEFAULT 0,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "video_saved" BOOLEAN NOT NULL DEFAULT false,
    "commented" BOOLEAN NOT NULL DEFAULT false,
    "finished_at" DATETIME,
    CONSTRAINT "hist_int_tiktok_int_programada_tiktok_id_fkey" FOREIGN KEY ("int_programada_tiktok_id") REFERENCES "int_programada_tiktok" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "hist_int_facebook" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "int_programada_facebook_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "shared_groups" INTEGER NOT NULL DEFAULT 0,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "commented" BOOLEAN NOT NULL DEFAULT false,
    "finished_at" DATETIME,
    CONSTRAINT "hist_int_facebook_int_programada_facebook_id_fkey" FOREIGN KEY ("int_programada_facebook_id") REFERENCES "int_programada_facebook" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_cuenta_google" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dispositivo_id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVO',
    CONSTRAINT "cuenta_google_dispositivo_id_fkey" FOREIGN KEY ("dispositivo_id") REFERENCES "dispositivo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_cuenta_google" ("email", "id") SELECT "email", "id" FROM "cuenta_google";
DROP TABLE "cuenta_google";
ALTER TABLE "new_cuenta_google" RENAME TO "cuenta_google";
CREATE UNIQUE INDEX "cuenta_google_email_key" ON "cuenta_google"("email");
CREATE TABLE "new_cuenta_red_social" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "red_social_id" INTEGER NOT NULL,
    "cuenta_google_id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVO',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "cuenta_red_social_cuenta_google_id_fkey" FOREIGN KEY ("cuenta_google_id") REFERENCES "cuenta_google" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "cuenta_red_social_red_social_id_fkey" FOREIGN KEY ("red_social_id") REFERENCES "red_social" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_cuenta_red_social" ("created_at", "email", "id", "password", "username") SELECT "created_at", "email", "id", "password", "username" FROM "cuenta_red_social";
DROP TABLE "cuenta_red_social";
ALTER TABLE "new_cuenta_red_social" RENAME TO "cuenta_red_social";
CREATE UNIQUE INDEX "cuenta_red_social_email_key" ON "cuenta_red_social"("email");
CREATE TABLE "new_dispositivo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuario_id" INTEGER NOT NULL,
    "device_type" TEXT NOT NULL,
    "connection" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'INACTIVO',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "removed_at" DATETIME,
    CONSTRAINT "dispositivo_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_dispositivo" ("id", "removed_at") SELECT "id", "removed_at" FROM "dispositivo";
DROP TABLE "dispositivo";
ALTER TABLE "new_dispositivo" RENAME TO "dispositivo";
CREATE TABLE "new_red_social" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT
);
INSERT INTO "new_red_social" ("id") SELECT "id" FROM "red_social";
DROP TABLE "red_social";
ALTER TABLE "new_red_social" RENAME TO "red_social";
CREATE TABLE "new_usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_usuario" ("created_at", "email", "id", "password", "updated_at") SELECT "created_at", "email", "id", "password", "updated_at" FROM "usuario";
DROP TABLE "usuario";
ALTER TABLE "new_usuario" RENAME TO "usuario";
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
