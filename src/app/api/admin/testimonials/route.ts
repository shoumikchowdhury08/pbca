import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { jsonError } from "@/lib/api";
import type { TestimonialDto } from "@/types/types";

export const dynamic = "force-dynamic";

function textValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function numberValue(value: FormDataEntryValue | null) {
  const parsed = Number(textValue(value));
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : 0;
}

export async function GET() {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const testimonials = await prisma.testimonial.findMany({
    orderBy: { sortOrder: "asc" },
  });
  const data: TestimonialDto[] = testimonials;
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const form = await request.formData();
  const quote = textValue(form.get("quote"));
  const name = textValue(form.get("name"));
  const sortOrder = numberValue(form.get("sortOrder"));
  const published = form.get("published") !== "false";

  if (!quote || quote.length > 2000 || !name || name.length > 160) {
    return jsonError(
      400,
      "VALIDATION_ERROR",
      "Quote and name are required and must be within the allowed length.",
    );
  }

  const testimonial = await prisma.testimonial.create({
    data: { quote, name, sortOrder, published },
  });
  await prisma.auditLog.create({
    data: {
      action: "CREATE",
      entity: "Testimonial",
      entityId: testimonial.id,
      details: { name },
      userId: auth.user.id,
    },
  });

  return NextResponse.json(
    { data: testimonial as TestimonialDto },
    { status: 201 },
  );
}
