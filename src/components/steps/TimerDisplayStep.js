import React, { useState, useEffect } from "react";
import ThreeBubbles from "../visualizations/ThreeBubbles";
import { formatDateSimple } from "../../utils/dateHelpers";
import "./TimerDisplayStep.css";

const TimerDisplayStep = ({ taskData, onReset, showNotification }) => {
  // State
  const [timeDisplay, setTimeDisplay] = useState("00:00:00");
  const [totalBubbles, setTotalBubbles] = useState(0);
  const [bubblesPopped, setBubblesPopped] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Setup timer and calculations on component mount
  useEffect(() => {
    // Calculate when to start getting ready
    const totalLeadTime =
      taskData.prepTime +
      taskData.travelTime +
      taskData.earlyTime +
      taskData.bufferTime;

    const start = new Date();
    const end = new Date(taskData.taskDateTime.getTime() - totalLeadTime);

    setStartTime(start);
    setEndTime(end);

    // Calculate number of 30-minute bubbles
    const timeRemaining = end.getTime() - start.getTime();
    const thirtyMinInMs = 30 * 60 * 1000;
    const bubbles = Math.max(1, Math.ceil(timeRemaining / thirtyMinInMs));

    setTotalBubbles(bubbles);

    // Start the timer
    const timerInterval = setInterval(() => {
      const now = new Date();
      const timeLeft = end.getTime() - now.getTime();

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        setTimeDisplay("00:00:00");
        setIsTimeUp(true);
        document.body.style.backgroundColor = "#ffe6e6";
        showNotification(
          `⏰ Time's up! Start preparing for: ${taskData.taskName}`
        );
        setBubblesPopped(totalBubbles);
        return;
      }

      // Update time display
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      setTimeDisplay(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );

      // Check and pop bubbles
      const bubblesRemaining = Math.ceil(timeLeft / thirtyMinInMs);
      const newBubblesPopped = totalBubbles - bubblesRemaining;

      if (newBubblesPopped > bubblesPopped) {
        setBubblesPopped(newBubblesPopped);
        showNotification(
          `🫧 Bubble popped! ${bubblesRemaining} out of ${totalBubbles} bubbles remaining.`
        );
      }
    }, 1000);

    // Cleanup
    return () => {
      clearInterval(timerInterval);
      document.body.style.backgroundColor = "#f0f8ff";
    };
  }, [taskData, showNotification]);

  return (
    <div className="step timer-display-step">
      <h2>Time Remaining</h2>

      <div className="time-info">
        <p>
          <strong>Task:</strong> <span>{taskData.taskName}</span>
        </p>
        <p>
          <strong>Due:</strong>
          <span>{formatDateSimple(taskData.taskDateTime)}</span>
        </p>
        <p>
          <strong>Start Preparing:</strong>
          <span>{endTime ? formatDateSimple(endTime) : "--"}</span>
        </p>
      </div>

      <div className="time-display">{timeDisplay}</div>

      {/* Three.js Bubble Visualization */}
      <ThreeBubbles
        totalBubbles={totalBubbles}
        bubblesPopped={bubblesPopped}
        isTimeUp={isTimeUp}
      />

      <button onClick={onReset} className="reset-button">
        Reset
      </button>
    </div>
  );
};

export default TimerDisplayStep;
