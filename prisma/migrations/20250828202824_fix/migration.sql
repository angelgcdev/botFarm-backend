/*
  Warnings:

  - A unique constraint covering the columns `[google_account_id,social_network_id,username]` on the table `social_network_account` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "social_network_account_google_account_id_username_key";

-- CreateIndex
CREATE UNIQUE INDEX "social_network_account_google_account_id_social_network_id_username_key" ON "social_network_account"("google_account_id", "social_network_id", "username");
