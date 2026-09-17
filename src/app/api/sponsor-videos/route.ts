import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toSponsorVideoDto } from "@/lib/sponsorVideo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const videos = await prisma.sponsorVideo.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
  });
  return NextResponse.json({ data: videos.map(toSponsorVideoDto) });
}
