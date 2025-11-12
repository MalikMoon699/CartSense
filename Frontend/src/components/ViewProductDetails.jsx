import React, { useState } from "react";
import { X } from "lucide-react";
import {
  getCurrencySymbol,
  getPriceByCurrency,
} from "../services/CurrencyHelper";
import { useAuth } from "../contexts/AuthContext";


const ViewProductDetails = ({ isDetailsModel, setIsDetailsModel }) => {
  const { currentUser } = useAuth();
  const [selectedImage, setSelectedImage] = useState(
    isDetailsModel?.images?.[0] || ""
  );

  if (!isDetailsModel) return null;

  return (
    <div onClick={() => setIsDetailsModel(null)} className="modal-overlay">
      <div
        style={{ width: "450px", padding: "22px 20px" }}
        onClick={(e) => e.stopPropagation()}
        className="modal-content"
      >
        <div className="modal-header">
          <h2 className="modal-title">Product Details</h2>
          <button
            onClick={() => setIsDetailsModel(null)}
            className="modal-close-btn"
          >
            <X />
          </button>
        </div>

        {isDetailsModel.images?.length > 0 && (
          <div className="viewProductDetails-product-images">
            <img
              src={selectedImage}
              alt={isDetailsModel.name}
              className="viewProductDetails-main-image"
            />
            <div className="viewProductDetails-thumbnail-list">
              {isDetailsModel.images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`viewProductDetails-thumbnail-item ${
                    image === selectedImage ? "active" : ""
                  }`}
                >
                  <img src={image} alt={`Thumbnail ${index}`} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="viewProductDetails-product-info">
          <div className="viewProductDetails-description">
            <p>
              <strong>Title: </strong>
              {isDetailsModel.name}
            </p>
            <p>
              <strong>Description:</strong>

              {isDetailsModel.description}
            </p>
          </div>

          <div className="viewProductDetails-product-meta">
            <p>
              <strong>Price:</strong>{" "}
              {getCurrencySymbol(
                currentUser?.currencyType || isDetailsModel?.currencyType
              )}{" "}
              {getPriceByCurrency(
                isDetailsModel?.currencyType,
                currentUser?.currencyType,
                isDetailsModel.price
              )}
            </p>
            <p>
              <strong>Stock:</strong>{" "}
              {isDetailsModel.stock > 0
                ? `${isDetailsModel.stock} available`
                : "Out of stock"}
            </p>
          </div>

          <div className="viewProductDetails-categories">
            {isDetailsModel.categories?.map((cat, i) => (
              <span key={i} className="viewProductDetails-category-tag">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProductDetails;
