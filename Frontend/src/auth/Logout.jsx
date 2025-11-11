import React from "react";
import { useAuth } from "../contexts/AuthContext";
import "../assets/style/Logout.css";
import { toast } from "sonner";

const Logout = ({ onClose }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logout successfully.");
    if (onClose) onClose();
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      className="modal-overlay"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="modal-content"
      >
        <h2 className="lgout-modal-title">Logout</h2>
        <p className="lgout-modal-message">
          Are you sure you want to log out from your account?
        </p>

        <div className="lgout-modal-actions">
          <button
            className="lgout-modal-btn lgout-modal-btn-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="lgout-modal-btn lgout-modal-btn-confirm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
