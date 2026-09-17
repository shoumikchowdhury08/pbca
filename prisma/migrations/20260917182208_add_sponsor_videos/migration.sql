-- CreateEnum
CREATE TYPE "SponsorVideoSource" AS ENUM ('EMBED', 'UPLOAD');

-- CreateTable
CREATE TABLE "SponsorVideo" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "source" "SponsorVideoSource" NOT NULL DEFAULT 'EMBED',
    "embedUrl" TEXT,
    "storageKey" TEXT,
    "mimeType" TEXT,
    "fileSize" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SponsorVideo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SponsorVideo_published_sortOrder_idx" ON "SponsorVideo"("published", "sortOrder");

-- Seed the gallery row that powers the Sponsors page showcase.
INSERT INTO "Gallery" ("id", "pageSlug", "title", "description", "published", "createdAt", "updatedAt")
VALUES (
    'sponsors-gallery',
    'sponsors',
    'Sponsors gallery',
    'Highlights and creative work shared by our sponsors.',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT ("pageSlug") DO NOTHING;
