const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Add this to handle ObjectId
const Comment = require('../Schema/Comments');
const UserActivity = require('../Schema/UserActivity');
const Activity = require('../Schema/Activity');

router.get('/:opportunityId', async (req, res) => {
  try {
    const { opportunityId } = req.params;

    // Debugging: Log req.user to check if it's being populated correctly
    console.log('req.user:', req.user);

    // Check if req.user is populated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: No user data found' });
    }

    // Convert userId to MongoDB ObjectId
    const orgId = mongoose.Types.ObjectId(req.user.id); // Convert to ObjectId

    // Find the activity to ensure it belongs to the logged-in organization
    const activity = await Activity.findOne({ _id: opportunityId, userId: orgId });

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found or not authorized' });
    }

    // Find the UserActivity entries related to this activity
    const userActivities = await UserActivity.find({ opportunityId: activity._id });

    const userToActivityIds = userActivities.map(activity => activity._id);

    // Fetch comments based on UserActivity references
    const comments = await Comment.find({ userToActivityId: { $in: userToActivityIds } })
      .populate('userToActivityId')
      .exec();

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Error fetching comments', error });
  }
});

module.exports = router;
