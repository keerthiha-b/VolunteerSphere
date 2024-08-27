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
  },
  username: {
    type: String,
    required: true,
  },
}, { collection: 'userToActivity' });

// Create a compound index on userId and opportunityId to ensure uniqueness
userToActivitySchema.index({ userId: 1, opportunityId: 1 }, { unique: true });

const UserToActivity = mongoose.model('UserToActivity', userToActivitySchema);

module.exports = UserToActivity;
