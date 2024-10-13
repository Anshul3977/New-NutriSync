import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/services">Services</Link>
        <Link to="/schedule">Schedule Appointment</Link>
        <Link to="/intake">Complete Intake</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <p>&copy; 2024 NutriSync. All rights reserved.</p>
    </footer>
  );
};

export default Footer;