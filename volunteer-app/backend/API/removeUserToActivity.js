const UserToActivity = require('../Schema/UserToActivity');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const deleteUserToActivity = async (req, res) => {
  try {
    const { userId, opportunityId } = req.body;

    // Log the incoming request
    console.log('Received request to remove user from opportunity:', req.body);

    // Delete the entry based on userId and opportunityId
    const result = await UserToActivity.deleteOne({ userId, opportunityId });

    if (result.deletedCount === 0) {
      console.log('No matching record found for deletion');
      res.status(400).json({ errorMsg: 'No matching record found to delete' });
    }

    console.log('Successfully removed user from opportunity');
    res.status(200).json({ message: 'Successfully removed user from opportunity' });

  } catch (error) {
    console.error('Error removing user from opportunity:', error);
    res.status(500).json({ errorMsg: 'Error removing user from opportunity: ' + error.message });
  }
};

module.exports = deleteUserToActivity;