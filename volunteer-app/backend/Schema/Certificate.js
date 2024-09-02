// models/Certificate.js
const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the student
  activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true }, // Reference to the activity
  certificatePath: { type: String, required: true }, // Path to the generated PDF certificate
  dateGenerated: { type: Date, default: Date.now }, // Date when the certificate was generated
});

module.exports = mongoose.model('Certificate', certificateSchema);
