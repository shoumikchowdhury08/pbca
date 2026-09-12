-- CreateTable
CREATE TABLE "SponsorshipSection" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SponsorshipSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "sponsorshipSectionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "websiteUrl" TEXT,
    "imageStorageKey" TEXT NOT NULL,
    "imageUrl" TEXT,
    "imageAltText" TEXT NOT NULL,
    "imageMimeType" TEXT,
    "imageWidth" INTEGER,
    "imageHeight" INTEGER,
    "imageFileSize" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SponsorshipSection_slug_key" ON "SponsorshipSection"("slug");
CREATE INDEX "Partner_sponsorshipSectionId_published_sortOrder_idx" ON "Partner"("sponsorshipSectionId", "published", "sortOrder");

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_sponsorshipSectionId_fkey" FOREIGN KEY ("sponsorshipSectionId") REFERENCES "SponsorshipSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;