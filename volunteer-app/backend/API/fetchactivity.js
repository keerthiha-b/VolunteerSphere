const express = require('express');
const mongoose = require('mongoose');
const UserActivity = require('../Schema/UserActivity'); // Ensure the path and name are correct

const router = express.Router();

// Fetch user activities for a specific user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    console.log(`Fetching activities for userId: ${userId}`);

    // Validate if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ errorMsg: 'Invalid userId format.' });
    }

    // Fetch user activities for the given userId
    const activities = await UserActivity.find({ userId: new mongoose.Types.ObjectId(userId) }).populate('opportunityId');

    if (!activities.length) {
      console.log('No activities found for this user.');
      // Return a 200 status with an empty array to indicate no activities found
      return res.status(200).json([]); 
    }

    // Return the activities if found
    res.status(200).json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ errorMsg: 'Error fetching activities: ' + error.message });
  }
});

// Unenroll a user from an activity
router.delete('/:userId/:activityId', async (req, res) => {
  try {
    const { userId, activityId } = req.params;

    // Validate the ObjectIds
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(activityId)) {
      return res.status(400).json({ errorMsg: 'Invalid userId or activityId format.' });
    }

    // Find and delete the UserActivity document
    const userActivity = await UserActivity.findOneAndDelete({
      userId: new mongoose.Types.ObjectId(userId),
      opportunityId: new mongoose.Types.ObjectId(activityId),
    });

    if (!userActivity) {
      return res.status(404).json({ errorMsg: 'Activity not found or user is not enrolled.' });
    }

    res.status(200).json({ message: 'Successfully unenrolled from the activity.' });
  } catch (error) {
    console.error('Error unenrolling from activity:', error);
    res.status(500).json({ errorMsg: 'Error unenrolling from activity: ' + error.message });
  }
});

module.exports = router;
