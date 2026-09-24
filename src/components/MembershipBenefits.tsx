"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { readApiData } from "@/lib/http";
import { MEMBERSHIP_BENEFIT_CARDS } from "@/lib/membership";
import { sortGalleryImages, type GalleryDto } from "@/types/types";

/**
 * The Membership page benefit cards. Titles, copy, and icons are fixed in
 * code; each card's photo comes from the first N published images of the
 * Membership gallery, ordered with the same sortGalleryImages helper the admin
 * portal uses, so the list order in the admin portal IS the card order on the
 * page -- upload an image and it fills the next open card.
 */
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
      {MEMBERSHIP_BENEFIT_CARDS.map(({ icon: Icon, title, text }, index) => {
        const image = images[index];
        return (
          <article key={title}>
            {image && (
              <Image
                src={image.url}
                alt={image.altText || image.title || title}
                width={image.width ?? 1600}
                height={image.height ?? 1000}
                loading="lazy"
                decoding="async"
              />
            )}
            <Icon size={24} />
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        );
      })}
    </div>
  );
}