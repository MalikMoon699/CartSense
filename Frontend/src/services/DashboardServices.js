import API from "../utils/api";
import { toast } from "sonner";

export const fetchAllUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.get(`/adminUser/getUsers`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data.success) {
      return res.data.users;
    } else {
      toast.error(res.data.message || "Failed to fetch users");
      return [];
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    toast.error("An error occurred while fetching users");
    return [];
  }
};

export const fetchAllProducts = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.get(`/adminProduct/getProducts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.data.success) {
      return res.data.products;
    } else {
      toast.error(res.data.message || "Failed to fetch users");
      return [];
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    toast.error("An error occurred while fetching users");
    return [];
  }
};

export const fetchAllOrders = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.get(`/order/getAllOrders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.data.success) {
      return res.data.orders;
    } else {
      toast.error(res.data.message || "Failed to fetch users");
      return [];
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    toast.error("An error occurred while fetching users");
    return [];
  }
};
