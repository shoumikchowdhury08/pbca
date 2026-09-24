import React from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type MemoriesProps = { Idolimg: string };

function Memories({ Idolimg }: MemoriesProps) {
  return (
    <section className="image-story section-wrap" id="memories">
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
