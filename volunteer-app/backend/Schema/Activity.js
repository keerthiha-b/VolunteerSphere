const mongoose = require('mongoose');
const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  duration: {
    type: String, // Duration as a string, e.g., '1 hr 30 min'
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization', // Reference to the Organization model
    required: true,
  },
  userType: {
    type: String,
    required: true,
    enum: ['org']
  },
}, { collection: 'activities' });

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;