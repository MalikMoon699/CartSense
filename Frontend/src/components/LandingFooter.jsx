import React from 'react'
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const LandingFooter = () => {
  return (
    <footer className="landing-footer-container">
      <div className="landing-footer-top">
        <div className="landing-footer-about">
          <h3 className="landing-footer-logo">CartSense</h3>
          <p className="landing-footer-description">
            Your one-stop destination for premium products. Discover
            electronics, fashion, and lifestyle essentials — all in one place.
          </p>
          <div className="landing-footer-socials">
            <a
              target="_blank"
              href="https://www.facebook.com"
              aria-label="Facebook"
            >
              <Facebook />
            </a>
            <a
              target="_blank"
              href="https://www.instagram.com"
              aria-label="Instagram"
            >
              <Instagram />
            </a>
            <a
              target="_blank"
              href="https://www.twitter.com"
              aria-label="Twitter"
            >
              <Twitter />
            </a>
            <a
              target="_blank"
              href="https://www.youtube.com"
              aria-label="YouTube"
            >
              <Youtube />
            </a>
          </div>
        </div>

        <div className="landing-footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/products">Products</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </div>

        <div className="landing-footer-links">
          <h4>Customer Service</h4>
          <ul>
            <li>
              <a href="/faq">FAQs</a>
            </li>
            <li>
              <a href="/returns">Returns</a>
            </li>
            <li>
              <a href="/shipping">Shipping Info</a>
            </li>
            <li>
              <a href="/support">Support</a>
            </li>
          </ul>
        </div>

        <div className="landing-footer-contact">
          <h4>Contact Us</h4>
          <p>
            <MapPin size={16} /> 123 Market Street, Lahore, Pakistan
          </p>
          <p>
            <Phone size={16} /> +92 300 1234567
          </p>
          <p>
            <Mail size={16} /> support@cartsense.com
          </p>
        </div>
      </div>

      <div className="landing-footer-bottom">
        <p>© {new Date().getFullYear()} CartSense. All rights reserved.</p>
        <div className="landing-footer-bottom-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

export default LandingFooter
