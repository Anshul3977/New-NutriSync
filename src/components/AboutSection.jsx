import React from 'react';
import './AboutSection.css'; // Add CSS for styling if needed

const AboutSection = () => {
  return (
    <section className="about-section">
      <div className="about-content">
        <h4>YOUR NUTRITION PARTNER</h4>
        <h2>Transforming meal planning for you</h2>
        <p>
          NutriSync is your ultimate destination for personalized meal planning and nutrition management in Jalgaon. Our platform provides tailored meal recommendations, tracks your nutritional intake, generates grocery lists, and offers AI-driven ingredient substitutions. With a user-friendly interface and an interactive chatbot, managing your dietary needs has never been easier. Join us in making healthy eating effortless and enjoyable!
        </p>
        <a href="/contact" className="about-link">Get in touch</a>
      </div>
      <div className="about-image">
        <img src="src/assets/images/749fd844-87fb-11ef-8713-0242ac110002-photo-1554260570-9140fd3b7614.jpg" alt="About NutriSync" />
      </div>
    </section>
  );
};

export default AboutSection;