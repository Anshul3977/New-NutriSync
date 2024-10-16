import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeatureSection from './components/FeatureSection';
import AboutSection from './components/AboutSection';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import RecipeForm from './components/MultiStepForm/RecipeForm'; // Use RecipeForm for recipe recommendations

// Layout component to conditionally display Navbar
const Layout = ({ children }) => {
  const location = useLocation();

  // Hide Navbar for Login and Signup routes
  const hideNavbarRoutes = ['/login', '/signup'];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      {children}
    </>
  );
};

const App = () => {
  return (
    <GoogleOAuthProvider clientId="657336769262-3b23jnh2mfan1d92l5q9qkot7fjl5sqn.apps.googleusercontent.com">
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={
              <>
                <HeroSection />
                <AboutSection />
                <FeatureSection />
                <ContactForm />
                <Footer />
              </>
            } />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<FeatureSection />} /> {/* Services points to features */}
            <Route path="/contact" element={<Contact />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} /> 
            <Route path="/recipe-recommendations" element={<RecipeForm />} /> {/* Recipe Recommendations page */}
          </Routes>
        </Layout>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;