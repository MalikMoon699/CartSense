import React, { useState } from "react";
import LandingFooter from "../components/LandingFooter";
import { Clock9, Mail, MapPin, Phone } from "lucide-react";
import API from "../utils/api";
import { toast } from "sonner";
import Loader from "../components/Loader";

const ContactUs = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.post("/adminUser/contactMail", formData);
      if (res.data.success) {
        toast.success("Thank you! Your message has been sent.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error(res.data.message || "Failed to send message.");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
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

            <button
              type="submit"
              disabled={loading}
              style={{ cursor: loading ? "not-allowed" : "" }}
              className="contact-submit-btn"
            >
              {loading ? <Loader size="20" color="white" /> : "Send Message"}
            </button>
          </form>
        </div>
      </div>
      <LandingFooter />
    </>
  );
};

export default ContactUs;
