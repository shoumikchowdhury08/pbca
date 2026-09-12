import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toGalleryDto } from "@/lib/gallery";
import { jsonError } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pageSlug: string }> },
) {
  const { pageSlug } = await params;
  const gallery = await prisma.gallery.findFirst({
    where: { pageSlug, published: true },
    include: {
      images: {
        where: { published: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!gallery)
    return jsonError(404, "GALLERY_NOT_FOUND", "Gallery not found.");
  return NextResponse.json({ data: toGalleryDto(gallery) });
}
