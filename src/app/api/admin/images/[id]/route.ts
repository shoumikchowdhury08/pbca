import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { DeleteObjectCommand, PutObjectCommand } from "@/lib/r2";
import { R2_BUCKET_NAME, r2Client } from "@/lib/r2";
import { prisma } from "@/lib/prisma";
import { toGalleryImageDto } from "@/lib/gallery";
import { requireAdmin } from "@/lib/admin";
import { jsonError } from "@/lib/api";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function textValue(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function fileExtension(type: string) {
  return type === "image/jpeg" ? "jpg" : type.slice("image/".length);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;
  const { id } = await params;
  const existing = await prisma.galleryImage.findUnique({ where: { id } });
  if (!existing) return jsonError(404, "IMAGE_NOT_FOUND", "Image not found.");
  const gallery = await prisma.gallery.findUnique({ where: { id: existing.galleryId } });
  if (!gallery) return jsonError(404, "GALLERY_NOT_FOUND", "Gallery not found.");

  const form = await request.formData();
  const file = form.get("file");
  const title = textValue(form, "title");
  const altText = textValue(form, "altText");
  if (!(file instanceof File) || file.size === 0)
    return jsonError(400, "VALIDATION_ERROR", "Please select an image file.");
  if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_FILE_SIZE)
    return jsonError(400, "INVALID_IMAGE", "Use a JPEG, PNG, or WebP image up to 10 MB.");
  if (!title || !altText)
    return jsonError(400, "VALIDATION_ERROR", "Title and accessibility text are required.");

  const storageKey = `${gallery.pageSlug}/gallery/${randomUUID()}.${fileExtension(file.type)}`;
  await r2Client.send(new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: storageKey,
    Body: Buffer.from(await file.arrayBuffer()),
    ContentType: file.type,
    Metadata: { galleryId: gallery.id, fileName: file.name },
  }));

  const image = await prisma.galleryImage.update({
    where: { id },
    data: {
      storageKey,
      title,
      description: textValue(form, "description"),
      altText,
      mimeType: file.type,
      fileSize: file.size,
      layoutVariant: textValue(form, "layoutVariant") || "standard",
    },
  });
  await r2Client.send(new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME, Key: existing.storageKey }));
  await prisma.auditLog.create({
    data: {
      action: "UPDATE",
      entity: "GalleryImage",
      entityId: id,
      galleryId: image.galleryId,
      imageId: id,
      userId: auth.user.id,
      details: { storageKey, fileName: file.name },
    },
  });
  return NextResponse.json({ data: toGalleryImageDto(image) });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;
  const { id } = await params;
  const existing = await prisma.galleryImage.findUnique({ where: { id } });
  if (!existing) return jsonError(404, "IMAGE_NOT_FOUND", "Image not found.");
  await r2Client.send(new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME, Key: existing.storageKey }));
  await prisma.galleryImage.delete({ where: { id } });
  await prisma.auditLog.create({
    data: {
      action: "DELETE",
      entity: "GalleryImage",
      entityId: id,
      galleryId: existing.galleryId,
      userId: auth.user.id,
      details: { storageKey: existing.storageKey },
    },
  });
  return NextResponse.json({ data: { success: true } });
}
