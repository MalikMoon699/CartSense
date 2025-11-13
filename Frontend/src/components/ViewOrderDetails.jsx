import React from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router";
import {
  getCurrencySymbol,
  getPriceByCurrency,
} from "../services/CurrencyHelper";
import { useAuth } from "../contexts/AuthContext";


const ViewOrderDetails = ({ isDetailsModel, setIsDetailsModel }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  if (!isDetailsModel) return null;

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

        <div className="viewProductDetails-product-info">
          <div className="viewProductDetails-description">
            <p>
              <strong>Customer Name:</strong> {isDetailsModel?.user?.name}
            </p>
            <p>
              <strong>Email:</strong> {isDetailsModel?.user?.email}
            </p>
            <p>
              <strong>Product:</strong> {isDetailsModel?.product?.name}
            </p>
            {isDetailsModel?.selectedOptions &&
              Object.keys(isDetailsModel?.selectedOptions).length > 0 && (
                <>
                  {Object.entries(isDetailsModel?.selectedOptions).map(
                    ([key, value]) => (
                      <p key={key} >
                        <strong>{key}:</strong>
                        {value}
                      </p>
                    )
                  )}
                </>
              )}
            <p>
              <strong>Price:</strong>{" "}
              {getCurrencySymbol(
                currentUser?.currencyType ||
                  isDetailsModel?.product?.currencyType
              )}{" "}
              {getPriceByCurrency(
                isDetailsModel?.product?.currencyType,
                currentUser?.currencyType,
                isDetailsModel?.product?.price
              )}
            </p>
            <p>
              <strong>Quantity:</strong> {isDetailsModel?.orderquantity}
            </p>
            <p>
              <strong>Total Price:</strong>{" "}
              {getCurrencySymbol(currentUser?.currencyType)}{" "}
              {getPriceByCurrency(
                "PKR",
                currentUser?.currencyType,
                isDetailsModel?.totalprice
              )}
            </p>
          </div>
          <div className="viewProductDetails-description">
            <p>
              <strong>Payment Method:</strong> {isDetailsModel?.paymentMethod}
            </p>
            {isDetailsModel?.paymentDetails && (
              <p>
                <strong>Payment Details:</strong>{" "}
                {isDetailsModel?.paymentDetails}
              </p>
            )}
            <p>
              <strong>Status:</strong>{" "}
              <span className={`order-status ${isDetailsModel?.status}`}>
                {isDetailsModel?.status}
              </span>
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(isDetailsModel?.createdAt).toLocaleString("en-GB")}
            </p>
          </div>

          <div className="viewProductDetails-categories">
            <p>
              <strong>Address:</strong> {isDetailsModel?.address?.location},{" "}
              {isDetailsModel?.address?.city},{" "}
              {isDetailsModel?.address?.country}
            </p>
          </div>
          <button
            onClick={() => {
              navigate(`/product/${isDetailsModel?.product?._id}`);
            }}
            className="go-product-btn"
          >
            View Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewOrderDetails;
