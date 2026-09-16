"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import DurgaPujaCountdown from "./ui/DurgaPujaCountdown";
import SplitText from "@/components/ui/splitText";
import type { HomeCountdownDto } from "@/types/types";

function Countdowntimer() {
  const [targetAt, setTargetAt] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get<{ data: HomeCountdownDto | null }>("/api/countdown", {
        signal: controller.signal,
      })
      .then((response) => {
        if (response.data.data?.targetAt) {
          setTargetAt(response.data.data.targetAt);
        }
      })
      .catch((error: unknown) => {
        if (!axios.isCancel(error)) console.error(error);
      });

    return () => controller.abort();
  }, []);

  if (!targetAt) return null;

  /** A gentle, formal rise-and-fade reveal for supporting copy. */
  const reveal = (delay = 0) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: 16 },
    whileInView: shouldReduceMotion ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.6 },
    transition: { duration: 0.7, delay, ease: "easeOut" as const },
  });

  return (
    <section className="countdown-section">
      <div className="countdown-copy">
        <motion.p className="eyebrow mb-2.5" {...reveal(0)}>
          The next chapter begins
        </motion.p>
        <h2>
          <SplitText
            tag="span"
            text="Countdown to the Grand"
            splitType="words"
            delay={75}
            duration={0.85}
            ease="power3.out"
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.2}
            rootMargin="-60px"
            textAlign="left"
          />
          <br />
          <i>
            <SplitText
              tag="span"
              text="Celebration"
              splitType="chars"
              delay={45}
              duration={0.8}
              ease="power3.out"
              from={{ opacity: 0, y: 26 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.2}
              rootMargin="-60px"
              textAlign="left"
            />
          </i>
        </h2>
        <motion.p className="mt-2.5" {...reveal(0.2)}>
          Mark your calendar. Maa is coming home to PBCA.
        </motion.p>
      </div>
      <DurgaPujaCountdown
        targetDate={targetAt}
        // heading="Countdown to the Grand Celebration"
      />
    </section>
  );
}

export default Countdowntimer;
