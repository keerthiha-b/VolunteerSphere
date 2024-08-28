const mongoose = require('mongoose');

// Define the Comment schema
const commentSchema = new mongoose.Schema({
  userToActivityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserToActivity', // Reference to the UserToActivity model
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, { collection: 'comments' });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
