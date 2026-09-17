"use client";

import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import PageShell from "@/components/PageShell";

type InteriorPageProps = {
  eyebrow?: string;
  title: React.ReactNode;
  intro: string;
  image: string;
  pageSlug: string;
  children: React.ReactNode;
};

export default function InteriorPage({
  eyebrow,
  title,
  intro,
  image,
  pageSlug,
  children,
}: InteriorPageProps) {
  const [landingImage, setLandingImage] = useState(image);

  useEffect(() => {
    axios
      .get<{ data: { imageUrl: string } | null }>(`/api/landing/${pageSlug}`)
      .then((response) => {
        if (response.data.data?.imageUrl)
          setLandingImage(response.data.data.imageUrl);
      })
      .catch(() => undefined);
  }, [image, pageSlug]);

  return (
    <PageShell>
      <main className="interior-page">
        <section className="interior-hero">
          {/* Same reasoning as the home hero: this is the page's LCP image. */}
          <img
            src={landingImage}
            alt="PBCA community gathering"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="hero-overlay" />
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p>{intro}</p>
          </div>
        </section>
        <section className="interior-content section-wrap">
          {children}
          <Link className="text-link" href="/">
            Back to PBCA home <ArrowUpRight size={16} />
          </Link>
        </section>
      </main>
    </PageShell>
  );
}
