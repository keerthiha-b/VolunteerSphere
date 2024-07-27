const User = require('../Schema/User');
const Organization = require('../Schema/Organization');
const express = require('express');
const cors = require('cors');
const bcryptjs = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

const newUser = async (req, res) => {
  try {
    const passedUser = req.body;
    const isOrg = passedUser.isOrg;

    // Log the incoming request
    console.log('Received new user registration request:', passedUser);

    // Hash the password
    const generatedSalt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync(passedUser.password, generatedSalt);

    if (!isOrg) {
      const newUser = new User({
        username: passedUser.username,
        password: hashedPassword,
        first_name: passedUser.firstName,
        last_name: passedUser.lastName,
        email: passedUser.email,
        userType: 'user'
      });

      await newUser.save();
      console.log('New user registered successfully:', newUser);
    } else {
      const newOrg = new Organization({
        username: passedUser.username,
        password: hashedPassword,
        organization_name: passedUser.orgName,
        email: passedUser.email,
        userType: 'org'
      });

      await newOrg.save();
      console.log('New organization registered successfully:', newOrg);
    }

    res.status(201).send('User/Organization added successfully');
  } catch (error) {
    console.error('Error adding user/organization:', error);
    res.status(500).send('Error adding user/organization: ' + error.message);
  }
};

app.post('/new-user', newUser);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

module.exports = newUser;
