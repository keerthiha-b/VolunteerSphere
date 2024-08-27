const UserToActivity = require('../Schema/UsertoActivity')
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const newUserToActivity = async (req, res) => {
  try {
    const { userId, opportunityId } = req.body;

    // Log the incoming request
    console.log('Received new user registration request:', req.body);

    const newUserToActivity = new UserToActivity({
        userId,
        opportunityId
    });

    await newUserToActivity.save();

    console.log('Successfully signed user up for opportunity', newUserToActivity);
    res.status(201).json({ message: 'Successfully signed user up for opportunity' });

  } catch (error) {
    console.error('Error signing user up for opportunity:', error);
    res.status(500).json({ errorMsg: 'Error signing user up for opportunity: ' + error.message });
  }
};

module.exports = newUserToActivity;