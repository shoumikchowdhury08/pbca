"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, animate } from "framer-motion";

/**
 * One carousel slide. The About Us page fills these from the About Us gallery
 * in the admin portal, so uploading/reordering images there drives the strip.
 */
export interface CarouselItem {
  id: string;
  url: string;
  title: string;
  overlayTitle?: string;
  description?: string;
}

export type AboutUsCarouselItem = CarouselItem;

const FULL_WIDTH_PX = 120;
const COLLAPSED_WIDTH_PX = 35;
const GAP_PX = 2;
const MARGIN_PX = 2;

type ThumbnailsProps = {
  index: number;
  items: CarouselItem[];
  setIndex: React.Dispatch<React.SetStateAction<number>>;
};

function Thumbnails({ index, items, setIndex }: ThumbnailsProps) {
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (thumbnailsRef.current) {
      let scrollPosition = 0;
      for (let i = 0; i < index; i++) {
        scrollPosition += COLLAPSED_WIDTH_PX + GAP_PX;
      }

      scrollPosition += MARGIN_PX;

      const containerWidth = thumbnailsRef.current.offsetWidth;
      const centerOffset = containerWidth / 2 - FULL_WIDTH_PX / 2;
      scrollPosition -= centerOffset;

      thumbnailsRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [index]);

  return (
    <div
      ref={thumbnailsRef}
      className="overflow-x-auto"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style>{`
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="flex gap-0.5 h-20 pb-2" style={{ width: "fit-content" }}>
        {items.map((item, i) => (
          <motion.button
            key={item.id}
            onClick={() => setIndex(i)}
            initial={false}
            animate={i === index ? "active" : "inactive"}
            variants={{
              active: {
                width: FULL_WIDTH_PX,
                marginLeft: MARGIN_PX,
                marginRight: MARGIN_PX,
              },
              inactive: {
                width: COLLAPSED_WIDTH_PX,
                marginLeft: 0,
                marginRight: 0,
              },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative shrink-0 h-full overflow-hidden rounded"
          >
            <Image
              src={item.url}
              alt={item.title}
              width={400}
              height={400}
              sizes="120px"
              className="w-full h-full object-cover pointer-events-none select-none"
              draggable={false}
              loading="lazy"
              decoding="async"
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

type CarouselProps = {
  items: CarouselItem[];
};

export default function Carousel({ items }: CarouselProps) {
  const [index, setIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);

  useEffect(() => {
    if (!isDragging && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth || 1;
      const targetX = -index * containerWidth;

      animate(x, targetX, {
        type: "spring",
        stiffness: 300,
        damping: 30,
      });
    }
  }, [index, x, isDragging]);

  // The early return sits after every hook so hook order never changes: an
  // admin gallery with no published images simply shows no carousel.
  if (!items.length) return null;

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3">
        {/* Main Carousel */}
        <div
          className="relative overflow-hidden rounded-lg bg-gray-100"
          ref={containerRef}
        >
          <motion.div
            className="flex"
            drag="x"
            dragElastic={0.2}
            dragMomentum={false}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(e, info) => {
              setIsDragging(false);
              const containerWidth = containerRef.current?.offsetWidth || 1;
              const offset = info.offset.x;
              const velocity = info.velocity.x;

              let newIndex = index;

              // If fast swipe, use velocity
              if (Math.abs(velocity) > 500) {
                newIndex = velocity > 0 ? index - 1 : index + 1;
              }
              // Otherwise use offset threshold (30% of container width)
              else if (Math.abs(offset) > containerWidth * 0.3) {
                newIndex = offset > 0 ? index - 1 : index + 1;
              }

              // Clamp index
              newIndex = Math.max(0, Math.min(items.length - 1, newIndex));
              setIndex(newIndex);
            }}
            style={{ x }}
          >
            {items.map((item) => (
              <div key={item.id} className="relative shrink-0 w-full h-100">
                <Image
                  src={item.url}
                  alt={item.title}
                  width={1600}
                  height={1000}
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="w-full h-full object-cover rounded-lg select-none pointer-events-none"
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                />
                {(item.overlayTitle || item.description) && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 via-black/45 to-transparent px-6 pb-8 pt-24 text-white sm:px-10">
                    {item.overlayTitle && (
                      <h2 className="mb-2 text-2xl font-semibold sm:text-3xl">
                        {item.overlayTitle}
                      </h2>
                    )}
                    {item.description && (
                      <p className="max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
                        {item.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </motion.div>

          {/* Previous Button */}
          <motion.button
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className={`absolute left-4 text-black top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform z-10
              ${
                index === 0
                  ? "opacity-40 cursor-not-allowed"
                  : "bg-white hover:scale-110 hover:opacity-100 opacity-70"
              }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </motion.button>

          {/* Next Button */}
          <motion.button
            disabled={index === items.length - 1}
            onClick={() => setIndex((i) => Math.min(items.length - 1, i + 1))}
            className={`absolute text-black right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform z-10
              ${
                index === items.length - 1
                  ? "opacity-40 cursor-not-allowed"
                  : "bg-white hover:scale-110 hover:opacity-100 opacity-70"
              }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </motion.button>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {index + 1} / {items.length}
          </div>
        </div>

        <Thumbnails index={index} items={items} setIndex={setIndex} />
      </div>
    </div>
  );
}
