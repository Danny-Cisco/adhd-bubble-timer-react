import React from "react";
import "./ThreeBubbles.css";

const SingleBubble = ({ number, isPopped = false, isTimeUp = false }) => {
  return (
    <div
      className={`bubble ${isPopped ? "popped" : ""} ${
        isTimeUp ? "time-up" : ""
      }`}
    >
      <div className="bubble-inner">
        <div className="bubble-reflection"></div>
        <span className="bubble-number">{number}</span>
      </div>
    </div>
  );
};

export default SingleBubble;
