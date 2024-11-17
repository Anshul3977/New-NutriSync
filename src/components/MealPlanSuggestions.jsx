// src/components/MealPlanSuggestions.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MealPlanSuggestions.css';

const MealPlanSuggestions = ({ goals }) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (goals.calorieGoal) {
      // Fetch meal suggestions based on goals
      const fetchSuggestions = async () => {
        try {
          const response = await axios.post('http://localhost:5002/api/meal-suggestions', {
            goals,
          });
          setSuggestions(response.data);
        } catch (error) {
          console.error('Error fetching meal suggestions:', error);
        }
      };

      fetchSuggestions();
    }
  }, [goals]);

  return (
    <div className="meal-plan-suggestions-container">
      <h3>Meal Plan Suggestions</h3>
      {suggestions.length > 0 ? (
        <div className="suggestions-grid">
          {suggestions.map((meal, index) => (
            <div className="meal-card" key={index}>
              <img src={meal.image_url} alt={meal.recipe_name} />
              <h4>{meal.recipe_name}</h4>
              {/* Additional meal details if available */}
            </div>
          ))}
        </div>
      ) : (
        <p>No meal suggestions available.</p>
      )}
    </div>
  );
};

export default MealPlanSuggestions;