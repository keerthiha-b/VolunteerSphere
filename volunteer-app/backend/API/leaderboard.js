const express = require('express');
const router = express.Router();
const User = require('../Schema/User');

// Endpoint to get leaderboard data
router.get('/leaderboard', async (req, res) => {
  try {
    const { userId } = req.query; // Assuming userId is passed as a query param

    // Fetch top 5 users by points
    const topUsers = await User.find()
      .sort({ points: -1 })
      .limit(5)
      .select('username points');

    // Find the current user's rank
    const currentUser = await User.findById(userId).select('username points');
    const currentUserRank = await User.countDocuments({ points: { $gt: currentUser.points } }) + 1;

    // If the user is in the top 5, no need to add them separately
    const isInTopFive = topUsers.some(user => user._id.toString() === userId);

    res.json({
      topUsers,
      currentUser: !isInTopFive ? { rank: currentUserRank, username: currentUser.username, points: currentUser.points } : null,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).send('Error fetching leaderboard');
  }
});

module.exports = router;
