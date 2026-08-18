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
        <h1>PBCA welcomes you home.</h1>
        <p className="hero-sub">
          Proudly welcoming you to one of East Bangalore&apos;s oldest Bengali
          associations as we celebrate the 23rd edition of our grand Durga
          Puja &amp; Dusshera festivities.
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
