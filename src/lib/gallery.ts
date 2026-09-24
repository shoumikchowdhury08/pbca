import type { Gallery, GalleryImage } from "@prisma/client";
import type { GalleryDto, GalleryImageDto } from "@/types/types";

export type GalleryWithImages = Gallery & { images: GalleryImage[] };

export function galleryImageUrl(storageKey: string) {
  return `/api/r2/${storageKey.split("/").map(encodeURIComponent).join("/")}`;
}

export function toGalleryImageDto(image: GalleryImage): GalleryImageDto {
  return {
    id: image.id,
    galleryId: image.galleryId,
    storageKey: image.storageKey,
    url: galleryImageUrl(image.storageKey),
    title: image.title,
    description: image.description,
    altText: image.altText,
    mimeType: image.mimeType,
    width: image.width,
    height: image.height,
    fileSize: image.fileSize,
    layoutVariant: image.layoutVariant,
    sortOrder: image.sortOrder,
    published: image.published,
    createdAt: image.createdAt.toISOString(),
  };
}

export function toGalleryDto(gallery: GalleryWithImages): GalleryDto {
  return {
    id: gallery.id,
    pageSlug: gallery.pageSlug as GalleryDto["pageSlug"],
    title: gallery.title,
    description: gallery.description,
    published: gallery.published,
    createdAt: gallery.createdAt.toISOString(),
    images: gallery.images.map(toGalleryImageDto),
  };
}
