"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import DurgaPujaCountdown from "./ui/DurgaPujaCountdown";
import type { HomeCountdownDto } from "@/types/types";

function Countdowntimer() {
  const [targetAt, setTargetAt] = useState<string | null>(null);

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

  return (
    <section className="countdown-section">
      <div className="countdown-copy">
        <p className="eyebrow mb-2.5">The next chapter begins</p>
        <h2>
          Countdown to the Grand
          <br />
          <i>Celebration</i>
        </h2>
        <p className="mt-2.5">
          Mark your calendar. Maa is coming home to PBCA.
        </p>
      </div>
      <DurgaPujaCountdown
        targetDate={targetAt}
        // heading="Countdown to the Grand Celebration"
      />
    </section>
  );
}

export default Countdowntimer;
