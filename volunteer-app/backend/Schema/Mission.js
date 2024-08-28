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
    type: Number,
    required: true
  },
  goalType: {
    type: String, // Either 'activity' or 'hours'
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const Mission = mongoose.model('Mission', missionSchema);

module.exports = Mission;