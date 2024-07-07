const mongoose = require('mongoose')

// Changed schema to reflect user in linkup database
const organizationSchema = new mongoose.Schema({
    username: String,
    password: String,
    organization_name: String,
    email: String
  }, { collection: 'organization' });

const Organization = mongoose.model('Organization', organizationSchema);
module.exports = Organization;