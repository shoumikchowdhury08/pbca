import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { resolveSponsorVideoEmbed, toSponsorVideoDto } from "@/lib/sponsorVideo";
import { jsonError } from "@/lib/api";

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
  // Videos are embed-only: direct file uploads are not accepted.
  if (form.get("file") instanceof File) {
    return jsonError(
      400,
      "VIDEO_UPLOAD_DISABLED",
      "Direct video uploads are not supported. Paste a link from YouTube, Vimeo, or another streaming platform instead.",
    );
  }
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

  try {
    const video = await prisma.sponsorVideo.create({
      data: {
        title,
        description,
        embedUrl,
        featured: textValue(form, "featured") === "true",
        sortOrder: Number(textValue(form, "sortOrder")) || 0,
        published: textValue(form, "published") !== "false",
      },
    });
    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entity: "SponsorVideo",
        entityId: video.id,
        details: { embedUrl },
        userId: auth.user.id,
      },
    });
    return NextResponse.json({ data: toSponsorVideoDto(video) }, { status: 201 });
  } catch (error) {
    console.error("Failed to save sponsor video link", error);
    return jsonError(
      500,
      "SPONSOR_VIDEO_SAVE_FAILED",
      "Unable to save the video link.",
    );
  }
}