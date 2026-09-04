"use client";
import { CalendarDays } from "lucide-react";
import CountUp from "@/components/ui/CountUp";

export function Stats() {
  return (
    <section className="stats-band">
      <div className="stats-intro">
        <CalendarDays size={24} />
        <p className="eyebrow">A growing community</p>
        <h2>23 years of showing up for one another.</h2>
      </div>
      <div className="stats-grid">
        <div>
          <div className="flex px-0 py-0">
            <CountUp
              from={0}
              to={230000}
              separator=","
              direction="up"
              duration={0.1}
              className="count-up-text"
              delay={0.5}
            />
            <span className="count-up-text">+</span>
          </div>
          <span>members &amp; families</span>
        </div>
        <div>
          <strong>23</strong>
          <span>editions of Durga Puja</span>
        </div>
        <div>
          <strong>40+</strong>
          <span>cultural events each year</span>
        </div>
        <div>
          <strong>10k</strong>
          <span>annual visitors</span>
        </div>
      </div>
    </section>
  );
}
