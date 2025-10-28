import React from "react";
import "../assets/style/Sidebar.css";

const SideBar = () => {
  return (
    <div
      onClick={() => setSidebarType(null)}
      style={{ backdropFilter: "blur(2px)" }}
      className="modal-overlay"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="sidebar left-sidebar"
      >
        <h1>SideBar</h1>
      </div>
    </div>
  );
};

export default SideBar;
