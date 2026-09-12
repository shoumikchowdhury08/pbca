export interface EventsGalleryDto {
  id: string;
  title: string;
  detail: string;
  image: {
    storageKey: string;
    imageUrl: string;
    altText: string;
    mimeType: string | null;
    width: number | null;
    height: number | null;
    fileSize: number | null;
  };
  featured: boolean;
  sortOrder: number;
  published: boolean;
}
