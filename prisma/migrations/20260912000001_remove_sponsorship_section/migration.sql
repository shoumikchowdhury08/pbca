-- Partner logos are standalone resources for the home sponsorships section.
ALTER TABLE "Partner" DROP CONSTRAINT "Partner_sponsorshipSectionId_fkey";
DROP INDEX "Partner_sponsorshipSectionId_published_sortOrder_idx";
ALTER TABLE "Partner" DROP COLUMN "sponsorshipSectionId";
CREATE INDEX "Partner_published_sortOrder_idx" ON "Partner"("published", "sortOrder");
DROP TABLE "SponsorshipSection";