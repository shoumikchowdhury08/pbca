import type { EventScheduleItem } from "@prisma/client";
import type {
  EventScheduleItemDto,
  EventScheduleTrack,
} from "@/types/types";

export function toEventScheduleItemDto(
  item: EventScheduleItem,
): EventScheduleItemDto {
  const track = item.track.toLowerCase() as EventScheduleTrack;
  return {
    id: item.id,
    track,
    dayLabel: item.dayLabel,
    title: item.title,
    timeLabel: item.timeLabel,
    sortOrder: item.sortOrder,
    published: item.published,
  };
}

/**
 * Group a flat list of schedule rows into day buckets, preserving the order
 * the rows arrive in (they come sorted by day + sortOrder from the API).
 */
export function groupScheduleByDay<T extends { dayLabel: string }>(
  items: T[],
): Array<{ day: string; items: T[] }> {
  const days: Array<{ day: string; items: T[] }> = [];
  const index = new Map<string, { day: string; items: T[] }>();

  for (const item of items) {
    let bucket = index.get(item.dayLabel);
    if (!bucket) {
      bucket = { day: item.dayLabel, items: [] };
      index.set(item.dayLabel, bucket);
      days.push(bucket);
    }
    bucket.items.push(item);
  }
  return days;
}

import type { EventsBentoHome } from "@prisma/client";
import type { EventsBentoHomeDto } from "@/types/types";

export function toEventsBentoHomeDto(
  item: EventsBentoHome,
): EventsBentoHomeDto {
  const imageUrl = `/api/r2/${item.imageStorageKey
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;

  return {
    id: item.id,
    title: item.title,
    detail: item.detail,
    image: {
      storageKey: item.imageStorageKey,
      imageUrl,
      altText: item.altText,
      mimeType: item.imageMimeType,
      width: item.imageWidth,
      height: item.imageHeight,
      fileSize: item.imageFileSize,
    },
    featured: item.featured,
    sortOrder: item.sortOrder,
    published: item.published,
  };
}
