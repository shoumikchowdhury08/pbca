import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toGalleryDto } from "@/lib/gallery";
import { GALLERY_PAGE_SLUGS } from "@/types/types";

export const dynamic = "force-dynamic";

/**
 * The Gallery page sections, in the order they were created.
 *
 * Sections are gallery rows that do not belong to one of the fixed page slugs,
 * so this stays correct as sections are added or removed from the admin portal.
 */
export async function GET() {
  const sections = await prisma.gallery.findMany({
    where: {
      published: true,
      pageSlug: { notIn: [...GALLERY_PAGE_SLUGS] },
    },
    include: {
      images: {
        where: { published: true },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ data: sections.map(toGalleryDto) });
}