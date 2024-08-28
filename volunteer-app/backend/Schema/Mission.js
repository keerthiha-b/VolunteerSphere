const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  goal: {
    type: Number, // Total number of activities or hours to complete
    required: true
  },
  progress: {
    type: Number, // Track progress towards goal
    default: 0
  },
  points: {
    type: Number, // Total points awarded upon completion
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
    type: Date, // Date after which the mission expires
    required: true
  },
  completed: {
    type: Boolean,
    default: false // Marks if the mission has been completed
  }
});

const Mission = mongoose.model('Mission', missionSchema);

module.exports = Mission;