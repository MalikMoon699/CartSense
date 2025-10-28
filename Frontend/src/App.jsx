import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./assets/style/Style.css";
import AdminLayout from "./layouts/AdminLayout.jsx";
import AppLayout from "./layouts/AppLayout.jsx";
import AdminDashBoard from "./pages/AdminDashBoard.jsx";
import Store from "./pages/Store.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Cart from "./components/Cart.jsx";
import Checkout from "./components/Checkout.jsx";
import SingleProduct from "./components/SingleProduct.jsx";
import { ProtectedRoute } from "./routes/RouteGuards.jsx";
import AdminOrders from "./components/AdminOrders.jsx";
import AdminProducts from "./components/AdminProducts.jsx";
import AdminUsers from "./components/AdminUsers.jsx";

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route path="/product:id" element={<SingleProduct />} />
          <Route path="/store" element={<Store />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route
            path="admin/dashboard"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashBoard />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/orders"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/products"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/users"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
};

export default App;
