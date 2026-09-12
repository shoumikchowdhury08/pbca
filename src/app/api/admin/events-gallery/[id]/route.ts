import { DeleteObjectCommand } from "@/lib/r2";
import { R2_BUCKET_NAME, r2Client } from "@/lib/r2";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { jsonError } from "@/lib/api";

export const runtime = "nodejs";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;
  const { id } = await params;
  const item = await prisma.eventsGallery.findUnique({ where: { id } });
  if (!item) return jsonError(404, "EVENT_NOT_FOUND", "Event image not found.");

  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: item.imageStorageKey,
    }),
  );
  await prisma.eventsGallery.delete({ where: { id } });
  await prisma.auditLog.create({
    data: {
      action: "DELETE",
      entity: "EventsGallery",
      entityId: id,
      details: { storageKey: item.imageStorageKey },
      userId: auth.user.id,
    },
  });
  return Response.json({ data: { success: true } });
}
