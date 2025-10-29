import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { stocklabel } from "../services/Helpers";
import { Star, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";

const LandingNewArrivals = ({ products }) => {
  return (
    <div className="landing-new-arrival-section">
      <div className="landing-new-arrival-header">
        <h2 className="landing-new-arrival-title">New Arrivals</h2>
        <div className="landing-new-arrival-arrows">
          <button className="landing-new-arrival-prev">
            <ChevronLeft />
          </button>
          <button className="landing-new-arrival-next">
            <ChevronRight />
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={25}
        slidesPerView={4}
        navigation={{
          prevEl: ".landing-new-arrival-prev",
          nextEl: ".landing-new-arrival-next",
        }}
        breakpoints={{
          1024: { slidesPerView: 4 },
          768: { slidesPerView: 2 },
          480: { slidesPerView: 1 },
        }}
        className="landing-new-arrival-slider"
      >
        {products?.map((product, index) => (
          <SwiperSlide key={index}>
            <div className="landing-new-arrival-card">
              <div className="landing-new-arrival-img-box">
                <span className="landing-new-arrival-badge">NEW</span>
                {product?.topRated && (
                  <span className="landing-new-arrival-badge top-rated">
                    TOP RATED
                  </span>
                )}
                <img
                  src={product?.images?.[0]}
                  alt={product?.name}
                  className="landing-new-arrival-img"
                />
                <button className="landing-new-arrival-cart-btn">
                  <ShoppingCart />
                </button>
              </div>

              <div className="landing-new-arrival-info">
                <h4 className="landing-new-arrival-name">{product?.name}</h4>
                <div className="landing-new-arrival-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < product.rating ? "#FFD700" : "none"}
                      stroke="#FFD700"
                    />
                  ))}
                  <span className="landing-new-arrival-reviews">
                    ({product?.reviewsCount || 0})
                  </span>
                </div>
                <h3 className="landing-new-arrival-price">
                  Rs {product?.price}
                </h3>
                <span
                  className={`landing-new-arrival-stock ${
                    stocklabel(product?.stock) === "In Stock"
                      ? "in-stock"
                      : "limited-stock"
                  }`}
                >
                  {stocklabel(product?.stock)}
                </span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default LandingNewArrivals;
