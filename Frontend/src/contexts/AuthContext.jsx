import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../utils/api.js";

const AuthCtx = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authAllow, setAuthAllow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDetail, setIsDetail] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchMe = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setCurrentUser(null);
      setAuthAllow(false);
      setIsDetail(false);
      setLoading(false);
      return;
    }

    try {
      const res = await API.get("/auth/user");
      setCurrentUser(res.data.user);
      setAuthAllow(true);
      setIsDetail(Boolean(res.data.user.name && res.data.user.email));
    } catch (err) {
      console.error("[AuthContext] Auth check failed:", err.response?.data);
      setCurrentUser(null);
      setAuthAllow(false);
      setIsDetail(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = (redirect = true) => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    setAuthAllow(false);
    setIsDetail(false);
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (location.pathname === "/offline") {
        if (window.history.length > 1) {
          navigate(-1);
        } else {
          navigate("/");
        }
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      navigate("/offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [navigate, location.pathname]);

  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <AuthCtx.Provider
      value={{
        currentUser,
        authAllow,
        loading,
        refresh: fetchMe,
        isDetail,
        logout,
        isOnline,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);
