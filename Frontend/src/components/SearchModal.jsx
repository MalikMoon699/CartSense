import { X, Star } from "lucide-react";
import React, { useState, useEffect } from "react";
import API from "../utils/api";
import Loader from "../components/Loader";
import { useNavigate } from "react-router";

const SearchModal = ({ onClose }) => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
    const navigate = useNavigate("");

  const limit = 10;

  useEffect(() => {
    if (search.trim() === "") {
      setProducts([]);
      setHasMore(false);
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetchProducts(1, true);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const fetchProducts = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await API.get(`/adminProduct/getAllProducts`, {
        params: {
          page: pageNum,
          limit,
          search,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200 && res.data.success) {
        const { products: fetchedProducts, total } = res.data;
        if (reset) {
          setProducts(fetchedProducts);
        } else {
          setProducts((prev) => [...prev, ...fetchedProducts]);
        }

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

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage);
  };

  return (
    <div onClick={onClose} className="modal-overlay">
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          padding: "22px 16px 17px 16px",
          minWidth: "450px",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
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
            setSearch(e.target.value);
            setPage(1);
          }}
          className="login-input"
        />
        {search.length === 0 && (
          <p
            style={{
              fontSize: "10px",
              fontWeight: "300",
              color: "#ffffff57",
              marginBottom: "10px",
            }}
          >
            Start typing to search products...
          </p>
        )}
        {loading && products.length === 0 ? (
          <Loader />
        ) : products.length > 0 ? (
          <div className="search-results">
            {products.map((product) => (
              <div
                onClick={() => {
                  navigate(`product/${product._id}`);
                  onClose();
                }}
                key={product._id}
                className="search-result-card"
              >
                <img
                  src={product.images?.[0] || ""}
                  alt={product.name}
                  className="search-result-image"
                />
                <div className="search-result-info">
                  <h4>{product.name}</h4>
                  <div className="search-result-info-inner">
                    <p className="search-result-category">
                      {product.categories?.join(", ")}
                    </p>
                    <p className="search-result-price">Rs {product.price}</p>
                  </div>
                </div>
              </div>
            ))}
            {loading ||
              (hasMore && (
                <div className="loadMore-container">
                  {loading ? (
                    <Loader />
                  ) : (
                    hasMore && (
                      <button
                        onClick={handleLoadMore}
                        className="load-more-btn"
                      >
                        Load More
                      </button>
                    )
                  )}
                </div>
              ))}
          </div>
        ) : (
          !loading &&
          search && (
            <p className="no-results">No products found for "{search}"</p>
          )
        )}
      </div>
    </div>
  );
};

export default SearchModal;
