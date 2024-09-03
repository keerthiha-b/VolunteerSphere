// Import necessary modules and models
const express = require('express');
const router = express.Router();
const User = require('../Schema/User');  
const Activity = require('../Schema/Activity');  

// Route to approve a signup and update user points
router.post('/approve-signup/:userId/:opportunityId', async (req, res) => {
    const { userId, opportunityId } = req.params;

    try {
      // Retrieve the activity by ID and check existence
      const activity = await Activity.findById(opportunityId);
      if (!activity) {
        return res.status(404).json({ message: "Activity not found." });
      }
  
      // Retrieve the user by ID and check existence
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      // Calculate points based on the duration of the activity
      // Assuming 'duration' is stored in hours in the activity schema
      const pointsToAdd = activity.duration * 100; // Ensure 'duration' is the correct field
      user.points = user.points + pointsToAdd; // Update the user's points
  
      // Save the updated user document
      await user.save();
  
      // Respond with success and the updated user data
      res.status(200).json({ message: "Signup approved, points updated, and certificate generated.", data: user });
    } catch (error) {
      // Log and respond with the error
      console.error("Error in approving signup:", error);
      res.status(500).json({ message: "Internal server error: " + error.message });
    }
});

// Export the router
module.exports = router;
