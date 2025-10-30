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
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts(1, searchTerm, selectedCategory);
  }, []);

  const fetchProducts = async (pageNum = 1, search = "", category = "All") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await API.get(`/adminProduct/getAllProducts`, {
        params: { page: pageNum, limit, search, category },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200 && res.data.success) {
        const {
          products: fetchedProducts,
          total,
          categories: allCats,
        } = res.data;

        if (pageNum === 1) {
          setProducts(fetchedProducts);
        } else {
          setProducts((prev) => [...prev, ...fetchedProducts]);
        }

        setCategories(allCats);

        if (products.length + fetchedProducts.length >= total) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setPage(1);
    fetchProducts(1, term, selectedCategory);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setPage(1);
    fetchProducts(1, searchTerm, category);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, searchTerm, selectedCategory);
  };

  return (
    <div className="products-page-container">
      <h1 className="products-page-title">Explore Our Products</h1>

      <div className="products-page-filters">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
          className="products-page-search"
        />

        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="products-page-select"
        >
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
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

                <p className="products-page-description">
                  {product.description?.slice(0, 60)}...
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

      <div className="loadMore-container">
        {loading ? (
          <Loader style={{ width: "100%", textAlign: "center" }} />
        ) : (
          hasMore && (
            <button onClick={handleLoadMore} className="load-more-btn">
              Load More
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default Products;
