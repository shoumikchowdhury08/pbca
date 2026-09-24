import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toGalleryDto } from "@/lib/gallery";
import { requireAdmin } from "@/lib/admin";
import { jsonError, jsonText, readJsonBody } from "@/lib/api";

export const runtime = "nodejs";

/**
 * Creates a new Gallery page section.
 *
 * The slug is generated here (never supplied by the browser) and deliberately
 * does not collide with a page slug, which is what marks the row as a section.
 */
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const body = await readJsonBody(request);
  if (!body) return jsonError(400, "VALIDATION_ERROR", "Invalid request body.");

  const title = jsonText(body, "title").slice(0, 160);
  if (!title) {
    return jsonError(400, "VALIDATION_ERROR", "A section title is required.");
  }

  const pageSlug = `gallery-sec-${randomUUID().slice(0, 8)}`;
  const gallery = await prisma.gallery.create({
    data: {
      pageSlug,
      title,
      description: jsonText(body, "description").slice(0, 1000),
    },
    include: { images: true },
  });

  await prisma.auditLog.create({
    data: {
      action: "CREATE",
      entity: "Gallery",
      entityId: gallery.id,
      galleryId: gallery.id,
      userId: auth.user.id,
      details: { pageSlug, title },
    },
  });

  return NextResponse.json({ data: toGalleryDto(gallery) }, { status: 201 });
}