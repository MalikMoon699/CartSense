import React, { useState } from "react";
import LandingFooter from "../components/LandingFooter";
import { Clock9, Mail, MapPin, Phone } from "lucide-react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for contacting us! We'll respond soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
      <div className="contact-container">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>
            Have questions, feedback, or need support? We're here to help you.
            Send us a message, and our team will respond as soon as possible.
          </p>
        </div>
        <div className="contact-content">
          <div className="contact-info">
            <h2>Our Office</h2>
            <ul>
              <li>
                <span className="icon">
                  <MapPin size={14} color="#0056d2" />
                </span>{" "}
                Lahore, Pakistan
              </li>
              <li>
                <span className="icon">
                  <Phone size={14} color="#0056d2" />
                </span>{" "}
                +92 300 1234567
              </li>
              <li>
                <span className="icon">
                  <Mail size={14} color="#0056d2" />
                </span>{" "}
                support@cartsense.com
              </li>
              <li>
                <span className="icon">
                  <Clock9 size={14} color="#0056d2" />
                </span>{" "}
                Mon – Sun: 9:00 AM – 10:00 PM
              </li>
            </ul>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <h2>Send a Message</h2>
            <div className="contact-form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="contact-form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="contact-form-group">
              <label>Message</label>
              <textarea
                name="message"
                placeholder="Write your message..."
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="contact-submit-btn">
              Send Message
            </button>
          </form>
        </div>
      </div>
      <LandingFooter />
    </>
  );
};

export default ContactUs;
