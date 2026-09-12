"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Handshake } from "lucide-react";
import { LogoLoop } from "@/components/LogoLoop";
import type { PartnerDto } from "@/types/types";

interface SponsorshipsResponse {
  data: PartnerDto[];
}

function imageUrlFromStorageKey(storageKey: string) {
  return `/api/r2/${storageKey.split("/").map(encodeURIComponent).join("/")}`;
}

export default function Sponsorships() {
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
    <section className="sponsors section-wrap" id="sponsorships">
      <div className="section-kicker">IN GOOD COMPANY</div>
      <div className="sponsors-heading">
        <div>
          <Handshake size={25} />
          <h2>
            Sponsorships
            <br />
            <span>&amp; partners.</span>
          </h2>
        </div>
        <p>
          Our celebrations are made possible by organisations and people who
          believe culture is stronger when it is shared.
        </p>
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
        fadeOutColor="#f7f4ef"
        ariaLabel="Our Partners"
      />
    </section>
  );
}
