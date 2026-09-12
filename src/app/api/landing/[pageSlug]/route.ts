import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toLandingImageDto } from "@/lib/home";
import { isGalleryPageSlug } from "@/lib/landing";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pageSlug: string }> },
) {
  const { pageSlug } = await params;
  if (!isGalleryPageSlug(pageSlug)) {
    return NextResponse.json({ data: null }, { status: 404 });
  }

  const image = await prisma.landingImage.findUnique({ where: { pageSlug } });
  return NextResponse.json({ data: image ? toLandingImageDto(image) : null });
}