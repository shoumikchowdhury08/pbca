import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toGalleryDto } from "@/lib/gallery";
import { requireAdmin } from "@/lib/admin";
import { galleryInputSchema } from "@/lib/validation";
import { jsonError, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const galleries = await prisma.gallery.findMany({
    include: { images: { orderBy: { sortOrder: "asc" } } },
    orderBy: { pageSlug: "asc" },
  });
  return NextResponse.json({ data: galleries.map(toGalleryDto) });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const parsed = galleryInputSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) return validationError(parsed.error);

  const existing = await prisma.gallery.findUnique({
    where: { pageSlug: parsed.data.pageSlug },
  });
  if (existing)
    return jsonError(
      409,
      "GALLERY_EXISTS",
      "A gallery already exists for this page.",
    );

  const gallery = await prisma.gallery.create({
    data: parsed.data,
    include: { images: true },
  });
  await prisma.auditLog.create({
    data: {
      action: "CREATE",
      entity: "Gallery",
      entityId: gallery.id,
      galleryId: gallery.id,
      userId: auth.user.id,
    },
  });
  return NextResponse.json({ data: toGalleryDto(gallery) }, { status: 201 });
}
