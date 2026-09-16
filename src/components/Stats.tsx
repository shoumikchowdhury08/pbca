"use client";
import { CalendarDays } from "lucide-react";
import CountUp from "@/components/ui/CountUp";
import { getPujaEdition } from "@/lib/utils";

export function Stats() {
  const pujaYears = getPujaEdition();
  return (
    <section className="stats-band">
      <div className="stats-intro">
        <CalendarDays size={24} />
        <p className="eyebrow">A growing community</p>
        <h2>{pujaYears} years of showing up for one another</h2>
      </div>
      <div className="stats-grid">
        <div>
          <div className="flex px-0 py-0">
            <CountUp
              from={0}
              to={300000}
              separator=","
              direction="up"
              duration={0.1}
              className="count-up-text"
              delay={0.5}
            />
            <span className="count-up-text">+</span>
          </div>
          <span>Devotees Annually</span>
        </div>
        <div>
          <CountUp
            from={0}
            to={50000}
            separator=","
            direction="up"
            duration={0.2}
            className="count-up-text"
            delay={0.5}
          />
          {/* <span className="count-up-text">+</span> */}
          {/* <strong>50,000+</strong> */}
          <span>Devotees Daily</span>
        </div>
        <div>
          <CountUp
            from={0}
            to={50}
            separator=","
            direction="up"
            duration={0.2}
            className="count-up-text"
            delay={0.5}
          />
          {/* <span className="count-up-text">+</span> */}
          {/* <strong>50+</strong> */}
          <span>cultural events each year</span>
        </div>
        <div>
          <strong>100+</strong>
          <span>Food & Commercial Stalls</span>
        </div>
      </div>
    </section>
  );
}
