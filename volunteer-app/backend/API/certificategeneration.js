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
        path: 'userId',
        select: 'firstName lastName', // Ensure only the required fields are selected
      })
      .populate({
        path: 'opportunityId',
        select: 'name duration', // Ensure only the required fields are selected
      });

    // Check if signup details are fetched correctly
    if (!signupDetails) {
      return res.status(404).json({ message: 'Signup not found.' });
    }

    // Extract user and opportunity details
    const { userId, opportunityId } = signupDetails;

    if (!userId || !opportunityId) {
      return res.status(400).json({ message: 'User or opportunity details not found.' });
    }

    const studentName = `${userId.firstName || 'First'} ${userId.lastName || 'Last'}`;
    const activityName = opportunityId.name || 'Unknown Activity';
    const hoursSpent = opportunityId.duration || 'Unknown Duration';

    // Save certificate details to MongoDB
    const newCertificate = new Certificate({
      studentId: userId._id,
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

// Endpoint to get all certificates for a student
router.get('/student/:studentId', async (req, res) => {
  const { studentId } = req.params;

  // Validate that studentId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({ message: 'Invalid student ID.' });
  }

  try {
    // Fetch all certificates for the given studentId
    const certificates = await Certificate.find({ studentId }).populate('activityId', 'name');

    // If no certificates are found, return a 404 status
    if (!certificates.length) {
      return res.status(404).json({ message: 'No certificates found for this student.' });
    }

    // Return the certificates with a 200 status
    res.status(200).json(certificates);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ message: 'Error fetching certificates', error });
  }
});

module.exports = router;
