"use client";

import { useEffect, useState } from "react";
import AccordionGallery from "@/components/ui/AccordionGallery";
import type { GalleryDto } from "@/types/gallery";

export default function MembershipGallery() {
  const [gallery, setGallery] = useState<GalleryDto | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/galleries/membership", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load Membership gallery.");
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
