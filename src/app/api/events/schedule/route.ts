import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toEventScheduleItemDto } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await prisma.eventScheduleItem.findMany({
    where: { published: true },
    orderBy: [{ track: "asc" }, { dayLabel: "asc" }, { sortOrder: "asc" }],
  });
  return NextResponse.json({ data: items.map(toEventScheduleItemDto) });
}
