import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { homeCountdownSchema } from "@/lib/validation";
import { validationError } from "@/lib/api";
import type { HomeCountdownDto } from "@/types/types";

export const dynamic = "force-dynamic";

function toCountdownDto(countdown: {
  id: string;
  targetAt: Date;
  updatedAt: Date;
}): HomeCountdownDto {
  return {
    id: countdown.id,
    targetAt: countdown.targetAt.toISOString(),
    updatedAt: countdown.updatedAt.toISOString(),
  };
}

export async function GET() {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const countdown = await prisma.homeCountdown.findUnique({
    where: { id: "home" },
  });

  return NextResponse.json({
    data: countdown ? toCountdownDto(countdown) : null,
  });
}

export async function PUT(request: Request) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const parsed = homeCountdownSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) return validationError(parsed.error);

  const countdown = await prisma.homeCountdown.upsert({
    where: { id: "home" },
    update: { targetAt: parsed.data.targetAt },
    create: { id: "home", targetAt: parsed.data.targetAt },
  });

  await prisma.auditLog.create({
    data: {
      action: "UPSERT",
      entity: "HomeCountdown",
      entityId: countdown.id,
      details: { targetAt: countdown.targetAt.toISOString() },
      userId: auth.user.id,
    },
  });

  return NextResponse.json({ data: toCountdownDto(countdown) });
}
