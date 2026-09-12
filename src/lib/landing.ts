import { GALLERY_PAGE_SLUGS, type GalleryPageSlug } from "@/types/gallery";

export function isGalleryPageSlug(value: string): value is GalleryPageSlug {
  return (GALLERY_PAGE_SLUGS as readonly string[]).includes(value);
}

export function landingStorageKey(pageSlug: GalleryPageSlug) {
  return `${pageSlug}/landing-image`;
}
