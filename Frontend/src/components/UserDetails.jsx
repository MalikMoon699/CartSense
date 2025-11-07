import React, { useEffect, useState } from "react";
import { X, Upload } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { IMAGES } from "../services/Constants";
import API from "../utils/api";
import { toast } from "sonner";

const UserDetails = ({ setSidebarType }) => {
  const { currentUser, logout } = useAuth();
  const [profileImg, setProfileImg] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setProfileImg(currentUser?.profileImg || "");
    setName(currentUser?.name || "");
    setEmail(currentUser?.email || "");
  }, [currentUser]);

  useEffect(() => {
    return () => {
      if (profileImg && profileImg.startsWith("blob:")) {
        URL.revokeObjectURL(profileImg);
      }
    };
  }, [profileImg]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfileImg(imageURL);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await API.put(
        `/auth/updateUserPassword/${currentUser._id}`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message || "Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while updating your password"
      );
    }
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);

      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput && fileInput.files[0]) {
        formData.append("profileImg", fileInput.files[0]);
      }

      const res = await API.put(
        `/auth/updateUser/${currentUser._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(res.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating profile");
    }
  };

  return (
    <div
      onClick={() => setSidebarType(null)}
      style={{ backdropFilter: "blur(2px)" }}
      className="modal-overlay"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="right-sidebar sidebar"
      >
        <div className="sidebar-header">
          <h2>Profile</h2>
          <button className="close-btn" onClick={() => setSidebarType(null)}>
            <X size={15} />
          </button>
        </div>

        <div className="profile-section">
          <img
            src={profileImg || IMAGES.PlaceHolder}
            alt="User Avatar"
            className="profile-avatar"
          />
          <h3>{name}</h3>
          <p>{email}</p>
        </div>

        <div className="update-section">
          <h3>Update Profile</h3>
          <input
            type="text"
            value={name}
            className="login-input"
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
          />
          <input
            type="email"
            placeholder="Email Address"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="upload-label">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
            <span className="icon">
              <Upload />
            </span>
            Upload Avatar
          </label>
          <button onClick={handleSaveChanges} className="btn save-btn">
            Save Changes
          </button>
        </div>

        <div className="update-section">
          <h3>Update Password</h3>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            className="login-input"
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            className="login-input"
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            className="login-input"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button className="btn update-btn" onClick={handlePasswordUpdate}>
            Update Password
          </button>
        </div>

        <div className="logout-section">
          <button onClick={logout} className="btn logout-btn">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
