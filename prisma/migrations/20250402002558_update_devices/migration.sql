/*
  Warnings:

  - You are about to drop the column `password` on the `cuenta_red_social` table. All the data in the column will be lost.
  - You are about to drop the column `connection` on the `dispositivo` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `dispositivo` table. All the data in the column will be lost.
  - You are about to drop the column `removed_at` on the `dispositivo` table. All the data in the column will be lost.
  - Added the required column `marca` to the `dispositivo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serial_number` to the `dispositivo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `version_so` to the `dispositivo` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_cuenta_red_social" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "red_social_id" INTEGER NOT NULL,
    "cuenta_google_id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVO',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "cuenta_red_social_cuenta_google_id_fkey" FOREIGN KEY ("cuenta_google_id") REFERENCES "cuenta_google" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "cuenta_red_social_red_social_id_fkey" FOREIGN KEY ("red_social_id") REFERENCES "red_social" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_cuenta_red_social" ("created_at", "cuenta_google_id", "email", "id", "red_social_id", "status", "username") SELECT "created_at", "cuenta_google_id", "email", "id", "red_social_id", "status", "username" FROM "cuenta_red_social";
DROP TABLE "cuenta_red_social";
ALTER TABLE "new_cuenta_red_social" RENAME TO "cuenta_red_social";
CREATE UNIQUE INDEX "cuenta_red_social_email_key" ON "cuenta_red_social"("email");
CREATE TABLE "new_dispositivo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuario_id" INTEGER NOT NULL,
    "serial_number" TEXT NOT NULL,
    "device_type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'INACTIVO',
    "version_so" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "connected_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_activity" DATETIME,
    CONSTRAINT "dispositivo_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_dispositivo" ("device_type", "id", "status", "usuario_id") SELECT "device_type", "id", "status", "usuario_id" FROM "dispositivo";
DROP TABLE "dispositivo";
ALTER TABLE "new_dispositivo" RENAME TO "dispositivo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
