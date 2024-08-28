// commentRoutes.js

const express = require('express');
const mongoose = require('mongoose');
const Comment = require('../Schema/Comments'); // Ensure the path and name are correct
const UserActivity = require('../Schema/UserActivity'); // Ensure the path and name are correct

const router = express.Router();

// Fetch comments for a specific user activity
router.get('/:userToActivityId', async (req, res) => {
  try {
    const { userToActivityId } = req.params;

    console.log(`Fetching comments for userToActivityId: ${userToActivityId}`); // Debugging line

    // Validate if userToActivityId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userToActivityId)) {
      return res.status(400).json({ errorMsg: 'Invalid userToActivityId format.' });
    }

    // Correctly use 'new' with ObjectId
    const comments = await Comment.find({ userToActivityId: new mongoose.Types.ObjectId(userToActivityId) });

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ errorMsg: 'Error fetching comments: ' + error.message });
  }
});

// Add a comment to a specific signup
router.post('/:userToActivityId', async (req, res) => {
  try {
    const { userToActivityId } = req.params;
    const { text } = req.body;

    // Validate if userToActivityId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userToActivityId)) {
      return res.status(400).json({ errorMsg: 'Invalid userToActivityId format.' });
    }

    if (!text) {
      return res.status(400).json({ errorMsg: 'Comment text is required.' });
    }

    // Correctly use 'new' with ObjectId
    const newComment = new Comment({
      userToActivityId: new mongoose.Types.ObjectId(userToActivityId),
      text,
    });

    await newComment.save();

    res.status(201).json({ message: 'Comment added successfully', newComment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ errorMsg: 'Error adding comment: ' + error.message });
  }
});

module.exports = router;
