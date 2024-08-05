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
    const { username, password, firstName, lastName, email, userType, orgName } = req.body;

    // Log the incoming request
    console.log('Received new user registration request:', req.body);

    // Hash the password
    const generatedSalt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync(password, generatedSalt);

    let newUser;
    if (userType === 'user') {
      newUser = new User({
        username,
        password: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        email,
        userType,
        level: 0,
        points: 0,
        maxPoints: 1000
      });
    } else if (userType === 'org') {
      newUser = new Organization({
        username,
        password: hashedPassword,
        organization_name: orgName,
        email,
        userType
      });
    } else {
      return res.status(400).json({ errorMsg: "Invalid user type" });
    }

    console.log("hey");
    console.log(newUser);
    await newUser.save();
    console.log('New user/organization registered successfully:', newUser);
    res.status(201).json({ message: 'User/Organization added successfully' });

  } catch (error) {
    console.error('Error adding user/organization:', error);
    res.status(500).json({ errorMsg: 'Error adding user/organization: ' + error.message });
  }
};

app.post('/new-user', newUser);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

module.exports = newUser;
