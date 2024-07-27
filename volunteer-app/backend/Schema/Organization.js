const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  organization_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  userType: { type: String, required: true, enum: ['org'] },  // userType is 'org'
}, { collection: 'organizations' });

const Organization = mongoose.model('Organization', OrganizationSchema);

module.exports = Organization;
