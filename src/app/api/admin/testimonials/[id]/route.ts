import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { jsonError } from "@/lib/api";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;
  const { id } = await params;

  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial)
    return jsonError(404, "TESTIMONIAL_NOT_FOUND", "Testimonial not found.");

  await prisma.testimonial.delete({ where: { id } });
  await prisma.auditLog.create({
    data: {
      action: "DELETE",
      entity: "Testimonial",
      entityId: id,
      details: { name: testimonial.name },
      userId: auth.user.id,
    },
  });

  return NextResponse.json({ data: { success: true } });
}
