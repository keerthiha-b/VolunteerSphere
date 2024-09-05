const express = require('express');
const mongoose = require('mongoose');
const UserActivity = require('../Schema/UserActivity'); // Ensure the path and name are correct
const Activity = require('../Schema/Activity');

const router = express.Router();

// Fetch user activities for a specific user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    console.log(`Fetching activities for userId: ${userId}`); // Debugging line

    // Validate if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ errorMsg: 'Invalid userId format.' });
    }

    // Fetch user activities for the given userId
    const user_activities = await UserActivity.find({ userId: new mongoose.Types.ObjectId(userId) }).populate('opportunityId');

    if (!user_activities.length) {
      console.log('No activities found for this user.');
      return res.status(404).json({ errorMsg: 'No activities found for this user.' });
    }

    // Extract the opportunity IDs from the user activities
    const opportunityIds = user_activities.map(activity => activity.opportunityId);

    // Query the Activity collection to ensure all opportunityIds exist
    const existingActivities = await Activity.find({ _id: { $in: opportunityIds } });

    // Convert existingActivities to a Set of IDs for easier lookup
    const existingActivityIds = new Set(existingActivities.map(activity => activity._id.toString()));

    // Filter user_activities to only include those with valid opportunities
    const validActivities = user_activities.filter(activity => existingActivityIds.has(activity.opportunityId.toString()));

    if (!validActivities.length) {
      console.log('No valid activities found for this user.');
      return res.status(404).json({ errorMsg: 'No valid activities found for this user.' });
    }

    res.status(200).json(validActivities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ errorMsg: 'Error fetching activities: ' + error.message });
  }
});

module.exports = router;


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
