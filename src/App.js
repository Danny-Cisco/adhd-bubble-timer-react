import React, { useState, useEffect } from "react";
import "./App.css";
import ProgressBar from "./components/layout/ProgressBar";
import NotificationSystem from "./components/layout/NotificationSystem";
import TimeDisplay from "./components/layout/TimeDisplay";
import WelcomeStep from "./components/steps/WelcomeStep";
import TaskInputStep from "./components/steps/TaskInputStep";
import DateTimeStep from "./components/steps/DateTimeStep";
import PrepNeededStep from "./components/steps/PrepNeededStep";
import PrepTimeStep from "./components/steps/PrepTimeStep";
import TravelTimeStep from "./components/steps/TravelTimeStep";
import EarlyArrivalStep from "./components/steps/EarlyArrivalStep";
import BufferTimeStep from "./components/steps/BufferTimeStep";
import TimerDisplayStep from "./components/steps/TimerDisplayStep";

function App() {
  const TOTAL_STEPS = 9;

  // State
  const [currentStep, setCurrentStep] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const [taskData, setTaskData] = useState({
    taskName: "",
    taskDateTime: null,
    prepTime: 15 * 60 * 1000, // Default 15 minutes in ms
    travelTime: 20 * 60 * 1000, // Default 20 minutes in ms
    earlyTime: 10 * 60 * 1000, // Default 10 minutes in ms
    bufferTime: 15 * 60 * 1000, // Default 15 minutes in ms
  });

  // Track which time components have been confirmed/added
  const [confirmedTimeComponents, setConfirmedTimeComponents] = useState({
    prepTime: false,
    travelTime: false,
    earlyTime: false,
    bufferTime: false,
  });

  // Helper functions
  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  };

  const goToStep = (step) => {
    setCurrentStep(Math.min(Math.max(1, step), TOTAL_STEPS));
  };

  const resetApp = () => {
    setCurrentStep(1);
    setTaskData({
      taskName: "",
      taskDateTime: null,
      prepTime: 15 * 60 * 1000,
      travelTime: 20 * 60 * 1000,
      earlyTime: 10 * 60 * 1000,
      bufferTime: 15 * 60 * 1000,
    });
    setConfirmedTimeComponents({
      prepTime: false,
      travelTime: false,
      earlyTime: false,
      bufferTime: false,
    });
  };

  const updateTaskData = (newData) => {
    setTaskData((prev) => ({ ...prev, ...newData }));
  };

  // Function to mark a time component as confirmed
  const confirmTimeComponent = (componentName) => {
    setConfirmedTimeComponents((prev) => ({
      ...prev,
      [componentName]: true,
    }));
  };

  const showNotification = (message) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message }]);

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
    }, 5000);
  };

  // Calculate start time based on confirmed components
  const calculateStartTime = () => {
    if (!taskData.taskDateTime) return null;

    let totalTimeToSubtract = 0;

    if (confirmedTimeComponents.prepTime) {
      totalTimeToSubtract += taskData.prepTime;
    }

    if (confirmedTimeComponents.travelTime) {
      totalTimeToSubtract += taskData.travelTime;
    }

    if (confirmedTimeComponents.earlyTime) {
      totalTimeToSubtract += taskData.earlyTime;
    }

    if (confirmedTimeComponents.bufferTime) {
      totalTimeToSubtract += taskData.bufferTime;
    }

    return new Date(taskData.taskDateTime.getTime() - totalTimeToSubtract);
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep onNext={goToNextStep} />;
      case 2:
        return (
          <TaskInputStep
            taskName={taskData.taskName}
            onNext={goToNextStep}
            updateTaskData={updateTaskData}
            showNotification={showNotification}
          />
        );
      case 3:
        return (
          <DateTimeStep
            taskDateTime={taskData.taskDateTime}
            onNext={goToNextStep}
            updateTaskData={updateTaskData}
            showNotification={showNotification}
          />
        );
      case 4:
        return (
          <PrepNeededStep
            onNext={(needsPrep) => {
              if (!needsPrep) {
                updateTaskData({ prepTime: 0 });
                confirmTimeComponent("prepTime");
                goToStep(6); // Skip prep time step
              } else {
                goToNextStep();
              }
            }}
          />
        );
      case 5:
        return (
          <PrepTimeStep
            prepTime={taskData.prepTime}
            onNext={() => {
              confirmTimeComponent("prepTime");
              goToNextStep();
            }}
            updateTaskData={updateTaskData}
          />
        );
      case 6:
        return (
          <TravelTimeStep
            travelTime={taskData.travelTime}
            onNext={() => {
              confirmTimeComponent("travelTime");
              goToNextStep();
            }}
            updateTaskData={updateTaskData}
          />
        );
      case 7:
        return (
          <EarlyArrivalStep
            earlyTime={taskData.earlyTime}
            onNext={() => {
              confirmTimeComponent("earlyTime");
              goToNextStep();
            }}
            updateTaskData={updateTaskData}
          />
        );
      case 8:
        return (
          <BufferTimeStep
            bufferTime={taskData.bufferTime}
            onNext={() => {
              confirmTimeComponent("bufferTime");
              goToNextStep();
            }}
            updateTaskData={updateTaskData}
          />
        );
      case 9:
        return (
          <TimerDisplayStep
            taskData={taskData}
            onReset={resetApp}
            showNotification={showNotification}
            startTime={new Date()}
            endTime={calculateStartTime()}
          />
        );
      default:
        return <WelcomeStep onNext={goToNextStep} />;
    }
  };

  // Show TimeDisplay only after step 3 (when we have a deadline)
  const showTimeDisplay = currentStep > 3 && taskData.taskDateTime;

  return (
    <div className="app-container">
      <div className="container">
        <h1>ADHD Time Bubbles</h1>

        {showTimeDisplay && (
          <TimeDisplay
            deadline={taskData.taskDateTime}
            startTime={calculateStartTime()}
            confirmedComponents={{
              prepTime: confirmedTimeComponents.prepTime
                ? taskData.prepTime
                : 0,
              travelTime: confirmedTimeComponents.travelTime
                ? taskData.travelTime
                : 0,
              earlyTime: confirmedTimeComponents.earlyTime
                ? taskData.earlyTime
                : 0,
              bufferTime: confirmedTimeComponents.bufferTime
                ? taskData.bufferTime
                : 0,
            }}
            taskName={taskData.taskName}
          />
        )}

        <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        {renderStep()}
      </div>

      <NotificationSystem notifications={notifications} />
    </div>
  );
}

export default App;
