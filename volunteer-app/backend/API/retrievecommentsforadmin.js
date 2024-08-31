const express = require('express');
const mongoose = require('mongoose');
const Comment = require('../Schema/Comments'); // Ensure the path and name are correct

const router = express.Router();

// Fetch comments for a specific activity created by a specific organization
router.get('/:activityId', async (req, res) => {
  try {
    const { activityId } = req.params;
    const { orgId } = req.query; // Extract orgId from the query string

    // Validate the ObjectId for activityId and orgId
    if (!mongoose.Types.ObjectId.isValid(activityId) || !mongoose.Types.ObjectId.isValid(orgId)) {
      return res.status(400).json({ errorMsg: 'Invalid activityId or orgId format.' });
    }

    // Fetch comments for a specific activity created by a specific organization
    const comments = await Comment.find({
      userToActivityId: mongoose.Types.ObjectId(activityId),
      createdBy: mongoose.Types.ObjectId(orgId), // Make sure 'createdBy' is part of your schema
    });

    if (comments.length === 0) {
      return res.status(404).json({ errorMsg: 'No comments received yet.' });
    }

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ errorMsg: 'Error fetching comments: ' + error.message });
  }
});

module.exports = router;
