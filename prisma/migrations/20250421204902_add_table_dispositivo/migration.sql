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
    "configuracion_completa" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "dispositivo_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_dispositivo" ("connected_at", "device_type", "id", "last_activity", "marca", "status", "udid", "usuario_id", "version_so") SELECT "connected_at", "device_type", "id", "last_activity", "marca", "status", "udid", "usuario_id", "version_so" FROM "dispositivo";
DROP TABLE "dispositivo";
ALTER TABLE "new_dispositivo" RENAME TO "dispositivo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
