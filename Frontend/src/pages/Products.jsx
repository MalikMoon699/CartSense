import React, { useState, useEffect } from "react";
import { RefreshCw, Search } from "lucide-react";
import "../assets/style/Products.css";
import { useNavigate } from "react-router";
import API from "../utils/api";
import Loader from "../components/Loader";

const Products = () => {
  const navigate = useNavigate();
  const limit = 10;
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts(1, true, "All", "");
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setPage(1);
      fetchProducts(1, true, selectedCategory, "");
    }
  }, [searchTerm]);

  const fetchProducts = async (
    pageNum = 1,
    reset = false,
    categoryParam = null,
    searchParam = null
  ) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const categoryToSend =
        (categoryParam ?? selectedCategory) === "All"
          ? ""
          : categoryParam ?? selectedCategory;

      const searchToSend = searchParam ?? searchTerm ?? "";

      const res = await API.get(`/adminProduct/getAllProducts`, {
        params: {
          page: pageNum,
          limit,
          search: searchToSend,
          category: categoryToSend,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200 && res.data.success) {
        const { products: fetchedProducts, total, categories } = res.data;

        setProducts((prev) =>
          reset ? fetchedProducts : [...prev, ...fetchedProducts]
        );
        setHasMore(
          (reset
            ? fetchedProducts.length
            : products.length + fetchedProducts.length) < total
        );
      } else {
        if (reset) setProducts([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      if (reset) setProducts([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/adminProduct/getcategories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setCategories(res.data.categories || []);
      } else {
        toast.error(res.data.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Server error while fetching categories");
    }
  };

  const handleCategoryClick = (cat) => {
    setPage(1);
    setSelectedCategory(cat);
    fetchProducts(1, true, cat, searchTerm);
  };

  const handleSearch = (searchValue = null) => {
    setPage(1);
    const searchToUse = searchValue !== null ? searchValue : searchTerm;
    fetchProducts(1, true, selectedCategory, searchToUse);
  };

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSearchTerm("");
    setPage(1);
    fetchProducts(1, true, "All", "");
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, false, selectedCategory, searchTerm);
  };


  return (
    <div className="products-page-wrapper">
      <div className="products-page-sidebar">
        <h3 className="sidebar-title">Filters</h3>

        <div className="filter-block">
          <h4>Category</h4>
          <div className="category-list">
            <div
              className={`category-item ${
                selectedCategory === "All" ? "active-category" : ""
              }`}
              onClick={() => handleCategoryClick("All")}
            >
              All
            </div>
            {categories.map((cat, i) => (
              <div
                key={i}
                className={`category-item ${
                  selectedCategory === cat ? "active-category" : ""
                }`}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>

        <div className="filter-actions">
          <button onClick={handleResetFilters} className="reset-filter-btn">
            <RefreshCw size={16} /> Reset
          </button>
        </div>
      </div>

      <div className="products-page-content">
        <div className="products-page-topbar">
          <div className="products-page-topbar-search-input">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSearch(e.target.value)
              }
              className="products-page-search"
            />
            <span
              className="icon"
              onClick={() => handleSearch(searchTerm)}
              role="button"
              aria-label="Search"
            >
              <Search />
            </span>
          </div>
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
