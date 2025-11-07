import React, { useEffect, useState } from "react";
import "../assets/style/AdminDashboard.css";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import {
  fetchAllOrders,
  fetchAllProducts,
  fetchAllUsers,
  fetchTotalUsersCount,
  fetchTotalProductsCount,
  fetchTotalOrdersCount,
  fetchTotalRevenue,
} from "../services/DashboardServices";

const AdminDashBoard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countsLoading, setCountsLoading] = useState(true);
  const [usersCount, setUsersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    fetchTotalUsersCount(setUsersCount, setCountsLoading);
    fetchTotalProductsCount(setProductsCount, setCountsLoading);
    fetchTotalOrdersCount(setOrdersCount, setCountsLoading);
    fetchTotalRevenue(setTotalRevenue, setCountsLoading);
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [usersData, productsData, ordersData] = await Promise.all([
        fetchAllUsers(),
        fetchAllProducts(),
        fetchAllOrders(),
      ]);

      setUsers(usersData || []);
      setProducts(productsData || []);
      setOrders(ordersData || []);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Total Users",
      value: usersCount,
      color: "#4e73df",
      action: "users",
    },
    {
      title: "Total Products",
      value: productsCount,
      color: "#1cc88a",
      action: "products",
    },
    {
      title: "Total Orders",
      value: ordersCount,
      color: "#36b9cc",
      action: "orders",
    },
    {
      title: "Total Revenue",
      value: `Rs:${totalRevenue}`,
      color: "#f6c23e",
      action: "orders",
    },
  ];

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const latestProducts = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div className="admin-dashboard-container">
      <h1 className="admin-dashboard-title">Admin Dashboard</h1>
      <p className="admin-dashboard-subtitle">
        Manage users, products, and orders at a glance.
      </p>

      <div className="admin-dashboard-stats">
        {stats.map((item, i) => (
          <div
            key={i}
            className="admin-dashboard-stat-card"
            style={{ borderColor: `${item.color}` }}
            onClick={() => {
              navigate(`/admin/${item.action}`);
            }}
          >
            <h3 className="admin-dashboard-stat-value">
              {countsLoading ? (
                <Loader size="20" style={{ height: "30px" }} />
              ) : (
                item.value
              )}
            </h3>
            <p className="admin-dashboard-stat-title">{item.title}</p>
          </div>
        ))}
      </div>
      <div className="admin-dashboard-orders">
        <h2 className="admin-dashboard-section-title">Recent Orders</h2>
        {loading ? (
          <Loader style={{ height: "350px" }} />
        ) : (
          <table className="admin-dashboard-orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Product</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order, i) => (
                  <tr key={i}>
                    <td>{order._id?.slice(-6).toUpperCase()}</td>
                    <td>{order.user?.name || "Unknown"}</td>
                    <td>{order.product?.name || "—"}</td>
                    <td>
                      <span
                        className={`admin-dashboard-status ${
                          order.status || "pending"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <strong>Rs:</strong>
                      {order.totalprice}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No recent orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="admin-dashboard-products">
        <h2 className="admin-dashboard-section-title">Latest Products</h2>
        {loading ? (
          <Loader style={{ height: "150px" }} />
        ) : (
          <div className="admin-dashboard-product-list">
            {latestProducts.length > 0 ? (
              latestProducts.map((p, i) => (
                <div
                  onClick={() => {
                    navigate(`/product/${p._id}`);
                  }}
                  key={i}
                  className="admin-dashboard-product-card"
                >
                  <img src={p.images?.[0] || ""} alt={p.name} />
                  <div>
                    <h4>{p.name}</h4>
                    <p>
                      Price: <strong>Rs:</strong>
                      {p.price}
                    </p>
                    <p>Stock: {p.stock}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No products available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashBoard;
