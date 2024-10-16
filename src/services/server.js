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

// Signup Route
app.post('/signup', [
  check('email').isEmail().withMessage('Valid email is required'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user', details: error.message });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in', details: error.message });
  }
});

// Google Login Route (Signup/Login through Google)
app.post('/google-login', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: googleClientId,
    });

    const { name, email, sub: googleId } = ticket.getPayload();

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, googleId });
      await user.save();
    }

    const jwtToken = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });
    res.json({ token: jwtToken });
  } catch (error) {
    res.status(500).json({ error: 'Google login failed', details: error.message });
  }
});

// Route to check if profile is completed
app.get('/profile', authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    const isProfileComplete = !!profile;

    res.json({ isProfileComplete });
  } catch (error) {
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
      return res.status(201).json({ message: 'Profile created successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error saving profile' });
  }
});

// Start the server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});