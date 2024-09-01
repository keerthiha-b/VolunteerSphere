// backend/API/pastadminact.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Activity = require('../Schema/Activity'); // Ensure this is the correct path to your Activity model

// GET /admin/activities/past/:userId - Fetch past activities by user ID
router.get('/past/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate the userId
    if (!userId || userId === 'undefined') {
      console.error('User ID is missing or undefined.');
      return res.status(400).json({ errorMsg: 'User ID is required.' });
    }

    // Check if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error('Invalid userId format:', userId);
      return res.status(400).json({ errorMsg: 'Invalid userId format.' });
    }

    console.log(`Fetching past activities for user ID: ${userId}`);

    // Find past activities that belong to the user
    const pastActivities = await Activity.find({
      userId: mongoose.Types.ObjectId(userId), // Ensure proper ObjectId usage
      userType: 'org',
      date: { $lt: new Date() } // Only fetch activities with a date in the past
    });

    if (pastActivities.length === 0) {
      console.log('No past activities found.');
      return res.status(404).json({ errorMsg: 'No past activities found.' });
    }

    console.log('Past activities retrieved successfully:', pastActivities);
    res.status(200).json(pastActivities);
  } catch (error) {
    console.error('Error fetching past activities:', error.message);
    res.status(500).json({ errorMsg: 'Error fetching past activities: ' + error.message });
  }
});

module.exports = router;
