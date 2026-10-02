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

export default function Page() {
  return (
    <PageShell>
      <main>
        <Hero />
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
