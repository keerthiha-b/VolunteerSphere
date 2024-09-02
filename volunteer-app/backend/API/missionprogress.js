const mongoose = require('mongoose');
const Activity = require('../Schema/Activity');
const Mission = require('../Schema/Mission');
const UserActivity = require('../Schema/UserActivity'); // Import the UserActivity model

const updateMissionProgress = async (userId, activityId) => {
  try {
    const activity = await Activity.findById(activityId);
    if (!activity) {
      throw new Error('Activity not found');
    }

    // Assuming we know the mission's category from the activity or another source
    const missions = await Mission.find({ category: activity.category });
    if (missions.length === 0) {
      throw new Error(`No missions found for category: ${activity.category}`);
    }

    // Update progress for each mission that matches the activity's category
    missions.forEach(async (mission) => {
      let userProgress = mission.userProgresses.find(up => up.userId.equals(userId));
      if (userProgress) {
        // Update existing progress
        userProgress.progress += (mission.goalType === 'hours' ? parseFloat(activity.duration) : 1);
      } else {
        // Create new progress entry if not existing
        mission.userProgresses.push({
          userId,
          progress: (mission.goalType === 'hours' ? parseFloat(activity.duration) : 1)
        });
      }
      await mission.save();
    });

    console.log('Mission progress updated successfully for user:', userId);
  } catch (error) {
    console.error('Failed to update mission progress:', error);
    throw error;
  }
};

module.exports = { updateMissionProgress };