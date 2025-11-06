import { IMAGES } from "./Constants";
import API from "../utils/api";
import { toast } from "sonner";

export const formatDate = (isoString) => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const stocklabel = (stock) => {
  if (stock === 0) {
    return "out of Stock ";
  } else if (stock < 10) {
    return "Limited Stock";
  } else {
    return "In Stock";
  }
};

export const handleAddToCart = async (
  product,
  currentUser,
  setLoading = null,
  setSidebarType = null
) => {
  if (!currentUser) {
    toast.error("Please log in to add items to your cart.");
    return;
  }

  try {
    setLoading(product._id);
    const token = localStorage.getItem("token");
    const res = await API.post(
      `/cart/addProductCart`,
      { userId: currentUser._id, productId: product._id, quantity: 1 },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.data.success) {
      toast.success(`${product.name} added to your cart!`);
    } else {
      toast.info(res.data.message || "Product already in cart.");
    }
    setSidebarType("cartsidebar");
  } catch (error) {
    console.error("Error adding product to cart:", error);
    toast.error("Failed to add product to cart. Please try again.");
  } finally {
    setLoading(null);
  }
};

export const handleEmptyCart = async (currentUser) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.delete(`/cart/emptyCart/${currentUser._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error emptying cart:", error);
    toast.error("Server error emptying cart");
  }
};