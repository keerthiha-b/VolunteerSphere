const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userProgressSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  progress: {
    type: Number,
    default: 0
  }
});

const missionSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  goal: {
    type: Number,
    required: true
  },
  userProgresses: [userProgressSchema], // Array of user progress
  points: {
    type: Number,
    required: true
  },
  goalType: {
    type: String, // 'activity' or 'hours'
    required: true
  },
  description: {
    type: String,
    required: true
  },
  expirationDate: {
    type: Date,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const Mission = mongoose.model('Mission', missionSchema);

module.exports = Mission;