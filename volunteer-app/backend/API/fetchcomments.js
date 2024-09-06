const express = require('express');
const router = express.Router();
const Comment = require('../Schema/Comments');
const UserActivity = require('../Schema/UserActivity');
const Activity = require('../Schema/Activity');

// Assuming you have middleware to get current user's ID (e.g., req.user.id)
router.get('/:opportunityId', async (req, res) => {
  try {
    const { opportunityId } = req.params;
    const userId = req.user.id; // Assuming req.user.id is the logged-in organization user ID

    // Find the activity that belongs to the organization
    const activity = await Activity.findOne({ _id: opportunityId, userId });

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
