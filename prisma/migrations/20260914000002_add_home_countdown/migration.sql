-- CreateTable
CREATE TABLE "HomeCountdown" (
    "id" TEXT NOT NULL,
    "targetAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeCountdown_pkey" PRIMARY KEY ("id")
);
