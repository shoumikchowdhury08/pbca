import { DeleteObjectCommand, R2_BUCKET_NAME, r2Client } from "@/lib/r2";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { toLandingImageDto } from "@/lib/home";
import { isGalleryPageSlug } from "@/lib/landing";
import { jsonError, jsonText, readJsonBody } from "@/lib/api";
import { verifyUploadedObject } from "@/lib/upload-verify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pageSlug: string }> },
) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;
  const { pageSlug } = await params;
  if (!isGalleryPageSlug(pageSlug)) return jsonError(404, "PAGE_NOT_FOUND", "Page not found.");

  const image = await prisma.landingImage.findUnique({ where: { pageSlug } });
  return Response.json({ data: image ? toLandingImageDto(image) : null });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ pageSlug: string }> },
) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;
  const { pageSlug } = await params;
  if (!isGalleryPageSlug(pageSlug)) return jsonError(404, "PAGE_NOT_FOUND", "Page not found.");

  const body = await readJsonBody(request);
  if (!body) return jsonError(400, "VALIDATION_ERROR", "Invalid request body.");

  const altText = jsonText(body, "altText") || `PBCA ${pageSlug} landing image`;

  // Landing images intentionally keep one fixed key per page, so by the time
  // this runs the browser has already replaced the object the site serves.
  // An invalid upload is reported without deleting it -- deleting would blank
  // the live landing image -- and the next valid upload fixes it.
  const verified = await verifyUploadedObject(
    jsonText(body, "storageKey"),
    "landing-image",
    pageSlug,
    { deleteWhenInvalid: false },
  );
  if (verified.response) return verified.response;
  const { upload } = verified;

  const image = await prisma.landingImage.upsert({
    where: { pageSlug },
    update: {
      storageKey: upload.storageKey,
      altText,
      mimeType: upload.contentType,
      fileSize: upload.fileSize,
    },
    create: {
      pageSlug,
      storageKey: upload.storageKey,
      altText,
      mimeType: upload.contentType,
      fileSize: upload.fileSize,
    },
  });
  await prisma.auditLog.create({
    data: {
      action: "UPSERT",
      entity: "LandingImage",
      entityId: image.id,
      details: {
        pageSlug,
        storageKey: upload.storageKey,
        fileName: jsonText(body, "fileName").slice(0, 255),
      },
      userId: auth.user.id,
    },
  });
  return Response.json({ data: toLandingImageDto(image) });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ pageSlug: string }> },
) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;
  const { pageSlug } = await params;
  if (!isGalleryPageSlug(pageSlug)) return jsonError(404, "PAGE_NOT_FOUND", "Page not found.");

  const image = await prisma.landingImage.findUnique({ where: { pageSlug } });
  if (!image) return Response.json({ data: { success: true } });
  await r2Client.send(new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME, Key: image.storageKey }));
  await prisma.landingImage.delete({ where: { pageSlug } });
  await prisma.auditLog.create({
    data: { action: "DELETE", entity: "LandingImage", entityId: image.id, details: { pageSlug, storageKey: image.storageKey }, userId: auth.user.id },
  });
  return Response.json({ data: { success: true } });
}