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
  const partner = await prisma.partner.findUnique({ where: { id } });
  if (!partner) {
    return jsonError(404, "PARTNER_NOT_FOUND", "Partner logo not found.");
  }

  try {
    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: partner.imageStorageKey,
      }),
    );

    await prisma.partner.delete({ where: { id } });
    await prisma.auditLog.create({
      data: {
        action: "DELETE",
        entity: "Partner",
        entityId: partner.id,
        details: { storageKey: partner.imageStorageKey },
        userId: auth.user.id,
      },
    });

    return Response.json({ data: { success: true } });
  } catch (error) {
    console.error(`Failed to delete partner logo: ${id}`, error);
    return jsonError(
      500,
      "PARTNER_DELETE_FAILED",
      "Unable to remove the partner logo.",
    );
  }
}
