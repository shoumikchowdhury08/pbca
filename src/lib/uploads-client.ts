"use client";

import axios from "axios";
import { readApiData } from "@/lib/http";
import {
  ALLOWED_SPONSOR_VIDEO_TYPES,
  INVALID_IMAGE_MESSAGE,
  INVALID_SPONSOR_VIDEO_MESSAGE,
  MAX_IMAGE_FILE_SIZE,
  MAX_SPONSOR_VIDEO_FILE_SIZE,
  formatFileSize,
  type UploadScope,
} from "@/lib/uploads";

export type UploadTarget = {
  /** Gallery id for a new gallery image. */
  galleryId?: string;
  /** Image id when replacing an existing gallery image. */
  imageId?: string;
  /** Gallery page slug for landing images. */
  pageSlug?: string;
};

type PresignPayload = {
  storageKey: string;
  uploadUrl: string;
  contentType: string;
  expiresIn: number;
};

function isFile(value: FormDataEntryValue | null): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

/** Reads a text field out of a form so call sites can keep using `name`. */
export function formText(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function formBoolean(form: FormData, name: string) {
  return form.get(name) === "true";
}

export function formFile(form: FormData) {
  const value = form.get("file");
  return isFile(value) && value.size > 0 ? value : null;
}

function putFileToR2(
  uploadUrl: string,
  file: File,
  onProgress?: (percent: number) => void,
) {
  return new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest();
    // fetch() cannot report upload progress, and admins uploading tens of
    // megabytes need to see that something is happening.
    request.open("PUT", uploadUrl, true);
    // Sent to match the signed request. R2 does not reject a mismatch, so the
    // server re-checks the stored Content-Type and size after the upload.
    request.setRequestHeader("Content-Type", file.type);
    request.upload.onprogress = (event) => {
      if (onProgress && event.lengthComputable && event.total > 0) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        resolve();
        return;
      }
      reject(
        new Error(
          `File upload failed (HTTP ${request.status}). Please try again.`,
        ),
      );
    };
    request.onerror = () =>
      reject(
        new Error("File upload failed. Check your connection and try again."),
      );
    request.ontimeout = () =>
      reject(new Error("File upload timed out. Please try again."));
    request.send(file);
  });
}

/**
 * Sends an image straight to R2 and returns the storage key the matching admin
 * route expects. Posting the file to a Vercel function instead would hit the
 * platform's 4.5 MB request body limit, which is why large uploads used to fail
 * in production with a 413.
 */
export async function uploadImageDirect(
  file: File,
  scope: UploadScope,
  target: UploadTarget = {},
  onProgress?: (percent: number) => void,
): Promise<string> {
  return uploadDirectFile(
    file,
    scope,
    target,
    onProgress,
    MAX_IMAGE_FILE_SIZE,
    null,
    INVALID_IMAGE_MESSAGE,
  );
}

export async function uploadSponsorVideoDirect(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<string> {
  return uploadDirectFile(
    file,
    "sponsor-video",
    {},
    onProgress,
    MAX_SPONSOR_VIDEO_FILE_SIZE,
    ALLOWED_SPONSOR_VIDEO_TYPES,
    INVALID_SPONSOR_VIDEO_MESSAGE,
  );
}

export async function uploadHomeLandingVideoDirect(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<string> {
  return uploadDirectFile(
    file,
    "landing-image",
    { pageSlug: "home" },
    onProgress,
    MAX_SPONSOR_VIDEO_FILE_SIZE,
    ALLOWED_SPONSOR_VIDEO_TYPES,
    INVALID_SPONSOR_VIDEO_MESSAGE,
  );
}

async function uploadDirectFile(
  file: File,
  scope: UploadScope,
  target: UploadTarget,
  onProgress: ((percent: number) => void) | undefined,
  maxFileSize: number,
  allowedTypes: ReadonlySet<string> | null,
  invalidMessage: string,
): Promise<string> {
  if (file.size === 0) throw new Error("Please select a file.");
  if (file.size > maxFileSize) {
    throw new Error(
      `“${file.name}” is ${formatFileSize(file.size)}. ${invalidMessage}`,
    );
  }
  if (!file.type || (allowedTypes && !allowedTypes.has(file.type))) {
    throw new Error(invalidMessage);
  }

  const presigned = await readApiData<PresignPayload | undefined>(
    axios.post("/api/admin/uploads/presign", {
      scope,
      contentType: file.type,
      size: file.size,
      fileName: file.name,
      ...target,
    }),
  );
  if (!presigned?.uploadUrl || !presigned.storageKey) {
    throw new Error("Unable to prepare the upload. Please try again.");
  }

  await putFileToR2(presigned.uploadUrl, file, onProgress);
  return presigned.storageKey;
}
