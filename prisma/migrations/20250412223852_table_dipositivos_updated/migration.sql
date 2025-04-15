/*
  Warnings:

  - You are about to drop the column `serial_number` on the `dispositivo` table. All the data in the column will be lost.
  - Added the required column `udid` to the `dispositivo` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_dispositivo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuario_id" INTEGER NOT NULL,
    "udid" TEXT NOT NULL,
    "device_type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'INACTIVO',
    "version_so" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "connected_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_activity" DATETIME,
    CONSTRAINT "dispositivo_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_dispositivo" ("connected_at", "device_type", "id", "last_activity", "marca", "status", "usuario_id", "version_so") SELECT "connected_at", "device_type", "id", "last_activity", "marca", "status", "usuario_id", "version_so" FROM "dispositivo";
DROP TABLE "dispositivo";
ALTER TABLE "new_dispositivo" RENAME TO "dispositivo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
