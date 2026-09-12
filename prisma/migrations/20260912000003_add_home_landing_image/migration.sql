CREATE TABLE "HomeLandingImage" (
    "id" TEXT NOT NULL DEFAULT 'home',
    "storageKey" TEXT NOT NULL,
    "altText" TEXT NOT NULL,
    "mimeType" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "fileSize" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "HomeLandingImage_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "HomeLandingImage_storageKey_key" ON "HomeLandingImage"("storageKey");