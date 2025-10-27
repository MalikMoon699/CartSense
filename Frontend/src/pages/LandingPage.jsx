import { useState } from "react";
import { useOutletContext } from "react-router-dom";

const LandingPage = () => {
  const { setAcountState } = useOutletContext();
  
  return (
    <div>
      <h1>Welcome to Frontend.</h1>
      <button
        onClick={() => {
          setAcountState("login");
        }}
      >
        Login
      </button>
    </div>
  );
};

export default LandingPage;
