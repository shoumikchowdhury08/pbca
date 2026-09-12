import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toGalleryDto } from "@/lib/gallery";
import { requireAdmin } from "@/lib/admin";
import { galleryPatchSchema } from "@/lib/validation";
import { jsonError, validationError } from "@/lib/api";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;
  const { id } = await params;
  const parsed = galleryPatchSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) return validationError(parsed.error);

  const existing = await prisma.gallery.findUnique({ where: { id } });
  if (!existing)
    return jsonError(404, "GALLERY_NOT_FOUND", "Gallery not found.");
  const gallery = await prisma.gallery.update({
    where: { id },
    data: parsed.data,
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  await prisma.auditLog.create({
    data: {
      action: "UPDATE",
      entity: "Gallery",
      entityId: id,
      galleryId: id,
      userId: auth.user.id,
      details: parsed.data,
    },
  });
  return NextResponse.json({ data: toGalleryDto(gallery) });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;
  const { id } = await params;
  const existing = await prisma.gallery.findUnique({ where: { id } });
  if (!existing)
    return jsonError(404, "GALLERY_NOT_FOUND", "Gallery not found.");
  await prisma.gallery.delete({ where: { id } });
  await prisma.auditLog.create({
    data: {
      action: "DELETE",
      entity: "Gallery",
      entityId: id,
      userId: auth.user.id,
      details: { pageSlug: existing.pageSlug },
    },
  });
  return NextResponse.json({ data: { success: true } });
}
