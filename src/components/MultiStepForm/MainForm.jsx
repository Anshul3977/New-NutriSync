import React, { useState } from 'react';
import ProfileStep from './ProfileStep';
import HealthStep from './HealthStep';
import GoalsStep from './GoalsStep';
import './MultiStepForm.css';

const MainForm = ({ onSubmit }) => {
  const [step, setStep] = useState(1); // Track the current step
  const [formData, setFormData] = useState({
    dietaryPreferences: '',
    allergies: '',
    weight: '',
    height: '',
    bmi: '',
    activityLevel: '',
    healthConditions: '',
    calories: '',
    macronutrients: '',
    nutritionalGoals: ''
  });

  // Function to handle going to the next step
  const nextStep = () => {
    setStep(step + 1);
  };

  // Function to handle going to the previous step
  const prevStep = () => {
    setStep(step - 1);
  };

  // Function to handle form field changes
  const handleChange = (input) => (e) => {
    setFormData({ ...formData, [input]: e.target.value });
  };

  // Function to handle form submission at the last step
  const handleFormSubmit = async () => {
    console.log('Submitting form with data:', formData); // Log form data for debugging

    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Check if token is present

      const response = await fetch('http://localhost:5002/complete-profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Server response:', data); // Log server response
        onSubmit(); // Notify the parent component (Dashboard) that form is submitted
      } else {
        console.error('Error submitting profile:', await response.json());
      }
    } catch (err) {
      console.error('Error submitting profile:', err);
    }
  };

  // Rendering different steps based on the current step
  switch (step) {
    case 1:
      return (
        <ProfileStep
          nextStep={nextStep}
          handleChange={handleChange}
          formData={formData}
        />
      );
    case 2:
      return (
        <HealthStep
          nextStep={nextStep}
          prevStep={prevStep}
          handleChange={handleChange}
          formData={formData}
        />
      );
    case 3:
      return (
        <GoalsStep
          prevStep={prevStep}
          handleChange={handleChange}
          formData={formData}
          handleSubmit={handleFormSubmit} // Pass form submit function to the last step
        />
      );
    default:
      return <h2>Form Submitted</h2>;
  }
};

export default MainForm;