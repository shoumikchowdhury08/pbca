"use client";

import { useEffect, useState } from "react";
import InteractiveImageBentoGallery from "@/components/ui/InteractiveImageBentoGallery";
import type { GalleryDto } from "@/types/gallery";

function spanForLayout(layoutVariant: string) {
  switch (layoutVariant) {
    case "feature-tall":
      return "md:col-span-2 md:row-span-2";
    case "wide":
      return "md:col-span-2 md:row-span-1";
    case "portrait":
      return "md:col-span-1 md:row-span-2";
    default:
      return "md:col-span-1 md:row-span-1";
  }
}

export default function EventsGallery() {
  const [gallery, setGallery] = useState<GalleryDto | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/galleries/events", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load Events gallery.");
        const body: { data: GalleryDto } = await response.json();
        setGallery(body.data);
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error(error);
        }
      });

    return () => controller.abort();
  }, []);

  if (!gallery?.images.length) return null;

  return (
    <InteractiveImageBentoGallery
      imageItems={gallery.images.map((image) => ({
        id: image.id,
        title: image.title,
        desc: image.description || image.altText,
        url: image.url,
        span: spanForLayout(image.layoutVariant),
      }))}
      title={gallery.title}
      description={gallery.description}
    />
  );
}
