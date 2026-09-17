import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { toEventsBentoHomeDto } from "@/lib/events";
import {
  jsonBoolean,
  jsonError,
  jsonNumber,
  jsonText,
  readJsonBody,
} from "@/lib/api";
import { deleteR2Object } from "@/lib/r2";
import { verifyUploadedObject } from "@/lib/upload-verify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  const body = await readJsonBody(request);
  if (!body) {
    return jsonError(400, "VALIDATION_ERROR", "Invalid request body.");
  }

  const title = jsonText(body, "title");
  const altText = jsonText(body, "altText") || title;
  if (!title || !altText) {
    return jsonError(
      400,
      "VALIDATION_ERROR",
      "Title and accessibility text are required.",
    );
  }

  const verified = await verifyUploadedObject(
    jsonText(body, "storageKey"),
    "event-bento-home",
  );
  if (verified.response) return verified.response;
  const { upload } = verified;

  const id = randomUUID();
  const fileName = jsonText(body, "fileName").slice(0, 255);

  let item;
  try {
    item = await prisma.eventsBentoHome.create({
      data: {
        id,
        title,
        detail: jsonText(body, "detail"),
        imageStorageKey: upload.storageKey,
        altText,
        imageMimeType: upload.contentType,
        imageFileSize: upload.fileSize,
        featured: jsonBoolean(body, "featured"),
        sortOrder: jsonNumber(body, "sortOrder"),
      },
    });
  } catch (error) {
    await deleteR2Object(upload.storageKey);
    throw error;
  }

  await prisma.auditLog.create({
    data: {
      action: "CREATE",
      entity: "EventsBentoHome",
      entityId: item.id,
      details: { storageKey: upload.storageKey, fileName },
      userId: auth.user.id,
    },
  });
  return NextResponse.json(
    { data: toEventsBentoHomeDto(item) },
    { status: 201 },
  );
}
