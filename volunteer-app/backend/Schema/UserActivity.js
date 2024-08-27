// Schema/UserActivity.js

const mongoose = require('mongoose');

const UserActivitySchema = new mongoose.Schema({
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
UserActivitySchema.index({ userId: 1, opportunityId: 1 }, { unique: true });

const UserActivity = mongoose.model('UserActivity', UserActivitySchema);

module.exports = UserActivity;
