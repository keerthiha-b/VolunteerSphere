const express = require('express');
const router = express.Router();
const Mission = require('../Schema/Mission');
const User = require('../Schema/User');

router.post('/api/missions/complete', async (req, res) => {
  const { userId, missionId } = req.body;

  try {
    const mission = await Mission.findById(missionId);
    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user points
    user.points += mission.points;

    // LEVELLING ALGORITHM
    const levelMultiplier = 1.25;
    const multiplierAdditive = Math.min(0.5 * (user.level + 1), 2); // Limit multiplier additive

    if (user.points >= user.maxPoints) {
        user.points -= user.maxPoints; // Deduct max points and carry forward the remainder
        user.level += 1;
        user.maxPoints *= (levelMultiplier + multiplierAdditive); // Update maxPoints for next level
    }

    await user.save();

    // Update mission completion status
    // Here, we assume that the mission is completed for the first time
    mission.completed = true; // You might want to adjust this logic based on your needs
    await mission.save();

    res.status(200).json({
      message: 'Mission completed and points updated successfully',
      points: user.points,
      completedMissions: mission.title
    });
  } catch (error) {
    console.error('Failed to complete mission and update points:', error);
    res.status(500).json({ message: 'Error updating mission and user points' });
  }
});

module.exports = router;
