import { randomUUID } from "node:crypto";
import { landingStorageKey } from "@/lib/landing";
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_SPONSOR_VIDEO_TYPES,
  imageExtensionFor,
  videoExtensionFor,
  type UploadScope,
} from "@/lib/uploads";
import type { GalleryPageSlug } from "@/types/types";

/**
 * Server-only storage key generation.
 *
 * Uploads are signed for a key that this module derives, never for a key the
 * browser supplies, so an admin session cannot be used to write to arbitrary
 * paths in the bucket. The layouts below mirror the ones the previous
 * FormData upload routes used, which keeps `src/app/api/r2/[...key]/route.ts`
 * and every existing object working unchanged.
 */
export const PARTNER_LOGO_PREFIX = "home/partners-logos/";
export const EVENT_BENTO_PREFIX = "home/events-gallery/";
export const SPONSOR_VIDEO_PREFIX = "sponsors/videos/";

const UUID_PATTERN =
  "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
const EXTENSION_PATTERN = [...ALLOWED_IMAGE_TYPES]
  .map(imageExtensionFor)
  .join("|");
const VIDEO_EXTENSION_PATTERN = [...ALLOWED_SPONSOR_VIDEO_TYPES]
  .map(videoExtensionFor)
  .join("|");

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function generatedKeyPattern(prefix: string) {
  return new RegExp(
    `^${escapeRegExp(prefix)}${UUID_PATTERN}\\.(${EXTENSION_PATTERN})$`,
  );
}

export function galleryImageKey(pageSlug: string, contentType: string) {
  return `${pageSlug}/gallery/${randomUUID()}.${imageExtensionFor(contentType)}`;
}

export function partnerLogoKey(contentType: string) {
  return `${PARTNER_LOGO_PREFIX}${randomUUID()}.${imageExtensionFor(contentType)}`;
}

export function eventBentoHomeKey(contentType: string) {
  return `${EVENT_BENTO_PREFIX}${randomUUID()}.${imageExtensionFor(contentType)}`;
}

export function sponsorVideoKey(contentType: string) {
  return `${SPONSOR_VIDEO_PREFIX}${randomUUID()}.${videoExtensionFor(contentType)}`;
}

export function landingImageKey(pageSlug: GalleryPageSlug) {
  return landingStorageKey(pageSlug);
}

/**
 * Re-checks that a key handed back by the browser is exactly what the presign
 * endpoint would have generated for that purpose and entity. This is what
 * stops a key signed for one gallery from being attached to another record,
 * or a crafted key from being written to the database.
 */
export function keyMatchesScope(
  scope: UploadScope,
  key: string,
  pageSlug?: string,
) {
  if (key.length > 512) return false;

  switch (scope) {
    case "gallery-image":
    case "gallery-image-replace":
      return Boolean(
        pageSlug && generatedKeyPattern(`${pageSlug}/gallery/`).test(key),
      );
    case "landing-image":
      return Boolean(
        pageSlug && key === landingImageKey(pageSlug as GalleryPageSlug),
      );
    case "partner-logo":
      return generatedKeyPattern(PARTNER_LOGO_PREFIX).test(key);
    case "event-bento-home":
      return generatedKeyPattern(EVENT_BENTO_PREFIX).test(key);
    case "sponsor-video":
      return new RegExp(
        `^${escapeRegExp(SPONSOR_VIDEO_PREFIX)}${UUID_PATTERN}\\.(${VIDEO_EXTENSION_PATTERN})$`,
      ).test(key);
  }
}
