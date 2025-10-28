import React, { useEffect, useState } from "react";
import { IMAGES } from "../services/Constants";
import "../assets/style/AdminProducts.css";
import Loader from "./Loader";
import API from "../utils/api";
import { toast } from "sonner";
import AddProduct from "./AddProduct";
import { PackagePlus } from "lucide-react";

const AdminProducts = () => {
  const limit = 10;
  
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isCreate, setIsCreate] = useState(false);

  useEffect(() => {
    fetchUsers(page);
  }, []);

  const fetchUsers = async (pageNum = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.get(`/adminUser/getUsers`, {
        params: { page: pageNum, limit, role: "user" },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        const { users: fetchedUsers, total } = res.data;
        if (pageNum === 1) {
          setUsers(fetchedUsers);
        } else {
          setUsers((prev) => [...prev, ...fetchedUsers]);
        }
        if (users.length + fetchedUsers.length >= total) {
          setHasMore(false);
        }
      } else {
        toast.error(res.data.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("An error occurred while fetching users");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchUsers(nextPage);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.delete(`/adminUser/deleteUser/${id}`, {
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

  const DummyProducts = [
    {
      _id: "4",
      name: "Running Shoes",
      category: "Footwear",
      price: 5999,
      stock: 60,
      rating: 4.7,
      images: [
        "https://res.cloudinary.com/demo/image/upload/v1728810004/shoes.jpg",
      ],
    },
    {
      _id: "5",
      name: "Smart Watch Series 7",
      category: "Gadgets",
      price: 24999,
      stock: 20,
      rating: 4.9,
      images: [
        "https://res.cloudinary.com/demo/image/upload/v1728810005/smart_watch.jpg",
      ],
    }
  ];

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
            <PackagePlus size={16}/>
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
          {DummyProducts.map((product) => (
            <div key={product._id} className="product-table-row">
              <span className="product-avatar">
                <img src={product?.images?.[0]} />
              </span>
              <span className="product-name">{product?.name}</span>
              <span className="product-category">{product?.category}</span>
              <span className="product-price">{product?.price}</span>
              <span className="product-price">{product?.price}</span>
              <span className="product-rating">{product?.rating}</span>
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
          }}
        />
      )}
    </div>
  );
};

export default AdminProducts;
