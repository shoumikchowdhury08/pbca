export const GALLERY_PAGE_SLUGS = [
  "home",
  "about-us",
  "events",
  "membership",
  "awards-and-recognition",
] as const;

export type GalleryPageSlug = (typeof GALLERY_PAGE_SLUGS)[number];

export interface GalleryImageDto {
  id: string;
  galleryId: string;
  storageKey: string;
  url: string;
  title: string;
  description: string;
  altText: string;
  credit: string | null;
  mimeType: string | null;
  width: number | null;
  height: number | null;
  fileSize: number | null;
  layoutVariant: string;
  sortOrder: number;
  published: boolean;
}

export interface GalleryDto {
  id: string;
  pageSlug: GalleryPageSlug;
  title: string;
  description: string;
  published: boolean;
  images: GalleryImageDto[];
}

export interface ApiErrorDto {
  error: {
    code: string;
    message: string;
    fields?: Record<string, string[]>;
  };
}

export interface ApiResponse<T> {
  data: T;
}

export interface GalleryImageInput {
  storageKey: string;
  url: string;
  title: string;
  description?: string;
  altText: string;
  credit?: string | null;
  mimeType?: string | null;
  width?: number | null;
  height?: number | null;
  fileSize?: number | null;
  layoutVariant?: string;
  sortOrder?: number;
  published?: boolean;
}

export interface GalleryInput {
  pageSlug: GalleryPageSlug;
  title: string;
  description?: string;
  published?: boolean;
}
