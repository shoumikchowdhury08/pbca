import { Handshake } from "lucide-react";
import { LogoLoop } from "@/components/LogoLoop";
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss } from 'react-icons/si';

export default function Sponsorships() {
  const techLogos = [
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
];
  return (
    <section className="sponsors section-wrap" id="sponsorships">
      <div className="section-kicker">06 / IN GOOD COMPANY</div>
      <div className="sponsors-heading"><div><Handshake size={25} /><h2>Sponsorships<br /><span>&amp; partners.</span></h2></div><p>Our celebrations are made possible by organisations and people who believe culture is stronger when it is shared.</p></div>
      <LogoLoop
        logos={techLogos}
        speed={100}
        direction="right"
        logoHeight={100}
        gap={60}
        hoverSpeed={0}
        scaleOnHover
        fadeOut
        fadeOutColor="#f7f4ef"
        ariaLabel="Our Partners"
      />
    </section>
  );
}