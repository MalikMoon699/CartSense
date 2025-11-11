import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { WifiOff } from "lucide-react";
import "../assets/style/Offline.css";
import { useNavigate } from "react-router-dom";

const Offline = () => {
  const navigate = useNavigate();
  useEffect(() => {
    toast.error("You are offline. Please check your internet connection.", {
      duration: 5000,
    });
  }, []);

  return (
    <div className="offline-and-container">
      <div className="offline-and-content">
        <div className="offline-and-icon">
          <WifiOff size={60} />
        </div>
        <h1 className="offline-and-title">No Internet Connection</h1>
        <p className="offline-and-message">
          It seems you're currently offline. Please check your network and try
          again.
        </p>
        <button
          className="offline-and-retry-btn"
          onClick={() => {
            window.location.reload();
            navigate(-1);
          }}
        >
          Retry Connection
        </button>
      </div>
    </div>
  );
};

export default Offline;
