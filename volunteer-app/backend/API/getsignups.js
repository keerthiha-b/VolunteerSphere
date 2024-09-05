const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const UserActivity = require('../Schema/UserActivity'); // Ensure the correct path to your UserActivity model

// Route to fetch sign-ups for a specific activity by activityId
router.get('/:activityId', async (req, res) => {
  try {
    const { activityId } = req.params;

    console.log('Received request to fetch sign-ups for activity ID:', activityId);

    // Check if activityId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(activityId)) {
      console.error('Invalid activity ID format:', activityId);
      return res.status(400).json({ message: 'Invalid activity ID format.' });
    }

    // Fetch the sign-ups directly from the userToActivity collection via the UserActivity model
    const signups = await UserActivity.find({ opportunityId: activityId });

    console.log('Fetched sign-ups:', signups);

    if (!signups.length) {
      // Instead of 404, return an empty array or a message with 200 status
      return res.status(200).json([]); // You could also return: res.status(200).json({ message: 'No signups found for this activity.' });
    }

    res.json(signups);
  } catch (error) {
    console.error('Error fetching signups:', error.message);
    res.status(500).json({ message: 'Error fetching signups', error: error.message });
  }
});

module.exports = router;
