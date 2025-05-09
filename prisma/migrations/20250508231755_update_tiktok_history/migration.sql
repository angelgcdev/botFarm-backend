-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tiktok_interaction_history" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT,
    "total_views" INTEGER NOT NULL DEFAULT 0,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "video_saved" BOOLEAN NOT NULL DEFAULT false,
    "commented" TEXT
);
INSERT INTO "new_tiktok_interaction_history" ("commented", "id", "liked", "total_views", "username", "video_saved") SELECT "commented", "id", "liked", "total_views", "username", "video_saved" FROM "tiktok_interaction_history";
DROP TABLE "tiktok_interaction_history";
ALTER TABLE "new_tiktok_interaction_history" RENAME TO "tiktok_interaction_history";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
