-- AlterTable
ALTER TABLE "Event-Bento-Home" RENAME CONSTRAINT "events-gallery_pkey" TO "Event-Bento-Home_pkey";

-- AlterTable
ALTER TABLE "HomeCountdown" ALTER COLUMN "id" SET DEFAULT 'home';

-- AlterTable
ALTER TABLE "LandingImage" RENAME CONSTRAINT "HomeLandingImage_pkey" TO "LandingImage_pkey";

-- AlterTable
ALTER TABLE "LandingImage" ALTER COLUMN "pageSlug" DROP DEFAULT;

-- RenameIndex
ALTER INDEX "events-gallery_published_featured_sortOrder_idx" RENAME TO "Event-Bento-Home_published_featured_sortOrder_idx";
