const mongoose = require('mongoose')

// Changed schema to reflect user in linkup database
const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    first_name: String,
    last_name: String,
    email: String
  }, { collection: 'user' });

const User = mongoose.model('User', UserSchema);
module.exports = User;