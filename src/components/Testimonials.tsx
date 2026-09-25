"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";
import { readApiData } from "@/lib/http";
import type { TestimonialDto } from "@/types/types";

function Testimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialDto[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    readApiData<TestimonialDto[]>(
      axios.get("/api/testimonials", { signal: controller.signal }),
      "Unable to load testimonials.",
    )
      .then(setTestimonials)
      .catch((error: unknown) => {
        if (!axios.isCancel(error)) console.error(error);
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
          speed="normal"
        />
      </div>
      {/* <div className="rounded-md flex flex-col antialiased bg-background dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden w-full">
        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="normal"
        />
      </div> */}
    </section>
  );
}

export default Testimonials;
