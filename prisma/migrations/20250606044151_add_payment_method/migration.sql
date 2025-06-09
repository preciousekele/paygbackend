/*
  Warnings:

  - You are about to drop the `airtime_transactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `health_packages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `registered_numbers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `system_config` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `webhook_logs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "airtime_transactions" DROP CONSTRAINT "airtime_transactions_packageId_fkey";

-- DropForeignKey
ALTER TABLE "airtime_transactions" DROP CONSTRAINT "airtime_transactions_phoneNumber_fkey";

-- DropForeignKey
ALTER TABLE "airtime_transactions" DROP CONSTRAINT "airtime_transactions_userId_fkey";

-- DropForeignKey
ALTER TABLE "registered_numbers" DROP CONSTRAINT "registered_numbers_userId_fkey";

-- DropTable
DROP TABLE "airtime_transactions";

-- DropTable
DROP TABLE "health_packages";

-- DropTable
DROP TABLE "registered_numbers";

-- DropTable
DROP TABLE "system_config";

-- DropTable
DROP TABLE "users";

-- DropTable
DROP TABLE "webhook_logs";

-- DropEnum
DROP TYPE "Network";

-- DropEnum
DROP TYPE "TransactionStatus";

-- DropEnum
DROP TYPE "WebhookStatus";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");
