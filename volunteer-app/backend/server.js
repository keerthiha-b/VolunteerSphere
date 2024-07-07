const express = require('express');
const mongoose = require('mongoose');
const newUser = require('./API/newUser');
const loginUser = require('./API/loginUser');
const Activity = require('./Schema/Activity');
const cors = require('cors');

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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
