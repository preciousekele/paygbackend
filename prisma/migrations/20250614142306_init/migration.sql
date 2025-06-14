-- CreateEnum
CREATE TYPE "PackageType" AS ENUM ('BASIC', 'STANDARD', 'PREMIUM');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "package" "PackageType" NOT NULL DEFAULT 'BASIC',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AirtimeBill" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "package" TEXT,
    "keyword" TEXT NOT NULL,
    "amountDeducted" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AirtimeBill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AirtimeNetworkBalance" (
    "id" SERIAL NOT NULL,
    "network" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AirtimeNetworkBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AirtimeBalanceHistory" (
    "id" SERIAL NOT NULL,
    "network" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "previousBalance" DOUBLE PRECISION NOT NULL,
    "amountChanged" DOUBLE PRECISION NOT NULL,
    "newBalance" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "airtimeBillId" INTEGER,

    CONSTRAINT "AirtimeBalanceHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TotalBalance" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TotalBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPackageHistory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "oldPackage" "PackageType" NOT NULL,
    "newPackage" "PackageType" NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPackageHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "AirtimeNetworkBalance_network_phoneNumber_key" ON "AirtimeNetworkBalance"("network", "phoneNumber");

-- CreateIndex
CREATE INDEX "AirtimeBalanceHistory_phoneNumber_network_idx" ON "AirtimeBalanceHistory"("phoneNumber", "network");

-- CreateIndex
CREATE UNIQUE INDEX "TotalBalance_email_phoneNumber_key" ON "TotalBalance"("email", "phoneNumber");

-- AddForeignKey
ALTER TABLE "AirtimeBill" ADD CONSTRAINT "AirtimeBill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AirtimeBalanceHistory" ADD CONSTRAINT "AirtimeBalanceHistory_airtimeBillId_fkey" FOREIGN KEY ("airtimeBillId") REFERENCES "AirtimeBill"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPackageHistory" ADD CONSTRAINT "UserPackageHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
