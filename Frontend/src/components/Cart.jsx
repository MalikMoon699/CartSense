import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "../assets/style/Cart.css";
import API from "../utils/api";
import { toast } from "sonner";
import Loader from "../components/Loader";
import {
  getCurrencySymbol,
  getPriceByCurrency,
} from "../services/CurrencyHelper";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router";
import { handleDeleteCartProduct, handleQuantityChange } from "../services/Helpers";

const Cart = () => {
  const { setCartCount } = useOutletContext();
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

  if (loading)
    return (
      <Loader
        size="100"
        style={{ width: "100%", height: "70vh" }}
        className="layout-loading"
        stroke="6"
      />
    );
  return (
    <>
      {cart.length > 0 ? (
        <div className="cart-container">
          <h1 className="cart-title">Shopping Cart</h1>
          <p className="cart-subtitle">{cart.length} item(s) in your cart</p>
          <div className="cart-wrapper">
            <div className="cart-items">
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
                    {item.selectedOptions &&
                      Object.keys(item.selectedOptions).length > 0 && (
                        <div className="my-order-item-options">
                          {Object.entries(item.selectedOptions).map(
                            ([key, value]) => (
                              <p key={key} className="my-order-item-quantity">
                                <b>{key}:</b> {value}
                              </p>
                            )
                          )}
                        </div>
                      )}
                    <p className="cart-price">
                      {getCurrencySymbol(
                        currentUser?.currencyType || item?.product?.currencyType
                      )}{" "}
                      {getPriceByCurrency(
                        item?.product?.currencyType,
                        currentUser?.currencyType,
                        item.product.price
                      )}
                    </p>
                  </div>

                  <div className="cart-qty">
                    <button
                      className={`cart-qty-btn ${
                        item.quantity === 1 ? "disabled" : ""
                      }`}
                      disabled={item.quantity === 1}
                      onClick={() =>
                        handleQuantityChange(
                          item,
                          "dec",
                          currentUser,
                          setCart,
                          setCartCount
                        )
                      }
                    >
                      <Minus size={18} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className={`cart-qty-btn ${
                        item.quantity === item.product.stock ? "disabled" : ""
                      }`}
                      disabled={item.quantity === item.product.stock}
                      onClick={() =>
                        handleQuantityChange(
                          item,
                          "inc",
                          currentUser,
                          setCart,
                          setCartCount
                        )
                      }
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      handleDeleteCartProduct(
                        item,
                        currentUser,
                        setCart,
                        setCartCount
                      )
                    }
                    className="cart-delete-btn"
                  >
                    <Trash2 size={18} />
                  </button>
                  <p className="cart-total-price">
                    {getCurrencySymbol(
                      currentUser?.currencyType || item?.product?.currencyType
                    )}{" "}
                    {getPriceByCurrency(
                      item?.product?.currencyType,
                      currentUser?.currencyType,
                      item.product.price * item.quantity
                    )}
                  </p>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3 className="cart-summary-title">Order Summary</h3>

              <div className="cart-summary-row">
                <span>Subtotal ({cart.length} items)</span>
                <span>
                  {getCurrencySymbol(
                    currentUser?.currencyType || item?.product?.currencyType
                  )}{" "}
                  {getPriceByCurrency(
                    "PKR",
                    currentUser?.currencyType,
                    cart.reduce((t, i) => t + i.product.price * i.quantity, 0)
                  )}
                </span>
              </div>

              <div className="cart-summary-row">
                <span>Shipping</span>
                <span className="cart-green">Free</span>
              </div>

              <div className="cart-summary-row">
                <span>Tax</span>
                <span>
                  {getCurrencySymbol(
                    currentUser?.currencyType || item?.product?.currencyType
                  )}{" "}
                  0
                </span>
              </div>

              <hr className="cart-divider" />

              <div className="cart-summary-row total">
                <span>Total</span>
                <span>
                  {getCurrencySymbol(
                    currentUser?.currencyType || item?.product?.currencyType
                  )}{" "}
                  {getPriceByCurrency(
                    "PKR",
                    currentUser?.currencyType,
                    cart.reduce((t, i) => t + i.product.price * i.quantity, 0)
                  )}
                </span>
              </div>

              <button onClick={handleCheckout} className="cart-btn checkout">
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
      ) : (
        <div className="empty-cart-container">
          <div className="empty-cart-inner-container">
            <div className="landing-services-icon">
              <ShoppingCart />
            </div>
            <h3 className="landing-services-title">Cart</h3>
            <span className="landing-services-subtitle">
              Your cart is currently empty.
            </span>
            <button
              onClick={() => navigate("/products")}
              className="cart-btn cart-2-btn continue"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
