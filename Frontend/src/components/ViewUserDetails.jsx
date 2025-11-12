import { X } from "lucide-react";
import { useNavigate } from "react-router";
import { IMAGES } from "../services/Constants";
import { useState } from "react";
import {
  getCurrencySymbol,
  getPriceByCurrency,
} from "../services/CurrencyHelper";
import { useAuth } from "../contexts/AuthContext";
import { fetchCart, fetchOrders } from "../services/Helpers";
import Loader from "./Loader";

const ViewUserDetails = ({
  isDetailsModel,
  setIsDetailsModel,
  handleDelete,
}) => {
  const { currentUser } = useAuth();
  if (!isDetailsModel) return null;
  const { profileImg, name, email, createdAt, updatedAt, orders, cart, _id } =
    isDetailsModel;

  const [orderProducts, setOrderProducts] = useState([]);
  const [orderProductsLoading, setOrdersProductsLoading] = useState(false);
  const [cartProducts, setCartProducts] = useState([]);
  const [cartProductsLoading, setCartProductsLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <div onClick={() => setIsDetailsModel(null)} className="modal-overlay">
      <div
        style={{ width: "450px", padding: "22px 20px" }}
        onClick={(e) => e.stopPropagation()}
        className="modal-content"
      >
        <div className="modal-header">
          <h2 className="modal-title">User Details</h2>
          <button
            onClick={() => setIsDetailsModel(null)}
            className="modal-close-btn"
          >
            <X />
          </button>
        </div>

        <div className="view-my-order-details-body">
          <div className="view-my-order-details-product">
            <h4 className="view-my-order-details-section-title">
              Profile Details
            </h4>
            <div className="view-my-order-details-product-inner">
              <img
                src={profileImg || IMAGES.PlaceHolder}
                alt={name}
                className="view-my-order-details-product-image"
              />
              <div className="view-my-order-details-product-info">
                <h3 className="view-my-order-details-product-name">{name}</h3>
                <div className="view-my-order-details-product-inner-info">
                  <p className="view-my-order-details-product-price">
                    Email: {email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <hr className="view-my-order-details-divider" />

          <div className="view-my-order-details-section">
            <h4 className="view-my-order-details-section-title">
              Account Information
            </h4>
            <div className="view-my-order-details-info">
              <div className="cart-sidebar-total-price">
                <strong>User ID:</strong>
                <span className="straight-line"></span>
                <span>{_id}</span>
              </div>
              <div className="cart-sidebar-total-price">
                <strong>Created At:</strong>
                <span className="straight-line"></span>
                <span>{new Date(createdAt).toLocaleDateString()}</span>
              </div>
              <div className="cart-sidebar-total-price">
                <strong>Last Updated:</strong>
                <span className="straight-line"></span>
                <span>{new Date(updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <hr className="view-my-order-details-divider" />

          <div className="view-my-order-details-section">
            <h4 className="view-my-order-details-section-title">
              Activity Summary
            </h4>
            <div className="view-my-order-details-info">
              <div className="cart-sidebar-total-price">
                <strong>Total Orders:</strong>
                <span className="straight-line"></span>
                <span>{orders?.length || 0}</span>
              </div>
              {orderProducts.length > 0 && (
                <div className="view-my-order-details-section">
                  <h4 className="view-my-order-details-section-title">
                    Products Details
                  </h4>
                  {orderProducts.map((product, index) => (
                    <div
                      key={index}
                      className="view-my-order-details-product-inner"
                      style={{
                        border: "1px solid #fff",
                        marginBottom: "4px",
                        borderRadius: " 8px",
                      }}
                    >
                      <img
                        src={
                          product?.product?.images?.[0] || IMAGES.PlaceHolder
                        }
                        alt={name}
                        className="view-my-order-details-product-image"
                      />
                      <div className="view-my-order-details-product-info">
                        <h3 className="view-my-order-details-product-name">
                          {product?.product?.name}
                        </h3>
                        <div className="view-my-order-details-product-inner-info">
                          <p className="view-my-order-details-product-price">
                            {getCurrencySymbol(
                              currentUser?.currencyType ||
                                product?.product?.currencyType
                            )}{" "}
                            {getPriceByCurrency(
                              product?.product?.currencyType,
                              currentUser?.currencyType,
                              product?.product?.price
                            )}
                          </p>
                          <p className="view-my-order-details-product-qty">
                            Quantity: <span>{product?.orderquantity}</span>
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            navigate(`/product/${product?.product._id}`);
                          }}
                        >
                          View product
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {orders?.length > 0 && orderProducts.length === 0 && (
                <button
                  className="view-user-products-load-btn"
                  disabled={orderProductsLoading}
                  onClick={() => {
                    fetchOrders(
                      _id,
                      setOrdersProductsLoading,
                      setOrderProducts
                    );
                  }}
                >
                  {orderProductsLoading ? (
                    <Loader
                      size="10"
                      color="white"
                      style={{ width: "100px", height: "15px" }}
                    />
                  ) : (
                    "Load order products"
                  )}
                </button>
              )}
              <div className="cart-sidebar-total-price">
                <strong>Cart Items:</strong>
                <span className="straight-line"></span>
                <span>{cart?.length || 0}</span>
              </div>
              {cartProducts.length > 0 && (
                <div className="view-my-order-details-section">
                  <h4 className="view-my-order-details-section-title">
                    Products Details
                  </h4>
                  {cartProducts.map((product, index) => (
                    <div
                      key={index}
                      className="view-my-order-details-product-inner"
                      style={{
                        border: "1px solid #fff",
                        marginBottom: "4px",
                        borderRadius: " 8px",
                      }}
                    >
                      <img
                        src={
                          product?.product?.images?.[0] || IMAGES.PlaceHolder
                        }
                        alt={name}
                        className="view-my-order-details-product-image"
                      />
                      <div className="view-my-order-details-product-info">
                        <h3 className="view-my-order-details-product-name">
                          {product?.product?.name}
                        </h3>
                        <div className="view-my-order-details-product-inner-info">
                          <p className="view-my-order-details-product-price">
                            {getCurrencySymbol(
                              currentUser?.currencyType ||
                                product?.product?.currencyType
                            )}{" "}
                            {getPriceByCurrency(
                              product?.product?.currencyType,
                              currentUser?.currencyType,
                              product?.product?.price
                            )}
                          </p>
                          <p className="view-my-order-details-product-qty">
                            Quantity: <span>{product?.quantity}</span>
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            navigate(`/product/${product?.product._id}`);
                          }}
                        >
                          View product
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {cart?.length > 0 && cartProducts.length === 0 && (
                <button
                  className="view-user-products-load-btn"
                  disabled={cartProductsLoading}
                  onClick={() => {
                    fetchCart(_id, setCartProductsLoading, setCartProducts);
                  }}
                >
                  {cartProductsLoading ? (
                    <Loader
                      size="10"
                      color="white"
                      style={{ width: "100px", height: "15px" }}
                    />
                  ) : (
                    "Load cart products"
                  )}
                </button>
              )}
            </div>
          </div>

          <hr className="view-my-order-details-divider" />

          <button
            className="view-my-order-details-cencel-btn"
            onClick={() => {
              handleDelete(_id);
              setIsDetailsModel(null);
            }}
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewUserDetails;
