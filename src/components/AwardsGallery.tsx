"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Carousel, { type CarouselItem } from "@/components/ui/carousel";
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

  const carouselItems: CarouselItem[] = gallery.images.map((image) => ({
    id: image.id,
    url: image.url,
    title: image.altText || image.title,
    overlayTitle: image.title,
    description: image.description,
  }));

  return <Carousel items={carouselItems} />;
}
