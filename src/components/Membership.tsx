import Link from "next/link";
import { ArrowUpRight, Users } from "lucide-react";

export default function Membership() {
  return (
    <section className="section-wrap" id="membership">
      <div className="section-kicker">MEMBERSHIP</div>
      <Link
        className="relative mt-13.75 flex min-h-90 justify-between gap-5 bg-(--wine) p-9.5 text-white"
        href="/membership"
      >
        <div className="flex flex-col gap-5">
          <Users className="h-7 w-7 text-[#f7f4ef]" />
          <p className="eyebrow text-[#efc3a7]">Membership</p>
          <h2 className="text-[#f7f4ef] max-w-107.5 font-serif text-[clamp(36px,4vw,58px)] font-normal leading-[0.98] tracking-tighter">
            Come home to the PBCA family.
          </h2>
          <span className="text-link light absolute bottom-8">
            Become a member <ArrowUpRight size={16} />
          </span>
        </div>

        <div className="overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#3d1e1e]">
          <img
            src="members.jpg"
            alt="Membership placeholder"
            loading="lazy"
            decoding="async"
            className="h-80 w-full object-cover opacity-90"
          />
        </div>
      </Link>
    </section>
  );
}
