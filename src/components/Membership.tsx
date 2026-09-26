import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Users } from "lucide-react";

export default function Membership() {
  return (
    <section className="section-wrap" id="membership">
      <div className="section-kicker">MEMBERSHIP</div>
      <Link
        className="relative mt-13.75 flex min-h-90 flex-col justify-between gap-8 bg-(--wine) p-7 text-white md:flex-row md:gap-5 md:p-9.5"
        href="/membership"
      >
        <div className="flex flex-col gap-5">
          <Users className="h-7 w-7 text-[#f7f4ef]" />
          <p className="font-[15px] tracking-[0.17em] uppercase text-[#fff7f2]">
            Membership
          </p>
          <h2 className="text-[#f7f4ef] max-w-107.5 font-serif text-[clamp(28px,7.6vw,36px)] font-normal leading-[0.98] tracking-tighter md:text-[clamp(36px,4vw,58px)]">
            Come home to the PBCA family.
          </h2>
          <span className="text-link light md:absolute md:bottom-8">
            Become a member <ArrowUpRight size={16} />
          </span>
        </div>

        <div className="overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#3d1e1e]">
          <Image
            src="/members.jpg"
            alt="Membership placeholder"
            width={1600}
            height={900}
            loading="lazy"
            decoding="async"
            className="h-64 w-full object-cover opacity-90 md:h-80"
          />
        </div>
      </Link>
    </section>
  );
}
