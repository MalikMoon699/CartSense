import {
  Navigate,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/Loader";
import { useEffect } from 'react';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { authAllow, loading, currentUser, isOnline } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const outletContext = useOutletContext?.() || {};
  const { acountState, setAcountState } = outletContext;

  useEffect(() => {
    if (!isOnline && location.pathname !== "/offline") {
      navigate("/offline", { replace: true });
    }

    if (isOnline && location.pathname === "/offline") {
      navigate("/", { replace: true });
    }
  }, [isOnline, location, navigate]);

  if (loading) {
    return (
      <Loader
        size="100"
        style={{ width: "100%" }}
        className="layout-loading"
        stroke="6"
      />
    );
  }

  if (!authAllow) {
    if (setAcountState && acountState !== "signUp") {
      setAcountState("login");
    }
    return null;
  }
  if (adminOnly && currentUser?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const { authAllow, loading, isOnline } = useAuth();

  if (!isOnline && location.pathname !== "/offline") {
    return <Navigate to="/offline" replace />;
  }

  if (loading) {
    return (
      <Loader
        size="100"
        style={{ height: "" }}
        className="create-resume-loading"
        stroke="6"
      />
    );
  }

  if (authAllow) {
    return <Navigate to="/" replace />;
  }

  return children;
};
