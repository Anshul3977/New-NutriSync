import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './RecipeForm.css'; // Import the CSS for styling

const RecipeForm = () => {
  const [formData, setFormData] = useState({
    diet: 'vegetarian', // Default diet type
    ingredients: '', // Ingredients input from the user
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRecommendations([]);

    try {
      const response = await axios.post('http://127.0.0.1:5002/recommend', formData);
      setRecommendations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError('Failed to fetch recommendations. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="recipe-form-container">
      <h2>Get Recipe Recommendations</h2>
      <form onSubmit={handleSubmit} className="recipe-form">
        <div className="form-group">
          <label>Diet Preference:</label>
          <select name="diet" value={formData.diet} onChange={handleChange} className="form-control">
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="gluten-free">Gluten-Free</option>
            <option value="pescatarian">Pescatarian</option>
            <option value="non-vegetarian">Non-Vegetarian</option>
          </select>
        </div>

        <div className="form-group">
          <label>Ingredients (comma-separated):</label>
          <input
            type="text"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            className="form-control"
            placeholder="e.g., onion, garlic, rice"
            required
          />
        </div>

        <button type="submit" className="btn-submit">Get Recommendations</button>
      </form>

      {loading && <p className="loading-message">Loading recommendations...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="recommendations-container">
        {recommendations.length > 0 && (
          <div>
            <h3>Recommended Recipes</h3>
            <div className="recipe-grid">
              {recommendations.map((recipe, index) => (
                <Link
                  to={`/recipe/${index}`}
                  state={{ recipe }} // Pass the entire recipe object
                  key={index}
                  className="recipe-link"
                >
                  <div className="recommendation-card">
                    <img src={recipe.image_url} alt={recipe.recipe_name} className="recipe-image" />
                    <h4>{recipe.recipe_name}</h4>
                    <p><strong>Diet:</strong> {recipe.diet}</p>
                    <p><strong>Cuisine:</strong> {recipe.cuisine}</p>
                    <p><strong>Prep Time:</strong> {recipe.prep_time}</p>
                    <p><strong>Description:</strong> {recipe.description}</p>
                    <p><strong>Likes:</strong> {recipe.likes}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeForm;
