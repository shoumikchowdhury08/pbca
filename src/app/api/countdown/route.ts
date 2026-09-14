import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { HomeCountdownDto } from "@/types/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const countdown = await prisma.homeCountdown.findUnique({
    where: { id: "home" },
  });

  const data: HomeCountdownDto | null = countdown
    ? {
        id: countdown.id,
        targetAt: countdown.targetAt.toISOString(),
        updatedAt: countdown.updatedAt.toISOString(),
      }
    : null;

  return NextResponse.json({ data });
}
