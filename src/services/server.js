import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';

// Initialize Express app
const app = express();

// JWT Secret
const jwtSecret = 'f216ee95ddd98602405d64601dfaa28d9b74593159750d95de212d76fb6a76beb79b239594d9c543d0b052a389151336fea635547ac0d3a42c4d5137f936d109';

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
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; // Attach the decoded user data to the request object
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

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
    console.error('Signup Error:', error.message);
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
    console.error('Login Error:', error.message);
    res.status(500).json({ error: 'Error logging in', details: error.message });
  }
});

// Save or Update Profile Route
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
    console.error('Error saving profile:', error.message);
    res.status(500).json({ error: 'Error saving profile' });
  }
});

// Fetch Profile Route
app.get('/api/get-profile', authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    res.status(500).json({ error: 'Error fetching profile' });
  }
});

// Start the server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));