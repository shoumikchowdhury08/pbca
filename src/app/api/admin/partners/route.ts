import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { toPartnerDto } from "@/lib/sponsorship";
import { jsonError, jsonText, readJsonBody } from "@/lib/api";
import { deleteR2Object } from "@/lib/r2";
import { verifyUploadedObject } from "@/lib/upload-verify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

  const body = await readJsonBody(request);
  if (!body) {
    return jsonError(400, "VALIDATION_ERROR", "Invalid request body.");
  }

  const name = jsonText(body, "name");
  const websiteUrl = jsonText(body, "websiteUrl");
  const altText = jsonText(body, "altText");
  const fileName = jsonText(body, "fileName").slice(0, 255);

  if (!name || name.length > 160 || !altText || altText.length > 250) {
    return jsonError(
      400,
      "VALIDATION_ERROR",
      "Name and alt text are required.",
    );
  }
  if (websiteUrl && !/^https?:\/\//i.test(websiteUrl)) {
    return jsonError(
      400,
      "VALIDATION_ERROR",
      "Website URL must start with http:// or https://.",
    );
  }

  // The logo was uploaded straight to R2 by the browser, so the object's own
  // headers are what get stored -- not what the client claimed at presign time.
  const verified = await verifyUploadedObject(
    jsonText(body, "storageKey"),
    "partner-logo",
  );
  if (verified.response) return verified.response;
  const { upload } = verified;

  const id = randomUUID();

  try {
    const partner = await prisma.partner.create({
      data: {
        id,
        name,
        websiteUrl: websiteUrl || null,
        imageStorageKey: upload.storageKey,
        imageAltText: altText,
        imageMimeType: upload.contentType,
        imageFileSize: upload.fileSize,
        sortOrder: 0,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entity: "Partner",
        entityId: partner.id,
        details: { storageKey: upload.storageKey, fileName },
        userId: auth.user.id,
      },
    });

    return NextResponse.json({ data: toPartnerDto(partner) }, { status: 201 });
  } catch (error) {
    console.error("Failed to save partner metadata", error);
    await deleteR2Object(upload.storageKey);
    return jsonError(
      500,
      "PARTNER_SAVE_FAILED",
      "Unable to save partner metadata.",
    );
  }
}
