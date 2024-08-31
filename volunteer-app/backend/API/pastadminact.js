const express = require('express');
const router = express.Router();
const Activity = require('../Schema/Activity'); // Ensure this is the correct path to your Activity model

// Route to fetch past activities by organization ID
router.get('/past/:organizationId', async (req, res) => {
  try {
    const { organizationId } = req.params;

    // Validate the organizationId
    if (!organizationId) {
      return res.status(400).json({ errorMsg: 'Organization ID is required.' });
    }

    // Find activities that belong to the organization and are past
    const pastActivities = await Activity.find({
      userId: organizationId, // The ID of the organization
      userType: 'org', // Ensure it's an organization
      date: { $lt: new Date() }, // Fetch activities with date in the past
    });

    if (pastActivities.length === 0) {
      return res.status(404).json({ errorMsg: 'No past activities found.' });
    }

    res.status(200).json(pastActivities);
  } catch (error) {
    console.error('Error fetching past activities:', error);
    res.status(500).json({ errorMsg: 'Error fetching past activities: ' + error.message });
  }
});

module.exports = router;
