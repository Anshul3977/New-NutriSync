import React, { useState } from 'react';

const RecipeForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    protein: 'medium',
    carbohydrates: 'medium',
    fat: 'medium',
    fiber: 'medium',
    ingredients: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Protein Level:</label>
      <select name="protein" value={formData.protein} onChange={handleChange}>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <label>Carbohydrates Level:</label>
      <select name="carbohydrates" value={formData.carbohydrates} onChange={handleChange}>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <label>Fat Level:</label>
      <select name="fat" value={formData.fat} onChange={handleChange}>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <label>Fiber Level:</label>
      <select name="fiber" value={formData.fiber} onChange={handleChange}>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <label>Ingredients (comma-separated):</label>
      <input
        type="text"
        name="ingredients"
        value={formData.ingredients}
        onChange={handleChange}
        placeholder="e.g., chicken, tomato"
        required
      />

      <button type="submit">Get Recommendations</button>
    </form>
  );
};

export default RecipeForm;