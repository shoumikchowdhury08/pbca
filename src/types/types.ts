export const GALLERY_PAGE_SLUGS = [
  "home",
  "about-us",
  "events",
  "membership",
  "awards-and-recognition",
  "sponsors",
  "gallery",
] as const;

export type GalleryPageSlug = (typeof GALLERY_PAGE_SLUGS)[number];

export const GALLERY_PAGE_LABELS: Record<GalleryPageSlug, string> = {
  home: "Home",
  "about-us": "About Us",
  events: "Events",
  membership: "Membership",
  "awards-and-recognition": "Awards And Recognition",
  sponsors: "Sponsors",
  gallery: "Gallery",
};

/**
 * The Gallery page sections are gallery rows whose slug is not one of the fixed
 * page slugs above. They are created and removed from the admin portal, so the
 * section list stays dynamic -- adding a section never needs a code change.
 *
 * Their images capture only an optional title, which is why the admin form and
 * the API drop the description/accessibility fields for these galleries.
 */
export function isGallerySectionSlug(value: string) {
  return !(GALLERY_PAGE_SLUGS as readonly string[]).includes(value);
}

/**
 * Orders gallery images the way the site shows them: sortOrder first, then
 * creation time to break the ties that new uploads share (default 0). Admin
 * and public consumers both sort with this helper so position-based mappings
 * -- such as the Membership benefit-card images -- always agree.
 */
export function sortGalleryImages(
  images: GalleryImageDto[],
): GalleryImageDto[] {
  return [...images].sort(
    (a, b) =>
      a.sortOrder - b.sortOrder || a.createdAt.localeCompare(b.createdAt),
  );
}

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
  /** ISO timestamp; drives deterministic ordering when sortOrder ties. */
  createdAt: string;
}

export interface GalleryDto {
  id: string;
  pageSlug: GalleryPageSlug;
  title: string;
  description: string;
  published: boolean;
  /** Creation order drives the running order of the Gallery page sections. */
  createdAt: string;
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

export interface SponsorVideoDto {
  id: string;
  title: string;
  description: string;
  /** Link to the video on YouTube, Vimeo, or any streaming platform. */
  embedUrl: string;
  /** Playable URL for the iframe player, derived from `embedUrl`. */
  embedSrc: string | null;
  sortOrder: number;
  featured: boolean;
  published: boolean;
}

export interface HomeCountdownDto {
  id: string;
  targetAt: string;
  updatedAt: string;
}

export const EVENT_SCHEDULE_TRACKS = ["pujo", "cultural"] as const;

export type EventScheduleTrack = (typeof EVENT_SCHEDULE_TRACKS)[number];

export interface EventScheduleItemDto {
  id: string;
  track: EventScheduleTrack;
  dayLabel: string;
  title: string;
  timeLabel: string;
  sortOrder: number;
  published: boolean;
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
