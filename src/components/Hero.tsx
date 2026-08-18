import React from "react";
import { ArrowUpRight } from "lucide-react";
import { imgProps } from "@/types/types";

function Hero({ Heroimg }: imgProps) {
  return (
    <section className="hero" id="home">
      <img src={Heroimg} alt="A warmly lit Durga Puja celebration" />
      <div className="hero-overlay" />
      <div className="hero-copy">
        <p className="eyebrow">PBCA presents · since 1987</p>
        <h1>
          Where devotion
          <br />
          <i>becomes belonging.</i>
        </h1>
        <p className="hero-sub">
          A home for tradition, culture and togetherness — celebrating Durga
          Puja with an open heart.
        </p>
        <a className="text-link light" href="#about">
          Discover our story <ArrowUpRight size={16} />
        </a>
      </div>
      <div className="hero-side">
        Scroll to explore <span>↓</span>
      </div>
    </section>
  );
}

export default Hero;
