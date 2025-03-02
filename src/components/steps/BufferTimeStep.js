import React, { useState } from "react";
import "./BufferTimeStep.css";

const BufferTimeStep = ({ bufferTime, onNext, updateTaskData }) => {
  // Convert milliseconds to minutes
  const msToMinutes = (ms) => {
    return Math.floor(ms / (1000 * 60));
  };

  const [needsBuffer, setNeedsBuffer] = useState("yes");
  const [minutes, setMinutes] = useState(
    msToMinutes(bufferTime || 15 * 60 * 1000)
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert minutes to milliseconds or set to 0 if no buffer needed
    const totalMs = needsBuffer === "yes" ? parseInt(minutes) * 60 * 1000 : 0;

    updateTaskData({ bufferTime: totalMs });
    onNext();
  };

  return (
    <div className="step buffer-time-step">
      <h2>Should I allow extra time as a buffer?</h2>

      <form onSubmit={handleSubmit}>
        <div className="select-container">
          <select
            value={needsBuffer}
            onChange={(e) => setNeedsBuffer(e.target.value)}
          >
            <option value="yes">Yes, add a buffer</option>
            <option value="no">No buffer needed</option>
          </select>
        </div>

        {needsBuffer === "yes" && (
          <div className="form-group buffer-time-container">
            <label htmlFor="bufferMinutes">Buffer time (minutes):</label>
            <input
              type="number"
              id="bufferMinutes"
              min="0"
              max="120"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
            />
          </div>
        )}

        <button type="submit">Start My Timer</button>
      </form>
    </div>
  );
};

export default BufferTimeStep;
