import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toEventsBentoHomeDto } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await prisma.eventsBentoHome.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
  });
  return NextResponse.json({ data: items.map(toEventsBentoHomeDto) });
}
