import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { PutObjectCommand } from "@/lib/r2";
import { R2_BUCKET_NAME, r2Client } from "@/lib/r2";
import { prisma } from "@/lib/prisma";
import { toGalleryImageDto } from "@/lib/gallery";
import { requireAdmin } from "@/lib/admin";
import { jsonError } from "@/lib/api";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function textValue(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function fileExtension(type: string) {
  return type === "image/jpeg" ? "jpg" : type.slice("image/".length);
}

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

  const form = await request.formData();
  const file = form.get("file");
  const title = textValue(form, "title");
  const altText = textValue(form, "altText");
  if (!(file instanceof File) || file.size === 0)
    return jsonError(400, "VALIDATION_ERROR", "Please select an image file.");
  if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_FILE_SIZE)
    return jsonError(400, "INVALID_IMAGE", "Use a JPEG, PNG, or WebP image up to 10 MB.");
  if (!title || !altText)
    return jsonError(400, "VALIDATION_ERROR", "Title and accessibility text are required.");

  const storageKey = `${gallery.pageSlug}/gallery/${randomUUID()}.${fileExtension(file.type)}`;
  await r2Client.send(new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: storageKey,
    Body: Buffer.from(await file.arrayBuffer()),
    ContentType: file.type,
    Metadata: { galleryId: id, fileName: file.name },
  }));

  const image = await prisma.galleryImage.create({
    data: {
      galleryId: id,
      storageKey,
      title,
      description: textValue(form, "description"),
      altText,
      mimeType: file.type,
      fileSize: file.size,
      layoutVariant: textValue(form, "layoutVariant") || "standard",
      sortOrder: Number(textValue(form, "sortOrder")) || 0,
      published: textValue(form, "published") !== "false",
    },
  });
  await prisma.auditLog.create({
    data: {
      action: "CREATE",
      entity: "GalleryImage",
      entityId: image.id,
      galleryId: id,
      imageId: image.id,
      userId: auth.user.id,
    },
  });
  return NextResponse.json({ data: toGalleryImageDto(image) }, { status: 201 });
}
