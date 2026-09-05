import React from "react";
import Countdown from "./ui/Countdown";

function Countdowntimer() {
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
      <Countdown />
    </section>
  );
}

export default Countdowntimer;
