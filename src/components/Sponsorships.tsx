"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowUpRight, Handshake } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { r2PublicUrl } from "@/lib/media-url";
import type { PartnerDto } from "@/types/types";

interface SponsorshipsResponse {
  data: PartnerDto[];
}

type SponsorshipsProps = {
  /** Anchor id for the section. */
  id?: string;
  /** Wrapper classes. Pages that already inset their content can drop `section-wrap`. */
  className?: string;
  kicker?: string;
  heading?: React.ReactNode;
  description?: string;
  ariaLabel?: string;
};

function imageUrlFromStorageKey(storageKey: string) {
  return r2PublicUrl(storageKey);
}

export default function Sponsorships({
  id = "sponsorships",
  className = "sponsors section-wrap",
  kicker = "IN GOOD COMPANY",
  heading = (
    <>
      Sponsorships
      <br />
      <span>&amp; partners.</span>
    </>
  ),
  description = "Our celebrations are made possible by organisations and people who believe culture is stronger when it is shared.",
  ariaLabel = "Our Partners",
}: SponsorshipsProps = {}) {
  const [partners, setPartners] = useState<PartnerDto[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get<SponsorshipsResponse>("/api/sponsorships", {
        signal: controller.signal,
      })
      .then((response) => setPartners(response.data.data))
      .catch((error: unknown) => {
        if (axios.isCancel(error)) return;
        console.error(error);
      });

    return () => controller.abort();
  }, []);

  const partnerLogos = partners.map((partner) => ({
    src: imageUrlFromStorageKey(partner.image.storageKey),
    alt: partner.image.altText,
    title: partner.name,
    href: partner.websiteUrl ?? undefined,
    // Keep intrinsic dimensions so the logos retain their uploaded aspect ratios.
    width: partner.image.width ?? undefined,
    height: partner.image.height ?? undefined,
  }));

  return (
    <section className={className} id={id}>
      <div className="section-kicker">{kicker}</div>
      <div className="sponsors-heading">
        <div>
          <Handshake size={25} />
          <h2>{heading}</h2>
        </div>
        <p>{description}</p>
      </div>
      <Marquee
        direction="right"
        speed={65}
        pauseOnHover
        className="sponsor-marquee mt-0"
        role="region"
        aria-label={ariaLabel}
      >
        {partnerLogos.map((logo, index) => {
          const image = (
            <Image
              src={logo.src}
              alt={logo.alt || logo.title}
              title={logo.title}
              width={logo.width ?? 400}
              height={logo.height ?? 100}
              className="sponsor-marquee-image"
              loading="lazy"
            />
          );

          return logo.href ? (
            <Link
              key={`${logo.src}-${index}`}
              href={logo.href}
              target="_blank"
              rel="noopener noreferrer"
              className="sponsor-marquee-logo"
              aria-label={logo.title}
            >
              {image}
            </Link>
          ) : (
            <span key={`${logo.src}-${index}`} className="sponsor-marquee-logo">
              {image}
            </span>
          );
        })}
      </Marquee>
      <Link
        href="/sponsors"
        className="text-link"
        aria-label="View all sponsorship opportunities and partners"
      >
        View all sponsors <ArrowUpRight size={16} />
      </Link>
    </section>
  );
}
