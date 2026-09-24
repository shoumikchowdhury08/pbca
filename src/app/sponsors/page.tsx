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
    title: "Celebration Made Possible Together",
    text: "It is through our partnership that we are able to transform tradition into experience, ensuring every prayer, performance, and gathering has a place to shine.",
  },
  {
    icon: Megaphone,
    title: "Visible Goodwill",
    text: "Your name shines across every banner, programme note, and announcement throughout the puja season—celebrated and remembered as part of the festival's story.",
  },
  {
    icon: BadgeCheck,
    title: "Enduring Partnerships",
    text: "We nurture relationships that last beyond the festival through every event, moments, community drives, and cultural evenings that keep the spirit alive all year.",
  },
];

export default function SponsorsPage() {
  return (
    <InteriorPage
      pageSlug="sponsors"
      title={
        <>
          United in Celebration,
          <br />
          <i>Powered by Generosity</i>
        </>
      }
      intro="Our traditions thrive because of the unwavering support of our sponsors and partners."
      image="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1800&q=85"
    >
      <div className="interior-copy-grid">
        <div>
          <p className="eyebrow">Why sponsor PBCA?</p>
          <h2>A celebration built by many hands.</h2>
        </div>
        <div>
          <p>
            PBCA&apos;s Durga Puja began with a handful of families determined
            to keep home close. Today, it has grown into one of Bangalore&apos;s
            most cherished Bengali gatherings—sustained by the partnerships of
            individuals and corporates who believe culture deserves a place to
            thrive.
          </p>
          <p>
            Your sponsorship is more than support for a festival—it is an
            investment in community. It empowers artisans to craft the idol,
            chefs to serve bhog to thousands, young performers to step onto the
            stage, and volunteers to welcome everyone with open doors. In
            return, we ensure your partnership is celebrated, visible, and
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
        description="Corporates, individuals, neighborhood restaurants, and local businesses who stand with us year after year."
        fadeOutColor="#f7f4ef"
      />

      <SponsorShowcase />

      <SponsorVideos />
    </InteriorPage>
  );
}
