import React from 'react';
import './NutritionPartner.css';

const NutritionPartner = () => {
  return (
    <section className="nutrition-partner">
      <div className="nutrition-content">
        <h4 className="partner-heading">YOUR NUTRITION PARTNER</h4>
        <h2 className="main-heading">Transforming meal planning for you</h2>
        <p className="description">
          NutriSync is your ultimate destination for personalized meal planning and nutrition management . Our platform provides tailored meal recommendations, tracks your nutritional intake, generates grocery lists, and offers AI-driven ingredient substitutions. With a user-friendly interface and an interactive chatbot, managing your dietary needs has never been easier. Join us in making healthy eating effortless and enjoyable!
        </p>
        <a href="/contact" className="contact-link">Get in touch</a>
      </div>
      <div className="nutrition-image">
        <img src="src/assets/images/749fd844-87fb-11ef-8713-0242ac110002-photo-1554260570-9140fd3b7614.jpgth" alt="Nutrition Partner" />
      </div>
    </section>
  );
};

export default NutritionPartner;