CREATE TYPE "SponsorVideoSource" AS ENUM ('EMBED', 'UPLOAD');

ALTER TABLE "SponsorVideo"
  ADD COLUMN "source" "SponsorVideoSource" NOT NULL DEFAULT 'EMBED',
  ADD COLUMN "storageKey" TEXT,
  ADD COLUMN "mimeType" TEXT,
  ADD COLUMN "fileSize" INTEGER,
  ALTER COLUMN "embedUrl" DROP NOT NULL;