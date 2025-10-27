import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../components/TopBar";
import SideBar from "../components/SideBar";
import Login from "../auth/Login";
import Signup from "../auth/Signup";
import SearchModal from "../components/SearchModal";
import UserDetails from "../components/UserDetails";

const AppLayout = () => {
  const [acountState, setAcountState] = useState(null);
  const [sidebarType, setSidebarType] = useState(null);
  const [isSearch, setIsSearch] = useState(false);

  return (
    <div className="main-content">
      {acountState === "login" && <Login setAcountState={setAcountState} />}
      {acountState === "signUp" && <Signup setAcountState={setAcountState} />}
      {isSearch && (
        <SearchModal
          onClose={() => {
            setIsSearch(false);
          }}
        />
      )}

      <TopBar
        setAcountState={setAcountState}
        setIsSearch={setIsSearch}
        setSidebarType={setSidebarType}
      />

      <div className="main-content-wrapper">
        {sidebarType === "userDetails" ? (
          <UserDetails setSidebarType={setSidebarType} />
        ) : sidebarType === "sidebar" ? (
          <SideBar setSidebarType={setSidebarType} />
        ) : null}

        <Outlet
          context={{ setAcountState, acountState, sidebarType, setSidebarType }}
        />
      </div>
    </div>
  );
};

export default AppLayout;
