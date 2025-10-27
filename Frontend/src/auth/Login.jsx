import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeClosed, X } from "lucide-react";
import "../assets/style/Auth.css";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/Loader";

const Login = ({ setAcountState }) => {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", form);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setTimeout(async () => {
          await refresh();
          navigate("/dashboard", { replace: true });
        }, 100);
      }
      toast.success("Login successfully.");
    } catch (err) {
      console.error("[Login] Login error:", err);
      toast.error(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Welcome Back</h2>
          <button
            onClick={() => {
              setAcountState(null);
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
          value={form.email}
          onChange={onChange}
          required
          placeholder="Email Address"
        />

        <div className="login-password-collection">
          <input
            name="password"
            type={!showPassword ? "password" : "text"}
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            required
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
          </span>
        </div>

        <a href="#" className="forgot-password">
          Forgot Password?
        </a>

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`login-btn ${loading ? "loading" : ""}`}
        >
          {loading ? <Loader color="white" size="16" stroke="2" /> : "Login"}
        </button>

        <div className="signup">
          Don't have an account?
          <span
            onClick={() => {
              setAcountState("signUp");
            }}
          >
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
