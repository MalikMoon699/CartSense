import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeClosed, X } from "lucide-react";
import "../assets/style/Auth.css";
import Loader from "../components/Loader";
import API from "../utils/api";
import { toast } from "sonner";

const Signup = ({ setAcountState }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      navigate("/");
      toast.success("User Registered successfully.");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Create Account</h2>
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
          name="name"
          className="login-input"
          value={form.name}
          onChange={onChange}
          required
          type="text"
          placeholder="Full Name"
        />

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

        <button
          onClick={handleSignUp}
          disabled={loading}
          style={{ marginTop: "15px" }}
          className={`login-btn ${loading ? "loading" : ""}`}
        >
          {loading ? (
            <Loader color="white" size="16" stroke="2" />
          ) : (
            " Create Account"
          )}
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

export default Signup;
