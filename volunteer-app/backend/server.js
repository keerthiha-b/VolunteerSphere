const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import API route handlers
const newUser = require('./API/newUser');
const loginUser = require('./API/loginUser');
const activityRouter = require('./API/activityrelated');
const mapRouter = require('./API/getactivitymap');
const newUserToActivity = require('./API/newUsertoActivity');
const commentRoutes = require('./API/commentRoutes');
const fetchSignedUpActivities = require('./API/fetchactivity');
const fetchPastActivities = require('./API/pastactivityadmin'); // Corrected import
const fetchCommentsForAdmin = require('./API/retrievecommentsforadmin'); // Corrected import
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

// Comment-related endpoints
app.use('/comments', commentRoutes);

// Fetch signed-up activities
app.use('/user-activities', fetchSignedUpActivities);

// Fetch past activities for the admin
app.use('/admin/past-activities', fetchPastActivities);

// Fetch comments for admin view (for a specific activity and org)
app.use('/admin/comments', fetchCommentsForAdmin);

// PROGRESS
app.post('/get-progress', getProgress);

// Signup activity
app.post('/signup', newUserToActivity);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
