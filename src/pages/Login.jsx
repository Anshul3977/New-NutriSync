import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch('http://localhost:5004/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify({ email: formData.email })); // Store user email
          navigate('/dashboard');
        } else {
          setErrorMessage('Invalid credentials');
        }
      })
      .catch(() => {
        setLoading(false);
        setErrorMessage('Something went wrong. Please try again.');
      });
  };

  const handleGoogleSuccess = async (response) => {
    const token = response.credential;
    try {
      const res = await fetch('http://localhost:5004/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ email: data.email })); // Store Google user email
        navigate('/dashboard');
      } else {
        setErrorMessage('Google login failed');
      }
    } catch {
      setErrorMessage('Google login failed');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
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
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setErrorMessage('Google login failed')}
        />
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;