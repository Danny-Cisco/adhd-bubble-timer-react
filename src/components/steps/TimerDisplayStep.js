import React, { useState, useEffect } from "react";
import ThreeBubbles from "../visualizations/ThreeBubbles";
import { formatDateSimple } from "../../utils/dateHelpers";
import "./TimerDisplayStep.css";

const TimerDisplayStep = ({
  taskData,
  onReset,
  showNotification,
  startTime,
  endTime,
}) => {
  // State
  const [timeDisplay, setTimeDisplay] = useState("00:00:00");
  const [totalBubbles, setTotalBubbles] = useState(0);
  const [bubblesPopped, setBubblesPopped] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [localStartTime, setLocalStartTime] = useState(startTime || new Date());
  const [localEndTime, setLocalEndTime] = useState(endTime || null);

  // Setup timer and calculations on component mount
  useEffect(() => {
    // Set the local times from props if available
    if (startTime) setLocalStartTime(startTime);
    if (endTime) setLocalEndTime(endTime);

    // If endTime is not provided, calculate it
    if (!endTime && taskData.taskDateTime) {
      // Calculate when to start getting ready
      const totalLeadTime =
        taskData.prepTime +
        taskData.travelTime +
        taskData.earlyTime +
        taskData.bufferTime;

      const start = new Date();
      const end = new Date(taskData.taskDateTime.getTime() - totalLeadTime);

      setLocalStartTime(start);
      setLocalEndTime(end);
    }

    // Only proceed if we have both start and end times
    if (!localStartTime || !localEndTime) return;

    // Calculate number of 30-minute bubbles
    const timeRemaining = localEndTime.getTime() - localStartTime.getTime();
    const thirtyMinInMs = 30 * 60 * 1000;
    const bubbles = Math.max(1, Math.ceil(timeRemaining / thirtyMinInMs));

    setTotalBubbles(bubbles);

    // Start the timer
    const timerInterval = setInterval(() => {
      const now = new Date();
      const timeLeft = localEndTime.getTime() - now.getTime();

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
  }, [
    taskData,
    showNotification,
    totalBubbles,
    bubblesPopped,
    startTime,
    endTime,
    localStartTime,
    localEndTime,
  ]);

  return (
    <div className="step timer-display-step">
      <div className="time-display">{timeDisplay}</div>

      {/* Three.js Bubble Visualization */}
      <ThreeBubbles
        totalBubbles={totalBubbles}
        bubblesPopped={bubblesPopped}
        isTimeUp={isTimeUp}
        startTime={localStartTime}
        endTime={localEndTime}
      />

      <button onClick={onReset} className="reset-button">
        Reset
      </button>
    </div>
  );
};

export default TimerDisplayStep;
