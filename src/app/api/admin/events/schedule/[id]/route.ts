import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toEventScheduleItemDto } from "@/lib/events";
import { requireAdmin } from "@/lib/admin";
import { eventSchedulePatchSchema } from "@/lib/validation";
import { jsonError, validationError } from "@/lib/api";

export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteParams) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const { id } = await params;
  const item = await prisma.eventScheduleItem.findUnique({ where: { id } });
  if (!item) {
    return jsonError(404, "SCHEDULE_ITEM_NOT_FOUND", "Schedule item not found.");
  }

  const parsed = eventSchedulePatchSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) return validationError(parsed.error);
  if (!Object.keys(parsed.data).length) {
    return jsonError(400, "VALIDATION_ERROR", "Nothing to update.");
  }

  const updated = await prisma.eventScheduleItem.update({
    where: { id },
    data: parsed.data,
  });
  await prisma.auditLog.create({
    data: {
      action: "UPDATE",
      entity: "EventScheduleItem",
      entityId: updated.id,
      details: parsed.data,
      userId: auth.user.id,
    },
  });
  return NextResponse.json({ data: toEventScheduleItemDto(updated) });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const { id } = await params;
  const item = await prisma.eventScheduleItem.findUnique({ where: { id } });
  if (!item) {
    return jsonError(404, "SCHEDULE_ITEM_NOT_FOUND", "Schedule item not found.");
  }

  await prisma.eventScheduleItem.delete({ where: { id } });
  await prisma.auditLog.create({
    data: {
      action: "DELETE",
      entity: "EventScheduleItem",
      entityId: id,
      details: { track: item.track, dayLabel: item.dayLabel, title: item.title },
      userId: auth.user.id,
    },
  });
  return NextResponse.json({ data: { success: true } });
}