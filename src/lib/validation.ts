import { z } from "zod";
import { GALLERY_PAGE_SLUGS } from "@/types/gallery";

export const pageSlugSchema = z.enum(GALLERY_PAGE_SLUGS);

export const loginSchema = z.object({
  email: z.string().trim().email().max(320),
  password: z.string().min(1).max(200),
});

export const galleryInputSchema = z.object({
  pageSlug: pageSlugSchema,
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(1000).optional().default(""),
  published: z.boolean().optional().default(true),
});

export const galleryPatchSchema = galleryInputSchema
  .partial()
  .omit({ pageSlug: true });

export const imageInputSchema = z.object({
  storageKey: z.string().trim().min(1).max(500),
  url: z.string().trim().url().max(2000),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(1000).optional().default(""),
  altText: z.string().trim().min(1).max(250),
  credit: z.string().trim().max(250).nullable().optional(),
  mimeType: z.string().trim().max(100).nullable().optional(),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
  fileSize: z.number().int().nonnegative().nullable().optional(),
  layoutVariant: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .optional()
    .default("standard"),
  sortOrder: z.number().int().nonnegative().optional().default(0),
  published: z.boolean().optional().default(true),
});

export const imagePatchSchema = imageInputSchema.partial();

export const reorderSchema = z.object({
  imageIds: z.array(z.string().cuid()).min(1),
});
