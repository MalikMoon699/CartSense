import { useEffect, useState } from "react";
import "../assets/style/Landing.css";
import LandingHero from "../components/LandingHero";
import { Truck, Shield, Headphones, CreditCard } from "lucide-react";
import { landingCategory, landingServices } from "../services/Helpers";
import API from "../utils/api";
import { toast } from "sonner";
import LandingNewArrivals from "../components/LandingNewArrivals";
import LandingFooter from "../components/LandingFooter";

const iconMap = {
  Truck: <Truck />,
  Shield: <Shield />,
  Headphones: <Headphones />,
  CreditCard: <CreditCard />,
};

const LandingPage = () => {
  const limit = 10;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts(1);
  }, []);

  const fetchProducts = async (pageNum = 1) => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/adminProduct/getProducts`, {
        params: { page: pageNum, limit },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        const { products: fetchedProducts } = res.data;
        if (pageNum === 1) {
          setProducts(fetchedProducts);
        } else {
          setProducts((prev) => [...prev, ...fetchedProducts]);
        }
      } else {
        toast.error(res.data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("An error occurred while fetching products");
    }
  };

  return (
    <div className="landing-page-container">
      <LandingHero />
      <div className="landing-category-section">
        <h2 className="landing-category-title">Shop by Category</h2>
        <p className="landing-category-subtitle">
          Discover our wide range of products across different categories
        </p>

        <div className="landing-category-grid">
          {landingCategory.map((category, index) => (
            <div className="landing-category-card" key={index}>
              <div className="landing-category-image-wrapper">
                <img
                  src={category.image}
                  alt={category.title}
                  className="landing-category-image"
                />
              </div>
              <h4 className="landing-category-name">{category.title}</h4>
            </div>
          ))}
        </div>
      </div>
      <LandingNewArrivals products={products} />
      <div className="landing-services-section">
        {landingServices.map((service, index) => (
          <div
            key={index}
            className="landing-services-card"
          >
            <div className="landing-services-icon">{iconMap[service.icon]}</div>
            <h3 className="landing-services-title">{service.title}</h3>
            <span className="landing-services-subtitle">
              {service.subtitle}
            </span>
          </div>
        ))}
      </div>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
