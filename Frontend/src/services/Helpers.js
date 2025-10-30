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

export const landingHeroSlides = [
  {
    image: IMAGES.heroBackground1,
    title: "Premium Electronics",
    subtitle: "Discover the latest tech innovations",
    description: "Up to 50% off on premium headphones, smartwatches, and more",
    buttonText: "Shop Electronics",
  },
  {
    image: IMAGES.heroBackground2,
    title: "Fashion Forward",
    subtitle: "Style meets comfort",
    description: "Nammy in des ner clot ng and accessories",
    buttonText: "Explore Fashion",
  },

  {
    image: IMAGES.heroBackground3,
    title: "Home & Garden",
    subtitle: "Tansform your space",
    description: "Beautiful furniture and decor for every home",
    buttonText: "Shop Home",
  },
];

export const landingCategory = [
  {
    image: IMAGES.Category1,
    title: "Electronics",
    buttonClick: "Shop Electronics",
  },
  {
    image: IMAGES.heroBackground2,
    title: "Fashion",
    buttonClick: "Shop Fashion",
  },
  {
    image: IMAGES.heroBackground3,
    title: "Home & Garden",
    buttonClick: "Shop Home",
  },
  {
    image: IMAGES.Category4,
    title: "Sports",
    buttonClick: "Shop Sports",
  },
  {
    image: IMAGES.Category5,
    title: "Books",
    buttonClick: "Shop Books",
  },
  {
    image: IMAGES.Category6,
    title: "Beauty",
    buttonClick: "Shop Beauty",
  },
  {
    image: IMAGES.Category7,
    title: "Automotive",
    buttonClick: "Shop Automotive",
  },
  {
    image: IMAGES.Category8,
    title: "Kids & Baby",
    buttonClick: "Shop Kids",
  },
];

export const landingServices = [
  {
    icon: "Truck",
    title: "Free Shipping",
    subtitle: "Free shipping on orders over $50 worldwide",
  },
  {
    icon: "Shield",
    title: "Secure Payment",
    subtitle: "100% secure payment with SSL encryption",
  },
  {
    icon: "Headphones",
    title: "24/7 Support",
    subtitle: " Dedicated customer support available anytime",
  },
  {
    icon: "CreditCard",
    title: "Easy Returns",
    subtitle: "30-day return policy for your peace of mind",
  },
];

export const handleAddToCart = async (product, currentUser) => {
  if (!currentUser) {
    toast.error("Please log in to add items to your cart.");
    return;
  }

  try {
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
  } catch (error) {
    console.error("Error adding product to cart:", error);
    toast.error("Failed to add product to cart. Please try again.");
  }
};
