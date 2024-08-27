const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const UserToActivity = require('../Schema/UsertoActivity'); // Ensure the path is correct

const app = express();
app.use(cors());
app.use(express.json());

const newUserToActivity = async (req, res) => {
  try {
    const { userId, opportunityId } = req.body;

    // Validate incoming request data
    if (!userId || !opportunityId) {
      console.log('Missing userId or opportunityId:', req.body);
      return res.status(400).json({ message: 'userId and opportunityId are required' });
    }

    // Log the incoming request
    console.log('Received new user registration request:', req.body);

    // Create new instance of UserToActivity
    const newUserToActivityEntry = new UserToActivity({
        userId: mongoose.Types.ObjectId(userId), // Ensure these are ObjectIds
        opportunityId: mongoose.Types.ObjectId(opportunityId)
    });

    // Save to database
    await newUserToActivityEntry.save();

    console.log('Successfully signed user up for opportunity', newUserToActivityEntry);
    res.status(201).json({ message: 'Successfully signed user up for opportunity' });

  } catch (error) {
    console.error('Error signing user up for opportunity:', error);
    res.status(500).json({ errorMsg: 'Error signing user up for opportunity: ' + error.message });
  }
};

module.exports = newUserToActivity;
