import React from "react";
import ThreeBubbles from "../visualizations/ThreeBubbles"; // Import the ThreeBubbles component
import "./WelcomeStep.css";

const WelcomeStep = ({ onNext }) => {
  // Static demo values for the bubbles
  const demoTotalBubbles = 3; // Show 3 bubbles as a demo
  const demoBubblesPopped = 0; // Pop 1 bubble for visual effect
  const demoStartTime = new Date(); // Current time as start
  const demoEndTime = new Date(demoStartTime.getTime() + 90 * 60 * 1000); // 90 minutes later

  return (
    <div className="step welcome-step">
      <h2>Welcome!</h2>
      <h2>Visualise time in 30 minute 'bubbles'</h2>

      {/* Add demo bubbles visualization */}
      <div className="demo-bubbles">
        <ThreeBubbles
          totalBubbles={demoTotalBubbles}
          bubblesPopped={demoBubblesPopped}
          isTimeUp={false} // No time-up state for demo
          startTime={demoStartTime}
          endTime={demoEndTime}
        />
      </div>

      <button onClick={onNext}>Let's Begin</button>
    </div>
  );
};

export default WelcomeStep;
