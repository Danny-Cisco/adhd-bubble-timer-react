import React, { useState, useEffect } from "react";
import "./TaskInputStep.css";

const TaskInputStep = ({
  taskName,
  onNext,
  updateTaskData,
  showNotification,
}) => {
  const [inputValue, setInputValue] = useState(taskName || "");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (inputValue.trim()) {
      updateTaskData({ taskName: inputValue.trim() });
      onNext();
    } else {
      showNotification("Please enter what you need to do next.");
    }
  };

  return (
    <div className="step task-input-step">
      <h2>What do you need to do next?</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="e.g., Doctor's appointment, Meeting, Picking up kids..."
          autoFocus
        />

        <button type="submit">Next</button>
      </form>
    </div>
  );
};

export default TaskInputStep;
