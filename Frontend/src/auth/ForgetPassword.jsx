import React, { useState } from "react";
import { useNavigate } from "react-router";
import { X } from "lucide-react";
import "../assets/style/Auth.css";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/Loader";
import { handleForget } from "../services/Helpers";

const ForgetPassword = ({ setAcountState, setEmail, email }) => {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [loading, setLoading] = useState(false);

  return (
    <div
      onClick={() => {
        setTimeout(() => {
          setAcountState(null);
        }, 100);
      }}
      className="modal-overlay"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="modal-content"
      >
        <div className="modal-header">
          <h2 className="modal-title">Forget Password</h2>
          <button
            onClick={() => {
              navigate("/");
              setTimeout(() => {
                setAcountState(null);
              }, 100);
            }}
            className="modal-close-btn"
          >
            <X />
          </button>
        </div>

        <input
          name="email"
          className="login-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email Address"
        />

        <button
          onClick={()=>{handleForget(email, setLoading, setAcountState, refresh);}}
          disabled={loading}
          className={`login-btn ${loading ? "loading" : ""}`}
        >
          {loading ? <Loader color="white" size="16" stroke="2" /> : "Forget"}
        </button>

        <div className="signup">
          Already have an account?
          <span
            onClick={() => {
              setAcountState("login");
            }}
          >
            Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
