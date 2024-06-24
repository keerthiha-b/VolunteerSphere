const express = require('express');
const mongoose = require('mongoose');

const newUser = require('./API/newUser');
const loginUser = require('./API/loginUser');
const Activity = require('./Schema/Activity');


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

// LOG-IN
// API call to log in user
app.post('/login-user', newUser);

// Endpoint to handle activity submission
app.post('/activities', async (req, res) => {
  const activity = new Activity(req.body);
  try {
    await activity.save();
    res.status(200).send('Activity saved successfully');
  } catch (error) {
    res.status(500).send('Error saving activity');
  }
});
// POST /activity - Handle activity posting
app.post('/activity', async (req, res) => {
  const activity = new Activity(req.body);
  try {
    await activity.save();
    res.status(200).send('Activity posted successfully');
  } catch (error) {
    res.status(500).send('Error posting activity');
  }
});

// GET /activities - Fetch all activities
app.get('/activities', async (req, res) => {
  try {
    const activities = await Activity.find();
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities', error });
  }
});


// Listening on Port 3001
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));