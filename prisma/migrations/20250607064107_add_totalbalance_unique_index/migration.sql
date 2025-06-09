/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `TotalBalance` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email,phoneNumber]` on the table `TotalBalance` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TotalBalance_phoneNumber_key";

-- AlterTable
ALTER TABLE "TotalBalance" DROP COLUMN "updatedAt",
ALTER COLUMN "totalAmount" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "TotalBalance_email_phoneNumber_key" ON "TotalBalance"("email", "phoneNumber");
