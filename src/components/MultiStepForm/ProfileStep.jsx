import React from 'react';

const ProfileStep = ({ nextStep, handleChange, formData }) => {
  const continueStep = (e) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div className="form-container">
      <h2>Profile Information</h2>
      <form>
        <label>Dietary Preferences:</label>
        <input
          type="text"
          placeholder="e.g., Vegetarian, Vegan"
          value={formData.dietaryPreferences}
          onChange={handleChange('dietaryPreferences')}
        />

        <label>Allergies:</label>
        <input
          type="text"
          placeholder="e.g., Nuts, Dairy"
          value={formData.allergies}
          onChange={handleChange('allergies')}
        />

        <button onClick={continueStep}>Next</button>
      </form>
    </div>
  );
};

export default ProfileStep;