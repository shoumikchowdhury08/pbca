import type { EventsGallery } from "@prisma/client";
import type { EventsGalleryDto } from "@/types/events";

export function toEventsGalleryDto(item: EventsGallery): EventsGalleryDto {
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
