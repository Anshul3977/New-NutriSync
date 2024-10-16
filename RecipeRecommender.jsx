// RecipeRecommender.jsx
import React, { useState } from 'react';

const RecipeRecommender = () => {
  const [formData, setFormData] = useState({
    protein: '',
    carbohydrates: '',
    fat: '',
    fiber: '',
    ingredients: '',
  });
  const [recommendations, setRecommendations] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:5000/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => setRecommendations(data))
      .catch((error) => console.error('Error fetching recommendations:', error));
  };

  return (
    <div>
      <h1>Recipe Recommender</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Protein level (high, medium, low):
          <input type="text" name="protein" value={formData.protein} onChange={handleChange} />
        </label>
        <br />
        <label>
          Carbohydrates level (high, medium, low):
          <input type="text" name="carbohydrates" value={formData.carbohydrates} onChange={handleChange} />
        </label>
        <br />
        <label>
          Fat level (high, medium, low):
          <input type="text" name="fat" value={formData.fat} onChange={handleChange} />
        </label>
        <br />
        <label>
          Fiber level (high, medium, low):
          <input type="text" name="fiber" value={formData.fiber} onChange={handleChange} />
        </label>
        <br />
        <label>
          Ingredients (comma-separated):
          <input type="text" name="ingredients" value={formData.ingredients} onChange={handleChange} />
        </label>
        <br />
        <button type="submit">Get Recommendations</button>
      </form>

      <h2>Recommended Recipes:</h2>
      <div>
        {recommendations.length > 0 ? (
          recommendations.map((recipe, index) => (
            <div key={index}>
              <strong>{recipe.recipe_name}</strong>
              <p>Ingredients: {recipe.ingredients_list}</p>
              {recipe.image_url && <img src={recipe.image_url} alt={recipe.recipe_name} width="100" />}
              <hr />
            </div>
          ))
        ) : (
          <p>No recommendations yet.</p>
        )}
      </div>
    </div>
  );
};
export default RecipeRecommender;
