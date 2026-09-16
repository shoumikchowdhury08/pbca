/**
 * Shared limits for admin image uploads (gallery images, landing images,
 * partner logos and home event gallery images).
 */
export const MAX_IMAGE_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
export const MAX_IMAGE_FILE_SIZE_LABEL = "50 MB";

export const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const ALLOWED_IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";

export const INVALID_IMAGE_MESSAGE = `Use a JPEG, PNG, or WebP image up to ${MAX_IMAGE_FILE_SIZE_LABEL}.`;

export const IMAGE_TOO_LARGE_MESSAGE = `Images must be ${MAX_IMAGE_FILE_SIZE_LABEL} or smaller.`;

export function formatFileSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}