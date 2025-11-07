import React, { useEffect, useState } from "react";
import "../assets/style/Checkout.css";
import { handleEmptyCart } from "../services/Helpers";
import { countryCityData } from "../services/Constants";
import { useAuth } from "../contexts/AuthContext";
import API from "../utils/api";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import Loader from "./Loader";

const Checkout = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handlePaymentSelect = (method) => {
    setPaymentMethod(method);
    setPaymentDetails("");
  };

  useEffect(() => {
    fetchCart();
  }, [currentUser]);

  useEffect(() => {
    if (!cart.length && !loading) {
      navigate("/cart");
      toast.warning("Sorry your cart is currently empty.");
      return;
    }
  }, []);

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

  const singleProductPrice = (price, quantity) => {
    const total = price * quantity;
    return total.toFixed(2);
  };

  const totalCheckoutPrice = () => {
    const total = cart.reduce(
      (sum, item) => sum + item?.product?.price * item?.quantity,
      0
    );
    return total.toFixed(2);
  };

  const validateForm = () => {
    if (!selectedLocation.trim()) {
      toast.error("Please enter your address");
      return false;
    }
    if (!selectedCountry) {
      toast.error("Please select a country");
      return false;
    }
    if (!selectedCity) {
      toast.error("Please select a city");
      return false;
    }
    if (paymentMethod !== "Cash on Delivery" && !paymentDetails.trim()) {
      toast.error(`Please enter your ${paymentMethod} account or card number`);
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!cart.length) {
      navigate("/cart");
      toast.warning("Sorry your cart is currently empty.");
      return;
    }

    if (!validateForm()) return;

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
          } removed due to low stock`
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
    if (!cart.length) {
      navigate("/cart");
      toast.warning("Sorry your cart is currently empty.");
      return;
    }

    try {
      setCheckoutLoading(true);
      const token = localStorage.getItem("token");
      const orderData = {
        userId: currentUser._id,
        paymentMethod,
        paymentDetails,
        address: {
          country: selectedCountry,
          city: selectedCity,
          location: selectedLocation,
        },
        total: totalCheckoutPrice(),
        items: cart.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
      };

      const res = await API.post("/order/createOrder", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success("Order placed successfully!");
        handleEmptyCart(currentUser);
        navigate(`/my-orders/${currentUser?._id}`);
      } else {
        toast.error(res.data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Something went wrong");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handlePayment = () => {};

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
    <div className="checkout-page-container">
      <h1 className="checkout-page-title">Checkout</h1>

      <div className="checkout-content">
        <div className="checkout-form-section">
          <h2 className="checkout-section-title">Billing Details</h2>
          <form className="checkout-form">
            <div className="checkout-form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={currentUser?.name}
                readOnly
              />
            </div>

            <div className="checkout-form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={currentUser?.email}
                readOnly
              />
            </div>

            <div className="checkout-form-group">
              <label>Address</label>
              <input
                type="text"
                placeholder="123 Main Street"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              />
            </div>

            <div className="checkout-form-row">
              <div className="checkout-form-group">
                <label>Country</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    setSelectedCity("");
                  }}
                >
                  <option disabled value="">
                    Select Country
                  </option>
                  {Object.keys(countryCityData).map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <div className="checkout-form-group">
                <label>City</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!selectedCountry}
                >
                  <option disabled value="">
                    Select City
                  </option>
                  {selectedCountry &&
                    countryCityData[selectedCountry].map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                </select>
              </div>

              <div className="checkout-form-group">
                <label>Zip Code</label>
                <input type="text" placeholder="10001" />
              </div>
            </div>

            <div className="checkout-form-group">
              <label>Phone Number</label>
              <input type="text" placeholder="+1 234 567 890" />
            </div>

            <div className="checkout-form-group">
              <label>Payment Method</label>
              <ul className="checkout-payment-list">
                {["Cash on Delivery", "Jazz Cash", "EasyPaisa", "Card"].map(
                  (method) => (
                    <li
                      key={method}
                      className={`checkout-payment-option ${
                        paymentMethod === method ? "active" : ""
                      }`}
                      onClick={() => handlePaymentSelect(method)}
                    >
                      {method}
                    </li>
                  )
                )}
              </ul>

              {paymentMethod && paymentMethod !== "Cash on Delivery" && (
                <div className="addproduct-category-input">
                  <input
                    type="text"
                    placeholder={`Enter your ${paymentMethod} account or card number`}
                    value={paymentDetails}
                    style={{ width: "100%" }}
                    onChange={(e) => setPaymentDetails(e.target.value)}
                  />
                  <button
                    onClick={handlePayment}
                    disabled={paymentLoading}
                    className="addproduct-add-category-btn"
                  >
                    {paymentLoading ? (
                      <Loader
                        color="white"
                        size="14"
                        style={{ height: "100%", width: "55px" }}
                      />
                    ) : (
                      "Pay Now"
                    )}
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="checkout-summary-section">
          <h2 className="checkout-section-title">Order Summary</h2>
          <div className="checkout-summary-items">
            {cart.length > 0 ? (
              cart.map((item, index) => (
                <div key={index} className="checkout-summary-item">
                  <p>
                    {item?.product?.name}
                    <span className="checkout-quantity-mini-label">
                      {`(${item?.quantity})`}
                    </span>
                  </p>
                  <span>
                    Rs{" "}
                    {singleProductPrice(item?.product?.price, item?.quantity)}
                  </span>
                </div>
              ))
            ) : (
              <p>No items available</p>
            )}
          </div>

          <div className="checkout-summary-total">
            <p>Total</p>
            <span>Rs {totalCheckoutPrice()}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={checkoutLoading}
            className="checkout-place-order-btn"
          >
            {checkoutLoading ? (
              <Loader color="white" size="20" />
            ) : (
              "Place Order"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
