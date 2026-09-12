import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { PutObjectCommand } from "@/lib/r2";
import { R2_BUCKET_NAME, r2Client } from "@/lib/r2";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { toEventsBentoHomeDto } from "@/lib/events";
import { jsonError } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function field(form: FormData, name: string, fallback = "") {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() || fallback : fallback;
}

export async function GET() {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;
  const items = await prisma.eventsBentoHome.findMany({
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
  });
  return NextResponse.json({ data: items.map(toEventsBentoHomeDto) });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return jsonError(400, "VALIDATION_ERROR", "Please select an image file.");
  }
  if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_FILE_SIZE) {
    return jsonError(
      400,
      "INVALID_IMAGE",
      "Use a JPEG, PNG, or WebP image up to 10 MB.",
    );
  }

  const title = field(form, "title");
  const altText = field(form, "altText", title);
  if (!title || !altText) {
    return jsonError(
      400,
      "VALIDATION_ERROR",
      "Title and accessibility text are required.",
    );
  }

  const id = randomUUID();
  const storageKey = `home/events-gallery/${id}.${file.type === "image/jpeg" ? "jpg" : file.type.slice(6)}`;
  await r2Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: storageKey,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
      Metadata: { purpose: "home-events-gallery", eventId: id },
    }),
  );

  const item = await prisma.eventsBentoHome.create({
    data: {
      id,
      title,
      detail: field(form, "detail"),
      imageStorageKey: storageKey,
      altText,
      imageMimeType: file.type,
      imageFileSize: file.size,
      featured: field(form, "featured") === "true",
      sortOrder: Number(field(form, "sortOrder", "0")) || 0,
    },
  });
  await prisma.auditLog.create({
    data: {
      action: "CREATE",
      entity: "EventsBentoHome",
      entityId: item.id,
      details: { storageKey, fileName: file.name },
      userId: auth.user.id,
    },
  });
  return NextResponse.json(
    { data: toEventsBentoHomeDto(item) },
    { status: 201 },
  );
}
