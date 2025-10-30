import React from 'react'
import LandingFooter from "../LandingFooter";
import { Clock9, Mail, MessageSquareText, Phone } from 'lucide-react';

const Support = () => {
  return (
    <>
      <div className="landing-infoPages-container">
        <h1>Customer Support</h1>

        <p>
          We're here to assist you with any queries about your order, payments,
          or product details.
        </p>

        <div className="landing-infoPages-highlight">
          <span className="icon">
            <MessageSquareText size={13} color="#0056d2" />
          </span>{" "}
          <strong>Need quick help?</strong> Our live chat is available daily
          from 9:00 AM to 10:00 PM.
        </div>

        <h2>Contact Us</h2>
        <div className="landing-infoPages-contact">
          <ul>
            <li>
              <span className="icon">
                <Mail size={13} color="#0056d2" />
              </span>{" "}
               Email:{" "}
              <a href="mailto:support@cartsense.com">support@cartsense.com</a>
            </li>
            <li>
              <span className="icon">
                <Phone size={13} color="#0056d2" />
              </span>{" "}
               Phone: +92 300 1234567
            </li>
            <li>
              <span className="icon">
                <Clock9 size={13} color="#0056d2" />
              </span>{" "}
               Hours: 9:00 AM – 10:00 PM (Mon–Sun)
            </li>
          </ul>
        </div>
      </div>
      <LandingFooter />
    </>
  );
}

export default Support
