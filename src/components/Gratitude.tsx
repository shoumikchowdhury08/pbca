import React from "react";
import { imgProps } from "@/types/types";
import { Timer, Play } from "lucide-react";

function Gratitude({ Crowdimg, Flowerimg }: imgProps) {
  return (
    <section className="bento section-wrap" id="gratitude">
      <div className="section-kicker">02 / THE PBCA WAY</div>
      <div className="bento-intro">
        <h2>
          Five days.
          <br />
          <span>One shared heartbeat.</span>
        </h2>
        <p>
          Tradition has a rhythm. Discover the little rituals that make PBCA
          feel like home.
        </p>
      </div>
      <div className="bento-grid">
        <article className="bento-card large">
          <img src={Crowdimg} alt="Community gathering during a festival" />
          <div>
            <span>01</span>
            <h3>The welcome</h3>
            <p>Arrive as a visitor. Leave as family.</p>
          </div>
        </article>
        <article className="bento-card wine">
          <span>02</span>
          <h3>Evening aarti</h3>
          <p>When every voice finds the same prayer.</p>
          <Timer size={34} />
        </article>
        <article className="bento-card flower">
          <img src={Flowerimg} alt="Flowers arranged for puja" />
          <div>
            <span>03</span>
            <h3>Pushpanjali</h3>
            <p>Small offerings, endless gratitude.</p>
          </div>
        </article>
        <article className="bento-card dark">
          <span>04</span>
          <h3>Dhunuchi dance</h3>
          <p>Joy, in its most joyful form.</p>
          <Play size={34} />
        </article>
      </div>
    </section>
  );
}

export default Gratitude;
