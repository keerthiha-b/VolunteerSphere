// routes/certificateRoutes.js
const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Certificate = require('../Schema/Certificate'); // Import the Certificate model
const UserToActivity = mongoose.model('UserActivity'); // Assuming your signup collection is named userToActivity

const router = express.Router();

// Endpoint to generate a PDF certificate
router.post('/:signupId', async (req, res) => {
  const { signupId } = req.params;

  try {
    // Fetch the signup details using the signupId from your userToActivity collection
    const signupDetails = await UserToActivity.findById(signupId).populate('userId', 'firstName lastName').populate('opportunityId', 'name duration');

    if (!signupDetails) {
      return res.status(404).json({ message: 'Signup not found.' });
    }

    // Extract necessary details from signupDetails
    const { userId, opportunityId } = signupDetails;
    const studentName = `${userId.firstName} ${userId.lastName}`;
    const activityName = opportunityId.name;
    const hoursSpent = opportunityId.duration; // Assuming duration is stored as a string like '3 hours'

    // Create a new PDF document
    const doc = new PDFDocument();

    // Define the output file path for the PDF
    const outputDir = path.join(__dirname, '../certificates');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir); // Ensure the certificates directory exists
    }
    const outputPath = path.join(outputDir, `${signupId}-certificate.pdf`);

    // Pipe the PDF into a writable stream
    doc.pipe(fs.createWriteStream(outputPath));

    // Add content to the PDF
    doc
      .fontSize(26)
      .text('Certificate of Completion', { align: 'center' })
      .moveDown();

    doc
      .fontSize(20)
      .text(`This certifies that ${studentName}`, { align: 'center' })
      .moveDown();

    doc
      .fontSize(16)
      .text(`has successfully completed the activity "${activityName}"`, { align: 'center' })
      .text(`and spent ${hoursSpent} contributing to this cause.`, { align: 'center' })
      .moveDown();

    doc
      .fontSize(14)
      .text(`We appreciate your efforts and dedication.`, { align: 'center' })
      .moveDown(2);

    doc
      .fontSize(16)
      .text(`Signed by,`, { align: 'left' })
      .text(`VolunteerSphere Organization`, { align: 'left' });

    // Finalize the PDF and end the stream
    doc.end();

    // Save certificate details to MongoDB
    const newCertificate = new Certificate({
      studentId: userId._id,
      activityId: opportunityId._id,
      certificatePath: outputPath,
    });

    await newCertificate.save();

    // Send response back to the client
    res.status(200).json({ message: 'Certificate generated and saved successfully!', certificate: newCertificate });
  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).json({ message: 'Error generating certificate', error });
  }
});

module.exports = router;
