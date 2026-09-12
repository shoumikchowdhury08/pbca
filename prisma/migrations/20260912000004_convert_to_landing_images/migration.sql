ALTER TABLE "HomeLandingImage" RENAME TO "LandingImage";
ALTER TABLE "LandingImage" ADD COLUMN "pageSlug" TEXT NOT NULL DEFAULT 'home';
ALTER TABLE "LandingImage" ALTER COLUMN "id" DROP DEFAULT;
CREATE UNIQUE INDEX "LandingImage_pageSlug_key" ON "LandingImage"("pageSlug");
ALTER INDEX "HomeLandingImage_storageKey_key" RENAME TO "LandingImage_storageKey_key";