import { X } from "lucide-react";
import React from "react";
import "../assets/style/ViewMyOrderDetails.css";
import { useNavigate } from "react-router";
import {
  getCurrencySymbol,
  getPriceByCurrency,
} from "../services/CurrencyHelper";
import { useAuth } from "../contexts/AuthContext";

const ViewMyOrderDetails = ({ isDetailsModel, setIsDetailsModel }) => {
  if (!isDetailsModel) return null;
  const {
    product,
    orderquantity,
    totalprice,
    address,
    paymentMethod,
    status,
    createdAt,
  } = isDetailsModel;
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div onClick={() => setIsDetailsModel(null)} className="modal-overlay">
      <div
        style={{ width: "450px", padding: "22px 20px" }}
        onClick={(e) => e.stopPropagation()}
        className="modal-content"
      >
        <div className="modal-header">
          <h2 className="modal-title">Order Details</h2>
          <button
            onClick={() => setIsDetailsModel(null)}
            className="modal-close-btn"
          >
            <X />
          </button>
        </div>
        <div className="view-my-order-details-body">
          <div className="view-my-order-details-product">
            <h4 className="view-my-order-details-section-title">
              Product Details
            </h4>
            <div className="view-my-order-details-product-inner">
              <img
                src={product?.images?.[0]}
                alt={product?.name}
                className="view-my-order-details-product-image"
              />
              <div className="view-my-order-details-product-info">
                <h3 className="view-my-order-details-product-name">
                  {product?.name}
                </h3>
                <div className="view-my-order-details-product-inner-info">
                  <p className="view-my-order-details-product-price">
                    {getCurrencySymbol(
                      currentUser?.currencyType || product?.currencyType
                    )}{" "}
                    {getPriceByCurrency(
                      product?.currencyType,
                      currentUser?.currencyType,
                      product?.price
                    )}
                  </p>
                  <p className="view-my-order-details-product-qty">
                    Quantity: <span>{orderquantity}</span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    navigate(`/product/${product._id}`);
                  }}
                >
                  View product
                </button>
              </div>
            </div>
          </div>

          <hr className="view-my-order-details-divider" />

          <div className="view-my-order-details-section">
            <h4 className="view-my-order-details-section-title">
              Order Summary
            </h4>
            <div className="view-my-order-details-info">
              <div className="cart-sidebar-total-price">
                <strong>Status:</strong>
                <span className="straight-line"></span>
                <span className={`view-my-order-details-status ${status}`}>
                  {status}
                </span>
              </div>
              <div className="cart-sidebar-total-price">
                <strong>Order Date:</strong>
                <span className="straight-line"></span>
                <span>{new Date(createdAt).toLocaleDateString()}</span>
              </div>
              <div className="cart-sidebar-total-price">
                <strong>Total Price:</strong>
                <span className="straight-line"></span>
                <span>
                  {getCurrencySymbol(
                    currentUser?.currencyType || product?.currencyType
                  )}{" "}
                  {getPriceByCurrency(
                    "PKR",
                    currentUser?.currencyType,
                    totalprice
                  )}
                </span>
              </div>
              <div className="cart-sidebar-total-price">
                <strong>Payment Method:</strong>
                <span className="straight-line"></span>
                <span>{paymentMethod}</span>
              </div>
            </div>
          </div>

          <hr className="view-my-order-details-divider" />

          <div className="view-my-order-details-section">
            <h4 className="view-my-order-details-section-title">
              Shipping Address
            </h4>
            <div className="view-my-order-details-info">
              <div className="cart-sidebar-total-price">
                <strong>Adress</strong>
                <span className="straight-line"></span>
                <span>
                  {address?.location},{address?.city}, {address?.country}
                </span>
              </div>
            </div>
          </div>
          <hr className="view-my-order-details-divider" />
          <button className="view-my-order-details-cencel-btn">
            Cencel Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewMyOrderDetails;
