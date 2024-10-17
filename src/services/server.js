import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { OAuth2Client } from 'google-auth-library'; // Google OAuth library

const app = express();

// Google OAuth2 Client
const client = new OAuth2Client('657336769262-3b23jnh2mfan1d92l5q9qkot7fjl5sqn.apps.googleusercontent.com'); // Your Google Client ID

// Middleware
app.use(express.json());

// Apply CORS middleware to handle preflight requests and allow your frontend origin
app.use(cors({
  origin: ['http://localhost:5174'], // Your frontend origin
  credentials: true
}));

// Handle preflight requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5174'); // Frontend origin
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200); // Handle preflight requests
  }

  next();
});

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/nutrisyncDatabase')
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

// Signup Route (Normal signup with email and password)
app.post('/signup', async (req, res) => {
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
    console.error('Signup Error:', error);
    res.status(500).json({ error: 'Error registering user', details: error.message });
  }
});

// Login Route (Normal login with email and password)
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

    const token = jwt.sign({ id: user._id }, 'jwt_secret_key', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Error logging in', details: error.message });
  }
});

// Google Signup Route
app.post('/google-signup', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '657336769262-3b23jnh2mfan1d92l5q9qkot7fjl5sqn.apps.googleusercontent.com' // Google Client ID
    });

    const { name, email, sub: googleId } = ticket.getPayload();

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, googleId });
      await user.save();
    }

    const jwtToken = jwt.sign({ id: user._id }, 'jwt_secret_key', { expiresIn: '1h' });
    res.json({ token: jwtToken });
  } catch (error) {
    console.error('Google Signup Error:', error);
    res.status(500).json({ error: 'Google signup failed', details: error.message });
  }
});

// Google Login Route
app.post('/google-login', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '657336769262-3b23jnh2mfan1d92l5q9qkot7fjl5sqn.apps.googleusercontent.com' // Google Client ID
    });

    const payload = ticket.getPayload();
    const { email, sub: googleId } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const jwtToken = jwt.sign({ id: user._id }, 'jwt_secret_key', { expiresIn: '1h' });
    res.json({ token: jwtToken });
  } catch (error) {
    console.error('Google Login Error:', error);
    res.status(500).json({ error: 'Google login failed', details: error.message });
  }
});

// Middleware for protected routes
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'jwt_secret_key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Profile Route (to return profile data)
app.get('/profile', authMiddleware, async (req, res) => {
  try {
    // Simulating profile check
    res.json({ isProfileComplete: true, message: "Profile loaded successfully" });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Error fetching profile' });
  }
});

// Protected route example
app.get('/dashboard', authMiddleware, (req, res) => {
  res.json({ message: `Welcome to the dashboard, user ${req.user.id}` });
});

// Handle the Google OAuth callback (if needed)
app.get('/auth/google/callback', (req, res) => {
  // Redirect the user to the dashboard or any frontend route you want
  res.redirect('/dashboard');
});

// Start the server
const PORT = process.env.PORT || 5004; // Changed port to avoid conflict
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});