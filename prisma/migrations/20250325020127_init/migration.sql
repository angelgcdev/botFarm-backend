-- CreateTable
CREATE TABLE "usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "dispositivo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipo" TEXT NOT NULL,
    "conexion" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'INACTIVO',
    "add_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "removed_at" DATETIME,
    "usuarioId" INTEGER NOT NULL,
    CONSTRAINT "dispositivo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cuenta_google" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVO',
    "dispositivoId" INTEGER NOT NULL,
    CONSTRAINT "cuenta_google_dispositivoId_fkey" FOREIGN KEY ("dispositivoId") REFERENCES "dispositivo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "red_social" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT
);

-- CreateTable
CREATE TABLE "cuenta_red_social" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVO',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cuentaGoogleId" INTEGER NOT NULL,
    "redSocialId" INTEGER NOT NULL,
    CONSTRAINT "cuenta_red_social_cuentaGoogleId_fkey" FOREIGN KEY ("cuentaGoogleId") REFERENCES "cuenta_google" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "cuenta_red_social_redSocialId_fkey" FOREIGN KEY ("redSocialId") REFERENCES "red_social" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "interaccion_programada_tiktok" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre_cuenta_tiktok" TEXT NOT NULL,
    "url_video" TEXT NOT NULL,
    "cantidad_vistas" INTEGER NOT NULL,
    "dar_megusta" BOOLEAN NOT NULL DEFAULT false,
    "guardar_video" BOOLEAN NOT NULL DEFAULT false,
    "comentario" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "fecha_creacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_finalizacion" DATETIME,
    "cuentaRedSocialId" INTEGER NOT NULL,
    CONSTRAINT "interaccion_programada_tiktok_cuentaRedSocialId_fkey" FOREIGN KEY ("cuentaRedSocialId") REFERENCES "cuenta_red_social" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "interaccion_programada_facebook" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url_post" TEXT NOT NULL,
    "dar_megusta" BOOLEAN NOT NULL DEFAULT false,
    "comentario" TEXT,
    "cantidad_grupos_compartir" INTEGER NOT NULL DEFAULT 0,
    "tiempo_entre_publicaciones" INTEGER NOT NULL DEFAULT 0,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "fecha_creacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_finalizacion" DATETIME,
    "cuentaRedSocialId" INTEGER NOT NULL,
    CONSTRAINT "interaccion_programada_facebook_cuentaRedSocialId_fkey" FOREIGN KEY ("cuentaRedSocialId") REFERENCES "cuenta_red_social" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "historial_interacciones_tiktok" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "estado" TEXT NOT NULL,
    "vistas_totales" INTEGER NOT NULL DEFAULT 0,
    "megusta_aplicado" BOOLEAN NOT NULL DEFAULT false,
    "video_guardado" BOOLEAN NOT NULL DEFAULT false,
    "comentario_aplicado" BOOLEAN NOT NULL DEFAULT false,
    "fecha_finalizacion" DATETIME,
    "interaccionProgramadaTiktokId" INTEGER NOT NULL,
    CONSTRAINT "historial_interacciones_tiktok_interaccionProgramadaTiktokId_fkey" FOREIGN KEY ("interaccionProgramadaTiktokId") REFERENCES "interaccion_programada_tiktok" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "historial_interacciones_facebook" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "estado" TEXT NOT NULL,
    "gruposCompartidos" INTEGER NOT NULL DEFAULT 0,
    "megusta_aplicado" BOOLEAN NOT NULL DEFAULT false,
    "comentario_aplicado" BOOLEAN NOT NULL DEFAULT false,
    "fecha_finalizacion" DATETIME,
    "interaccionProgramadaFacebookId" INTEGER NOT NULL,
    CONSTRAINT "historial_interacciones_facebook_interaccionProgramadaFacebookId_fkey" FOREIGN KEY ("interaccionProgramadaFacebookId") REFERENCES "interaccion_programada_facebook" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
