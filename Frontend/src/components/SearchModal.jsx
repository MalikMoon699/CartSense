import { X } from "lucide-react";
import React, { useState } from "react";

const SearchModal = ({ onClose }) => {
  const [search, setsearch] = useState("");

  return (
    <div onClick={onClose} className="modal-overlay">
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        style={{ padding: "22px 16px 17px 16px", minWidth: "450px" }}
        className="modal-content"
      >
        <div className="modal-header">
          <h2>Search Products</h2>
          <button onClick={onClose} className="modal-close-btn">
            <X />
          </button>
        </div>
        <input
          type="text"
          value={search}
          placeholder="Search for products..."
          onChange={(e) => {
            setsearch(e.target.value);
          }}
          className="login-input"
        />

        <p style={{ fontSize: "10px", fontWeight: "300", color: "#ffffff57" }}>
          Start typing to search products..
        </p>
      </div>
    </div>
  );
};

export default SearchModal;
