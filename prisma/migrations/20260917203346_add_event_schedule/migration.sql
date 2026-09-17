-- CreateEnum
CREATE TYPE "EventScheduleTrack" AS ENUM ('PUJO', 'CULTURAL');

-- CreateTable
CREATE TABLE "EventScheduleItem" (
    "id" TEXT NOT NULL,
    "track" "EventScheduleTrack" NOT NULL DEFAULT 'PUJO',
    "dayLabel" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "timeLabel" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventScheduleItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventScheduleItem_published_track_dayLabel_sortOrder_idx" ON "EventScheduleItem"("published", "track", "dayLabel", "sortOrder");

-- Seed the example schedule so the tables are populated on first deploy.
INSERT INTO "EventScheduleItem" ("id", "track", "dayLabel", "title", "timeLabel", "sortOrder", "published", "createdAt", "updatedAt") VALUES
  ('sched-pujo-d1-1', 'PUJO', 'Day 1 — Shashthi', 'Pushpanjali', '7:00 am', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('sched-pujo-d1-2', 'PUJO', 'Day 1 — Shashthi', 'Aarti', '6:00 pm', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('sched-cult-d1-1', 'CULTURAL', 'Day 1 — Shashthi', 'Children''s arts', '10:00 am', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('sched-cult-d1-2', 'CULTURAL', 'Day 1 — Shashthi', 'Band performance', '6:00 pm', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;
