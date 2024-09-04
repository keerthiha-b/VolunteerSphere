const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const UserActivity = require('../models/userActivity');

router.get('/:opportunityId', async (req, res) => {
  try {
    const { opportunityId } = req.params;
    const userActivities = await UserActivity.find({ opportunityId });

    const userToActivityIds = userActivities.map(activity => activity._id);
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
