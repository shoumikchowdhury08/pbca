"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { readApiData } from "@/lib/http";
import type { GalleryDto } from "@/types/types";

export default function AwardsGallery() {
  const [gallery, setGallery] = useState<GalleryDto | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    readApiData<GalleryDto>(
      axios.get("/api/galleries/awards-and-recognition", {
        signal: controller.signal,
      }),
      "Unable to load Awards gallery.",
    )
      .then(setGallery)
      .catch((error: unknown) => {
        if (!axios.isCancel(error)) console.error(error);
      });

    return () => controller.abort();
  }, []);

  if (!gallery?.images.length) return null;

  const cards = gallery.images.map((image) => ({
    src: image.url,
    category: image.title,
    title: image.description,
    content: (
      <p className="text-neutral-600 dark:text-neutral-300">
        {image.description || image.altText}
      </p>
    ),
  }));

  return (
    <Carousel
      items={cards.map((card, index) => (
        <Card key={card.src} card={card} index={index} />
      ))}
    />
  );
}
