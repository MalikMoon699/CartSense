// components/TopBar.jsx
import React from "react";
import "../assets/style/TopBar.css";
import { LayoutDashboard, Menu, Search, ShoppingCart, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import { IMAGES } from "../services/Constants";

const TopBar = ({ setAcountState, setSidebarType, setIsSearch }) => {
  const { authAllow, currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="topbar">
      <span
        onClick={() => {
          setSidebarType("sidebar");
        }}
        className="icon"
      >
        <Menu />
      </span>
      <h2
        onClick={() => {
          navigate("/");
        }}
      >
        Cart Sense
      </h2>
      <div>
        {currentUser?.role === "admin" && (
          <button
            onClick={() => {
              navigate("admin/dashboard");
            }}
            className="go-dashboard-btn"
          >
            <span className="icon">
              <LayoutDashboard size={16} />
            </span>
            DashBoard
          </button>
        )}
        <span
          onClick={() => {
            setIsSearch(true);
          }}
          className="icon"
        >
          <Search />
        </span>
        <span
          onClick={() => {
            navigate("/cart");
          }}
          className="icon"
        >
          <ShoppingCart />
        </span>

        {!authAllow ? (
          <span
            onClick={() => {
              setAcountState("login");
            }}
            className="topbar-profile icon"
          >
            <User />
          </span>
        ) : (
          <span
            onClick={() => {
              setSidebarType("userDetails");
            }}
            className="topbar-profile icon"
          >
            <img src={currentUser?.profileImg || IMAGES.PlaceHolder} />
          </span>
        )}
      </div>
    </div>
  );
};

export default TopBar;
