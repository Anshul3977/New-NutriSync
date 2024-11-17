import React, { useState } from 'react';
import ProfileStep from './ProfileStep';
import HealthStep from './HealthStep';
import GoalsStep from './GoalsStep';
import './MultiStepForm.css';
import { useNavigate } from 'react-router-dom';

const MainForm = ({ onSubmit }) => {
  const [step, setStep] = useState(1);
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
    nutritionalGoals: '',
  });
  const navigate = useNavigate();

  // Function to handle form field changes
  const handleChange = (input) => (e) => {
    setFormData({ ...formData, [input]: e.target.value });
  };

  // Function to handle form submission
  const handleFormSubmit = async () => {
    console.log('Submitting form with data:', formData);

    try {
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token); // Debugging

      if (!token) {
        console.error('No token found in local storage');
        navigate('/login'); // Redirect to login if token is missing
        return;
      }

      const response = await fetch('http://localhost:5002/api/save-profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Server response:', data);
        if (typeof onSubmit === 'function') {
          onSubmit(); // Notify parent component (Dashboard) that form is submitted
        } else {
          console.error('onSubmit is not a function');
        }
      } else {
        const errorData = await response.json();
        console.error('Error submitting profile:', errorData);

        if (response.status === 401) {
          console.error('Token is invalid or expired');
          localStorage.removeItem('token'); // Remove invalid token
          navigate('/login'); // Redirect to login
        }
      }
    } catch (err) {
      console.error('Error submitting profile:', err);
    }
  };

  // Render form steps based on the current step
  switch (step) {
    case 1:
      return <ProfileStep nextStep={() => setStep(2)} handleChange={handleChange} formData={formData} />;
    case 2:
      return <HealthStep nextStep={() => setStep(3)} prevStep={() => setStep(1)} handleChange={handleChange} formData={formData} />;
    case 3:
      return <GoalsStep prevStep={() => setStep(2)} handleChange={handleChange} formData={formData} handleSubmit={handleFormSubmit} />;
    default:
      return <h2>Form Submitted</h2>;
  }
};

export default MainForm;