"use client";

import { useEffect, useState } from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import type { GalleryDto } from "@/types/gallery";

export default function AwardsGallery() {
  const [gallery, setGallery] = useState<GalleryDto | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/galleries/awards-and-recognition", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load Awards gallery.");
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

  const cards = gallery.images.map((image) => ({
    src: image.url,
    category: "Awards & recognition",
    title: image.title,
    content: (
      <p className="text-neutral-600 dark:text-neutral-300">
        {image.description || image.altText}
      </p>
    ),
  }));

  return <Carousel items={cards.map((card, index) => <Card key={card.src} card={card} index={index} />)} />;
}
