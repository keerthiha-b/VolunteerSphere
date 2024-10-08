const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  userType: { type: String, required: true, enum: ['user'] },
  avatar: { type: String, required: true },
  level: Number,
  points: Number,
  maxPoints: Number
}, { collection: 'users' });

const User = mongoose.model('User', UserSchema);

module.exports = User;
