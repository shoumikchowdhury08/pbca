import Link from "next/link";
import { ArrowUpRight } from "lucide-react";


const events = [
  {
    title: "Dhaak & Dhunuchi",
    detail: "Music and dance",
    href: "/events#dhak-dhunuchi",
    className: "bento-card wine",
  },
  {
    title: "Cultural evenings",
    detail: "Stage, song and stories",
    href: "/events#cultural-evenings",
    className: "bento-card dark",
  },
  {
    title: "Food & adda",
    detail: "The tastes of home",
    href: "/events#food-adda",
    className: "bento-card flower",
  },
];

export function Events() {
  return (
    <section className="bento section-wrap" id="events">
      <div className="section-kicker">04 / WHAT&apos;S ON</div>
      <div className="bento-intro">
        <h2>Make a memory.<br /><span>Mark a moment.</span></h2>
        <p>From puja rituals to late-night adda, every PBCA event has a story waiting inside it.</p>
      </div>
      <div className="events-bento-grid">
        <Link className="event-feature" href="/events#durga-puja">
          <img src="https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=1200&q=85" alt="Durga Puja idol decorated with flowers" />
          <div><span>01 / THE MAIN EVENT</span><h3>Durga Puja &amp; Dusshera</h3><p>Five days of devotion, culture and community.</p></div>
        </Link>
        {events.map((event, index) => (
          <Link className={event.className} href={event.href} key={event.title}>
            <span>0{index + 2}</span><h3>{event.title}</h3><p>{event.detail}</p><ArrowUpRight size={28} />
          </Link>
        ))}
      </div>
      <Link className="text-link" href="/events">View all events <ArrowUpRight size={16} /></Link>
    </section>
  );
}