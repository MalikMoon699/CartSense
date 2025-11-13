import React from "react";
import {
  House,
  Package,
  X,
  CircleAlert,
  CircleQuestionMark,
  Phone,
  ShoppingCart,
  List,
  CircleUser,
} from "lucide-react";
import "../assets/style/Sidebar.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

const SideBar = ({ setSidebarType, setAcountState }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const onClose = () => {
    setSidebarType(null);
  };

  const authUser = () => {
    setAcountState("login");
    onClose();
    toast.error("You need to be logged in to access this feature.");
  };

  return (
    <div
      onClick={onClose}
      style={{ backdropFilter: "blur(2px)" }}
      className="modal-overlay"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="sidebar left-sidebar"
      >
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button onClick={onClose} className="close-btn">
            <X size={15} />
          </button>
        </div>
        <div className="normalSidebar-links">
          <div
            onClick={() => {
              navigate("/");
              onClose();
            }}
            className={`normalSidebar-link ${
              location.pathname === "/" ? "active" : ""
            }`}
          >
            <span className="icon">
              <House />
            </span>
            Home
          </div>

          <div
            onClick={() => {
              navigate("/products");
              onClose();
            }}
            className={`normalSidebar-link ${
              location.pathname === "/products" ? "active" : ""
            }`}
          >
            <span className="icon">
              <Package />
            </span>
            Products
          </div>

          <div
            onClick={() => {
              navigate("/about");
              onClose();
            }}
            className={`normalSidebar-link ${
              location.pathname === "/about" ? "active" : ""
            }`}
          >
            <span className="icon">
              <CircleAlert />
            </span>
            About
          </div>

          <div
            onClick={() => {
              navigate("/faq");
              onClose();
            }}
            className={`normalSidebar-link ${
              location.pathname === "/faq" ? "active" : ""
            }`}
          >
            <span className="icon">
              <CircleQuestionMark />
            </span>
            FAQ
          </div>

          <div
            onClick={() => {
              navigate("/contact");
              onClose();
            }}
            className={`normalSidebar-link ${
              location.pathname === "/contact" ? "active" : ""
            }`}
          >
            <span className="icon">
              <Phone />
            </span>
            Contact
          </div>

          <div
            onClick={() => {
              if (currentUser?._id) {
                navigate("/cart");
                onClose();
              } else {
                authUser();
              }
            }}
            className={`normalSidebar-link ${
              location.pathname === "/cart" ? "active" : ""
            }`}
          >
            <span className="icon">
              <ShoppingCart />
            </span>
            Cart
          </div>

          <div
            onClick={() => {
              if (currentUser?._id) {
                navigate(`/my-orders/${currentUser._id}`);
                onClose();
              } else {
                authUser();
              }
            }}
            className={`normalSidebar-link ${
              location.pathname.startsWith(`/my-orders/`) ? "active" : ""
            }`}
          >
            <span className="icon">
              <List />
            </span>
            My Orders
          </div>
          {currentUser && (
            <div
              onClick={() => {
                setSidebarType("userDetails");
              }}
              className={`normalSidebar-link sidebar-userdetails-go ${
                location.pathname.startsWith(`/my-orders/`) ? "active" : ""
              }`}
            >
              <span className="icon">
                <CircleUser />
              </span>
              My Profile
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
