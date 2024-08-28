
const mongoose = require('mongoose');
const Comment = require('./Schema/Comment'); // Ensure the path to your Comment schema is correct
const UserToActivity = require('./Schema/UserActivity'); // Ensure the path to your UserToActivity schema is correct

const router = express.Router();

// Fetch comments for a specific user activity
router.get('/:userActivityId/comments', async (req, res) => {
  try {
    const { userToActivityId } = req.params;

    // Find comments associated with the specific UserToActivity entry
    const comments = await Comment.find({ userToActivityId: mongoose.Types.ObjectId(userToActivityId) });

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ errorMsg: 'Error fetching comments: ' + error.message });
  }
});

// Add a comment to a specific signup
router.post('/:userActivityId/comments', async (req, res) => {
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

    res.status(200).json({ message: 'Comment added successfully', newComment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ errorMsg: 'Error adding comment: ' + error.message });
  }
});

// Remove a specific signup and associated comments
router.delete('/:userId/:activityId', async (req, res) => {
  try {
    const { userId, activityId } = req.params;

    // Find the UserToActivity document
    const userActivity = await UserToActivity.findOneAndDelete({
      userId: mongoose.Types.ObjectId(userId),
      opportunityId: mongoose.Types.ObjectId(activityId),
    });

    if (!userActivity) {
      return res.status(404).json({ errorMsg: 'Activity not found' });
    }

    // Delete associated comments
    await Comment.deleteMany({ userToActivityId: userActivity._id });

    res.status(200).json({ message: 'Successfully removed the activity and associated comments.' });
  } catch (error) {
    console.error('Error removing activity:', error);
    res.status(500).json({ errorMsg: 'Error removing activity: ' + error.message });
  }
});

module.exports = router;
