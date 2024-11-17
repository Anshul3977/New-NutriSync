import React, { useState } from 'react';
import axios from 'axios';
import './MealPlanOverview.css';

const MealPlanOverview = ({ setMealPlan }) => {
  // State variables for user input
  const [targetCalories, setTargetCalories] = useState('');
  const [diet, setDiet] = useState('');
  const [excludeIngredients, setExcludeIngredients] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [mealType, setMealType] = useState('');
  const [loading, setLoading] = useState(false);
  const [mealPlan, setLocalMealPlan] = useState(null);

  // Function to handle user input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'targetCalories') setTargetCalories(value);
    if (name === 'diet') setDiet(value);
    if (name === 'excludeIngredients') setExcludeIngredients(value);
    if (name === 'cuisine') setCuisine(value);
    if (name === 'mealType') setMealType(value);
  };

  // Function to generate meal plan
  const handleGenerateMealPlan = () => {
    setLoading(true);

    axios.get('https://api.spoonacular.com/mealplanner/generate', {
      params: {
        apiKey: '138102f0871e4a008d743143ceae4f72', // Replace with your actual Spoonacular API key
        timeFrame: 'week',
        targetCalories: targetCalories || 2000, // Default to 2000 calories
        diet: diet,
        exclude: excludeIngredients,
        cuisine: cuisine,
        mealType: mealType,
      },
    })
    .then((response) => {
      setLocalMealPlan(response.data);
      setMealPlan(response.data); // Update meal plan in parent component
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching meal plan:', error);
      setLoading(false);
    });
  };

  // Render loading message if data is being fetched
  if (loading) {
    return <div>Loading meal plan...</div>;
  }

  return (
    <div className="meal-plan-overview">
      <h2>Personalized Meal Plan Overview</h2>
      
      {/* User input form */}
      <div className="user-input-form">
        <label>
          Target Calories:
          <input
            type="number"
            name="targetCalories"
            value={targetCalories}
            onChange={handleInputChange}
            placeholder="e.g., 2000"
          />
        </label>
        <label>
          Diet Preference:
          <select name="diet" value={diet} onChange={handleInputChange}>
            <option value="">Select Diet</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="pescatarian">Pescatarian</option>
            <option value="ketogenic">Ketogenic</option>
            <option value="gluten free">Gluten Free</option>
          </select>
        </label>
        <label>
          Exclude Ingredients:
          <input
            type="text"
            name="excludeIngredients"
            value={excludeIngredients}
            onChange={handleInputChange}
            placeholder="e.g., nuts, shellfish"
          />
        </label>
        <label>
          Cuisine Preference:
          <select name="cuisine" value={cuisine} onChange={handleInputChange}>
            <option value="">Select Cuisine</option>
            <option value="indian">Indian</option>
            <option value="italian">Italian</option>
            <option value="mexican">Mexican</option>
            <option value="chinese">Chinese</option>
          </select>
        </label>
        <label>
          Meal Type:
          <select name="mealType" value={mealType} onChange={handleInputChange}>
            <option value="">Select Meal Type</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
        </label>
        <button onClick={handleGenerateMealPlan}>Generate Meal Plan</button>
      </div>

      {/* Display meal plan results */}
      {mealPlan ? (
        <div className="meal-plan-results">
          <h3>Your Meal Plan for the Week</h3>
          {mealPlan.week && Object.keys(mealPlan.week).map((day) => (
            <div key={day} className="meal-plan-day">
              <h4>{day.charAt(0).toUpperCase() + day.slice(1)}</h4>
              {mealPlan.week[day].meals.map((meal) => (
                <div key={meal.id} className="meal-item">
                  <h5>{meal.title}</h5>
                  <p>Ready in {meal.readyInMinutes} minutes</p>
                  <a href={meal.sourceUrl} target="_blank" rel="noopener noreferrer">View Recipe</a>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p>No meal plan generated yet. Please enter your preferences and click 'Generate Meal Plan'.</p>
      )}
    </div>
  );
};

export default MealPlanOverview;