"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, ImageIcon, Sparkles, X } from "lucide-react";
import { readApiData } from "@/lib/http";
import type { GalleryDto, GalleryImageDto } from "@/types/types";

/**
 * Grid column/row spans are assigned by position so the mosaic stays balanced
 * no matter how many sponsor images are uploaded.
 */
function tileClass(index: number) {
  const pattern = index % 6;
  if (pattern === 0) return "sponsor-tile sponsor-tile--feature";
  if (pattern === 1) return "sponsor-tile sponsor-tile--portrait";
  if (pattern === 3) return "sponsor-tile sponsor-tile--wide";
  return "sponsor-tile";
}

function tileTone(index: number) {
  return index % 2 === 0 ? "tone-wine" : "tone-ink";
}

export default function SponsorShowcase() {
  const [gallery, setGallery] = useState<GalleryDto | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const controller = new AbortController();
    readApiData<GalleryDto>(
      axios.get("/api/galleries/sponsors", { signal: controller.signal }),
      "Unable to load sponsors gallery.",
    )
      .then(setGallery)
      .catch((error: unknown) => {
        if (!axios.isCancel(error)) console.error(error);
      });

    return () => controller.abort();
  }, []);

  const images = gallery?.images ?? [];
  const activeImage: GalleryImageDto | null =
    activeIndex === null ? null : (images[activeIndex] ?? null);

  const close = useCallback(() => setActiveIndex(null), []);

  useEffect(() => {
    if (!activeImage) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [activeImage, close]);

  return (
    <section className="sponsor-showcase section-wrap" id="sponsor-showcase">
      <div className="section-kicker">SHOWCASE</div>
      <div className="sponsor-showcase-heading">
        <div>
          <Sparkles size={25} />
          <h2>
            What our sponsors
            <br />
            <span>bring to life.</span>
          </h2>
        </div>
        <p>
          From hand-painted banners and stage craft to sweet stalls and sound
          systems, our sponsors contribute far more than funds. This gallery
          gathers the work, the detail and the generosity they share with the
          PBCA family.
        </p>
      </div>

      {images.length ? (
        <div className="sponsor-showcase-grid">
          {images.map((image, index) => (
            <motion.figure
              key={image.id}
              className={`${tileClass(index)} ${tileTone(index)}`}
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.65,
                delay: Math.min(index * 0.08, 0.4),
                ease: [0.2, 0.65, 0.3, 1],
              }}
            >
              <button
                type="button"
                className="sponsor-tile-button"
                onClick={() => setActiveIndex(index)}
                aria-label={`View ${image.title || image.altText} in full`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.altText}
                  loading="lazy"
                  decoding="async"
                />
                <span className="sponsor-tile-scrim" aria-hidden="true" />
                <span className="sponsor-tile-body">
                  <span className="sponsor-tile-tag">
                    {image.layoutVariant === "feature-tall"
                      ? "Signature"
                      : "Presented"}
                  </span>
                  <strong>{image.title || image.altText}</strong>
                  {image.description && <em>{image.description}</em>}
                  <span className="sponsor-tile-more">
                    View <ArrowUpRight size={14} />
                  </span>
                </span>
              </button>
            </motion.figure>
          ))}
        </div>
      ) : (
        <p className="sponsor-showcase-empty">
          <ImageIcon size={18} /> Sponsor highlights will appear here as soon as
          they are published from the content desk.
        </p>
      )}

      <AnimatePresence>
        {activeImage && (
          <motion.div
            className="sponsor-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={activeImage.title || activeImage.altText}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
          >
            <motion.div
              className="sponsor-lightbox-panel"
              initial={shouldReduceMotion ? undefined : { scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { scale: 0.96, y: 12 }}
              transition={{ duration: 0.3, ease: [0.2, 0.65, 0.3, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="sponsor-lightbox-close"
                onClick={close}
                aria-label="Close gallery preview"
              >
                <X size={18} />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeImage.url}
                alt={activeImage.altText}
                className="sponsor-lightbox-image"
                loading="lazy"
                decoding="async"
              />
              <div className="sponsor-lightbox-copy">
                <p className="eyebrow">{gallery?.title ?? "Sponsors"}</p>
                <h3>{activeImage.title || activeImage.altText}</h3>
                {activeImage.description && <p>{activeImage.description}</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
