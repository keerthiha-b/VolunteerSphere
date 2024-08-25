// routes/getactivitymap.js

const express = require('express');
const router = express.Router();
const Activity = require('../Schema/Activity'); // Import the Activity model

// GET /map/activities - Fetch all activities for the map
router.get('/activities', async (req, res) => {
  try {
    const activities = await Activity.find().populate('userId', 'organization_name'); // Fetch all activities and populate organization details
    res.json(activities); // Send the activities in JSON format
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Error fetching activities', error });
  }
});

module.exports = router;
