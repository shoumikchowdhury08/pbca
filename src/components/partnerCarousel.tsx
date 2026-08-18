import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function CarouselSize() {
  const partners = ["MTR Foods", "Bengaluru", "Kalyani", "Saha Group", "Maa Home"];
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="partner-carousel"
    >
      <CarouselContent>
        {partners.map((partner) => (
          <CarouselItem key={partner} className="partner-slide">
            <div className="partner-logo">{partner}</div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
