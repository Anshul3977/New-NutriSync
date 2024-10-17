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
      fetch('http://localhost:5004/profile', {  // Ensure this port matches your backend server
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
      const response = await fetch('http://127.0.0.1:5000/recommend', {  // Use the correct port for the Flask server
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
                    <p><strong>Ingredients:</strong> {rec.ingredients_list}</p>
                    <img src={rec.image_url} alt={rec.recipe_name} className="recipe-image" />
                    {/* Display Nutritional Information */}
                    <div className="nutritional-info">
                      {/* <p><strong>Nutrients:</strong></p>
                      <ul>
                        <li>Calories: {rec.calories}</li>
                        <li>Protein: {rec.protein}</li>
                        <li>Carbohydrates: {rec.carbohydrates}</li>
                        <li>Fat: {rec.fat}</li>
                        <li>Fiber: {rec.fiber}</li>
                      </ul> */}
                    </div>
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
              image="src/assets/images/pexels-alex-gonzo-1518705084-27101539.jpg"
              route="/meal-planning"
            />
            <FeatureBox 
              title="Grocery List Generator"
              description="Manage your grocery list based on your meal plans."
              image="src/assets/images/pexels-katya-wolf-8716167.jpg"
              route="/grocery-list"
            />
            <FeatureBox 
              title="Health Goals Tracker"
              description="Set your health goals and track your progress."
              image="src/assets/images/pexels-alesiakozik-8154267.jpg"
              route="/health-goals"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;