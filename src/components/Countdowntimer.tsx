import React from "react";
import Countdown from "./ui/Countdown";

function Countdowntimer() {
  return (
    <section className="countdown-section">
      <div className="countdown-copy">
        <p className="eyebrow">The next chapter begins</p>
        <h2>
          Until we meet
          <br />
          <i>again.</i>
        </h2>
        <p>Mark your calendar. Maa is coming home to PBCA.</p>
      </div>
      <Countdown />
    </section>
  );
}

export default Countdowntimer;
