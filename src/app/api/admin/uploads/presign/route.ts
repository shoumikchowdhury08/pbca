import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { jsonError, jsonText, readJsonBody } from "@/lib/api";
import { isGalleryPageSlug } from "@/lib/landing";
import { prisma } from "@/lib/prisma";
import { UPLOAD_URL_TTL_SECONDS, createPresignedPutUrl } from "@/lib/r2";
import {
  ALLOWED_SPONSOR_VIDEO_TYPES,
  ALLOWED_IMAGE_TYPES,
  INVALID_SPONSOR_VIDEO_MESSAGE,
  INVALID_IMAGE_MESSAGE,
  MAX_IMAGE_FILE_SIZE,
  MAX_SPONSOR_VIDEO_FILE_SIZE,
  isUploadScope,
  type UploadScope,
} from "@/lib/uploads";
import {
  eventBentoHomeKey,
  galleryImageKey,
  landingImageKey,
  partnerLogoKey,
  sponsorVideoKey,
} from "@/lib/upload-keys";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Issues a short-lived presigned PUT so the browser can send an image straight
 * to R2. Routing uploads through a Vercel function instead would hit the
 * platform's hard 4.5 MB request body limit (413 FUNCTION_PAYLOAD_TOO_LARGE),
 * which is what broke large gallery uploads in production.
 *
 * The key is always generated here -- a browser-supplied key is never signed --
 * and the returned URL is bound to both that exact key and the exact
 * Content-Type, so it cannot be reused for anything else.
 */
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const body = await readJsonBody(request);
  if (!body) {
    return jsonError(400, "VALIDATION_ERROR", "Invalid request body.");
  }

  const scope = body.scope;
  const contentType = jsonText(body, "contentType");
  const size = body.size;
  const fileName = jsonText(body, "fileName").slice(0, 255);

  if (!isUploadScope(scope)) {
    return jsonError(400, "VALIDATION_ERROR", "Unsupported upload type.");
  }
  const isVideo =
    scope === "sponsor-video" ||
    (scope === "landing-image" &&
      jsonText(body, "pageSlug") === "home" &&
      ALLOWED_SPONSOR_VIDEO_TYPES.has(contentType));
  const allowedTypes = isVideo
    ? ALLOWED_SPONSOR_VIDEO_TYPES
    : ALLOWED_IMAGE_TYPES;
  const maxFileSize = isVideo
    ? MAX_SPONSOR_VIDEO_FILE_SIZE
    : MAX_IMAGE_FILE_SIZE;
  const invalidMessage = isVideo
    ? INVALID_SPONSOR_VIDEO_MESSAGE
    : INVALID_IMAGE_MESSAGE;
  if (!allowedTypes.has(contentType)) {
    return jsonError(
      400,
      isVideo ? "INVALID_VIDEO" : "INVALID_IMAGE",
      invalidMessage,
    );
  }
  if (typeof size !== "number" || !Number.isInteger(size) || size <= 0) {
    return jsonError(400, "VALIDATION_ERROR", "Please select an image file.");
  }
  if (size > maxFileSize) {
    return jsonError(
      400,
      isVideo ? "INVALID_VIDEO" : "INVALID_IMAGE",
      invalidMessage,
    );
  }

  const storageKey = await resolveStorageKey(scope, body);
  if (typeof storageKey !== "string") return storageKey;

  let uploadUrl: string;
  try {
    uploadUrl = await createPresignedPutUrl(storageKey, contentType);
  } catch (error) {
    console.error(`Failed to presign R2 upload: ${storageKey}`, error);
    return jsonError(
      500,
      "PRESIGN_FAILED",
      "Unable to prepare the upload. Please try again.",
    );
  }

  return NextResponse.json({
    data: {
      storageKey,
      uploadUrl,
      contentType,
      fileName,
      expiresIn: UPLOAD_URL_TTL_SECONDS,
    },
  });
}

/**
 * The browser sends an entity reference, never a key. The page slug drives the
 * key layout for galleries and landing images, so it is read from the database
 * (or the slug allowlist) instead of being trusted from the request.
 */
async function resolveStorageKey(
  scope: UploadScope,
  body: Record<string, unknown>,
): Promise<string | Response> {
  switch (scope) {
    case "gallery-image": {
      const galleryId = jsonText(body, "galleryId");
      if (!galleryId) {
        return jsonError(400, "VALIDATION_ERROR", "A gallery is required.");
      }
      const gallery = await prisma.gallery.findUnique({
        where: { id: galleryId },
        select: { pageSlug: true },
      });
      if (!gallery) {
        return jsonError(404, "GALLERY_NOT_FOUND", "Gallery not found.");
      }
      return galleryImageKey(gallery.pageSlug, jsonText(body, "contentType"));
    }
    case "gallery-image-replace": {
      const imageId = jsonText(body, "imageId");
      if (!imageId) {
        return jsonError(400, "VALIDATION_ERROR", "An image is required.");
      }
      const image = await prisma.galleryImage.findUnique({
        where: { id: imageId },
        select: { gallery: { select: { pageSlug: true } } },
      });
      if (!image) {
        return jsonError(404, "IMAGE_NOT_FOUND", "Image not found.");
      }
      return galleryImageKey(
        image.gallery.pageSlug,
        jsonText(body, "contentType"),
      );
    }
    case "landing-image": {
      const pageSlug = jsonText(body, "pageSlug");
      if (!isGalleryPageSlug(pageSlug)) {
        return jsonError(404, "PAGE_NOT_FOUND", "Page not found.");
      }
      return landingImageKey(pageSlug);
    }
    case "partner-logo":
      return partnerLogoKey(jsonText(body, "contentType"));
    case "event-bento-home":
      return eventBentoHomeKey(jsonText(body, "contentType"));
    case "sponsor-video":
      return sponsorVideoKey(jsonText(body, "contentType"));
  }
}
