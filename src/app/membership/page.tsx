import { Users, HeartHandshake, CalendarCheck } from "lucide-react";
import InteriorPage from "@/components/InteriorPage";
import MembershipGallery from "@/components/MembershipGallery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

const benefits = [
  {
    icon: Users,
    title: "United in Celebration",
    text: "Meet families, artists, volunteers, and friends: the people who make PBCA feel like home.",
  },
  {
    icon: HeartHandshake,
    title: "Come and Connect",
    text: "Support the traditions and community programs that bring us together and keep our culture alive",
  },
  {
    icon: CalendarCheck,
    title: "Celebrations All Year Long",
    text: "Join us for meetings, gatherings and celebrations beyond the five days of puja.",
  },
];

export default function MembershipPage() {
  return (
    <InteriorPage
      pageSlug="membership"
      // eyebrow="02 / MEMBERSHIP"
      title={
        <>
          Join the PBCA Family
          <br />
          <i>Your journey with us begins here</i>
        </>
      }
      intro="We invite you to become a take part of the larger family, show up and help shape the next chapter of PBCA together."
      image="https://images.unsplash.com/photo-1567591414240-e9c1e59f3e06?auto=format&fit=crop&w=1800&q=85"
    >
      <div className="interior-copy-grid">
        <div>
          <p className="eyebrow">Why join?</p>
          <h2>Bring your whole self to the celebration.</h2>
        </div>
        <div>
          <p>
            Whether you’ve been with us for decades or are discovering PBCA for
            the first time, membership gives you a place in both the work and
            the joy of our community.
          </p>

          <div className="membership-actions">
            <Link
              className="whatsapp-button"
              href="https://wa.me/919986011648"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact us on WhatsApp"
              title="Contact us on WhatsApp"
            >
              <FontAwesomeIcon
                icon={faWhatsapp}
                size="2xl"
                style={{ color: "rgb(9, 123, 89)" }}
                aria-label="WhatsApp"
              />
            </Link>
            <a className="submit-button" href="mailto:membership@pbca.org">
              Enquire about membership
            </a>
          </div>
        </div>
      </div>
      <div className="mb-5 benefit-grid">
        {benefits.map(({ icon: Icon, title, text }) => (
          <article key={title}>
            <Icon size={24} />
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <MembershipGallery />
    </InteriorPage>
  );
}
