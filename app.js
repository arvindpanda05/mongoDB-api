require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create an Express app
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Example Schema & Model (students)
const studentSchema = new mongoose.Schema({
  name: String,
  department: String,
  rollNumber: String
});
const Student = mongoose.model('Student', studentSchema);

// GET: Fetch All Students
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// (Optional) POST: Add a New Student
app.post('/api/students', async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.json({ message: 'Student added!', student: newStudent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
