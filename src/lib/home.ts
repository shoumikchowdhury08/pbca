import type { LandingImage } from "@prisma/client";
import { r2PublicUrl } from "@/lib/media-url";
import type { LandingImageDto } from "@/types/types";

export function toLandingImageDto(image: LandingImage): LandingImageDto {
  const imagePath = r2PublicUrl(image.storageKey);

  return {
    id: image.id,
    pageSlug: image.pageSlug,
    storageKey: image.storageKey,
    imageUrl: `${imagePath}?v=${encodeURIComponent(image.updatedAt.toISOString())}`,
    altText: image.altText,
    mimeType: image.mimeType,
    width: image.width,
    height: image.height,
    fileSize: image.fileSize,
    updatedAt: image.updatedAt.toISOString(),
  };
}
