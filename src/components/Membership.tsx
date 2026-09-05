import Link from "next/link";
import { ArrowUpRight, Users } from "lucide-react";

const placeholderImage = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720" role="img" aria-label="Placeholder image">
  <defs>
    <linearGradient id="member-bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#8b2f2f" />
      <stop offset="100%" stop-color="#3f1d17" />
    </linearGradient>
  </defs>
  <rect width="1200" height="720" fill="#5c1f21" />
  <rect width="1200" height="720" fill="url(#member-bg)" opacity="0.9" />
  <circle cx="240" cy="180" r="118" fill="rgba(255,255,255,0.12)" />
  <path d="M0 575C155 515 245 440 395 460C515 475 560 600 705 585C840 570 905 455 1045 475C1115 485 1160 520 1200 550V720H0Z" fill="rgba(255,214,180,0.18)" />
  <path d="M0 630C170 590 260 520 420 550C560 576 645 650 845 625C980 607 1065 560 1200 588V720H0Z" fill="rgba(255,255,255,0.08)" />
</svg>
`)}`;

export default function Membership() {
  return (
    <section className="section-wrap" id="membership">
      <div className="section-kicker">MEMBERSHIP</div>
      <Link
        className="relative mt-13.75 flex min-h-90 justify-between gap-5 bg-(--wine) p-9.5 text-white"
        href="/membership"
      >
        <div className="flex flex-col gap-5">
          <Users className="h-7 w-7" />
          <p className="eyebrow text-[#efc3a7]">Membership</p>
          <h2 className="max-w-107.5 font-serif text-[clamp(36px,4vw,58px)] font-normal leading-[0.98] tracking-tighter">
            Find your place in the PBCA family.
          </h2>
          <span className="text-link light absolute bottom-8">
            Become a member <ArrowUpRight size={16} />
          </span>
        </div>

        <div className="overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#3d1e1e]">
          <img
            src={placeholderImage}
            alt="Membership placeholder"
            className="h-52 w-full object-cover opacity-90"
          />
        </div>
      </Link>
    </section>
  );
}
