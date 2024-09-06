const express = require('express');
const router = express.Router();
const Comment = require('../Schema/Comments');
const UserActivity = require('../Schema/UserActivity');
const Activity = require('../Schema/Activity');

// Middleware should provide req.user.id as the logged-in organization ID
router.get('/:opportunityId', async (req, res) => {
  try {
    const { opportunityId } = req.params;
    const orgId = req.user.id; // Assuming this is provided by your authentication middleware

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
