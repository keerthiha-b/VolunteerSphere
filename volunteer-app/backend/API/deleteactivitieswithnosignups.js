const mongoose = require('mongoose');
const Activity = require('../Schema/Activity'); // Adjust paths as necessary
const Certificate = require('../Schema/Certificate');
const Comment = require('../Schema/Comments');
const UserActivity = require('../Schema/UserActivity');

async function deleteActivityById(req, res) {
  const { activityId } = req.body; // Get activity ID from the request body
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if the activity has signups in the UserActivity collection
    const signups = await UserActivity.countDocuments({ opportunityId: activityId });

    if (signups > 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: 'Cannot delete activity because it has signups.',
        signupsCount: signups
      });
    }

    // Delete activity and related documents if no signups
    await Activity.deleteOne({ _id: activityId }).session(session);
    await Certificate.deleteMany({ activityId }).session(session);
    await Comment.deleteMany({ userToActivityId: activityId }).session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: 'Activity deleted successfully.' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error deleting activity:', error);
    res.status(500).json({ error: 'Error deleting activity.' });
  }
}

module.exports = { deleteActivityById };
