import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "../assets/style/Cart.css";
import API from "../utils/api";
import { toast } from "sonner";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";

const Cart = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchCart();
  }, [currentUser]);

  const fetchCart = async () => {
    if (!currentUser?._id) return;

    try {
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

  return (
    <div className="cart-container">
      <h1 className="cart-title">Shopping Cart</h1>
      <p className="cart-subtitle">{cart.length} item(s) in your cart</p>

      <div className="cart-wrapper">
        <div className="cart-items">
          {cart.length === 0 && <p>Your cart is empty</p>}

          {cart.map((item) => (
            <div className="cart-item-card" key={item._id}>
              <img
                src={item.product.images?.[0]}
                alt=""
                className="cart-item-img"
              />

              <div className="cart-item-info">
                <h2 className="cart-item-name">{item.product.name}</h2>
                <p className="cart-item-cat">
                  Category: {item.product.categories?.join(", ")}
                </p>
                <p className="cart-price">Rs {item.product.price}</p>
              </div>

              <div className="cart-qty">
                <button
                  className={`cart-qty-btn ${
                    item.quantity === 1 ? "disabled" : ""
                  }`}
                  disabled={item.quantity === 1}
                  onClick={() => handleQuantityChange(item, "dec")}
                >
                  <Minus size={18} />
                </button>
                <span>{item.quantity}</span>
                <button
                  className={`cart-qty-btn ${
                    item.quantity === item.product.stock ? "disabled" : ""
                  }`}
                  disabled={item.quantity === item.product.stock}
                  onClick={() => handleQuantityChange(item, "inc")}
                >
                  <Plus size={18} />
                </button>
              </div>

              <button
                onClick={() => handleDeleteCartProduct(item)}
                className="cart-delete-btn"
              >
                <Trash2 size={18} />
              </button>

              <p className="cart-total-price">
                Rs {(item.product.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* 🧾 Order Summary */}
        <div className="cart-summary">
          <h3 className="cart-summary-title">Order Summary</h3>

          <div className="cart-summary-row">
            <span>Subtotal ({cart.length} items)</span>
            <span>
              Rs {cart.reduce((t, i) => t + i.product.price * i.quantity, 0)}
            </span>
          </div>

          <div className="cart-summary-row">
            <span>Shipping</span>
            <span className="cart-green">Free</span>
          </div>

          <div className="cart-summary-row">
            <span>Tax</span>
            <span>Rs 0</span>
          </div>

          <hr className="cart-divider" />

          <div className="cart-summary-row total">
            <span>Total</span>
            <span>
              Rs {cart.reduce((t, i) => t + i.product.price * i.quantity, 0)}
            </span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="cart-btn checkout"
          >
            Proceed to Checkout
          </button>
          <button
            onClick={() => navigate("/products")}
            className="cart-btn continue"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
