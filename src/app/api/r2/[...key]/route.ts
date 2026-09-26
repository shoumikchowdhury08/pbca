import { GetObjectCommand } from "@/lib/r2";
import { R2_BUCKET_NAME, r2Client } from "@/lib/r2";

function isAllowedKey(key: string) {
  return (
    key.startsWith("home/partners-logos/") ||
    key.startsWith("home/events-gallery/") ||
    /^sponsors\/videos\/[0-9a-f-]{36}\.(?:mp4|webm)$/.test(key) ||
    /^[a-z0-9-]+\/gallery\//.test(key) ||
    /^[a-z0-9-]+\/landing-image$/.test(key)
  );
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ key: string[] }> },
) {
  const { key: keyParts } = await params;
  const key = keyParts.join("/");

  if (!isAllowedKey(key)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const object = await r2Client.send(
      new GetObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        ...(request.headers.get("range")
          ? { Range: request.headers.get("range")! }
          : {}),
      }),
    );
    if (!object.Body) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(await object.Body.transformToWebStream(), {
      status: object.ContentRange ? 206 : 200,
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        "Accept-Ranges": "bytes",
        "Content-Length": String(object.ContentLength ?? ""),
        "Content-Type": object.ContentType ?? "application/octet-stream",
        ...(object.ContentRange
          ? { "Content-Range": object.ContentRange }
          : {}),
        ETag: object.ETag ?? "",
      },
    });
  } catch (error) {
    console.error(`Failed to retrieve R2 object: ${key}`, error);
    return new Response("Unable to retrieve media", { status: 502 });
  }
}
