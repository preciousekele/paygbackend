-- CreateTable
CREATE TABLE "PackageBalance" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "packageType" "PackageType" NOT NULL,
    "totalPackage" DOUBLE PRECISION NOT NULL,
    "balanceTbPaid" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageBalance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PackageBalance_userId_key" ON "PackageBalance"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PackageBalance_email_phoneNumber_key" ON "PackageBalance"("email", "phoneNumber");

-- AddForeignKey
ALTER TABLE "PackageBalance" ADD CONSTRAINT "PackageBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
