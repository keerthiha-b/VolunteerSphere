const express = require('express');
const mongoose = require('mongoose');
const Activity = require('../Schema/Activity'); // Ensure the path and name are correct

const router = express.Router();

// Fetch past activities created by a specific organization
router.get('/', async (req, res) => {
  try {
    const { orgId } = req.query; // Extract orgId from the query string

    // Validate the ObjectId for orgId
    if (!mongoose.Types.ObjectId.isValid(orgId)) {
      return res.status(400).json({ errorMsg: 'Invalid orgId format.' });
    }

    // Fetch past activities created by the organization
    const pastActivities = await Activity.find({
      createdBy: mongoose.Types.ObjectId(orgId), // Ensure 'createdBy' references the org ID in your schema
      endDate: { $lt: new Date() } // Only fetch activities where endDate is before the current date
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
