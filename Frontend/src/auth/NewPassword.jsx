import { Eye, EyeClosed } from "lucide-react";
import React, { useState } from "react";
import API from "../utils/api";
import { toast } from "sonner";
import Loader from "../components/Loader";

const NewPassword = ({ setAcountState, email }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      setLoading(true);

      const res = await API.post("/auth/new-password", {
        email,
        newPassword: password,
      });

      if (res.status === 200) {
        toast.success("Password successfully changed!");
        setAcountState("login");
      }
    } catch (err) {
      console.error("Error resetting password:", err);
      toast.error("Failed to reset password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="otp-modal-header">
          <h2 className="modal-title">Set New Password</h2>
          <p>Enter your new password below.</p>
        </div>
        <div className="login-password-collection">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
          </span>
        </div>

        <div className="login-password-collection">
          <input
            name="confirm"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
          </span>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`login-btn ${loading ? "loading" : ""}`}
        >
          {loading ? (
            <Loader color="white" size="16" stroke="2" />
          ) : (
            "Save Password"
          )}
        </button>
      </div>
    </div>
  );
};

export default NewPassword;
