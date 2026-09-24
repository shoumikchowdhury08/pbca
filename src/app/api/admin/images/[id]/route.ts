import { NextResponse } from "next/server";
import { DeleteObjectCommand, R2_BUCKET_NAME, deleteR2Object, r2Client } from "@/lib/r2";
import { prisma } from "@/lib/prisma";
import { toGalleryImageDto } from "@/lib/gallery";
import { requireAdmin } from "@/lib/admin";
import { jsonError, jsonText, readJsonBody } from "@/lib/api";
import { verifyUploadedObject } from "@/lib/upload-verify";
import { isGallerySectionSlug } from "@/types/types";

export const runtime = "nodejs";

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

  const body = await readJsonBody(request);
  if (!body)
    return jsonError(400, "VALIDATION_ERROR", "Invalid request body.");

  const title = jsonText(body, "title").slice(0, 160);
  const altText = jsonText(body, "altText").slice(0, 250);
  // The Gallery page collections capture only an optional title, so those
  // galleries accept an empty title and an empty accessibility text.
  if (!isGallerySectionSlug(gallery.pageSlug) && (!title || !altText))
    return jsonError(400, "VALIDATION_ERROR", "Title and accessibility text are required.");

  const storageKey = jsonText(body, "storageKey");
  const textFields = {
    title,
    description: jsonText(body, "description"),
    altText,
    layoutVariant: jsonText(body, "layoutVariant") || "standard",
  };

  // Editing the text of an image does not require a new upload: with no
  // storageKey the existing object is left exactly as it is.
  if (!storageKey) {
    const image = await prisma.galleryImage.update({
      where: { id },
      data: textFields,
    });
    await prisma.auditLog.create({
      data: {
        action: "UPDATE",
        entity: "GalleryImage",
        entityId: id,
        galleryId: image.galleryId,
        imageId: id,
        userId: auth.user.id,
        details: { storageKey: existing.storageKey },
      },
    });
    return NextResponse.json({ data: toGalleryImageDto(image) });
  }

  const verified = await verifyUploadedObject(
    storageKey,
    "gallery-image-replace",
    gallery.pageSlug,
  );
  if (verified.response) return verified.response;
  const { upload } = verified;

  let image;
  try {
    image = await prisma.galleryImage.update({
      where: { id },
      data: {
        storageKey: upload.storageKey,
        ...textFields,
        mimeType: upload.contentType,
        fileSize: upload.fileSize,
      },
    });
  } catch (error) {
    // The replacement never made it into the database, so drop its object.
    await deleteR2Object(upload.storageKey);
    throw error;
  }
  await deleteR2Object(existing.storageKey);
  await prisma.auditLog.create({
    data: {
      action: "UPDATE",
      entity: "GalleryImage",
      entityId: id,
      galleryId: image.galleryId,
      imageId: id,
      userId: auth.user.id,
      details: { storageKey: upload.storageKey },
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
