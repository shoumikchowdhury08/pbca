import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { jsonError } from "@/lib/api";
import { deleteR2Object } from "@/lib/r2";
import { isGallerySectionSlug } from "@/types/types";

export const runtime = "nodejs";

/**
 * Removes a Gallery page section together with its images.
 *
 * The images live in R2, so their objects are deleted first -- dropping the row
 * would otherwise leave the bytes orphaned in the bucket.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const { id } = await params;
  const section = await prisma.gallery.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!section) {
    return jsonError(404, "SECTION_NOT_FOUND", "Section not found.");
  }
  // A page gallery (home, about-us, ...) must never be removed from here.
  if (!isGallerySectionSlug(section.pageSlug)) {
    return jsonError(
      400,
      "NOT_A_SECTION",
      "This gallery belongs to a page and cannot be removed.",
    );
  }

  for (const image of section.images) {
    await deleteR2Object(image.storageKey);
  }

  await prisma.gallery.delete({ where: { id } });
  await prisma.auditLog.create({
    data: {
      action: "DELETE",
      entity: "Gallery",
      entityId: id,
      userId: auth.user.id,
      details: {
        pageSlug: section.pageSlug,
        title: section.title,
        imageCount: section.images.length,
      },
    },
  });

  return NextResponse.json({ data: { success: true } });
}