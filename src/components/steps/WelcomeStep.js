import React from "react";
import "./WelcomeStep.css";

const WelcomeStep = ({ onNext }) => {
  return (
    <div className="step welcome-step">
      <h2>Welcome!</h2>
      <p>
        This app helps visualize how much time you have before you need to start
        getting ready for your next activity. It's designed for people with ADHD
        who struggle with time perception.
      </p>
      <p>
        Time will be shown as floating bubbles, each representing 30 minutes. As
        time passes, the bubbles will pop one by one to help you visually track
        the remaining time.
      </p>
      <button onClick={onNext}>Let's Begin</button>
    </div>
  );
};

export default WelcomeStep;
