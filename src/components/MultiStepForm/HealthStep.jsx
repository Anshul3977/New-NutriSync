import React from 'react';

const HealthStep = ({ nextStep, prevStep, handleChange, formData }) => {
  const continueStep = (e) => {
    e.preventDefault();
    nextStep();
  };

  const goBack = (e) => {
    e.preventDefault();
    prevStep();
  };

  return (
    <div className="form-container">
      <h2>Health Information</h2>
      <form>
        <label>Weight (kg):</label>
        <input
          type="number"
          placeholder="e.g., 70"
          value={formData.weight}
          onChange={handleChange('weight')}
        />

        <label>Height (cm):</label>
        <input
          type="number"
          placeholder="e.g., 175"
          value={formData.height}
          onChange={handleChange('height')}
        />

        <label>BMI:</label>
        <input
          type="number"
          placeholder="Auto-calculated"
          value={formData.bmi}
          onChange={handleChange('bmi')}
        />

        <label>Activity Level:</label>
        <input
          type="text"
          placeholder="e.g., Sedentary, Active"
          value={formData.activityLevel}
          onChange={handleChange('activityLevel')}
        />

        <label>Health Conditions:</label>
        <input
          type="text"
          placeholder="e.g., Diabetes, Hypertension"
          value={formData.healthConditions}
          onChange={handleChange('healthConditions')}
        />

        <button onClick={goBack}>Back</button>
        <button onClick={continueStep}>Next</button>
      </form>
    </div>
  );
};

export default HealthStep;