const express = require('express');
const mongoose = require('mongoose');
const UserActivity = require('../Schema/UserActivity'); // Ensure this path is correct.

const router = express.Router();

// Endpoint to decline a signup
router.patch('/:signupId', async (req, res) => {
  const { signupId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(signupId)) {
    return res.status(400).json({ errorMsg: 'Invalid signup ID format.' });
  }

  try {
    const result = await UserActivity.findByIdAndUpdate(
      signupId,
      { status: 'declined' }, // Assuming there's a 'status' field in the UserActivity model
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ errorMsg: 'Signup not found or already declined.' });
    }

    res.status(200).json({ message: 'Signup successfully declined.', data: result });
  } catch (error) {
    console.error('Error declining signup:', error);
    res.status(500).json({ errorMsg: 'Server error when trying to decline signup.' });
  }
});

module.exports = router;
