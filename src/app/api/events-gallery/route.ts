import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toEventsGalleryDto } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await prisma.eventsGallery.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
  });
  return NextResponse.json({ data: items.map(toEventsGalleryDto) });
}
