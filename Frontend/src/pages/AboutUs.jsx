import React from "react";
import LandingFooter from "../components/LandingFooter";

const AboutUs = () => {
  return (
    <>
      <div className="about-container">
        <section className="about-hero">
          <h1>About CartSense</h1>
          <p>
            At <strong>CartSense</strong>, we believe shopping should be smart,
            seamless, and satisfying. Our mission is to connect customers with
            high-quality products through a modern, user-friendly platform built
            with care and innovation.
          </p>
        </section>

        <section className="about-mission">
          <h2>Our Mission</h2>
          <p>
            We aim to redefine online shopping by making it more personalized,
            efficient, and enjoyable. With top-notch customer service, secure
            payments, and fast delivery, we ensure every experience with
            CartSense exceeds expectations.
          </p>
        </section>

        <section className="about-values">
          <h2>Our Core Values</h2>
          <ul>
            <li>
              <strong>Integrity:</strong> We’re honest, transparent, and ethical
              in all we do.
            </li>
            <li>
              <strong>Innovation:</strong> We continuously evolve to improve
              your shopping journey.
            </li>
            <li>
              <strong>Customer Focus:</strong> You’re at the center of every
              decision we make.
            </li>
          </ul>
        </section>

        <section className="about-team">
          <h2>Meet Our Team</h2>
          <p>
            Our passionate team of developers, designers, and strategists work
            together to build a digital shopping experience that’s reliable,
            secure, and enjoyable. Together, we make online shopping simple.
          </p>
        </section>

        <section className="about-end">
          <p>
            Thank you for choosing CartSense — where every click makes sense.
          </p>
        </section>
      </div>
      <LandingFooter />
    </>
  );
};

export default AboutUs;
