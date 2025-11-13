import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../components/TopBar";
import SideBar from "../components/SideBar";
import Login from "../auth/Login";
import Signup from "../auth/Signup";
import SearchModal from "../components/SearchModal";
import UserDetails from "../components/UserDetails";
import CartSideBar from "../components/CartSideBar";
import ChatBot from "../components/ChatBot";
import ForgetPassword from "../auth/ForgetPassword";
import OTP from "../auth/OTP";
import NewPassword from "../auth/NewPassword";

const AppLayout = () => {
  const [acountState, setAcountState] = useState(null);
  const [sidebarType, setSidebarType] = useState(null);
  const [email, setEmail] = useState("");
  const [isSearch, setIsSearch] = useState(false);

  return (
    <div className="main-content">
      {acountState === "login" && <Login setAcountState={setAcountState} />}
      {acountState === "signUp" && <Signup setAcountState={setAcountState} />}
      {acountState === "passwordForget" && (
        <ForgetPassword
          setAcountState={setAcountState}
          setEmail={setEmail}
          email={email}
        />
      )}
      {acountState === "otp" && (
        <OTP
          setAcountState={setAcountState}
          setEmail={setEmail}
          email={email}
        />
      )}
      {acountState === "newPassword" && (
        <NewPassword
          setAcountState={setAcountState}
          setEmail={setEmail}
          email={email}
        />
      )}
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
          <SideBar
            setAcountState={setAcountState}
            setSidebarType={setSidebarType}
          />
        ) : sidebarType === "cartsidebar" ? (
          <CartSideBar
            setAcountState={setAcountState}
            setSidebarType={setSidebarType}
          />
        ) : null}

        <Outlet
          context={{ setAcountState, acountState, sidebarType, setSidebarType }}
        />
        <ChatBot />
      </div>
    </div>
  );
};

export default AppLayout;
