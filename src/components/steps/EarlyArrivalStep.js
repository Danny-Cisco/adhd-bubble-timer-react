import React, { useState } from "react";
import "./EarlyArrivalStep.css";

const EarlyArrivalStep = ({ earlyTime, onNext, updateTaskData }) => {
  // Convert milliseconds to minutes
  const msToMinutes = (ms) => {
    return Math.floor(ms / (1000 * 60));
  };

  const [minutes, setMinutes] = useState(
    msToMinutes(earlyTime || 10 * 60 * 1000)
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert minutes to milliseconds
    const totalMs = parseInt(minutes) * 60 * 1000;

    updateTaskData({ earlyTime: totalMs });
    onNext();
  };

  return (
    <div className="step early-arrival-step">
      <h2>How early would you like to arrive?</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="earlyMinutes">Minutes:</label>
          <input
            type="number"
            id="earlyMinutes"
            min="0"
            max="120"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
          />
        </div>

        <button type="submit">Next</button>
      </form>
    </div>
  );
};

export default EarlyArrivalStep;
