const mongoose = require('mongoose');
const Activity = require('../Schema/Activity');
const Mission = require('../Schema/Mission');

exports.updateMissionProgress = async (req, res) => {
  const { userId, activityId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(activityId)) {
    return res.status(400).json({ message: 'Invalid input data' });
  }

  try {
    const activity = await Activity.findById(activityId).populate('userId');
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Check if the user (organization) is authorized for the activity
    if (activity.userId && !activity.userId._id.equals(userId)) {
      return res.status(403).json({ message: 'User not authorized for this activity' });
    }

    // Fetch all missions with the same category as the activity
    const missions = await Mission.find({ category: activity.category });
    if (!missions.length) {
      return res.status(404).json({ message: 'No missions found for category: ' + activity.category });
    }

    // Update the progress for each mission
    const updates = missions.map(async (mission) => {
      if (mission.goalType === 'hours') {
        mission.progress += parseFloat(activity.duration);  // Ensure conversion from duration string to number
      } else {
        mission.progress += 1;
      }
      return mission.save();  // Return the save promise for later use
    });

    // Wait for all missions to be updated
    await Promise.all(updates);

    res.status(200).json({ message: 'All related missions updated successfully' });
  } catch (error) {
    console.error('Failed to update mission progress:', error);
    res.status(500).json({ message: 'Error updating mission progress', error: error.toString() });
  }
};