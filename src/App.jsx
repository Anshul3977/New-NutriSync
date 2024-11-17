import React, { useState } from 'react';
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
import RecipeForm from './components/MultiStepForm/RecipeForm';
import MealPlanOverview from './components/MealPlanOverview'; 
import GroceryListGenerator from './components/GroceryListGenerator'; 
import NutritionalTracking from './components/NutritionalTracking'; 
import GoalsTracker from './components/GoalsTracker'; 
import RecipeDetails from './components/RecipeDetails'; // Import the new component

// Layout component to conditionally display Navbar
const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/signup'];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      {children}
    </>
  );
};

const App = () => {
  const [mealPlan, setMealPlan] = useState(null); // State to store the meal plan

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
            <Route path="/services" element={<FeatureSection />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/recipe-recommendations" element={<RecipeForm />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} /> {/* New Route */}
            <Route path="/meal-planning" element={<MealPlanOverview setMealPlan={setMealPlan} />} /> 
            <Route path="/grocery-list" element={<GroceryListGenerator mealPlan={mealPlan} />} /> 
            <Route path="/nutritional-tracking" element={<NutritionalTracking />} />
            <Route path="/health-goals" element={<GoalsTracker />} />
          </Routes>
        </Layout>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;