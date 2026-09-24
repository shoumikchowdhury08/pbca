import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Crown } from "lucide-react";

export default function AwardsRecognition() {
  return (
    <section className="section-wrap" id="awards-and-recognition">
      <div className="section-kicker">AWARDS &amp; RECOGNITION</div>
      <Link
        className="relative mt-13.75 flex min-h-90 justify-between gap-5 bg-[#e7ddd1] p-9.5"
        href="/awards-and-recognition"
      >
        <div className="flex flex-col gap-5">
          <Crown className="h-7 w-7 text-(--wine)" />
          <p className="eyebrow">Awards &amp; recognition</p>
          <h2 className="max-w-107.5 font-serif text-[clamp(36px,4vw,58px)] font-normal leading-[0.98] tracking-tighter">
            Honouring the work behind the celebration.
          </h2>
          <span className="text-link absolute bottom-8">
            See our milestones <ArrowUpRight size={16} />
          </span>
        </div>

        <div className="overflow-hidden rounded-[1.25rem] border border-black/10 bg-[#f4eadf]">
          <Image
            src="/awards.jpg"
            alt="Awards and recognition placeholder"
            width={1600}
            height={900}
            loading="lazy"
            decoding="async"
            className="h-80 w-full object-cover"
          />
        </div>
      </Link>
    </section>
  );
}
