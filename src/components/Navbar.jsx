import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/images/cover_preview_rev_1.png'; // Ensure this path is correct

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleHomeClick = (event) => {
    event.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const handleScrollToFeatures = (event) => {
    event.preventDefault();
    if (location.pathname === '/') {
      const featureSection = document.getElementById('feature-section');
      if (featureSection) {
        window.scrollTo({
          top: featureSection.offsetTop - navbarHeight,
          behavior: 'smooth',
        });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const featureSection = document.getElementById('feature-section');
        if (featureSection) {
          window.scrollTo({
            top: featureSection.offsetTop - navbarHeight,
            behavior: 'smooth',
          });
        }
      }, 500);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <a href="/" onClick={handleHomeClick}>
          {/* Use the image logo with a fallback to the text if the logo fails to load */}
          <img 
            src={logo} 
            alt="NutriSync Logo" 
            style={{ width: '120px', height: 'auto' }} 
            onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = 'NUTRISYNC'; }}
          />
        </a>
      </div>
      <ul className="navbar-links">
        <li><a href="/" onClick={handleHomeClick}>Home</a></li>
        <li><Link to="/about">About</Link></li>
        <li><a href="#feature-section" onClick={handleScrollToFeatures}>Services</a></li>

        {/* Conditionally show Dashboard link if user is logged in */}
        {isLoggedIn && <li><Link to="/dashboard">Dashboard</Link></li>}

        <li><Link to="/contact" className="navbar-contact-btn">Contact</Link></li>

        {isLoggedIn ? (
          <>
            <li className="welcome-message">Welcome, {user && user.email}</li>
            <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/signup">Signup</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;