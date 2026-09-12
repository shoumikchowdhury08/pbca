export interface LandingImageDto {
  id: string;
  pageSlug: string;
  storageKey: string;
  imageUrl: string;
  altText: string;
  mimeType: string | null;
  width: number | null;
  height: number | null;
  fileSize: number | null;
  updatedAt: string;
}
