const express = require('express');
const router = express.Router();
const UserActivity = require('../Schema/UserActivity'); // Correct path to your UserActivity model

// Route to fetch sign-ups for a specific activity by activityId
router.get('/:activityId', async (req, res) => {
  try {
    const { activityId } = req.params;

    console.log('Fetching sign-ups for activity ID:', activityId);

    // Fetch the sign-ups directly from the userToActivity collection via the UserActivity model
    const signups = await UserActivity.find({ opportunityId: activityId }); // Query based on the activity ID

    console.log('Fetched sign-ups:', signups);

    if (!signups.length) {
      return res.status(404).json({ message: 'No signups found for this activity.' });
    }

    res.json(signups);
  } catch (error) {
    console.error('Error fetching signups:', error.message);
    res.status(500).json({ message: 'Error fetching signups', error: error.message });
  }
});

module.exports = router;
