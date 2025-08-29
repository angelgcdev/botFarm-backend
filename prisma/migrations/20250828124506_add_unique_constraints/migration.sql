/*
  Warnings:

  - A unique constraint covering the columns `[device_id,email]` on the table `google_account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[google_account_id,username]` on the table `social_network_account` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "google_account_device_id_email_key" ON "google_account"("device_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "social_network_account_google_account_id_username_key" ON "social_network_account"("google_account_id", "username");
