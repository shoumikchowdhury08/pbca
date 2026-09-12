export type NavigationProps = {
  nav: string[];
};

export type SiteNavItem = {
  label: string;
  href: string;
};

export type imgProps = {
  Heroimg?: string;
  Crowdimg?: string;
  Flowerimg?: string;
  Idolimg?: string;
};

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

export interface TestimonialDto {
  id: string;
  quote: string;
  name: string;
  sortOrder: number;
  published: boolean;
}

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

export interface EventsBentoHomeDto {
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
