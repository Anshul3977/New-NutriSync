import React from 'react';

const GoalsStep = ({ prevStep, handleChange, formData, handleSubmit }) => {
  const goBack = (e) => {
    e.preventDefault();
    prevStep(); // Go back to the previous step
  };

  const submitForm = (e) => {
    e.preventDefault();
    handleSubmit(); // Call the handleSubmit function to submit the form
  };

  return (
    <div className="form-container">
      <h2>Nutritional Goals</h2>
      <form onSubmit={submitForm}>
        <label>Calories (kcal):</label>
        <input
          type="number"
          placeholder="e.g., 2000"
          value={formData.calories}
          onChange={handleChange('calories')}
          required
        />

        <label>Macronutrient Ratios:</label>
        <input
          type="text"
          placeholder="e.g., 50% carbs, 30% protein, 20% fat"
          value={formData.macronutrients}
          onChange={handleChange('macronutrients')}
          required
        />

        <label>Specific Nutritional Goals:</label>
        <input
          type="text"
          placeholder="e.g., More Vitamin C"
          value={formData.nutritionalGoals}
          onChange={handleChange('nutritionalGoals')}
        />

        <div className="form-navigation-buttons">
          <button onClick={goBack}>Back</button>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default GoalsStep;