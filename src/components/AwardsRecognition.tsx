import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Crown } from "lucide-react";

export default function AwardsRecognition() {
  return (
    <section className="section-wrap" id="awards-and-recognition">
      <div className="section-kicker">AWARDS &amp; RECOGNITION</div>
      <Link
        className="relative mt-13.75 flex min-h-90 flex-col justify-between gap-8 bg-[#e7ddd1] p-7 md:flex-row md:gap-5 md:p-9.5"
        href="/awards-and-recognition"
      >
        <div className="flex flex-col gap-5">
          <Crown className="h-7 w-7 text-(--wine)" />
          <p className="eyebrow">Awards &amp; recognition</p>
          <h2 className="max-w-107.5 font-serif text-[clamp(28px,7.6vw,36px)] font-normal leading-[0.98] tracking-tighter md:text-[clamp(36px,4vw,58px)]">
            Honouring the work behind the celebration.
          </h2>
          <span className="text-link md:absolute md:bottom-8">
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
            className="h-64 w-full object-cover md:h-80"
          />
        </div>
      </Link>
    </section>
  );
}
