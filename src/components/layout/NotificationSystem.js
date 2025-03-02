import React from "react";
import "./NotificationSystem.css";

const NotificationSystem = ({ notifications }) => {
  return (
    <div className="notifications-container">
      {notifications.map((notification) => (
        <div key={notification.id} className="notification">
          {notification.message}
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;
