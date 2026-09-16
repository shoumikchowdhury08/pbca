import { DeleteObjectCommand, PutObjectCommand } from "@/lib/r2";
import { R2_BUCKET_NAME, r2Client } from "@/lib/r2";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { toLandingImageDto } from "@/lib/home";
import { isGalleryPageSlug, landingStorageKey } from "@/lib/landing";
import { jsonError } from "@/lib/api";
import {
  ALLOWED_IMAGE_TYPES,
  INVALID_IMAGE_MESSAGE,
  MAX_IMAGE_FILE_SIZE,
} from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function textValue(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

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

  const form = await request.formData();
  const file = form.get("file");
  const altText = textValue(form, "altText") || `PBCA ${pageSlug} landing image`;
  if (!(file instanceof File) || file.size === 0) return jsonError(400, "VALIDATION_ERROR", "Please select an image file.");
  if (!ALLOWED_IMAGE_TYPES.has(file.type) || file.size > MAX_IMAGE_FILE_SIZE) return jsonError(400, "INVALID_IMAGE", INVALID_IMAGE_MESSAGE);

  const storageKey = landingStorageKey(pageSlug);
  await r2Client.send(new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: storageKey,
    Body: Buffer.from(await file.arrayBuffer()),
    ContentType: file.type,
    Metadata: { purpose: `${pageSlug}-landing-image` },
  }));

  const image = await prisma.landingImage.upsert({
    where: { pageSlug },
    update: { storageKey, altText, mimeType: file.type, fileSize: file.size },
    create: { pageSlug, storageKey, altText, mimeType: file.type, fileSize: file.size },
  });
  await prisma.auditLog.create({
    data: { action: "UPSERT", entity: "LandingImage", entityId: image.id, details: { pageSlug, storageKey, fileName: file.name }, userId: auth.user.id },
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