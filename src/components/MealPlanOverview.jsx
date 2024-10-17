import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NutritionalTracking from './NutritionalTracking'; 
import './MealPlanOverview.css'; 

const MealPlanOverview = ({ setMealPlan }) => { 
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMealPlan, setEditedMealPlan] = useState({});
  const [selectedRecipeId, setSelectedRecipeId] = useState(null); 

  useEffect(() => {
    axios.get(`https://api.spoonacular.com/mealplanner/generate`, {
      params: {
        apiKey: '138102f0871e4a008d743143ceae4f72',
        timeFrame: 'week',
        targetCalories: 2000,
        diet: 'vegetarian',
      },
    })
    .then((response) => {
      setMealPlan(response.data); // Update mealPlan in App.js
      setEditedMealPlan(response.data);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching meal plan:', error);
      setLoading(false);
    });
  }, [setMealPlan]); 

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleMealChange = (day, mealIndex, field, value) => {
    const updatedMealPlan = { ...editedMealPlan };
    updatedMealPlan.week[day].meals[mealIndex][field] = value;
    setEditedMealPlan(updatedMealPlan);
  };

  const handleSaveMealPlan = () => {
    setMealPlan(editedMealPlan);
    setIsEditing(false);
  };

  const handleTrackNutrition = (recipeId) => {
    setSelectedRecipeId(recipeId); 
  };

  const handleGenerateGroceryList = () => {
    localStorage.setItem('mealPlanData', JSON.stringify(editedMealPlan)); // Store meal plan data
    window.location.href = '/grocery-list'; // Redirect to grocery list page
  };

  if (loading) {
    return <div>Loading meal plan...</div>;
  }

  if (!editedMealPlan) {
    return <div>Failed to load meal plan</div>;
  }

  return (
    <div className="meal-plan-overview">
      <h2>Personalized Meal Plan Overview</h2>
      <h3>Your Meal Plan for the Week</h3>

      {editedMealPlan.week && Object.keys(editedMealPlan.week).map((day) => (
        <div key={day} className="meal-plan-day">
          <h4>{day.charAt(0).toUpperCase() + day.slice(1)}</h4>
          {editedMealPlan.week[day].meals.map((meal, index) => (
            <div key={meal.id} className="meal-item">
              {isEditing ? (
                <input
                  type="text"
                  value={editedMealPlan.week[day].meals[index].title}
                  onChange={(e) => handleMealChange(day, index, 'title', e.target.value)}
                />
              ) : (
                <h5>{meal.title}</h5>
              )}
              <p>Ready in {meal.readyInMinutes} minutes</p>
              <a href={meal.sourceUrl} target="_blank" rel="noopener noreferrer">View Recipe</a>
              <button onClick={() => handleTrackNutrition(meal.id)}>Track Nutrition</button> 
            </div>
          ))}
        </div>
      ))}

      {isEditing ? (
        <button onClick={handleSaveMealPlan}>Save Meal Plans</button>
      ) : (
        <>
          <button onClick={handleEditToggle}>Edit Meal Plans</button>
          <button onClick={handleGenerateGroceryList}>Generate Grocery List</button>
        </>
      )}

      {selectedRecipeId && (
        <div className="nutrition-section">
          <NutritionalTracking recipeId={selectedRecipeId} />
        </div>
      )}
    </div>
  );
};

export default MealPlanOverview;