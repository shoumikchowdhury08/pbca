import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toGalleryImageDto } from "@/lib/gallery";
import { requireAdmin } from "@/lib/admin";
import { imagePatchSchema } from "@/lib/validation";
import { jsonError, validationError } from "@/lib/api";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;
  const { id } = await params;
  const parsed = imagePatchSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) return validationError(parsed.error);
  const existing = await prisma.galleryImage.findUnique({ where: { id } });
  if (!existing) return jsonError(404, "IMAGE_NOT_FOUND", "Image not found.");

  const image = await prisma.galleryImage.update({
    where: { id },
    data: parsed.data,
  });
  await prisma.auditLog.create({
    data: {
      action: "UPDATE",
      entity: "GalleryImage",
      entityId: id,
      galleryId: image.galleryId,
      imageId: id,
      userId: auth.user.id,
      details: parsed.data,
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
