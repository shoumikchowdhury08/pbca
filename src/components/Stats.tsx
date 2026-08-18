import {CalendarDays} from "lucide-react";


export function Stats() {
  return (
    <section className="stats-band">
      <div className="stats-intro"><CalendarDays size={24} /><p className="eyebrow">A growing community</p><h2>23 years of showing up for one another.</h2></div>
      <div className="stats-grid">
        <div><strong>2,300+</strong><span>members &amp; families</span></div>
        <div><strong>23</strong><span>editions of Durga Puja</span></div>
        <div><strong>40+</strong><span>cultural events each year</span></div>
        <div><strong>10k</strong><span>annual visitors</span></div>
      </div>
    </section>
  );
}