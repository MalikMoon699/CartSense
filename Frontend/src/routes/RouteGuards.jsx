import { Navigate, useOutletContext } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/Loader";

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { authAllow, loading, currentUser } = useAuth();
  const outletContext = useOutletContext?.() || {};
  const { acountState, setAcountState } = outletContext;

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
  const { authAllow, loading } = useAuth();

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
