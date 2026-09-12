import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toGalleryImageDto } from "@/lib/gallery";
import { jsonError } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pageSlug: string }> },
) {
  const { pageSlug } = await params;
  const gallery = await prisma.gallery.findFirst({
    where: { pageSlug, published: true },
    select: { id: true },
  });
  if (!gallery)
    return jsonError(404, "GALLERY_NOT_FOUND", "Gallery not found.");

  const images = await prisma.galleryImage.findMany({
    where: { galleryId: gallery.id, published: true },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ data: images.map(toGalleryImageDto) });
}
