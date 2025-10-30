import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./assets/style/Style.css";
import AdminLayout from "./layouts/AdminLayout.jsx";
import AppLayout from "./layouts/AppLayout.jsx";
import AdminDashBoard from "./pages/AdminDashBoard.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Cart from "./components/Cart.jsx";
import Checkout from "./components/Checkout.jsx";
import SingleProduct from "./components/SingleProduct.jsx";
import { ProtectedRoute } from "./routes/RouteGuards.jsx";
import AdminOrders from "./components/AdminOrders.jsx";
import AdminProducts from "./components/AdminProducts.jsx";
import AdminUsers from "./components/AdminUsers.jsx";
import Products from "./pages/Products.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import FAQ from "./pages/FAQ.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import Returns from "./components/infoPages/Returns.jsx";
import ShippingInfo from "./components/infoPages/ShippingInfo.jsx";
import Support from "./components/infoPages/Support.jsx";
import PrivacyPolicy from "./components/infoPages/PrivacyPolicy.jsx";
import TermsOfService from "./components/infoPages/TermsOfService.jsx";

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<SingleProduct />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/shipping" element={<ShippingInfo />} />
          <Route path="/support" element={<Support />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route
            path="/my-orders/:id"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />
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
