import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { dummyProducts } from "../services/Helpers";
import { useAuth } from "../contexts/AuthContext";
import { Star } from "lucide-react";

const SingleProduct = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const product = dummyProducts[id] || dummyProducts[0];

  const [reviews, setReviews] = useState([
    {
      name: "Ali Khan",
      rating: 5,
      description: "Amazing product, highly recommend!",
    },
    {
      name: "Sara Ahmed",
      rating: 4,
      description: "Good quality but slightly pricey.",
    },
  ]);

  const [newReview, setNewReview] = useState({
    name: currentUser?.name || "",
    description: "",
    rating: 0,
  });

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.description || newReview.rating === 0)
      return;

    setReviews([...reviews, newReview]);
    setNewReview({description: "", rating: 0 });
  };

  const suggestedProducts = dummyProducts
    .filter((p) => p.category === product.category && p.name !== product.name)
    .slice(0, 4);

  return (
    <div className="single-product-container">
      <div className="single-product-info">
        <div className="single-product-image-wrapper">
          <img
            src={product.image}
            alt={product.name}
            className="single-product-image"
          />
        </div>

        <div className="single-product-details">
          <h1 className="single-product-title">{product.name}</h1>
          <p className="single-product-category">{product.category}</p>
          <div className="single-product-rating">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                className={
                  i < Math.round(product.rating)
                    ? "single-product-star-filled"
                    : "single-product-star"
                }
              />
            ))}
            <span>{product.rating} / 5</span>
          </div>
          <p className="single-product-description">{product.description}</p>
          <h2 className="single-product-price">Rs {product.price}</h2>
          <p className="single-product-stock">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>

          <button className="single-product-btn">Add to Cart</button>
        </div>
      </div>

      <div className="single-product-reviews">
        <h2>Customer Reviews</h2>

        <div className="single-product-review-list">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} className="single-product-review-card">
                <div className="single-product-review-header">
                  <h4>{review.name}</h4>
                  <div>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < review.rating
                            ? "single-product-star-filled"
                            : "single-product-star"
                        }
                      />
                    ))}
                  </div>
                </div>
                <p>{review.description}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet. Be the first to review!</p>
          )}
        </div>

        <form
          className="single-product-review-form"
          onSubmit={handleReviewSubmit}
        >
          <h3>Write a Review</h3>
          <textarea
            placeholder="Write your review..."
            value={newReview.description}
            onChange={(e) =>
              setNewReview({ ...newReview, description: e.target.value })
            }
          ></textarea>

          <div className="single-product-stars-select">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={22}
                onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
                className={
                  i < newReview.rating
                    ? "single-product-star-filled"
                    : "single-product-star"
                }
              />
            ))}
          </div>

          <button type="submit">Submit Review</button>
        </form>
      </div>

      <div className="single-product-suggestions">
        <h2>You may also like</h2>
        <div className="single-product-suggestion-grid">
          {suggestedProducts.map((p, index) => (
            <div key={index} className="single-product-suggestion-card">
              <img src={p.image} alt={p.name} />
              <h4>{p.name}</h4>
              <p>Rs {p.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
