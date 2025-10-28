import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSideBar from "../components/AdminSideBar";
import "../assets/style/AdminLayout.css";

const AdminLayout = () => {
  return (
    <div className="admin-main-content">
      <AdminSideBar />
      <div className="admin-content-area">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
