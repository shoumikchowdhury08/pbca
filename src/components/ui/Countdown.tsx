"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { readApiData } from "@/lib/http";

export default function Countdown() {
  const [target, setTarget] = useState<number | null>(null);
  const [left, setLeft] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    readApiData<{ targetAt: string } | null>(
      axios.get("/api/countdown", { signal: controller.signal }),
      "Unable to load countdown.",
    )
      .then((data) => {
        if (data?.targetAt) setTarget(new Date(data.targetAt).getTime());
      })
      .catch((error: unknown) => {
        if (!axios.isCancel(error)) console.error(error);
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    setMounted(true);
    if (target === null) {
      setLeft(0);
      return;
    }

    const update = () => setLeft(Math.max(0, target - Date.now()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [target]);

  const displayLeft = mounted ? left : 0;
  const units = [
    { label: "Days", value: Math.max(0, Math.floor(displayLeft / 86400000)) },
    {
      label: "Hours",
      value: Math.max(0, Math.floor(displayLeft / 3600000) % 24),
    },
    {
      label: "Minutes",
      value: Math.max(0, Math.floor(displayLeft / 60000) % 60),
    },
    {
      label: "Seconds",
      value: Math.max(0, Math.floor(displayLeft / 1000) % 60),
    },
  ];
  return (
    <div className="countdown-grid">
      {units.map((unit) => (
        <div className="sandglass" key={unit.label}>
          <div className="glass">
            <span className="sand top" />
            <span className="sand bottom" />
            <span className="sand stream" />
          </div>
          <strong>{String(unit.value).padStart(2, "0")}</strong>
          <small>{unit.label}</small>
        </div>
      ))}
    </div>
  );
}
