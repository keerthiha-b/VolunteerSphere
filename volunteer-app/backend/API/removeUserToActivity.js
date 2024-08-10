const UserToActivity = require('../Schema/UserToActivity')
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const removeUserToActivity = async (req, res) => {
  try {
    const { userId, opportunityId } = req.body;

    // Log the incoming request
    console.log('Received remove user request:', req.body);

    // Find and remove the document
    const removeResult = await UserToActivity.findOneAndDelete({ userId, opportunityId });

    if (removeResult) {
      console.log('Successfully removed user from opportunity', removeResult);
      res.status(201).json({ message: 'Successfully removed user from opportunity' });
    } else {
      console.log('No record found to remove');
      res.status(404).json({ message: 'No record found to remove' });
    }

  } catch (error) {
    console.error('Error removing user from opportunity:', error);
    res.status(500).json({ errorMsg: 'Error removing user from opportunity: ' + error.message });
  }
};

module.exports = removeUserToActivity;
