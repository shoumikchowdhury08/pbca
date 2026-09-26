import { jsonError } from "@/lib/api";
import {
  HeadObjectCommand,
  R2_BUCKET_NAME,
  deleteR2Object,
  r2Client,
} from "@/lib/r2";
import {
  ALLOWED_SPONSOR_VIDEO_TYPES,
  ALLOWED_IMAGE_TYPES,
  INVALID_SPONSOR_VIDEO_MESSAGE,
  INVALID_IMAGE_MESSAGE,
  MAX_IMAGE_FILE_SIZE,
  MAX_SPONSOR_VIDEO_FILE_SIZE,
  type UploadScope,
} from "@/lib/uploads";
import { keyMatchesScope } from "@/lib/upload-keys";

export type VerifiedUpload = {
  storageKey: string;
  contentType: string;
  fileSize: number;
};

const MISSING_OBJECT_MESSAGE =
  "The uploaded image could not be found. Please try uploading it again.";

export async function verifyUploadedObject(
  storageKey: string,
  scope: UploadScope,
  pageSlug?: string,
  { deleteWhenInvalid = true }: { deleteWhenInvalid?: boolean } = {},
) {
  if (!keyMatchesScope(scope, storageKey, pageSlug)) {
    return {
      response: jsonError(400, "INVALID_IMAGE", INVALID_IMAGE_MESSAGE),
    } as const;
  }

  let head;
  try {
    head = await r2Client.send(
      new HeadObjectCommand({ Bucket: R2_BUCKET_NAME, Key: storageKey }),
    );
  } catch {
    return {
      response: jsonError(400, "INVALID_IMAGE", MISSING_OBJECT_MESSAGE),
    } as const;
  }

  const contentType = head.ContentType ?? "";
  const fileSize = head.ContentLength ?? 0;
  const isHomeLandingVideo =
    scope === "landing-image" &&
    pageSlug === "home" &&
    ALLOWED_SPONSOR_VIDEO_TYPES.has(contentType);
  const allowedTypes = isHomeLandingVideo
    ? ALLOWED_SPONSOR_VIDEO_TYPES
    : ALLOWED_IMAGE_TYPES;
  const maxFileSize = isHomeLandingVideo
    ? MAX_SPONSOR_VIDEO_FILE_SIZE
    : MAX_IMAGE_FILE_SIZE;
  const invalidMessage = isHomeLandingVideo
    ? INVALID_SPONSOR_VIDEO_MESSAGE
    : INVALID_IMAGE_MESSAGE;
  const errorCode = isHomeLandingVideo ? "INVALID_VIDEO" : "INVALID_IMAGE";

  if (!allowedTypes.has(contentType) || fileSize <= 0) {
    if (deleteWhenInvalid) await deleteR2Object(storageKey);
    return {
      response: jsonError(400, errorCode, invalidMessage),
    } as const;
  }

  // R2 cannot cap the size of a presigned PUT (presigned POST policies are not
  // supported), so an oversized object is caught here and removed. The declared
  // size at presign time is only a hint -- the object's own headers decide.
  if (fileSize > maxFileSize) {
    if (deleteWhenInvalid) await deleteR2Object(storageKey);
    return {
      response: jsonError(400, errorCode, invalidMessage),
    } as const;
  }

  return {
    upload: { storageKey, contentType, fileSize } as VerifiedUpload,
  } as const;
}

export async function verifyUploadedSponsorVideo(storageKey: string) {
  if (!keyMatchesScope("sponsor-video", storageKey)) {
    return {
      response: jsonError(400, "INVALID_VIDEO", INVALID_SPONSOR_VIDEO_MESSAGE),
    } as const;
  }

  let head;
  try {
    head = await r2Client.send(
      new HeadObjectCommand({ Bucket: R2_BUCKET_NAME, Key: storageKey }),
    );
  } catch {
    return {
      response: jsonError(
        400,
        "INVALID_VIDEO",
        "The uploaded video could not be found. Please try uploading it again.",
      ),
    } as const;
  }

  const contentType = head.ContentType ?? "";
  const fileSize = head.ContentLength ?? 0;
  if (
    !ALLOWED_SPONSOR_VIDEO_TYPES.has(contentType) ||
    fileSize <= 0 ||
    fileSize > MAX_SPONSOR_VIDEO_FILE_SIZE
  ) {
    await deleteR2Object(storageKey);
    return {
      response: jsonError(400, "INVALID_VIDEO", INVALID_SPONSOR_VIDEO_MESSAGE),
    } as const;
  }

  return {
    upload: { storageKey, contentType, fileSize } as VerifiedUpload,
  } as const;
}
