import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  LayoutList,
  LogOut,
  Menu,
  Package,
  SquareArrowOutUpRight,
  SquareX,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router";
import Logout from "../auth/Logout";

const AdminSideBar = () => {
  const navigate = useNavigate();
  const [isSidebar, setIsSidebar] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
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

  return (
    <>
      <div className="admin-mobile-topbar">
        <span
          className="icon"
          onClick={() => {
            setIsSidebar(!isSidebar);
          }}
        >
          <Menu />
        </span>
        <h2
          onClick={() => {
            navigate("/admin/dashboard");
          }}
        >
          Cart Sense
        </h2>
        <span
          className="icon"
          onClick={() => {
            navigate("/");
          }}
        >
          <SquareArrowOutUpRight />
        </span>
      </div>
      <div className={`admin-sidebar ${isSidebar ? "show-admin-sidebar" : ""}`}>
        <span className="admin-sidebar-header">
          <h2
            onClick={() => {
              navigate("/admin/dashboard");
            }}
          >
            Admin Panel
          </h2>
          <span onClick={() => navigate("/")} className="icon go-site">
            <SquareArrowOutUpRight />
          </span>
          <span
            onClick={() => setIsSidebar(false)}
            className="icon close-admin-sidebar"
          >
            <SquareX />
          </span>
        </span>
        <div className="admin-sidebar-list-items">
          <div
            onClick={() => {
              navigate("/admin/dashboard");
              setIsSidebar(false);
            }}
            className={
              location.pathname === "/admin/dashboard"
                ? "admin-sidebar-active"
                : ""
            }
          >
            <span className="icon">
              <LayoutDashboard />
            </span>
            Dashboard
          </div>
          <div
            onClick={() => {
              navigate("/admin/orders");
              setIsSidebar(false);
            }}
            className={
              location.pathname === "/admin/orders"
                ? "admin-sidebar-active"
                : ""
            }
          >
            <span className="icon">
              <LayoutList />
            </span>
            Orders
          </div>
          <div
            onClick={() => {
              navigate("/admin/products");
              setIsSidebar(false);
            }}
            className={
              location.pathname === "/admin/products"
                ? "admin-sidebar-active"
                : ""
            }
          >
            <span className="icon">
              <Package />
            </span>
            Products
          </div>
          <div
            onClick={() => {
              navigate("/admin/users");
              setIsSidebar(false);
            }}
            className={
              location.pathname === "/admin/users" ? "admin-sidebar-active" : ""
            }
          >
            <span className="icon">
              <Users />
            </span>
            Users
          </div>
        </div>
        <div className="admin-sidebar-footer">
          <button
            onClick={() => {
              setIsLogout(true);
            }}
          >
            <span className="icon">
              <LogOut size={18} />
            </span>
            Logout
          </button>
        </div>
        {isLogout && (
          <Logout
            onClose={() => {
              setIsLogout(false);
            }}
          />
        )}
      </div>
    </>
  );
};

export default AdminSideBar;
