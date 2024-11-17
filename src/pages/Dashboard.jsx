import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainForm from '../components/MultiStepForm/MainForm'; 
import FeatureBox from '../components/FeatureBox'; 
import './Dashboard.css';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5002/api/get-profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          console.error('Error fetching profile');
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (err) {
        console.error('Error:', err);
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleProfileUpdate = () => {
    setLoading(true);
    setProfile(null);
    // Re-fetch the profile after successful form submission
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('http://localhost:5002/api/get-profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          console.error('Error fetching profile');
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      {!profile ? (
        <MainForm onSubmit={handleProfileUpdate} />
      ) : (
        <div className="profile-info">
          {/* <p>Dietary Preferences: {profile.dietaryPreferences}</p>
          <p>Allergies: {profile.allergies}</p>
          <p>Weight: {profile.weight}</p>
          <p>Height: {profile.height}</p>
          <p>BMI: {profile.bmi}</p>
          <p>Activity Level: {profile.activityLevel}</p>
          <p>Health Conditions: {profile.healthConditions}</p>
          <p>Calories: {profile.calories}</p>
          <p>Macronutrients: {profile.macronutrients}</p>
          <p>Nutritional Goals: {profile.nutritionalGoals}</p> */}

          <div className="feature-boxes-container">
            <FeatureBox title="Personalized Meal Planning" description="Receive customized meal plans tailored to your dietary preferences." image="src/assets/images/pexels-alex-gonzo-1518705084-27101539.jpg" route="/meal-planning" />
            <FeatureBox title="Grocery List Generator" description="Manage your grocery list based on your meal plans." image="src/assets/images/pexels-katya-wolf-8716167.jpg" route="/grocery-list" />
            <FeatureBox title="Health Goals Tracker" description="Set your health goals and track your progress." image="src/assets/images/pexels-alesiakozik-8154267.jpg" route="/health-goals" />
            <FeatureBox title="Recipe Recommendations" description="Get personalized recipe suggestions based on your preferences." image="src/assets/images/top-view-food-ingredients.jpg" route="/recipe-recommendations" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;