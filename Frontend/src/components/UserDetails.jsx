import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
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

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.put(
        `/auth/updateUser/${currentUser._id}`,
        { name, profileImg },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(res.data.message || "Failed to update profile");
        console.error(res.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred");
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
      const res = await fetch(
        `${API}/auth/updateUserPassword/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.message || "Failed to update password");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("An error occurred while updating your password");
    }
  };

  return (
    <div className="right-sidebar sidebar">
      <div className="sidebar-header">
        <h2>Profile</h2>
        <button className="close-btn" onClick={()=> setSidebarType(null)}>
          <X size={20} />
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
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
        />
        <input type="email" value={email} readOnly />
        <label className="upload-label">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />
          ⬆ Upload Avatar
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
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
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
  );
};

export default UserDetails;
