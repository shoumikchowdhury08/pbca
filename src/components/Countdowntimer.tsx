"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import DurgaPujaCountdown from "./ui/DurgaPujaCountdown";
import SplitText from "@/components/ui/splitText";
import type { HomeCountdownDto } from "@/types/types";

function Countdowntimer() {
  const [targetAt, setTargetAt] = useState<string | null>(null);
  const [countdownComplete, setCountdownComplete] = useState(false);

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

  useEffect(() => {
    if (!targetAt) return;

    const updateCompletion = () => {
      setCountdownComplete(Date.now() >= new Date(targetAt).getTime());
    };
    updateCompletion();
    const intervalId = window.setInterval(updateCompletion, 1000);
    return () => window.clearInterval(intervalId);
  }, [targetAt]);

  if (!targetAt) return null;

  return (
    <section
      className={`countdown-section${
        countdownComplete ? " countdown-section-complete" : ""
      }`}
    >
      <div className="countdown-copy">
        {!countdownComplete && (
          <p className="eyebrow mb-2.5">The next chapter begins</p>
        )}
        <h2>
          {countdownComplete ? (
            <>
              <div className="countdown-complete-title">
                Let The Celebrations
                <i>Begin !</i>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </h2>
        {!countdownComplete && (
          <p className="mt-2.5">
            Mark your calendar. Maa is coming home to PBCA.
          </p>
        )}
      </div>
      {!countdownComplete && <DurgaPujaCountdown targetDate={targetAt} />}
    </section>
  );
}

export default Countdowntimer;
