const User = require('../Schema/User');
const Organization = require('../Schema/Organization');
const express = require('express');
const cors = require('cors');

// Bcrypt for hashing
const bcryptjs = require('bcryptjs');

// Middleware
const app = express();
app.use(cors());
app.use(express.json());

// API call to create new object
const newUser = async (req, res) => {
    try {
      // Using the passed from front-end object
      const passedUser = req.body;
      const isOrg = passedUser.isOrg;
  
      // Hashing the password
      var generatedSalt = bcryptjs.genSaltSync(10);
      var hashedPassword = bcryptjs.hashSync(passedUser.password, generatedSalt);
  
      if(!isOrg) {
        const newUser = new User({
          username: passedUser.username,
          password: hashedPassword,
          first_name: passedUser.firstName,
          last_name: passedUser.lastName,
          email: passedUser.email
        })

        await newUser.save();
      }
      else 
      {
        const newOrg = new Organization({
          username: passedUser.username,
          password: hashedPassword,
          organization_name: passedUser.orgName,
          email: passedUser.email
        })

        await newOrg.save();
      }
      // sendEmailVerification({passedEmail: passedUser.email}, res);
      res.status(200).send('Email sent added successfully');
  
  
    } catch (error) {
      res.status(500).send('Error adding User: ' + error.message);
    }
  };
  
  module.exports = newUser;