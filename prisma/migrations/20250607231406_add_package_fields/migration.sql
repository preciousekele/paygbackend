-- CreateEnum
CREATE TYPE "PackageType" AS ENUM ('BASIC', 'STANDARD', 'PREMIUM');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "package" "PackageType" NOT NULL DEFAULT 'BASIC';

-- CreateTable
CREATE TABLE "UserPackageHistory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "oldPackage" "PackageType" NOT NULL,
    "newPackage" "PackageType" NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPackageHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserPackageHistory" ADD CONSTRAINT "UserPackageHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
