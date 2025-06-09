/*
  Warnings:

  - You are about to drop the column `amountDeducted` on the `WebhookLog` table. All the data in the column will be lost.
  - You are about to drop the column `package` on the `WebhookLog` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `WebhookLog` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `WebhookLog` table. All the data in the column will be lost.
  - You are about to drop the column `telecom` on the `WebhookLog` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `WebhookLog` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transactionId]` on the table `WebhookLog` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `receivedData` to the `WebhookLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionId` to the `WebhookLog` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('AIRTIME', 'ATM_CARD', 'BANK_TRANSFER');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "WebhookLog" DROP COLUMN "amountDeducted",
DROP COLUMN "package",
DROP COLUMN "paymentMethod",
DROP COLUMN "phoneNumber",
DROP COLUMN "telecom",
DROP COLUMN "timestamp",
ADD COLUMN     "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "receivedData" JSONB NOT NULL,
ADD COLUMN     "transactionId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "telecom" TEXT,
    "healthPackage" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "keyword" TEXT,
    "method" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WebhookLog_transactionId_key" ON "WebhookLog"("transactionId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebhookLog" ADD CONSTRAINT "WebhookLog_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
