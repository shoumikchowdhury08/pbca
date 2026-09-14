"use client";

import { useEffect, useState } from "react";
import { LayoutGrid } from "@/components/ui/layout-grid";
import type { GalleryDto } from "@/types/gallery";

export default function AboutUsGallery() {
  const [gallery, setGallery] = useState<GalleryDto | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/galleries/about-us", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load About Us gallery.");
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

  const cards = gallery.images.map((image, index) => ({
    id: index + 1,
    content: (
      <div>
        <p className="font-bold text-xl text-white md:text-4xl">
          {image.title}
        </p>
        <p className="my-4 max-w-lg text-base text-neutral-200">
          {image.description || image.altText}
        </p>
      </div>
    ),
    className:
      image.layoutVariant === "wide"
        ? "md:col-span-2 md:row-span-1"
        : "md:col-span-1 md:row-span-1",
    thumbnail: image.url,
  }));

  return (
    <div className="h-screen w-full py-20">
      <LayoutGrid cards={cards} />
    </div>
  );
}