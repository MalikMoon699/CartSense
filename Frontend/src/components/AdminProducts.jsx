import React, { useEffect, useState } from "react";
import "../assets/style/AdminProducts.css";
import Loader from "./Loader";
import API from "../utils/api";
import { toast } from "sonner";
import AddProduct from "./AddProduct";
import { PackagePlus, RefreshCcw, Search } from "lucide-react";
import ViewProductDetails from "./ViewProductDetails";

const AdminProducts = () => {
  const limit = 10;

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailsModel, setIsDetailsModel] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts(page);
  }, []);

  const fetchProducts = async (pageNum = 1, searchValue = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.get(`/adminProduct/getProducts`, {
        params: { page: pageNum, limit, search: searchValue },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        const { products: fetchedProducts, total } = res.data;

        if (pageNum === 1) {
          setProducts(fetchedProducts);
        } else {
          setProducts((prev) => [...prev, ...fetchedProducts]);
        }

        setHasMore(pageNum * limit < total);
      } else {
        toast.error(res.data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("An error occurred while fetching products");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, searchTerm);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.delete(`/adminProduct/deleteProduct/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        toast.success("Product deleted successfully");
        setProducts((prev) => prev.filter((product) => product._id !== id));
      } else {
        toast.error(res.data.message || "Failed to delete Product");
      }
    } catch (error) {
      console.error("Error deleting Product:", error);
      toast.error("An error occurred while deleting the Product");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/adminProduct/getProducts`, {
        params: { page: 1, limit },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        const { products: fetchedProducts, total } = res.data;
        setProducts(fetchedProducts);
        setPage(1);
        setHasMore(fetchedProducts.length < total);
      } else {
        toast.error(res.data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Error refreshing products:", error);
      toast.error("An error occurred while refreshing products");
    } finally {
      setRefreshLoading(false);
    }
  };

  const handleSearch = (searchValue = null) => {
    const searchToUse = searchValue !== null ? searchValue : searchTerm;
    setPage(1);
    fetchProducts(1, searchToUse);
  };

  return (
    <div className="admin-users">
      <div className="admin-users-header">
        <div className="admin-users-info">
          <h2 className="admin-users-title">All Products</h2>
          <p className="admin-users-subtitle">
            Manage all your website’s products.
          </p>
        </div>
        <button
          onClick={() => {
            setIsCreate(true);
          }}
          className="add-user-btn"
        >
          <span className="icon">
            <PackagePlus size={16} />
          </span>
          Add Product
        </button>
        <button
          onClick={handleRefresh}
          disabled={refreshLoading}
          className="refresh-btn"
        >
          {refreshLoading ? (
            <Loader color="white" size="20" style={{ width: "69px" }} />
          ) : (
            <>
              <span className="icon">
                <RefreshCcw size={16} />
              </span>
              Refresh
            </>
          )}
        </button>
      </div>
      <div className="products-page-topbar">
        <div className="products-page-topbar-search-input">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(e.target.value)}
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
      <div className="products-table">
        <div className="products-table-header">
          <span>Image</span>
          <span>Title</span>
          <span>Category</span>
          <span>Price</span>
          <span>Stock</span>
          <span>Ratings</span>
          <span>Action</span>
        </div>

        <div className="products-table-rows">
          {products.map((product) => (
            <div
              onClick={() => {
                setIsDetailsModel(product);
              }}
              key={product._id}
              className="product-table-row"
            >
              <span className="product-avatar">
                <img src={product?.images?.[0]} />
              </span>
              <span className="product-name">{product?.name}</span>
              <span className="product-category">
                {product?.categories?.join(", ")}
              </span>
              <span className="product-price">{product?.price}</span>
              <span className="product-price">{product?.stock}</span>
              <span className="product-rating">
                {Math.round(product?.rating || 0)}
              </span>
              <span className="product-action">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingProduct(product);
                    setIsCreate(true);
                  }}
                  className="update-btn"
                >
                  Update
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(product._id);
                  }}
                  className="delete-btn"
                >
                  Delete
                </button>
              </span>
            </div>
          ))}
        </div>

        <div
          style={{ margin: hasMore ? "" : "-1px 0px" }}
          className="loadMore-container"
        >
          {loading ? (
            <Loader style={{ width: "auto" }} />
          ) : (
            hasMore && (
              <button onClick={handleLoadMore} className="load-more-btn">
                Load More
              </button>
            )
          )}
        </div>
      </div>
      {isCreate && (
        <AddProduct
          product={editingProduct}
          onClose={() => {
            setIsCreate(false);
            setEditingProduct(null);
            fetchProducts();
          }}
        />
      )}
      {isDetailsModel && (
        <ViewProductDetails
          isDetailsModel={isDetailsModel}
          setIsDetailsModel={setIsDetailsModel}
        />
      )}
    </div>
  );
};

export default AdminProducts;
