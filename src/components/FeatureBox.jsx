// src/components/FeatureBox.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FeatureBox.css'; // Add some CSS for the box styling

const FeatureBox = ({ title, description, image, route }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(route); // Navigate to the given route
  };

  return (
    <div className="feature-box" onClick={handleClick}>
      <img src={image} alt={title} className="feature-box-image" />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default FeatureBox;