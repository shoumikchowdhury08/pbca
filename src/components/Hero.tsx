"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import SplitText from "@/components/ui/splitText";
import { formatOrdinal, getPujaEdition } from "@/lib/utils";
import type { LandingImageDto } from "@/types/types";

function Hero() {
  const [landingMedia, setLandingMedia] = useState<LandingImageDto | null>(
    null,
  );
  const pujaEdition = getPujaEdition();

  useEffect(() => {
    axios
      .get<{ data: LandingImageDto | null }>("/api/landing/home")
      .then((response) => {
        setLandingMedia(response.data.data);
      })
      .catch(() => undefined);
  }, []);

  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };
  return (
    <section className="hero" id="home">
      {/* Hero art is the largest paint on the page, so it is requested eagerly
          at a high priority: `loading="lazy"` here would delay the LCP image. */}
      {landingMedia?.mimeType?.startsWith("video/") ? (
        <video
          src={landingMedia.imageUrl}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
      ) : landingMedia?.imageUrl ? (
        <Image
          src={landingMedia.imageUrl}
          alt={landingMedia.altText}
          width={1920}
          height={1080}
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      ) : null}
      <div className="hero-overlay" />
      <div className="hero-copy">
        <p className="eyebrow">PBCA presents · since 2004</p>

        <SplitText
          tag="h1"
          text="PBCA welcomes you home"
          className="text-2xl font-semibold text-center"
          delay={60}
          duration={0.4}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="left"
          onLetterAnimationComplete={handleAnimationComplete}
        />

        <p className="hero-sub">
          Proudly welcoming you to East Bangalore&apos;s oldest Bengali
          association as we celebrate the {formatOrdinal(pujaEdition)} edition
          of our grand Durga Puja &amp; Dusshera festivities.
        </p>
        <Link className="text-link light" href="/events">
          Explore the festivities <ArrowUpRight size={16} />
        </Link>
      </div>
      <Link
        className="hero-location"
        href="https://www.google.com/maps/place/PBCA+-+POORVA+BANGALORE+CULTURAL+ASSOCIATION/@12.9779128,77.7155791,17z/data=!4m6!3m5!1s0x3bae113e23e236e3:0x30e07a41a71b4a55!8m2!3d12.9779076!4d77.718154!16s%2Fg%2F11njhpz1hl?authuser=0&entry=ttu&g_ep=EgoyMDI2MDkyMi4wIKXMDSoASAFQAw%3D%3D"
        target="_blank"
        rel="noopener noreferrer"
      >
        <MapPin size={19} aria-hidden="true" />
        <span>
          KTPO, EPIP 2nd Phase, Whitefield Industrial Area, Bengaluru, Karnataka
        </span>
      </Link>
    </section>
  );
}

export default Hero;
