import type { Gallery, GalleryImage } from "@prisma/client";
import type { GalleryDto, GalleryImageDto } from "@/types/gallery";

export type GalleryWithImages = Gallery & { images: GalleryImage[] };

export function toGalleryImageDto(image: GalleryImage): GalleryImageDto {
  return {
    id: image.id,
    galleryId: image.galleryId,
    storageKey: image.storageKey,
    url: image.url,
    title: image.title,
    description: image.description,
    altText: image.altText,
    credit: image.credit,
    mimeType: image.mimeType,
    width: image.width,
    height: image.height,
    fileSize: image.fileSize,
    layoutVariant: image.layoutVariant,
    sortOrder: image.sortOrder,
    published: image.published,
  };
}

export function toGalleryDto(gallery: GalleryWithImages): GalleryDto {
  return {
    id: gallery.id,
    pageSlug: gallery.pageSlug as GalleryDto["pageSlug"],
    title: gallery.title,
    description: gallery.description,
    published: gallery.published,
    images: gallery.images.map(toGalleryImageDto),
  };
}
