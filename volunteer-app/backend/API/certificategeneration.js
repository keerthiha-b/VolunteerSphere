const express = require('express');
const mongoose = require('mongoose');
const Certificate = require('../Schema/Certificate'); // Import the Certificate model
const UserToActivity = mongoose.model('UserActivity'); // Ensure UserActivity is properly defined

const router = express.Router();

// Endpoint to generate a certificate for a signup
router.post('/:signupId', async (req, res) => {
  const { signupId } = req.params;

  try {
    // Fetch the signup details
    const signupDetails = await UserToActivity.findById(signupId)
      .populate({
        path: 'opportunityId',
        select: 'name duration', // Ensure only the required fields are selected
      });

    // Check if signup details are fetched correctly
    if (!signupDetails) {
      return res.status(404).json({ message: 'Signup not found.' });
    }

    // Extract user details directly from signupDetails
    const { firstName, lastName, opportunityId } = signupDetails;

    // Use the names directly from signupDetails
    const studentName = `${firstName} ${lastName}`; 
    const activityName = opportunityId.name || 'Unknown Activity';
    const hoursSpent = opportunityId.duration || 'Unknown Duration';

    // Save certificate details to MongoDB
    const newCertificate = new Certificate({
      studentId: signupDetails.userId,  // Use userId directly from signupDetails
      activityId: opportunityId._id,
      certificateDetails: {
        studentName,
        activityName,
        hoursSpent,
      }
    });

    await newCertificate.save();

    res.status(200).json({ message: 'Certificate generated and saved successfully!', certificate: newCertificate });
  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).json({ message: 'Error generating certificate', error });
  }
});

module.exports = router;
