import React, { useState } from "react";
import "../assets/style/MyOrders.css";

const MyOrders = () => {
  const [filter, setFilter] = useState("All");

  const orders = [
    {
      id: "#ffd06fa5-bc01-4597-9c52-32c3532d327c",
      date: "9/2/2025",
      status: "Processing",
      total: 525.0,
      items: [
        {
          name: "Baby Stroller (Foldable, Lightweight)",
          quantity: 2,
          price: 222.61,
          img: "https://cdn-icons-png.flaticon.com/512/3003/3003854.png",
        },
      ],
    },
    {
      id: "#4b2d6e21-cf32-4789-bd4b-62c431f8e21f",
      date: "10/15/2025",
      status: "Delivered",
      total: 310.5,
      items: [
        {
          name: "Electric Kettle (Stainless Steel)",
          quantity: 1,
          price: 310.5,
          img: "https://cdn-icons-png.flaticon.com/512/1216/1216895.png",
        },
      ],
    },
  ];

  // ✅ Apply filter here
  const filterData =
    filter === "All"
      ? orders
      : orders.filter((order) => order.status === filter);

  return (
    <div className="my-order-page">
      <h1 className="my-order-title">My Orders</h1>
      <p className="my-order-subtitle">Track and manage your order history.</p>

      {/* 🔘 Filter Buttons */}
      <div className="my-order-filters">
        {["All", "Processing", "Shipped", "Delivered", "Cancelled"].map(
          (status) => (
            <button
              key={status}
              className={`my-order-filter-btn ${
                filter === status ? "active" : ""
              }`}
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          )
        )}
      </div>

      {/* 🧾 Orders List */}
      <div className="my-order-list">
        {filterData.length > 0 ? (
          filterData.map((order, i) => (
            <div key={i} className="my-order-card">
              <div className="my-order-header">
                <div>
                  <p className="my-order-id">Order {order.id}</p>
                  <p className="my-order-date">Placed on {order.date}</p>
                </div>
                <div className="my-order-status-total">
                  <span
                    className={`my-order-status ${order.status.toLowerCase()}`}
                  >
                    {order.status}
                  </span>
                  <span className="my-order-total">
                    Total ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {order.items.map((item, idx) => (
                <div key={idx} className="my-order-item">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="my-order-item-img"
                  />
                  <div className="my-order-item-details">
                    <p className="my-order-item-name">{item.name}</p>
                    <p className="my-order-item-quantity">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <span className="my-order-item-price">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
              ))}

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
