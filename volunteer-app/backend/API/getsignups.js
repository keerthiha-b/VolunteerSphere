const express = require('express');
const router = express.Router();
const UserActivity = require('../models/UserActivity'); // Ensure the correct path to your UserActivity model

// Route to fetch sign-ups for a specific activity
router.get('/:activityId', async (req, res) => {
  try {
    const { activityId } = req.params;

    // Fetch the sign-ups directly from the UserActivity model
    const signups = await UserActivity.find({ opportunityId: activityId });

    if (!signups.length) {
      return res.status(404).json({ message: 'No signups found for this activity.' });
    }

    res.json(signups); // Directly send the fetched sign-ups
  } catch (error) {
    console.error('Error fetching signups:', error);
    res.status(500).json({ message: 'Error fetching signups', error });
  }
});

module.exports = router;
