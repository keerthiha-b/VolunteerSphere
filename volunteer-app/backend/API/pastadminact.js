const express = require('express');
const router = express.Router();
const Activity = require('../Schema/Activity'); // Ensure the path and name are correct

// New route: GET /activities/past/:organizationId - Fetch past activities by organization ID
router.get('/past/:organizationId', async (req, res) => {
  try {
    const { organizationId } = req.params;
    const activities = await Activity.find({
      userId: organizationId,
      userType: 'org',
      endDate: { $lt: new Date() }, // Filter past activities based on endDate
    });
    res.json(activities);
  } catch (error) {
    console.error('Error fetching past activities for organization:', error);
    res.status(500).json({ message: 'Error fetching past activities for organization', error });
  }
});

module.exports = router;
