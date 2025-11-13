import React, { useState, useRef, useEffect } from "react";
import "../assets/style/OTP.css";
import API from "../utils/api";
import { handleForget } from "../services/Helpers";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

const OTP = ({ setAcountState, email }) => {
  const { refresh } = useAuth();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(paste)) return;

    const digits = paste.split("").slice(0, 4);
    const newOtp = [...otp];
    digits.forEach((d, i) => {
      newOtp[i] = d;
    });
    setOtp(newOtp);

    const nextIndex = Math.min(digits.length, 3);
    inputsRef.current[nextIndex]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = async (enteredOtp) => {
    const otpValue = enteredOtp || otp.join("");
    if (otpValue.length < 4) {
      toast.error("Please enter all 4 digits");
      return;
    }

    try {
      const res = await API.post("/auth/otp-check", {
        email,
        otpCode: otpValue,
      });
      if (res.status === 200) setAcountState("newPassword");
      toast.success("Otp match successfuly");
      setAcountState("newPassword");
    } catch (err) {
      console.error("Error to checkOtp:", err);
      toast.error("Invalid or expired OTP");
    }
  };

  const handleResend = () => {
    setOtp(["", "", "", ""]);
    setResendTimer(30);
    toast.success("A new OTP has been sent to your email!");
    handleForget(email, setLoading, setAcountState, refresh);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="otp-modal-header">
          <h2 className="modal-title">Enter OTP</h2>
          <p>Please enter the 4-digit code sent to your email</p>
        </div>
        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
            />
          ))}
        </div>
        <button onClick={() => handleVerify()} className="verify-btn">
          Verify OTP
        </button>

        <div className="resend-section">
          {resendTimer > 0 ? (
            <p>Resend OTP in {resendTimer}s</p>
          ) : (
            <button onClick={handleResend} className="resend-btn">
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTP;
