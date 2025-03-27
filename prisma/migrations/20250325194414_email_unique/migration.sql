/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `cuenta_google` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `cuenta_red_social` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cuenta_google_email_key" ON "cuenta_google"("email");

-- CreateIndex
CREATE UNIQUE INDEX "cuenta_red_social_email_key" ON "cuenta_red_social"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");
