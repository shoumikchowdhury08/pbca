import { Users, HeartHandshake, CalendarCheck } from "lucide-react";
import InteriorPage from "@/components/InteriorPage";
import AccordionGallery from "@/components/ui/AccordionGallery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

const benefits = [
  {
    icon: Users,
    title: "A wider circle",
    text: "Meet families, artists, volunteers and friends who make PBCA feel like home.",
  },
  {
    icon: HeartHandshake,
    title: "A way to contribute",
    text: "Support the traditions and community programmes that matter to all of us.",
  },
  {
    icon: CalendarCheck,
    title: "A year of belonging",
    text: "Join gatherings, workshops and celebrations beyond the five days of puja.",
  },
];

const items = [
  {
    image: "/api/r2/_DSC6888.JPG",
    label: "PBCA memories",
  },
  {
    image: "/api/r2/_DSC7067.JPG",
    label: "Celebration moments",
  },
];

export default function MembershipPage() {
  return (
    <InteriorPage
      pageSlug="membership"
      // eyebrow="02 / MEMBERSHIP"
      title={
        <>
          Belong
          <br />
          <i>with us.</i>
        </>
      }
      intro="Membership is an invitation to take part, show up and help shape the next chapter of PBCA."
      image="https://images.unsplash.com/photo-1567591414240-e9c1e59f3e06?auto=format&fit=crop&w=1800&q=85"
    >
      <div className="interior-copy-grid">
        <div>
          <p className="eyebrow">Why join?</p>
          <h2>Bring your whole self to the celebration.</h2>
        </div>
        <div>
          <p>
            Whether you have been here for decades or are discovering PBCA for
            the first time, membership gives you a place in the work and the joy
            of our community.
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
      <AccordionGallery
        items={items}
        defaultIndex={2}
        expandRatio={0.52}
        trigger="hover"
        accentColor="#ffffff"
        overlayColor="#060010"
        textColor="#ffffff"
        grayscale
        showLabels
        duration={0.6}
        ease="power3.out"
        parallax={0.5}
        tilt={8}
        stagger={0.06}
        height={460}
        gap={10}
        radius={16}
        orientation="horizontal"
      />
    </InteriorPage>
  );
}
