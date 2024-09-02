const express = require('express');
const mongoose = require('mongoose');
const newUser = require('./API/newUser');
const loginUser = require('./API/loginUser');
const activityRouter = require('./API/activityrelated'); // Activity-related routes
const mapRouter = require('./API/getactivitymap'); // Map-related routes
const newUserToActivity = require('./API/newUsertoActivity'); // Corrected API handler import
const leaderboardRouter = require('./API/leaderboard'); 
const signupRoutes = require('./API/getsignups'); // Import the new signupRoutes
const certificateRoutes = require('./API/certificategeneration'); // Import the certificate generation routes
const retrieveCertsRoutes = require('./API/retrievecerts'); // Import the retrieve certificates routes
const cors = require('cors');

// Progress API
const getProgress = require('./API/getProgress');

const app = express();
const PORT = process.env.PORT || 3001; 
const MONGO_DB_URI = process.env.MONGO_DB_URI || "mongodb+srv://Volunteer1:Admin$trator@volunteersphere.5bhk4hh.mongodb.net/?retryWrites=true&w=majority&appName=VolunteerSphere";

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(MONGO_DB_URI, { dbName: "UserTest" })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// SIGN-UP - API call to create a new user
app.post('/new-user', newUser);

// LOG-IN - API call to log in a user
app.post('/login-user', loginUser);

// Activity-related endpoints
app.use('/activities', activityRouter);

// Map-related endpoints
app.use('/api/map', mapRouter);

// PROGRESS
app.post('/get-progress', getProgress);

// Signup activity 
app.post('/signup', newUserToActivity);

// Leaderboard
app.use('/leaderboard', leaderboardRouter);

// Sign-ups route for fetching sign-ups for a specific activity
app.use('/signups', signupRoutes);

// Certificate Generation and Retrieval
app.use('/api/certificates', certificateRoutes); // Use the certificate generation route
app.use('/api/certificates', retrieveCertsRoutes); // Use the retrieve certificates route

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
