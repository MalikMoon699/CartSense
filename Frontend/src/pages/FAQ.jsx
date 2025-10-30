import React from 'react'
import "../assets/style/infoPages.css";
import LandingFooter from '../components/LandingFooter';

const FAQ = () => {
  return (
    <>
      <div className="landing-infoPages-container">
        <h1>Frequently Asked Questions</h1>

        <h2>How do I place an order?</h2>
        <p>
          Simply add products to your cart, go to checkout, and complete your
          order using our secure payment options.
        </p>

        <h2>Can I cancel my order?</h2>
        <p>
          Orders can be canceled within 2 hours of placement. Once shipped,
          cancellations are no longer possible.
        </p>

        <h2>How do I track my shipment?</h2>
        <p>
          After dispatch, you'll receive a tracking number via email or SMS to
          follow your order in real-time.
        </p>

        <h2>Do you offer international shipping?</h2>
        <p>
          Currently, we deliver only within Pakistan. International shipping
          will be introduced soon!
        </p>
      </div>
        <LandingFooter />
    </>
  );
}

export default FAQ
