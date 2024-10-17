import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MealPlanForm = () => {
  const [formData, setFormData] = useState({
    targetCalories: '',
    diet: '',
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Store the form data in localStorage
    localStorage.setItem('mealPlanData', JSON.stringify(formData));

    // Redirect to the meal plan overview
    navigate('/meal-planning');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Target Calories:
        <input
          type="number"
          name="targetCalories"
          value={formData.targetCalories}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <label>
        Diet Preference:
        <select name="diet" value={formData.diet} onChange={handleChange} required>
          <option value="">Select Diet</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="ketogenic">Ketogenic</option>
          <option value="paleo">Paleo</option>
        </select>
      </label>
      <br />
      <button type="submit">Get Meal Plan</button>
    </form>
  );
};

export default MealPlanForm;