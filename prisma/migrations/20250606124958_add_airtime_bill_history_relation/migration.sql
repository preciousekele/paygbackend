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

-- CreateIndex
CREATE INDEX "AirtimeBalanceHistory_phoneNumber_network_idx" ON "AirtimeBalanceHistory"("phoneNumber", "network");

-- AddForeignKey
ALTER TABLE "AirtimeBalanceHistory" ADD CONSTRAINT "AirtimeBalanceHistory_airtimeBillId_fkey" FOREIGN KEY ("airtimeBillId") REFERENCES "AirtimeBill"("id") ON DELETE SET NULL ON UPDATE CASCADE;
