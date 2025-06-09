-- CreateTable
CREATE TABLE "WebhookLog" (
    "id" SERIAL NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "telecom" TEXT NOT NULL,
    "package" TEXT NOT NULL,
    "amountDeducted" INTEGER NOT NULL,
    "paymentMethod" TEXT NOT NULL DEFAULT 'airtime',
    "status" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookLog_pkey" PRIMARY KEY ("id")
);
