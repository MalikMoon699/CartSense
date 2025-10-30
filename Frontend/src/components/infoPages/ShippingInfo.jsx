import React from 'react'
import LandingFooter from "../LandingFooter";

const ShippingInfo = () => {
  return (
    <>
    <div className="landing-infoPages-container">
      <h1>Shipping Information</h1>

      <p>
        We deliver all across Pakistan using trusted courier partners. Most
        orders are dispatched within <strong>1–2 business days</strong>.
      </p>

      <h2>Delivery Time</h2>
      <ul>
        <li>Major cities: 2–3 working days</li>
        <li>Remote areas: 4–6 working days</li>
      </ul>

      <h2>Shipping Charges</h2>
      <p>
        Free shipping on orders over Rs. 2,000. A standard Rs. 200 charge
        applies otherwise.
      </p>

      <h2>Order Tracking</h2>
      <p>
        Once shipped, a tracking number will be shared via SMS or email to
        monitor your parcel’s journey.
      </p>
    </div>
      <LandingFooter />
    </>
  );
}

export default ShippingInfo
