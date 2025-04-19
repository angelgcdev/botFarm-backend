/*
  Warnings:

  - You are about to drop the column `email` on the `cuenta_red_social` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_cuenta_red_social" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "red_social_id" INTEGER NOT NULL,
    "cuenta_google_id" INTEGER NOT NULL,
    "username" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVO',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "cuenta_red_social_cuenta_google_id_fkey" FOREIGN KEY ("cuenta_google_id") REFERENCES "cuenta_google" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "cuenta_red_social_red_social_id_fkey" FOREIGN KEY ("red_social_id") REFERENCES "red_social" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_cuenta_red_social" ("created_at", "cuenta_google_id", "id", "red_social_id", "status", "username") SELECT "created_at", "cuenta_google_id", "id", "red_social_id", "status", "username" FROM "cuenta_red_social";
DROP TABLE "cuenta_red_social";
ALTER TABLE "new_cuenta_red_social" RENAME TO "cuenta_red_social";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
