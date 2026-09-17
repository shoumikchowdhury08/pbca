"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { CalendarDays, Drum, Music4 } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { groupScheduleByDay } from "@/lib/events";
import type {
  EventScheduleItemDto,
  EventScheduleTrack,
} from "@/types/types";

type TrackConfig = {
  track: EventScheduleTrack;
  title: string;
  blurb: string;
  icon: React.ComponentType<{ size?: number | string }>;
};

const TRACKS: TrackConfig[] = [
  {
    track: "pujo",
    title: "Pujo Nirghonto",
    blurb: "The rituals, hour by hour.",
    icon: Drum,
  },
  {
    track: "cultural",
    title: "Cultural Events",
    blurb: "Stage, song and celebration.",
    icon: Music4,
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function EventSchedule() {
  const [items, setItems] = useState<EventScheduleItemDto[]>([]);
  const [loaded, setLoaded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get<{ data: EventScheduleItemDto[] }>("/api/events/schedule", {
        signal: controller.signal,
      })
      .then((response) => {
        setItems(response.data.data);
        setLoaded(true);
      })
      .catch((error: unknown) => {
        if (axios.isCancel(error)) return;
        console.error(error);
        setLoaded(true);
      });
    return () => controller.abort();
  }, []);

  const dayOrder = useMemo(() => {
    const order: string[] = [];
    const seen = new Set<string>();
    for (const item of items) {
      if (!seen.has(item.dayLabel)) {
        seen.add(item.dayLabel);
        order.push(item.dayLabel);
      }
    }
    return order;
  }, [items]);

  const columns = useMemo(
    () =>
      TRACKS.map(({ track }) => {
        const byTrack = items.filter((item) => item.track === track);
        return {
          track,
          days: groupScheduleByDay(byTrack).sort(
            (a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day),
          ),
        };
      }),
    [items, dayOrder],
  );

  const hasAny = items.length > 0;

  return (
    <section className="schedule section-wrap" id="schedule">
      <div className="section-kicker">PLAN YOUR DAYS</div>
      <div className="schedule-heading">
        <div>
          <CalendarDays size={25} />
          <h2>
            The schedule,
            <br />
            <span>day by day.</span>
          </h2>
        </div>
        <p>
          Two calendars, one celebration &mdash; the rituals of the puja on one
          side, the stage and the performances on the other. Pick a day and
          follow both.
        </p>
      </div>

      {!loaded ? null : !hasAny ? (
        <p className="schedule-empty">
          The full programme will be announced soon. Check back closer to the
          puja.
        </p>
      ) : (
        <div className="schedule-grid">
          {columns.map(({ track, days }, columnIndex) => {
            const config = TRACKS.find((entry) => entry.track === track)!;
            const Icon = config.icon;
            return (
              <motion.article
                className={`schedule-board schedule-board-${track}`}
                key={track}
                custom={columnIndex}
                initial={shouldReduceMotion ? false : "hidden"}
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={cardVariants}
              >
                <header className="schedule-board-head">
                  <span className="schedule-board-icon">
                    <Icon size={20} />
                  </span>
                  <div>
                    <h3>{config.title}</h3>
                    <p>{config.blurb}</p>
                  </div>
                </header>
                {days.length === 0 ? (
                  <p className="schedule-empty schedule-empty-inline">
                    Programme to be announced.
                  </p>
                ) : (
                  days.map(({ day, items: dayItems }) => (
                    <div className="schedule-day" key={day}>
                      <h4>{day}</h4>
                      <ul>
                        {dayItems.map((item) => (
                          <li key={item.id}>
                            <span className="schedule-event-title">
                              {item.title}
                            </span>
                            <span className="schedule-event-time">
                              {item.timeLabel}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}
              </motion.article>
            );
          })}
        </div>
      )}
    </section>
  );
}