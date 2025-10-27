import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../components/TopBar";
import SideBar from "../components/SideBar";
import Login from "../auth/Login";
import Signup from "../auth/Signup";

const AppLayout = () => {
  const [acountState, setAcountState] = useState(null);
  return (
    <div className="main-content">
      {acountState === "login" && <Login setAcountState={setAcountState} />}
      {acountState === "signUp" && <Signup setAcountState={setAcountState} />}
      <TopBar />
      <div className="main-content-wrapper">
        <SideBar />
        <Outlet context={{ setAcountState, acountState }} />
      </div>
    </div>
  );
};

export default AppLayout;
