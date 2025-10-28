import React, { useEffect, useState } from "react";
import { IMAGES } from "../services/Constants";
import { formatDate } from "../services/Helpers";
import "../assets/style/AdminUsers.css";
import Loader from "./Loader";
import API from "../utils/api";
import { toast } from "sonner";

const AdminUsers = () => {
  const limit = 10;

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

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

  return (
    <div className="admin-users">
      <div className="admin-users-header">
        <div className="admin-users-info">
          <h2 className="admin-users-title">All Users</h2>
          <p className="admin-users-subtitle">
            Manage all your website’s users.
          </p>
        </div>
      </div>

      <div className="users-table">
        <div className="users-table-header">
          <span>Avatar</span>
          <span>Name</span>
          <span>Email</span>
          <span>Registered At</span>
          <span>Action</span>
        </div>

        <div className="users-table-rows">
          {users.map((user) => (
            <div key={user._id} className="user-table-row">
              <span className="user-avatar">
                <img
                  src={user?.profileImg || IMAGES.PlaceHolder}
                  alt={user.name}
                />
              </span>
              <span className="user-name">{user?.name}</span>
              <span className="user-email">{user?.email}</span>
              <span className="user-date">{formatDate(user?.createdAt)}</span>
              <span className="user-action">
                <button
                  onClick={() => {
                    handleDelete(user._id);
                  }}
                  className="delete-btn"
                >
                  Delete
                </button>
              </span>
            </div>
          ))}
        </div>

        <div style={{ margin: hasMore ? "":"-1px 0px"}} className="loadMore-container">
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
    </div>
  );
};

export default AdminUsers;
