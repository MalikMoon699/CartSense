import React from 'react'
import LandingFooter from '../LandingFooter';

const PrivacyPolicy = () => {
  return (
    <>
      <div className="landing-infoPages-container">
        <h1>Privacy Policy</h1>

        <p>
          Your privacy matters to us. We collect only necessary information to
          process your orders securely.
        </p>

        <h2>Information We Collect</h2>
        <ul>
          <li>Personal details (name, email, address, phone)</li>
          <li>
            Payment information (processed securely via third-party gateways)
          </li>
          <li>Website usage data to improve user experience</li>
        </ul>

        <h2>How We Use Your Data</h2>
        <p>
          We use your data to fulfill orders, send updates, and enhance your
          shopping experience. Your information is never sold or shared with
          unauthorized parties.
        </p>

        <h2>Cookies</h2>
        <p>
          Our site uses cookies to personalize content and remember your
          preferences.
        </p>
      </div>
      <LandingFooter />
    </>
  );
}

export default PrivacyPolicy
