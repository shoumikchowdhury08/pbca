import Link from "next/link";
import { ArrowUpRight, Users } from "lucide-react";

export default function Membership() {
  return (
    <section className="section-wrap" id="membership">
      <div className="section-kicker">03 / MEMBERSHIP</div>
      <Link
        className="relative mt-[55px] flex min-h-[360px] flex-col bg-[var(--wine)] p-[38px] text-white"
        href="/membership"
      >
        <Users className="h-7 w-7" />
        <p className="eyebrow mt-[55px] text-[#efc3a7]">Membership</p>
        <h2 className="max-w-[430px] font-serif text-[clamp(36px,4vw,58px)] font-normal leading-[0.98] tracking-[-0.05em]">
          Find your place in the PBCA family.
        </h2>
        <span className="text-link light absolute bottom-8">Become a member <ArrowUpRight size={16} /></span>
      </Link>
    </section>
  );
}
