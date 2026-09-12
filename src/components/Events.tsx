"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { EventsBentoHomeDto } from "@/types/types";

export function Events() {
  const [events, setEvents] = useState<EventsBentoHomeDto[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get<{ data: EventsBentoHomeDto[] }>("/api/events-bento-home", {
        signal: controller.signal,
      })
      .then((response) => setEvents(response.data.data))
      .catch((error: unknown) => {
        if (!axios.isCancel(error)) console.error(error);
      });
    return () => controller.abort();
  }, []);

  const featured = events.find((event) => event.featured) ?? events[0];
  const supporting = events.filter((event) => event.id !== featured?.id);

  return (
    <section className="bento section-wrap" id="events">
      <div className="section-kicker">WHAT&apos;S ON</div>
      <div className="bento-intro">
        <h2>
          Make a memory.
          <br />
          <span>Mark a moment.</span>
        </h2>
        <p>
          From puja rituals to late-night adda, every PBCA event has a story
          waiting inside it.
        </p>
      </div>
      <div className="events-bento-grid">
        {featured && (
          <Link className="event-feature" href="/events">
            <img src={featured.image.imageUrl} alt={featured.image.altText} />
            <div>
              <h3>{featured.title}</h3>
              <p>{featured.detail}</p>
            </div>
          </Link>
        )}
        {supporting.map((event, index) => (
          <Link
            className={`bento-card ${index % 2 ? "dark" : "wine"}`}
            key={event.id}
            href="/events"
          >
            <img src={event.image.imageUrl} alt={event.image.altText} />
            <div className="bento-card-copy">
              <h3>{event.title}</h3>
              <p>{event.detail || `Event ${index + 1}`}</p>
            </div>
          </Link>
        ))}
      </div>
      <Link className="text-link" href="/events">
        View all events <ArrowUpRight size={16} />
      </Link>
    </section>
  );
}
