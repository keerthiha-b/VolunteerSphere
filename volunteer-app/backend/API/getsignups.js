const express = require('express');
const router = express.Router();
const UserActivity = require('./Schema/UserActivity'); // Ensure the correct path to your UserActivity model

// Endpoint to fetch signups for a specific activity
router.get('/:activityId/signups', async (req, res) => {
  try {
    const { activityId } = req.params;

    // Fetch the signups for the given activity
    const signups = await UserActivity.find({ opportunityId: activityId });

    if (!signups.length) {
      return res.status(404).json({ message: 'No signups found for this activity.' });
    }

    res.json(signups);
  } catch (error) {
    console.error('Error fetching signups:', error);
    res.status(500).json({ message: 'Error fetching signups', error });
  }
});

module.exports = router;
