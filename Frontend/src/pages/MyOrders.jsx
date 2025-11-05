import React, { useState, useEffect } from "react";
import "../assets/style/MyOrders.css";
import API from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import Loader from "../components/Loader";

const MyOrders = () => {
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState("All");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?._id) {
      fetchOrders();
    }
  }, [currentUser]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.get(`/order/getOrder/${currentUser._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setOrders(res.data.orders || []);
      } else {
        toast.info(res.data.message || "No orders found");
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load your orders");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter(
          (order) => order.status.toLowerCase() === filter.toLowerCase()
        );

  return (
    <div className="my-order-page">
      <h1 className="my-order-title">My Orders</h1>
      <p className="my-order-subtitle">Track and manage your order history.</p>

      <div className="my-order-filters">
        {[
          "All",
          "Pending",
          "Processing",
          "Shipped",
          "Delivered",
          "Cancelled",
        ].map((status) => (
          <button
            key={status}
            className={`my-order-filter-btn ${
              filter === status ? "active" : ""
            }`}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="my-order-list">
        {loading ? (
          <Loader />
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order, i) => (
            <div key={i} className="my-order-card">
              <div className="my-order-header">
                <div>
                  <p className="my-order-id">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </p>
                  <p className="my-order-date">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="my-order-status-total">
                  <span
                    className={`my-order-status ${order.status.toLowerCase()}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="my-order-item">
                <img
                  src={order.product?.images?.[0] || ""}
                  alt={order.product?.name || "Product"}
                  className="my-order-item-img"
                />
                <div className="my-order-item-details">
                  <p className="my-order-item-name">{order.product?.name}</p>
                  <p className="my-order-item-quantity">
                    Quantity: {order.orderquantity}
                  </p>
                </div>
                <span className="my-order-item-price">
                  Rs {order.totalprice?.toFixed(2)}
                </span>
              </div>

              <div className="my-order-actions">
                <button className="my-order-btn">View Details</button>
                <button className="my-order-btn">Track Order</button>
              </div>
            </div>
          ))
        ) : (
          <p className="my-order-empty">No orders found for this status.</p>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
