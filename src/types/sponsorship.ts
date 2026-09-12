export interface PartnerImageDto {
  storageKey: string;
  altText: string;
  mimeType: string | null;
  width: number | null;
  height: number | null;
  fileSize: number | null;
}

export interface PartnerDto {
  id: string;
  name: string;
  websiteUrl: string | null;
  image: PartnerImageDto;
  sortOrder: number;
  published: boolean;
}
