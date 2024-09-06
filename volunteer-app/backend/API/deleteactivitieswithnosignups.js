const mongoose = require('mongoose');
const Activity = require('../Schema/Activity'); // Adjust paths as necessary
//const Certificate = require('../Schema/Certificate');
const Comment = require('../Schema/Comments');
const UserActivity = require('../Schema/UserActivity');

async function deleteActivityById(req, res) {
    const { activityId } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const signups = await UserActivity.countDocuments({ opportunityId: activityId });
  
      if (signups > 0) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: 'Cannot delete activity because there are signups.',
          signupsCount: signups,
        });
      }
  
      await Activity.deleteOne({ _id: activityId }).session(session);
      //await Certificate.deleteMany({ activityId }).session(session);
      await Comment.deleteMany({ userToActivityId: activityId }).session(session);
  
      await session.commitTransaction();
      session.endSession();
  
      res.status(200).json({ message: 'Activity deleted successfully.' });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error('Error deleting activity', error);
      res.status(500).json({ error: 'Error deleting activity.' });
    }
  }
  

module.exports = deleteActivityById;
