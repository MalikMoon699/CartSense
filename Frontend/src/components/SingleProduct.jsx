import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Star } from "lucide-react";
import API from "../utils/api";
import Loader from "./Loader";

const SingleProduct = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();

  const [product, setProduct] = useState(null);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newReview, setNewReview] = useState({
    name: "",
    description: "",
    rating: 0,
  });

  useEffect(() => {
    if (currentUser?.name) {
      setNewReview((prev) => ({ ...prev, name: currentUser.name }));
    }
  }, [currentUser]);

  useEffect(() => {
    fetchProduct();
  }, [id]);


    const fetchProduct = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const res = await API.get(`/adminProduct/getSingleProducts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const productData = res.data.product;
        setProduct(productData);
        setReviews(productData.reviews || []);

        if (productData.categories?.length > 0) {
          const category = productData.categories[0];
          const relatedRes = await API.get(
            `/adminProduct/getSameCategoriesProducts/${category}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setSuggestedProducts(
            relatedRes.data.products.filter((p) => p._id !== productData._id)
          );
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };


  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.description || newReview.rating === 0) return;

    try {
      const token = localStorage.getItem("token");
      const res = await API.post(`/adminProduct/addReview/${id}`, newReview, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReviews(res.data.product.reviews);
      setNewReview({ description: "", rating: 0 });
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (loading)
    return <Loader size="80" style={{ height: "80vh", width: "100%" }} />;
  if (!product) return <div>Product not found.</div>;

  return (
    <div className="single-product-container">
      <div className="single-product-info">
        <div className="single-product-image-wrapper">
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="single-product-image"
          />
        </div>

        <div className="single-product-details">
          <h1 className="single-product-title">{product.name}</h1>
          <p className="single-product-category">
            {product.categories?.join(", ")}
          </p>
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

        {currentUser ? (
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
        ) : (
          <p className="login-warning">Please log in to write a review.</p>
        )}
      </div>

      <div className="single-product-suggestions">
        <h2>You may also like</h2>
        <div className="single-product-suggestion-grid">
          {suggestedProducts.map((p) => (
            <div key={p._id} className="single-product-suggestion-card">
              <img src={p.images?.[0]} alt={p.name} />
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
