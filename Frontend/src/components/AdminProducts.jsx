import React, { useEffect, useState } from "react";
import "../assets/style/AdminProducts.css";
import Loader from "./Loader";
import API from "../utils/api";
import { toast } from "sonner";
import AddProduct from "./AddProduct";
import { PackagePlus } from "lucide-react";

const AdminProducts = () => {
  const limit = 10;
  
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isCreate, setIsCreate] = useState(false);

  useEffect(() => {
    fetchProducts(page);
  }, []);

const fetchProducts = async (pageNum = 1) => {
  try {
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await API.get(`/adminProduct/getProducts`, {
      params: { page: pageNum, limit },
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 200) {
      const { products: fetchedProducts, total } = res.data;
      if (pageNum === 1) {
        setProducts(fetchedProducts);
      } else {
        setProducts((prev) => [...prev, ...fetchedProducts]);
      }
      if (products.length + fetchedProducts.length >= total) {
        setHasMore(false);
      }
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
    fetchProducts(nextPage);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.delete(`/adminProduct/deleteUser/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        toast.success("User deleted successfully");
        setUsers((prev) => prev.filter((user) => user._id !== id));
      } else {
        toast.error(res.data.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("An error occurred while deleting the user");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (product) => {

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
            <div key={product._id} className="product-table-row">
              <span className="product-avatar">
                <img src={product?.images?.[0]} />
              </span>
              <span className="product-name">{product?.name}</span>
              <span className="product-category">
                {product?.categories?.join(", ")}
              </span>
              <span className="product-price">{product?.price}</span>
              <span className="product-price">{product?.stock}</span>
              <span className="product-rating">{product?.rating || 0}</span>
              <span className="product-action">
                <button
                  onClick={() => {
                    handleUpdate(product);
                  }}
                  className="update-btn"
                >
                  Update
                </button>
                <button
                  onClick={() => {
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
          onClose={() => {
            setIsCreate(false);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
};

export default AdminProducts;
