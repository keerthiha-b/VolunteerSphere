const mongoose = require('mongoose');
const UserActivity = require('../Schema/UserActivity'); // Correct path with exact casing
const User = require('../Schema/User'); // Correct path to the User model
const Activity = require('../Schema/Activity'); // Correct path to the Activity model

const newUserToActivity = async (req, res) => {
  try {
    const { userId, opportunityId } = req.body;

    // Validate incoming request data
    if (!userId || !opportunityId) {
      console.log('Missing userId or opportunityId:', req.body);
      return res.status(400).json({ message: 'userId and opportunityId are required' });
    }

    // Validate that userId and opportunityId are valid ObjectIds
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(opportunityId)) {
      console.log('Invalid userId or opportunityId:', req.body);
      return res.status(400).json({ message: 'Invalid userId or opportunityId' });
    }

    console.log('Fetching user details for userId:', userId);
    const user = await User.findById(new mongoose.Types.ObjectId(userId));
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    const { username } = user; // Extract the username from the user document

    console.log('Fetching activity details for opportunityId:', opportunityId);
    const activity = await Activity.findById(new mongoose.Types.ObjectId(opportunityId));
    if (!activity) {
      console.log('Activity not found:', opportunityId);
      return res.status(404).json({ message: 'Activity not found' });
    }

    const { date, time } = activity; // Extract the date and time from the activity document

    console.log('Checking for overlapping signups for userId:', userId, ' and opportunityId:', opportunityId);
    const overlappingSignup = await UserActivity.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      opportunityId: new mongoose.Types.ObjectId(opportunityId)
    });

    if (overlappingSignup) {
      console.log('User is already signed up for this activity:', req.body);
      return res.status(409).json({ message: 'User is already signed up for this activity' });
    }

    console.log('Creating new UserActivity entry...');
    const newUserToActivityEntry = new UserActivity({
      userId: new mongoose.Types.ObjectId(userId),
      opportunityId: new mongoose.Types.ObjectId(opportunityId),
      username: username, // Store the username in the document
    });

    console.log('Saving new UserActivity entry to the database...');
    await newUserToActivityEntry.save();

    console.log('Successfully signed user up for opportunity', newUserToActivityEntry);
    res.status(201).json({ message: 'Successfully signed user up for opportunity' });

  } catch (error) {
    if (error.code === 11000) { // MongoDB duplicate key error code
      console.error('User already signed up for this activity:', error);
      return res.status(409).json({ message: 'User is already signed up for this activity' });
    }

    console.error('Unexpected Error signing user up for opportunity:', error);
    res.status(500).json({ errorMsg: 'Error signing user up for opportunity: ' + error.message });
  }
};

module.exports = newUserToActivity;
