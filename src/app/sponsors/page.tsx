import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Handshake,
  Megaphone,
  Sparkles,
} from "lucide-react";
import InteriorPage from "@/components/InteriorPage";
import Sponsorships from "@/components/Sponsorships";
import SponsorShowcase from "@/components/SponsorShowcase";
import SponsorVideos from "@/components/SponsorVideos";

const pillars = [
  {
    icon: Handshake,
    title: "A shared stage",
    text: "Sponsors underwrite the pandal, the stage, the lights and the sound that hold five days of celebration together.",
  },
  {
    icon: Megaphone,
    title: "Visible goodwill",
    text: "Your name travels with every banner, programme note and announcement we make across the puja season.",
  },
  {
    icon: BadgeCheck,
    title: "Lasting partnership",
    text: "We build relationships that carry through the year — workshops, community drives and cultural evenings.",
  },
];

const tiers = [
  {
    name: "Community friend",
    detail: "Support a single programme or a day of the celebration.",
  },
  {
    name: "Season partner",
    detail: "Back the pandal, food stalls or cultural stage for the season.",
  },
  {
    name: "Principal sponsor",
    detail: "Lead the celebration with year-round visibility and co-branding.",
  },
];

export default function SponsorsPage() {
  return (
    <InteriorPage
      pageSlug="sponsors"
      title={
        <>
          Together we
          <br />
          <i>light up the pandal.</i>
        </>
      }
      intro="Every idol, every evening of music and every plate of bhog is carried by the generosity of our sponsors and partners."
      image="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1800&q=85"
    >
      <div className="interior-copy-grid">
        <div>
          <p className="eyebrow">Why sponsor PBCA?</p>
          <h2>A celebration built by many hands.</h2>
        </div>
        <div>
          <p>
            PBCA&apos;s Durga Puja began with a handful of families and a shared
            resolve to keep home close. Decades later it is one of
            Bangalore&apos;s most-loved Bengali gatherings — and it still runs
            on the goodwill of people and businesses who believe culture
            deserves a place to gather.
          </p>
          <p>
            When you sponsor PBCA, your contribution reaches further than a
            single festival. It funds the artists who craft the idol, the cooks
            who prepare bhog for thousands, the young performers who take the
            stage for the first time, and the volunteers who keep the doors open
            to everyone. In return we make sure your support is seen and
            remembered.
          </p>
        </div>
      </div>

      <div className="benefit-grid">
        {pillars.map(({ icon: Icon, title, text }) => (
          <article key={title}>
            <Icon size={24} />
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>

      <Sponsorships
        id="sponsors-loop"
        className="sponsors sponsors-page-loop"
        kicker="OUR SPONSORS & PARTNERS"
        ariaLabel="PBCA sponsors and partners"
        heading={
          <>
            In good
            <br />
            <span>company.</span>
          </>
        }
        description="Houses, studios, restaurants and neighbourhood businesses who stand with us year after year."
        fadeOutColor="#f7f4ef"
      />

      <SponsorShowcase />

      <SponsorVideos />

      {/* <section className="sponsor-cta" id="become-a-sponsor">
        <div>
          <p className="eyebrow">Sponsorship</p>
          <h2>Add your name to the story.</h2>
          <p>
            Tell us what you would like to support and we will share the
            sponsorship deck, visibility options and the moments your brand can
            join.
          </p>
        </div>
        <ul className="sponsor-tiers">
          {tiers.map((tier) => (
            <li key={tier.name}>
              <Sparkles size={16} />
              <b>{tier.name}</b>
              <span>{tier.detail}</span>
            </li>
          ))}
        </ul>
        <div className="sponsor-cta-actions">
          <a className="submit-button" href="mailto:sponsorship@pbca.org">
            Start a sponsorship conversation
          </a>
          <Link className="text-link" href="/#contact">
            Talk to the committee <ArrowUpRight size={16} />
          </Link>
        </div>
      </section> */}
    </InteriorPage>
  );
}
