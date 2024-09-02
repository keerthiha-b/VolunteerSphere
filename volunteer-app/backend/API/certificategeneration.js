const express = require('express');
const mongoose = require('mongoose');
const Certificate = require('../Schema/Certificate'); // Import the Certificate model
const UserToActivity = mongoose.model('UserActivity');

const router = express.Router();

// Endpoint to generate HTML certificate for a specific signup
router.get('/html/:signupId', async (req, res) => {
  const { signupId } = req.params;

  try {
    // Fetch the signup details
    const signupDetails = await UserToActivity.findById(signupId)
      .populate('userId', 'firstName lastName')
      .populate('opportunityId', 'name duration');

    if (!signupDetails) {
      return res.status(404).json({ message: 'Signup not found.' });
    }

    const { userId, opportunityId } = signupDetails;
    const studentName = `${userId.firstName} ${userId.lastName}`;
    const activityName = opportunityId.name;
    const hoursSpent = opportunityId.duration;

    // Generate HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Certificate of Completion</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; }
          .certificate { border: 5px solid #eee; padding: 20px; margin: 20px; }
          h1 { font-size: 24px; }
          p { font-size: 18px; }
        </style>
      </head>
      <body>
        <div class="certificate">
          <h1>Certificate of Completion</h1>
          <p>This certifies that</p>
          <h2>${studentName}</h2>
          <p>has successfully completed the activity "${activityName}"</p>
          <p>and spent ${hoursSpent} contributing to this cause.</p>
          <p>We appreciate your efforts and dedication.</p>
          <p>Signed by,</p>
          <p>VolunteerSphere Organization</p>
        </div>
      </body>
      </html>
    `;

    // Send HTML content as response
    res.status(200).send(htmlContent);
  } catch (error) {
    console.error('Error generating certificate HTML:', error);
    res.status(500).json({ message: 'Error generating certificate HTML', error });
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
