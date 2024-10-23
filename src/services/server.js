import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { OAuth2Client } from 'google-auth-library';

// Initialize Express app
const app = express();

// JWT Secret and Google OAuth2 Client
const jwtSecret = 'your_jwt_secret_key'; // Replace with your actual secret
const client = new OAuth2Client('657336769262-3b23jnh2mfan1d92l5q9qkot7fjl5sqn.apps.googleusercontent.com');

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/nutrisyncDatabase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((error) => console.error('MongoDB connection error:', error));

// User Schema and Model
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String },
  googleId: { type: String }
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
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Routes

// Signup Route
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ error: 'Error registering user', details: error.message });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Error logging in', details: error.message });
  }
});

// Save or Update Profile
app.post('/api/save-profile', authMiddleware, async (req, res) => {
  const { dietaryPreferences, allergies, weight, height, bmi, activityLevel, healthConditions, calories, macronutrients, nutritionalGoals } = req.body;

  try {
    let profile = await Profile.findOne({ userId: req.user.id });

    if (profile) {
      // Update existing profile
      Object.assign(profile, { dietaryPreferences, allergies, weight, height, bmi, activityLevel, healthConditions, calories, macronutrients, nutritionalGoals });
      await profile.save();
      return res.status(200).json({ message: 'Profile updated successfully' });
    } else {
      // Create new profile
      profile = new Profile({ userId: req.user.id, dietaryPreferences, allergies, weight, height, bmi, activityLevel, healthConditions, calories, macronutrients, nutritionalGoals });
      await profile.save();
      return res.status(201).json({ message: 'Profile created successfully' });
    }
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ error: 'Error saving profile' });
  }
});

// Fetch Profile
app.get('/api/get-profile', authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Error fetching profile' });
  }
});

// Start the server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));