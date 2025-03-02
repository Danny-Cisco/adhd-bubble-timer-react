import React from "react";
import "./ThreeBubbles.css";
import SingleBubble from "./SingleBubble";

const ThreeBubbles = ({
  totalBubbles = 5,
  bubblesPopped = 0,
  isTimeUp = false,
}) => {
  // Create an array of bubbles
  const bubbles = Array.from({ length: totalBubbles }, (_, index) => {
    const bubbleNumber = index + 1;
    const isPopped = index < bubblesPopped;

    return (
      <SingleBubble
        key={bubbleNumber}
        number={bubbleNumber}
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
