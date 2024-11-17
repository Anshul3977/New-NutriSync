// src/components/MotivationalTips.jsx
import React from 'react';
import './MotivationalTips.css';

const MotivationalTips = ({ progressData }) => {
  // Logic to select a motivational message
  const messages = [
    "Keep up the great work!",
    "You're making fantastic progress!",
    "Every step counts!",
    "Stay focused and persistent!",
    "Believe in yourself!",
  ];

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  return (
    <div className="motivational-tips-container">
      <h3>Motivational Tip</h3>
      <p>{randomMessage}</p>
    </div>
  );
};

export default MotivationalTips;