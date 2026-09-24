"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ImageIcon, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { GalleryImageDto } from "@/types/types";

type GallerySectionProps = {
  /** Gallery id, used for the section anchor. */
  id: string;
  title: string;
  description?: string;
  images: GalleryImageDto[];
};

const emptySubscribe = () => () => {};

/**
 * One titled gallery block on the Gallery page.
 *
 * These collections capture only an optional title per image, so the caption
 * and the alternate text both fall back to it. Tiles are lazy loaded -- the page
 * can hold dozens of images across sections, and only the ones near the
 * viewport should download. Clicking a tile opens the full, uncropped photo in
 * a zoom overlay.
 */
export default function GallerySection({
  id,
  title,
  description,
  images,
}: GallerySectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const shouldReduceMotion = useReducedMotion();

  const activeImage = activeIndex === null ? null : (images[activeIndex] ?? null);

  const close = useCallback(() => setActiveIndex(null), []);

  useEffect(() => {
    if (!activeImage) return;

    // Lock page scroll and prevent background content shifting
    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeImage, close]);

  const imageLabel = (image: { title: string; altText: string }) =>
    image.altText || image.title || "PBCA gallery image";

  const lightboxContent = (
    <AnimatePresence>
      {activeImage && (
        <motion.div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={imageLabel(activeImage)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={close}
        >
          <motion.div
            className="gallery-lightbox-panel"
            initial={shouldReduceMotion ? undefined : { scale: 0.94, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { scale: 0.96, y: 12 }}
            transition={{ duration: 0.3, ease: [0.2, 0.65, 0.3, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="gallery-lightbox-close"
              onClick={close}
              aria-label="Close image preview"
            >
              <X size={18} />
            </button>
            <Image
              className="gallery-lightbox-image"
              src={activeImage.url}
              alt={imageLabel(activeImage)}
              width={activeImage.width ?? 1600}
              height={activeImage.height ?? 1200}
              loading="lazy"
              decoding="async"
            />
            {activeImage.title && (
              <p className="gallery-lightbox-title">{activeImage.title}</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <section className="gallery-section" id={`gallery-${id}`}>
      <div className="gallery-section-heading">
        <div>
          <h2>{title}</h2>
        </div>
        {description && <p>{description}</p>}
      </div>

      {images.length ? (
        <div className="gallery-grid">
          {images.map((image, index) => (
            <motion.figure
              key={image.id}
              className="gallery-tile"
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: Math.min(index * 0.05, 0.35),
                ease: [0.2, 0.65, 0.3, 1],
              }}
            >
              <button
                type="button"
                className="gallery-tile-button"
                onClick={() => setActiveIndex(index)}
                aria-label={`View ${image.title || "this image"} larger`}
              >
                <Image
                  src={image.url}
                  alt={imageLabel(image)}
                  width={image.width ?? 1600}
                  height={image.height ?? 1200}
                  loading="lazy"
                  decoding="async"
                />
              </button>
              {image.title && <figcaption>{image.title}</figcaption>}
            </motion.figure>
          ))}
        </div>
      ) : (
        <p className="gallery-empty">
          <ImageIcon size={18} /> Photos from this collection will appear here as
          soon as they are published from the content desk.
        </p>
      )}

      {isClient && typeof document !== "undefined"
        ? createPortal(lightboxContent, document.body)
        : null}
    </section>
  );
}