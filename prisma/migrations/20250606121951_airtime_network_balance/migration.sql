-- CreateTable
CREATE TABLE "AirtimeNetworkBalance" (
    "id" SERIAL NOT NULL,
    "network" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AirtimeNetworkBalance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AirtimeNetworkBalance_network_phoneNumber_key" ON "AirtimeNetworkBalance"("network", "phoneNumber");
