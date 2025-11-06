import React, { useEffect, useState } from "react";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import "../assets/style/CartSideBar.css";
import API from "../utils/api";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import Loader from "./Loader";

const CartSideBar = ({ setSidebarType }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, [currentUser]);

  const fetchCart = async () => {
    if (!currentUser?._id) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.get(`/cart/getCart/${currentUser._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setCart(res.data.cart);
      } else {
        toast.info(res.data.message || "No items in cart");
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (item, type) => {
    const newQty =
      type === "inc" ? item.quantity + 1 : Math.max(1, item.quantity - 1);

    try {
      const token = localStorage.getItem("token");

      const res = await API.put(
        `/cart/updateProductCart/${item.product._id}`,
        { userId: currentUser._id, quantity: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setCart((prevCart) =>
          prevCart.map((p) =>
            p._id === item._id ? { ...p, quantity: newQty } : p
          )
        );
        toast.success("Cart updated");
      } else {
        toast.error(res.data.message || "Failed to update cart");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Server error updating cart");
    }
  };

  const handleDeleteCartProduct = async (item) => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.delete(
        `/cart/removeProductCart/${item.product._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { userId: currentUser._id },
        }
      );

      if (res.data.success) {
        setCart((prevCart) => prevCart.filter((p) => p._id !== item._id));
        toast.success("Product removed from cart");
      } else {
        toast.error(res.data.message || "Failed to remove item");
      }
    } catch (error) {
      console.error("Error deleting cart item:", error);
      toast.error("Server error removing product");
    }
  };

  const handleCheckout = async () => {
      if (!cart.length)
        return toast.warning("Sorry your cart is currently empty.");

    const lowStockItems = cart.filter(
      (item) => item.quantity > item.product.stock
    );

    if (lowStockItems.length > 0) {
      try {
        const token = localStorage.getItem("token");

        await Promise.all(
          lowStockItems.map((item) =>
            API.delete(`/cart/removeProductCart/${item.product._id}`, {
              headers: { Authorization: `Bearer ${token}` },
              data: { userId: currentUser._id },
            })
          )
        );

        setCart((prevCart) =>
          prevCart.filter((item) => item.quantity <= item.product.stock)
        );

        toast.warning(
          `${lowStockItems.length} item${
            lowStockItems.length > 1 ? "s" : ""
          } removed because of low stock`
        );
          setSidebarType(null);
      } catch (error) {
        console.error("Error removing low stock items:", error);
        toast.error("Failed to remove low-stock items");
        return;
      }
    }

    const updatedCart = cart.filter(
      (item) => item.quantity <= item.product.stock
    );

    if (updatedCart.length === 0) {
      toast.info("Your cart is empty now — please add items before checkout.");
      return;
    }

    navigate("/checkout");
  };

  return (
    <div
      onClick={() => setSidebarType(null)}
      style={{ backdropFilter: "blur(2px)" }}
      className="modal-overlay"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="right-sidebar sidebar"
      >
        <div className="sidebar-header">
          <h2>Cart</h2>
          <button className="close-btn" onClick={() => setSidebarType(null)}>
            <X size={15} />
          </button>
        </div>
        {loading ? (
          <Loader
            style={{ width: "100%", height: "70vh" }}
            className="layout-loading"
            stroke="6"
          />
        ) : (
          <div className="cart-sidebar-container">
            <div className="cart-sidebar-items">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div key={item._id} className="cart-sidebar-item">
                    <div className="cart-sidebar-image">
                      <img
                        src={item.product.images?.[0]}
                        alt={item.product.name}
                        className="cart-sidebar-img"
                      />
                    </div>
                    <div className="cart-sidebar-details">
                      <h4 className="cart-sidebar-title">
                        {item.product.name}
                      </h4>
                      <p className="cart-sidebar-price">
                        ${item.product.price * item.quantity}
                      </p>
                      <div className="cart-sidebar-controls">
                        <div className="cart-sidebar-quantity-controls">
                          <button
                            onClick={() => handleQuantityChange(item, "dec")}
                            className="cart-sidebar-btn dec"
                          >
                            <Minus size={18} />
                          </button>
                          <span className="cart-sidebar-qty">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item, "inc")}
                            className="cart-sidebar-btn inc"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                        <button
                          className="cart-sidebar-remove"
                          onClick={() => handleDeleteCartProduct(item)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="cart-sidebar-empty">Your cart is empty</p>
              )}
            </div>
            <div className="cart-sidebar-actions">
              <div className="cart-sidebar-total-price">
                <strong>Total</strong>
                <span className="straight-line"></span>
                <span>
                  Rs{" "}
                  {cart.reduce((t, i) => t + i.product.price * i.quantity, 0)}
                </span>
              </div>
              <button
                className="cart-sidebar-btn view-cart"
                onClick={() => {navigate("/cart");
                  setSidebarType(null);
                }}
              >
                View Cart
              </button>
              <button
                className="cart-sidebar-btn checkout"
                onClick={handleCheckout}
              >
                Check Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSideBar;
