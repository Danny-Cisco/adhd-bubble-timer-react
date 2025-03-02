import React, { useState } from "react";
import "./TravelTimeStep.css";

const TravelTimeStep = ({ travelTime, onNext, updateTaskData }) => {
  // Convert milliseconds to hours and minutes
  const msToTime = (ms) => {
    const totalMinutes = Math.floor(ms / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
  };

  const timeObj = msToTime(travelTime || 20 * 60 * 1000);

  const [hours, setHours] = useState(timeObj.hours);
  const [minutes, setMinutes] = useState(timeObj.minutes);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert hours and minutes to milliseconds
    const totalMs =
      parseInt(hours) * 60 * 60 * 1000 + parseInt(minutes) * 60 * 1000;

    updateTaskData({ travelTime: totalMs });
    onNext();
  };

  return (
    <div className="step travel-time-step">
      <h2>How long will it take to travel there?</h2>

      <form onSubmit={handleSubmit}>
        <div className="time-inputs">
          <div className="form-group">
            <label htmlFor="travelHours">Hours:</label>
            <input
              type="number"
              id="travelHours"
              min="0"
              max="24"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="travelMinutes">Minutes:</label>
            <input
              type="number"
              id="travelMinutes"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
            />
          </div>
        </div>

        <button type="submit">Next</button>
      </form>
    </div>
  );
};

export default TravelTimeStep;
