import React from "react";
import LandingFooter from "../LandingFooter";
import { useNavigate } from "react-router-dom";

const Returns = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="landing-infoPages-container">
        <h1>Returns & Exchanges</h1>

        <p>
          If you're not satisfied with your purchase, you can return or exchange
          it within <strong>7 days</strong> of delivery.
        </p>

        <h2>Return Conditions</h2>
        <ul>
          <li>Product must be unused and in its original packaging.</li>
          <li>Include the invoice or proof of purchase.</li>
          <li>Returns must be approved before shipping back.</li>
        </ul>

        <h2>Non-Returnable Items</h2>
        <ul>
          <li>Personalized or custom items</li>
          <li>Opened hygiene or skincare products</li>
          <li>Gift cards or vouchers</li>
        </ul>

        <h2>How to Request a Return</h2>
        <p>
          Contact our support team at{" "}
          <a className="contact-link" href="mailto:support@cartsense.com">
            support@cartsense.com
          </a>{" "}
          OR by using{" "}
          <span
            className="contact-link"
            onClick={() => {
              navigate("/contact");
            }}
          >
            Contact Us
          </span>{" "}
          with your order ID and reason for return.
        </p>
      </div>
      <LandingFooter />
    </>
  );
};

export default Returns;
