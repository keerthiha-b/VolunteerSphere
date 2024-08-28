const express = require('express');
const mongoose = require('mongoose');
const UserActivity = require('../Schema/UserActivity'); // Ensure the path and name are correct

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
    const activities = await UserActivity.find({ userId: new mongoose.Types.ObjectId(userId) }).populate('opportunityId');

    if (!activities.length) {
      console.log('No activities found for this user.');
      return res.status(404).json({ errorMsg: 'No activities found for this user.' });
    }

    res.status(200).json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ errorMsg: 'Error fetching activities: ' + error.message });
  }
});

module.exports = router;
