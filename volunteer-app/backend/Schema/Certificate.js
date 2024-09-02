// models/Certificate.js
const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the student
  activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true }, // Reference to the activity
  dateGenerated: { type: Date, default: Date.now }, // Date when the certificate was generated
  certificateDetails: {
    studentName: { type: String, required: true }, // Full name of the student
    activityName: { type: String, required: true }, // Name of the activity
    hoursSpent: { type: String, required: true },   // Duration of the activity or contribution
  }
});

module.exports = mongoose.model('Certificate', certificateSchema);
