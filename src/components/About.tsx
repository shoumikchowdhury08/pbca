import React from "react";
import { ArrowUpRight } from "lucide-react";

function About() {
  return (
    <section className="intro section-wrap" id="about">
      <div className="section-kicker">01 / ABOUT PBCA</div>
      <div className="intro-grid">
        <h2>
          Rooted in ritual.
          <br />
          <span>Alive in the present.</span>
        </h2>
        <div>
          <p className="lead">
            PBCA is a community of people who believe that the most beautiful
            celebrations are the ones we share.
          </p>
          <p>
            From the first dhaak to the last sindoor, our puja is a living
            expression of Kolkata’s generous spirit. Come for the worship, stay
            for the conversations, the food, the music and the memories we make
            together.
          </p>
          <a className="text-link" href="#memories">
            Our story <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

export default About;
