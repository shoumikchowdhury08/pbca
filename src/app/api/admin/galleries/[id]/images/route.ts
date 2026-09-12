import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toGalleryImageDto } from "@/lib/gallery";
import { requireAdmin } from "@/lib/admin";
import { imageInputSchema } from "@/lib/validation";
import { jsonError, validationError } from "@/lib/api";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;
  const { id } = await params;
  const parsed = imageInputSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) return validationError(parsed.error);
  const gallery = await prisma.gallery.findUnique({ where: { id } });
  if (!gallery)
    return jsonError(404, "GALLERY_NOT_FOUND", "Gallery not found.");

  const image = await prisma.galleryImage.create({
    data: { ...parsed.data, galleryId: id },
  });
  await prisma.auditLog.create({
    data: {
      action: "CREATE",
      entity: "GalleryImage",
      entityId: image.id,
      galleryId: id,
      imageId: image.id,
      userId: auth.user.id,
    },
  });
  return NextResponse.json({ data: toGalleryImageDto(image) }, { status: 201 });
}
