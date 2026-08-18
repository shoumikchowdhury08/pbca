"use client";

import { useEffect, useState } from "react";

export default function Countdown() {
  const target = new Date("2026-10-17T00:00:00+05:30").getTime();
  const [left, setLeft] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
