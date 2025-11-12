import React from "react";
import LandingFooter from "../LandingFooter";
import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="landing-infoPages-container">
        <h1>Terms of Service</h1>

        <p>
          By using our website, you agree to the following terms and conditions.
        </p>

        <h2>Use of the Website</h2>
        <p>
          All users must provide accurate information and refrain from any
          unlawful activity while using our services.
        </p>

        <h2>Payments</h2>
        <p>
          All payments must be made using authorized methods listed on our
          checkout page.
        </p>

        <h2>Changes to Terms</h2>
        <p>
          We may update these terms at any time. Continued use of our site means
          acceptance of the revised terms.
        </p>

        <h2>Contact</h2>
        <p>
          For any questions, email us at{" "}
          <a href="mailto:support@cartsense.com">support@cartsense.com</a> OR by
          using{" "}
          <span
            className="contact-link"
            onClick={() => {
              navigate("/contact");
            }}
          >
            Contact Us
          </span>
          .
        </p>
      </div>
      <LandingFooter />
    </>
  );
};

export default TermsOfService;
