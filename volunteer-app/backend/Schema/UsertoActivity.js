const mongoose = require('mongoose');

const userToActivitySchema = new mongoose.Schema({
  userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
  opportunityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity', // Reference to the Activity model
    required: true,
  }
}, { collection: 'userToActivity' });

const userToActivity = mongoose.model('userToActivity', userToActivitySchema);

module.exports = userToActivity;