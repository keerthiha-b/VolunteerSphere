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

const missionsApi = require('./API/missions');
const categoriesApi = require('./API/categories');

// Progress API

const cors = require('cors');
const commentRoutes = require('./API/commentRoutes');
const fetchSignedUpActivities = require('./API/fetchactivity');
const commentsforadmins = require('./API/fetchcomments'); // Admin-specific comments handler
const getProgress = require('./API/getProgress');
const Decline = require('./API/decline');
const approve = require('./API/approve-points');
const cors = require('cors');


// Avatar API
const getAvatar = require('./API/getAvatar');
const setAvatar = require('./API/setAvatar');


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

app.use('/comments', commentRoutes);
app.use('/user-activities', fetchSignedUpActivities);

// General comment routes
app.use('/comments', commentRoutes);

// Admin-specific comment routes
app.use('/admin/comments', commentsforadmins);

// Fetch signed-up activities
app.use('/user-activities', fetchSignedUpActivities);

// PROGRESS
app.post('/get-progress', getProgress);

// Signup activity 
app.post('/signup', newUserToActivity);

// Sign-ups route for fetching sign-ups for a specific activity


// Certificate Generation and Retrieval
app.use('/api/generate-certificate', certificateRoutes); // Use the certificate generation route

app.use('/api/decline-signup',Decline);

app.use ('/api/approve-signup',approve);

app.use('/signups', signupRoutes); // Ensure this line is added to use the signup route
// Leaderboard activity
app.use('/leaderboard', leaderboardRouter);

// missions
app.use('/api', missionsApi);

// categories
app.use('/api/categories', categoriesApi);

// AVATARS
app.post('/get-avatar', getAvatar);
app.post('/set-avatar', setAvatar);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
