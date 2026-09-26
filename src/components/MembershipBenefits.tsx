"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { readApiData } from "@/lib/http";
import { sortGalleryImages, type GalleryDto } from "@/types/types";

export default function MembershipBenefits() {
  const [images, setImages] = useState<GalleryDto["images"]>([]);

  useEffect(() => {
    const controller = new AbortController();
    readApiData<GalleryDto>(
      axios.get("/api/galleries/membership", { signal: controller.signal }),
      "Unable to load benefit card images.",
    )
      .then((gallery) => setImages(sortGalleryImages(gallery.images)))
      .catch((error: unknown) => {
        if (!axios.isCancel(error)) console.error(error);
      });

    return () => controller.abort();
  }, []);

  return (
    <div className="mb-5 benefit-grid">
      {sortGalleryImages(images).map((card) => (
        <article key={card.id}>
          <Image
            src={card.url}
            alt={card.altText || card.title}
            width={card.width ?? 1600}
            height={card.height ?? 1000}
            loading="lazy"
            decoding="async"
          />
          <h3>{card.title}</h3>
          {card.description && <p>{card.description}</p>}
        </article>
      ))}
    </div>
  );
}
