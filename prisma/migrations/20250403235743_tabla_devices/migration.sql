/*
  Warnings:

  - You are about to drop the column `description` on the `red_social` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_red_social" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
INSERT INTO "new_red_social" ("id", "name") SELECT "id", "name" FROM "red_social";
DROP TABLE "red_social";
ALTER TABLE "new_red_social" RENAME TO "red_social";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
