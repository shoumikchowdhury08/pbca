import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { TestimonialDto } from "@/types/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const testimonials = await prisma.testimonial.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });

  const data: TestimonialDto[] = testimonials;
  return NextResponse.json({ data });
}
