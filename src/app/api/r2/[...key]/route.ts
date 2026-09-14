import { GetObjectCommand } from "@/lib/r2";
import { R2_BUCKET_NAME, r2Client } from "@/lib/r2";

const ALLOWED_KEYS = new Set(["_DSC6888.JPG", "_DSC7067.JPG"]);

function isAllowedKey(key: string) {
  return (
    ALLOWED_KEYS.has(key) ||
    key.startsWith("home/partners-logos/") ||
    key.startsWith("home/events-gallery/") ||
    /^[a-z0-9-]+\/gallery\//.test(key) ||
    /^[a-z0-9-]+\/landing-image$/.test(key)
  );
}

export async function GET(
  _request: Request,
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
      }),
    );
    if (!object.Body) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(await object.Body.transformToWebStream(), {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        "Content-Length": String(object.ContentLength ?? ""),
        "Content-Type": object.ContentType ?? "image/jpeg",
        ETag: object.ETag ?? "",
      },
    });
  } catch (error) {
    console.error(`Failed to retrieve R2 object: ${key}`, error);
    return new Response("Unable to retrieve image", { status: 502 });
  }
}
