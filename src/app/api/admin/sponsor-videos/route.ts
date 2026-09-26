import { NextResponse } from "next/server";
import type { SponsorVideo } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import {
  resolveSponsorVideoEmbed,
  toSponsorVideoDto,
} from "@/lib/sponsorVideo";
import { jsonError } from "@/lib/api";
import { deleteR2Object } from "@/lib/r2";
import { verifyUploadedSponsorVideo } from "@/lib/upload-verify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function textValue(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export async function GET() {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const videos = await prisma.sponsorVideo.findMany({
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
  });
  return NextResponse.json({ data: videos.map(toSponsorVideoDto) });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const form = await request.formData();
  const title = textValue(form, "title");
  const description = textValue(form, "description");
  const embedUrl = textValue(form, "embedUrl");
  const source = textValue(form, "source") || "EMBED";

  if (!title || title.length > 160) {
    return jsonError(
      400,
      "VALIDATION_ERROR",
      "Please give the video a title of 160 characters or fewer.",
    );
  }
  if (description.length > 1000) {
    return jsonError(
      400,
      "VALIDATION_ERROR",
      "Video descriptions can be up to 1000 characters.",
    );
  }
  if (source !== "EMBED" && source !== "UPLOAD") {
    return jsonError(
      400,
      "VALIDATION_ERROR",
      "Choose an embed link or upload a video file.",
    );
  }
  if (form.get("file") instanceof File) {
    return jsonError(
      400,
      "VALIDATION_ERROR",
      "Upload the file directly before submitting the video details.",
    );
  }

  let uploaded: {
    storageKey: string;
    contentType: string;
    fileSize: number;
  } | null = null;
  if (source === "UPLOAD") {
    const verified = await verifyUploadedSponsorVideo(
      textValue(form, "storageKey"),
    );
    if (verified.response) return verified.response;
    uploaded = verified.upload;
  } else {
    if (!embedUrl) {
      return jsonError(
        400,
        "VALIDATION_ERROR",
        "Please paste a video link (YouTube, Vimeo, or any streaming platform).",
      );
    }
    if (!resolveSponsorVideoEmbed(embedUrl)) {
      return jsonError(
        400,
        "VALIDATION_ERROR",
        "That video link does not look right. Use a full http:// or https:// URL (YouTube, Vimeo, or a player embed link).",
      );
    }
  }

  let video: SponsorVideo;
  try {
    video = await prisma.sponsorVideo.create({
      data: {
        title,
        description,
        source,
        embedUrl: source === "EMBED" ? embedUrl : null,
        storageKey: uploaded?.storageKey ?? null,
        mimeType: uploaded?.contentType ?? null,
        fileSize: uploaded?.fileSize ?? null,
        featured: textValue(form, "featured") === "true",
        sortOrder: Number(textValue(form, "sortOrder")) || 0,
        published: textValue(form, "published") !== "false",
      },
    });
  } catch (error) {
    if (uploaded) await deleteR2Object(uploaded.storageKey);
    console.error("Failed to save sponsor video link", error);
    return jsonError(
      500,
      "SPONSOR_VIDEO_SAVE_FAILED",
      "Unable to save the sponsor video.",
    );
  }

  await prisma.auditLog.create({
    data: {
      action: "CREATE",
      entity: "SponsorVideo",
      entityId: video.id,
      details: uploaded ? { storageKey: uploaded.storageKey } : { embedUrl },
      userId: auth.user.id,
    },
  });
  return NextResponse.json({ data: toSponsorVideoDto(video) }, { status: 201 });
}
