import Hero from "@/components/Hero";
import About from "@/components/About";
import Countdowntimer from "@/components/Countdowntimer";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import PageShell from "@/components/PageShell";
import Membership from "@/components/Membership";
import AwardsRecognition from "@/components/AwardsRecognition";
import { Stats } from "@/components/Stats";
import { Events } from "@/components/Events";
import Sponsorships from "@/components/Sponsorships";

const img = {
  hero: "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=1800&q=85",
};

export default function Page() {
  return (
    <PageShell>
      <main>
        <Hero Heroimg={img.hero} />
        <Countdowntimer />
        <About Idolimg="/aboutus.jpg" />
        <Stats />
        <Events />
        <Sponsorships />
        <Membership />
        <AwardsRecognition />
        <Testimonials />
        <Contact />
      </main>
    </PageShell>
  );
}
