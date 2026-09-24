import React from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type AboutProps = { Idolimg: string };

function About({ Idolimg }: AboutProps) {
  return (
    <section className="image-story section-wrap" id="about-us">
      <div className="story-image">
        <Image
          src={Idolimg}
          alt="Durga idol decorated with flowers"
          width={1600}
          height={1200}
          sizes="(max-width: 800px) 100vw, 60vw"
          loading="lazy"
          decoding="async"
        />
        <span className="image-label">A moment of grace</span>
      </div>
      <div className="story-copy">
        <p className="eyebrow">The PBCA way</p>
        <h2 className="mb-4 mt-4">
          More than a festival.
          <br />
          <i>It's a feeling.</i>
        </h2>
        <p>
          Every year, that familiar magic returns ! The scent of incense, the
          shimmer of the dhunuchi, and the warm invitation to be part of our
          puja rituals. These moments become cherished memories that make our
          celebrations live on.
        </p>
        <Link className="circle-link" href="/about-us" aria-label="Read more">
          <ArrowUpRight />
        </Link>
      </div>
    </section>
  );
}
export default About;
