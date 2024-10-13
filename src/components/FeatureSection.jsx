import React from 'react';
import { Link } from 'react-router-dom';
import './FeatureSection.css';

const features = [
  {
    title: 'Personalized meal planning',
    description: 'Receive customized meal plans tailored to your dietary preferences.',
    image: 'src/assets/images/your-image.png',
  },
  {
    title: 'Nutritional tracking',
    description: 'Monitor your nutritional intake effortlessly with our tracking tools.',
    image: 'src/assets/images/7756bb02-87fb-11ef-91a0-0242ac110002-photo-1523264165578-20bfb5da52b5.jpg',
  },
  {
    title: 'AI-Driven ingredient substitutions',
    description: 'Find suitable ingredient alternatives with our intelligent recommendations.',
    image: 'src/assets/images/77507602-87fb-11ef-91a0-0242ac110002-photo-1599451897608-ad6eb8676edf.jpg',
  }
];

const FeatureSection = () => {
  return (
    <section className="features" id="feature-section">
      <h2>Tailored meal plans just for you</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <Link to="/signup" key={index} className="feature-link">
            <div className="feature-card">
              <img src={feature.image} alt={feature.title} />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;