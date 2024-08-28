const express = require('express');
const mongoose = require('mongoose');
const Comment = require('../Schema/Comments'); // Adjust the path as necessary
const UserActivity = require('../Schema/UserActivity'); // Adjust the path as necessary

const router = express.Router();

// Fetch comments for a specific user activity
router.get('/:userToActivityId/comments', async (req, res) => {
  try {
    const { userToActivityId } = req.params;

    console.log(`Fetching comments for userToActivityId: ${userToActivityId}`); // Debugging line

    // Find comments associated with the specific UserActivity entry
    const comments = await Comment.find({ userToActivityId: mongoose.Types.ObjectId(userToActivityId) });

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ errorMsg: 'Error fetching comments: ' + error.message });
  }
});

// Add a comment to a specific signup
router.post('/:userToActivityId/comments', async (req, res) => {
  try {
    const { userToActivityId } = req.params;
    const { text } = req.body;

    // Create a new comment
    const newComment = new Comment({
      userToActivityId: mongoose.Types.ObjectId(userToActivityId),
      text,
    });

    // Save the comment to the database
    await newComment.save();

    res.status(201).json({ message: 'Comment added successfully', newComment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ errorMsg: 'Error adding comment: ' + error.message });
  }
});

module.exports = router;
