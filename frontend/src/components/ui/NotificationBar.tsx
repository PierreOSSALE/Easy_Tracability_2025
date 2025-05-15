// EASY-TRACABILITY:frontend/src/components/NotificationBar.tsx

import React from "react";
import "./NotificationBar.css";

interface Props {
  message: string;
  type?: "success" | "error" | "warning";
}

const NotificationBar: React.FC<Props> = ({ message, type = "success" }) => {
  return <div className={`notification-bar ${type}`}>{message}</div>;
};

export default NotificationBar;
