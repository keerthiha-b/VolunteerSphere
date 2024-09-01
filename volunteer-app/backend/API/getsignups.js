const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const UserActivity = require('../Schema/UserActivity'); // Correct path to your UserActivity model

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
      console.log('No signups found for the given activity ID.');
      return res.status(404).json({ message: 'No signups found for this activity.' });
    }

    res.json(signups);
  } catch (error) {
    console.error('Error fetching signups:', error.message); // Log the specific error message
    console.error('Stack trace:', error.stack); // Log the stack trace for more details
    res.status(500).json({ message: 'Error fetching signups', error: error.message });
  }
});

module.exports = router;
