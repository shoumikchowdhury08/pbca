import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toPartnerDto } from "@/lib/sponsorship";

export const dynamic = "force-dynamic";

export async function GET() {
  const partners = await prisma.partner.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({ data: partners.map(toPartnerDto) });
}
