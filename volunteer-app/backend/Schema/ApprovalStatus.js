const mongoose = require('mongoose');

const ApprovalStatusSchema = new mongoose.Schema({
  userActivityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserActivity', // Reference to the UserActivity model
    required: true,
  },
  status: {
    type: String,
    enum: ['approved', 'declined'],
    required: true,
  },
  certificateUrl: {
    type: String,
  },
  certificateGenerated: {
    type: Boolean,
    default: false,
  },
}, { collection: 'approvalStatuses' });

const ApprovalStatus = mongoose.model('ApprovalStatus', ApprovalStatusSchema);

module.exports = ApprovalStatus;
