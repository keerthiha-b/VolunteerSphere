const express = require('express');
const mongoose = require('mongoose');
const newUser = require('./API/newUser');
const cors = require('cors');

const MONGO_DB = "mongodb+srv://Volunteer1:Admin$trator@volunteersphere.5bhk4hh.mongodb.net/?retryWrites=true&w=majority&appName=VolunteerSphere";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(MONGO_DB, {dbName: "UserTest"})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// SIGN-UP
// API call to create new object
app.post('/new-user', newUser);

// Listening on Port 3001
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));