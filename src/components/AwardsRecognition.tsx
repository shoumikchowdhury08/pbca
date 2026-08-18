import Link from "next/link";
import { ArrowUpRight, Crown } from "lucide-react";

export default function AwardsRecognition() {
  return (
    <section className="section-wrap" id="awards-and-recognition">
      <div className="section-kicker">04 / AWARDS &amp; RECOGNITION</div>
      <Link
        className="relative mt-[55px] flex min-h-[360px] flex-col bg-[#e7ddd1] p-[38px]"
        href="/awards-and-recognition"
      >
        <Crown className="h-7 w-7 text-[var(--wine)]" />
        <p className="eyebrow mt-[55px]">Awards &amp; recognition</p>
        <h2 className="max-w-[430px] font-serif text-[clamp(36px,4vw,58px)] font-normal leading-[0.98] tracking-[-0.05em]">
          Honouring the work behind the celebration.
        </h2>
        <span className="text-link absolute bottom-8">See our milestones <ArrowUpRight size={16} /></span>
      </Link>
    </section>
  );
}
