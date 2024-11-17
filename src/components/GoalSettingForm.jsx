// src/components/GoalSettingForm.jsx
import React, { useState, useEffect } from 'react';
import './GoalSettingForm.css';

const GoalSettingForm = ({ setGoals }) => {
  const [formData, setFormData] = useState({
    weightGoal: '',
    weeklyTarget: '',
    calorieGoal: '',
    proteinGoal: '',
    carbGoal: '',
    fatGoal: '',
    fitnessGoal: '',
  });

  // Load existing goals from local storage
  useEffect(() => {
    const storedGoals = JSON.parse(localStorage.getItem('userGoals')) || {};
    setFormData(storedGoals);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Ensure that numerical inputs are stored as numbers
    setFormData({ ...formData, [name]: parseFloat(value) || '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGoals(formData);
    localStorage.setItem('userGoals', JSON.stringify(formData));
  };

  return (
    <div className="goal-setting-form-container">
      <h3>Set Your Health Goals</h3>
      <form onSubmit={handleSubmit} className="goal-setting-form">
        {/* Weight Goals */}
        <div className="form-section">
          <h4>Weight Goals</h4>
          <div className="form-group">
            <label htmlFor="weightGoal">Target Weight (kg):</label>
            <input
              type="number"
              id="weightGoal"
              name="weightGoal"
              value={formData.weightGoal}
              onChange={handleChange}
              min="0"
              step="0.1"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="weeklyTarget">Weekly Target (kg):</label>
            <input
              type="number"
              id="weeklyTarget"
              name="weeklyTarget"
              value={formData.weeklyTarget}
              onChange={handleChange}
              min="0"
              step="0.1"
              required
            />
          </div>
        </div>

        {/* Nutritional Goals */}
        <div className="form-section">
          <h4>Nutritional Goals</h4>
          <div className="form-group">
            <label htmlFor="calorieGoal">Daily Calorie Goal (kcal):</label>
            <input
              type="number"
              id="calorieGoal"
              name="calorieGoal"
              value={formData.calorieGoal}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="proteinGoal">Protein Goal (g):</label>
            <input
              type="number"
              id="proteinGoal"
              name="proteinGoal"
              value={formData.proteinGoal}
              onChange={handleChange}
              min="0"
            />
          </div>
          <div className="form-group">
            <label htmlFor="carbGoal">Carbs Goal (g):</label>
            <input
              type="number"
              id="carbGoal"
              name="carbGoal"
              value={formData.carbGoal}
              onChange={handleChange}
              min="0"
            />
          </div>
          <div className="form-group">
            <label htmlFor="fatGoal">Fat Goal (g):</label>
            <input
              type="number"
              id="fatGoal"
              name="fatGoal"
              value={formData.fatGoal}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>

        {/* Fitness Goals */}
        <div className="form-section">
          <h4>Fitness Goals</h4>
          <div className="form-group">
            <label htmlFor="fitnessGoal">Weekly Exercise Goal (hours):</label>
            <input
              type="number"
              id="fitnessGoal"
              name="fitnessGoal"
              value={formData.fitnessGoal}
              onChange={handleChange}
              min="0"
              step="0.1"
            />
          </div>
        </div>

        <button type="submit" className="btn-submit">Save Goals</button>
      </form>
    </div>
  );
};

export default GoalSettingForm;