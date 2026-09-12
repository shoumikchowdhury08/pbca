import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { reorderSchema } from "@/lib/validation";
import { jsonError, validationError } from "@/lib/api";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;
  const { id } = await params;
  const parsed = reorderSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) return validationError(parsed.error);

  const images = await prisma.galleryImage.findMany({
    where: { galleryId: id, id: { in: parsed.data.imageIds } },
    select: { id: true },
  });
  if (images.length !== parsed.data.imageIds.length)
    return jsonError(
      400,
      "INVALID_ORDER",
      "Every image must belong to this gallery.",
    );

  await prisma.$transaction(
    parsed.data.imageIds.map((imageId, sortOrder) =>
      prisma.galleryImage.update({
        where: { id: imageId },
        data: { sortOrder },
      }),
    ),
  );
  await prisma.auditLog.create({
    data: {
      action: "REORDER",
      entity: "Gallery",
      entityId: id,
      galleryId: id,
      userId: auth.user.id,
      details: { imageIds: parsed.data.imageIds },
    },
  });
  return NextResponse.json({ data: { success: true } });
}
