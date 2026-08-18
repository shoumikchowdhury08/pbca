import React from "react";
import { ArrowUpRight } from "lucide-react";
import { imgProps } from "@/types/types";
import Link from "next/link";

function Memories({ Idolimg }: imgProps) {
  return (
    <section className="image-story section-wrap" id="memories">
      <div className="story-image">
        <img src={Idolimg} alt="Durga idol decorated with flowers" />
        <span className="image-label">A moment of grace</span>
      </div>
      <div className="story-copy">
        <p className="eyebrow">The PBCA way</p>
        <h2>
          More than a festival.
          <br />
          <i>A feeling.</i>
        </h2>
        <p>
          Every year, a familiar feeling returns. The scent of incense. The
          shimmer of the dhunuchi. Someone’s grandmother offering you a second
          helping. This is our favourite kind of magic.
        </p>
        <Link className="circle-link" href="/about-us" aria-label="Read more">
          <ArrowUpRight />
        </Link>
      </div>
    </section>
  );
}

export default Memories;
