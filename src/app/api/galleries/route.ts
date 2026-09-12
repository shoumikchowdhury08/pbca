import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toGalleryDto } from "@/lib/gallery";

export const dynamic = "force-dynamic";

export async function GET() {
  const galleries = await prisma.gallery.findMany({
    where: { published: true },
    include: {
      images: {
        where: { published: true },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { pageSlug: "asc" },
  });

  return NextResponse.json({ data: galleries.map(toGalleryDto) });
}
