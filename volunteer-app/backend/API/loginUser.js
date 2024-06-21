const mongoose = require("mongoose");
const User = require("../Schema/User");
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
const loginUser = async (req, res) => {
    try {
      // Using the passed from front-end object
      const passedUser = req.body;
  
      const user = await User.findOne({
        "username": passedUser.username
      });

      const org = await Organization.findOne({
        "username": passedUser.username
      })

      if (!user && !org) {
        return res.status(401).json({errorMsg : "Unable to log in, account is not found or verified"});
      }

      // Compare the provided password with the stored hash
      const isPasswordValid = false;
      if (user) {
        isPasswordValid = bcryptjs.compareSync(passedUser.password, user.password);
      }
      else if (org) {
        isPasswordValid = bcryptjs.compareSync(passedUser.password, org.password);
      }
  
      if (!isPasswordValid) {
        return res.status(401).json({errorMsg : "Unable to log in, password is incorrect"});
      }

      // Send tokens to the frontend
      res.status(200).send('Good to go');
  
    } catch (error) {
      res.status(500).send('Error logging in user: ' + error.message);
    }
  };
  
  module.exports = loginUser;