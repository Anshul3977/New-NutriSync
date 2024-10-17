import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NutritionalTracking = ({ recipeId }) => {
  const [nutrition, setNutrition] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`https://api.spoonacular.com/recipes/${recipeId}/nutritionWidget.json`, {
      params: {
        apiKey: '138102f0871e4a008d743143ceae4f72',
      },
    })
      .then((response) => {
        setNutrition(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching nutrition data:', error);
        setLoading(false);
      });
  }, [recipeId]);

  if (loading) {
    return <div>Loading nutrition info...</div>;
  }

  if (!nutrition) {
    return <div>Failed to load nutrition info</div>;
  }

  return (
    <div>
      <h3>Nutrition Facts</h3>
      <ul>
        <li>Calories: {nutrition.calories}</li>
        <li>Fat: {nutrition.fat}</li>
        <li>Carbohydrates: {nutrition.carbs}</li>
        <li>Protein: {nutrition.protein}</li>
      </ul>
    </div>
  );
};

export default NutritionalTracking;