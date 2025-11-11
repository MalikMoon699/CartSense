import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { toast } from "sonner";
import "../assets/style/AdminOrders.css";
import { RefreshCcw } from "lucide-react";
import Loader from "./Loader";
import ViewOrderDetails from "./ViewOrderDetails";

const AdminOrders = () => {
  const limit = 10;
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [isDetailsModel, setIsDetailsModel] = useState(null);

  useEffect(() => {
    setPage(1);
    setOrders([]);
    setHasMore(true);
    fetchOrders(1, filter);
  }, [filter]);

  const fetchOrders = async (pageNum = 1, currentFilter = "All") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const params = { page: pageNum, limit };
      if (currentFilter !== "All") {
        params.status = currentFilter.toLowerCase();
      }

      const res = await API.get(`/order/getAllOrders`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const { orders: fetchedOrders = [], total = 0 } = res.data;

        if (pageNum === 1) {
          setOrders(fetchedOrders);
        } else {
          setOrders((prev) => [...prev, ...fetchedOrders]);
        }

        if (orders.length + fetchedOrders.length >= total) {
          setHasMore(false);
        }
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

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchOrders(nextPage, filter);
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

  const handleRefresh = async () => {
    setRefreshLoading(true);
    try {
      const token = localStorage.getItem("token");

      const params = { page: 1, limit };
      if (filter !== "All") {
        params.status = filter.toLowerCase();
      }

      const res = await API.get(`/order/getAllOrders`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const { orders: fetchedOrders = [], total = 0 } = res.data;
        setOrders(fetchedOrders);
        setPage(1);
        setHasMore(fetchedOrders.length < total);
      } else {
        toast.info(res.data.message || "No orders found");
        setOrders([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error refreshing orders:", error);
      toast.error("Failed to refresh orders");
    } finally {
      setRefreshLoading(false);
    }
  };

  return (
    <div className="admin-orders-page">
      <div className="admin-users-header">
        <div className="admin-users-info">
          <h1 className="admin-orders-title">All Orders</h1>
          <p className="admin-orders-subtitle">
            Manage and track all customer orders from here.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshLoading}
          className="refresh-btn"
        >
          {refreshLoading ? (
            <Loader color="white" size="20" style={{ width: "69px" }} />
          ) : (
            <>
              <span className="icon">
                <RefreshCcw size={16} />
              </span>
              Refresh
            </>
          )}
        </button>
      </div>
      <div className="admin-orders-filters">
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
            className={`admin-filter-btn ${filter === status ? "active" : ""}`}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {loading && orders.length === 0 ? (
        <Loader />
      ) : orders.length === 0 ? (
        <p className="admin-orders-empty">No orders found</p>
      ) : (
        <>
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
              {orders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => {
                    setIsDetailsModel(order);
                  }}
                >
                  <td>#{order._id.slice(-6).toUpperCase()}</td>
                  <td>{order.user?.name || "N/A"}</td>
                  <td>{order.product?.name || "Unknown Product"}</td>
                  <td>{order.orderquantity}</td>
                  <td>Rs {order.totalprice?.toFixed(2)}</td>
                  <td>
                    <span
                      className={`status-tag ${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="status-selector"
                    >
                      {[
                        "pending",
                        "processing",
                        "shipped",
                        "delivered",
                        "cancelled",
                      ].map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(loading || hasMore) && (
            <div className="loadMore-container">
              {loading ? (
                <Loader style={{ width: "auto" }} />
              ) : (
                hasMore && (
                  <button onClick={handleLoadMore} className="load-more-btn">
                    Load More
                  </button>
                )
              )}
            </div>
          )}
        </>
      )}

      {isDetailsModel && (
        <ViewOrderDetails
          isDetailsModel={isDetailsModel}
          setIsDetailsModel={setIsDetailsModel}
        />
      )}
    </div>
  );
};

export default AdminOrders;
