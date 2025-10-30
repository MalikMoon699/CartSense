import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { landingHeroSlides } from "../services/Helpers";
import { useNavigate } from "react-router";

const LandingHero = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % landingHeroSlides.length);
  };

  const prevSlide = () => {
    setCurrent(
      (prev) => (prev - 1 + landingHeroSlides.length) % landingHeroSlides.length
    );
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="landing-hero-container">
      {landingHeroSlides.map((slide, index) => (
        <div
          key={index}
          className={`landing-hero-slide ${index === current ? "active" : ""}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="landing-hero-overlay">
            <div className="landing-hero-content">
              <p className="landing-hero-subtitle">{slide.subtitle}</p>
              <h1 className="landing-hero-title">{slide.title}</h1>
              <p className="landing-hero-description">{slide.description}</p>
              <button
                onClick={() => {
                  navigate("/products");
                }}
                className="landing-hero-button"
              >
                {slide.buttonText}
              </button>
            </div>
          </div>
        </div>
      ))}

      <button className="landing-hero-arrow left" onClick={prevSlide}>
        <ChevronLeft size={28} />
      </button>
      <button className="landing-hero-arrow right" onClick={nextSlide}>
        <ChevronRight size={28} />
      </button>

      <div className="landing-hero-dots">
        {landingHeroSlides.map((_, index) => (
          <span
            key={index}
            className={`landing-hero-dot ${index === current ? "active" : ""}`}
            onClick={() => setCurrent(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default LandingHero;
