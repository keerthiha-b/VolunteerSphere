// Import necessary modules and models
const express = require('express');
const router = express.Router();
const User = require('../Schema/User');  
const Activity = require('../Schema/Activity');  

// Function to convert duration string to hours (e.g., "1 hr" to 1, "1.5 hrs" to 1.5)
const parseDuration = (durationStr) => {
    if (!durationStr) return NaN;

    // Use regular expressions to find hours and minutes in the string
    const hoursMatch = durationStr.match(/(\d+(?:\.\d+)?)\s*hr|hour/i);

    let hours = 0;

    if (hoursMatch) {
        hours = parseFloat(hoursMatch[1]);
    }

    return hours; // Return total duration in hours
};

// Route to approve a signup and update user points
router.post('/:userId/:opportunityId', async (req, res) => {
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

        // Parse duration if it's a string like "1 hr"
        let durationInHours;
        if (typeof activity.duration === 'string') {
            durationInHours = parseDuration(activity.duration);
            if (isNaN(durationInHours)) {
                return res.status(400).json({ message: "Invalid activity duration format." });
            }
        } else if (typeof activity.duration === 'number') {
            durationInHours = activity.duration; // If already a number, use it directly
        } else {
            return res.status(400).json({ message: "Invalid activity duration type." });
        }

        // Calculate points based on the duration of the activity
        const pointsToAdd = durationInHours * 100; // Calculate points based on hours
        user.points += pointsToAdd; // Update the user's points

        // LEVELLING ALGORITHM
        const levelMultiplier = 1.25;
        const multiplierAdditive = Math.min(0.5 * (user.level + 1), 2); // Limit multiplier additive

        if (user.points >= user.maxPoints) {
            user.points -= user.maxPoints; // Deduct max points and carry forward the remainder
            user.level += 1;
            user.maxPoints *= (levelMultiplier + multiplierAdditive); // Update maxPoints for next level
        }

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
