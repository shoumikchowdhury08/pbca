"use client";

import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import PageShell from "@/components/PageShell";
import type { LandingImageDto } from "@/types/types";

type InteriorPageProps = {
  eyebrow?: string;
  title: React.ReactNode;
  intro: string;
  pageSlug: string;
  children: React.ReactNode;
};

export default function InteriorPage({
  eyebrow,
  title,
  intro,
  pageSlug,
  children,
}: InteriorPageProps) {
  const [landingImage, setLandingImage] = useState<LandingImageDto | null>(
    null,
  );

  useEffect(() => {
    axios
      .get<{ data: LandingImageDto | null }>(`/api/landing/${pageSlug}`)
      .then((response) => setLandingImage(response.data.data))
      .catch(() => undefined);
  }, [pageSlug]);

  return (
    <PageShell>
      <main className="interior-page">
        <section className="interior-hero">
          {landingImage && (
            <Image
              src={landingImage.imageUrl}
              alt={landingImage.altText}
              width={landingImage.width ?? 1920}
              height={landingImage.height ?? 1080}
              sizes="100vw"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          )}
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
