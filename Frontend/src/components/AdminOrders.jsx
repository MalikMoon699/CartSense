import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { toast } from "sonner";
import "../assets/style/AdminOrders.css";
import Loader from "./Loader";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.get("/order/getAllOrders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setOrders(res.data.orders || []);
      } else {
        toast.info(res.data.message || "No orders found");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };


  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.put(
        `/order/updateOrder/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Order status updated");
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        toast.error(res.data.message || "Failed to update");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Error updating order");
    }
  };

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter(
          (order) => order.status.toLowerCase() === filter.toLowerCase()
        );

  return (
    <div className="admin-orders-page">
      <h1 className="admin-orders-title">All Orders</h1>
      <p className="admin-orders-subtitle">
        Manage and track all customer orders from here.
      </p>

      <div className="admin-orders-filters">
        {["All", "Pending", "Shipped", "Delivered", "Cancelled"].map(
          (status) => (
            <button
              key={status}
              className={`admin-filter-btn ${
                filter === status ? "active" : ""
              }`}
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          )
        )}
      </div>

      {loading ? (
       <Loader />
      ) : filteredOrders.length === 0 ? (
        <p className="admin-orders-empty">No orders found</p>
      ) : (
        <table className="admin-orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td>#{order._id.slice(-6).toUpperCase()}</td>
                <td>{order.user?.name || "N/A"}</td>
                <td>{order.product?.name || "Unknown Product"}</td>
                <td>{order.orderquantity}</td>
                <td>Rs {order.totalprice?.toFixed(2)}</td>
                <td>
                  <span className={`status-tag ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="status-selector"
                  >
                    {["pending", "shipped", "delivered", "cancelled"].map(
                      (status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      )
                    )}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrders;
