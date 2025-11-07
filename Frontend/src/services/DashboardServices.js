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

export const fetchTotalUsersCount = async (
  setTotalUsers,
  setLoading = null
) => {
  try {
    if (setLoading) setLoading(true);
    const token = localStorage.getItem("token");
    const res = await API.get(`/adminUser/getTotalUsersCount`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data.success) {
      setTotalUsers(res.data.totalUsers);
    } else {
      toast.error("Failed to fetch total Users count");
    }
  } catch (error) {
    console.error("Error fetching total orders count:", error);
    toast.error("Server error fetching total orders count");
  } finally {
    if (setLoading) setLoading(false);
  }
};

export const fetchTotalProductsCount = async (
  setTotalProducts,
  setLoading = null
) => {
  try {
    if (setLoading) setLoading(true);
    const token = localStorage.getItem("token");
    const res = await API.get(`/adminProduct/getTotalProductsCount`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data.success) {
      setTotalProducts(res.data.totalProducts);
    } else {
      toast.error("Failed to fetch total Products count");
    }
  } catch (error) {
    console.error("Error fetching total orders count:", error);
    toast.error("Server error fetching total orders count");
  } finally {
    if (setLoading) setLoading(false);
  }
};

export const fetchTotalOrdersCount = async (
  setTotalOrders,
  setLoading = null
) => {
  try {
    if (setLoading) setLoading(true);
    const token = localStorage.getItem("token");
    const res = await API.get(`/order/getTotalOrdersCount`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data.success) {
      setTotalOrders(res.data.totalOrders);
    } else {
      toast.error("Failed to fetch total orders count");
    }
  } catch (error) {
    console.error("Error fetching total orders count:", error);
    toast.error("Server error fetching total orders count");
  } finally {
    if (setLoading) setLoading(false);
  }
};

export const fetchTotalRevenue = async (setTotalRevenue, setLoading = null) => {
  try {
    if (setLoading) setLoading(true);
    const token = localStorage.getItem("token");
    const res = await API.get(`/order/getTotalRevenue`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data.success) {
      setTotalRevenue(res.data.totalRevenue);
    } else {
      toast.error("Failed to fetch total revenue");
    }
  } catch (error) {
    console.error("Error fetching total revenue:", error);
    toast.error("Server error fetching total revenue");
  } finally {
    if (setLoading) setLoading(false);
  }
};