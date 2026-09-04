import Link from "next/link";
import { ArrowUpRight, Crown } from "lucide-react";

export default function AwardsRecognition() {
  return (
    <section className="section-wrap" id="awards-and-recognition">
      <div className="section-kicker">04 / AWARDS &amp; RECOGNITION</div>
      <Link
        className="relative mt-13.75 flex min-h-90 flex-col bg-[#e7ddd1] p-9.5"
        href="/awards-and-recognition"
      >
        <Crown className="h-7 w-7 text-(--wine)" />
        <p className="eyebrow mt-13.75">Awards &amp; recognition</p>
        <h2 className="max-w-107.5 font-serif text-[clamp(36px,4vw,58px)] font-normal leading-[0.98] tracking-tighter">
          Honouring the work behind the celebration.
        </h2>
        <span className="text-link absolute bottom-8">
          See our milestones <ArrowUpRight size={16} />
        </span>
      </Link>
    </section>
  );
}
