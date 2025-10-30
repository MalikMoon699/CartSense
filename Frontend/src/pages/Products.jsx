import React, { useState } from "react";
import { dummyProducts } from "../services/Helpers";
import { Star } from "lucide-react";
import "../assets/style/Products.css";
import { useNavigate } from "react-router";

const Products = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(dummyProducts.map((p) => p.category))];

  const filteredProducts = dummyProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="products-page-container">
      <h1 className="products-page-title">Explore Our Products</h1>
      <p className="products-page-subtitle">
        Discover high-quality products across all categories
      </p>

      <div className="products-page-filters">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="products-page-search"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="products-page-select"
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="products-page-grid">
        {filteredProducts.length ? (
          filteredProducts.map((product, index) => (
            <div
              onClick={() => {
                navigate(`/product/${product._id}`);
              }}
              className="products-page-card"
              key={index}
            >
              <div className="products-page-image-wrapper">
                <img
                  src={product.image}
                  alt={product.name}
                  className="products-page-image"
                />
                {product.stock < 50 && (
                  <span className="products-page-badge">Low Stock</span>
                )}
              </div>
              <div className="products-page-info">
                <h3 className="products-page-name">{product.name}</h3>
                <p className="products-page-category">{product.category}</p>
                <div className="products-page-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.round(product.rating)
                          ? "products-page-star-filled"
                          : "products-page-star"
                      }
                    />
                  ))}
                  <span>{product.rating}</span>
                </div>
                <p className="products-page-description">
                  {product.description}
                </p>
                <h4 className="products-page-price">Rs {product.price}</h4>
                <button className="products-page-btn">Add to Cart</button>
              </div>
            </div>
          ))
        ) : (
          <p className="products-page-empty">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default Products;
