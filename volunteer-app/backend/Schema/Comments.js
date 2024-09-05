const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userToActivityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserActivity', // Reference to UserActivity model
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  rating: { // New field for star rating
    type: Number,
    min: 1,
    max: 5,
    required: false, // Optional field
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
