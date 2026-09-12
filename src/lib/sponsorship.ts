import type { Partner } from "@prisma/client";
import type { PartnerDto } from "@/types/types";

export function toPartnerDto(partner: Partner): PartnerDto {
  return {
    id: partner.id,
    name: partner.name,
    websiteUrl: partner.websiteUrl,
    image: {
      storageKey: partner.imageStorageKey,
      altText: partner.imageAltText,
      mimeType: partner.imageMimeType,
      width: partner.imageWidth,
      height: partner.imageHeight,
      fileSize: partner.imageFileSize,
    },
    sortOrder: partner.sortOrder,
    published: partner.published,
  };
}
