import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainForm from '../components/MultiStepForm/MainForm'; 
import FeatureBox from '../components/FeatureBox'; 
import RecipeForm from '../components/MultiStepForm/RecipeForm'; // Import RecipeForm
import './Dashboard.css'; // Import the CSS for styling

const Dashboard = () => {
  const [message, setMessage] = useState('');
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]); // State to hold recommendations
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
    } else {
      // Fetch user profile to check if the form is already completed
      fetch('http://localhost:5002/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then(res => res.json())
      .then(data => {
        if (data.isProfileComplete) {
          setIsProfileComplete(true);
        }
        setMessage(data.message || '');
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        localStorage.removeItem('token');
        navigate('/login');
      });
    }
  }, [navigate]);

  // Handle recipe form submission (calls the Flask API)
  const handleRecipeSubmit = async (formData) => {
    console.log("Form Data Submitted: ", formData); // Logging form data for debugging
    try {
      const response = await fetch('http://127.0.0.1:5000/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data); // Update the recommendations state
      } else {
        console.error('Failed to fetch recommendations');
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>{message}</p>

      {!isProfileComplete ? (
        <MainForm onSubmit={handleRecipeSubmit} />
      ) : (
        <>
          {/* RecipeForm for meal recommendations */}
          <RecipeForm onSubmit={handleRecipeSubmit} />

          {/* Display the recommendations */}
          {recommendations.length > 0 && (
            <div className="recommendations">
              <h2>Recommendations:</h2>
              <ul>
                {recommendations.map((rec, index) => (
                  <li key={index} className="recommendation-item">
                    <h3>{rec.recipe_name}</h3>
                    <p>{rec.ingredients_list}</p>
                    <img src={rec.image_url} alt={rec.recipe_name} className="recipe-image" />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Feature Boxes */}
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
        </>
      )}
    </div>
  );
};

export default Dashboard;