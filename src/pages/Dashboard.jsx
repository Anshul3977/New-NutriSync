import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login'); // Redirect to login if no token is found
    } else {
      // Fetch the dashboard data using the token
      fetch('http://localhost:5002/dashboard', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Add token to the header
        },
      })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          setMessage(data.message); // Set message from the server
        } else {
          localStorage.removeItem('token'); // Clear token if response is invalid
          navigate('/login'); // Redirect to login if token is invalid
        }
      })
      .catch((err) => {
        console.error("Error fetching dashboard:", err);
        localStorage.removeItem('token'); // Clear token if invalid
        navigate('/login'); // Redirect to login if token is invalid
      });
    }
  }, [navigate]);

  if (!message) {
    return <div>Loading...</div>; // Show a loading message or spinner while fetching data
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{message}</p>
    </div>
  );
};

export default Dashboard;