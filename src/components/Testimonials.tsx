"use client";

import { useEffect, useState } from "react";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";
import type { TestimonialDto } from "@/types/types";

function Testimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialDto[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/testimonials", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load testimonials.");
        const body: { data: TestimonialDto[] } = await response.json();
        setTestimonials(body.data);
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error(error);
        }
      });

    return () => controller.abort();
  }, []);

  if (!testimonials.length) return null;

  return (
    <section className="quote-section section-wrap">
      <div className="section-kicker">TESTIMONIALS</div>
      <div className="rounded-md flex flex-col antialiased bg-background dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden w-full">
        <InfiniteMovingCards
          items={testimonials.map(({ quote, name }) => ({
            quote,
            name,
          }))}
          direction="right"
          speed="slow"
        />
      </div>
      <div className="rounded-md flex flex-col antialiased bg-background dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden w-full">
        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="normal"
        />
      </div>
    </section>
  );
}

export default Testimonials;
