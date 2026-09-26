import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toGalleryImageDto } from "@/lib/gallery";
import { requireAdmin } from "@/lib/admin";
import {
  jsonBoolean,
  jsonError,
  jsonNumber,
  jsonText,
  readJsonBody,
} from "@/lib/api";
import { deleteR2Object } from "@/lib/r2";
import { verifyUploadedObject } from "@/lib/upload-verify";
import { isGallerySectionSlug } from "@/types/types";

export const runtime = "nodejs";

/**
 * Attaches an image the browser already uploaded straight to R2. The body now
 * carries the server-generated `storageKey` from `/api/admin/uploads/presign`
 * plus the text fields; the object's real R2 headers are verified before the
 * row is written.
 */

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;
  const { id } = await params;
  const gallery = await prisma.gallery.findUnique({ where: { id } });
  if (!gallery)
    return jsonError(404, "GALLERY_NOT_FOUND", "Gallery not found.");

  const body = await readJsonBody(request);
  if (!body) return jsonError(400, "VALIDATION_ERROR", "Invalid request body.");

  const title = jsonText(body, "title").slice(0, 160);
  const description = jsonText(body, "description");
  const altText = jsonText(body, "altText").slice(0, 250);
  // The Gallery page collections capture only an optional title, so those
  // galleries accept an empty title and an empty accessibility text.
  if (!isGallerySectionSlug(gallery.pageSlug) && (!title || !altText))
    return jsonError(
      400,
      "VALIDATION_ERROR",
      "Title and accessibility text are required.",
    );
  if (gallery.pageSlug === "membership" && !description.trim())
    return jsonError(
      400,
      "VALIDATION_ERROR",
      "Benefit card descriptions are required.",
    );

  const verified = await verifyUploadedObject(
    jsonText(body, "storageKey"),
    "gallery-image",
    gallery.pageSlug,
  );
  if (verified.response) return verified.response;
  const { upload } = verified;

  let image;
  try {
    image = await prisma.galleryImage.create({
      data: {
        galleryId: id,
        storageKey: upload.storageKey,
        title,
        description,
        altText,
        mimeType: upload.contentType,
        fileSize: upload.fileSize,
        layoutVariant:
          gallery.pageSlug === "about-us"
            ? "standard"
            : jsonText(body, "layoutVariant") || "standard",
        sortOrder: jsonNumber(body, "sortOrder"),
        published: jsonBoolean(body, "published", true),
      },
    });
  } catch (error) {
    // Never leave orphaned bytes behind when the row cannot be created.
    await deleteR2Object(upload.storageKey);
    throw error;
  }

  await prisma.auditLog.create({
    data: {
      action: "CREATE",
      entity: "GalleryImage",
      entityId: image.id,
      galleryId: id,
      imageId: image.id,
      details: { storageKey: upload.storageKey },
      userId: auth.user.id,
    },
  });
  return NextResponse.json({ data: toGalleryImageDto(image) }, { status: 201 });
}
