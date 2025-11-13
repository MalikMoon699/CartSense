// components/TopBar.jsx
import React, { useEffect, useState } from "react";
import "../assets/style/TopBar.css";
import {
  LayoutDashboard,
  Menu,
  Moon,
  Search,
  ShoppingCart,
  Sun,
  User,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import { IMAGES } from "../services/Constants";
import { toast } from "sonner";
import { fetchCartCount } from "../services/Helpers";

const TopBar = ({
  setAcountState,
  setSidebarType,
  setIsSearch,
  cartCount,
  setCartCount,
}) => {
  const { authAllow, currentUser } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setDarkMode(true);
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      setDarkMode(false);
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  useEffect(() => {
    fetchCartCount(currentUser?._id, setCartCount);
  }, [currentUser]);

  const authUser = () => {
    setAcountState("login");
    toast.error("You need to be logged in to access this feature.");
  };

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
        className={currentUser?.role === "admin" ? "hide-for-admin" : ""}
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
            setDarkMode(!darkMode);
          }}
          className="icon"
        >
          {darkMode ? <Sun /> : <Moon />}
        </span>
        <span
          onClick={() => {
            setIsSearch(true);
          }}
          className="icon"
        >
          <Search />
        </span>
        <div
          onClick={() => {
            if (currentUser?._id) {
              setSidebarType("cartsidebar");
            } else {
              authUser();
            }
          }}
          className="topbar-cart"
        >
          <span className="icon">
            <ShoppingCart />
          </span>
          <span className="topbar-cart-count">{cartCount || 0}</span>
        </div>

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
