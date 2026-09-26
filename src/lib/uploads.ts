/**
 * Shared limits for admin image and video uploads.
 *
 * These constants are used by both the admin browser code and the API routes,
 * so this module must stay free of Node-only APIs.
 */
export const MAX_IMAGE_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
export const MAX_IMAGE_FILE_SIZE_LABEL = "50 MB";

export const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export const ALLOWED_IMAGE_ACCEPT =
  "image/jpeg,image/png,image/webp,image/avif";

export const INVALID_IMAGE_MESSAGE = `Use a JPEG, PNG, WebP, or AVIF image up to ${MAX_IMAGE_FILE_SIZE_LABEL}.`;
export const MAX_SPONSOR_VIDEO_FILE_SIZE = 250 * 1024 * 1024;
export const MAX_SPONSOR_VIDEO_FILE_SIZE_LABEL = "250 MB";
export const ALLOWED_SPONSOR_VIDEO_TYPES = new Set(["video/mp4", "video/webm"]);
export const ALLOWED_SPONSOR_VIDEO_ACCEPT = "video/mp4,video/webm";
export const INVALID_SPONSOR_VIDEO_MESSAGE = `Use an MP4 or WebM video up to ${MAX_SPONSOR_VIDEO_FILE_SIZE_LABEL}.`;
export const HOME_LANDING_MEDIA_ACCEPT = `${ALLOWED_IMAGE_ACCEPT},${ALLOWED_SPONSOR_VIDEO_ACCEPT}`;

/**
 * The upload purposes the presign endpoint understands. Each one maps to a
 * server-generated storage key layout and to the entity route that is allowed
 * to attach the resulting key.
 */
export const UPLOAD_SCOPES = [
  "gallery-image",
  "gallery-image-replace",
  "landing-image",
  "partner-logo",
  "event-bento-home",
  "sponsor-video",
] as const;

export type UploadScope = (typeof UPLOAD_SCOPES)[number];

export function isUploadScope(value: unknown): value is UploadScope {
  return (
    typeof value === "string" &&
    (UPLOAD_SCOPES as readonly string[]).includes(value)
  );
}

/** Storage key extension for an allowed image type (`image/jpeg` -> `jpg`). */
export function imageExtensionFor(type: string) {
  return type === "image/jpeg" ? "jpg" : type.slice("image/".length);
}

export function videoExtensionFor(type: string) {
  return type === "video/mp4" ? "mp4" : "webm";
}

export const IMAGE_TOO_LARGE_MESSAGE = `Images must be ${MAX_IMAGE_FILE_SIZE_LABEL} or smaller.`;

export function formatFileSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
