import React, { useState, useEffect } from "react";
import "./DateTimeStep.css";

const DateTimeStep = ({
  taskDateTime,
  onNext,
  updateTaskData,
  showNotification,
}) => {
  // Set initial values
  const today = new Date();
  const twoHoursLater = new Date(today.getTime() + 2 * 60 * 60 * 1000);

  // Initialize state with previous values or defaults
  const [date, setDate] = useState(
    taskDateTime
      ? taskDateTime.toISOString().split("T")[0]
      : today.toISOString().split("T")[0]
  );

  const [time, setTime] = useState(
    taskDateTime
      ? `${taskDateTime.getHours().toString().padStart(2, "0")}:${taskDateTime
          .getMinutes()
          .toString()
          .padStart(2, "0")}`
      : `${twoHoursLater.getHours().toString().padStart(2, "0")}:${twoHoursLater
          .getMinutes()
          .toString()
          .padStart(2, "0")}`
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (date && time) {
      const dateTimeObj = new Date(`${date}T${time}`);

      if (dateTimeObj > new Date()) {
        updateTaskData({ taskDateTime: dateTimeObj });
        onNext();
      } else {
        showNotification("Please select a future date and time.");
      }
    } else {
      showNotification("Please select both date and time.");
    }
  };

  return (
    <div className="step date-time-step">
      <h2>When does this need to be done?</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="taskDate">Date:</label>
          <input
            type="date"
            id="taskDate"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="taskTime">Time:</label>
          <input
            type="time"
            id="taskTime"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>

        <button type="submit">Next</button>
      </form>
    </div>
  );
};

export default DateTimeStep;
