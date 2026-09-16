export const GALLERY_PAGE_SLUGS = [
  "home",
  "about-us",
  "events",
  "membership",
  "awards-and-recognition",
] as const;

export type GalleryPageSlug = (typeof GALLERY_PAGE_SLUGS)[number];

export const GALLERY_PAGE_LABELS: Record<GalleryPageSlug, string> = {
  home: "Home",
  "about-us": "About Us",
  events: "Events",
  membership: "Membership",
  "awards-and-recognition": "Awards And Recognition",
};

export interface GalleryImageDto {
  id: string;
  galleryId: string;
  storageKey: string;
  url: string;
  title: string;
  description: string;
  altText: string;
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
  title: string;
  description?: string;
  altText: string;
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

export type NavigationProps = {
  nav: string[];
};

export type SiteNavItem = {
  label: string;
  href: string;
};

export type imgProps = {
  Heroimg?: string;
  Crowdimg?: string;
  Flowerimg?: string;
  Idolimg?: string;
};

export interface PartnerImageDto {
  storageKey: string;
  altText: string;
  mimeType: string | null;
  width: number | null;
  height: number | null;
  fileSize: number | null;
}

export interface PartnerDto {
  id: string;
  name: string;
  websiteUrl: string | null;
  image: PartnerImageDto;
  sortOrder: number;
  published: boolean;
}

export interface TestimonialDto {
  id: string;
  quote: string;
  name: string;
  sortOrder: number;
  published: boolean;
}

export interface HomeCountdownDto {
  id: string;
  targetAt: string;
  updatedAt: string;
}

export interface LandingImageDto {
  id: string;
  pageSlug: string;
  storageKey: string;
  imageUrl: string;
  altText: string;
  mimeType: string | null;
  width: number | null;
  height: number | null;
  fileSize: number | null;
  updatedAt: string;
}

export interface EventsBentoHomeDto {
  id: string;
  title: string;
  detail: string;
  image: {
    storageKey: string;
    imageUrl: string;
    altText: string;
    mimeType: string | null;
    width: number | null;
    height: number | null;
    fileSize: number | null;
  };
  featured: boolean;
  sortOrder: number;
  published: boolean;
}
