import React from 'react';
import './About.css'; // Link the updated CSS

const About = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1>About Us</h1>
        <p>
          At NutriSync, we are committed to helping you achieve your nutritional goals with personalized meal plans, 
          easy-to-use tracking tools, and intelligent AI-driven ingredient substitutions. Whether you're looking to 
          manage a specific health condition, optimize your fitness performance, or simply maintain a balanced diet, 
          NutriSync has the tools to help you succeed.
        </p>
        <p>
          Our AI technology tailors recommendations to your unique preferences, dietary restrictions, and health 
          objectives, ensuring that every meal is in sync with your goals. We believe that healthy eating doesn't have 
          to be complicated, and we strive to make the journey to better nutrition both enjoyable and effortless.
        </p>
        <p>
          Join us in our mission to make healthy eating accessible for everyone. Together, we can make nutrition a 
          powerful tool for living a healthier, happier life.
        </p>
        <a href="/signup" className="about-cta-button">Get Started</a> {/* Added CTA */}
      </div>
    </div>
  );
};

export default About;