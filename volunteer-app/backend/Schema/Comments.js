const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userToActivityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserToActivity', // Reference to UserToActivity model
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
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
