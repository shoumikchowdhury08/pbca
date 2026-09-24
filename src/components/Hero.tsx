"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SplitText from "@/components/ui/splitText";
import { formatOrdinal, getPujaEdition } from "@/lib/utils";

type HeroProps = { Heroimg: string };

function Hero({ Heroimg }: HeroProps) {
  const [landingImage, setLandingImage] = useState(Heroimg);
  const pujaEdition = getPujaEdition();

  useEffect(() => {
    axios
      .get<{ data: { imageUrl: string } | null }>("/api/landing/home")
      .then((response) => {
        if (response.data.data?.imageUrl) {
          setLandingImage(response.data.data.imageUrl);
        }
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
      <Image
        src={landingImage}
        alt="A warmly lit Durga Puja celebration"
        width={1920}
        height={1080}
        sizes="100vw"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
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
      {/* <div className="hero-side">
        Scroll to explore <span>↓</span>
      </div> */}
    </section>
  );
}

export default Hero;
