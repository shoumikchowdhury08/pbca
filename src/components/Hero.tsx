"use client";
import React from "react";
import { ArrowUpRight } from "lucide-react";
import { imgProps } from "@/types/types";
import SplitText from "@/components/ui/splitText";

function Hero({ Heroimg }: imgProps) {
  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };
  return (
    <section className="hero" id="home">
      <img src={Heroimg} alt="A warmly lit Durga Puja celebration" />
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
          Proudly welcoming you to one of East Bangalore&apos;s oldest Bengali
          associations as we celebrate the 23rd edition of our grand Durga Puja
          &amp; Dusshera festivities.
        </p>
        <a className="text-link light" href="/events">
          Explore the festivities <ArrowUpRight size={16} />
        </a>
      </div>
      <div className="hero-side">
        Scroll to explore <span>↓</span>
      </div>
    </section>
  );
}

export default Hero;
