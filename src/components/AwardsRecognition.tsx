import Link from "next/link";
import { ArrowUpRight, Crown } from "lucide-react";

const placeholderImage = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720" role="img" aria-label="Placeholder image">
  <defs>
    <linearGradient id="award-bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#f1e3d4" />
      <stop offset="100%" stop-color="#c79a6d" />
    </linearGradient>
  </defs>
  <rect width="1200" height="720" fill="#efe5dc" />
  <rect width="1200" height="720" fill="url(#award-bg)" opacity="0.8" />
  <circle cx="230" cy="170" r="120" fill="rgba(255,255,255,0.35)" />
  <path d="M0 560C140 500 220 420 350 450C470 478 470 600 620 585C760 570 850 450 1010 480C1100 500 1160 550 1200 575V720H0Z" fill="rgba(118,65,38,0.38)" />
  <path d="M0 630C150 585 240 515 400 545C560 575 620 660 790 635C940 612 1030 560 1200 592V720H0Z" fill="rgba(88,54,38,0.5)" />
</svg>
`)}`;

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
          <img
            src={placeholderImage}
            alt="Awards and recognition placeholder"
            className="h-52 w-full object-cover"
          />
        </div>
      </Link>
    </section>
  );
}
