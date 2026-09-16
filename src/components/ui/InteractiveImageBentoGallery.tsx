"use client";

import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { cn } from "@/lib/utils"; // Assumes a 'lib/utils.ts' file for 'cn'

// Defines the structure for each image item in the gallery
type ImageItem = {
  id: number | string;
  title: string;
  desc: string;
  url: string;
  span: string; // Tailwind CSS grid span classes (e.g., "md:col-span-2")
};

// Defines the props for the main gallery component
interface InteractiveImageBentoGalleryProps {
  imageItems: ImageItem[];
  title: string;
  description: string;
}

// Animation variants for the container to stagger children
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Animation variants for each gallery item
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

// Main gallery component
const InteractiveImageBentoGallery: React.FC<
  InteractiveImageBentoGalleryProps
> = ({ imageItems, title, description }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  // Enable vertical-wheel scrolling sideways, matching a native scroll track
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (event: WheelEvent) => {
      if (container.scrollWidth <= container.clientWidth) return;
      const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (delta === 0) return;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const nextScrollLeft = container.scrollLeft + delta;
      // Only hijack the wheel while the strip can still scroll in that direction
      if (nextScrollLeft < 0 || nextScrollLeft > maxScrollLeft) return;
      event.preventDefault();
      container.scrollLeft = nextScrollLeft;
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, [imageItems]);

  // Framer Motion scroll animations
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [30, 0]);

  return (
    <section
      ref={targetRef}
      className="relative w-full overflow-hidden bg-background"
    >
      <motion.div
        style={{ opacity, y }}
        className="container mx-auto px-4 text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          {description}
        </p>
      </motion.div>

      <div
        ref={containerRef}
        className="gallery-scroll mt-12 w-full overflow-x-auto overflow-y-hidden overscroll-x-contain"
      >
        <motion.div
          className="w-max pb-2"
        >
          <motion.div
            className="grid auto-cols-[minmax(15rem,1fr)] grid-flow-col gap-4 px-4 md:px-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {imageItems.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className={cn(
                  "group relative flex h-full min-h-60 w-full min-w-60 items-end overflow-hidden rounded-xl border bg-card p-4 shadow-sm transition-shadow duration-300 ease-in-out hover:shadow-lg",
                  item.span,
                )}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-1 text-sm text-white/80">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveImageBentoGallery;
