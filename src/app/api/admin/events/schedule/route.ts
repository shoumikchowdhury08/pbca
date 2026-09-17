import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toEventScheduleItemDto } from "@/lib/events";
import { requireAdmin } from "@/lib/admin";
import { eventScheduleItemSchema } from "@/lib/validation";
import { validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const items = await prisma.eventScheduleItem.findMany({
    orderBy: [{ track: "asc" }, { dayLabel: "asc" }, { sortOrder: "asc" }],
  });
  return NextResponse.json({ data: items.map(toEventScheduleItemDto) });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const parsed = eventScheduleItemSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) return validationError(parsed.error);

  const item = await prisma.eventScheduleItem.create({ data: parsed.data });
  await prisma.auditLog.create({
    data: {
      action: "CREATE",
      entity: "EventScheduleItem",
      entityId: item.id,
      details: { track: item.track, dayLabel: item.dayLabel, title: item.title },
      userId: auth.user.id,
    },
  });
  return NextResponse.json(
    { data: toEventScheduleItemDto(item) },
    { status: 201 },
  );
}