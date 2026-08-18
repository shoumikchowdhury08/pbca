import { Handshake } from "lucide-react";
import { CarouselSize } from "@/components/partnerCarousel";

export default function Sponsorships() {
  return (
    <section className="sponsors section-wrap" id="sponsorships">
      <div className="section-kicker">06 / IN GOOD COMPANY</div>
      <div className="sponsors-heading"><div><Handshake size={25} /><h2>Sponsorships<br /><span>&amp; partners.</span></h2></div><p>Our celebrations are made possible by organisations and people who believe culture is stronger when it is shared.</p></div>
      <CarouselSize />
    </section>
  );
}