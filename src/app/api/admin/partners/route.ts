import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { PutObjectCommand } from "@/lib/r2";
import { R2_BUCKET_NAME, r2Client } from "@/lib/r2";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { toPartnerDto } from "@/lib/sponsorship";
import { jsonError } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function fileExtension(type: string) {
  return type === "image/jpeg" ? "jpg" : type.slice("image/".length);
}

function textValue(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export async function GET() {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const partners = await prisma.partner.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ data: partners.map(toPartnerDto) });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const form = await request.formData();
  const name = textValue(form, "name");
  const websiteUrl = textValue(form, "websiteUrl");
  const altText = textValue(form, "altText");
  const file = form.get("file");

  if (!name || name.length > 160 || !altText || altText.length > 250) {
    return jsonError(
      400,
      "VALIDATION_ERROR",
      "Name and alt text are required.",
    );
  }
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
  if (websiteUrl && !/^https?:\/\//i.test(websiteUrl)) {
    return jsonError(
      400,
      "VALIDATION_ERROR",
      "Website URL must start with http:// or https://.",
    );
  }

  const id = randomUUID();
  const storageKey = `home/partners-logos/${id}.${fileExtension(file.type)}`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: storageKey,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
      Metadata: { partnerId: id, partnerName: name },
    }),
  );

  try {
    const partner = await prisma.partner.create({
      data: {
        id,
        name,
        websiteUrl: websiteUrl || null,
        imageStorageKey: storageKey,
        imageAltText: altText,
        imageMimeType: file.type,
        imageFileSize: file.size,
        sortOrder: 0,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entity: "Partner",
        entityId: partner.id,
        details: { storageKey, fileName: file.name },
        userId: auth.user.id,
      },
    });

    return NextResponse.json({ data: toPartnerDto(partner) }, { status: 201 });
  } catch (error) {
    console.error("Failed to save partner metadata", error);
    return jsonError(
      500,
      "PARTNER_SAVE_FAILED",
      "Unable to save partner metadata.",
    );
  }
}
