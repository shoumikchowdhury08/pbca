-- Sponsor videos are embed-only: drop the source/upload columns.
ALTER TABLE "SponsorVideo" DROP COLUMN IF EXISTS "source";
ALTER TABLE "SponsorVideo" DROP COLUMN IF EXISTS "storageKey";
ALTER TABLE "SponsorVideo" DROP COLUMN IF EXISTS "mimeType";
ALTER TABLE "SponsorVideo" DROP COLUMN IF EXISTS "fileSize";

-- embedUrl is now required.
UPDATE "SponsorVideo" SET "embedUrl" = '' WHERE "embedUrl" IS NULL;
ALTER TABLE "SponsorVideo" ALTER COLUMN "embedUrl" SET NOT NULL;

DROP TYPE IF EXISTS "SponsorVideoSource";