const express = require('express');
const router = express.Router();
const Comment = require('../Schema/Comments');
const UserActivity = require('../Schema/UserActivity');
const Activity = require('../Schema/Activity');

router.get('/:opportunityId', async (req, res) => {
  try {
    const { opportunityId } = req.params;
    const { userId } = req.query; // Get userId (organization ID) from the frontend request

    // Find the activity belonging to the organization, and ensure it is a past activity
    const activity = await Activity.findOne({
      _id: opportunityId,
      userId, // Matches organization
      date: { $lt: new Date() } // Only fetch past activities
    });

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found, unauthorized, or is in the future' });
    }

    // Find UserActivity records linked to this activity
    const userActivities = await UserActivity.find({ opportunityId: activity._id });

    const userToActivityIds = userActivities.map(ua => ua._id);

    // Fetch comments linked to those UserActivity records
    const comments = await Comment.find({ userToActivityId: { $in: userToActivityIds } })
      .populate('userToActivityId') // Populates user info for the comments
      .exec();

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Error fetching comments', error });
  }
});

module.exports = router;
