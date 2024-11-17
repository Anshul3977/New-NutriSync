// src/components/NutrientDashboard.jsx
import React from 'react';
import './NutrientDashboard.css';

const NutrientDashboard = ({ nutrientIntake, goals }) => {
  const nutrients = ['protein', 'carbs', 'fat'];

  return (
    <div className="nutrient-dashboard-container">
      <h3>Nutrient Intake vs. Goals</h3>
      <div className="nutrient-card-grid">
        {nutrients.map((nutrient) => {
          const intake = nutrientIntake[nutrient] || 0;
          const goal = goals[`${nutrient}Goal`] || 0;
          const percentage = goal ? ((intake / goal) * 100).toFixed(0) : 0;

          return (
            <div className="nutrient-card" key={nutrient}>
              <h4>{nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}</h4>
              <p>
                {intake}g / {goal}g
              </p>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
              <p>{percentage}% of goal</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NutrientDashboard;