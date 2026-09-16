import React, { useEffect, useRef, useState } from "react";

/**
 * DurgaPujaCountdown
 * ---------------------------------------------------------------------------
 * A reusable, dependency-free countdown timer component.
 *
 * Usage:
 *   <DurgaPujaCountdown targetDate="2026-10-17T00:00:00+05:30" />
 *
 * See the accompanying README section (in the chat response) for setup,
 * import, and customization instructions.
 */

export interface DurgaPujaCountdownProps {
  /** ISO 8601 date string (include a timezone offset, e.g. +05:30) */
  targetDate: string;
  /** Heading text shown above the countdown. Defaults to "Durga Puja Begins In" */
  heading?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

const MS_IN_SECOND = 1000;
const MS_IN_MINUTE = MS_IN_SECOND * 60;
const MS_IN_HOUR = MS_IN_MINUTE * 60;
const MS_IN_DAY = MS_IN_HOUR * 24;

/** Calculates the remaining days/hours/minutes/seconds until targetDate. */
function getTimeRemaining(targetDate: string): TimeRemaining {
  const total = new Date(targetDate).getTime() - Date.now();

  if (Number.isNaN(total) || total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
  }

  return {
    days: Math.floor(total / MS_IN_DAY),
    hours: Math.floor((total % MS_IN_DAY) / MS_IN_HOUR),
    minutes: Math.floor((total % MS_IN_HOUR) / MS_IN_MINUTE),
    seconds: Math.floor((total % MS_IN_MINUTE) / MS_IN_SECOND),
    isComplete: false,
  };
}

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

/** A single countdown card: number, label, and animated circular progress ring. */
interface CountdownCardProps {
  value: number;
  max: number;
  label: string;
}

const RING_RADIUS = 54;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const CountdownCard: React.FC<CountdownCardProps> = ({ value, max, label }) => {
  const previousValue = useRef(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (previousValue.current !== value) {
      setIsFlipping(true);
      previousValue.current = value;
      const timeout = setTimeout(() => setIsFlipping(false), 420);
      return () => clearTimeout(timeout);
    }
  }, [value]);

  const fraction = max > 0 ? Math.min(Math.max(value / max, 0), 1) : 0;
  const dashOffset = RING_CIRCUMFERENCE * (1 - fraction);

  return (
    <div className="dpc-card">
      <div className="dpc-ring-wrapper">
        <svg
          className="dpc-ring"
          viewBox="0 0 120 120"
          role="img"
          aria-hidden="true"
        >
          <circle className="dpc-ring-track" cx="60" cy="60" r={RING_RADIUS} />
          <circle
            className="dpc-ring-progress"
            cx="60"
            cy="60"
            r={RING_RADIUS}
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className={`dpc-number ${isFlipping ? "dpc-number--flip" : ""}`}>
          {pad(value)}
        </div>
      </div>
      <div className="dpc-label">{label}</div>
    </div>
  );
};

const DurgaPujaCountdown: React.FC<DurgaPujaCountdownProps> = ({
  targetDate,
  heading = "Durga Puja Begins In",
}) => {
  const [time, setTime] = useState<TimeRemaining>(() =>
    getTimeRemaining(targetDate),
  );
  const [initialDays, setInitialDays] = useState<number>(() => {
    const initial = getTimeRemaining(targetDate);
    return initial.days > 0 ? initial.days : 1;
  });
  const [trackedTarget, setTrackedTarget] = useState(targetDate);

  // Adjust state when the target date prop changes, following the React
  // "adjusting state when a prop changes" pattern so the days ring depletes
  // correctly across the new countdown span.
  if (trackedTarget !== targetDate) {
    const initial = getTimeRemaining(targetDate);
    setTrackedTarget(targetDate);
    setInitialDays(initial.days > 0 ? initial.days : 1);
    setTime(initial);
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(getTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetDate]);

  return (
    <div className="dpc-container">
      {/* <div className="dpc-bg-motif" aria-hidden="true">
        <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
          <circle className="dpc-motif-eye-outer" cx="120" cy="90" r="70" />
          <circle className="dpc-motif-eye-inner" cx="120" cy="90" r="26" />
          <path
            className="dpc-motif-lotus"
            d="M680 480 C650 420, 700 380, 680 320 C740 350, 760 410, 720 460 C760 450, 790 480, 780 520 C740 500, 700 520, 680 480 Z"
          />
          <path
            className="dpc-motif-vine"
            d="M-20 560 C 150 500, 250 620, 420 540 S 700 480, 860 560"
          />
        </svg>
      </div> */}

      <div className="dpc-content">
        {/* <h2 className="dpc-heading">{heading}</h2> */}
        <div className="dpc-divider" aria-hidden="true">
          <span className="dpc-divider-line" />
          <span className="dpc-divider-glyph">&#10022;</span>
          <span className="dpc-divider-line" />
        </div>

        <div className="dpc-grid">
          <CountdownCard value={time.days} max={initialDays} label="Days" />
          <CountdownCard value={time.hours} max={24} label="Hours" />
          <CountdownCard value={time.minutes} max={60} label="Minutes" />
          <CountdownCard value={time.seconds} max={60} label="Seconds" />
        </div>

        {time.isComplete && (
          <p className="dpc-complete-message">Shubho Durga Puja!</p>
        )}
      </div>
    </div>
  );
};

export default DurgaPujaCountdown;
