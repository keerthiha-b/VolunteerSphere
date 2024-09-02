const mongoose = require('mongoose');
const Activity = require('../Schema/Activity');
const Mission = require('../Schema/Mission');
const UserActivity = require('../Schema/UserActivity'); // Import the UserActivity model

const updateMissionProgress = async (userId, activityId) => {
  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(activityId)) {
    throw new Error('Invalid userId or activityId');
  }

  try {
    // Verify that the activity exists
    const activity = await Activity.findById(activityId).populate('userId');
    if (!activity) {
      throw new Error('Activity not found');
    }

    // Ensure the user is signed up for this activity
    const userActivity = await UserActivity.findOne({ userId, opportunityId: activityId });
    if (!userActivity) {
      throw new Error('User is not signed up for this activity');
    }

    // Fetch all missions with the same category as the activity
    const missions = await Mission.find({ category: activity.category });
    if (!missions.length) {
      throw new Error(`No missions found for category: ${activity.category}`);
    }

    // Update the progress for each mission
    const updates = missions.map(async (mission) => {
      if (mission.goalType === 'hours') {
        mission.progress += parseFloat(activity.duration);
      } else {
        mission.progress += 1;
      }
      return mission.save();
    });

    // Wait for all missions to be updated
    await Promise.all(updates);

    console.log('All related missions updated successfully');
  } catch (error) {
    console.error('Failed to update mission progress:', error);
    throw error;
  }
};

module.exports = { updateMissionProgress };