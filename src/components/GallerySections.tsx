"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import GallerySection from "@/components/GallerySection";
import { readApiData } from "@/lib/http";
import type { GalleryDto } from "@/types/types";

/**
 * The Gallery page sections, in the order they were created in the admin portal.
 *
 * Sections are managed entirely from the content desk -- this component only
 * renders whatever the API returns, so adding or removing a section needs no
 * code change or redeploy.
 */
export default function GallerySections() {
  const [sections, setSections] = useState<GalleryDto[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    readApiData<GalleryDto[]>(
      axios.get("/api/gallery-sections", { signal: controller.signal }),
      "Unable to load the gallery.",
    )
      .then(setSections)
      .catch((error: unknown) => {
        if (!axios.isCancel(error)) console.error(error);
      });

    return () => controller.abort();
  }, []);

  return (
    <>
      {sections.map((section) => (
        <GallerySection
          key={section.id}
          id={section.id}
          title={section.title}
          description={section.description}
          images={section.images}
        />
      ))}
    </>
  );
}