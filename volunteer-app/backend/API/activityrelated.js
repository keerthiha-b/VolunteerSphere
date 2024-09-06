const express = require('express');
const router = express.Router();
const Activity = require('../Schema/Activity');

// Endpoint to handle activity submission
router.post('/', async (req, res) => {
  const { userId, userType, ...activityData } = req.body;
  const activity = new Activity({
    ...activityData,
    userId,
    userType
  });
  try {
    await activity.save();
    res.status(200).send('Activity saved successfully');
  } catch (error) {
    console.error('Error saving activity:', error);
    res.status(500).send('Error saving activity: ' + error.message);
  }
});

// POST /activity - Handle activity posting
router.post('/activity', async (req, res) => {
  const { userId, userType, ...activityData } = req.body;
  const activity = new Activity({
    ...activityData,
    userId,
    userType
  });
  try {
    await activity.save();
    res.status(200).send('Activity posted successfully');
  } catch (error) {
    console.error('Error posting activity:', error);
    res.status(500).send('Error posting activity: ' + error.message);
  }
});

// GET /activities - Fetch all activities
router.get('/', async (req, res) => {
  try {
    const activities = await Activity.find().populate('userId', 'organization_name');
    
    if (!activities.length) {
      return res.status(200).json([]); // Return an empty array if no activities
    }

    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Error fetching activities', error });
  }
});

// GET /activities/:organizationId - Fetch activities by organization ID
router.get('/:organizationId', async (req, res) => {
  try {
    const { organizationId } = req.params;
    const activities = await Activity.find({ userId: organizationId, userType: 'org' });

    if (!activities.length) {
      return res.status(200).json([]); // Return an empty array if no activities
    }

    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities for organization:', error);
    res.status(500).json({ message: 'Error fetching activities for organization', error });
  }
});

module.exports = router;
