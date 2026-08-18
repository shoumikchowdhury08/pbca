import Hero from "@/components/Hero";
import About from "@/components/About";
import Memories from "@/components/Memories";
import Gratitude from "@/components/Gratitude";
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
  idol: "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=1800&q=85",
  crowd: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=85",
  flowers: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=85",
  hands: "https://images.unsplash.com/photo-1567591414240-e9c1e59f3e06?auto=format&fit=crop&w=1000&q=85",
};

export default function Page() {
  return <PageShell><main>
    <Hero Heroimg={img.hero} />
    <Countdowntimer />
    <About />
    <Stats />
    <Memories Idolimg={img.idol} />
    <Gratitude Crowdimg={img.crowd} Flowerimg={img.flowers} />
    <Membership />
    <AwardsRecognition />
    <Events />
    <Sponsorships />
    <Testimonials handsImg={img.hands} />
    <Contact />
  </main></PageShell>;
}
