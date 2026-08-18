import { imgProps } from "@/types/types";
import React from "react";
import { Quote } from "lucide-react";

function Testimonials({ handsImg }: imgProps) {
  return (
    <section className="quote-section section-wrap">
      <Quote size={34} />
      <blockquote>
        “PBCA is not just where we celebrate Durga Puja. It is where we remember
        who we are.”
      </blockquote>
      <div className="quote-author">
        <img src={handsImg} alt="PBCA community member" />
        <span>
          <b>Ananya Mukherjee</b>
          <small>PBCA member since 2004</small>
        </span>
      </div>
    </section>
  );
}

export default Testimonials;
