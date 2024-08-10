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
    unique: true // Since we only want users to sign up to an activity once
  }
}, { collection: 'userToActivity' });

const userToActivity = mongoose.model('userToActivity', userToActivitySchema);

module.exports = userToActivity;