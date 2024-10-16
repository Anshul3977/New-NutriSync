import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { OAuth2Client } from 'google-auth-library';
import { check, validationResult } from 'express-validator';

const app = express();

// JWT Secret and Google Client ID
const jwtSecret = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MGE5OTY5NDlmZmMzYjRmNjQ4NDA4NSIsImlhdCI6MTcyOTA3NjkzOSwiZXhwIjoxNzI5MDgwNTM5fQ.rEFRcp6W2Wi07ur8Y8oesa79tM1XfieegaFBy6cDdpY'; // Replace with your actual JWT secret
const googleClientId = '657336769262-3b23jnh2mfan1d92l5q9qkot7fjl5sqn.apps.googleusercontent.com'; // Replace with your Google Client ID

// Google OAuth2 Client
const client = new OAuth2Client(googleClientId);

// Middleware
app.use(express.json());
app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/nutrisyncDatabase')
  .then(() => console.log('MongoDB connected successfully'))
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit if connection fails
  });

// User Schema and Model
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String },
  googleId: { type: String },
});

const User = mongoose.model('User', UserSchema);

// Profile Schema and Model
const ProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dietaryPreferences: { type: String },
  allergies: { type: String },
  weight: { type: Number },
  height: { type: Number },
  bmi: { type: Number },
  activityLevel: { type: String },
  healthConditions: { type: String },
  calories: { type: Number },
  macronutrients: { type: String },
  nutritionalGoals: { type: String },
});

const Profile = mongoose.model('Profile', ProfileSchema);

// Middleware for protected routes
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Route to check if profile is completed
app.get('/profile', authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    const isProfileComplete = !!profile;

    if (profile) {
      console.log('Profile found:', profile); // Add logging to see if the profile exists
    } else {
      console.log('No profile found for user:', req.user.id); // Add logging for debugging
    }

    res.json({ isProfileComplete });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Error fetching profile' });
  }
});

// Route to create or update profile
app.post('/complete-profile', authMiddleware, async (req, res) => {
  const { dietaryPreferences, allergies, weight, height, bmi, activityLevel, healthConditions, calories, macronutrients, nutritionalGoals } = req.body;

  try {
    const existingProfile = await Profile.findOne({ userId: req.user.id });

    if (existingProfile) {
      existingProfile.dietaryPreferences = dietaryPreferences;
      existingProfile.allergies = allergies;
      existingProfile.weight = weight;
      existingProfile.height = height;
      existingProfile.bmi = bmi;
      existingProfile.activityLevel = activityLevel;
      existingProfile.healthConditions = healthConditions;
      existingProfile.calories = calories;
      existingProfile.macronutrients = macronutrients;
      existingProfile.nutritionalGoals = nutritionalGoals;

      await existingProfile.save();
      console.log('Profile updated successfully:', existingProfile);
      return res.status(200).json({ message: 'Profile updated successfully' });
    } else {
      const newProfile = new Profile({
        userId: req.user.id,
        dietaryPreferences,
        allergies,
        weight,
        height,
        bmi,
        activityLevel,
        healthConditions,
        calories,
        macronutrients,
        nutritionalGoals,
      });

      await newProfile.save();
      console.log('Profile created successfully:', newProfile);
      return res.status(201).json({ message: 'Profile created successfully' });
    }
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ error: 'Error saving profile' });
  }
});

// Start the server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});