import React, { useState, useEffect } from 'react';
import './RecipeForm.css'; // Import the CSS for styling

const RecipeForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    protein: 'medium',
    carbohydrates: 'medium',
    fat: 'medium',
    fiber: 'medium',
    ingredients: ''
  });

  // Log the onSubmit prop to verify it's being passed
  useEffect(() => {
    console.log('onSubmit prop in RecipeForm:', onSubmit);
  }, [onSubmit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      console.log("Form data submitted:", formData); // Log the form data
      onSubmit(formData); // Ensure onSubmit is called
    } else {
      console.error('onSubmit is not defined');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="recipe-form">
      <div className="form-group">
        <label>Protein Level:</label>
        <select name="protein" value={formData.protein} onChange={handleChange} className="form-control">
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="form-group">
        <label>Carbohydrates Level:</label>
        <select name="carbohydrates" value={formData.carbohydrates} onChange={handleChange} className="form-control">
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="form-group">
        <label>Fat Level:</label>
        <select name="fat" value={formData.fat} onChange={handleChange} className="form-control">
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="form-group">
        <label>Fiber Level:</label>
        <select name="fiber" value={formData.fiber} onChange={handleChange} className="form-control">
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
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
          placeholder="e.g., chicken, tomato"
          required
        />
      </div>

      <button type="submit" className="btn-submit">Get Recommendations</button>
    </form>
  );
};

export default RecipeForm;