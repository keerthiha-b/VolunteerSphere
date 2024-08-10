const express = require('express');
const mongoose = require('mongoose');
const newUser = require('./API/newUser');
const loginUser = require('./API/loginUser');
const Activity = require('./Schema/Activity');

const newUserToActivity = require('./API/newUserToActivity');
const removeUserToActivity = require('./API/removeUserToActivity');

const activityrouter = require('./API/activityrelated');
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
app.use('/activities',activityrouter);

// SIGN-UP FOR ACTIVITY / OPPORTUNITY
app.post('/sign-up-opportunity', newUserToActivity);
app.post('/remove-signed-up-opportunity')

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
