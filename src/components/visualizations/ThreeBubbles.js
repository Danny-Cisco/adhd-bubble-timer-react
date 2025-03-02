import React, { useMemo } from "react";
import "./ThreeBubbles.css";
import SingleBubble from "./SingleBubble";

const ThreeBubbles = ({
  totalBubbles = 5,
  bubblesPopped = 0,
  isTimeUp = false,
  startTime,
  endTime,
}) => {
  // Calculate pop times for each bubble
  const bubblePopTimes = useMemo(() => {
    if (!startTime || !endTime) return Array(totalBubbles).fill(null);

    const totalDuration = endTime.getTime() - startTime.getTime();
    const intervalMs = totalDuration / totalBubbles;

    return Array.from({ length: totalBubbles }, (_, index) => {
      // Calculate pop time for this bubble (they pop in reverse order, from last to first)
      const reverseIndex = totalBubbles - index - 1;
      const popTimeMs = startTime.getTime() + intervalMs * (reverseIndex + 1);
      return new Date(popTimeMs);
    });
  }, [totalBubbles, startTime, endTime]);

  // Create an array of bubbles
  const bubbles = Array.from({ length: totalBubbles }, (_, index) => {
    const bubbleNumber = index + 1;
    const isPopped = index < bubblesPopped;
    const popTime = bubblePopTimes[index];

    // Format time as 12-hour format (h:mm AM/PM) for display
    let timeLabel = bubbleNumber.toString();
    if (popTime) {
      let hours = popTime.getHours();
      const minutes = popTime.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      timeLabel = `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
    }

    return (
      <SingleBubble
        key={bubbleNumber}
        number={bubbleNumber}
        label={timeLabel}
        isPopped={isPopped}
        isTimeUp={isTimeUp}
      />
    );
  });

  return (
    <div className={`bubbles-container ${isTimeUp ? "time-up" : ""}`}>
      {bubbles}
    </div>
  );
};

export default ThreeBubbles;
