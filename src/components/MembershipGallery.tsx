"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AccordionGallery from "@/components/ui/AccordionGallery";
import { readApiData } from "@/lib/http";
import type { GalleryDto } from "@/types/types";

export default function MembershipGallery() {
  const [gallery, setGallery] = useState<GalleryDto | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    readApiData<GalleryDto>(
      axios.get("/api/galleries/membership", { signal: controller.signal }),
      "Unable to load Membership gallery.",
    )
      .then(setGallery)
      .catch((error: unknown) => {
        if (!axios.isCancel(error)) console.error(error);
      });

    return () => controller.abort();
  }, []);

  if (!gallery?.images.length) return null;

  return (
    <AccordionGallery
      items={gallery.images.map((image) => ({
        image: image.url,
        label: image.title || image.description || image.altText,
        alt: image.altText,
      }))}
      defaultIndex={0}
      expandRatio={0.52}
      trigger="hover"
      accentColor="#ffffff"
      overlayColor="#060010"
      textColor="#ffffff"
      grayscale
      showLabels
      duration={0.6}
      ease="power3.out"
      parallax={0.5}
      tilt={8}
      stagger={0.06}
      height={460}
      gap={10}
      radius={16}
      orientation="horizontal"
    />
  );
}
