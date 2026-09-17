import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const accountId = requiredEnv("CLOUDFLARE_ACCOUNT_ID");

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: requiredEnv("R2_ACCESS_KEY_ID"),
    secretAccessKey: requiredEnv("R2_SECRET_ACCESS_KEY"),
  },
});

export const R2_BUCKET_NAME = requiredEnv("R2_BUCKET_NAME");

/** Presigned PUT links are short lived; the browser uploads immediately. */
export const UPLOAD_URL_TTL_SECONDS = 10 * 60;

/**
 * Signs a single PUT for a server-generated key and a Content-Type.
 *
 * Note that R2 does not fail the upload when the browser sends a different
 * Content-Type than the signed one, and it has no equivalent of a presigned
 * POST policy (so no `content-length-range`). The signed header is still sent,
 * but the real gate is `verifyUploadedObject()` in `@/lib/upload-verify`, which
 * re-reads the stored object's Content-Type and Content-Length before anything
 * is written to the database.
 */
export async function createPresignedPutUrl(key: string, contentType: string) {
  return getSignedUrl(
    r2Client,
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: UPLOAD_URL_TTL_SECONDS },
  );
}

/**
 * Best-effort cleanup used when a metadata write fails, or when an object is
 * rejected after upload. Never throws, so it cannot mask the real error.
 */
export async function deleteR2Object(key: string) {
  try {
    await r2Client.send(
      new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }),
    );
  } catch (error) {
    console.error(`Failed to delete R2 object: ${key}`, error);
  }
}

export {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
};
