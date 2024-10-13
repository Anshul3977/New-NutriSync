import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>Transforming meal planning for you</h1>
        <p>Your ultimate destination for personalized meal planning and nutrition management.</p>
        <a href="/contact" className="hero-link">Get in touch</a>
      </div>
    </section>
  );
};

export default HeroSection;