import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageShell from "@/components/PageShell";

type InteriorPageProps = {
  eyebrow: string;
  title: React.ReactNode;
  intro: string;
  image: string;
  children: React.ReactNode;
};

export default function InteriorPage({ eyebrow, title, intro, image, children }: InteriorPageProps) {
  return <PageShell><main className="interior-page">
    <section className="interior-hero">
      <img src={image} alt="PBCA community gathering" />
      <div className="hero-overlay" />
      <div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></div>
    </section>
    <section className="interior-content section-wrap">{children}<Link className="text-link" href="/">Back to PBCA home <ArrowUpRight size={16} /></Link></section>
  </main></PageShell>;
}
