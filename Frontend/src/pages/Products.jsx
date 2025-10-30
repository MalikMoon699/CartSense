import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import "../assets/style/Products.css";
import { useNavigate } from "react-router";
import API from "../utils/api";
import Loader from "../components/Loader";

const Products = () => {
  const navigate = useNavigate();
  const limit = 10;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minRating, setMinRating] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts(1, true);
  }, []);

  const fetchProducts = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await API.get(`/adminProduct/getAllProducts`, {
        params: {
          page: pageNum,
          limit,
          search: searchTerm,
          category: selectedCategory,
          minPrice: priceRange.min,
          maxPrice: priceRange.max,
          minRating,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200 && res.data.success) {
        const {
          products: fetchedProducts,
          total,
          categories,
          maxPrice,
        } = res.data;

        if (reset) {
          setProducts(fetchedProducts);
        } else {
          setProducts((prev) => [...prev, ...fetchedProducts]);
        }

        setCategories(categories);
        setMaxPrice(maxPrice);
        setHasMore(
          (reset
            ? fetchedProducts.length
            : products.length + fetchedProducts.length) < total
        );
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = () => {
    setPage(1);
    fetchProducts(1, true);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage);
  };

  return (
    <div className="products-page-wrapper">
      <div className="products-page-sidebar">
        <h3 className="sidebar-title">Filters</h3>

        {/* Price Filter */}
        <div className="filter-block">
          <h4>Price Range</h4>
          <input
            type="range"
            min="0"
            max={maxPrice}
            value={priceRange.max}
            onChange={(e) =>
              setPriceRange({ ...priceRange, max: e.target.value })
            }
            className="filter-range"
          />
          <div className="price-inputs">
            <input
              type="number"
              value={priceRange.min}
              onChange={(e) =>
                setPriceRange({ ...priceRange, min: e.target.value })
              }
              placeholder="Min"
            />
            <input
              type="number"
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange({ ...priceRange, max: e.target.value })
              }
              placeholder="Max"
            />
          </div>
        </div>

        {/* Rating Filter */}
        <div className="filter-block">
          <h4>Rating</h4>
          {[5, 4, 3, 2, 1].map((r) => (
            <div
              key={r}
              onClick={() => {
                setMinRating(r);
                handleFilterChange();
              }}
              className={`star-filter-row ${minRating === r ? "active" : ""}`}
            >
              {[...Array(r)].map((_, i) => (
                <Star key={i} size={16} className="products-page-star-filled" />
              ))}
            </div>
          ))}
        </div>

        {/* Category Filter */}
        <div className="filter-block">
          <h4>Categories</h4>
          <div className="category-list">
            {categories.map((cat, i) => (
              <div
                key={i}
                className={`category-item ${
                  selectedCategory === cat ? "active-category" : ""
                }`}
                onClick={() => {
                  setSelectedCategory(cat);
                  handleFilterChange();
                }}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleFilterChange} className="apply-filter-btn">
          Apply Filters
        </button>
      </div>

      <div className="products-page-content">
        <div className="products-page-topbar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onBlur={handleFilterChange}
            className="products-page-search"
          />
        </div>

        <div className="products-page-grid">
          {products.length ? (
            products.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="products-page-card"
              >
                <div className="products-page-image-wrapper">
                  <img
                    src={product.images?.[0] || ""}
                    alt={product.name}
                    className="products-page-image"
                  />
                </div>
                <div className="products-page-info">
                  <h3 className="products-page-name">{product.name}</h3>
                  <p className="products-page-category">
                    {product.categories?.join(", ")}
                  </p>
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
                    <span>{product.rating?.toFixed(1) || "0"}</span>
                  </div>
                  <h4 className="products-page-price">Rs {product.price}</h4>
                </div>
              </div>
            ))
          ) : (
            <p className="products-page-empty">No products found.</p>
          )}
        </div>

        <div className="loadMore-container">
          {loading ? (
            <Loader />
          ) : (
            hasMore && (
              <button onClick={handleLoadMore} className="load-more-btn">
                Load More
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
