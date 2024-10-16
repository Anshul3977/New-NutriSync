import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainForm from '../components/MultiStepForm/MainForm'; 
import FeatureBox from '../components/FeatureBox';

const Dashboard = () => {
  const [message, setMessage] = useState('');
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
    } else {
      fetch('http://localhost:5002/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then(res => res.json())
      .then(data => {
        setIsProfileComplete(data.isProfileComplete);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching profile:', err);
        localStorage.removeItem('token');
        navigate('/login');
      });
    }
  }, [navigate]);

  const handleFormSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5002/complete-profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsProfileComplete(true);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{message}</p>

      {!isProfileComplete ? (
        <MainForm onSubmit={handleFormSubmit} /> 
      ) : (
        <div className="feature-boxes-container">
          <FeatureBox 
            title="Personalized Meal Planning"
            description="Receive customized meal plans tailored to your dietary preferences."
            image="path_to_image_1"
            route="/meal-planning"
          />
          <FeatureBox 
            title="Nutritional Tracking"
            description="Monitor your nutritional intake effortlessly."
            image="path_to_image_2"
            route="/nutritional-tracking"
          />
          <FeatureBox 
            title="Grocery List Generator"
            description="Manage your grocery list based on your meal plans."
            image="path_to_image_3"
            route="/grocery-list"
          />
          <FeatureBox 
            title="Health Goals Tracker"
            description="Set your health goals and track your progress."
            image="path_to_image_4"
            route="/health-goals"
          />
          <FeatureBox 
            title="Recipe Recommendations"
            description="Get personalized recipe suggestions based on your preferences."
            image="path_to_image_5"
            route="/recipe-recommendations"
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;