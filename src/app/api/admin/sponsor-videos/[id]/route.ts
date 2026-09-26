import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import {
  resolveSponsorVideoEmbed,
  toSponsorVideoDto,
} from "@/lib/sponsorVideo";
import { jsonError } from "@/lib/api";
import { deleteR2Object } from "@/lib/r2";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PatchBody = {
  title?: unknown;
  description?: unknown;
  embedUrl?: unknown;
  featured?: unknown;
  published?: unknown;
  sortOrder?: unknown;
};

function stringOrNull(value: unknown) {
  return typeof value === "string" ? value.trim() : null;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const { id } = await params;
  const video = await prisma.sponsorVideo.findUnique({ where: { id } });
  if (!video) {
    return jsonError(404, "SPONSOR_VIDEO_NOT_FOUND", "Video not found.");
  }

  const body = (await request.json().catch(() => null)) as PatchBody | null;
  if (!body || typeof body !== "object") {
    return jsonError(400, "VALIDATION_ERROR", "Nothing to update.");
  }

  const data: {
    title?: string;
    description?: string;
    embedUrl?: string;
    featured?: boolean;
    published?: boolean;
    sortOrder?: number;
  } = {};

  const title = stringOrNull(body.title);
  if (title !== null) {
    if (!title || title.length > 160) {
      return jsonError(
        400,
        "VALIDATION_ERROR",
        "Please give the video a title of 160 characters or fewer.",
      );
    }
    data.title = title;
  }

  const description = stringOrNull(body.description);
  if (description !== null) {
    if (description.length > 1000) {
      return jsonError(
        400,
        "VALIDATION_ERROR",
        "Video descriptions can be up to 1000 characters.",
      );
    }
    data.description = description;
  }

  const embedUrl = stringOrNull(body.embedUrl);
  if (embedUrl !== null) {
    if (!resolveSponsorVideoEmbed(embedUrl)) {
      return jsonError(
        400,
        "VALIDATION_ERROR",
        "That video link does not look right. Use a full http:// or https:// URL.",
      );
    }
    data.embedUrl = embedUrl;
  }

  if (typeof body.featured === "boolean") data.featured = body.featured;
  if (typeof body.published === "boolean") data.published = body.published;
  if (typeof body.sortOrder === "number" && Number.isInteger(body.sortOrder)) {
    data.sortOrder = Math.max(0, body.sortOrder);
  }

  if (!Object.keys(data).length) {
    return jsonError(400, "VALIDATION_ERROR", "Nothing to update.");
  }

  const updated = await prisma.sponsorVideo.update({ where: { id }, data });
  await prisma.auditLog.create({
    data: {
      action: "UPDATE",
      entity: "SponsorVideo",
      entityId: updated.id,
      details: data,
      userId: auth.user.id,
    },
  });

  return Response.json({ data: toSponsorVideoDto(updated) });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const { id } = await params;
  const video = await prisma.sponsorVideo.findUnique({ where: { id } });
  if (!video) {
    return jsonError(404, "SPONSOR_VIDEO_NOT_FOUND", "Video not found.");
  }

  try {
    await prisma.sponsorVideo.delete({ where: { id } });
    if (video.storageKey) await deleteR2Object(video.storageKey);
    await prisma.auditLog.create({
      data: {
        action: "DELETE",
        entity: "SponsorVideo",
        entityId: video.id,
        details: video.storageKey
          ? { storageKey: video.storageKey }
          : { embedUrl: video.embedUrl },
        userId: auth.user.id,
      },
    });

    return Response.json({ data: { success: true } });
  } catch (error) {
    console.error(`Failed to delete sponsor video: ${id}`, error);
    return jsonError(
      500,
      "SPONSOR_VIDEO_DELETE_FAILED",
      "Unable to remove the video.",
    );
  }
}
