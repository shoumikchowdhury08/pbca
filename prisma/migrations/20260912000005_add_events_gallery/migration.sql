CREATE TABLE "events-gallery" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "detail" TEXT NOT NULL DEFAULT '',
    "href" TEXT NOT NULL DEFAULT '/events',
    "imageStorageKey" TEXT NOT NULL,
    "altText" TEXT NOT NULL,
    "imageMimeType" TEXT,
    "imageWidth" INTEGER,
    "imageHeight" INTEGER,
    "imageFileSize" INTEGER,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "events-gallery_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "events-gallery_published_featured_sortOrder_idx" ON "events-gallery"("published", "featured", "sortOrder");