import React, { useState } from "react";
import "./PrepNeededStep.css";

const PrepNeededStep = ({ onNext }) => {
  const [needsPrep, setNeedsPrep] = useState("yes");

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(needsPrep === "yes");
  };

  return (
    <div className="step prep-needed-step">
      <h2>Is there anything else you need to do before that?</h2>

      <form onSubmit={handleSubmit}>
        <div className="select-container">
          <select
            value={needsPrep}
            onChange={(e) => setNeedsPrep(e.target.value)}
          >
            <option value="yes">Yes, I need to prepare</option>
            <option value="no">No, I'm ready to go</option>
          </select>
        </div>

        <button type="submit">Next</button>
      </form>
    </div>
  );
};

export default PrepNeededStep;
