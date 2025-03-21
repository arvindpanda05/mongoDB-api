require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();

// 1. PORT & MONGO_URI from environment variables or fallback
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/chatgpt';

// 2. Middlewares
app.use(cors());
app.use(bodyParser.json());

// 3. Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// 4. Define User Schema & Model
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  dob: Date,
  password: String,
});

const User = mongoose.model('user', userSchema);

// 5. Register Route
app.post('/register', async (req, res) => {
  const { firstName, lastName, username, email, dob, password } = req.body;
  
  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ error: 'Email already in use' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = new User({
    firstName,
    lastName,
    username,
    email,
    dob,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user', details: error.message });
  }
});

// 6. Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return res.status(200).json({ message: 'Login successful' });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to login' });
  }
});

// 7. Optional Test Route
app.get('/', (req, res) => {
  res.send('Hello from your Node.js server!');
});

// 8. Start the Server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
