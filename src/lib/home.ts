import type { LandingImage } from "@prisma/client";
import type { LandingImageDto } from "@/types/home";

export function toLandingImageDto(image: LandingImage): LandingImageDto {
  const imagePath = `/api/r2/${image.storageKey
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;

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
