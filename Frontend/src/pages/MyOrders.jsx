import React, { useState, useEffect } from "react";
import "../assets/style/MyOrders.css";
import API from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import Loader from "../components/Loader";
import ViewMyOrderDetails from "../components/ViewMyOrderDetails";
import {
  getCurrencySymbol,
  getPriceByCurrency,
} from "../services/CurrencyHelper";

const MyOrders = () => {
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState("All");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(null);
  const [isDetailsModel, setIsDetailsModel] = useState(null);

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

  const handleOrderDelete = async (orderId) => {
    if (!orderId) return toast.error("Order not found");
    try {
      setCancelLoading(orderId);
      const token = localStorage.getItem("token");
      const res = await API.delete(`/order/deleteOrder/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success("Order deleted successfully.");
        setOrders((prevOrders) => prevOrders.filter((o) => o._id !== orderId));
      } else {
        toast.error(res.data.message || "Failed to delete order.");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Something went wrong while deleting the order.");
    } finally {
      setCancelLoading(null);
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
                   <b>Quantity:</b> {order.orderquantity}
                  </p>
                  {order.selectedOptions &&
                    Object.keys(order.selectedOptions).length > 0 && (
                      <div className="my-order-item-options">
                        {Object.entries(order.selectedOptions).map(
                          ([key, value]) => (
                            <p key={key} className="my-order-item-quantity">
                              <b>{key}:</b> {value}
                            </p>
                          )
                        )}
                      </div>
                    )}
                </div>
                <span className="my-order-item-price">
                  {getCurrencySymbol(
                    currentUser?.currencyType || order.product?.currencyType
                  )}{" "}
                  {getPriceByCurrency(
                    order.product?.currencyType,
                    currentUser?.currencyType,
                    order.product.price
                  )}
                </span>
              </div>

              <div className="my-order-actions">
                <button
                  onClick={() => {
                    setIsDetailsModel(order);
                  }}
                  className="my-order-btn"
                >
                  View Details
                </button>
                <button className="my-order-btn">Track Order</button>
                {order.status === "pending" && (
                  <button
                    onClick={() => {
                      handleOrderDelete(order._id);
                    }}
                    disabled={cancelLoading}
                    className="my-order-cencel-btn"
                  >
                    {cancelLoading === order._id ? (
                      <Loader
                        size="20"
                        color="#ff0000"
                        style={{ width: "82px" }}
                      />
                    ) : (
                      "Cancel Order"
                    )}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="my-order-empty">No orders found for this status.</p>
        )}
      </div>
      {isDetailsModel && (
        <ViewMyOrderDetails
          isDetailsModel={isDetailsModel}
          setIsDetailsModel={setIsDetailsModel}
        />
      )}
    </div>
  );
};

export default MyOrders;
