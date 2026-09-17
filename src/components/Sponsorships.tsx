"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Handshake } from "lucide-react";
import { LogoLoop } from "@/components/LogoLoop";
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
  /**
   * Background colour of the section the loop sits on. The loop's gradient fade
   * must match it so logos dissolve into the page instead of into a grey band.
   */
  fadeOutColor?: string;
};

function imageUrlFromStorageKey(storageKey: string) {
  return `/api/r2/${storageKey.split("/").map(encodeURIComponent).join("/")}`;
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
  fadeOutColor = "#f7f4ef",
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
      <LogoLoop
        logos={partnerLogos}
        speed={100}
        direction="right"
        logoHeight={100}
        gap={60}
        hoverSpeed={0}
        scaleOnHover
        fadeOut
        fadeOutColor={fadeOutColor}
        ariaLabel={ariaLabel}
      />
    </section>
  );
}
