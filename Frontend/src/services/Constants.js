import PlaceHolder from "../assets/images/Placeholder.jpg";
import SiteLogo from "../assets/images/SiteLogo.png";
import heroBackground1 from "../assets/images/Hero-background-1.jpeg";
import heroBackground2 from "../assets/images/Hero-background-2.webp";
import heroBackground3 from "../assets/images/Hero-background-3.jpg";
import Category1 from "../assets/images/Category-1.jpg";
import Category4 from "../assets/images/Category-4.avif";
import Category5 from "../assets/images/Category-5.webp";
import Category6 from "../assets/images/Category-6.avif";
import Category7 from "../assets/images/Category-7.jpg";
import Category8 from "../assets/images/Category-8.jpg";

export const IMAGES = {
  PlaceHolder,
  SiteLogo,
  heroBackground1,
  heroBackground2,
  heroBackground3,
  Category1,
  Category4,
  Category5,
  Category6,
  Category7,
  Category8,
};

export const landingHeroSlides = [
  {
    image: IMAGES.heroBackground1,
    title: "Premium Electronics",
    subtitle: "Discover the latest tech innovations",
    description: "Up to 50% off on premium headphones, smartwatches, and more",
    buttonText: "Shop Electronics",
    action: "Electronics",
  },
  {
    image: IMAGES.heroBackground2,
    title: "Fashion Forward",
    subtitle: "Style meets comfort",
    description: "Nammy in des ner clot ng and accessories",
    buttonText: "Explore Fashion",
    action: "Fashion",
  },

  {
    image: IMAGES.heroBackground3,
    title: "Home & Garden",
    subtitle: "Tansform your space",
    description: "Beautiful furniture and decor for every home",
    buttonText: "Shop Home",
    action: "Home & Garden",
  },
];

export const landingCategory = [
  {
    image: IMAGES.Category1,
    title: "Electronics",
    buttonClick: "Shop Electronics",
    action: "Electronics",
  },
  {
    image: IMAGES.heroBackground2,
    title: "Fashion",
    buttonClick: "Shop Fashion",
    action: "Fashion",
  },
  {
    image: IMAGES.heroBackground3,
    title: "Home & Garden",
    buttonClick: "Shop Home",
    action: "Home & Garden",
  },
  {
    image: IMAGES.Category4,
    title: "Sports",
    buttonClick: "Shop Sports",
    action: "Sports",
  },
  {
    image: IMAGES.Category5,
    title: "Books",
    buttonClick: "Shop Books",
    action: "Books",
  },
  {
    image: IMAGES.Category6,
    title: "Beauty",
    buttonClick: "Shop Beauty",
    action: "Beauty",
  },
  {
    image: IMAGES.Category7,
    title: "Automotive",
    buttonClick: "Shop Automotive",
    action: "Automotive",
  },
  {
    image: IMAGES.Category8,
    title: "Kids & Baby",
    buttonClick: "Shop Kids",
    action: "Kids & Baby",
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

export const countryCityData = {
  Pakistan: ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad"],
  USA: ["New York", "Los Angeles", "Chicago", "Houston", "Miami"],
  UK: ["London", "Manchester", "Liverpool", "Birmingham", "Leeds"],
  Canada: ["Toronto", "Vancouver", "Calgary", "Montreal", "Ottawa"],
  Australia: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
};