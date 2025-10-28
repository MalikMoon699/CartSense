import React from "react";
import {
  LayoutDashboard,
  LayoutList,
  LogOut,
  Package,
  SquareArrowOutUpRight,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

const AdminSideBar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="admin-sidebar">
      <span className="admin-sidebar-header">
        <h2
          onClick={() => {
            navigate("/admin/dashboard");
          }}
        >
          Admin Panel
        </h2>
        <span onClick={() => navigate("/")} className="icon">
          <SquareArrowOutUpRight />
        </span>
      </span>
      <div className="admin-sidebar-list-items">
        <div
          onClick={() => {
            navigate("/admin/dashboard");
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
          }}
          className={
            location.pathname === "/admin/orders" ? "admin-sidebar-active" : ""
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
        <button onClick={logout}>
          <span className="icon">
            <LogOut size={18} />
          </span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSideBar;
