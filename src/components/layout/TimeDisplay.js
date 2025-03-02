import React from "react";
import "./TimeDisplay.css";

// Helper function to format time
const formatTime = (date) => {
  if (!date) return "--:--";

  const hours = date.getHours() % 12 || 12;
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "PM" : "AM";

  return `${hours}:${minutes} ${ampm}`;
};

// Helper function to format a time duration in minutes
const formatDuration = (milliseconds) => {
  if (!milliseconds) return "";

  const minutes = Math.floor(milliseconds / (1000 * 60));
  return `${minutes} min`;
};

const TimeDisplay = ({
  deadline,
  startTime,
  confirmedComponents,
  taskName,
}) => {
  // Ensure we have a deadline
  if (!deadline) return null;

  // Calculate total preparation time
  const totalPrepTime = Object.values(confirmedComponents).reduce(
    (sum, time) => sum + time,
    0
  );

  // Individual component times (for display)
  const { prepTime, travelTime, earlyTime, bufferTime } = confirmedComponents;

  return (
    <div className="time-display-container">
      <div className="deadline-display">
        <h2>
          Task Deadline: <span className="time">{formatTime(deadline)}</span>
        </h2>
        {taskName && <div className="task-name">{taskName}</div>}
      </div>

      <div className="time-breakdown">
        {totalPrepTime > 0 && (
          <div className="prep-timeline">
            {/* Visual timeline */}
            <div className="timeline">
              <div className="timeline-start">
                {startTime ? formatTime(startTime) : "--:--"}
              </div>
              <div className="timeline-line">
                {bufferTime > 0 && (
                  <div
                    className="timeline-segment buffer-time"
                    style={{ flex: bufferTime }}
                  >
                    <span className="segment-label">
                      Buffer {formatDuration(bufferTime)}
                    </span>
                  </div>
                )}
                {earlyTime > 0 && (
                  <div
                    className="timeline-segment early-time"
                    style={{ flex: earlyTime }}
                  >
                    <span className="segment-label">
                      Early {formatDuration(earlyTime)}
                    </span>
                  </div>
                )}
                {travelTime > 0 && (
                  <div
                    className="timeline-segment travel-time"
                    style={{ flex: travelTime }}
                  >
                    <span className="segment-label">
                      Travel {formatDuration(travelTime)}
                    </span>
                  </div>
                )}
                {prepTime > 0 && (
                  <div
                    className="timeline-segment prep-time"
                    style={{ flex: prepTime }}
                  >
                    <span className="segment-label">
                      Prep {formatDuration(prepTime)}
                    </span>
                  </div>
                )}
              </div>
              <div className="timeline-end">{formatTime(deadline)}</div>
            </div>

            {/* Start time callout */}
            {startTime && (
              <div className="start-time-callout">
                <span className="label">Start preparing at:</span>
                <span className="time">{formatTime(startTime)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeDisplay;
