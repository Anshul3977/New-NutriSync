import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Link } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5004/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setLoading(false);
      if (response.ok) {
        setMessage('Signup successful! You can now log in.');
      } else {
        setMessage(data.error || 'Signup failed. Please try again.');
      }
    } catch {
      setLoading(false);
      setMessage('An error occurred during signup. Please try again.');
    }
  };

  const handleGoogleSuccess = async (response) => {
    const token = response.credential;
    try {
      const res = await fetch('http://localhost:5004/google-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.token) {
        alert('Google Signup successful');
      } else {
        alert('Google Signup failed');
      }
    } catch {
      alert('Google Signup failed');
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Sign Up</h2>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Full Name"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Password"
          minLength="6"
          required
        />
        <button type="submit" className="signup-button" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
        {message && <p className="error-message">{message}</p>}
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => alert('Google Signup failed')}
        />
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;